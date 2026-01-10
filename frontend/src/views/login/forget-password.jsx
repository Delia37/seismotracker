import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ThemeProvider,
  ChakraProvider,
  theme,
  Heading,
  CSSReset,
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

function ForgetPass() {
  return (
    <ThemeProvider theme={theme}>
      <ChakraProvider>
        <CSSReset />
        <ForgetPassArea />
      </ChakraProvider>
    </ThemeProvider>
  );
}

const ForgetPassHeader = () => {
  return (
    <Box textAling="center" mt={8}>
      <Heading>Forget your password?</Heading>
    </Box>
  );
};

const ForgetPassForm = () => {
  const navigate = useNavigate();
  return (
    <Box my={8} textAlign="left">
      {/* <Image src='https://i.imgur.com/LVQcifa.png' alt='Logo' position="absolute" top="5" left="5" /> */}
      <form>
        <FormControl>
          <FormLabel fontSize="20">Email Address</FormLabel>
          <Input type="email" placeholder="Enter your email address." />
        </FormControl>
        <Button
          variant="solid"
          colorScheme="teal"
          width="full"
          mt={4}
          onClick={() => navigate("/login")}
        >
          Send
        </Button>
      </form>
    </Box>
  );
};

const ForgetPassArea = () => {
  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <Box
        borderWidth={1}
        px={4}
        width="full"
        maxWidth="500px"
        borderRadius={4}
        textAlign="center"
        boxShadow="lg"
      >
        <Box p={4}>
          <ForgetPassHeader />
          <ForgetPassForm />
        </Box>
      </Box>
    </Flex>
  );
};

export default ForgetPass;
