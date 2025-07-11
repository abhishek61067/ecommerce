import React from "react";
import { Box, Heading, Text, Button, VStack, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      px={4}
    >
      <VStack spacing={6} textAlign="center">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/595/595067.png"
          alt="Unauthorized"
          boxSize={{ base: "120px", md: "150px" }}
        />
        <Heading size="lg" color="red.500">
          Unauthorized Access
        </Heading>
        <Text fontSize="md" color="gray.600">
          You do not have permission to view this page.
        </Text>
        <VStack spacing={3}>
          <Button
            colorScheme="cyan"
            color="white"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button variant="outline" onClick={() => navigate("/register")}>
            Register
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Unauthorized;
