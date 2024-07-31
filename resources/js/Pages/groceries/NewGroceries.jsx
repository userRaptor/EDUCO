import React, { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { Input, Text } from "@chakra-ui/react";
import { Button, Box } from "@chakra-ui/react";
import { ChevronDownIcon, AddIcon, InfoOutlineIcon } from "@chakra-ui/icons";

import CSVReader from "react-csv-reader";

import GetGroceries from "./GetGroceries";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from "@chakra-ui/react";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
} from "@chakra-ui/react";

import { Bounce } from "react-toastify";

function NewGroceries({ auth }) {
    const [groceriesName, setGroceriesName] = React.useState("");
    const [groceriesUnit, setGroceriesUnit] = React.useState("");
    const [groceriesCategory, setGroceriesCategory] = React.useState("");
    const [groceriesSupplier, setGroceriesSupplier] = React.useState("");

    const [csvData, setCsvData] = useState(null);
    const [renderKey, setRenderKey] = useState(0);

    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    const handleChangeUnit = (event) => {
        setGroceriesUnit(event);
    };

    const handleChangeCategory = (event) => {
        setGroceriesCategory(event);
    };

    const saveGroceries = () => {
        const payload = {
            name: groceriesName,
            unit: groceriesUnit,
            category: groceriesCategory,
            supplier: groceriesSupplier,
        };

        if (groceriesName === "") {
            errorAlert("Name field cannot be empty!");
        } else if (groceriesUnit === "") {
            errorAlert("Unit field cannot be empty!");
        } else if (groceriesCategory === "") {
            errorAlert("Category field cannot be empty!");
        } else if (groceriesSupplier === "") {
            errorAlert("Supplier field cannot be empty!");
        } else {
            axios
                .post("/api/groceries", payload)
                .then((response) => {
                    setRenderKey((prevKey) => prevKey + 1); // to rerender the GetGroceries component
                    successAlert("The product was added successfully!");
                })
                .catch((error) => {
                    errorAlert(error.response.data.message);
                    console.log(error.response?.data || error.message);
                });
        }
    };

    const handleCsvInput = (data, fileInfo) => {
        //console.log(data);
        setCsvData(data);
    };

    const handleSendCsvData = () => {
        //toast.dismiss();
        if (csvData) {
            axios
                .post("/groceriescsv", { csv: csvData })
                .then((response) => {
                    setRenderKey((prevKey) => prevKey + 1); // to rerender the GetGroceries component
                    successAlert("The csv file was imported successfully!");
                })
                .catch((error) => {
                    console.error(error);
                    errorAlert("Error importing data");
                });
            //setCsvData(null);
        } else {
            warningAlert("No csv file was selected!");
        }
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

    const errorAlert = (infoError) => {
        setIsAlertOpen(true);
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
            onClose: () => setIsAlertOpen(false),
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

    useEffect(() => {}, []);

    //////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    EDIT GROCERIES:
                </h2>
            }
        >
            <Head title="Groceries" />

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

            <div>
                <div className="py-2 mt-10">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div style={{ margin: "20px" }}>
                                <Text fontSize="2xl"> Add new Groceries:</Text>
                            </div>
                            <div className="p-6 text-gray-600">
                                <InfoOutlineIcon /> When creating new groceries,
                                please always include the name first. This can
                                be followed by further details such as: Carrots
                                small. This makes it easier to find products
                                using the built-in search function.
                            </div>
                            <div style={{ margin: "20px" }}>
                                <TableContainer>
                                    <Table variant="simple">
                                        <Thead>
                                            <Tr>
                                                <Th>Product name:</Th>
                                                <Th>Unit:</Th>
                                                <Th>Category:</Th>
                                                <Th>Supplier:</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            <Tr>
                                                <Td>
                                                    <Input
                                                        value={groceriesName}
                                                        onChange={(event) => {
                                                            if (!isAlertOpen) {
                                                                setGroceriesName(
                                                                    event.target
                                                                        .value
                                                                );
                                                            }
                                                        }}
                                                        placeholder="Name ..."
                                                    />
                                                </Td>
                                                <Td>
                                                    <Menu>
                                                        <MenuButton
                                                            as={Button}
                                                            rightIcon={
                                                                <ChevronDownIcon />
                                                            }
                                                        >
                                                            {groceriesUnit !==
                                                            ""
                                                                ? groceriesUnit
                                                                : "Unit"}
                                                        </MenuButton>
                                                        <MenuList>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleChangeUnit(
                                                                        "kg"
                                                                    )
                                                                }
                                                            >
                                                                Kilogramm
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleChangeUnit(
                                                                        "g"
                                                                    )
                                                                }
                                                            >
                                                                Gramm
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleChangeUnit(
                                                                        "Stück"
                                                                    )
                                                                }
                                                            >
                                                                Stück
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleChangeUnit(
                                                                        "l"
                                                                    )
                                                                }
                                                            >
                                                                Liter
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleChangeUnit(
                                                                        "ml"
                                                                    )
                                                                }
                                                            >
                                                                Milliliter
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </Td>
                                                <Td>
                                                    <Menu>
                                                        <MenuButton
                                                            as={Button}
                                                            rightIcon={
                                                                <ChevronDownIcon />
                                                            }
                                                        >
                                                            {groceriesCategory !==
                                                            ""
                                                                ? groceriesCategory
                                                                : "Category"}
                                                        </MenuButton>
                                                        <MenuList>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleChangeCategory(
                                                                        "Obst"
                                                                    )
                                                                }
                                                            >
                                                                Obst
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleChangeCategory(
                                                                        "Milchprodukte"
                                                                    )
                                                                }
                                                            >
                                                                Milchprodukte
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleChangeCategory(
                                                                        "Tiefkühl"
                                                                    )
                                                                }
                                                            >
                                                                Tiefkühl
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleChangeCategory(
                                                                        "Gemüse"
                                                                    )
                                                                }
                                                            >
                                                                Gemüse
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleChangeCategory(
                                                                        "Fleisch"
                                                                    )
                                                                }
                                                            >
                                                                Fleisch
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </Td>
                                                <Td>
                                                    <Input
                                                        value={
                                                            groceriesSupplier
                                                        }
                                                        onChange={(event) =>
                                                            setGroceriesSupplier(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Supplier ..."
                                                    />
                                                </Td>
                                                <Td>
                                                    <Button
                                                        colorScheme="blue"
                                                        onClick={saveGroceries}
                                                    >
                                                        ADD
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-2">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "25px",
                                        marginLeft: "20px",
                                    }}
                                >
                                    <Text fontSize="md" as="b">
                                        Import groceries with a CSV-File:
                                    </Text>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button
                                                bgColor="transparent"
                                                color="black"
                                            >
                                                <InfoOutlineIcon boxSize={5} />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverCloseButton />
                                            <PopoverHeader>
                                                Structure of the CSV file!
                                            </PopoverHeader>
                                            <PopoverBody>
                                                The csv file must have the
                                                following structure: <br />{" "}
                                                <strong>
                                                    name,unit,category,supplier
                                                </strong>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                    <CSVReader onFileLoaded={handleCsvInput} />
                                    <Button
                                        colorScheme="blue"
                                        onClick={handleSendCsvData}
                                    >
                                        {/*backgroundColor="#FFA500"*/}
                                        Import{" "}
                                        <AddIcon
                                            style={{ marginLeft: "10px" }}
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/**Trennlinie waagerecht */}
                <div style={{ marginTop: "50px", marginBottom: "50px" }}>
                    <Box height="5px" backgroundColor="black" />
                </div>

                <GetGroceries key={renderKey} />
            </div>
        </AuthenticatedLayout>
    );
}

export default NewGroceries;
