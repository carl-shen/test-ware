import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { history } from "../_helpers";

function TopNavbar() {
  const stats = useSelector((state) => state.stats);
  const user = useSelector((state) => state.authentication.user);
  const location = useLocation();

  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    const cleanPath = location.pathname.replace(/#/g, ""); // Remove any # that may be added by <a> tags
    if (
      stats !== undefined &&
      (cleanPath === "/trainer" || cleanPath === "/guest")
    ) {
      setPageTitle(
        <p className="m-0 labels">
          <b>{stats.items.ticker}</b>
        </p>
      );
    } else {
      setPageTitle("");
    }
  }, [location.pathname, stats]);

  const linkClassNames =
    "px-2 py-1 cursor-pointer font-semibold text-link-text-blue hover:text-white transition duration-200 ease-in-out";

  return (
    <div className="w-full z-30 bg-gradient-to-r from-dark-dark-gray to-dark-darker-gray">
      <div className="navbar" id="topnavbar">
        <a className={linkClassNames} onClick={() => history.push("/home")}>
          Home
        </a>
        {pageTitle}
        <a className={linkClassNames} onClick={() => history.push("/login")}>
          {user === undefined ? "Log In" : "Log Out"}
        </a>
      </div>
    </div>
  );
}

export { TopNavbar };
