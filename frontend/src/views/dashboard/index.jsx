import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Heading,
  Spinner,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
  Divider,
} from "@chakra-ui/react";

function BarRow({ label, value, max }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <Box mb={3}>
      <Box display="flex" justifyContent="space-between">
        <Text fontWeight="600">{label}</Text>
        <Text>{value}</Text>
      </Box>
      <Box bg="gray.200" borderRadius="md" h="10px" overflow="hidden">
        <Box bg="teal.500" h="10px" width={`${pct}%`} />
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const token = localStorage.getItem("user");

  const { isLoading, data, error } = useQuery({
    queryKey: ["DashboardStats"],
    queryFn: () =>
      fetch("http://localhost:3000/dashboard/stats", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          if (!res.ok) throw new Error(JSON.stringify(json));
          return json;
        } catch {
          if (!res.ok) throw new Error(text);
          return text;
        }
      }),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <Box p={8}>
        <Spinner />
      </Box>
    );
  }
  if (error) {
    return (
      <Box p={8}>
        <Heading size="md">Nu pot încărca dashboard-ul</Heading>
        <Text mt={2}>{String(error.message)}</Text>
      </Box>
    );
  }

  const buildingsByRisk = data?.buildingsByRisk ?? [];
  const buildingsByStatus = data?.buildingsByStatus ?? [];
  const ticketsStatus = data?.ticketsStatus ?? { open: 0, closed: 0 };

  const maxRisk = Math.max(0, ...buildingsByRisk.map((x) => x.count));
  const totalBuildings = buildingsByStatus.reduce((s, x) => s + x.count, 0);

  return (
    <Box p={8}>
      <Heading mb={6}>Dashboard</Heading>

      <SimpleGrid columns={[1, 2, 3]} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total clădiri</StatLabel>
              <StatNumber>{totalBuildings}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Tichete deschise</StatLabel>
              <StatNumber>{ticketsStatus.open}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Tichete închise</StatLabel>
              <StatNumber>{ticketsStatus.closed}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={[1, 2]} spacing={6}>
        <Card>
          <CardBody>
            <Heading size="md" mb={3}>
              Clădiri pe clase de risc seismic
            </Heading>
            <Divider mb={4} />
            {buildingsByRisk.length === 0 ? (
              <Text color="gray.500">Nu există date.</Text>
            ) : (
              buildingsByRisk.map((x) => (
                <BarRow key={x.risk} label={x.risk} value={x.count} max={maxRisk} />
              ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={3}>
              Clădiri pe status
            </Heading>
            <Divider mb={4} />
            {buildingsByStatus.length === 0 ? (
              <Text color="gray.500">Nu există date.</Text>
            ) : (
              buildingsByStatus.map((x) => (
                <BarRow
                  key={x.status}
                  label={x.status}
                  value={x.count}
                  max={Math.max(...buildingsByStatus.map((s) => s.count))}
                />
              ))
            )}
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
