import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { history } from '../_helpers'; 

function TopNavbar() {
    const stats = useSelector(state => state.stats);
    const location = useLocation();

    const [ pageTitle, setPageTitle ] = useState("");

    useEffect(() => {
        const cleanPath = location.pathname.replace("#","");  // remove any # that may be added by <a> tags
        if (stats !== undefined && (cleanPath === "/trainer" || cleanPath === "/guest")) {
            setPageTitle(<p className="m-0 labels"><b>{stats.items.ticker}</b></p>);
        } else {
            setPageTitle("");
        }
    }, []);

    return (
        <div id="topnavbar-container">
            <div className="navbar" id="topnavbar">
                <a className="nav-item btn btn-primary narrow-button" onClick={() => history.push('/home')}>Home</a>
                {pageTitle}
                <a className="nav-item btn btn-link narrow-button" onClick={() => history.push('/login')}>Logout</a>
            </div>
        </div>
    );
}

export { TopNavbar };