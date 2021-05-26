import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../loginPages.css';
import { userActions } from '../actions';

function HomePage() {
    const users = useSelector(state => state.users);
    const user = useSelector(state => state.authentication.user);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(userActions.getAll());
    // }, []);

    // function handleDeleteUser(id) {
    //     dispatch(userActions.delete(id));
    // }

    return (
        <div className="col-lg-8 offset-lg-3 verticalUpper">

            <h1 className="text-white">Welcome to Test-Ware!</h1>
            <br />
            <h4 className="text-white">Please login or register to start</h4>
            <br />
            <p>
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/register" className="btn btn-link">Register</Link>
            </p>

        </div>
    );

}

export { HomePage };