import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import TimeSubmit from "../../Modals/TimeSubmit";
import LoadingModal from "../../Modals/LoadingModal";

function TimeRow({ time, setUpdate }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  function handleUpdateClick() {
    setIsOpen((prev: boolean) => !prev);
  }

  function handleDeleteClick() {
    Swal.fire({
      title: "آیا از حذف این زمان مطمئن هستید؟",
      text: "با حذف این زمان ، هر اطلاعاتی که مربوط به این زمان می باشد هم حذف می شود",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "بله",
      cancelButtonText: "خیر",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosFetch({
          method: "DELETE",
          url: `/times`,
          requestConfig: {
            data: { id: time.id },
          },
        });
      }
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
      <tr>
        <td>{time.start}</td>
        <td>{time.end}</td>
        <td>
          <FontAwesomeIcon icon={faEdit} onClick={handleUpdateClick} />
          <FontAwesomeIcon icon={faTrash} onClick={handleDeleteClick} />
        </td>
      </tr>
      {isOpen && (
        <TimeSubmit
          setIsOpen={setIsOpen}
          editData={time}
          updateRows={setUpdate}
        />
      )}
      {loading && <LoadingModal />}
    </>
  );
}

export default TimeRow;
