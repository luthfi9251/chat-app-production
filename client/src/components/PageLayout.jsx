import styles from "./PageLayout.module.css";
import homeIcon from "../assets/home-icon.png";
import { Link } from "react-router-dom";

export default function PageLayout({ children }) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Link className={styles.link} to="/chat">
                    <img src={homeIcon} alt="" />
                </Link>

                {children}
            </div>
        </div>
    );
}
