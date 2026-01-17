import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { TicketModal } from "./TicketModal.jsx";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaMap } from "react-icons/fa";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function PatchStatus(id, toast, navigate, setButtonLoading) {
  setButtonLoading(true);
  fetch(`http://localhost:3000/buildings/${id}/status`, {
    method: "PATCH",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ buildingStatus: "active" }),
  }).then(async (res) => {
    const data = await res.text();

    if (data.includes("updated")) {
      toast({
        position: "top",
        render: () => (
          <Box color="white" p={3} bg="teal.800" textAlign="center">
            Actualizarea a reusit! Vei fi redirectat la pagina de cladiri noi.
          </Box>
        ),
      });
      await sleep(3000);
      toast.closeAll();
      navigate("/new");
    } else {
      toast({
        position: "top",
        render: () => (
          <Box color="white" p={3} bg="pink.800" textAlign="center">
            Internal server error!
          </Box>
        ),
      });
      await sleep(3000);
      setButtonLoading(false);
    }
  });
}

async function DeleteBuilding(id, toast, navigate, setButtonLoading) {
  setButtonLoading(true);
  fetch(`http://localhost:3000/buildings/${id}`, {
    method: "DELETE",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ buildingStatus: "active" }),
  }).then(async (res) => {
    const data = await res.text();

    if (data.includes("deleted")) {
      toast({
        position: "top",
        render: () => (
          <Box color="white" p={3} bg="teal.800" textAlign="center">
            Cladirea a fost stearsa. Vei fi redirectionat la pagina de cladiri
            noi.
          </Box>
        ),
      });
      await sleep(3000);
      toast.closeAll();
      navigate("/new");
    } else {
      toast({
        position: "top",
        render: () => (
          <Box color="white" p={3} bg="pink.800" textAlign="center">
            Internal server error!
          </Box>
        ),
      });
      await sleep(3000);
      setButtonLoading(false);
    }
  });
}

export default function InfoPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);
  const { id } = useParams();
  const {
    isOpen: approveIsOpen,
    onOpen: approveOnOpen,
    onClose: approveOnClose,
  } = useDisclosure();
  const cancelRef = React.useRef();
  const {
    isOpen: denyIsOpen,
    onOpen: denyOnOpen,
    onClose: denyOnClose,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoading, data, error } = useQuery({
    queryKey: [`Building_${id}`],
    queryFn: () =>
      fetch(`http://localhost:3000/buildings/${id}`).then(async (res) =>
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
  return (
    <Stack minW="100vw">
      <Center>
        <Card maxW="lg">
          <CardBody>
            <Image
              src={data.location.thumbnail}
              alt="Green double couch with wooden legs"
              borderRadius="lg"
            />
            <Stack mt="6" spacing="3">
              <Heading size="md">
                {data.location.street} Nr.{data.location.number} Sector{" "}
                {data.location.sector}
              </Heading>
              <Text>Anul constructiei: {data.buildingYear}</Text>
              <Text>Regim de inaltime: {data.heightRegime}</Text>
              <Text>Numar de apartamente: {data.numApartments}</Text>
              {localStorage.getItem("user") !== null && (
                <Text>
                  Status:{" "}
                  {data.buildingStatus.charAt(0).toUpperCase() +
                    data.buildingStatus.slice(1)}
                </Text>
              )}
              <Text>Anul expertizei: {data.analysisYear}</Text>
              <Text>Expertul tehnic: {data.technicExpert}</Text>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <Text>
              Risc seismic: {data.seismicRisk.className},{" "}
              {data.seismicRisk.description}
            </Text>
          </CardFooter>
          <>
            <Button colorScheme="teal" width="full" onClick={onOpen}>
              Creeaza Tichet
            </Button>
            <TicketModal
              isOpen={isOpen}
              onClose={onClose}
              onOpen={onOpen}
              id={id}
            />
          </>
          <Button leftIcon={<FaMap />} onClick={() => navigate(`/map/${id}`)}>
            Vizualizeaza pe harta
          </Button>
        </Card>
      </Center>
      <Center>
        {data.buildingStatus === "pending" &&
          localStorage.getItem("isAdmin") === "true" && (
            <ButtonGroup>
              <Button
                size="lg"
                colorScheme="teal"
                w="10rem"
                onClick={approveOnOpen}
              >
                Aproba
              </Button>
              <AlertDialog
                isOpen={approveIsOpen}
                leastDestructiveRef={cancelRef}
                onClose={approveOnClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Aproba cladirea
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Esti sigur? Nu se poate da undo!
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button
                        ref={cancelRef}
                        onClick={approveOnClose}
                        disabled={buttonLoading}
                      >
                        Renunta
                      </Button>
                      <Button
                        colorScheme="teal"
                        ml={3}
                        isLoading={buttonLoading}
                        onClick={() =>
                          PatchStatus(id, toast, navigate, setButtonLoading)
                        }
                      >
                        Aproba
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>

              <Button
                size="lg"
                colorScheme="pink"
                w="10rem"
                onClick={denyOnOpen}
              >
                Respinge
              </Button>
              <AlertDialog
                isOpen={denyIsOpen}
                leastDestructiveRef={cancelRef}
                onClose={denyOnClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Respinge adaugarea cladirii
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Esti sigur? Nu se poate da undo!
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button
                        ref={cancelRef}
                        onClick={denyOnClose}
                        disabled={buttonLoading}
                      >
                        Renunta
                      </Button>
                      <Button
                        colorScheme="pink"
                        ml={3}
                        isLoading={buttonLoading}
                        onClick={() =>
                          DeleteBuilding(id, toast, navigate, setButtonLoading)
                        }
                      >
                        Respinge
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </ButtonGroup>
          )}
      </Center>
    </Stack>
  );
}
