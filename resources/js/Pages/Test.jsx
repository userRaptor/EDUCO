import React from "react";

import { Inertia } from "@inertiajs/inertia";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";


function Test({ auth }) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Überschrift: Test
                </h2>
            }
        >
            <Head title="Testing" />

            <div className="py-2 mt-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Welcome, {auth.user.name}!
                        </div>

                        <div style={{ margin: '20px' }}>
                            Something
                        </div>                        
                    </div>
                </div>
            </div>

            <div className="py-2 mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Welcome, {auth.user.name}!
                        </div>
                        
                        <div style={{ margin: '20px' }}>
                            Something
                        </div>                        
                    </div>
                </div>
            </div>


        </AuthenticatedLayout>
    );
}

export default Test;
