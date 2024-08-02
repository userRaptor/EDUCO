import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from '@inertiajs/react';
import axios from 'axios'; 


import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { useState } from "react";

import { useEffect } from "react";
import { ToastContainer, Bounce } from "react-toastify";
import { toast } from "react-toastify";
import { Button, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { Box, Flex } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import DetailViewOrder from "../allOrders/DetailViewOrder";
import 'react-toastify/dist/ReactToastify.css';

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

function MyOrders({ auth }) {
    const [searchByPurpose, setSearchByPurpose] = React.useState("");
    const [orders, setOrders] = useState([]);

    const [currentPage, setCurrentPage] = useState(1); // Pagination
    const itemsPerPage = 10; // Pagination
    
    const getOrdersById = (userId) => {
        axios
            .get(`/api/orders/${userId}`)
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    

    const deleteOrderById = (order) => {
        if (window.confirm("Are you sure to delete the order with ID " + order.id + " ? \nYou can't undo this action afterwards.")) {
            axios
                .delete(`/api/orders/${order.id}`)
                .then((response) => {
                    getOrdersById(auth.user.id); 
                    successAlert(`Order ${order.id} has been deleted successfully!`);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const deleteAllOrders = () => {
        if (window.confirm("Are you sure to delete all orders? \nYou can't undo this action afterwards.")) {
            axios
                .delete("/api/orders")
                .then((response) => {
                    getOrdersById(auth.user.id);
                    successAlert("All orders have been deleted successfully!");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const navigateToReuseOrder = (orderId) => {
        Inertia.visit(`/reuseorder/${orderId}`);
        // navigate(`/reuseorder/${orderId}`);
    };

    const successAlert = (infoSuccess) => {
        toast.success(infoSuccess, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };

    const filteredOrders = orders.filter((order) =>
        order.purpose.startsWith(searchByPurpose)
    );

    // Pagination
    const pages = [];
    for (let i = 1; i <= Math.ceil(filteredOrders.length / itemsPerPage); i++) {
        pages.push(i);
    }

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}.${month}.${year}`;
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        getOrdersById(auth.user.id);
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    MY ORDERS:
                </h2>
            }
        >
            <Head title="MyOrders" />

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

            <div className="py-2 mt-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div
                                style={{
                                    display: "flex",
                                    marginBottom: "20px",
                                }}
                            >
                                <Input
                                    variant="outline"
                                    placeholder="Search by purpose ..."
                                    style={{ width: "30%" }}
                                    onChange={(e) => {
                                        setSearchByPurpose(e.target.value);
                                        setCurrentPage(1); // reset pagination
                                    }}
                                />
                            </div>

                            <TableContainer>
                                <Table variant="striped" colorScheme="teal">
                                    <TableCaption>My orders</TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th>Id::</Th>
                                            <Th>Info:</Th>
                                            <Th>Purpose:</Th>
                                            <Th>Date:</Th>
                                            <Th>Time:</Th>
                                            <Th>Class:</Th>
                                            <Th>Reuse:</Th>
                                            <Th>Delete:</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredOrders
                                            .slice(
                                                (currentPage - 1) *
                                                    itemsPerPage,
                                                currentPage * itemsPerPage
                                            ) // Pagination
                                            .map((order) => (
                                                <Tr key={order.id}>
                                                    <Td>{order.id}</Td>
                                                    <Td>
                                                        <DetailViewOrder
                                                            order={order}
                                                        />
                                                    </Td>
                                                    <Td>{order.purpose}</Td>
                                                    <Td>
                                                        {formatDate(order.date)}
                                                    </Td>
                                                    <Td>{formatTime(order.time)}</Td>
                                                    <Td>{order.schoolClass}</Td>
                                                    <Td>
                                                        <Button
                                                            colorScheme="blue"
                                                            onClick={() =>
                                                                navigateToReuseOrder(
                                                                    order.id
                                                                )
                                                            }
                                                        >
                                                            Reuse
                                                        </Button>
                                                    </Td>
                                                    <Td>
                                                        {/* isDisabled */}
                                                        <Button
                                                            colorScheme="red"
                                                            onClick={() =>
                                                                deleteOrderById(
                                                                    order
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </Button>
                                                    </Td>
                                                </Tr>
                                            ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>

                            {/* Pagination */}
                            <div
                                style={{
                                    marginLeft: "20px",
                                    marginRight: "20px",
                                }}
                            >
                                <Text fontSize="lg" mb={"20px"} mr={"20px"}>
                                    Page: {currentPage} of {pages.length}
                                </Text>
                                <Text
                                    as="b"
                                    fontSize="lg"
                                    mb={"20px"}
                                    mr={"20px"}
                                >
                                    Pagination, Select your page:
                                </Text>
                                {pages.map((number) => (
                                    <Button
                                        key={number}
                                        onClick={() => setCurrentPage(number)}
                                        style={{
                                            marginRight: "10px",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        {number}
                                    </Button>
                                ))}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginBottom: "50px",
                                }}
                            >
                                <Button
                                    isDisabled
                                    colorScheme="red"
                                    onClick={deleteAllOrders}
                                >
                                    DELETE ALL
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default MyOrders;
