import { Outlet } from "react-router-dom";
import ManagementAside from "../../../Components/Panel/Management/ManagementAside";
import "../../../Styles/management.scss";

function Management() {
  return (
    <>
      <div className="management-base">
        <ManagementAside />
        <div
          className="content"
          style={{ minHeight: `${window.innerHeight - 100}px` }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Management;
