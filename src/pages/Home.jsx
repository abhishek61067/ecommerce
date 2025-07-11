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
      "https://plus.unsplash.com/premium_photo-1683984171269-04c84ee23234?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  >
    <Heading as="h1" size="2xl" mb={4} color="black">
      Welcome to ShopEase
    </Heading>
    <Text fontSize="xl" mb={8} color="gray.600">
      Your one-stop shop for everything!
    </Text>
  </Box>
);

export default Home;
