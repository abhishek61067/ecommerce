import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { extendTheme } from "@chakra-ui/react";
import Home from "./pages/Home.jsx";
import { router } from "./routes/routes.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Create a client
const queryClient = new QueryClient();

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: "#0a2342", // deep navy blue
    800: "#102a43", // navy blue
    700: "#243b53", // lighter navy
    600: "#334e68", // accent navy
  },
};

const theme = extendTheme({ colors });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>
);
