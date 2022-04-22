import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../../../Modals/LoadingModal";
import { useAuth } from "../../../Contexts/AuthProvider";
import useAxiosFunction from "../../../../Helpers/useAxiosFunction";
import { useEffect } from "react";

function UserSetting({ userSettingRef, setIsEditProfileOpen }: any) {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  function logout() {
    axiosFetch({
      method: "GET",
      url: "/auth/logout",
    });
  }

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      setAuth({});
      navigate("/", { replace: true });
    }
  }, [data]);

  return (
    <>
      <div className="user-setting" ref={userSettingRef}>
        <div
          className="option"
          onClick={() => setIsEditProfileOpen((prev: any) => !prev)}
        >
          ویرایش مشخصات
          <FontAwesomeIcon icon={faEdit} />
        </div>
        <div className="option" onClick={logout}>
          خروج
          <FontAwesomeIcon icon={faSignOut} />
        </div>
      </div>
      {loading && <LoadingModal />}
    </>
  );
}

export default UserSetting;
