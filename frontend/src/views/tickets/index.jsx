import React from "react";
import {
  Box,
  Button,
  Spinner,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { TicketReview } from "./TicketReview.jsx";
export default function Ticket() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin");

  //const isAdmin = localStorage.getItem("isAdmin") === "true";

  const { isOpen, onOpen, onClose } = useDisclosure();
  let ticketData;
  if (isAdmin === true) {
    const { isLoading, data, error } = useQuery({
      queryKey: ["Ticket"],
      queryFn: () =>
        fetch("http://localhost:3000/tickets").then(async (res) => res.json()),
    });

    if (isLoading || data === "undefined")
      return (
        <Box p={15}>
          <Spinner />
        </Box>
      );
    if (error) return "Error" + error.message;
    ticketData = data;
  } else {
    const { isLoading, data, error } = useQuery({
      queryKey: ["Ticket_user"],
      queryFn: () =>
        fetch(`http://localhost:3000/tickets/${userId}`).then(async (res) =>
          res.json()
        ),
    });

    if (isLoading || data === "undefined")
      return (
        <Box p={15}>
          <Spinner />
        </Box>
      );
    if (error) return "Error" + error.message;
    ticketData = data;
  }

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Titlu</Th>
            <Th>Categorie</Th>
            <Th>Descriere</Th>
            <Th>Link-uri catre informatii</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ticketData.map((ticket) => (
            <Tr key={ticket.id}>
              <Td>{ticket.title}</Td>
              <Td>{ticket.category}</Td>
              <Td>{ticket.description}</Td>
              <Td>
                <a href={ticket.docs}>Documente</a>
              </Td>
              <Td> {ticket.isClosed ? "INCHIS" : "DESCHIS"}</Td>
              {isAdmin === "true" && !ticket.isClosed && (
                <Td>
                  <Button colorScheme="teal" onClick={onOpen}>
                    Review Ticket
                  </Button>
                  <TicketReview
                    isOpen={isOpen}
                    onClose={onClose}
                    onOpen={onOpen}
                    buildingId={ticket.buildingId}
                    ticketId={ticket.id}
                  />
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
