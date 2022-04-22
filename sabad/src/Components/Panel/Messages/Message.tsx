import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function Message({ message, isInbox }: any) {
  const [isOpen, setIsOpen] = useState(false);

  function handleDelete(e: any) {
    e.stopPropagation();
    alert(`message ${message.id} deleted`);
  }

  return (
    <div
      className="message"
      onClick={() => setIsOpen((prev) => !prev)}
      style={isInbox && message.isSeen ? { color: "gray" } : {}}
    >
      <div className="top">
        <span className="name-or-title">
          {message.firstName
            ? `${message.firstName} ${message.lastName} (${message.field_of_study})`
            : message.title}
        </span>
        <span className="date">
          {message.created_at.split("T").reverse().join(" - ")}
        </span>
        <span className="extra">
          {message.isSeen !== undefined && !isInbox && (
            <span className="is-seen">دیده شده</span>
          )}
          <FontAwesomeIcon icon={faTrash} onClick={handleDelete} />
        </span>
      </div>
      {isOpen && (
        <div className="down">
          {message.firstName && <div className="title">{message.title}</div>}
          {message.body}
        </div>
      )}
    </div>
  );
}

export default Message;
