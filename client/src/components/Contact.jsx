import style from "./Contact.module.css";
import SidebarContext from "../context/SidebarContext";
import { useContext } from "react";

export default function Contact({ data }) {
  let { handleOpenAndClose, setRoomActive, setFriendActive } =
    useContext(SidebarContext);

  let handleClick = () => {
    handleOpenAndClose();
    setRoomActive(data.conversationId);
    setFriendActive(data);
  };

  return (
    <div className={style.container} onClick={handleClick}>
      <img src={data.profilePicture} alt={data.name} />
      <span>{data.name}</span>
    </div>
  );
}
