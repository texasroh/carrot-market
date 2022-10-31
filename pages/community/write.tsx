import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import useCoords from "@libs/client/useCoords";

interface IWriteForm {
    question: string;
}

interface IWriteResponse {
    ok: boolean;
    post: Post;
}

const Write: NextPage = () => {
    const { latitude, longitude } = useCoords();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IWriteForm>();
    const [post, { loading, data }] = useMutation<IWriteResponse>("/api/posts");
    const onValid = (data: IWriteForm) => {
        if (loading) return;
        post({ ...data, latitude, longitude });
    };
    useEffect(() => {
        if (data && data.ok) {
            router.replace(`/community/${data.post.id}`);
        }
    }, [data, router]);
    return (
        <Layout canGoBack title="Write Post">
            <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
                {errors ? (
                    <span className="font-medium text-red-600">
                        {errors.question?.message}
                    </span>
                ) : null}
                <TextArea
                    register={register("question", {
                        required: true,
                        minLength: {
                            message: "Minimum length is 5",
                            value: 5,
                        },
                    })}
                    required
                    placeholder="Ask a question!"
                />
                <Button text={loading ? "Loading" : "Submit"} />
            </form>
        </Layout>
    );
};

export default Write;
