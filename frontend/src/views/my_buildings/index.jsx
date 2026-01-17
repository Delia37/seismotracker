import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { FcMinus } from "react-icons/fc";
import { BuildingsGrid } from "../landing-page/index.jsx";
import { useNavigate } from "react-router-dom";

export default function MyBuildings() {
  const navigate = useNavigate();
  const { isLoading, data, error } = useQuery({
    queryKey: ["MyBuildings"],
    queryFn: () =>
      fetch(
        `http://localhost:3000/users/${localStorage.getItem(
          "userId"
        )}/added-buildings`,
        {
          method: "GET",
          mode: "cors",
          credentials: "same-origin",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user")}`,
            "Content-Type": "application/json",
          },
        }
      ).then(async (res) => res.json()),
  });

  if (isLoading || data === "undefined")
    return (
      <Box p={15}>
        <Spinner />
      </Box>
    );
  if (error) return "Error" + error.message;

  if (data.message.includes("not added any buildings")) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Box display="inline-block">
          <FcMinus size={100} />
        </Box>
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Nicio cladire gasita!
        </Heading>
        <Text color={"gray.500"}>
          Din pacate nu ati adaugat cladiri care sunt in curs de acceptare sau
          au fost acceptate.
        </Text>
      </Box>
    );
  }
  console.log(data);
  return (
    !isLoading &&
    data.addedBuildings !== undefined &&
    BuildingsGrid(data.addedBuildings, navigate)
  );
}
