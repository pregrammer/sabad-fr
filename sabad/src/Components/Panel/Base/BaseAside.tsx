import { NavLink } from "react-router-dom";
import logo from "../../../logo.png";

function BaseAside({ asideRef }: any) {
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
        <NavLink
          to={"/panel/schedules"}
          className={({ isActive }) => {
            return isActive ? "tab" : "un-tab";
          }}
        >
          برنامه ریزی درسی
        </NavLink>
        <NavLink
          to={"/panel/management/users"}
          className={({ isActive }) => {
            return isActive ? "tab" : "un-tab";
          }}
        >
          مدیریت سیستم
        </NavLink>
      </div>
    </aside>
  );
}

export default BaseAside;
