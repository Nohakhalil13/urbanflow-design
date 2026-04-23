import { Navigate } from "react-router-dom";
import { useApp } from "@/lib/app-context";
import Login, { redirectFor } from "./auth/Login";

const Index = () => {
  const { user } = useApp();
  if (user) return <Navigate to={redirectFor(user.role)} replace />;
  return <Login />;
};

export default Index;
