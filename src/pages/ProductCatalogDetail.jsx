import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  SimpleGrid,
  Spinner,
  VStack,
  Stack,
  Badge,
  useToast,
  Input,
  Button,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import AxiosInstance from "../services/auth/AxiosInstance";
import useCartStore from "/src/store/cartStore"; // adjust path as needed

const fetchProductById = async (id) => {
  const res = await AxiosInstance.get(`ecommerce/products/${id}`);
  return res.data.data;
};

const addToCart = async ({ productId, quantity }) => {
  const res = await AxiosInstance.post(`ecommerce/cart/item/${productId}`, {
    quantity,
  });
  return res.data;
};

const ProductDetail = () => {
  const { increment } = useCartStore();

  const { id: productId } = useParams();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
  });

  const { mutateAsync: addToCartMutation, isLoading: isAdding } = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      increment();

      toast({
        title: "Added to cart",
        description: "Product has been added to your cart.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to add to cart",
        description: err.response?.data?.message || "Try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleAddToCart = async () => {
    await addToCartMutation({ productId, quantity: Number(quantity) });
  };

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
        <Text color="red.500">Failed to load product.</Text>
      </Box>
    );
  }

  return (
    <Box
      w={{ base: "90%", md: "80%", lg: "70%" }}
      mx="auto"
      mt={10}
      p={6}
      bg="white"
      borderRadius="lg"
      boxShadow="md"
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {/* Images */}
        <VStack align="start">
          <Image
            src={product.mainImage?.url}
            alt={product.name}
            borderRadius="md"
            boxSize={{ base: "100%", md: "100%" }}
            objectFit="cover"
          />
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
            {product.subImages?.map((img, idx) => (
              <Image
                key={idx}
                src={img.url}
                alt={`Sub ${idx + 1}`}
                boxSize="80px"
                objectFit="cover"
                borderRadius="md"
              />
            ))}
          </SimpleGrid>
        </VStack>

        {/* Product Info */}
        <Stack spacing={4}>
          <Heading size="lg">{product.name}</Heading>
          <Text color="gray.600">{product.description}</Text>
          <Text fontSize="2xl" fontWeight="bold" color="blue.600">
            Rs. {product.price}
          </Text>
          <Badge
            colorScheme={product.stock > 0 ? "green" : "red"}
            fontSize="md"
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </Badge>

          {/* Quantity input */}
          <Box>
            <Text mb={1}>Quantity</Text>
            <Input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              w="100px"
            />
          </Box>

          {/* Add to cart button */}
          <Button
            colorScheme="blue"
            onClick={handleAddToCart}
            isDisabled={product.stock <= 0 || isAdding}
            isLoading={isAdding}
          >
            Add to Cart
          </Button>
        </Stack>
      </SimpleGrid>
    </Box>
  );
};

export default ProductDetail;
