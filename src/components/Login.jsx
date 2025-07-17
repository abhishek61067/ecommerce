import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../services/auth/auth";
import useAuthStore from "/src/store/authStore";

const Login = () => {
  const { setTokens } = useAuthStore();
  const toast = useToast();
  const navigate = useNavigate();
  const { mutateAsync } = useLogin(); // Removed isLoading

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      const response = await mutateAsync(formData);
      const { accessToken, refreshToken } = response.data;

      const userRole = response.data.user.role;
      // Update role in store (and localStorage)
      setTokens({
        accessToken: accessToken,
        refreshToken: refreshToken,
        userRole,
      });

      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      reset();
      navigate("/catalog");
    } catch (err) {
      toast({
        title: "Login Failed",
        description: err.response?.data?.message || "Invalid credentials.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      w={{ base: "90%", md: "400px" }}
      mt={10}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      color="white"
      // border={"1px"}
      // borderColor={"gray.600"}
    >
      <Heading mb={6} size="lg" textAlign="center">
        Login
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              borderColor="gray.300"
              type="email"
              placeholder="Enter email"
              {...register("email", { required: "Email is required" })}
            />
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              borderColor="gray.300"
              type="password"
              placeholder="Enter password"
              {...register("password", { required: "Password is required" })}
            />
          </FormControl>

          <Button
            colorScheme="cyan"
            type="submit"
            isLoading={isSubmitting} // ✅ Use only isSubmitting
            width="full"
            color="white"
          >
            Login
          </Button>

          <Button
            variant="outline"
            colorScheme="cyan"
            width="full"
            onClick={() => navigate("/register")}
          >
            Create an account
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
