import React from "react";
import {
  Box,
  Heading,
  Image,
  Text,
  Button,
  VStack,
  Stack,
  Divider,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosInstance from "../services/auth/AxiosInstance";
import useCartStore from "/src/store/cartStore";

const fetchCartItems = async () => {
  const res = await AxiosInstance.get("ecommerce/cart");
  return res.data.data;
};

const deleteCartItem = async (productId) => {
  return await AxiosInstance.delete(`ecommerce/cart/item/${productId}`);
};

const CartPage = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { setQuantity } = useCartStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCartItems,
  });

  const { mutateAsync: removeItem, isLoading: isDeleting } = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      toast({
        title: "Item removed from cart",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries(["cart"]);
    },
    onError: () => {
      toast({
        title: "Failed to remove item",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleDelete = async (productId) => {
    await removeItem(productId);
  };

  const cartItems = data?.items || [];

  React.useEffect(() => {
    if (data?.items) {
      setQuantity(data.items.length);
    }
  }, [data, setQuantity]);

  if (isLoading) {
    return (
      <Box p={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={10}>
        <Text color="red.500">Failed to load cart.</Text>
      </Box>
    );
  }

  return (
    <Box
      w={{ base: "90%", md: "80%", lg: "70%" }}
      mx="auto"
      mt={{ base: 24, md: 16 }}
      p={{ base: 4, md: 6 }}
      bg="white"
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading mb={6} fontSize={{ base: "xl", md: "2xl" }}>
        🛒 Your Cart
      </Heading>

      {cartItems.length === 0 ? (
        <Text>No items in cart.</Text>
      ) : (
        <VStack spacing={6} align="stretch">
          {cartItems.map((item) => (
            <Box
              key={item.product._id}
              borderWidth="1px"
              borderRadius="md"
              p={4}
            >
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={6}
                align="center"
              >
                <Image
                  src={item.product.mainImage?.url}
                  alt={item.product.name}
                  boxSize={{ base: "80px", md: "100px" }}
                  objectFit="cover"
                  borderRadius="md"
                />
                <Box flex="1" w="full">
                  <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>
                    {item.product.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    {item.product.description}
                  </Text>
                  <Text
                    color="blue.600"
                    fontWeight="semibold"
                    mt={2}
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    Rs. {item.product.price}
                  </Text>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Quantity: {item.quantity}
                  </Text>
                </Box>
                <Button
                  colorScheme="red"
                  size="sm"
                  isLoading={isDeleting}
                  onClick={() => handleDelete(item.product._id)}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          ))}

          <Divider />

          {/* Total Section */}
          <Box textAlign="right">
            <Text fontSize="lg" fontWeight="bold">
              Total: Rs.{" "}
              {cartItems.reduce(
                (acc, item) =>
                  acc +
                  Number(item.product.price || 0) * Number(item.quantity || 1),
                0
              )}
            </Text>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default CartPage;
