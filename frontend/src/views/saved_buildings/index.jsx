import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { FcMinus } from "react-icons/fc";
import { BuildingsGrid } from "../landing-page/index.jsx";
import { useNavigate } from "react-router-dom";

// parsează și JSON și text/plain
async function parseAny(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function fetchOrThrow(url, options) {
  const res = await fetch(url, options);
  const body = await parseAny(res);

  if (!res.ok) {
    throw new Error(
      typeof body === "string" ? body : JSON.stringify(body, null, 2)
    );
  }

  return body;
}

export default function SavedBuildings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("user");

  const isLoggedIn = !!userId && !!token;

  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["SavedBuildings", userId], // IMPORTANT: same key ca în LandingPage
    enabled: isLoggedIn,
    queryFn: () =>
      fetchOrThrow(`http://localhost:3000/users/${userId}/favorites`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
  });

  // dacă nu e logat (shouldn't happen because of route guard, but safe)
  if (!isLoggedIn) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Neautorizat
        </Heading>
        <Text color={"gray.500"}>Te rog loghează-te din nou.</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box p={15}>
        <Spinner />
      </Box>
    );
  }

  // dacă query-ul a picat (ex: 401), nu afișa “Nicio cladire”, afișa eroare clar
  if (error) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Nu pot încărca salvatele
        </Heading>
        <Text color={"gray.500"}>{String(error.message)}</Text>
      </Box>
    );
  }

  const favs = Array.isArray(data?.favoriteBuildings)
    ? data.favoriteBuildings
    : [];

  // mutation pentru unsave direct din /saved
  const unsaveMutation = useMutation({
    mutationFn: (buildingId) =>
      fetchOrThrow(
        `http://localhost:3000/users/${userId}/favorite-buildings/${buildingId}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SavedBuildings", userId] });
    },
  });

  const favoriteIds = new Set(favs.map((b) => b.id));

  const onToggleSave = (buildingId, isSaved) => {
    // aici e pagina Saved, deci dacă apeși inimă -> unsave
    if (isSaved) {
      unsaveMutation.mutate(buildingId);
    }
  };

  if (favs.length === 0) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Box display="inline-block">
          <FcMinus size={100} />
        </Box>
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Nicio cladire salvata!
        </Heading>
        <Text color={"gray.500"}>
          Apasă pe inimioara de pe o clădire ca să o salvezi aici.
        </Text>
      </Box>
    );
  }

  // Refolosim grid-ul existent, dar:
  // - canSave = true ca să arate inimioara
  // - favoriteIds ca să fie inima plină
  // - onToggleSave ca să poți “unsave” direct de aici
  return BuildingsGrid(favs, navigate, {
    canSave: true,
    favoriteIds,
    onToggleSave,
  });
}
