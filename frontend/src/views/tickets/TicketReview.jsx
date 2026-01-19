import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  useToast,
  Heading,
  Spinner,
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
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Componenta pentru Formular
function BuildingForm({ onSubmit, buildingId }) {
  const { isLoading, data, error } = useQuery({
    queryKey: [`Building_${buildingId}`],
    queryFn: () =>
      fetch(`http://localhost:3000/buildings/${buildingId}`).then((res) =>
        res.json()
      ),
    enabled: !!buildingId,
  });

  if (isLoading)
    return (
      <Box p={5} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );

  if (error)
    return (
      <Box p={5} color="red.500">
        Eroare: {error.message || "Internal server error"}
      </Box>
    );

  if (!data)
    return (
      <Box p={5} color="gray.600">
        Clădirea nu există.
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
        <Box as="form" onSubmit={handleSubmit} p={2}>
          <NumberInputControl name="buildingYear" label="Anul construcției" />
          <InputControl name="heightRegime" label="Regim de înălțime" mt={4} />
          <NumberInputControl
            name="numApartments"
            label="Numărul de apartamente"
            mt={4}
          />
          <NumberInputControl
            name="analysisYear"
            label="Anul inspecției"
            mt={4}
          />
          <InputControl
            name="technicExpert"
            label="Numele expertului tehnic"
            mt={4}
          />
          <SelectControl
            name="seismicRiskId"
            label="Riscul seismic"
            selectProps={{ placeholder: "Selectați riscul seismic" }}
            mt={4}
          >
            <option value={1}>Clasa de risc seismic I</option>
            <option value={2}>Clasa de risc seismic II</option>
            <option value={3}>Clasa de risc seismic III</option>
          </SelectControl>
          
          <Box mt={6} p={4} bg="gray.50" rounded="md">
            <Heading size="sm" mb={3}>Locație</Heading>
            <InputControl name="location.street" label="Strada" />
            <InputControl name="location.number" label="Numărul" mt={2} />
            <SelectControl
              name="location.sector"
              label="Sectorul"
              selectProps={{ placeholder: "Selectați sectorul" }}
              mt={2}
            >
              {sectors.map((sector) => (
                <option key={`sectorul_${sector}`} value={sector}>
                  Sectorul {sector}
                </option>
              ))}
            </SelectControl>
          </Box>

          <Box mt={6}>
            <PercentComplete />
            <SubmitButton
              colorScheme="pink"
              w="full"
              mt={4}
            >
              Salvează și Închide Tichetul
            </SubmitButton>
          </Box>
        </Box>
      )}
    </Formik>
  );
}

// Componenta pentru Modal (Exportată)
export function TicketReview({ isOpen, onClose, buildingId, ticketId }) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleUpdate = async (values, actions) => {
    try {
      // 1. Trimitem update-ul pentru CLĂDIRE
      const responseBuilding = await fetch(`http://localhost:3000/buildings/${buildingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          seismicRiskId: parseInt(values.seismicRiskId, 10),
          buildingYear: parseInt(values.buildingYear, 10),
          analysisYear: parseInt(values.analysisYear, 10),
          numApartments: parseInt(values.numApartments, 10),
          location: {
            ...values.location,
            sector: parseInt(values.location.sector, 10)
          }
        }),
      });

      if (!responseBuilding.ok) throw new Error("Eroare la actualizarea clădirii");

      // 2. Trimitem update-ul pentru TICHET (setăm isClosed: true)
      const responseTicket = await fetch(`http://localhost:3000/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isClosed: true
        }),
      });

      if (!responseTicket.ok) throw new Error("Clădirea a fost salvată, dar tichetul nu a putut fi închis.");

      toast({
        title: "Succes!",
        description: "Clădirea a fost actualizată și tichetul a fost închis.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reîmprospătăm lista de tichete pentru a vedea statusul "INCHIS"
      queryClient.invalidateQueries(["tickets"]);
      
      onClose(); // Închidem modalul
    } catch (error) {
      toast({
        title: "Eroare la procesare",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  if (!isOpen || !buildingId) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl" 
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader borderBottomWidth="1px">
          Revizuire Tichet - Detalii Clădire
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody p={6}>
          <BuildingForm
            buildingId={buildingId}
            ticketId={ticketId}
            onSubmit={handleUpdate}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

BuildingForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  buildingId: PropTypes.number.isRequired,
  ticketId: PropTypes.number,
};

TicketReview.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  buildingId: PropTypes.number.isRequired,
  ticketId: PropTypes.number.isRequired,
};