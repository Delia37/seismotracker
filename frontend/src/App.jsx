import React from "react";

import "./App.css";
import Routes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, Container } from "@chakra-ui/react";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Container maxWidth="0" minHeight="100vh" minWidth="100vw">
          <Routes />
        </Container>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
