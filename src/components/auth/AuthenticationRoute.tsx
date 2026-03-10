import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthenLoadingScreen from "./AuthenLoadingScreen";

interface AuthenticationRouteProps {
  isLoading: boolean | null;
  isAuthenticated: boolean;
  children: React.ReactNode;
  bypassRedirect?: boolean;
}

const AuthenticationRoute = ({
  isLoading,
  isAuthenticated,
  children,
  bypassRedirect = false,
}: AuthenticationRouteProps) => {
  const router = useRouter();

  useEffect(() => {
    // ถ้า bypassRedirect = true จะไม่ redirect
    if (isLoading === false && isAuthenticated && !bypassRedirect) {
      router.replace("/login-technician");
    }
  }, [isLoading, isAuthenticated, bypassRedirect]);

  if (isLoading === null || isLoading) {
    return <AuthenLoadingScreen />;
  }

  if (isAuthenticated && !bypassRedirect) {
    return null;
  }

  return <>{children}</>;
};

export default AuthenticationRoute;
