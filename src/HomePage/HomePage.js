import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { appActions, alertActions } from '../_actions';
import { history } from '../_helpers';
import { TopNavbar } from '../_components';
import config from '../_configs/configs.json';

function HomePage() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.authentication.user);

    const [ challenges, setChallenges ] = useState();

    const selectChallengeGo = (challengeItem) => {
        dispatch(appActions.setTrainingDataSet(challengeItem.dataSetName));
        history.push('/trainer');
    };

    const fetchChallengeList = function() {
        return fetch(
            `../data/challenges.json`,
            {method: "GET"}
        ).then((response) => response.text())
        .then((data) => {
            // console.log(JSON.parse(data));
            setChallenges(JSON.parse(data));
        })
        .catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        fetchChallengeList();
        setTimeout(() => {
            dispatch(alertActions.clear());
        }, config.ALERT_TIMEOUT);
    }, [])

    let challengeList;
    if (challenges === undefined) {
        challengeList = <h3 className="text-white">Loading challenge list..</h3>;
    } else {
        challengeList = challenges.items.map((item, index) => {
            return (
                <>
                    <a onClick={() => selectChallengeGo(item)} href="#" className="list-group-item list-group-item-action flex-column align-items-start" data-tip data-for={item.dataSetName}>
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{item.dataSetName}</h5>
                            <small>{item.era}</small>
                        </div>
                        <p className="mb-1">{item.shortDescription}</p>
                    </a>
                    <ReactTooltip key={index} className="description-tooltip" id={item.dataSetName} effect='solid' backgroundColor='#353535FF'>
                        <span>{item.description}</span>
                    </ReactTooltip>
                </>

                // <a key={index} onClick={() => selectChallengeGo(item)} href="#" className="list-group-item list-group-item-action flex-column align-items-start" data-toggle="tooltip" title={item.description}>
                //     <div className="d-flex w-100 justify-content-between">
                //         <h5 className="mb-1">{item.dataSetName}</h5>
                //         <small>{item.era}</small>
                //     </div>
                //     <p className="mb-1">{item.shortDescription}</p>
                // </a>
            );
        });
    }

    return (
        <>
            <TopNavbar />
            <div className="col-lg-8 offset-lg-3 verticalUpper widthWide">
                <h1 className="text-white">Welcome to Test-Ware, {user.username}!</h1>
                <br />
                <h4 className="text-white">Select your challenge to begin:</h4>
                <br />
                <div className="list-group">
                    { challengeList }
                </div>
            </div>
        </>
    );
}

export { HomePage };