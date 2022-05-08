import { Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/AuthProvider";

const HasRole = ({ allowedRoles }: any) => {
  const { auth } = useAuth();

  return allowedRoles.includes(auth.role) ? (
    <Outlet />
  ) : (
    <h1 className="no-permission">دسترسی غیر مجاز!</h1>
  );
};

export default HasRole;
