import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import AxiosInstance from "./AxiosInstance";
import { useToast } from "@chakra-ui/react";

const queryClient = new QueryClient();

export const useRegister = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const response = await AxiosInstance.post("users/register", data);
      return response.data;
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const response = await AxiosInstance.post("users/login", data);
      return response.data;
    },
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
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
      const response = await AxiosInstance.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
};
