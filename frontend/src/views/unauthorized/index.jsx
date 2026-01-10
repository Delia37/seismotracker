import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { FcCancel } from "react-icons/fc";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <FcCancel size={100} />
      </Box>
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Neautorizat
      </Heading>
      <Text color={"gray.500"}>Nu esti autorizat sa vezi aceasta pagina.</Text>
      <Button onClick={() => navigate("/")} mt={5}>
        Home
      </Button>
    </Box>
  );
}
