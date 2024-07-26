import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

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
                    New Order
                </h2>
            }
        >
            <Head title="NewOrder" />

            <NewOrder
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
                <Box padding="6" boxShadow="lg" bg="white">
                    <SkeletonCircle size="10" />
                    <SkeletonText
                        mt="4"
                        noOfLines={4}
                        spacing="4"
                        skeletonHeight="2"
                    />
                </Box>
            )}
        </AuthenticatedLayout>
    );
}

export default MainNewOrderGroceries;
