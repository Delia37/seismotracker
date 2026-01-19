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
  Text,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TicketReview } from "./TicketReview.jsx";

export default function Ticket() {
  // Preluăm datele din localStorage
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Configurăm cheia și funcția de fetch în funcție de rol
  const queryKey = isAdmin ? ["tickets", "admin"] : ["tickets", "user", userId];
  
  const queryFn = () =>
    fetch(
      isAdmin
        ? "http://localhost:3000/tickets" // Ruta findAll() din controller
        : `http://localhost:3000/tickets/${userId}` // Ruta findAllForUser() din controller
    )
      .then((res) => {
        if (!res.ok) throw new Error("Eroare la comunicarea cu serverul");
        return res.json();
      })
      .then((jsonData) => {
        console.log("DEBUG DATA:", jsonData);
        return jsonData;
      });

  const { isLoading, data, error } = useQuery({
    queryKey,
    queryFn,
    enabled: !!userId, // Nu face cererea dacă userId lipsește
  });

  // Mutația pentru închiderea simplă a unui ticket (fără review)
  const closeTicketMutation = useMutation({
    mutationFn: (ticketId) =>
      fetch(`http://localhost:3000/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isClosed: true }),
      }).then((res) => {
        if (!res.ok) throw new Error("Eroare la închidere");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
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
  });

  if (isLoading)
    return (
      <Box p={15} textAlign="center">
        <Spinner size="xl" color="pink.500" />
        <Text mt={4}>Se încarcă tichetele...</Text>
      </Box>
    );

  if (error)
    return (
      <Box p={15} color="red.500" textAlign="center">
        Eroare la încărcarea tichetelor: {error.message || "Internal server error"}
      </Box>
    );

  // --- LOGICA DE FILTRARE ȘI EXTRAGERE DATE ---
  let ticketData = [];

  if (isAdmin) {
    // Admin primește { length: X, tickets: [...] }
    ticketData = data?.tickets || [];
  } else {
    // User primește direct un array [...]
    // FILTRARE DE SIGURANȚĂ: Chiar dacă backend-ul greșește, filtrăm aici
    // să fim siguri că afișăm doar ce aparține de userId-ul curent.
    const rawData = Array.isArray(data) ? data : [];
    ticketData = rawData.filter(t => String(t.userId) === String(userId) || String(t.adminId) === String(userId));
  }

  return (
    <TableContainer p={5}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Titlu</Th>
            <Th>Categorie</Th>
            <Th>Descriere</Th>
            <Th>Documente</Th>
            <Th>Status</Th>
            {isAdmin && <Th>Acțiuni</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {ticketData.length === 0 ? (
            <Tr>
              <Td colSpan={isAdmin ? 6 : 5} textAlign="center" py={10}>
                Nu s-au găsit tichete.
              </Td>
            </Tr>
          ) : (
            ticketData.map((ticket) => (
              <Tr key={ticket.id}>
                <Td fontWeight="bold">{ticket.title}</Td>
                <Td>{ticket.category}</Td>
                <Td>{ticket.description}</Td>
                <Td>
                  {ticket.docs ? (
                    <Button
                      as="a"
                      href={ticket.docs}
                      target="_blank"
                      size="xs"
                      colorScheme="gray"
                    >
                      Vezi Docs
                    </Button>
                  ) : "Fără link"}
                </Td>
                <Td>
                  <Box
                    px={2}
                    py={1}
                    rounded="full"
                    textAlign="center"
                    fontSize="xs"
                    fontWeight="bold"
                    bg={ticket.isClosed ? "red.100" : "green.100"}
                    color={ticket.isClosed ? "red.700" : "green.700"}
                  >
                    {ticket.isClosed ? "ÎNCHIS" : "DESCHIS"}
                  </Box>
                </Td>

                {isAdmin && (
                  <Td>
                    {!ticket.isClosed ? (
                      <>
                        <Button
                          size="sm"
                          colorScheme="teal"
                          mr={2}
                          onClick={() => closeTicketMutation.mutate(ticket.id)}
                          isLoading={closeTicketMutation.isPending}
                        >
                          Închide
                        </Button>
                        {ticket.buildingId && (
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            Review
                          </Button>
                        )}
                      </>
                    ) : (
                      <Text fontSize="xs" color="gray.400">Finalizat</Text>
                    )}
                  </Td>
                )}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* Modalul de Review */}
      {selectedTicket && (
        <TicketReview
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          buildingId={Number(selectedTicket.buildingId)}
          ticketId={Number(selectedTicket.id)}
        />
      )}
    </TableContainer>
  );
}