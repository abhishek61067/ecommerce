import { Box, Button, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Home = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    px={4}
  >
    <Heading as="h1" size="2xl" mb={4} color="white" shadow={"xl"}>
      Welcome to Codeek Channel
    </Heading>
    <Text fontSize="xl" mb={8} color="white">
      Your one-stop Tutor for frontend development
    </Text>
  </Box>
);

export default Home;
