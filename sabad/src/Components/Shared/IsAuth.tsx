import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "../../api/axios";

const IsAuth = () => {
  const [signedIn, setSignedIn] = useState(false);
  (async function get_user() {
    try {
      await axios.get("/users/user", {
        withCredentials: true,
      });
      setSignedIn(true);
    } catch (error) {}
  })();

  return signedIn ? <Navigate to="/panel" /> : <Outlet />;
};

export default IsAuth;
