import React from "react";
import { useState } from "react";
import axios from "axios";

import { useEffect } from "react";
import { Button, Divider, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
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

function AvailableGroceries({ orderId, setBooleanUpdateGroceriesOrder }) {
    const [groceries, setGroceries] = React.useState([]);
    const [searchByName, setSearchByName] = React.useState("");
    const [searchByCategory, setSearchByCategory] = React.useState("");
    
    const [quantity, setQuantity] = React.useState({});
    const [comment, setComment] = React.useState({});
    const [isLoadingToSendData, setIsLoadingToSendData] = React.useState(false);

    const [currentPage, setCurrentPage] = useState(1);      // Pagination
    const itemsPerPage = 20;                                // Pagination

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

    const addGroceryToOrder = (groceries) => {
        const payload = {
            order_id: orderId,
            groceries_id: groceries.id,
            comment: comment[groceries.id],
            quantity: quantity[groceries.id],
        };

        //console.log(payload);

        if(payload.quantity === undefined || payload.quantity === ""){
            errorAlert("Quantity field cannot be empty!");
        } else {
            toast.dismiss();
            setIsLoadingToSendData(true);
            setTimeout(() => {
                axios
                .post("/api/groceries_order", payload)
                .then((response) => {
                    setBooleanUpdateGroceriesOrder();
                    setIsLoadingToSendData(false);
                    setTimeout(() => {
                        successAlert("Grocery added to order!");
                    }, 400); 
                })
                .catch((error) => {
                    console.log(error);
                    setIsLoadingToSendData(false);
                });
            }, 800); // Delay of 1000 Milliseconds 
        }
    };

    const filteredGroceries = groceries.filter(
        (grocery) =>
            grocery.name.startsWith(searchByName) &&
            grocery.category.startsWith(searchByCategory)
    );

    // Pagination
    const pages = [];
    for (let i = 1; i <= Math.ceil(filteredGroceries.length / itemsPerPage); i++) {
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
    
      const errorAlert = (infoError) => {
        toast.error(infoError, {
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
    
      const warningAlert = (infoWarning) => {
        toast.warn(infoWarning, {
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
    ///////////////////////////////////////////////////////////////////////////////////////
    return (
        <div>
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
            
            <Text
                fontSize="2xl"
                style={{
                    display: "block",
                    textAlign: "center",
                    color: "black",
                    fontWeight: "bold",
                    marginTop: "30px",
                }}
            >
                Available Groceries:
            </Text>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "30px",
                    marginTop: "30px",
                }}
            >
                <div style={{ width: "40%", marginRight: "20px" }}>
                    <Text>Search by name ...</Text>
                    <Input
                        variant="outline"
                        placeholder="Search ..."
                        value={searchByName}
                        onChange={(e) => {
                            setSearchByName(e.target.value)
                            setCurrentPage(1);            // reset pagination
                        }}
                    />
                </div>
                <div style={{ width: "40%" }}>
                    <Text>Search by category ...</Text>
                    <Input
                        variant="outline"
                        placeholder="Search ..."
                        value={searchByCategory}
                        onChange={(e) => {
                            setSearchByCategory(e.target.value)
                            setCurrentPage(1);            // reset pagination
                        }}
                    />
                </div>
            </div>
            <TableContainer>
                <Table variant="striped" colorScheme="teal">
                    <TableCaption>All available products</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Product Name:</Th>
                            <Th>Quantity:</Th>
                            <Th>Unit:</Th>
                            <Th>Category:</Th>
                            <Th>Comment:</Th>
                            <Th display="flex" justifyContent="center" >
                                {isLoadingToSendData ? <CircularProgress isIndeterminate color='green.300' size="20px" /> : "ADD"}
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredGroceries
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) // Pagination
                            .map((grocery) => (
                                <Tr key={grocery.id}>
                                    <Td>{grocery.name}</Td>
                                    <Td>
                                        <Input
                                            style={{ border: "1px solid grey" }}
                                            placeholder="..."
                                            type="number"
                                            width="60px"
                                            onChange={(e) =>
                                                setQuantity({
                                                    ...quantity,
                                                    [grocery.id]: e.target.value,
                                                })
                                            }
                                        />
                                    </Td>
                                    <Td>{grocery.unit}</Td>
                                    <Td>{grocery.category}</Td>
                                    <Td>
                                        <Input
                                            style={{ border: "1px solid grey" }}
                                            placeholder="Optional comment ... "
                                            onChange={(e) =>
                                                setComment({
                                                    ...comment,
                                                    [grocery.id]: e.target.value,
                                                })
                                            }
                                        />
                                    </Td>
                                    <Td>
                                        {/* isDisabled */}
                                        <Button
                                            colorScheme="blue"
                                            onClick={() =>
                                                addGroceryToOrder(grocery)
                                            }
                                            isDisabled={isLoadingToSendData}
                                        >
                                            ADD
                                        </Button>
                                    </Td>
                                </Tr>
                            ))
                        }
                    </Tbody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <div style={{marginLeft: "20px", marginRight: "20px", marginBottom: "50px"}}>
                <Text fontSize='lg' mb={"20px"} mr={"20px"}>
                    Current Page: {currentPage} of {pages.length}
                </Text>
                <Text as='b' fontSize='lg' mb={"20px"} mr={"20px"}>Pagination, Select your page:</Text>         
                {pages.map((number) => (
                    <Button key={number} onClick={() => setCurrentPage(number)} style={{ marginRight: '10px', marginBottom: '10px' }}>
                        {number}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default AvailableGroceries;
