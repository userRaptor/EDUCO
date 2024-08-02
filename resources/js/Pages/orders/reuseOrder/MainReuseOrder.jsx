import React, { useEffect } from "react";

import CopyGroceries from "./CopyGroceries";

import NewOrder from "../newOrder/NewOrder";
import MyOrderDetailView from "../newOrder/MyOrderDetailView";
import AvailableGroceries from "../newOrder/AvailableGroceries";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { Box, SkeletonCircle, SkeletonText , Text} from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";

import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MainReuseOrder({ auth }) {
    const parsePageId = (path) => path.substring(path.lastIndexOf('/') + 1) // Get last part of URL path
    const orderId = parsePageId(window.location.pathname)        // Get last part of URL path

    const [orderAlreadyExists, setOrderAlreadyExists] = React.useState(false);
    const [actualOrderId, setActualOrderId] = React.useState("");
    const [booleanUpdateGroceriesOrder, setBooleanUpdateGroceriesOrder] =
        React.useState(false);

    const handleOrderAlreadyExists = () => {
        setOrderAlreadyExists(true);
    };

    const handleActualOrderId = (actualOrderIdFromChild) => {
        setActualOrderId(actualOrderIdFromChild);
    };

    const updateGroceriesOrder = () => {
        setBooleanUpdateGroceriesOrder(!booleanUpdateGroceriesOrder);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    REUSE ORDER: <ArrowRightIcon /> ID: {orderId}
                </h2>
            }
        >
            <Head title="Reuse Order" />

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />

            <NewOrder
                auth={auth}
                setOrderAlreadyExistsToParent={handleOrderAlreadyExists}
                setActualOrderIdToParent={handleActualOrderId}
            />

            {orderAlreadyExists ? (
                <div>
                    <CopyGroceries
                        toCopyOrderId={orderId}
                        actualOrderId={actualOrderId}
                    />

                    <MyOrderDetailView
                        orderId={actualOrderId}
                        booleanUpdateGroceriesOrder={
                            booleanUpdateGroceriesOrder
                        }
                    />

                    <AvailableGroceries
                        orderId={actualOrderId}
                        setBooleanUpdateGroceriesOrder={updateGroceriesOrder}
                    />
                </div>
            ) : (
                <div className="py-2 mt-0">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div style={{ margin: "20px" }}>
                                <Box padding="6" boxShadow="lg" bg="white">
                                    <SkeletonCircle size="10" />
                                    <SkeletonText
                                        mt="4"
                                        noOfLines={4}
                                        spacing="4"
                                        skeletonHeight="2"
                                    />
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

export default MainReuseOrder;
