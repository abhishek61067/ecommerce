import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "/src/store/authStore";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const ProtectedRoute = ({ children }) => {
  const { accessToken } = useAuthStore();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showNavigate, setShowNavigate] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      onOpen();
    }
  }, [accessToken, onOpen]);

  const handleClose = () => {
    onClose();
    setShowNavigate(true);
  };

  if (accessToken) {
    return children;
  }

  if (showNavigate) {
    // Redirect after modal is closed
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show modal while waiting for user to close
  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Authentication Required</ModalHeader>
        <ModalBody>
          <Text>You must be logged in to access this page.</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="cyan" mr={3} onClick={handleClose}>
            Go to Login
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProtectedRoute;
