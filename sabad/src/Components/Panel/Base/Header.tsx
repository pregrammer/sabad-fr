import "../../../Styles/header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import UserName from "./Header/UserName";
import Messages from "./Header/Messages";
import { useState, useEffect, useRef } from "react";

function Header({ asideRef, editProfileRef, setIsEditProfileOpen }: any) {
  const [asideIsOpen, setAsideIsOpen] = useState(false);
  const hamberRef: any = useRef(null);

  function handleMenuClick() {
    asideRef.current.style.right = "0";
    setAsideIsOpen(true);
  }

  function handleArrowClick() {
    asideRef.current.style.right = "-20vw";
    setAsideIsOpen(false);
  }

  // for removing aside when click on other place than aside.
  useEffect(() => {
    function OutsideAsiedeClick(event: any) {
      if (
        !asideRef.current?.contains(event.target) &&
        !hamberRef.current?.contains(event.target)
      ) {
        if (asideIsOpen) {
          handleArrowClick();
        }
      }
    }

    document.addEventListener("click", OutsideAsiedeClick);
    return () => document.removeEventListener("click", OutsideAsiedeClick);
  }, [asideIsOpen]);

  return (
    <header>
      <span ref={hamberRef}>
        <FontAwesomeIcon
          icon={faBars}
          className="menu-icon"
          onClick={handleMenuClick}
        />
      </span>
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
