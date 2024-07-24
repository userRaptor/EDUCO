import React from "react";

import Header from "../../../Header";
import NewOrder from "./NewOrder";
import AvailableGroceries from "./AvailableGroceries";
import MyOrderDetailView from "./MyOrderDetailView";
import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

function MainNewOrderGroceries() {
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
        <div>
            <Header title="New Order" />
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
        </div>
    );
}

export default MainNewOrderGroceries;
