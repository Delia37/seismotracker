import React from "react";
import { BuildingCard } from "./BuildingCard.jsx";
import { Box, Grid, GridItem, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function BuildingsGrid(buildings, navigate) {
  return (
    <Box mt={5}>
      <Grid templateColumns="repeat(5, 1fr)" gap={8}>
        {buildings.map((building) => (
          <GridItem key={building.id}>
            <BuildingCard
              id={building.id}
              address={
                building.location.street + " " + building.location.number
              }
              buildingStatus={building.buildingStatus}
              year={building.buildingYear}
              heightRegime={building.heightRegime}
              sector={building.location.sector}
              seismicRisk={building.seismicRisk.className}
              seismicToolTip={building.seismicRisk.description}
              thumbnail={building.location.thumbnail}
              navigate={navigate}
            />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { isLoading, data, error } = useQuery({
    queryKey: ["Building"],
    queryFn: () =>
      fetch("http://localhost:3000/buildings?skip=0&take=1000").then(
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

  return !isLoading && BuildingsGrid(data.buildings, navigate);
}
