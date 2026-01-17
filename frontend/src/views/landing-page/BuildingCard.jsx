import React from "react";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Heading,
  HStack,
<<<<<<< HEAD
=======
  IconButton,
>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
  Image,
  Spacer,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import {
  BsFill1CircleFill,
  BsFill2CircleFill,
  BsFill3CircleFill,
  BsFillPatchQuestionFill,
<<<<<<< HEAD
=======
  BsHeart,
  BsHeartFill,
>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
} from "react-icons/bs";

function getRisk(seismicRisk) {
  switch (seismicRisk) {
    case "RsI":
      return (
        <span>
          <BsFill1CircleFill color="red" size={30} />
        </span>
      );
    case "RsII":
      return (
        <span>
          <BsFill2CircleFill color="orange" size={30} />
        </span>
      );
    case "RsIII":
      return (
        <span>
          <BsFill3CircleFill color="yellow" size={30} />
        </span>
      );
    default:
      return <BsFillPatchQuestionFill />;
  }
}

export function BuildingCard({
  id,
  address,
  year,
  heightRegime,
  buildingStatus,
  sector,
  seismicRisk,
  seismicToolTip,
  thumbnail,
  navigate,
<<<<<<< HEAD
=======

  // NEW:
  isSaved,
  onToggleSave,
  canSave,
>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
}) {
  const currentYear = new Date().getFullYear();

  return (
    <Card
      maxW={"sm"}
      minHeight="30rem"
      size="md"
      _hover={{
        background: "pink",
        stroke: "blue",
      }}
      cursor="pointer"
      onClick={() => navigate(`/buildings/${id}`)}
<<<<<<< HEAD
    >
=======
      position="relative"
    >
      {/* NEW: Save button */}
      {canSave && (
        <Tooltip label={isSaved ? "Elimină din salvate" : "Salvează clădirea"}>
          <IconButton
            aria-label={isSaved ? "Unsave building" : "Save building"}
            icon={isSaved ? <BsHeartFill /> : <BsHeart />}
            position="absolute"
            top="10px"
            right="10px"
            zIndex={2}
            size="sm"
            variant="solid"
            onClick={(e) => {
              e.stopPropagation(); // să nu navigheze pe /buildings/:id
              onToggleSave(id, isSaved);
            }}
          />
        </Tooltip>
      )}

>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
      <CardBody>
        <Image src={thumbnail} alt="Building thumbnail" borderRadius="lg" />
        <Stack mt="6" spacing="3">
          <Heading size="md" color="teal.500">
            {address}
          </Heading>
          <Text fontSize="xl" color="teal.500">
            Sector {sector}
          </Text>
          <Text color="pink.600" fontSize="xl">
            {heightRegime}
          </Text>
          {localStorage.getItem("user") !== null && (
            <Text color="pink.600" fontSize="xl">
              Status: {buildingStatus}
            </Text>
          )}
        </Stack>
      </CardBody>
<<<<<<< HEAD
=======

>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
      <CardFooter>
        <Box>
          <Text color="teal.600" fontSize="xl">
            {year > currentYear || year < 1800 ? "Necunoscut" : year}
          </Text>
        </Box>
        <Spacer />
        <Box>
          <HStack>
            <Text color="teal.600">Clasa de risc:</Text>
            <Tooltip label={seismicToolTip}>{getRisk(seismicRisk)}</Tooltip>
          </HStack>
        </Box>
      </CardFooter>
    </Card>
  );
}

BuildingCard.propTypes = {
  id: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  heightRegime: PropTypes.string.isRequired,
  buildingStatus: PropTypes.string.isRequired,
  sector: PropTypes.number.isRequired,
  thumbnail: PropTypes.string.isRequired,
  seismicRisk: PropTypes.string.isRequired,
  seismicToolTip: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
<<<<<<< HEAD
=======

  // NEW:
  isSaved: PropTypes.bool,
  onToggleSave: PropTypes.func,
  canSave: PropTypes.bool,
};

BuildingCard.defaultProps = {
  isSaved: false,
  onToggleSave: () => {},
  canSave: false,
>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
};
