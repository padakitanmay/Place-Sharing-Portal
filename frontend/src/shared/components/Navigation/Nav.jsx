import React, { useState } from "react";
import "./Nav.css";
import Header from "./Header";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import BackDrop from "../UIElements/BackDrop";

const Nav = (props) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const openDrawerHandler = () => {
        setIsDrawerOpen(true);
    };

    const closeDrawerHandler = () => {
        setIsDrawerOpen(false);
    };

    return (
        <>
            {isDrawerOpen && <BackDrop onClick={closeDrawerHandler} />}
            <SideDrawer show={isDrawerOpen} onClick={closeDrawerHandler}>
                <nav className='main-navigation__drawer-nav'>
                    <NavLinks />
                </nav>
            </SideDrawer>

            <Header>
                <button
                    className='main-navigation__menu-btn'
                    onClick={openDrawerHandler}
                >
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className='main-navigation__title'>
                    <Link to='/'>Place Sharing Portal</Link>
                </h1>
                <nav className='main-navigation__header-nav'>
                    <NavLinks />
                </nav>
            </Header>
        </>
    );
};

export default Nav;
