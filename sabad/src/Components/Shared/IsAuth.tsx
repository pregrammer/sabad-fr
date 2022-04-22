import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "../../api/axios";
import Login from "../../Pages/Login";
import { useAuth } from "../Contexts/AuthProvider";
import LoadingModal from "../Modals/LoadingModal";

const IsAuth = () => {
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    async function get_user() {
      try {
        const response = await axios.get("/users/user");
        if (response.status === 200) {
          setAuth(response.data.user);
          setIsLoading(false);
          setIsSigned(true);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    get_user();
  }, []);

  if (isLoading) {
    return <LoadingModal />;
  } else if (isSigned) {
    return <Navigate to="/panel" />;
  } else {
    return <Login />;
  }
};

export default IsAuth;
