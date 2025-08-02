
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResumeProvider } from "./context/ResumeContext";
import { ThemeProvider } from "./context/ThemeContext";
import Landing from "./pages/Landing";
import ResumeEditor from "./pages/ResumeEditor";
import ResumeView from "./pages/ResumeView";
import ThemeEditor from "./pages/ThemeEditor";
import Contribute from "./pages/Contribute";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <ResumeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={import.meta.env.PROD && process.env.GITHUB_PAGES ? '/no-strings-resume' : ''}>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/edit" element={<ResumeEditor />} />
                <Route path="/view" element={<ResumeView />} />
                <Route path="/theme" element={<ThemeEditor />} />
                <Route path="/contribute" element={<Contribute />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </ResumeProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
