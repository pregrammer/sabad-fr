import { Outlet, NavLink } from "react-router-dom";
import Header from "../../Components/Panel/Base/Header";
import { ToastContainer } from "react-toastify";
import "../../Styles/base.scss";
import { useState, useEffect, useRef } from "react";
import logo from "../../logo.png";
import EditProfile from "../../Components/Modals/EditProfile";

function Base() {
  const asideRef = useRef(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const editProfileRef: any = useRef(null);

  useEffect(() => {
    // Login should has overflow: hidden on its body; we change it here.
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, []);

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

      <aside className="base-aside" ref={asideRef}>
        <div className="top-aside">
          <span>سامانه ی برنامه ریزی درسی</span>
          <img src={logo} alt="logo" />
        </div>
        <div className="tabs">
          <NavLink
            to={"/panel/reports"}
            className={({ isActive }) => {
              return isActive ? "tab" : "un-tab";
            }}
          >
            گزارش های برنامه ریزی درسی
          </NavLink>
          <NavLink
            to={"/panel/courses"}
            className={({ isActive }) => {
              return isActive ? "tab" : "un-tab";
            }}
          >
            لیست دروس
          </NavLink>
          <NavLink
            to={"/panel/classes"}
            className={({ isActive }) => {
              return isActive ? "tab" : "un-tab";
            }}
          >
            لیست کلاس ها
          </NavLink>
          <NavLink
            to={"/panel/schedules"}
            className={({ isActive }) => {
              return isActive ? "tab" : "un-tab";
            }}
          >
            برنامه ریزی درسی
          </NavLink>
          <NavLink
            to={"/panel/semester"}
            className={({ isActive }) => {
              return isActive ? "tab" : "un-tab";
            }}
          >
            نیمسال
          </NavLink>
          <NavLink
            to={"/panel/management"}
            className={({ isActive }) => {
              return isActive ? "tab" : "un-tab";
            }}
          >
            مدیریت سیستم
          </NavLink>
        </div>
      </aside>

      <Outlet />
    </>
  );
}

export default Base;
