import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import LoadingModal from "../../Modals/LoadingModal";

function FosRow({ field_of_study, setUpdate }: any) {
  const [inputOpen, setinputOpen] = useState(false);
  const [data, loading, axiosFetch]: any = useAxiosFunction();
  const [inputVal, setInputVal] = useState(field_of_study.name);

  function handleEditClick() {
    setinputOpen((prev: boolean) => !prev);
    setInputVal(field_of_study.name);
  }

  function handleInputChange(e: any) {
    setInputVal(e.target.value);
  }

  function handleEnterKey(e: any) {
    const value = e.target.value;
    if (e.key === "Enter" && value !== "") {
      axiosFetch({
        method: "PUT",
        url: "/field_of_studies",
        requestConfig: {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            id: field_of_study.id,
            name: value,
          },
        },
      });
    }
  }

  function handleDeleteClick() {
    Swal.fire({
      title: "آیا از حذف این رشته مطمئن هستید؟",
      text: "با حذف این رشته ، هر اطلاعاتی که مربوط به این رشته می باشد هم حذف می شود",
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
          url: `/field_of_studies`,
          requestConfig: {
            data: { id: field_of_study.id },
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
        {inputOpen ? (
          <td>
            <input
              type="text"
              value={inputVal}
              onChange={handleInputChange}
              autoFocus
              onBlur={handleEditClick}
              onKeyUp={handleEnterKey}
            />
          </td>
        ) : (
          <td>{field_of_study.name}</td>
        )}
        <td>
          <FontAwesomeIcon icon={faEdit} onClick={handleEditClick} />
          <FontAwesomeIcon icon={faTrash} onClick={handleDeleteClick} />
        </td>
      </tr>
      {loading && <LoadingModal />}
    </>
  );
}

export default FosRow;
