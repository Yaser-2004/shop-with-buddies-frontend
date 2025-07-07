
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppProvider } from "@/context/AppContext";
import { CallProvider } from "@/context/CallContext";
import ProductDetails from "./pages/ProductDetails";
import { FloatingCallUI } from "@/components/FloatingCallUI";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="coshop-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppProvider>
          <CallProvider>
            <BrowserRouter>
              <FloatingCallUI />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/room/:roomId" element={<Index />} />
                <Route path="/product/:productId" element={<ProductDetails />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CallProvider>
        </AppProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
