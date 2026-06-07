import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import AppNavbar from "./AppNavbar";
import Skeleton from "../ui/Skeleton";

export function needsOnboarding(user) {
  return user && user.onboardingComplete !== true;
}

export default function AppShell() {
  const user = useSelector((store) => store.user.data);
  const { isLoading } = useSelector((store) => store.user);
  const location = useLocation();
  const isOnboarding = location.pathname === "/app/onboarding";

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col mesh-bg">
        <div className="h-16 glass-nav border-b border-black/[0.04] px-6 flex items-center justify-between">
          <Skeleton className="h-7 w-28 rounded-lg" />
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-xl" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>
        <div className="flex-1 container-narrow px-5 py-10">
          <Skeleton className="h-4 w-20 mb-3 rounded" />
          <Skeleton className="h-9 w-56 mb-8 rounded-lg" />
          <Skeleton className="w-full max-w-sm h-[540px] rounded-3xl mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (needsOnboarding(user) && !isOnboarding) {
    return <Navigate to="/app/onboarding" replace />;
  }

  if (!needsOnboarding(user) && isOnboarding) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col mesh-bg">
      {!isOnboarding && <AppNavbar />}
      <main className="flex-1 pb-8">
        <Outlet />
      </main>
    </div>
  );
}

export function PublicOnlyRoute({ children }) {
  const user = useSelector((store) => store.user.data);
  const { isLoading } = useSelector((store) => store.user);

  if (isLoading) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="size-14 rounded-2xl mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto rounded" />
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={needsOnboarding(user) ? "/app/onboarding" : "/app"} replace />;
  }

  return children;
}
