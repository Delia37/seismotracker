import { useNavigate } from "react-router-dom";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import PropTypes from "prop-types";

export default function AlreadyLogged({
  title,
  description,
  pathDescription,
  gotoPath,
}) {
  const navigate = useNavigate();
  return (
    <Flex
      flexDirection="column"
      align="center"
      justify="center"
      h="100%"
      py={10}
      px={6}
    >
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text"
        mb={8}
      >
        {title}
      </Heading>
      <Text color={"gray.500"} mb={6}>
        {description}
      </Text>

      <Button
        colorScheme="teal"
        color="white"
        variant="solid"
        onClick={() => navigate(gotoPath)}
      >
        {pathDescription}
      </Button>
    </Flex>
  );
}

AlreadyLogged.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  pathDescription: PropTypes.string.isRequired,
  gotoPath: PropTypes.string.isRequired,
};
