import React, { useEffect, useState } from "react";
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

const RoleProtectedRoute = ({ allowedRoles = [], children }) => {
  const { accessToken, userRole } = useAuthStore();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showNavigate, setShowNavigate] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      onOpen();
    } else if (accessToken && !allowedRoles.includes(userRole)) {
      onOpen();
    }
  }, [accessToken, userRole, allowedRoles, onOpen]);

  const handleClose = () => {
    onClose();
    setShowNavigate(true);
  };

  if (!accessToken || (accessToken && !allowedRoles.includes(userRole))) {
    if (showNavigate) {
      // Redirect to login if no token, or to unauthorized page if role mismatch
      return !accessToken ? (
        <Navigate to="/login" state={{ from: location }} replace />
      ) : (
        <Navigate to="/unauthorized" replace />
      );
    }

    // return (
    //   <Modal isOpen={isOpen} onClose={handleClose} isCentered>
    //     <ModalOverlay />
    //     <ModalContent>
    //       <ModalHeader>Access Denied</ModalHeader>
    //       <ModalBody>
    //         <Text>
    //           {!accessToken
    //             ? "You must be logged in to access this page."
    //             : "You do not have permission to access this page."}
    //         </Text>
    //       </ModalBody>
    //       <ModalFooter>
    //         <Button colorScheme="cyan" mr={3} onClick={handleClose}>
    //           {!accessToken ? "Go to Login" : "Close"}
    //         </Button>
    //       </ModalFooter>
    //     </ModalContent>
    //   </Modal>
    // );
  }

  return children;
};

export default RoleProtectedRoute;
