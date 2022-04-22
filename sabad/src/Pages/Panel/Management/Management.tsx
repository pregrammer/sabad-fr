import { Outlet } from "react-router-dom";
import ManagementAside from "../../../Components/Panel/Management/ManagementAside";
import "../../../Styles/management.scss";

function Management() {
  return (
    <>
      <div className="management-base">
        <ManagementAside />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Management;
