import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { useMsgCount } from "../../../Contexts/MsgCountProvider";

function Messages() {
  const navigate = useNavigate();
  const { count } = useMsgCount();

  function handleClick() {
    navigate("/panel/messages");
  }

  return (
    <div className="messages" onClick={handleClick}>
      {count !== 0 && <div className="new-message-bullet"></div>}
      <FontAwesomeIcon icon={faEnvelope} className="message-icon" />
    </div>
  );
}

export default Messages;
