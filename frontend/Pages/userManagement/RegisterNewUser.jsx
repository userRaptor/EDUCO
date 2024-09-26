import { useEffect } from "react";
import InputError from "../../Components/InputError";
import InputLabel from "../../Components/InputLabel";
import PrimaryButton from "../../Components/PrimaryButton";
import TextInput from "../../Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button, Text } from "@chakra-ui/react";

export default function Register({ onUserRegistered }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "user",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        axios
            .post("/api/register", data)
            .then((response) => {
                if (onUserRegistered) onUserRegistered();
                successAlert("User registered successfully!");
            })
            .catch((error) => {
                if (error.response && error.response.status === 409) {
                    errorAlert(
                        error.response.data.message
                    );
                } else {
                    errorAlert(
                        error.response.data.message
                    );
                    console.log(error);
                }
            });
    };

    const successAlert = (infoSuccess) => {
        toast.success(infoSuccess, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };

    const errorAlert = (infoError) => {
        toast.error(infoError, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
      };

    return (
        <div>
           

            <Text fontSize="xl" style={{ marginBottom: "10px" }}>
                Register new user:
            </Text>

            <form onSubmit={submit}>
                <div className="flex flex-wrap -mx-2">
                    <div className="w-full sm:w-1/3 px-2 mb-4">
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="w-full sm:w-1/3 px-2 mb-4">
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="w-full sm:w-1/3 px-2 mb-4">
                        <InputLabel htmlFor="role" value="Role" />
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            className="mt-1 block w-full"
                            style={{ borderRadius: "7px" }}
                            onChange={(e) => {
                                setData("role", e.target.value);
                            }}
                            required
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <InputError message={errors.role} className="mt-2" />
                    </div>
                </div>

                <div className="flex flex-wrap -mx-2">
                    <div className="w-full sm:w-1/2 px-2 mb-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="w-full sm:w-1/2 px-2 mb-4">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-start mt-4">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
