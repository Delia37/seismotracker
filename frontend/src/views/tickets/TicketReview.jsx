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
import { useMutation, useQuery } from "@tanstack/react-query";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function PatchStatus(id, toast, navigate, setButtonLoading, adminId) {
  setButtonLoading(true);
<<<<<<< HEAD
  fetch(`http://localhost:3000/tickets/${id}`, {
    method: "PATCH",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isClosed: true, adminId: parseInt(adminId) }),
  }).then(async (res) => {
    const data = await res.text();

    if (data.includes("updated")) {
=======

  try {
    const res = await fetch(`http://localhost:3000/tickets/${id}`, {
      method: "PATCH",
      mode: "cors",
      credentials: "same-origin",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isClosed: true, adminId: parseInt(adminId) }),
    });

    const text = await res.text(); // poate fi JSON, dar nu ne trebuie conținutul

    if (res.ok) {
>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
      toast({
        position: "top",
        render: () => (
          <Box color="white" p={3} bg="teal.800" textAlign="center">
<<<<<<< HEAD
            Actualizarea a reusit! Vei fi redirectat la pagina de cladiri noi.
          </Box>
        ),
      });
      await sleep(3000);
      toast.closeAll();
      navigate("/new");
    } else {
=======
            Ticket închis cu succes!
          </Box>
        ),
      });
      await sleep(1500);
      toast.closeAll();
      // rămâi pe /tickets sau dă refresh la listă; eu te trimit înapoi pe /tickets
      navigate("/tickets");
    } else {
      // aici e eroare reală (401/500 etc)
>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
      toast({
        position: "top",
        render: () => (
          <Box color="white" p={3} bg="pink.800" textAlign="center">
<<<<<<< HEAD
            Internal server error!
          </Box>
        ),
      });
      await sleep(3000);
      setButtonLoading(false);
    }
  });
}
=======
            Eroare la închiderea ticket-ului: {text}
          </Box>
        ),
      });
      await sleep(2500);
      setButtonLoading(false);
    }
  } catch (e) {
    toast({
      position: "top",
      render: () => (
        <Box color="white" p={3} bg="pink.800" textAlign="center">
          Internal server error!
        </Box>
      ),
    });
    await sleep(2500);
    setButtonLoading(false);
  }
}


// async function PatchStatus(id, toast, navigate, setButtonLoading, adminId) {
//   setButtonLoading(true);
//   fetch(`http://localhost:3000/tickets/${id}`, {
//     method: "PATCH",
//     mode: "cors",
//     credentials: "same-origin",
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("user")}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ isClosed: true, adminId: parseInt(adminId) }),
//   }).then(async (res) => {
//     const data = await res.text();

//     if (data.includes("updated")) {
//       toast({
//         position: "top",
//         render: () => (
//           <Box color="white" p={3} bg="teal.800" textAlign="center">
//             Actualizarea a reusit! Vei fi redirectat la pagina de cladiri noi.
//           </Box>
//         ),
//       });
//       await sleep(3000);
//       toast.closeAll();
//       navigate("/new");
//     } else {
//       toast({
//         position: "top",
//         render: () => (
//           <Box color="white" p={3} bg="pink.800" textAlign="center">
//             Internal server error!
//           </Box>
//         ),
//       });
//       await sleep(3000);
//       setButtonLoading(false);
//     }
//   });
// }
>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
// eslint-disable-next-line react/prop-types
function BuildingForm({ onSubmit, buildingId, ticketId }) {
  const toast = useToast();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [buttonLoading, setButtonLoading] = useState(false);

  const { isLoading, data, error } = useQuery({
    queryKey: [`Building_${buildingId}`],
    queryFn: () =>
      fetch(`http://localhost:3000/buildings/${buildingId}`).then(async (res) =>
        res.json()
      ),
  });

  if (isLoading)
    return (
      <Box p={15}>
        <Spinner />
      </Box>
    );
  if (error) return "Error" + error.message;
  // eslint-disable-next-line no-unmodified-loop-condition

  const initialValues = {
    buildingYear: data.buildingYear,
    heightRegime: data.heightRegime,
    numApartments: data.numApartments,
    analysisYear: data.analysisYear,
    technicExpert: data.technicExpert,
    seismicRiskId: data.seismicRiskId,
    location: {
      street: data.location.street,
      number: data.location.number,
      sector: data.location.sector,
    },
  };

  const sectors = [];
  for (let i = 1; i <= 6; i++) {
    sectors.push(i);
  }
  return (
    <Formik onSubmit={onSubmit} initialValues={initialValues}>
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
          <SubmitButton
            bg="pink.500"
            mt={5}
            onClick={() =>
              PatchStatus(
                ticketId,
                toast,
                navigate,
                setButtonLoading,
                localStorage.getItem("userId")
              )
            }
          >
            Trimite
          </SubmitButton>
        </Box>
      )}
    </Formik>
  );
}

async function SendBuildingForm(values, toast, navigate, id) {
  fetch(`http://localhost:3000/buildings/${id}`, {
    method: "PATCH",
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
            Editarea a reusit! Vei fi redirectat la Home!
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
    }
  });
}
export function TicketReview({
  isOpen,
  onClose,
  onOpen,
  buildingId,
  ticketId,
}) {
  const toast = useToast();
  const navigate = useNavigate();
  const { mutate } = useMutation((variable) =>
    SendBuildingForm(variable, toast, navigate, buildingId)
  );
  const onSubmit = (values, { setSubmitting }) => {
    values.buildingYear = parseInt(values.buildingYear);
    values.analysisYear = parseInt(values.analysisYear);
    values.seismicRiskId = parseInt(values.seismicRiskId);
    values.numApartments = parseInt(values.numApartments);
    values.location.sector = parseInt(values.location.sector);

    values.userId = parseInt(localStorage.getItem("userId"));
    mutate(values);

    Object.keys(values).forEach((key) => {
      if (values[key] === "") {
        delete values[key];
      }
      if (key === "location") {
        if (values[key].street === "") {
          delete values[key];
        }
      }
    });
    sleep(4000).then(() => setSubmitting(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
          overflowY="scroll"
        >
          <ModalCloseButton />
          <Heading>Modifica o cladire</Heading>
          <BuildingForm
            onSubmit={onSubmit}
            buildingId={buildingId}
            ticketId={ticketId}
          />
        </Box>
      </ModalContent>
    </Modal>
  );
}

TicketReview.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  buildingId: PropTypes.number.isRequired,
  ticketId: PropTypes.number.isRequired,
};
