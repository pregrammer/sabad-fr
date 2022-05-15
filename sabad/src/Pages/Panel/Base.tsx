import { Outlet } from "react-router-dom";
import Header from "../../Components/Panel/Base/Header";
import { ToastContainer } from "react-toastify";
import "../../Styles/base.scss";
import { useState, useEffect, useRef } from "react";
import EditProfile from "../../Components/Modals/EditProfile";
import BaseAside from "../../Components/Panel/Base/BaseAside";

function Base() {
  const asideRef = useRef(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const editProfileRef: any = useRef(null);

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

      {isEditProfileOpen && (
        <EditProfile
          editProfileRef={editProfileRef}
          setIsEditProfileOpen={setIsEditProfileOpen}
        />
      )}

      <Header
        asideRef={asideRef}
        editProfileRef={editProfileRef}
        setIsEditProfileOpen={setIsEditProfileOpen}
      />

      <BaseAside asideRef={asideRef} />

      <Outlet />
    </>
  );
}

export default Base;
