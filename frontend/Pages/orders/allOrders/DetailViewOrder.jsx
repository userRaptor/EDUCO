import React from "react";

import { Button } from "@chakra-ui/react";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";

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

function DetailViewOrder({ order }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div>
            <Button colorScheme="transparent" color="black" onClick={onOpen}>
                {<ArrowDownIcon />}
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="80%">
                    <ModalHeader>
                        Included Groceries in the order: {order.purpose}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <TableContainer>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Name:</Th>
                                        <Th>Quantity:</Th>
                                        <Th>Unit:</Th>
                                        <Th>Category</Th>
                                        <Th>Supplier:</Th>
                                        <Th>Comment:</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {order.groceries ? (
                                        order.groceries.map((grocery) => (
                                            <Tr key={grocery.pivot.id}>
                                                <Td>{grocery.name}</Td>
                                                <Td>
                                                    {grocery.pivot.quantity}
                                                </Td>
                                                <Td>{grocery.unit}</Td>
                                                <Td>{grocery.category}</Td>
                                                <Td>{grocery.supplier}</Td>
                                                <Td>{grocery.pivot.comment}</Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <p>No groceries for this order.</p>
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default DetailViewOrder;
