import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

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

            // Title and Subtitle
            doc.setFontSize(20);
            doc.text(`Orders for ${teacher}`, 20, 15); // Title
            doc.setFontSize(12);
            doc.text(
                `From: ${formatDate(startDate)} to: ${formatDate(endDate)}`,
                20,
                25
            ); // Subtitle

            // Add Orders and Groceries
            ordersByTeacher[teacher].forEach((order, orderIndex) => {
                if (orderIndex > 0) {
                    doc.addPage(); // Add a new page for each order if needed
                }

                // Order Details
                doc.setFontSize(11);
                doc.setTextColor(0, 0, 255); // Blau
                doc.setFont("helvetica", "bold");
                doc.text(
                    `Order ID: ${order.id}, ${order.purpose}, ${
                        order.weekday
                    }, ${formatDate(order.date)}, ${order.time}, -> ${
                        order.schoolClass
                    }, ${order.location}`,
                    10,
                    35
                );
                doc.setTextColor(0, 0, 0); // Schwarz

                // Add a space between order details and groceries table
                doc.setFont("helvetica", "normal");
                const yOffset = 40; // Adjust based on your content
                let currentY = yOffset;

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
                        doc.setFontSize(10);
                        doc.text(
                            "Page " + doc.internal.getNumberOfPages(),
                            20,
                            doc.internal.pageSize.height - 10
                        );
                        doc.text(
                            "Year: " +
                                getCalendarWeekAndYear().year +
                                ", CalendarWeek: " +
                                getCalendarWeekAndYear().week,
                            70,
                            doc.internal.pageSize.height - 10
                        );
                    },
                });
                currentY = doc.autoTable.previous.finalY + 10; // Update yOffset after table
            });

            // Footer
            doc.setFontSize(10);
            doc.text(
                "Page " + doc.internal.getNumberOfPages(),
                20,
                doc.internal.pageSize.height - 10
            );
            doc.text(
                "Year: " +
                    getCalendarWeekAndYear().year +
                    ", CalendarWeek: " +
                    getCalendarWeekAndYear().week,
                70,
                doc.internal.pageSize.height - 10
            );
        });

        doc.save(`report_week${getCalendarWeekAndYear().week}.pdf`);
    };

    //////////////////////////////////////////////////////////////
    const exportPdfBySupplier = () => {
        const doc = new jsPDF();
        const tableColumn = [
            "Id",
            "Date",
            "Weekday",
            "Time",
            "Class",
            "Location",
            "Teacher",
            "Purpose",
        ];
        const tableRows = [];

        filteredOrders
            .filter((order) => order.includeSummary)
            .map((order) => {
                const orderData = [
                    order.id,
                    order.date,
                    order.weekday,
                    order.time,
                    order.schoolClass,
                    order.location,
                    order.user.name,
                    order.purpose,
                ];
                tableRows.push(orderData);
            });

        doc.setFontSize(20);
        doc.text(
            "Orders from: " +
                formatDate(startDate) +
                " to: " +
                formatDate(endDate),
            20,
            15
        ); // Title
        doc.setFontSize(12);
        doc.text("ID: ", 15, 30); // Subtitle

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            didDrawPage: function (data) {
                doc.setFontSize(10);
                doc.text(
                    "Page " + doc.internal.getNumberOfPages(),
                    data.settings.margin.left,
                    doc.internal.pageSize.height - 10
                );
                doc.text(
                    "Year: " +
                        getCalendarWeekAndYear().year +
                        ", CalendarWeek: " +
                        getCalendarWeekAndYear().week,
                    data.settings.margin.left + 50,
                    doc.internal.pageSize.height - 10
                );
            },
        });

        doc.save(`report_week${getCalendarWeekAndYear().week}.pdf`);
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return "null";
        }
        const [year, month, day] = dateString.split("-");
        return `${day}.${month}.${year}`;
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
                                        onClick={exportPdfBySupplier}
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
                                            <Th>Time:</Th>
                                            <Th>Class:</Th>
                                            <Th>Location:</Th>
                                            <Th>Teacher:</Th>
                                            <Th>Purpose:</Th>
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
                                                    <Td>{order.time}</Td>
                                                    <Td>{order.schoolClass}</Td>
                                                    <Td>{order.location}</Td>
                                                    <Td>{order.user.name}</Td>
                                                    <Td>{order.purpose}</Td>
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default AllOrdersMain;
