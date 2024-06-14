import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";
import { AuthContext } from "../../contexts/authContext";

const NavLinks = (props) => {
    const auth = useContext(AuthContext);
    return (
        <ul className='nav-links'>
            <li>
                <NavLink to='/' exact>
                    All Users
                </NavLink>
            </li>
            {auth.isLoggedIn && (
                <li>
                    <NavLink to={`/${auth.user?.id}/places`}>My Places</NavLink>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                    <NavLink to='/places/new'>Add Places</NavLink>
                </li>
            )}
            {auth.isLoggedIn && (
                <li className="user-name">
                    {auth.user?.name}
                </li>
            )}
            {!auth.isLoggedIn ? (
                <li>
                    <NavLink to='/auth'>Authenticate</NavLink>
                </li>
            ):(
                <li>
                    <NavLink to='/auth' onClick={auth.logout}>Logout</NavLink>
                </li>
            )}
        </ul>   
    );
};

export default NavLinks;
