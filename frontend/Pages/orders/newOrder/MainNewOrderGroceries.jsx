import React from "react";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NewOrder from "./NewOrder";
import AvailableGroceries from "./AvailableGroceries";
import MyOrderDetailView from "./MyOrderDetailView";
import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

function MainNewOrderGroceries({ auth }) {
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
                    NEW ORDER:
                </h2>
            }
        >
            <Head title="NewOrder" />

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

export default MainNewOrderGroceries;
