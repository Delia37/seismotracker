import React, { useState } from "react";
import {
  Box,
  Button,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TicketReview } from "./TicketReview.jsx";

export default function Ticket() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const toast = useToast();
  const queryClient = useQueryClient();

  const [selectedTicket, setSelectedTicket] = useState(null);

  const queryKey = isAdmin ? ["tickets", "admin"] : ["tickets", "user", userId];
  const queryFn = () =>
    fetch(
      isAdmin
        ? "http://localhost:3000/tickets/admin/all"
        : `http://localhost:3000/tickets/user/${userId}`
    ).then((res) => res.json());

  const { isLoading, data, error } = useQuery({
    queryKey,
    queryFn,
  });

  const closeTicketMutation = useMutation(
    (ticketId) =>
      fetch(`http://localhost:3000/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isClosed: true }),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
        toast({
          title: "Ticket închis!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      },
      onError: (err) => {
        toast({
          title: "Eroare la închiderea ticketului",
          description: err.message || "Internal server error",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  if (isLoading)
    return (
      <Box p={15}>
        <Spinner />
      </Box>
    );

  if (error)
    return (
      <Box p={15} color="red.500">
        Eroare la încărcarea tichetelor: {error.message || "Internal server error"}
      </Box>
    );

  const ticketData = data || [];

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
            {isAdmin && <Th>Acțiuni</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {ticketData.map((ticket) => (
            <Tr key={ticket.id}>
              <Td>{ticket.title}</Td>
              <Td>{ticket.category}</Td>
              <Td>{ticket.description}</Td>
              <Td>
                <a href={ticket.docs} target="_blank" rel="noreferrer">
                  Documente
                </a>
              </Td>
              <Td>{ticket.isClosed ? "INCHIS" : "DESCHIS"}</Td>

              {isAdmin && (
                <Td>
                  {!ticket.isClosed ? (
                    <>
                      <Button
                        colorScheme="teal"
                        mr={2}
                        onClick={() => closeTicketMutation.mutate(ticket.id)}
                        isLoading={closeTicketMutation.isLoading}
                      >
                        Închide Ticket
                      </Button>
                      {/* Review doar dacă ticket-ul are buildingId */}
                      {ticket.buildingId && (
                        <Button
                          colorScheme="blue"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          Review Ticket
                        </Button>
                      )}
                    </>
                  ) : (
                    <Box color="gray.500">Nicio acțiune</Box>
                  )}
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* Modal montat doar dacă selectedTicket există și are buildingId */}
      {selectedTicket?.buildingId && (
        <TicketReview
          isOpen={true}
          onClose={() => setSelectedTicket(null)}
          buildingId={selectedTicket.buildingId}
          ticketId={selectedTicket.id}
        />
      )}
    </TableContainer>
  );
}
