import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Header from '../../../Header';
import CopyGroceries from './CopyGroceries';

import NewOrder from '../newOrder/NewOrder';
import MyOrderDetailView from '../newOrder/MyOrderDetailView';
import AvailableGroceries from '../newOrder/AvailableGroceries';

import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";


function MainReuseOrder(){
    const { orderId } = useParams();

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
            <Header title="Reuse Order" />
            
            <NewOrder
                setOrderAlreadyExistsToParent={handleOrderAlreadyExists}
                setActualOrderIdToParent={handleActualOrderId}
            />

            {orderAlreadyExists ? (
                <div>
                    <CopyGroceries toCopyOrderId={orderId} actualOrderId={actualOrderId}/>

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
    )
}

export default MainReuseOrder;