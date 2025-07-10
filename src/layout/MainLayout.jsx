import { Box, HStack } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <Box
      w={"100vw"}
      h={"100vh"}
      bg="gray.50"
      p={4}
      display={"flex"}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Outlet />
    </Box>
  );
};

export default MainLayout;
