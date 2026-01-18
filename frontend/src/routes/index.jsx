import React from "react";
import LandingPage from "../views/landing-page";
import ErrorPage from "../views/route-error";
import { useRoutes } from "react-router-dom";
import Layout from "../components/layout/index.jsx";
import Register from "../views/register/index.jsx";
import MapView from "../views/map-view/index.jsx";
import Login from "../views/login/index.jsx";
import Search from "../views/search/index.jsx";
import InfoPage from "../views/info-page";
import AddBuilding from "../views/add-new-buildings/index.jsx";
import NewBuildings from "../views/new-buildings/index.jsx";
import Unauthorized from "../views/unauthorized/index.jsx";
import Ticket from "../views/tickets/index.jsx";
import MyBuildings from "../views/my_buildings/index.jsx";
import SavedBuildings from "../views/saved_buildings/index.jsx";
import Dashboard from "../views/dashboard/index.jsx";



function generateRoutes() {
  return [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: "/search/:search",
          element: <Search displayMap={false} />,
        },
        {
          path: "/add",
          element:
            localStorage.getItem("user") !== null ? (
              <AddBuilding />
            ) : (
              <Unauthorized />
            ),
        },
        {
          path: "/new",
          element:
            localStorage.getItem("isAdmin") === "true" &&
            localStorage.getItem("user") !== null ? (
              <NewBuildings />
            ) : (
              <Unauthorized />
            ),
        },
        {
          path: "/my_buildings",
          element:
            localStorage.getItem("user") !== null ? (
              <MyBuildings />
            ) : (
              <Unauthorized />
            ),
        },
        {
          path: "/saved",
          element:
            localStorage.getItem("user") !== null ? (
              <SavedBuildings />
            ) : (
              <Unauthorized />
            ),
        },

        {
          path: "/dashboard",
          element:
            localStorage.getItem("isAdmin") === "true" &&
            localStorage.getItem("user") !== null ? (
              <Dashboard />
            ) : (
              <Unauthorized />
            ),
        },


      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },

    {
      path: "/map",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <MapView />,
        },
        {
          path: "/map/:id",
          element: <MapView />,
        },
        {
          path: "/map/search/:search",
          element: <Search displayMap={true} />,
        },
      ],
    },
    {
      path: "/buildings/:id",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <InfoPage />,
        },
      ],
    },
    {
      path: "/tickets",
      element: <Layout />,
      children: [
        {
          index: true,
          element:
            localStorage.getItem("user") !== null ? (
              <Ticket />
            ) : (
              <Unauthorized />
            ),
        },
      ],
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];
}

export default function Routes() {
  return useRoutes(generateRoutes());
}
