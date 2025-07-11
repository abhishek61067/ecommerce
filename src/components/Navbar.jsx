import React from "react";
import {
  Box,
  Flex,
  Image,
  Button,
  HStack,
  Container,
  Badge,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "/src/store/cartStore"; // optional if using cart
import useAuthStore from "/src/store/authStore";
import AxiosInstance from "/src/services/auth/AxiosInstance"; // already has token

const Navbar = () => {
  const { quantity } = useCartStore(); // optional for showing cart badge
  const { accessToken, clearTokens } = useAuthStore();
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await AxiosInstance.post("users/logout"); // logout API
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearTokens(); // Clear token from store and localStorage
      navigate("/login"); // Redirect to login
    }
  };

  return (
    <Box
      bg="gray.50"
      boxShadow="sm"
      py={3}
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="1000"
    >
      <Container maxW="6xl" px={{ base: 4, md: 8 }}>
        <Flex align="center" justify="space-between" flexWrap="wrap">
          {/* Logo */}
          <Link to="/">
            <Image
              src="/src/assets/ecommerce-logo.svg"
              alt="E-commerce Logo"
              boxSize="50px"
              objectFit="contain"
            />
          </Link>

          {/* Product Catalog */}
          <Box mx={{ base: 2, md: 20 }} mt={{ base: 2, md: 0 }}>
            <Link to="/catalog">
              <Text
                fontSize={{ base: "md", md: "xl" }}
                _hover={{ color: "blue.300" }}
                color="gray.700"
              >
                Product Catalog
              </Text>
            </Link>
          </Box>

          {/* Navigation Buttons */}
          {/* Navigation Buttons */}
          <HStack spacing={{ base: 2, md: 4 }} mt={{ base: 2, md: 0 }}>
            {!accessToken ? (
              <>
                <Link to="/login">
                  <Button
                    colorScheme="cyan"
                    color="white"
                    size={{ base: "sm", md: "md" }}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="outline"
                    colorScheme="gray"
                    size={{ base: "sm", md: "md" }}
                  >
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                colorScheme="cyan"
                color="white"
                size={{ base: "sm", md: "md" }}
                onClick={logout}
              >
                Logout
              </Button>
            )}

            <Link to="/cart">
              <Button
                variant="ghost"
                position="relative"
                size={{ base: "sm", md: "md" }}
              >
                Cart
                {quantity > 0 && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-2"
                    colorScheme="red"
                    borderRadius="full"
                    px={2}
                    fontSize="xs"
                  >
                    {quantity}
                  </Badge>
                )}
              </Button>
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
