import { Box, Button, HStack, Image } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./../components/Navbar";

const MainLayout = () => {
  return (
    <Box
      w={"100vw"}
      minH={"100vh"}
      bg="gray.50"
      p={4}
      display={"flex"}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Navbar />
      <Outlet />
    </Box>
  );
};

export default MainLayout;
