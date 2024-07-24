import React, { useEffect, useState } from "react";
import { Inertia } from '@inertiajs/inertia';

import { Input, Text } from "@chakra-ui/react";
import { Button, Box } from "@chakra-ui/react";
import { ChevronDownIcon, AddIcon, InfoOutlineIcon} from "@chakra-ui/icons";



import CSVReader from 'react-csv-reader';

//import GetGroceries from "./GetGroceries";


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
  } from '@chakra-ui/react'

import { Bounce } from "react-toastify";

function NewGroceries() {
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

        if(groceriesName === ""){
            errorAlert("Name field cannot be empty!");
        } else if(groceriesUnit === ""){
            errorAlert("Unit field cannot be empty!");
        } else if(groceriesCategory === ""){
            errorAlert("Category field cannot be empty!");
        } else if(groceriesSupplier === ""){
            errorAlert("Supplier field cannot be empty!");
        } else {
            Inertia.post('/groceries', payload, {
                onSuccess: () => {
                    successAlert("The product was added successfully!");
                },
                onError: (errors) => {
                    console.log(errors);
                }
            });
        }
    };

    const handleCsvInput = (data, fileInfo) => {
        //console.log(data);
        setCsvData(data);
    }

    const handleSendCsvData = () => {
        if (csvData) {
            Inertia.post('/groceriescsv', { csv: csvData }, {
                onSuccess: () => {
                    successAlert("The csv file was imported successfully!");
                },
                onError: (errors) => {
                    console.log(errors);
                }
            });
            setCsvData(null);
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
            onClose: () => setIsAlertOpen(false)
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

            <div>
                <Text
                    style={{
                        marginTop: "50px",
                        marginLeft: "70px",
                        marginBottom: "20px",
                    }}
                    fontSize="2xl"
                >
                    ADD NEW GROCERIES:
                </Text>

                <Text
                    style={{marginLeft: "70px", marginRight: '70px', marginBottom: "30px", color: 'grey'}}
                >
                    <InfoOutlineIcon /> When creating new groceries, please always include the name first. This can be followed by further details such as: Carrots small. This makes it easier to find products using the built-in search function.
                </Text>


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
                                                setGroceriesName(event.target.value);
                                            }
                                        }}
                                        placeholder="Name ..."
                                    />
                                </Td>
                                <Td>
                                    <Menu>
                                        <MenuButton
                                            as={Button}
                                            rightIcon={<ChevronDownIcon />}
                                        >
                                            {groceriesUnit !== ""
                                                ? groceriesUnit
                                                : "Unit"}
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem
                                                onClick={() =>
                                                    handleChangeUnit("kg")
                                                }
                                            >
                                                Kilogramm
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() =>
                                                    handleChangeUnit("g")
                                                }
                                            >
                                                Gramm
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() =>
                                                    handleChangeUnit("Stück")
                                                }
                                            >
                                                Stück
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() =>
                                                    handleChangeUnit("l")
                                                }
                                            >
                                                Liter
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() =>
                                                    handleChangeUnit("ml")
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
                                            rightIcon={<ChevronDownIcon />}
                                        >
                                            {groceriesCategory !== ""
                                                ? groceriesCategory
                                                : "Category"}
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem
                                                onClick={() =>
                                                    handleChangeCategory("Obst")
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
                                                    handleChangeCategory("Tiefkühl")
                                                }
                                            >
                                                Tiefkühl
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() =>
                                                    handleChangeCategory("Gemüse")
                                                }
                                            >
                                                Gemüse
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() =>
                                                    handleChangeCategory("Fleisch")
                                                }
                                            >
                                                Fleisch
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Td>
                                <Td>
                                    <Input
                                        value={groceriesSupplier}
                                        onChange={(event) =>
                                            setGroceriesSupplier(event.target.value)
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

                {/**Trennlinie waagerecht */}
                <div style={{ marginTop: "50px", marginBottom: "50px" }}>
                    <Box height="5px" backgroundColor="black" />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginLeft: "20px" }}>
                    <Text fontSize='lg' as='b'>Import groceries with a CSV-File:</Text>
                    <Popover>
                        <PopoverTrigger>
                            <Button bgColor="transparent" color="black">
                                <InfoOutlineIcon  boxSize={20} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Structure of the CSV file!</PopoverHeader>
                            <PopoverBody>The csv file must have the following structure: <br /> <strong>name,unit,category,supplier</strong></PopoverBody>
                        </PopoverContent>
                    </Popover>
                    <CSVReader onFileLoaded={handleCsvInput} />
                    <Button backgroundColor="#FFA500" onClick={handleSendCsvData}>Import <AddIcon style={{marginLeft: '10px'}} /></Button>     
                </div>

                
                {/*<GetGroceries key={renderKey} />*/}
            </div>
        </div>
    );
}

export default NewGroceries;
