import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoadingModal from "../../Modals/LoadingModal";
import CourseSubmit from "../../Modals/CourseSubmit";

function CourseRow({ course, setUpdate }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  function handleUpdateClick() {
    setIsOpen((prev: boolean) => !prev);
  }

  function handleDeleteClick() {
    Swal.fire({
      title: "آیا از حذف این درس مطمئن هستید؟",
      text: "با حذف این درس ، هر اطلاعاتی که مربوط به این درس می باشد هم حذف می شود",
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
          url: `/courses`,
          requestConfig: {
            data: { id: course.id },
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
        <td>{course.name}</td>
        <td>{course.unit}</td>
        <td>{course.kind}</td>
        <td>{course.code}</td>
        <td>ترم {course.termNumber}</td>
        <td>
          {course.grade === 1
            ? "کارشناسی"
            : course.grade === 2
            ? "کارشناسی ارشد"
            : "دکتری"}
        </td>
        <td>{course.pre_name ? course.pre_name : "ندارد"}</td>
        <td>{course.need_name ? course.need_name : "ندارد"}</td>
        <td>
          <FontAwesomeIcon icon={faEdit} onClick={handleUpdateClick} />
          <FontAwesomeIcon icon={faTrash} onClick={handleDeleteClick} />
        </td>
      </tr>
      {isOpen && (
        <CourseSubmit
          setEditOpen={setIsOpen}
          editData={course}
          updateRows={setUpdate}
        />
      )}
      {loading && <LoadingModal />}
    </>
  );
}

export default CourseRow;
