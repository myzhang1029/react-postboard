import { FaUserCircle } from "react-icons/fa";

import './NavBar.css';
import LoginBox from './LoginBox';

function NavBar({ title }) {
    return (
        <nav>
            <h1 className="navbar-main-title">{title}</h1>
            <div className="login-icon">
                <FaUserCircle />
            </div>
        </nav>
    );
}

export default NavBar;
