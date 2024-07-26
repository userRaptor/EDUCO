import React, { useEffect } from "react";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { Input, Text } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useState } from "react";
import { Divider } from "@chakra-ui/react";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "react-calendar/dist/Calendar.css";

import BarrierForCollection from "./BarrierForCollection";

import { InfoOutlineIcon } from "@chakra-ui/icons";

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

function NewOrder({
    setOrderAlreadyExistsToParent,
    setActualOrderIdToParent
}) {
    const [selectedDate, setSelectedDate] = React.useState("");
    const [internationalDate, setInternationalDate] = React.useState("");
    const [weekday, setWeekday] = React.useState("");
    const [time, setTime] = React.useState("");
    const [minDate, setMinDate] = useState(""); // minDate to realize that the user can only select a date from the next Wednesday on

    const [schoolClass, setSchoolClass] = React.useState("");
    const [location, setLocation] = React.useState("");
    const [purpose, setPurpose] = React.useState("");

    const [orderID, setOrderID] = React.useState("");
    const [orderAlreadyExists, setOrderAlreadyExists] = React.useState(false);

    const handleDateTimeChange = (event) => {
        const dateTimeValue = event.target.value;
        const [dateValue, timeValue] = dateTimeValue.split("T");

        setInternationalDate(dateValue);

        const [year, month, day] = dateValue.split("-");

        const selectedDate = new Date(year, month - 1, day);
        const options = { weekday: "long" };
        const weekdayValue = selectedDate.toLocaleDateString("en-EN", options);

        // Update state with extracted values
        setSelectedDate(`${day}-${month}-${year}`);
        setWeekday(weekdayValue);
        setTime(timeValue);
    };

    const createNewOrder = (event) => {
        event.preventDefault();

        const payload = {
            user_id: 1,
            date: internationalDate,
            weekday: weekday,
            time: time,
            schoolClass: schoolClass,
            location: location,
            purpose: purpose,
            includeSummary: true,
        };

        if (selectedDate === "") {
            emptyFieldAlert("Date and Time");
        } else if (time === "") {
            emptyFieldAlert("Time");
        } else if (schoolClass === "") {
            emptyFieldAlert("Class");
        } else if (location === "") {
            emptyFieldAlert("Location");
        } else if (purpose === "") {
            emptyFieldAlert("Purpose");
        } else {
            axios
                .post("/orders", payload)
                .then((response) => {
                    //console.log(response);
                    setOrderID(response.id);

                    setOrderAlreadyExists(true);
                    setOrderAlreadyExistsToParent();
                    setActualOrderIdToParent(response.id);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const emptyFieldAlert = (fieldName) => {
        toast.error(fieldName + " field cannot be empty!", {
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

    const calculateMinDate = () => {
        const date = new Date(); // get current date
        //const date = new Date('2024-06-10T09:00:00');   // For testing purposes

        const day = date.getDay(); // Sunday - Saturday : 0 - 6
        const hours = date.getHours();

        const addDays = (days) => {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        };

        let minDeliveryDate;

        if (day === 0) {
            minDeliveryDate = addDays(8); // Next Monday
        } else if (day === 1 || day === 2) {
            minDeliveryDate = addDays(7 + (1 - day)); // Next Monday
        } else if (day === 3) {
            if (hours < 9) {
                minDeliveryDate = addDays(7 + (1 - day)); // Next Monday
            } else {
                minDeliveryDate = addDays(14 + (1 - day)); // Monday after next
            }
        } else if (day === 4 || day === 5 || day === 6) {
            minDeliveryDate = addDays(14 + (1 - day)); // Monday after next
        }

        setMinDate(minDeliveryDate.toISOString().substr(0, 16));
    };

    useEffect(() => {
        calculateMinDate();
    }, []);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <div>
            <Head title="New Order" />
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
                        <div className="p-6 text-gray-500">
                            <BarrierForCollection />
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-2 mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div style={{ margin: "20px" }}>
                            <Text
                                style={{
                                    marginLeft: "10px",
                                    marginTop: "20px",
                                    marginBottom: "10px",
                                    color: "grey",
                                }}
                            >
                                <InfoOutlineIcon /> Note: Certain dates are
                                unavailable for selection because all orders are
                                collected every Wednesday at 09:00 AM.
                                Therefore, delivery dates are calculated based
                                on this schedule.
                            </Text>

                            <TableContainer>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Date and Time:</Th>
                                            <Th>Class:</Th>
                                            <Th>Location:</Th>
                                            <Th>Purpose:</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>
                                                <Input
                                                    placeholder="Select Date and Time"
                                                    type="datetime-local"
                                                    min={minDate}
                                                    disabled={
                                                        orderAlreadyExists
                                                    }
                                                    onChange={
                                                        handleDateTimeChange
                                                    }
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    placeholder="Class ..."
                                                    disabled={
                                                        orderAlreadyExists
                                                    }
                                                    onChange={(event) =>
                                                        setSchoolClass(
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    placeholder="Location ..."
                                                    disabled={
                                                        orderAlreadyExists
                                                    }
                                                    onChange={(event) =>
                                                        setLocation(
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    placeholder="Purpose ..."
                                                    disabled={
                                                        orderAlreadyExists
                                                    }
                                                    onChange={(event) =>
                                                        setPurpose(
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </Td>

                                            <Td>
                                                {/**isDisabled={orderAlreadyExists} */}
                                                <Button
                                                    colorScheme="blue"
                                                    onClick={createNewOrder}
                                                    isDisabled={
                                                        orderAlreadyExists
                                                    }
                                                >
                                                    Add groceries
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
            {/**Trennlinie Waagerecht*/}
            <div style={{ borderTop: "5px solid orange", h: "100%" }} />{" "}
        </div>
    );
}

export default NewOrder;
