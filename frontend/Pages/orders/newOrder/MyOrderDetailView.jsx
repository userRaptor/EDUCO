import React from "react";
import { Inertia } from "@inertiajs/inertia";

import { useState, useRef } from "react";
import { useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Center } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";

import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from "@chakra-ui/react";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";

import axios from "axios";

function MyOrderDetailView({ orderId, booleanUpdateGroceriesOrder }) {
    const [groceriesOrders, setGroceriesOrders] = useState([]);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const fetchGroceriesOrders = () => {
        axios
            .get(`/api/groceries_order/${orderId}`)
            .then((response) => {
                setGroceriesOrders(response.data);
            })
            .catch((error) => {
                console.log(error.response?.data || error.message);
                console.log(error);
            });
    };

    const navigateMyOrders = () => {
        window.location.href = "/myorders";
    };

    const navigateNewOrder = () => {
        window.location.reload();
    };

    const deleteGroceriesOrderById = (groceriesOrder) => {
        axios
            .delete(`/api/groceries_order/${groceriesOrder.id}`)
            .then((response) => {
                fetchGroceriesOrders();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchGroceriesOrders();
    }, [booleanUpdateGroceriesOrder]);

    return (
        <div>
            <div className="py-2 mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div style={{ margin: "20px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: "40px",
                                    margin: "30px",
                                }}
                            >
                                <Text fontSize="md" style={{ color: "grey" }}>
                                    OrderID: {orderId}
                                </Text>

                                <Button colorScheme="blue" onClick={onOpen}>
                                    View OrderDetails
                                </Button>

                                <Button
                                    backgroundColor="#FFA500"
                                    onClick={navigateNewOrder}
                                >
                                    New Order
                                </Button>

                                <Button
                                    backgroundColor="#FFA500"
                                    onClick={navigateMyOrders}
                                >
                                    Navigate MyOrders
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="80%">
                    <ModalHeader>
                        Included Groceries in the order: {orderId}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <TableContainer>
                            <Table variant="striped" colorScheme="teal">
                                <TableCaption>
                                    Groceries included in the order
                                </TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>Product Name:</Th>
                                        <Th>Quantity:</Th>
                                        <Th>Unit:</Th>
                                        <Th>Comment:</Th>
                                        <Th>Remove:</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {groceriesOrders.map((order) => (
                                        <Tr key={order.id}>
                                            <Td>{order.groceries.name}</Td>
                                            <Td>{order.quantity}</Td>
                                            <Td>{order.groceries.unit}</Td>
                                            <Td>{order.comment}</Td>
                                            <Td>
                                                <Button
                                                    colorScheme="red"
                                                    onClick={() => deleteGroceriesOrderById(order)}
                                                >
                                                    <Center>
                                                        <DeleteIcon />
                                                    </Center>
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/**Trennlinie Waagerecht*/}
            <div style={{ borderTop: "5px solid orange", h: "100%" }} />{" "}
        </div>
    );
}

export default MyOrderDetailView;
