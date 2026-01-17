import React from "react";
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
import { Field, Formik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AlreadyLogged from "../../components/already-logged/index.jsx";

async function SendLoginForm(values, toast, navigate) {
  fetch("http://localhost:3000/auth/login", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  }).then(async (res) => {
    const data = JSON.parse(await res.text());
    if (!("accessToken" in data)) {
      toast({
        position: "top",
        render: () => (
          <Box color="white" p={3} bg="pink.500" textAlign="center">
            Login failed:{" "}
            {data.message.includes("email")
              ? "Email not found!"
              : "Wrong password!"}
          </Box>
        ),
      });
    } else {
      localStorage.setItem("user", data.accessToken);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("isAdmin", data.isAdmin);
      toast.closeAll();
      navigate("/");
    }
  });
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default function Login() {
  if (localStorage.getItem("user") !== null) {
    return AlreadyLogged({
      title: "Already logged in",
      description:
        "It seems that you are already logged in, you can go to the home page.",
      pathDescription: "Home",
      gotoPath: "/",
    });
  }

  const toast = useToast();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation((variable) =>
    SendLoginForm(variable, toast, navigate)
  );

  const onSubmit = (values, _) => {
    mutate(values);
  };

  return (
    <Flex bg="gray.100" h="100vh" align="center" justify="center">
      <Box bg="white" p={10} rounded="md">
        <Heading mt={5}>Log in to your account!</Heading>
        <Box my={8} textAlign="left">
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={onSubmit}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="flex-start">
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
                    Login
                  </Button>
                  <Button
                    colorScheme="pink"
                    width="full"
                    onClick={() => navigate("/register")}
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
