import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import challenges from '../_configs/challenges.json';
import { appActions } from '../_actions';
import { history } from '../_helpers';

function HomePage() {
    const user = useSelector(state => state.authentication.user);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(userActions.getAll());
    // }, []);

    // function handleDeleteUser(id) {
    //     dispatch(userActions.delete(id));
    // }

    const selectChallengeGo = (challengeItem) => {
        console.log(challengeItem.dataSetName);
        dispatch(appActions.setTrainingDataSet(challengeItem.dataSetName));
        history.push('/trainer');
    };

    const challengeList = challenges.items.map((item, index) => {
        return (
            <a key={index} onClick={() => selectChallengeGo(item)} className="list-group-item list-group-item-action flex-column align-items-start" data-toggle="tooltip" title={item.description}>
                <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{item.dataSetName}</h5>
                    <small>{item.era}</small>
                </div>
                <p className="mb-1">{item.shortDescription}</p>
            </a>
            // <li key={index} className="list-group">
            //     <a className="btn btn-primary m-2 d-inline-block" onClick={() => selectChallenge(item)}>{item.dataSetName}</a>
            //     <p className="text-white align-middle m-2 d-inline-block">{item.era}</p>
            //     <p className="text-white align-middle m-2 d-inline-block">{item.shortDescription}</p>
            // </li>
        );
    });

    return (
        <div className="col-lg-8 offset-lg-3 verticalUpper widthWide">
            <h1 className="text-white">Welcome to Test-Ware, {user.username}!</h1>
            <br />
            <h4 className="text-white">Select your challenge to begin:</h4>
            <br />
            <div className="list-group">
                { challengeList }
            </div>
            

        </div>
    );

}

export { HomePage };