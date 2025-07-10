import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Select,
  Image,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AxiosInstance from "../services/auth/AxiosInstance";
import { useToast } from "@chakra-ui/react";

const schema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive()
    .required("Price is required"),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .integer()
    .min(0)
    .required("Stock is required"),
  category: yup.string().required("Category is required"),
  mainImage: yup
    .mixed()
    .required("Main image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      return value && value[0] && value[0].type.startsWith("image/");
    }),
  subImages: yup
    .mixed()
    .test(
      "maxLength",
      "You can upload up to 4 images",
      (value) => !value || value.length <= 4
    )
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return true;
      for (let i = 0; i < value.length; i++) {
        if (!value[i].type.startsWith("image/")) return false;
      }
      return true;
    }),
});

const AddProduct = () => {
  const toast = useToast();

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await AxiosInstance.get("ecommerce/categories");
      return res.data; // Adjust if your API structure is different
    },
  });

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async (formData) => {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      data.append("mainImage", formData.mainImage[0]);
      if (formData.subImages) {
        Array.from(formData.subImages).forEach((file) =>
          data.append("subImages", file)
        );
      }
      const response = await AxiosInstance.post("ecommerce/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Product added",
        description: "The product was added successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add product.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      mainImage: null,
      subImages: null,
    },
  });

  const mainImageFile = watch("mainImage")?.[0];
  const subImagesFiles = watch("subImages");

  const onSubmit = async (data) => {
    await mutateAsync(data);
    reset();
  };

  return (
    <Box
      minW="xl"
      mx="auto"
      mt={10}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      color="black"
    >
      <Heading mb={6} size="lg" textAlign="center">
        Add Product
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={errors.name}>
            <FormLabel>Name</FormLabel>
            <Input {...register("name")} placeholder="Product name" />
          </FormControl>
          <FormControl isInvalid={errors.description}>
            <FormLabel>Description</FormLabel>
            <Textarea
              {...register("description")}
              placeholder="Product description"
            />
          </FormControl>
          <FormControl isInvalid={errors.price}>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              step="0.01"
              {...register("price")}
              placeholder="Price"
            />
          </FormControl>
          <FormControl isInvalid={errors.stock}>
            <FormLabel>Stock Quantity</FormLabel>
            <Input
              type="number"
              {...register("stock")}
              placeholder="Stock quantity"
            />
          </FormControl>
          <FormControl isInvalid={errors.category}>
            <FormLabel>Category</FormLabel>
            {isCategoriesLoading ? (
              <Spinner />
            ) : (
              <Select placeholder="Select category" {...register("category")}>
                {categories &&
                  categories?.data?.categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </Select>
            )}
          </FormControl>
          <FormControl isInvalid={errors.mainImage}>
            <FormLabel>Main Image</FormLabel>
            <Input type="file" accept="image/*" {...register("mainImage")} />
            {mainImageFile && (
              <Image
                src={URL.createObjectURL(mainImageFile)}
                alt="Main Preview"
                boxSize="100px"
                mt={2}
              />
            )}
          </FormControl>
          <FormControl isInvalid={errors.subImages}>
            <FormLabel>Sub Images (up to 4)</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              {...register("subImages")}
            />
            {subImagesFiles && subImagesFiles.length > 0 && (
              <SimpleGrid columns={4} spacing={2} mt={2}>
                {Array.from(subImagesFiles)
                  .slice(0, 4)
                  .map((file, idx) => (
                    <Image
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt={`Sub Preview ${idx + 1}`}
                      boxSize="60px"
                    />
                  ))}
              </SimpleGrid>
            )}
          </FormControl>
          <Button
            colorScheme="brand"
            type="submit"
            isLoading={isSubmitting || isLoading}
            width="full"
          >
            Add Product
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddProduct;
