import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ProfessorSubmit from "../../Modals/ProfessorSubmit";
import LoadingModal from "../../Modals/LoadingModal";
import { useAuth } from "../../Contexts/AuthProvider";

function ProfessorRow({ professor, setUpdate }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, loading, axiosFetch]: any = useAxiosFunction();
  const { auth } = useAuth();

  function handleUpdateClick() {
    setIsOpen((prev: boolean) => !prev);
  }

  function handleDeleteClick() {
    Swal.fire({
      title: "آیا از حذف این استاد مطمئن هستید؟",
      text: "با حذف این استاد ، هر اطلاعاتی که مربوط به این استاد می باشد هم حذف می شود",
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
          url: `/professors`,
          requestConfig: {
            data: { id: professor.id },
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
        <td>
          {professor.firstName} {professor.lastName}
        </td>
        <td>{professor.field_of_study_name}</td>
        <td>{professor.email}</td>
        <td>{professor.isInvited ? "مدعو" : "هیات علمی"}</td>
        <td>
          {professor.lastGrade === 1
            ? "کارشناسی"
            : professor.lastGrade === 2
            ? "کارشناسی ارشد"
            : "دکتری"}
        </td>
        <td>{professor.phoneNumber}</td>
        {auth.role === 1 && (
          <td>
            <FontAwesomeIcon icon={faEdit} onClick={handleUpdateClick} />
            <FontAwesomeIcon icon={faTrash} onClick={handleDeleteClick} />
          </td>
        )}
      </tr>
      {isOpen && (
        <ProfessorSubmit
          setEditOpen={setIsOpen}
          editData={professor}
          updateRows={setUpdate}
        />
      )}
      {loading && <LoadingModal />}
    </>
  );
}

export default ProfessorRow;
