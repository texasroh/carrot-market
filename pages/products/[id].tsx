import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import { Product, User } from "@prisma/client";
import Link from "next/link";
import useUser from "@libs/client/useUser";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import Image from "next/image";
import client from "@libs/server/client";

interface ProductWithUser extends Product {
  user: User;
}

interface IProductDetailResponse {
  ok: boolean;
  // product: Product & {
  //     user: {
  //         name: string;
  //         avatar: string;
  //     };
  // };
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: Boolean;
}

const ItemDetail: NextPage<IProductDetailResponse> = ({
  product,
  relatedProducts,
  isLiked,
}) => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { mutate: unboundMutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<IProductDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav, { loading }] = useMutation(
    `/api/products/${router.query.id}/fav`
  );
  const onFavClick = () => {
    if (!data || loading) return;
    toggleFav({});
    boundMutate({ ...data, isLiked: !data.isLiked }, false);
    // boundMutate(
    //     (prev) => prev && { ...prev, isLiked: !prev.isLiked },
    //     false
    // );
    // unboundMutate(
    //     "/api/users/me",
    //     (prev: any) => ({ ok: !prev.ok }),
    //     false
    // );
  };

  return (
    <Layout canGoBack>
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="relative -z-10 aspect-square">
            <Image
              layout="fill"
              src={`https://imagedelivery.net/asdfqwe/${product.image}/public`}
              className="bg-slate-300 object-contain"
            />
          </div>
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
            <Image
              width={48}
              height={48}
              quality={20}
              src={`https://imagedelivery.net/asdfqwe/${product.user.avatar}/avatar`}
              className="h-12 w-12 rounded-full bg-slate-300"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {product?.user.name}
              </p>
              <Link href={`/users/profiles/${product?.userId}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {product?.name}
            </h1>
            <span className="mt-3 block text-2xl text-gray-900">
              ${product?.price}
            </span>
            <p className=" my-6 text-gray-700">{product?.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button
                onClick={onFavClick}
                className={cls(
                  "flex items-center justify-center rounded-md p-3 ",
                  isLiked
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                )}
              >
                {isLiked ? (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {relatedProducts?.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <a>
                  <div>
                    <div className="mb-4 h-56 w-full bg-slate-300" />
                    <h3 className="-mb-1 text-gray-700">{product.name}</h3>
                    <span className="text-sm font-medium text-gray-900">
                      ${product.price}
                    </span>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx.params?.id) {
    return {
      props: {},
    };
  }
  const product = await client.product.findUnique({
    where: {
      id: +ctx.params.id.toString(),
    },
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
        },
      },
      // favorites: {
      //     where: {
      //         userId: req.session.user?.id,
      //     },
      //     select: {
      //         id: true,
      //     },
      // },
    },
  });
  const terms = product?.name
    .split(" ")
    .map((word) => ({ name: { contains: word } }));

  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
    take: 4,
  });
  const isLiked = false;
  // const isLiked = Boolean(
  //   await client.favorite.findFirst({
  //     where: {
  //       productId: product?.id,
  //       userId: user?.id,
  //     },
  //     select: { id: true },
  //   })
  // );
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      isLiked,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
