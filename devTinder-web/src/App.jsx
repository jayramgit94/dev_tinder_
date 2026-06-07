import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Provider } from "react-redux";
import { AnimatePresence } from "framer-motion";
import appStore from "../utils/appStore";
import { addUser } from "../utils/userSlice";
import api from "./lib/api";

import LandingPage from "./components/landing/LandingPage";
import AppShell, { PublicOnlyRoute } from "./components/layout/AppShell";
import { ToastProvider } from "./context/ToastProvider";
import { SocketProvider } from "./context/SocketProvider";
import PageTransition from "./components/motion/PageTransition";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Inbox from "./components/Inbox";
import ProfileEdit from "./components/ProfileEdit";
import Onboarding from "./components/Onboarding";
import Feed from "./components/Feed";
import { ThemeProvider } from "./context/ThemeContext";
import CommandPalette from "./components/CommandPalette";
import ThemeToggle from "./components/ThemeToggle";
import Skeleton from "./components/ui/Skeleton";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center px-5 py-16 relative overflow-hidden">
      <ThemeToggle className="absolute top-5 right-5 z-20" />
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="relative mb-10 text-center">
        <a href="/" className="inline-flex items-center gap-3 group">
          <span className="flex size-10 items-center justify-center rounded-xl bg-text-primary text-surface font-bold text-sm shadow-lg group-hover:scale-105 transition-transform">
            DT
          </span>
          <span className="font-semibold text-xl tracking-tight">DevTinder</span>
        </a>
      </div>
      <div className="relative w-full flex justify-center">{children}</div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PublicOnlyRoute><AuthLayout><PageTransition><Login /></PageTransition></AuthLayout></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><AuthLayout><PageTransition><Register /></PageTransition></AuthLayout></PublicOnlyRoute>} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<PageTransition><Feed /></PageTransition>} />
          <Route path="onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
          <Route path="profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="profile/edit" element={<PageTransition><ProfileEdit /></PageTransition>} />
          <Route path="inbox" element={<PageTransition><Inbox /></PageTransition>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((store) => store.user);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await api.get("profile/view");
        dispatch(addUser(res.data));
      } catch {
        dispatch(addUser(null));
      }
    };
    verifyToken();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center mesh-bg gap-4">
        <Skeleton className="size-12 rounded-2xl" />
        <p className="text-[13px] text-text-muted font-medium">Loading DevTinder...</p>
      </div>
    );
  }

  return (
    <BrowserRouter basename="/">
      <CommandPalette />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={appStore}>
      <ThemeProvider>
        <ToastProvider>
          <SocketProvider>
            <AppContent />
          </SocketProvider>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
