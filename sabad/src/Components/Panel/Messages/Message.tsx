import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import LoadingModal from "../../Modals/LoadingModal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function Message({ message, isInbox, setUpdate }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  function deleteClick(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: "آیا از حذف این پیام مطمئن هستید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "بله",
      cancelButtonText: "خیر",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  }

  function handleDelete() {
    axiosFetch({
      method: "DELETE",
      url: `/messages`,
      requestConfig: {
        data: { id: message.id },
      },
    });
  }

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      toast.success(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setUpdate((prev: boolean) => !prev);
    }
  }, [data]);

  return (
    <>
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
            {message.created_at.split("T").reverse().join(" _ ")}
          </span>
          <span className="extra">
            {message.isSeen !== undefined &&
              message.isSeen !== 0 &&
              !isInbox && <span className="is-seen">دیده شده</span>}
            <FontAwesomeIcon icon={faTrash} onClick={deleteClick} />
          </span>
        </div>
        {isOpen && (
          <div className="down">
            {message.firstName && <div className="title">{message.title}</div>}
            {message.body}
          </div>
        )}
      </div>
      {loading && <LoadingModal />}
    </>
  );
}

export default Message;
