import { FaUserCircle } from "react-icons/fa";
import { useState } from 'react';

import './NavBar.css';
import LoginBox from './LoginBox';

function NavBar({ title }) {
    const [loginOpen, setLoginOpen] = useState(false);
    return (
        <nav>
            <h1 className="navbar-main-title">{title}</h1>
            <div className="login-icon">
                <FaUserCircle onClick={() => setLoginOpen(!loginOpen)} />
            </div>
            {loginOpen && <LoginBox />}
        </nav>
    );
}

export default NavBar;
