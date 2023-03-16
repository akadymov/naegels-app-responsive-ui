import React from 'react';

import './active-container.css'
import { Switch, Route } from 'react-router-dom';

// Local components
import MainLogo from '../main-logo';
import Login from '../../sections/login';
import Registration from '../../sections/registration';
import RegistrationSucceed from '../../sections/registration-succeed'
/*import ForgotPassword from '../../sections/forgot-password';
import RestorePassword from '../../sections/restore-password';
import Lobby from '../../sections/lobby';
import Room from '../../sections/room';
import Game from '../../sections/game';
import LeaderBoard from '../../sections/leaderboard';
import About from '../../sections/about';
import Feedback from '../../sections/feedback';*/

export default class ActiveContainer extends React.Component{

    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className={`active-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                <MainLogo
                    isMobile = {this.props.isMobile}
                    isDesktop = {this.props.isDesktop}
                    isTablet = {this.props.isTablet}
                    isPortrait = {this.props.isPortrait}
                ></MainLogo>
                <Switch>
                    <Route path="/registration-succeed/:username" component={RegistrationSucceed}></Route>
                    <Route path="/register" component={Registration}></Route>
                    <Route path="/signin/:reason" component={Login}></Route>
                    <Route path="/" component={Login}></Route>
                    {/*<Route path="/signout" component={Login}></Route>
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
        )
    }
}
