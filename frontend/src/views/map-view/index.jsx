import { Box, Flex, SkeletonText, Spinner } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// eslint-disable-next-line camelcase
const default_center = { lat: 44.4341385, lng: 26.0994483 };

export function MapViewSeachedBuildings(
  buildings,
  navigate,
  setMap,
  id,
  states
) {
  const {
    selectedPlace,
    setSelectedPlace,
    infoOpen,
    setInfoOpen,
    markerMap,
    setMarkerMap,
  } = states;

  const myStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#193341",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        {
          color: "#2c5a71",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#29768a",
        },
        {
          lightness: -37,
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#406d80",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [
        {
          color: "#406d80",
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#3e606f",
        },
        {
          weight: 2,
        },
        {
          gamma: 0.84,
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          weight: 0.6,
        },
        {
          color: "#1a3541",
        },
      ],
    },
    {
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#2c5a71",
        },
      ],
    },
  ];

  if (id !== undefined) {
    const center = buildings.find(
      (building) => building.id === parseInt(id)
    ).location;
    // eslint-disable-next-line camelcase
    default_center.lat = center.latitude;
    // eslint-disable-next-line camelcase
    default_center.lng = center.longitude;
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          // eslint-disable-next-line camelcase
          center={default_center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            clickableIcons: false,
            styles: myStyles,
          }}
          onLoad={(map) => setMap(map)}
        >
          {buildings.map((building) => (
            <MarkerF
              key={building.id}
              label={building.seismicRisk.className}
              animation={window.google.maps.Animation.DROP}
              onLoad={(marker) => {
                setMarkerMap((prevState) => {
                  return { ...prevState, [building.id]: marker };
                });
                const customIcon = (opts) =>
                  Object.assign(
                    {
                      path: "M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z",
                      fillColor: "#34495e",
                      fillOpacity: 1,
                      strokeColor: "#000",
                      strokeWeight: 1,
                      scale: 1,
                    },
                    opts
                  );

                if (id !== undefined && parseInt(id) === building.id) {
                  marker.setIcon(
                    customIcon({
                      fillColor: "blue",
                      strokeColor: "white",
                    })
                  );
                }
              }}
              onClick={() => navigate(`/buildings/${building.id}`)}
              onMouseOver={() => {
                setSelectedPlace(building);

                if (infoOpen === true) {
                  setInfoOpen(false);
                }

                setInfoOpen(true);
              }}
              onMouseOut={() => {
                setSelectedPlace(null);
                setInfoOpen(false);
              }}
              position={{
                lat: parseFloat(building.location.latitude),
                lng: parseFloat(building.location.longitude),
              }}
            />
          ))}

          {infoOpen === true && selectedPlace && (
            <InfoWindowF
              anchor={markerMap[selectedPlace.id]}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div>
                <h3>
                  {selectedPlace.location.street +
                    " " +
                    selectedPlace.location.number}
                </h3>
                <img
                  src={selectedPlace.location.thumbnail}
                  width={150}
                  height={200}
                ></img>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      </Box>
    </Flex>
  );
}

export default function MapView() {
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

  const navigate = useNavigate();
  const { id } = useParams();
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  console.log(map);
  const { isLoading, data, error } = useQuery({
    queryKey: [`map_${id}`],
    queryFn: () =>
      fetch("http://localhost:3000/buildings?skip=0&take=300").then(
        async (res) => res.json()
      ),
  });
const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  libraries: ["places"],
});


  if (!isLoaded) {
    return <SkeletonText />;
  }

  if (isLoading || data === "undefined")
    return (
      <Box p={15}>
        <Spinner />
      </Box>
    );
  if (error) return "Error" + error.message;

  return (
    !isLoading &&
    data !== undefined &&
    MapViewSeachedBuildings(data.buildings, navigate, setMap, id, states)
  );
}
