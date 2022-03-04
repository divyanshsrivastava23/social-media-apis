import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useUser } from "../Contexts/UserContext";
const Nav = () => {
  const { state, dispatch } = useUser();
  const history = useHistory();
  const renderList = () => {
    if (state) {
      return [
        <li key={1} className="navigation__list-items">
          <NavLink
            to="/profile"
            className="links"
            activeClassName="active-class"
          >
            Profile
          </NavLink>
        </li>,
        <li key={2} className="navigation__list-items">
          <NavLink
            to="/createpost"
            className="links"
            activeClassName="active-class"
          >
            Create Post
          </NavLink>
        </li>,
        <li key={6} className="navigation__list-items">
          <NavLink
            to="/followingposts"
            className="links"
            activeClassName="active-class"
          >
            Following Post
          </NavLink>
        </li>,
        <li key={5} className="navigation__list-items">
          <button
            className="btn logout-btn"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key={3} className="navigation__list-items">
          <NavLink
            to="/signin"
            className="links"
            activeClassName="active-class"
          >
            Login
          </NavLink>
        </li>,
        <li key={4} className="navigation__list-items">
          <NavLink
            to="/signup"
            className="links"
            activeClassName="active-class"
          >
            Sign Up
          </NavLink>
        </li>,
      ];
    }
  };

  return (
    <nav className="navigation">
      <div className="navigation__logo">
        <NavLink to={state ? "/" : "/signin"} className="navigation__logo-text">
          Clickera
        </NavLink>
      </div>
      <ul className="navigation__list">{renderList()}</ul>
    </nav>
  );
};

export default Nav;
