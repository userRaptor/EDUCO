import React from "react";
import { Link } from '@inertiajs/inertia-react';

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from "@chakra-ui/react";

import { Button } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

// Inline CSS for hover effect
const linkStyle = {
    display: 'block',
    marginTop: '15px',
    marginLeft: '10px',
};

const hoverStyle = {
    fontWeight: 'bold', // Make text bold on hover
};

const hoverLinkStyle = `
    .link-hover:hover {
        font-weight: bold;
    }
`;

function NavBar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

    return (
        <div>
            <style>{hoverLinkStyle}</style>

            <IconButton
                aria-label="Open menu"
                icon={<HamburgerIcon boxSize={30} />}
                color="black"
                variant="ghost"
                onClick={onOpen}
                marginRight="20px"
                marginTop="15px"
            />

            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent style={{ backgroundColor: "orange" }}>
                    <DrawerCloseButton />
                    <DrawerHeader>Menu</DrawerHeader>
                    <DrawerBody style={{ marginTop: '10px' }}>
                        <Link href={route('test-component')} className="link-hover" style={linkStyle}>Test</Link>
                        <Link href={route('test-component')} className="link-hover" style={linkStyle}>New Order</Link>
                        <Link href={route('test-component')} className="link-hover" style={linkStyle}>My Orders</Link>
                        <Link href={route('test-component')} className="link-hover" style={linkStyle}>All Orders</Link>
                        <Link href={route('grocery-component')} className="link-hover" style={linkStyle}>Groceries</Link>
                        <Link href={route('test-component')} className="link-hover" style={linkStyle}>User Management</Link>
                    </DrawerBody>
                    <DrawerFooter></DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

export default NavBar;
