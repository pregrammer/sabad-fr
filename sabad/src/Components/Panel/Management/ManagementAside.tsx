import { NavLink } from "react-router-dom";

function ManagementAside() {
  return (
    <aside>
      <NavLink
        to={"/panel/management/users"}
        className={({ isActive }) => {
          return isActive ? "tab" : "un-tab";
        }}
      >
        کاربران
      </NavLink>
      <NavLink
        to={"/panel/management/field-of-studies"}
        className={({ isActive }) => {
          return isActive ? "tab" : "un-tab";
        }}
      >
        رشته ی تحصیلی
      </NavLink>
      <NavLink
        to={"/panel/management/colleges"}
        className={({ isActive }) => {
          return isActive ? "tab" : "un-tab";
        }}
      >
        دانشکده
      </NavLink>
      <NavLink
        to={"/panel/management/times"}
        className={({ isActive }) => {
          return isActive ? "tab" : "un-tab";
        }}
      >
        ساعت درسی
      </NavLink>
      <NavLink
        to={"/panel/management/semester"}
        className={({ isActive }) => {
          return isActive ? "tab" : "un-tab";
        }}
      >
        نیمسال
      </NavLink>
    </aside>
  );
}

export default ManagementAside;
