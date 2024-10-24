import { Button } from "@chakra-ui/react";
import { Link, Head } from "@inertiajs/react";
import { VscAccount } from "react-icons/vsc";
import { FiLogIn } from "react-icons/fi";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    background: "linear-gradient(to bottom, #F0E68C, #FF8C00)",
                    flexDirection: "column",
                    textAlign: "center",
                }}
            >
                <img
                    src="images/EducoLogo.png"
                    alt="Logo"
                    style={{
                        height: "50%",
                        width: "auto",
                        marginBottom: "50px", // Distance between image and links
                    }}
                />

                <div>
                    {auth.user ? (
                        <Link
                            href={route("dashboard")}
                            className="block rounded-md bg-orange-500 px-3 py-2 text-white ring-1 ring-transparent transition hover:bg-orange-400 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route("login")}
                                className="flex items-center block rounded-md bg-orange-500 px-3 py-2 text-white ring-1 ring-transparent transition hover:bg-orange-400 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                            >
                                <FiLogIn className="mr-2" />
                                Log in
                            </Link>

                            {/*
                            <Link
                                href={route('register')}
    className="block rounded-md bg-orange-500 px-3 py-2 text-white ring-1 ring-transparent transition hover:bg-orange-400 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white">
                                Register
                            </Link>
                            */}
                        </>
                    )}
                </div>

                <footer className="py-8 text-center text-sm text-black dark:text-white/70">
                    Laravel v{laravelVersion} (PHP v{phpVersion})
                </footer>
            </div>
        </>
    );
}
