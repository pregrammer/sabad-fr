import { useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../Contexts/AuthProvider";

const RequireAuth = ({ allowedRoles }: any) => {
  const { auth, setAuth } = useAuth();
  const location = useLocation();
  const [isSignedIn, setIsSignedIn] = useState(true);

  // if you refresh any page or insert any url, auth context removed;
  // if you still signed in, you gotta have jwt token in your cookie;
  // if you have jwt, get_user method give user from server and set it to auth context;
  // if you dont have jwt, server gives 401 back to you; then you navigate user to login.
  async function get_user() {
    try {
      const response = await axios.get("/users/user");
      if (response.status === 200) {
        setAuth(response.data.user);
      }
    } catch (error) {
      setIsSignedIn(false);
    }
  }

  if (Object.keys(auth).length === 0) {
    get_user();
  }

  return isSignedIn && allowedRoles.includes(auth.role) ? (
    <Outlet />
  ) : isSignedIn && allowedRoles.includes(auth.role) === false ? (
    <h1>you're not allowed</h1>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;
