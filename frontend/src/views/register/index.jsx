import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { Field, Formik } from "formik";
import { validateEmail } from "../login/index.jsx";
import AlreadyLogged from "../../components/already-logged/index.jsx";

function SendRegisterForm(values, toast, setHasRegistered) {
  fetch("http://localhost:3000/users", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  }).then(async (res) => {
    const parsedResponse = JSON.parse(await res.text());
    if (parsedResponse.statusCode === 409) {
      toast({
        position: "top",
        render: () => (
          <Box color="white" p={3} bg="pink.500" textAlign="center">
            Email already in use
          </Box>
        ),
      });
    } else {
      setHasRegistered(true);
    }
  });
}

export default function Register() {
  if (localStorage.getItem("user") !== null) {
    return AlreadyLogged({
      title: "Already logged in",
      description:
        "It seems that you are already logged in, if you want to create another account, log out first.",
      pathDescription: "Home",
      gotoPath: "/",
    });
  }
  const [hasRegistered, setHasRegistered] = useState(false);
  const toast = useToast();

  const { mutate, isLoading } = useMutation((variable) =>
    SendRegisterForm(variable, toast, setHasRegistered)
  );

  const onSubmit = (values, _) => {
    mutate(values);
  };

  return hasRegistered ? (
    <AlreadyLogged
      pathDescription="Go to login page"
      gotoPath="/login"
      description="You can now log in with your credentials"
      title="User created"
    />
  ) : (
    <Flex bg="gray.100" h="100vh" align="center" justify="center">
      <Box bg="white" p={10} rounded="md">
        <Heading mt={5}>Register a new account!</Heading>
        <Box my={8} textAlign="left">
          <Formik
            initialValues={{ fullName: "", email: "", password: "" }}
            onSubmit={onSubmit}
          >
            {({ handleSubmit, errors, touched, props }) => (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="flex-start">
                  <FormControl
                    isInvalid={!!errors.fullName && touched.fullName}
                  >
                    <FormLabel>Full name</FormLabel>
                    <Field
                      as={Input}
                      id="fullName"
                      name="fullName"
                      type="text"
                      variant="filled"
                      validate={(value) => {
                        let error;

                        if (value === "") {
                          error = "Name can't be empty";
                        }

                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.email && touched.email}>
                    <FormLabel htmlFor="email">Email Address</FormLabel>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      variant="filled"
                      validate={(value) => {
                        let error;
                        if (!validateEmail(value)) {
                          error = "Invalid email";
                        }
                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.password && touched.password}
                  >
                    <FormLabel htmlFor="psasword">Password</FormLabel>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      variant="filled"
                      validate={(value) => {
                        let error;

                        if (value === "") {
                          error = "Password can't be empty";
                        }

                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="teal"
                    width="full"
                    isLoading={isLoading}
                  >
                    Sign up
                  </Button>
                </VStack>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Flex>
  );
}
