import React from "react";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function Home(props) {
  return (
    <Box>
      <Navbar />
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Home;
