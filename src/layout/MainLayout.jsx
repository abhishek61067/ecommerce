import { Box, Button, HStack } from "@chakra-ui/react";
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
      <Box>
        {/* add login and register button */}
        <HStack spacing={4} mb={4}>
          <Button
            colorScheme="cyan"
            as="a"
            href="/login"
            p={2}
            color="white"
            borderRadius="md"
          >
            Login
          </Button>
          <Button
            variant={"outline"}
            as="a"
            href="/register"
            p={2}
            color="black"
            borderRadius="md"
          >
            Register
          </Button>
        </HStack>
      </Box>
      <Outlet />
    </Box>
  );
};

export default MainLayout;
