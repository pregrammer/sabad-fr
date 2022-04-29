import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoadingModal from "../../Modals/LoadingModal";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import UserSubmit from "../../Modals/UserSubmit";

function UserRow({ user, setUpdate }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  function handleUpdateClick() {
    setIsOpen((prev: boolean) => !prev);
  }

  function handleDeleteClick() {
    Swal.fire({
      title: "آیا از حذف این کاربر مطمئن هستید؟",
      text: "با حذف این کاربر ، هر اطلاعاتی که مربوط به این کاربر می باشد هم حذف می شود",
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
          url: `/users`,
          requestConfig: {
            data: { id: user.id },
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
          {user.firstName} {user.lastName}
        </td>
        <td>
          {user.role === 2
            ? "مدیر گروه تخصصی"
            : user.role === 3
            ? "مدیر گروه عمومی"
            : "کارشناس گروه"}
        </td>
        <td>{user.field_of_study_name}</td>
        <td>{user.email}</td>
        <td>{user.phoneNumber}</td>
        <td>
          <FontAwesomeIcon icon={faEdit} onClick={handleUpdateClick} />
          <FontAwesomeIcon icon={faTrash} onClick={handleDeleteClick} />
        </td>
      </tr>
      {isOpen && (
        <UserSubmit
          setIsOpen={setIsOpen}
          editData={user}
          updateRows={setUpdate}
        />
      )}
      {loading && <LoadingModal />}
    </>
  );
}

export default UserRow;
