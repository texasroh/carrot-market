import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import {
    Message as MessageType,
    Stream as StreamType,
    User,
} from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { userInfo } from "os";
import useUser from "@libs/client/useUser";
import { useEffect } from "react";

interface IExtendedMessage extends MessageType {
    user: User;
}

interface IExtendedStream extends StreamType {
    messages: IExtendedMessage[];
}

interface IStreamResponse {
    ok: boolean;
    stream?: IExtendedStream;
}

interface IMessageForm {
    message: string;
}

const Stream: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const { register, handleSubmit, reset } = useForm<IMessageForm>();
    const { data, mutate } = useSWR<IStreamResponse>(
        router.query.id ? `/api/streams/${router.query.id}` : null,
        {
            refreshInterval: 1000,
        }
    );
    const [sendMessage, { data: sendMessageData, loading }] = useMutation(
        `/api/streams/${router.query.id}/messages`
    );
    const onValid = (data: IMessageForm) => {
        if (loading) return;
        reset();
        mutate(
            (prev) =>
                prev &&
                ({
                    ...prev,
                    stream: {
                        ...prev.stream,
                        messages: [
                            ...prev.stream!.messages,
                            {
                                id: Date.now(),
                                message: data.message,
                                user: {
                                    avatar: user?.avatar,
                                    id: user?.id,
                                },
                            },
                        ],
                    },
                } as any),
            false
        );
        mutate((prev) => {
            console.log(prev);
            return prev;
        }, false);
        // sendMessage(data);
    };
    // 아래는 매번 fetching 하는것.
    // useEffect(() => {
    //   if (sendMessageData && sendMessageData.ok) {
    //     mutate();
    //   }
    // }, [sendMessageData, mutate]);
    return (
        <Layout canGoBack>
            <div className="space-y-4 py-10  px-4">
                <div className="aspect-video w-full rounded-md bg-slate-300 shadow-sm" />
                <div className="mt-5">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {data?.stream?.name}
                    </h1>
                    <span className="mt-3 block text-2xl text-gray-900">
                        ${data?.stream?.price}
                    </span>
                    <p className=" my-6 text-gray-700">
                        {data?.stream?.description}
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Live Chat
                    </h2>
                    <div className="h-[50vh] space-y-4 overflow-y-scroll py-10  px-4 pb-16">
                        {data?.stream?.messages.map((message) => (
                            <Message
                                key={message.id}
                                message={message.message}
                                reversed={message.user.id === user?.id}
                            />
                        ))}
                    </div>
                    <div className="fixed inset-x-0 bottom-0  bg-white py-2">
                        <form
                            onSubmit={handleSubmit(onValid)}
                            className="relative mx-auto flex w-full  max-w-md items-center"
                        >
                            <input
                                {...register("message", { required: true })}
                                type="text"
                                className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                            />
                            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                                <button className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                                    &rarr;
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Stream;
