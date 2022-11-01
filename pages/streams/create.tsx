import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";

interface IStreamForm {
    name: string;
    price: number;
    description: string;
}

interface IStreamResponse {
    ok: boolean;
    stream: Stream;
}

const Create: NextPage = () => {
    const router = useRouter();
    const [createStream, { data, loading }] =
        useMutation<IStreamResponse>("/api/streams");
    const { register, handleSubmit } = useForm<IStreamForm>();
    const onValid = (data: IStreamForm) => {
        if (loading) return;
        createStream(data);
    };
    useEffect(() => {
        if (data && data.ok) {
            router.replace(`/streams/${data.stream.id}`);
        }
    }, [data]);
    return (
        <Layout canGoBack title="Go Live">
            <form
                className=" space-y-4 py-10 px-4"
                onSubmit={handleSubmit(onValid)}
            >
                <Input
                    register={register("name", { required: true })}
                    required
                    label="Name"
                    name="name"
                    type="text"
                />
                <Input
                    register={register("price", {
                        required: true,
                        valueAsNumber: true,
                    })}
                    required
                    label="Price"
                    name="price"
                    type="text"
                    kind="price"
                />
                <TextArea
                    register={register("description", { required: true })}
                    name="description"
                    label="Description"
                />
                <Button text={loading ? "Loading..." : "Go live"} />
            </form>
        </Layout>
    );
};

export default Create;
