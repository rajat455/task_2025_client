import { Navigate } from "react-router-dom";
import {useLocation} from "react-router-dom"

export default function ProtectedRoute({ Auth, setAuth, Component }) {
  const location  = useLocation() 
  if (!Auth) return <Navigate to="/login" replace />;
  if(location.pathname === "/listUser" && Auth && Auth.role !== "admin") return <Navigate to="/forbidden" replace/>
  return Component;
}
