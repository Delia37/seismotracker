import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  useToast,
  Heading,
  Spinner,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Formik } from "formik";
import PropTypes from "prop-types";
import {
  InputControl,
  NumberInputControl,
  PercentComplete,
  SelectControl,
  SubmitButton,
} from "formik-chakra-ui";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function BuildingForm({ onSubmit, buildingId, ticketId }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);

  const { isLoading, data, error } = useQuery({
    queryKey: [`Building_${buildingId}`],
    queryFn: () =>
      fetch(`http://localhost:3000/buildings/${buildingId}`).then((res) =>
        res.json()
      ),
    enabled: !!buildingId, // NU face fetch dacă buildingId e falsy
  });

  if (isLoading)
    return (
      <Box p={15}>
        <Spinner />
      </Box>
    );

  if (error)
    return (
      <Box p={15} color="red.500">
        Error: {error.message || "Internal server error"}
      </Box>
    );

  if (!data)
    return (
      <Box p={15} color="gray.600">
        Cladirea nu există
      </Box>
    );

  const initialValues = {
    buildingYear: data.buildingYear || "",
    heightRegime: data.heightRegime || "",
    numApartments: data.numApartments || "",
    analysisYear: data.analysisYear || "",
    technicExpert: data.technicExpert || "",
    seismicRiskId: data.seismicRiskId || "",
    location: {
      street: data.location?.street || "",
      number: data.location?.number || "",
      sector: data.location?.sector || "",
    },
  };

  const sectors = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <Formik onSubmit={onSubmit} initialValues={initialValues}>
      {({ handleSubmit }) => (
        <Box
          borderWidth="1px"
          rounded="lg"
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          maxWidth={800}
          p={6}
          m="10px auto"
          as="form"
          onSubmit={handleSubmit}
        >
          <NumberInputControl name="buildingYear" label="Anul constructiei" />
          <InputControl name="heightRegime" label="Regim de inaltime" mt={2} />
          <NumberInputControl
            name="numApartments"
            label="Numarul de apartamente"
            mt={2}
          />
          <NumberInputControl
            name="analysisYear"
            label="Anul inspectiei"
            mt={2}
          />
          <InputControl
            name="technicExpert"
            label="Numele expertului tehnic"
            mt={2}
          />
          <SelectControl
            name="seismicRiskId"
            label="Riscul seismic"
            selectProps={{ placeholder: "Selectati riscul seismic" }}
            mt={2}
          >
            <option value={1}>Clasa de risc seismic I</option>
            <option value={2}>Clasa de risc seismic II</option>
            <option value={3}>Clasa de risc seismic III</option>
          </SelectControl>
          <InputControl name="location.street" label="Strada" mt={2} />
          <InputControl name="location.number" label="Numarul" mt={2} />
          <SelectControl
            name="location.sector"
            label="Sectorul"
            selectProps={{ placeholder: "Selectati sectorul" }}
            mt={2}
          >
            {sectors.map((sector) => (
              <option key={`sectorul_${sector}`} value={sector}>
                Sectorul {sector}
              </option>
            ))}
          </SelectControl>
          <PercentComplete />
          <SubmitButton
            bg="pink.500"
            mt={5}
            isLoading={buttonLoading}
            onClick={() => setButtonLoading(true)}
          >
            Trimite
          </SubmitButton>
        </Box>
      )}
    </Formik>
  );
}

export function TicketReview({ isOpen, onClose, buildingId, ticketId }) {
  // Dacă modalul nu e deschis sau nu există buildingId, nu montăm componenta
  if (!isOpen || !buildingId) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="800px" maxW="800px" p={10}>
        <Box
          display="block"
          bg="gray.100"
          h="full"
          w="full"
          mt={10}
          p={5}
          rounded="md"
          overflowY="auto"
        >
          <ModalCloseButton />
          <Heading mb={4}>Modifica o cladire</Heading>
          <BuildingForm
            buildingId={buildingId}
            ticketId={ticketId}
            onSubmit={() => {}}
          />
        </Box>
      </ModalContent>
    </Modal>
  );
}

TicketReview.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  buildingId: PropTypes.number.isRequired,
  ticketId: PropTypes.number.isRequired,
};
