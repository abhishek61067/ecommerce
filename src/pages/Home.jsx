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
  >
    <Heading as="h1" size="2xl" mb={4} color="black">
      Welcome to ShopEase
    </Heading>
    <Text fontSize="xl" mb={8} color="gray.600">
      Your one-stop shop for everything!
    </Text>
    <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
      <Button as={Link} to="/signin" colorScheme="cyan" variant="solid">
        Sign In
      </Button>
      <Button as={Link} to="/register" colorScheme="cyan" variant="outline">
        Register
      </Button>
    </Stack>
  </Box>
);

export default Home;
