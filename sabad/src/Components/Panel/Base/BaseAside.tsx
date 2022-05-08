import { NavLink } from "react-router-dom";
import logo from "../../../logo.png";
import { useAuth } from "../../Contexts/AuthProvider";

function BaseAside({ asideRef }: any) {
  const { auth } = useAuth();

  return (
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
          to={"/panel/professors"}
          className={({ isActive }) => {
            return isActive ? "tab" : "un-tab";
          }}
        >
          لیست اساتید
        </NavLink>
        {(auth.role === 2 || auth.role === 3) && (
          <NavLink
            to={"/panel/schedules"}
            className={({ isActive }) => {
              return isActive ? "tab" : "un-tab";
            }}
          >
            برنامه ریزی درسی
          </NavLink>
        )}
        {auth.role === 1 && (
          <NavLink
            to={"/panel/management/users"}
            className={({ isActive }) => {
              return isActive ? "tab" : "un-tab";
            }}
          >
            مدیریت سیستم
          </NavLink>
        )}
      </div>
    </aside>
  );
}

export default BaseAside;
