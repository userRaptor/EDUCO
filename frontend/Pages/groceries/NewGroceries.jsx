import React, { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { Input, Text } from "@chakra-ui/react";
import { Button, Box, Spinner } from "@chakra-ui/react";
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

    const [isImportingCsv, setIsImportingCsv] = useState(false);
    const [csvData, setCsvData] = useState(null);
    const [renderKey, setRenderKey] = useState(0);

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
        if (fileInfo.name.endsWith(".csv")) {
            setCsvData(data);
        } else {
            errorAlert("Only .csv files are accepted!");
        }
    };


    const handleSendCsvData = () => {
        //console.log(csvData);
        if (csvData) {
            setIsImportingCsv(true);
            axios
                .post("/api/groceriescsv", { csv: csvData })
                .then((response) => {
                    setRenderKey((prevKey) => prevKey + 1); // to rerender the GetGroceries component
                    setIsImportingCsv(false);
                    successAlert("The csv file was imported successfully!");
                })
                .catch((error) => {
                    setIsImportingCsv(false);
                    if (error.response) {
                        errorAlert(error.response.data.message);
                    } else if (error.request) {
                        errorAlert('No response received from server');
                    } else {
                        errorAlert('Error setting up request: ' + error.message);
                    }
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

    useEffect(() => { }, []);

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
                                <Text fontSize="xl"> Add new Groceries:</Text>
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
                                                        id="groceries-name"
                                                        name="groceriesName"
                                                        value={groceriesName}
                                                        onChange={(event) => {
                                                            setGroceriesName(
                                                                event.target
                                                                    .value
                                                            );
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
                                                                        "Flaschen"
                                                                    )
                                                                }
                                                            >
                                                                Flasche
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleChangeUnit(
                                                                        "Dosen"
                                                                    )
                                                                }
                                                            >
                                                                Dose
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
                                                                        "Gemüse"
                                                                    )
                                                                }
                                                            >
                                                                Gemüse
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
                                                                        "Fisch"
                                                                    )
                                                                }
                                                            >
                                                                Fisch
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
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleChangeCategory(
                                                                        "TrockenLM"
                                                                    )
                                                                }
                                                            >
                                                                Trockenlebensmittel
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </Td>
                                                <Td>
                                                    <Input
                                                        id="groceries-supplier"
                                                        name="groceriesSupplier"
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
                                                The CSV file must have the
                                                following structure: <br />{" "}
                                                <strong>
                                                    name,unit,category,supplier
                                                </strong>
                                                <br /><br />
                                                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                                    <li>The CSV file must not have a header. (Product listings must begin in the first row)</li>
                                                    <li>Empty fields will be initialized with null.</li>
                                                    <li>Products that do not conform to the specified structure will not be included in the database, and no warning will be issued in case of such an error.</li>
                                                </ul>
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
                                    {isImportingCsv && <Spinner color="blue.500" />}
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
