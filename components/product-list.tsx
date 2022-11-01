import { ProductWithFavCount } from "pages";
import useSWR from "swr";
import Item from "./item";

interface ProductListProps {
    kind: "favorites" | "sales" | "purchases";
}

interface IRecord {
    id: number;
    product: ProductWithFavCount;
}

interface IProductListResponse {
    [key: string]: IRecord[];
}

export default function ProductList({ kind }: ProductListProps) {
    const { data } = useSWR<IProductListResponse>(`/api/users/me/${kind}`);
    return data ? (
        <>
            {data[kind]?.map((record) => (
                <Item
                    id={record.product.id}
                    key={record.id}
                    title={record.product.name}
                    price={record.product.price}
                    // comments={1}
                    hearts={record.product._count.favorites}
                />
            ))}
        </>
    ) : null;
}
