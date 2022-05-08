import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import ClassSubmit from "../../Modals/ClassSubmit";
import LoadingModal from "../../Modals/LoadingModal";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthProvider";

function ClassRow({ kelas, setUpdate }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, loading, axiosFetch]: any = useAxiosFunction();
  const { auth } = useAuth();

  function handleUpdateClick() {
    setIsOpen((prev: boolean) => !prev);
  }

  function handleDeleteClick() {
    Swal.fire({
      title: "آیا از حذف این کلاس مطمئن هستید؟",
      text: "با حذف این کلاس ، هر اطلاعاتی که مربوط به این کلاس می باشد هم حذف می شود",
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
          url: `/classes`,
          requestConfig: {
            data: { id: kelas.id },
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
        <td>{kelas.title}</td>
        <td>{kelas.hasProjector ? "دارد" : "ندارد"}</td>
        <td>
          <span>{kelas.capacity}</span> نفر
        </td>
        <td>{kelas.college_name}</td>
        <td>
          <Link to={`/panel/class-schedule/${kelas.id}`}>برنامه ی کلاس</Link>
          {auth.role === 1 && (
            <FontAwesomeIcon icon={faEdit} onClick={handleUpdateClick} />
          )}
          {auth.role === 1 && (
            <FontAwesomeIcon icon={faTrash} onClick={handleDeleteClick} />
          )}
        </td>
      </tr>
      {isOpen && (
        <ClassSubmit
          setEditOpen={setIsOpen}
          editData={kelas}
          updateRows={setUpdate}
        />
      )}
      {loading && <LoadingModal />}
    </>
  );
}

export default ClassRow;
