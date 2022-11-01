import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface IUserResponse {
    ok: boolean;
    profile: User;
}

export default function useUser() {
    const { data, error, isValidating, mutate } =
        useSWR<IUserResponse>("/api/users/me");

    const router = useRouter();
    useEffect(() => {
        if (!isValidating && data && !data.ok) {
            router.replace("/enter");
        }
    }, [data, router, isValidating]);

    return { user: data?.profile, isLoading: isValidating };
}
