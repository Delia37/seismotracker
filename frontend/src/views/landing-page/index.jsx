<<<<<<< HEAD
import React from "react";
import { BuildingCard } from "./BuildingCard.jsx";
import { Box, Grid, GridItem, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function BuildingsGrid(buildings, navigate) {
=======
// import React from "react";
// import { BuildingCard } from "./BuildingCard.jsx";
// import { Box, Grid, GridItem, Spinner } from "@chakra-ui/react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";

// export function BuildingsGrid(buildings, navigate, opts = {}) {
//   const {
//     canSave = false,
//     favoriteIds = new Set(),
//     onToggleSave = () => {},
//   } = opts;

//   return (
//     <Box mt={5}>
//       <Grid templateColumns="repeat(5, 1fr)" gap={8}>
//         {buildings.map((building) => (
//           <GridItem key={building.id}>
//             <BuildingCard
//               id={building.id}
//               address={building.location.street + " " + building.location.number}
//               buildingStatus={building.buildingStatus}
//               year={building.buildingYear}
//               heightRegime={building.heightRegime}
//               sector={building.location.sector}
//               seismicRisk={building.seismicRisk.className}
//               seismicToolTip={building.seismicRisk.description}
//               thumbnail={building.location.thumbnail}
//               navigate={navigate}
//               // inimioara
//               canSave={canSave}
//               isSaved={favoriteIds.has(building.id)}
//               onToggleSave={onToggleSave}
//             />
//           </GridItem>
//         ))}
//       </Grid>
//     </Box>
//   );
// }

// // parse robust: JSON sau text
// async function parseAny(res) {
//   const text = await res.text();
//   try {
//     return JSON.parse(text);
//   } catch {
//     return text;
//   }
// }

// // wrapper care aruncă eroare cu status + body (ca să vezi exact ce e greșit)
// async function fetchOrThrow(url, options) {
//   const res = await fetch(url, options);
//   const body = await parseAny(res);

//   if (!res.ok) {
//     console.error("API ERROR", {
//       url,
//       status: res.status,
//       body,
//     });
//     throw new Error(
//       typeof body === "string" ? body : JSON.stringify(body, null, 2)
//     );
//   }

//   return body;
// }

// export default function LandingPage() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const userId = localStorage.getItem("userId");
//   const token = localStorage.getItem("user");
//   const isLoggedIn = !!userId && !!token;

//   // 1) Buildings
//   const { isLoading, data, error } = useQuery({
//     queryKey: ["Building"],
//     queryFn: () =>
//       fetch("http://localhost:3000/buildings?skip=0&take=1000").then((res) =>
//         res.json()
//       ),
//   });

//   // 2) Favorites
//   const { data: favData } = useQuery({
//     queryKey: ["SavedBuildings", userId],
//     enabled: isLoggedIn,
//     queryFn: () =>
//       fetchOrThrow(`http://localhost:3000/users/${userId}/favorites`, {
//         method: "GET",
//         mode: "cors",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }),
//   });

//   // set cu id-urile salvate
//   const favoriteIds = new Set(
//     (favData?.favoriteBuildings ?? []).map((b) => b.id)
//   );

//   // Optimistic: ținem un set local “instant”
//   const [optimistic, setOptimistic] = React.useState(new Set());

//   // helper: id e considerat salvat dacă e în server OR în optimistic
//   const mergedFavoriteIds = new Set([...favoriteIds, ...optimistic]);

//   // 3) Save
//   const saveMutation = useMutation({
//     mutationFn: (buildingId) =>
//       fetchOrThrow(`http://localhost:3000/users/${userId}/favorite-buildings`, {
//         method: "PUT",
//         mode: "cors",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify([buildingId]),
//       }),
//     onSuccess: () => {
//       // confirmă din server
//       queryClient.invalidateQueries({ queryKey: ["SavedBuildings", userId] });
//     },
//     onError: (err) => {
//       console.error("SAVE FAILED:", err);
//     },
//   });

//   // 4) Unsave
//   const unsaveMutation = useMutation({
//     mutationFn: (buildingId) =>
//       fetchOrThrow(
//         `http://localhost:3000/users/${userId}/favorite-buildings/${buildingId}`,
//         {
//           method: "DELETE",
//           mode: "cors",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       ),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["SavedBuildings", userId] });
//     },
//     onError: (err) => {
//       console.error("UNSAVE FAILED:", err);
//     },
//   });

//   const onToggleSave = (buildingId, isSaved) => {
//     if (!isLoggedIn) return;

//     // debug: să vezi clar că se apasă
//     console.log("toggle save", { buildingId, isSaved });

//     // optimistic update: schimbă imediat icon-ul
//     setOptimistic((prev) => {
//       const next = new Set(prev);
//       if (isSaved) next.delete(buildingId);
//       else next.add(buildingId);
//       return next;
//     });

//     if (isSaved) {
//       unsaveMutation.mutate(buildingId, {
//         onSettled: () => {
//           // după ce serverul răspunde, curăță optimistic și lasă server-ul ca sursă
//           setOptimistic(new Set());
//         },
//       });
//     } else {
//       saveMutation.mutate(buildingId, {
//         onSettled: () => {
//           setOptimistic(new Set());
//         },
//       });
//     }
//   };

//   if (isLoading || data === "undefined") {
//     return (
//       <Box p={15}>
//         <Spinner />
//       </Box>
//     );
//   }

//   if (error) return "Error " + error.message;

//   return BuildingsGrid(data.buildings, navigate, {
//     canSave: isLoggedIn,
//     favoriteIds: mergedFavoriteIds,
//     onToggleSave,
//   });
// }

import React from "react";
import { BuildingCard } from "./BuildingCard.jsx";
import { Box, Grid, GridItem, Spinner } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function BuildingsGrid(buildings, navigate, opts = {}) {
  const {
    canSave = false,
    favoriteIds = new Set(),
    onToggleSave = () => {},
  } = opts;

>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
  return (
    <Box mt={5}>
      <Grid templateColumns="repeat(5, 1fr)" gap={8}>
        {buildings.map((building) => (
          <GridItem key={building.id}>
            <BuildingCard
              id={building.id}
<<<<<<< HEAD
              address={
                building.location.street + " " + building.location.number
              }
=======
              address={building.location.street + " " + building.location.number}
>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
              buildingStatus={building.buildingStatus}
              year={building.buildingYear}
              heightRegime={building.heightRegime}
              sector={building.location.sector}
              seismicRisk={building.seismicRisk.className}
              seismicToolTip={building.seismicRisk.description}
              thumbnail={building.location.thumbnail}
              navigate={navigate}
<<<<<<< HEAD
=======
              // inimioara
              canSave={canSave}
              isSaved={favoriteIds.has(building.id)}
              onToggleSave={onToggleSave}
>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
            />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}

<<<<<<< HEAD
export default function LandingPage() {
  const navigate = useNavigate();
  const { isLoading, data, error } = useQuery({
    queryKey: ["Building"],
    queryFn: () =>
      fetch("http://localhost:3000/buildings?skip=0&take=1000").then(
        async (res) => res.json()
      ),
  });

  if (isLoading || data === "undefined")
=======
// parsează și JSON și text/plain
async function parseAny(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// fetch helper care loghează status + body și aruncă eroare dacă !ok
async function fetchOrThrow(url, options) {
  const res = await fetch(url, options);
  const body = await parseAny(res);

  console.log("API", options?.method || "GET", url, "->", res.status, body);

  if (!res.ok) {
    throw new Error(
      typeof body === "string" ? body : JSON.stringify(body, null, 2)
    );
  }
  return body;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("user");
  const isLoggedIn = !!userId && !!token;

  // Buildings (implementarea voastră existentă)
  const { isLoading, data, error } = useQuery({
    queryKey: ["Building"],
    queryFn: () =>
      fetch("http://localhost:3000/buildings?skip=0&take=1000").then((res) =>
        res.json()
      ),
  });

  // Favorites (saved) - doar dacă user e logat
  const { data: favData } = useQuery({
    queryKey: ["SavedBuildings", userId],
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

  const favoriteIds = new Set(
    (favData?.favoriteBuildings ?? []).map((b) => b.id)
  );

  // Save
  const saveMutation = useMutation({
    mutationFn: (buildingId) =>
      fetchOrThrow(`http://localhost:3000/users/${userId}/favorite-buildings`, {
        method: "PUT",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([buildingId]),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SavedBuildings", userId] });
    },
    onError: (e) => {
      console.error("SAVE FAILED:", e.message);
    },
  });

  // Unsave
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
    onError: (e) => {
      console.error("UNSAVE FAILED:", e.message);
    },
  });

  const onToggleSave = (buildingId, isSaved) => {
    if (!isLoggedIn) return;
    console.log("toggle save", { buildingId, isSaved });

    if (isSaved) unsaveMutation.mutate(buildingId);
    else saveMutation.mutate(buildingId);
  };

  // render states
  if (isLoading || data === "undefined") {
>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
    return (
      <Box p={15}>
        <Spinner />
      </Box>
    );
<<<<<<< HEAD
  if (error) return "Error" + error.message;

  return !isLoading && BuildingsGrid(data.buildings, navigate);
=======
  }

  if (error) return "Error " + error.message;

  return BuildingsGrid(data.buildings, navigate, {
    canSave: isLoggedIn,
    favoriteIds,
    onToggleSave,
  });
>>>>>>> 9609889d7b9da60062c3b535cba17cbc715633c5
}
