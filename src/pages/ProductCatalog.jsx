import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Image,
  Text,
  Grid,
  Button,
  Heading,
  Flex,
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import AxiosInstance from "../services/auth/AxiosInstance";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { ProductLimit } from "./../constants/constant";
import { useNavigate } from "react-router-dom";

const fetchProducts = async (page) => {
  const res = await AxiosInstance.get("ecommerce/products", {
    params: { page, limit: ProductLimit },
  });
  return res.data.data;
};

const ProductCatalog = () => {
  const [page, setPage] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page),
    keepPreviousData: true,
  });

  const products = data?.products || [];
  const totalPages = data?.data?.totalPages || 1;

  if (isError) {
    toast({
      title: "Error loading products",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }

  return (
    <Box p={3}>
      <Heading size="lg" mb={6}>
        🛍️ Product Catalog
      </Heading>

      {isLoading ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : (
        <>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={2}
            mx={2}
          >
            {products.map((product, index) => (
              <Box
                key={product._id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                _hover={{ boxShadow: "lg" }}
                width={{ base: "300px", lg: "400px" }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  navigate(`/product/${product._id}`);
                }}
              >
                {hoveredIndex === index && product.subImages?.length ? (
                  <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 1000, disableOnInteraction: false }}
                    loop
                    style={{ width: "400px", height: "200px" }}
                  >
                    {[product.mainImage, ...product.subImages].map((img, i) => (
                      <SwiperSlide key={i}>
                        <Image
                          src={img.url}
                          alt={`${product.name} slide ${i}`}
                          objectFit="cover"
                          w="100%"
                          h="200px"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <Image
                    src={product.mainImage?.url}
                    alt={product.name}
                    objectFit="cover"
                    w="100%"
                    h="200px"
                  />
                )}

                <Box p={4}>
                  <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                    {product.name}
                  </Text>
                  <Text color="gray.500" noOfLines={2}>
                    {product.description}
                  </Text>
                  <Text color="blue.600" fontWeight="semibold" mt={2}>
                    Rs. {product.price}
                  </Text>
                </Box>
              </Box>
            ))}
          </Grid>

          {/* Pagination Controls */}
          <Flex justify="space-between" align="center" mt={8}>
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              isDisabled={page === 1}
              colorScheme="blue"
            >
              Previous
            </Button>
            <Text>
              Page {page} of {totalPages}
            </Text>
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              isDisabled={data?.nextPage === null}
              colorScheme="blue"
            >
              Next
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default ProductCatalog;
