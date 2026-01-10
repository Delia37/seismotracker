import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BuildingsGrid } from "../landing-page/index.jsx";
import { FcNoIdea } from "react-icons/fc";

export default function NewBuildings() {
  const navigate = useNavigate();
  const { isLoading, data, error } = useQuery({
    queryKey: ["pendingBuildings"],
    queryFn: () =>
      fetch("http://localhost:3000/buildings/pending?skip=0&take=1000").then(
        async (res) => res.json()
      ),
  });

  if (isLoading || data === "undefined")
    return (
      <Box p={15}>
        <Spinner />
      </Box>
    );
  if (error) return "Error" + error.message;

  if (data !== "undefined" && data.length === 0) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Box display="inline-block">
          <FcNoIdea size={100} />
        </Box>
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Nu sunt cladiri noi!
        </Heading>
        <Text color={"gray.500"}>Din pacate nu au mai fost adaugate.</Text>
      </Box>
    );
  }
  return !isLoading && BuildingsGrid(data.buildings, navigate);
}
