import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../Contexts/AuthProvider";
import { useState, useRef, useEffect } from "react";
import UserSetting from "./UserSetting";

function UserName({editProfileRef, setIsEditProfileOpen}: any) {
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const userSettingRef: any = useRef(null);
  const userNameRef: any = useRef(null);

  // for removing userSetting when click on other place than userSetting and userName and editProfile.
  useEffect(() => {
    function handleOutsideClick(event: any) {
      if (
        userSettingRef.current &&
        !userSettingRef.current.contains(event.target) &&
        !userNameRef.current.contains(event.target) &&
        !editProfileRef.current?.contains(event.target)
      ) {
        setIsOpen((prev) => !prev);
      }
    }

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [userSettingRef]);

  return (
    <>
      <div
        className="user-name-container"
        ref={userNameRef}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <FontAwesomeIcon
          icon={faAngleDown}
          className="angle-down-icon"
          style={isOpen ? { transform: "rotate(180deg)" } : {}}
        />
        <span>
          {auth.firstName} {auth.lastName}
        </span>
      </div>
      {isOpen && (
        <UserSetting
          userSettingRef={userSettingRef}
          successClose={() => setIsOpen((prev) => !prev)}
          setIsEditProfileOpen={setIsEditProfileOpen}
        />
      )}
    </>
  );
}

export default UserName;
