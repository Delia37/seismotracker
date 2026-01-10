import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { BuildingsGrid } from "../landing-page/index.jsx";
import { MapViewSeachedBuildings } from "../map-view/index.jsx";
import { InfoIcon } from "@chakra-ui/icons";
import { useJsApiLoader } from "@react-google-maps/api";

export default function Search({ displayMap }) {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  console.log(map);
  const navigate = useNavigate();
  const { search } = useParams();
  const address = search.slice("search=".length).replaceAll("+", " ");
  const urlParams = address.replaceAll(" ", "%20");
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerMap, setMarkerMap] = useState({});
  const states = {
    selectedPlace,
    setSelectedPlace,
    infoOpen,
    setInfoOpen,
    markerMap,
    setMarkerMap,
  };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBM4CEzkbnWFZ84JceDEzWncHQJTApSnOI",
    libraries: ["places"],
  });

  const { isLoading, data, error } = useQuery({
    queryKey: [address],
    queryFn: () =>
      fetch(`http://localhost:3000/buildings/search?q=${urlParams}`).then(
        async (res) => res.json()
      ),
  });

  if (!isLoaded || isLoading || data === "undefined")
    return (
      <Box p={15}>
        <Spinner />
      </Box>
    );
  if (error) return "Error" + error.message;

  const parsedBuildings = [];
  for (const dataItem of data.buildings) {
    if ("item" in dataItem) {
      if ("item" in dataItem.item) {
        parsedBuildings.push(dataItem.item.item);
      } else {
        parsedBuildings.push(dataItem.item);
      }
    } else {
      parsedBuildings.push(dataItem.item);
    }
  }

  if (parsedBuildings.length === 0) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <InfoIcon boxSize={"50px"} color={"blue.500"} />
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Can not find any building
        </Heading>
        <Text color={"gray.500"}>Perhaps, you can try another address?</Text>
      </Box>
    );
  }
  if (displayMap) {
    return (
      !isLoading &&
      MapViewSeachedBuildings(
        parsedBuildings,
        navigate,
        setMap,
        undefined,
        states
      )
    );
  }

  return !isLoading && BuildingsGrid(parsedBuildings, navigate);
}

Search.propTypes = {
  displayMap: PropTypes.bool.isRequired,
};
