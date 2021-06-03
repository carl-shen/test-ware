import React from 'react';

function TopNavbar() {

    return (
        <div id="topnavbar-container">
            <div className="navbar" id="topnavbar">
                <a className="nav-item btn btn-primary narrow-button" href="./home">Home</a>
                <a className="nav-item btn btn-link narrow-button" href="./login">Logout</a>
            </div>
        </div>
    );
}

export { TopNavbar };