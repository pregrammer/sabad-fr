import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import LoadingModal from "../../Modals/LoadingModal";

function CollegeRow({ college, setUpdate }: any) {
  const [inputOpen, setinputOpen] = useState(false);
  const [data, loading, axiosFetch]: any = useAxiosFunction();
  const [inputVal, setInputVal] = useState(college.name);

  function handleEditClick() {
    setinputOpen((prev: boolean) => !prev);
    setInputVal(college.name);
  }

  function handleInputChange(e: any) {
    setInputVal(e.target.value);
  }

  function handleEnterKey(e: any) {
    const value = e.target.value;
    if (e.key === "Enter" && value !== "") {
      axiosFetch({
        method: "PUT",
        url: "/colleges",
        requestConfig: {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            id: college.id,
            name: value,
          },
        },
      });
    }
  }

  function handleDeleteClick() {
    Swal.fire({
      title: "آیا از حذف این دانشکده مطمئن هستید؟",
      text: "با حذف این دانشکده ، هر اطلاعاتی که مربوط به این دانشکده می باشد هم حذف می شود",
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
          url: `/colleges`,
          requestConfig: {
            data: { id: college.id },
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
          <td>{college.name}</td>
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

export default CollegeRow;
