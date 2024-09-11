import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {


    return (
        <>
            <Head title="Welcome" />

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',  // Volle Höhe des Viewports
                backgroundColor: 'gray',
                flexDirection: 'column', // Stellt sicher, dass die Kinder (Bild und Links) untereinander angeordnet werden
                textAlign: 'center', // Zentriert den Text
            }}>
                <img
                    src="images/EducoLogo.png"
                    alt="Logo"
                    style={{
                        height: '50%',  
                        width: 'auto',
                        marginBottom: '20px', // Abstand zwischen Bild und Links
                    }}
                />
                
                <div>
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="block rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="block rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="block rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                    Laravel v{laravelVersion} (PHP v{phpVersion})
                </footer>

            </div>
        </>
    );
}
