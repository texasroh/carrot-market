import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useMutation from "@libs/client/useMutation";

interface IEditProfileForm {
    name?: string;
    email?: string;
    phone?: string;
    formError?: string;
}

interface IEditProfileResponse {
    ok: boolean;
    error?: string;
}

const EditProfile: NextPage = () => {
    const { user } = useUser();
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<IEditProfileForm>();
    useEffect(() => {
        if (user?.name) setValue("name", user.name);
        if (user?.email) setValue("email", user.email);
        if (user?.phone) setValue("phone", user.phone);
    }, [user]);
    const [editProfile, { data, loading }] =
        useMutation<IEditProfileResponse>("/api/users/me");
    const onValid = ({ email, phone, name }: IEditProfileForm) => {
        if (loading) return;
        if (email === "" && phone === "" && name === "") {
            return setError("formError", {
                message:
                    "Email or Phone number is required. You need to choose one.",
            });
        }
        editProfile({
            email, //: email !== user?.email ? email : "",
            phone, //: phone !== user?.phone ? phone : "",
            name,
        });
    };
    useEffect(() => {
        if (data && !data.ok && data.error) {
            setError("formError", { message: data.error });
        }
    }, [data]);
    return (
        <Layout canGoBack title="Edit Profile">
            <form
                onSubmit={handleSubmit(onValid)}
                className="space-y-4 py-10 px-4"
            >
                <div className="flex items-center space-x-3">
                    <div className="h-14 w-14 rounded-full bg-slate-500" />
                    <label
                        htmlFor="picture"
                        className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        Change
                        <input
                            id="picture"
                            type="file"
                            className="hidden"
                            accept="image/*"
                        />
                    </label>
                </div>
                <Input
                    register={register("name")}
                    label="Name"
                    name="name"
                    type="text"
                />
                <Input
                    register={register("email")}
                    label="Email address"
                    name="email"
                    type="email"
                />
                <Input
                    register={register("phone")}
                    label="Phone number"
                    name="phone"
                    type="number"
                    kind="phone"
                />
                {errors.formError ? (
                    <button
                        type="button"
                        onClick={() => clearErrors("formError")}
                        className="my-2 mx-auto block text-center text-xs font-medium text-red-500"
                    >
                        {errors.formError.message}
                    </button>
                ) : (
                    <Button text={loading ? "Loading..." : "Update profile"} />
                )}
            </form>
        </Layout>
    );
};

export default EditProfile;
