import React from "react";
import * as Yup from "yup";
import { Box, Center, Heading, useToast } from "@chakra-ui/react";
import { Formik } from "formik";
import {
  InputControl,
  NumberInputControl,
  PercentComplete,
  SelectControl,
  SubmitButton,
} from "formik-chakra-ui";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const year = new Date().getFullYear();

const validationSchema = Yup.object({
  buildingYear: Yup.number()
    .required(`Anul constructiei trebuie sa fie intre 1000 si ${year}`)
    .min(1000)
    .max(year),
  heightRegime: Yup.string().required("Regimul de inaltime este necesar"),
  numApartments: Yup.number()
    .required("Numarul de apartamente nu poate fi negativ")
    .min(0),
  analysisYear: Yup.number()
    .required(`Anul expertizei trebuie sa fie intre 1900 si ${year}`)
    .min(1900)
    .max(year),
  technicExpert: Yup.string().required(`Numele expertului tehnic este necesar`),
  seismicRiskId: Yup.number().required(`Clasa de risc este necesara`),
  location: Yup.object({
    street: Yup.string().required(`Strada este necesara`),
    number: Yup.string().required(`Numarul este necesar`),
    sector: Yup.number().required(`Sectorul este necesar`),
  }),
});

const initialValues = {
  buildingYear: year,
  heightRegime: "",
  numApartments: 0,
  analysisYear: year,
  technicExpert: "",
  seismicRiskId: "",
  location: {
    street: "",
    number: "",
    sector: "",
  },
};

function BuildingForm({ onSubmit }) {
  const sectors = [];
  for (let i = 1; i <= 6; i++) {
    sectors.push(i);
  }
  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({ handleSubmit, values, errors }) => (
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
          <SubmitButton bg="pink.500" mt={5}>
            Trimite
          </SubmitButton>
        </Box>
      )}
    </Formik>
  );
}

async function SendBuildingForm(values, toast, navigate) {
  fetch("http://localhost:3000/buildings", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  }).then(async (res) => {
    const response = JSON.parse(await res.text());
    if (response.statusCode === 200) {
      toast({
        position: "top",
        render: () => (
          <Box color="white" p={3} bg="teal.800" textAlign="center">
            Adaugarea a reusit! Cladirea va fi disponibila dupa ce va fi
            aprobata. Vei fi redirectat la Home!
          </Box>
        ),
      });
      await sleep(3000);
      toast.closeAll();
      navigate("/");
    } else if (response.statusCode === 409) {
      toast({
        position: "top",
        render: () => (
          <Box color="white" p={3} bg="pink.500" textAlign="center">
            Locatia este deja folosita!
          </Box>
        ),
      });
    } else {
      toast({
        position: "top",
        render: () => (
          <Box color="white" p={3} bg="pink.500" textAlign="center">
            Internal server error!
          </Box>
        ),
      });
    }
  });
}

export default function AddBuilding() {
  const toast = useToast();
  const navigate = useNavigate();
  const { mutate } = useMutation((variable) =>
    SendBuildingForm(variable, toast, navigate)
  );
  const onSubmit = (values, { setSubmitting }) => {
    values.buildingYear = parseInt(values.buildingYear);
    values.analysisYear = parseInt(values.analysisYear);
    values.seismicRiskId = parseInt(values.seismicRiskId);
    values.numApartments = parseInt(values.numApartments);
    values.location.sector = parseInt(values.location.sector);

    values.userId = parseInt(localStorage.getItem("userId"));
    mutate(values);

    sleep(4000).then(() => setSubmitting(false));
  };
  return (
    <Center height="85vh">
      <Box
        h="85vh"
        display="block"
        bg="gray.100"
        width="40rem"
        mt={10}
        p={5}
        rounded="md"
        overflowY="scroll"
      >
        <Heading>Adauga o cladire</Heading>
        <BuildingForm onSubmit={onSubmit} />
      </Box>
    </Center>
  );
}

BuildingForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
