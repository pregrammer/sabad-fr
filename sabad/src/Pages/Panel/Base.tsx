import { Outlet, NavLink, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../Components/Contexts/AuthProvider";
import Header from "../../Components/Panel/Base/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingModal from "../../Components/Modals/LoadingModal";
import { useState } from "react";

function Base() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function logout() {
    try {
      setIsLoading(true);
      const response = await axios.get("/auth/logout");
      setIsLoading(false);
      if (response.status === 200) {
        setAuth({});
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      setIsLoading(false);
      if (!error.response) {
        toast.error("پاسخی از سرور دریافت نشد", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (
        error.response.status === 401 ||
        error.response.status === 403
      ) {
        setAuth({});
      } else {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Header />
      <div>Base</div>
      <button onClick={logout}>Log out</button>

      <NavLink
        to={"/panel/reports"}
        style={({ isActive }) => {
          return { color: isActive ? "red" : "green" };
        }}
      >
        Go to Reports
      </NavLink>
      <NavLink
        to={"/panel/management/professors"}
        style={({ isActive }) => {
          return { color: isActive ? "red" : "green" };
        }}
      >
        Go to Professors
      </NavLink>

      <Outlet />

      {isLoading && <LoadingModal />}
    </>
  );
}

export default Base;
