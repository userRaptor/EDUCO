import React, { useEffect } from "react";

import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Inertia } from "@inertiajs/inertia";
import axios from "axios";

import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { Button, Input, Text, Flex } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

import RegisterNewUser from "./RegisterNewUser";

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
    const [isOpen, setIsOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [users, setUsers] = React.useState([]);
    const [searchByName, setSearchByName] = React.useState("");

    const onOpen = (user) => {
        if (user.id === auth.user.id) {
            errorAlert("You can't change your own password!");
            return;
        }

        setCurrentUser(user);
        setIsOpen(true);
    };

    const onClose = () => {
        setIsOpen(false);
        setCurrentUser(null);
        setPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");
    };

    const changeInputPassword = (e) => {
        setPassword(e.target.value);
        setSuccess("");
    };

    const changeInputConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        setSuccess("");
    };

    const deleteUserById = (userId) => {
        if (userId === auth.user.id) {
            errorAlert("You can't delete your own profile!");
            return;
        }

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
                    successAlert("User successfully deleted");
                })
                .catch((error) => {
                    console.log(error);
                    errorAlert("Error deleting user");
                });
        }
    };

    const updateUserRoleByUserId = (userId, role) => {
        const payload = {
            role: role,
        };

        if (userId === auth.user.id) {
            errorAlert("You can't change your own role!");
            return;
        }

        axios
            .put(`/api/userrole/${userId}`, payload)
            .then((response) => {
                fetchUsers();
                successAlert("User role successfully updated");
            })
            .catch((error) => {
                console.log(error);
            });
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

    const handleSave = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setSuccess("");
        } else {
            setError("");

            const payload = {
                password: password,
                password_confirmation: confirmPassword,
            };

            axios
                .put(`/api/newpassword/${currentUser.id}`, payload)
                .then((response) => {
                    setSuccess("Password successfully changed");
                    //onClose();
                })
                .catch((error) => {
                    if (error.response.status === 422) {
                        setError("Password must be at least 8 characters long");
                        setSuccess("");
                    }
                    console.log(error);
                });
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchByName.toLowerCase())
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
                        <div style={{ margin: "20px" }}>
                            <RegisterNewUser
                                onUserRegistered={handleNewUserRegistered}
                            />
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
                                id="search-username"
                                name="search"
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
                                                <Td>
                                                    {user.id !== 1 ? (
                                                        <Select
                                                            placeholder="Select option"
                                                            value={user.role}
                                                            onChange={(e) =>
                                                                updateUserRoleByUserId(user.id, e.target.value)
                                                            }
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="admin">Admin</option>
                                                        </Select>
                                                    ) : (
                                                        <span>Role hidden</span>
                                                    )}
                                                </Td>
                                                <Td>{formatDate(user.created_at)}</Td>
                                                <Td>
                                                    {user.id !== 1 && (
                                                        <>
                                                            <Button
                                                                colorScheme="blue"
                                                                variant="outline"
                                                                style={{ marginRight: "10px" }}
                                                                onClick={() => onOpen(user)}
                                                            >
                                                                Reset Password
                                                            </Button>

                                                            <Button
                                                                colorScheme="red"
                                                                onClick={() => deleteUserById(user.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
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

            {/* Modal for changing password */}
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        New password for:{" "}
                        {currentUser ? currentUser.name : "userNotFound"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>New Password:</Text>
                        <Input
                            id="new-password"
                            name="password"
                            placeholder="..."
                            type="password"
                            value={password}
                            onChange={changeInputPassword}
                        />
                        <Text style={{ marginTop: 15 }}>Confirm Password:</Text>
                        <Input
                            id="confirm-password"
                            name="confirmPassword"
                            placeholder="..."
                            type="password"
                            value={confirmPassword}
                            onChange={changeInputConfirmPassword}
                        />
                        {error && (
                            <Text style={{ color: "red", marginTop: 5 }}>
                                {error}
                            </Text>
                        )}

                        <Flex align="center" mt={8} mb={5}>
                            <Button onClick={handleSave} colorScheme="teal">
                                Save
                            </Button>
                            {success && (
                                <Text color="green.500" ml={3}>
                                    {success}
                                </Text>
                            )}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </AuthenticatedLayout>
    );
}

export default UserManagement;
