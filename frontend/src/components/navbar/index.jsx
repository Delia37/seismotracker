import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  HStack,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FcCustomerSupport,
  FcDepartment,
  FcIdea,
  FcLike,
  FcOrganization,
  FcPlus,
} from "react-icons/fc";
import { GrMapLocation } from "react-icons/gr";
import PropTypes from "prop-types";
import { Field, Formik } from "formik";
import { FcBarChart } from "react-icons/fc";


const navbarItems = [
  {
    label: "Vizualizare",
    icon: <FcDepartment />,
    page: "/",
    shouldBeLoggedIn: false,
    shouldBeAdmin: false,
  },
  {
    label: "Adaugare",
    icon: <FcPlus />,
    page: "/add",
    shouldBeLoggedIn: true,
    shouldBeAdmin: false,
  },
  {
    label: "Harta",
    icon: <GrMapLocation />,
    page: "/map",
    shouldBeLoggedIn: false,
    shouldBeAdmin: false,
  },
  {
    label: "Cladirile mele",
    icon: <FcOrganization />,
    page: "/my_buildings",
    shouldBeLoggedIn: true,
    shouldBeAdmin: false,
  },
  {
    label: "Salvate",
    icon: <FcLike />,
    page: "/saved",
    shouldBeLoggedIn: true,
    shouldBeAdmin: false,
  },
  {
    label: "Tichete",
    icon: <FcCustomerSupport />,
    page: "/tickets",
    shouldBeLoggedIn: true,
    shouldBeAdmin: false,
  },
  {
    label: "Cladiri noi",
    icon: <FcIdea />,
    page: "/new",
    shouldBeLoggedIn: true,
    shouldBeAdmin: true,
  },
  {
    label: "Dashboard",
    icon: <FcBarChart />,
    page: "/dashboard",
    shouldBeLoggedIn: true,
    shouldBeAdmin: true,
  },

];

function renderSearchButton(navigate) {
  const location = useLocation();
  const navigatePath = location.pathname.includes("map")
    ? "/map/search"
    : "/search";
  const onSubmit = (values, { resetForm }) => {
    const searchParams = new URLSearchParams();
    searchParams.append("search", values.search);
    resetForm();
    navigate(`${navigatePath}/${searchParams.toString()}`);
  };
  return (
    <Formik initialValues={{ search: "" }} onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <FormControl mb={1}>
            <Field
              bg="white"
              as={Input}
              id="search"
              name="search"
              type="text"
              variant="flushed"
              placeholder="Search..."
              p={3}
            />
          </FormControl>
        </form>
      )}
    </Formik>
  );
}

function renderNavButtons(navigate, isLoggedIn, isAdmin) {
  const location = useLocation();
  let items;
  if (!isLoggedIn) {
    items = navbarItems.filter((item) => item.shouldBeLoggedIn === false);
  } else if (!isAdmin) {
    items = navbarItems.filter((item) => item.shouldBeAdmin === false);
  } else {
    items = navbarItems;
  }

  return (
    <HStack spacing="5">
      {items.map((item) => (
        <Button
          variant="solid"
          colorScheme={
            location.pathname === item.page ||
            (item.page !== "/" && location.pathname.includes(item.page))
              ? "pink"
              : "gray"
          }
          key={item.label}
          onClick={() => navigate(item.page)}
        >
          <HStack>
            <Box>{item.icon}</Box>
            <Box>{item.label}</Box>
          </HStack>
        </Button>
      ))}
    </HStack>
  );
}

function renderLoginButtons(navigate, isLoggedIn) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  return (
    <>
      {isLoggedIn ? (
        <>
          <Button colorScheme="pink" variant="solid" onClick={onOpen}>
            Log out
          </Button>
          <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
          >
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader>Sign out?</AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                Are you sure you want to sign out?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  No
                </Button>
                <Button
                  colorScheme="pink"
                  ml={3}
                  onClick={() => {
                    localStorage.removeItem("user");
                    navigate(0);
                  }}
                >
                  Yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <HStack spacing="5">
          <Button
            onClick={() => navigate("/login")}
            colorScheme="gray"
            variant="solid"
          >
            Log in
          </Button>
          <Button
            onClick={() => navigate("/register")}
            colorScheme="pink"
            variant="solid"
          >
            Sign up
          </Button>
        </HStack>
      )}
    </>
  );
}

function DesktopNavbar({ isLoggedIn, isAdmin }) {
  const navigate = useNavigate();
  return (
    <Heading bgGradient="linear(to-r, teal.400, teal.600)">
      <Flex w="100%" px="6" py="5" align="center" justify="space-between">
        {renderNavButtons(navigate, isLoggedIn, isAdmin)}
        {renderSearchButton(navigate)}
        {renderLoginButtons(navigate, isLoggedIn)}
      </Flex>
    </Heading>
  );
}

export default function Navbar() {
  const isLoggedIn = localStorage.getItem("user") !== null;
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return (
    <>
      <DesktopNavbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
    </>
  );
}

DesktopNavbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};
