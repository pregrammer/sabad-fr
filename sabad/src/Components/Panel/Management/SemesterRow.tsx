import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import SemesterSubmit from "../../Modals/SemesterSubmit";
import Swal from "sweetalert2";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import LoadingModal from "../../Modals/LoadingModal";
import { toast } from "react-toastify";

function SemesterRow({ semester, setUpdate }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  function handleUpdateClick() {
    setIsOpen((prev: boolean) => !prev);
  }

  function handleDeleteClick() {
    Swal.fire({
      title: "آیا از حذف این نیمسال مطمئن هستید؟",
      text: "با حذف این نیمسال ، هر اطلاعاتی که مربوط به این نیمسال می باشد هم حذف می شود",
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
          url: `/semesters`,
          requestConfig: {
            data: { test_date_id: semester.test_date_id },
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
        <td>{semester.educationYear}</td>
        <td>
          {semester.yearPart === 1
            ? "اول"
            : semester.yearPart === 2
            ? "دوم"
            : "تابستان"}
        </td>
        <td>
          {JSON.parse(semester.semesterDate).day +
            " / " +
            JSON.parse(semester.semesterDate).month +
            " / " +
            JSON.parse(semester.semesterDate).year}
        </td>
        <td>
          {JSON.parse(semester.unitDate).day +
            " / " +
            JSON.parse(semester.unitDate).month +
            " / " +
            JSON.parse(semester.unitDate).year}
        </td>
        <td>
          {JSON.parse(semester.editUnitDate).day +
            " / " +
            JSON.parse(semester.editUnitDate).month +
            " / " +
            JSON.parse(semester.editUnitDate).year}
        </td>
        <td>
          <FontAwesomeIcon icon={faEdit} onClick={handleUpdateClick} />
          <FontAwesomeIcon icon={faTrash} onClick={handleDeleteClick} />
        </td>
      </tr>
      {isOpen && (
        <SemesterSubmit
          setIsOpen={setIsOpen}
          editData={semester}
          updateRows={setUpdate}
        />
      )}
      {loading && <LoadingModal />}
    </>
  );
}

export default SemesterRow;
