import React, { useEffect } from "react";

import { Inertia } from "@inertiajs/inertia";
import axios from "axios";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { Button, Input, Text } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

import RegisterNewUser from "./RegisterNewUser";
import ResetPasswordByAdmin from "./ResetPasswordByAdmin";

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

function UserManagement({ auth }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [users, setUsers] = React.useState([]);
    const [searchByName, setSearchByName] = React.useState("");

    const deleteUserById = (userId) => {
        if (
            window.confirm(
                "Are you sure to delete the user with ID " +
                    userId +
                    "? \nYou can't undo this action afterwards."
            )
        ) {
            axios
                .delete(`/api/users/${userId}`)
                .then((response) => {
                    fetchUsers();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const fetchUsers = () => {
        axios
            .get(`/api/users`)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const filteredUsers = users.filter((user) =>
        user.name.startsWith(searchByName)
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero based (0 = January, 11 = December)
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    const handleNewUserRegistered = () => {
        fetchUsers();
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    USER MANAGEMENT:
                </h2>
            }
        >
            <Head title="UserManagement" />

            <div className="py-2 mt-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div style={{ margin: "20px" }}>
                            <RegisterNewUser
                                onUserRegistered={handleNewUserRegistered}
                            />
                        </div>
                        <div style={{ margin: "20px" }}>
                            <ResetPasswordByAdmin />
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-2 mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div
                            style={{
                                margin: "20px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Text fontSize="xl" style={{ marginRight: "30px" }}>
                                Registered users:
                            </Text>
                            <Input
                                variant="outline"
                                placeholder="Search by username ..."
                                style={{ width: "30%" }}
                                onChange={(e) => {
                                    setSearchByName(e.target.value);
                                }}
                            />
                        </div>

                        <div style={{ margin: "20px" }}>
                            <TableContainer>
                                <Table variant="striped">
                                    <TableCaption>Users</TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th>Id:</Th>
                                            <Th>Name:</Th>
                                            <Th>Email:</Th>
                                            <Th>Role:</Th>
                                            <Th>Created at:</Th>
                                            <Th>Actions:</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredUsers.map((user) => (
                                            <Tr key={user.id}>
                                                <Td>{user.id}</Td>
                                                <Td>{user.name}</Td>
                                                <Td>{user.email}</Td>
                                                <Td>{user.role}</Td>
                                                <Td>
                                                    {formatDate(
                                                        user.created_at
                                                    )}
                                                </Td>
                                                <Td>
                                                    <Button
                                                        colorScheme="blue"
                                                        variant="outline"
                                                        style={{
                                                            marginRight: "10px",
                                                        }}
                                                        onClick={onOpen}
                                                    >
                                                        Edit
                                                    </Button>

                                                    <Button
                                                        colorScheme="red"
                                                        onClick={() =>
                                                            deleteUserById(
                                                                user.id
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
                        </div>
                    </div>
                </div>
            </div>

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontWeight="bold" mb="1rem">
                            You can scroll the content behind the modal
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="ghost">Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AuthenticatedLayout>
    );
}

export default UserManagement;
