import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useRegister } from "../../services/auth/auth";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const toast = useToast();
  const { mutateAsync, isLoading, error, data } = useRegister();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: "USER",
      username: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await mutateAsync(formData)
        .then((response) => {
          // Optionally handle response data here
          toast({
            title: "Registration Successful",
            description: "You have successfully registered.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          navigate("/login"); // Redirect to login page after successful registration
        })
        .catch((err) => {
          // Optionally handle error here

          toast({
            title: "Registration Failed",
            description: err.response?.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });

      reset();
      // Optionally show a success message or redirect here
    } catch (err) {
      // Optionally handle error here
      // e.g., show a toast or set a local error state
    }
  };

  return (
    <Box
      w="xl"
      mt={10}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      color={"black"}
    >
      <Heading mb={6} size="lg" textAlign="center">
        Register
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              borderColor={"gray.300"}
              placeholder="Enter username"
              {...register("username", { required: "Username is required" })}
            />
          </FormControl>
          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              borderColor={"gray.300"}
              type="email"
              placeholder="Enter email"
              {...register("email", { required: "Email is required" })}
            />
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              borderColor={"gray.300"}
              type="password"
              placeholder="Enter password"
              {...register("password", { required: "Password is required" })}
            />
          </FormControl>
          <FormControl isInvalid={errors.role}>
            <FormLabel>Role</FormLabel>
            <Select
              colorScheme="cyan"
              {...register("role", { required: "Role is required" })}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </FormControl>
          <Button
            colorScheme="brand"
            type="submit"
            isLoading={isSubmitting}
            width="full"
          >
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;
