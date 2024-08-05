import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";
import { Button, Heading, SimpleGrid, Text } from "@chakra-ui/react";

import DetailViewOrder from "./DetailViewOrder";

import { Box, Flex } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { ArrowDownIcon, DownloadIcon } from "@chakra-ui/icons";
import { Spinner } from "@chakra-ui/react";

import { Fade, ScaleFade, Slide, SlideFade, Collapse } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";

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

function AllOrdersMain({ auth }) {
    const [orders, setOrders] = React.useState([]);
    const [loadingOrderId, setLoadingOrderId] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [currentPage, setCurrentPage] = useState(1); // Pagination
    const itemsPerPage = 20; // Pagination

    const fetchOrders = () => {
        axios
            .get(`/api/orders`)
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deleteAllOrders = () => {
        if (
            window.confirm(
                "Are you sure to delete all orders? \nYou can't undo this action afterwards."
            )
        ) {
            axios
                .delete("/api/orders")
                .then((response) => {
                    fetchOrders();
                    successAlert("All orders have been deleted successfully!");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const changeIncludeSummary = (order) => {
        setLoadingOrderId(order.id);

        axios
            .put(`api/orders/${order.id}`, {
                includeSummary: !order.includeSummary,
            })
            .then((response) => {
                fetchOrders();
                // Ladezustand mit einer Verzögerung von 500ms beenden
                setTimeout(() => {
                    setLoadingOrderId(null);
                }, 500);
            })
            .catch((error) => {
                console.log(error);
                setTimeout(() => {
                    setLoadingOrderId(null);
                }, 500);
            });
    };

    const filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.date);
        if (startDate && endDate) {
            // start and end date are selected
            return (
                orderDate >= new Date(startDate) &&
                orderDate <= new Date(endDate)
            );
        } else if (startDate) {
            // only the start date is selected
            return orderDate >= new Date(startDate);
        } else if (endDate) {
            // only the end date is selected
            return orderDate <= new Date(endDate);
        } else {
            // no date is selected
            return true;
        }
    });

    // Pagination
    const pages = [];
    for (let i = 1; i <= Math.ceil(filteredOrders.length / itemsPerPage); i++) {
        pages.push(i);
    }
    ///////////////////////////////////////////////////////
    const exportPDFByPerson = () => {
        const doc = new jsPDF();
        const tableColumn = [
            "Name",
            "Quantity",
            "Unit",
            "Category",
            "Supplier",
            "Comment",
        ];

        const pageHeight = doc.internal.pageSize.height;
        const footerHeight = 20; // Height reserved for footer
        const margin = 10;

        // Function to add footer
        const addFooter = () => {
            const currentPage = doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            doc.text("Page " + currentPage, margin, pageHeight - margin);
            doc.text(
                "Year: " +
                    getCalendarWeekAndYear().year +
                    ", CalendarWeek: " +
                    getCalendarWeekAndYear().week,
                70,
                pageHeight - margin
            );
        };

        // Group orders by teacher
        const ordersByTeacher = filteredOrders
            .filter((order) => order.includeSummary)
            .reduce((acc, order) => {
                (acc[order.user.name] = acc[order.user.name] || []).push(order);
                return acc;
            }, {});

        // Loop through each teacher
        Object.keys(ordersByTeacher).forEach((teacher, index) => {
            if (index > 0) {
                doc.addPage(); // Add a new page for each teacher
            }

            let currentY = 20; // Initial Y position for content

            // Title and Subtitle
            doc.setFontSize(20);
            doc.text(`Orders for ${teacher}:`, margin, currentY); // Title
            currentY += 15; // Adjust vertical space after title
            doc.setFontSize(12);
            doc.text(
                `From: ${formatDate(startDate)} to: ${formatDate(endDate)}`,
                margin,
                currentY
            ); // Subtitle
            currentY += 15; // Adjust vertical space after subtitle

            // Add Orders and Groceries
            ordersByTeacher[teacher].forEach((order, orderIndex) => {
                if (orderIndex > 0) {
                    currentY += 20; // Add space between orders
                }

                // Check if there is enough space for the order details and table
                if (currentY + footerHeight > pageHeight - margin) {
                    addFooter();
                    doc.addPage();
                    currentY = 20; // Reset currentY on new page
                }

                // Order Details
                doc.setFontSize(11);
                doc.setTextColor(0, 0, 255); // Blue
                doc.setFont("helvetica", "bold");
                doc.text(
                    `Order ID: ${order.id}, ${order.purpose}, ${
                        order.weekday
                    }, ${formatDate(order.date)} - ${formatTime(
                        order.time
                    )}, -> ${order.schoolClass}, ${order.location}`,
                    margin,
                    currentY
                );
                doc.setTextColor(0, 0, 0); // Black

                // Update currentY position for groceries table
                currentY += 10; // Add space between order details and table

                // Check if there is enough space for the table
                if (currentY + footerHeight > pageHeight - margin) {
                    addFooter();
                    doc.addPage();
                    currentY = 20; // Reset currentY on new page
                }

                // Groceries Table
                autoTable(doc, {
                    head: [tableColumn],
                    body: order.groceries.map((grocery) => [
                        grocery.name,
                        grocery.pivot.quantity,
                        grocery.unit,
                        grocery.category,
                        grocery.supplier,
                        grocery.pivot.comment,
                    ]),
                    startY: currentY,
                    styles: { fontSize: 10 }, // Adjust font size if needed
                    didDrawPage: (data) => {
                        addFooter();
                    },
                });

                // Update currentY position after table
                currentY = doc.autoTable.previous.finalY + 10; // Update yOffset after table
            });

            // After finishing all orders for the teacher, add space before the next teacher
            currentY += 20; // Add space between teachers
        });

        // Add footer to the last page
        addFooter();

        doc.save(`reportTeacher_week${getCalendarWeekAndYear().week}.pdf`);
    };

    //////////////////////////////////////////////////////////////
    const exportPDFBySupplier = () => {
        const doc = new jsPDF();

        // Funktion zum Hinzufügen der Fußzeile
        const addFooter = () => {
            const pageHeight = doc.internal.pageSize.height;
            const margin = 10;
            const currentPage = doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            doc.text("Page " + currentPage, margin, pageHeight - margin);
            doc.text(
                "Year: " +
                    getCalendarWeekAndYear().year +
                    ", CalendarWeek: " +
                    getCalendarWeekAndYear().week,
                70,
                pageHeight - margin
            );
        };

        // Objekt zur Speicherung aller Lebensmittelinformationen nach Lieferanten und Wochentagen
        const groceriesDataBySupplierAndWeekday = {};

        // Durchlaufen aller Bestellungen und Extrahieren der Lebensmittelinformationen
        orders.forEach((order) => {
            if (order.groceries) {
                order.groceries.forEach((grocery) => {
                    const supplier = grocery.supplier;
                    const weekday = order.weekday;

                    if (!groceriesDataBySupplierAndWeekday[supplier]) {
                        groceriesDataBySupplierAndWeekday[supplier] = {};
                    }

                    if (!groceriesDataBySupplierAndWeekday[supplier][weekday]) {
                        groceriesDataBySupplierAndWeekday[supplier][weekday] =
                            {};
                    }

                    const key =
                        grocery.id +
                        (grocery.pivot.comment
                            ? `_${grocery.pivot.comment}`
                            : "");

                    if (
                        !groceriesDataBySupplierAndWeekday[supplier][weekday][
                            key
                        ]
                    ) {
                        groceriesDataBySupplierAndWeekday[supplier][weekday][
                            key
                        ] = {
                            id: grocery.id,
                            name: grocery.name,
                            quantity: 0,
                            unit: grocery.unit,
                            category: grocery.category,
                            supplier: grocery.supplier,
                            comment: grocery.pivot.comment,
                            weekday: weekday,
                        };
                    }

                    groceriesDataBySupplierAndWeekday[supplier][weekday][
                        key
                    ].quantity += grocery.pivot.quantity;
                });
            }
        });

        // Wochentage in der Reihenfolge Montag bis Sonntag
        const weekdaysOrder = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ];

        // Definierter Abstand vom oberen Rand
        const topMargin = 20;
        const footerHeight = 20; // Höhe, die für die Fußzeile reserviert ist
        let currentY;

        // Durchlaufen der Lieferanten und Erstellen von Tabellen
        Object.keys(groceriesDataBySupplierAndWeekday).forEach(
            (supplier, index) => {
                // Wenn es nicht der erste Lieferant ist, eine neue Seite hinzufügen
                if (index > 0) {
                    doc.addPage();
                }

                // Überschrift für jeden Lieferanten
                doc.setFontSize(13);
                doc.setTextColor(0, 0, 255); // Blau
                doc.setFont("helvetica", "bold");
                doc.text(
                    `Supplier: ${supplier} => From: ${formatDate(
                        startDate
                    )} to: ${formatDate(endDate)}`,
                    10,
                    topMargin
                );
                currentY = topMargin + 10;

                // Durchlaufen der Wochentage und Erstellen von Tabellen
                weekdaysOrder.forEach((weekday) => {
                    if (groceriesDataBySupplierAndWeekday[supplier][weekday]) {
                        // Überschrift für jeden Wochentag
                        doc.setFontSize(10);
                        doc.setTextColor(0, 0, 0); // Schwarz
                        doc.setFont("helvetica", "bold");
                        doc.text(`${weekday}:`, 10, currentY);
                        currentY += 10;

                        // Überprüfen, ob genug Platz für die Tabelle vorhanden ist
                        if (
                            currentY + footerHeight >
                            doc.internal.pageSize.height
                        ) {
                            addFooter();
                            doc.addPage();
                            currentY = topMargin; // Y-Position für die neue Seite zurücksetzen
                        }

                        // Umwandeln der zusammengeführten Daten in ein Array für die Tabelle
                        const tableData = Object.values(
                            groceriesDataBySupplierAndWeekday[supplier][weekday]
                        );

                        // Hinzufügen der Tabelle zum PDF für den aktuellen Wochentag
                        autoTable(doc, {
                            head: [
                                [
                                    "ID",
                                    "Name",
                                    "Quantity",
                                    "Unit",
                                    "Category",
                                    //"Supplier",
                                    "Comment",
                                    //"Weekday",
                                ],
                            ],
                            body: tableData.map((item) => [
                                item.id,
                                item.name,
                                item.quantity,
                                item.unit,
                                item.category,
                                //item.supplier,
                                item.comment,
                                //item.weekday,
                            ]),
                            startY: currentY,
                            didDrawPage: addFooter, // Fügt die Fußzeile bei jedem Seitenwechsel hinzu
                        });

                        // Aktualisieren der Y-Position für die nächste Tabelle
                        currentY = doc.autoTable.previous.finalY + 10;
                    }
                });

                // Platz für den nächsten Lieferanten
                currentY += 10;
            }
        );

        // Fügt die Fußzeile zur letzten Seite hinzu
        addFooter();

        // Speichern des PDFs
        doc.save(`reportSupplier_week${getCalendarWeekAndYear().week}.pdf`);
    };

    //////////////////////////////////////////////////////////////

    const formatDate = (dateString) => {
        if (!dateString) {
            return "null";
        }
        const [year, month, day] = dateString.split("-");
        return `${day}.${month}.${year}`;
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}`;
    };

    function getCalendarWeekAndYear() {
        const date = new Date();
        const tempDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );

        tempDate.setUTCDate(
            tempDate.getUTCDate() + 4 - (tempDate.getUTCDay() || 7)
        );
        const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);

        return { year: tempDate.getUTCFullYear(), week: weekNo };
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
        fetchOrders();
    }, []);

    //////////////////////////////////////////////////////////////////////////////////////////
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    ALL ORDERS:
                </h2>
            }
        >
            <Head title="AllOrders" />

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
                            <div style={{ margin: "20px" }}>
                                <Text fontSize="lg" fontWeight="bold">
                                    Please select period:
                                </Text>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginLeft: "40px",
                                        marginTop: "20px",
                                        marginBottom: "40px",
                                    }}
                                >
                                    <Text
                                        fontWeight="bold"
                                        style={{ marginRight: "10px" }}
                                    >
                                        from:
                                    </Text>
                                    <Input
                                        placeholder="Select Date and Time"
                                        size="md"
                                        type="date"
                                        style={{ width: "200px" }}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            setCurrentPage(1); // reset pagination
                                        }}
                                    />
                                    <Text
                                        fontWeight="bold"
                                        style={{
                                            marginLeft: "40px",
                                            marginRight: "10px",
                                        }}
                                    >
                                        to:
                                    </Text>
                                    <Input
                                        placeholder="Select Date and Time"
                                        size="md"
                                        type="date"
                                        style={{ width: "200px" }}
                                        onChange={(e) => {
                                            setEndDate(e.target.value);
                                            setCurrentPage(1); // reset pagination
                                        }}
                                    />
                                    <Button
                                        backgroundColor="#FFA500"
                                        style={{ marginLeft: "40px" }}
                                        onClick={exportPDFBySupplier}
                                    >
                                        Export by supplier
                                        <DownloadIcon
                                            style={{ marginLeft: "10px" }}
                                        />
                                    </Button>

                                    <Button
                                        backgroundColor="#FFA500"
                                        style={{ marginLeft: "40px" }}
                                        onClick={exportPDFByPerson}
                                    >
                                        Export by person
                                        <DownloadIcon
                                            style={{ marginLeft: "10px" }}
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-2 mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div style={{ margin: "20px" }}>
                            <TableContainer id="my-table">
                                <Table variant="striped" colorScheme="teal">
                                    <TableCaption>All orders</TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th>Id:</Th>
                                            <Th>Info:</Th>
                                            <Th>Date:</Th>
                                            <Th>Weekday:</Th>
                                            {/*<Th>Time:</Th>*/}
                                            <Th>Class:</Th>
                                            <Th>Location:</Th>
                                            <Th>Teacher:</Th>
                                            {/*<Th>Purpose:</Th>*/}
                                            <Th>Include Summary:</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {/** {orders.map((order) => ( */}
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
                                                    <Td>
                                                        {formatDate(order.date)}
                                                    </Td>
                                                    <Td>{order.weekday}</Td>
                                                    {/*
                                                    <Td>
                                                        {formatTime(order.time)}
                                                    </Td>
                                                    */}
                                                    <Td>{order.schoolClass}</Td>
                                                    <Td>{order.location}</Td>
                                                    <Td>{order.user.name}</Td>
                                                    {/*<Td>{order.purpose}</Td>*/}
                                                    <Td>
                                                        <Button
                                                            colorScheme={
                                                                loadingOrderId ===
                                                                order.id
                                                                    ? "gray"
                                                                    : order.includeSummary
                                                                    ? "green"
                                                                    : "orange"
                                                            }
                                                            onClick={() =>
                                                                changeIncludeSummary(
                                                                    order
                                                                )
                                                            }
                                                            isLoading={
                                                                loadingOrderId ===
                                                                order.id
                                                            }
                                                            loadingText=""
                                                        >
                                                            {order.includeSummary
                                                                ? "Exclude"
                                                                : "Include"}
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

export default AllOrdersMain;
