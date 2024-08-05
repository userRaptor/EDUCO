import React from "react";
import axios from "axios";

import { useEffect } from "react";

import { Button, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { Box, Flex } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify";

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

function GetGroceries() {
    const [groceries, setGroceries] = React.useState([]);
    const [search, setSearch] = React.useState("");

    const [currentPage, setCurrentPage] = useState(1); // Pagination
    const itemsPerPage = 20; // Pagination

    const fetchGroceries = () => {
        axios
            .get("/api/groceries")
            .then((response) => {
                setGroceries(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deleteGroceriesById = (grocery) => {
        if (
            window.confirm(
                `Are you sure to delete this grocery with ID: ${grocery.id}? \nYou can't undo this action afterwards.`
            )
        ) {
            axios
                .delete(`/api/groceries/${grocery.id}`)
                .then((response) => {
                    fetchGroceries();
                    successAlert(`Grocery ${grocery.id} has been deleted successfully.`);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const deleteAll = () => {
        if (
            window.confirm(
                "Are you sure to delete all groceries? \nYou can't undo this action afterwards."
            )
        ) {
            axios
                .delete("/api/groceries")
                .then((response) => {
                    fetchGroceries();
                    successAlert(
                        "All groceries have been deleted successfully."
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const filteredGroceries = groceries.filter((grocery) =>
        grocery.name.toLowerCase().includes(search.toLowerCase())
    );
    
    

    // Pagination
    const pages = [];
    for (
        let i = 1;
        i <= Math.ceil(filteredGroceries.length / itemsPerPage);
        i++
    ) {
        pages.push(i);
    }

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

    useEffect(() => {
        fetchGroceries();
    }, []);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <div>
            <div className="py-2 mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div style={{ margin: "20px" }}>
                            <Text fontSize='2xl'> All Groceries:</Text>
                            <div
                                style={{
                                    display: "flex",
                                    marginTop: "20px",
                                    marginBottom: "20px",
                                }}
                            >
                                <Input
                                    variant="outline"
                                    placeholder="Search by name..."
                                    style={{ width: "30%" }}
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(1); // reset pagination
                                    }}
                                />
                            </div>

                            <TableContainer>
                                <Table variant="striped" colorScheme="teal">
                                    <TableCaption></TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th>Id:</Th>
                                            <Th>Product name:</Th>
                                            <Th>Unit:</Th>
                                            <Th>Category:</Th>
                                            <Th>Supplier:</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredGroceries
                                            .slice(
                                                (currentPage - 1) *
                                                    itemsPerPage,
                                                currentPage * itemsPerPage
                                            ) // Pagination
                                            .map((grocery) => (
                                                <Tr key={grocery.id}>
                                                    <Td>{grocery.id}</Td>
                                                    <Td>{grocery.name}</Td>
                                                    <Td>{grocery.unit}</Td>
                                                    <Td>{grocery.category}</Td>
                                                    <Td>{grocery.supplier}</Td>
                                                    <Td>
                                                        <Button
                                                            colorScheme="red"
                                                            onClick={() =>
                                                                deleteGroceriesById(
                                                                    grocery
                                                                )
                                                            }
                                                        >
                                                            Delete
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
                                {/* isDisabled */}
                                <Button
                                    mt={"20px"}
                                    colorScheme="red"
                                    onClick={deleteAll}
                                >
                                    DELETE ALL
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetGroceries;
