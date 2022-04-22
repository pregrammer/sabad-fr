import { NavLink } from "react-router-dom";
import { useMsgCount } from "../../Contexts/MsgCountProvider";

function MessagesAside() {
  const { count } = useMsgCount();

  return (
    <aside>
      <NavLink
        to={"/panel/messages/saved"}
        className={({ isActive }) => {
          return isActive ? "tab" : "un-tab";
        }}
      >
        پیام های من
      </NavLink>

      <NavLink
        to={"/panel/messages/inbox"}
        className={({ isActive }) => {
          return isActive ? "tab" : "un-tab";
        }}
      >
        صندوق پیام ها
      </NavLink>
      {count !== 0 && <div className="new-message-badge">{count}</div>}

      <NavLink
        to={"/panel/messages/send"}
        className={({ isActive }) => {
          return isActive ? "tab" : "un-tab";
        }}
      >
        ارسال پیام
      </NavLink>

      <NavLink
        to={"/panel/messages/sent"}
        className={({ isActive }) => {
          return isActive ? "tab" : "un-tab";
        }}
      >
        پیام های ارسالی
      </NavLink>
    </aside>
  );
}

export default MessagesAside;
