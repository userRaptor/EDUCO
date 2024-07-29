import React, { useEffect } from "react";

import { Inertia } from "@inertiajs/inertia";
import axios from "axios";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { Button } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";

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

function UserManagement({ auth }) {
    const [users, setUsers] = React.useState([]);
    const [searchByName, setSearchByName] = React.useState("");

    const deleteUserById = (userId) => {
        if (window.confirm("Are you sure to delete the user with ID " + userId + "? \nYou can't undo this action afterwards.")) {
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
                            <Button>Create User:</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-2 mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div style={{ margin: "20px" }}>
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
        </AuthenticatedLayout>
    );
}

export default UserManagement;
