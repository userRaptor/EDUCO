import React from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";




function Test({ auth }) {

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Testing" />

            Hello from Testfile

            
        </AuthenticatedLayout>
    );
}

export default Test;
