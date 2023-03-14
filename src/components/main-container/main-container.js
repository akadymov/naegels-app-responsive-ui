import React from 'react';

import './main-container.css'
/*import Menu from '../nav-menu'*/
import { Switch, Route } from 'react-router-dom';
import Login from '../../sections/login';
/*import Registration from '../../sections/registration';
import ForgotPassword from '../../sections/forgot-password';
import RestorePassword from '../../sections/restore-password';
import Lobby from '../../sections/lobby';
import Room from '../../sections/room';
import Game from '../../sections/game';
import LeaderBoard from '../../sections/leaderboard';
import About from '../../sections/about';
import Feedback from '../../sections/feedback';*/


const MainContainer = () => {
    return (
        <div>
            <div className="main-container content">
                {/*<Menu></Menu> --!>*/}
                <Switch>
                    <Route path="/signin/:reason" component={Login}></Route>
                    <Route path="/" component={Login}></Route>
                    {/*<Route path="/signout" component={Login}></Route>
                    <Route path="/register" component={Registration}></Route>
                    <Route path="/forgot-password" component={ForgotPassword}></Route>
                    <Route path="/restore-password" component={RestorePassword}></Route>
                    <Route exact path="/lobby" component={Lobby}></Route>
                    <Route path="/lobby/room/:roomId" component={Room}></Route>
                    <Route path="/game/:gameId" component={Game}></Route>
                    <Route path="/leaderboard" component={LeaderBoard}></Route>
                    <Route path="/about" component={About}></Route>
                    <Route path="/feedback" component={Feedback}></Route>*/}
                </Switch>
            </div>
            <div className="main-container background-color"></div>
            <div className="main-container background-image"></div>
        </div>
    )
}

export default MainContainer;
