import { Outlet } from "react-router-dom";
import MessagesAside from "../../../Components/Panel/Messages/MessagesAside";
import "../../../Styles/messages.scss";


function Messages() {
  return (
    <>
      <div className="messages-base">
        <MessagesAside />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Messages;
