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

function NavBar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

    ///////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <div>
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
                    <DrawerBody>
                        <Link href={route('test-component')}>Test</Link>
                    </DrawerBody>
                    <DrawerFooter></DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

export default NavBar;
