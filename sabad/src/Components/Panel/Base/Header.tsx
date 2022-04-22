import "../../../Styles/header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import UserName from "./Header/UserName";
import Messages from "./Header/Messages";
import { useState } from "react";

function Header({ asideRef, editProfileRef, setIsEditProfileOpen }: any) {
  const [asideIsOpen, setAsideIsOpen] = useState(false);

  function handleMenuClick() {
    asideRef.current.style.right = "0";
    setAsideIsOpen(true);
  }

  function handleArrowClick() {
    asideRef.current.style.right = "-20vw";
    setAsideIsOpen(false);
  }

  return (
    <header>
      <FontAwesomeIcon
        icon={faBars}
        className="menu-icon"
        onClick={handleMenuClick}
      />
      {asideIsOpen && (
        <FontAwesomeIcon
          icon={faArrowRight}
          className="arrow-right-icon"
          onClick={handleArrowClick}
        />
      )}
      <UserName
        editProfileRef={editProfileRef}
        setIsEditProfileOpen={setIsEditProfileOpen}
      />
      <Messages />
    </header>
  );
}

export default Header;
