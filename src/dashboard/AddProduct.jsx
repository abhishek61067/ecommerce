import React, { useState } from "react";
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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AxiosInstance from "../services/auth/AxiosInstance";

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
});

const AddProduct = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [subImages, setSubImages] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch categories
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await AxiosInstance.get("ecommerce/categories");
      return res.data;
    },
  });

  // Create category mutation
  const categoryMutation = useMutation({
    mutationFn: async () => {
      const res = await AxiosInstance.post("ecommerce/categories", {
        name: newCategoryName,
      });
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Category Created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewCategoryName("");
      onClose();
      refetchCategories();
    },
    onError: () => {
      toast({
        title: "Failed to create category",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  // Add product mutation
  const productMutation = useMutation({
    mutationFn: async (formData) => {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      data.append("mainImage", formData.mainImage[0]);

      subImages.forEach((file) => {
        data.append("subImages", file);
      });

      const response = await AxiosInstance.post("ecommerce/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Product added",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      reset();
      setSubImages([]);
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
    },
  });

  const mainImageFile = watch("mainImage")?.[0];

  const handleSubImagesChange = (e) => {
    const selected = Array.from(e.target.files);
    const total = subImages.length + selected.length;
    if (total > 4) {
      toast({
        title: "Image limit exceeded",
        description: "You can only upload up to 4 sub images.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSubImages((prev) => [...prev, ...selected]);
    e.target.value = null;
  };

  const onSubmit = async (data) => {
    await productMutation.mutateAsync(data);
  };

  return (
    <>
      <Box
        w={{ base: "90%", lg: "50%" }}
        mx="auto"
        mt={100}
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
                placeholder="Description"
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
              <FormLabel>
                Category{" "}
                <Button
                  size="sm"
                  ml={2}
                  variant="outline"
                  colorScheme="cyan"
                  onClick={onOpen}
                >
                  + Add Category
                </Button>
              </FormLabel>
              {isCategoriesLoading ? (
                <Spinner />
              ) : (
                <Select placeholder="Select category" {...register("category")}>
                  {categories?.data?.categories?.map((cat) => (
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

            <FormControl>
              <FormLabel>Sub Images (up to 4)</FormLabel>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleSubImagesChange}
              />
              {subImages.length > 0 && (
                <SimpleGrid columns={4} spacing={2} mt={2}>
                  {subImages.map((file, idx) => (
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
              colorScheme="cyan"
              color={"white"}
              type="submit"
              isLoading={isSubmitting || productMutation.isLoading}
              width="full"
            >
              Add Product
            </Button>
          </VStack>
        </form>
      </Box>

      {/* Add Category Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Category Name</FormLabel>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Shirts"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => categoryMutation.mutate()}
              isLoading={categoryMutation.isLoading}
            >
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddProduct;
