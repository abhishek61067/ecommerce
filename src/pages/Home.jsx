import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Home = () => (
  <Box
    minH="100vh"
    minW="100vw"
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    bg="gray.50"
    px={4}
    bgImage={
      "https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  >
    <Heading as="h1" size="2xl" mb={4} color="white" shadow={"xl"}>
      Welcome to ShopEase
    </Heading>
    <Text fontSize="xl" mb={8} color="white">
      Your one-stop shop for everything!
    </Text>
  </Box>
);

export default Home;
