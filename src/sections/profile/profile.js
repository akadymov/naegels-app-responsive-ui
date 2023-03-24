import React from 'react';

import './profile.css'

//Local services
import NaegelsApi from '../../services/naegels-api-service';
import Cookies from 'universal-cookie';

//Local components
import FormButton from '../../components/form-button';
import defaultTheme from '../../themes/default';
import NaegelsAvatar from '../../components/naegels-avatar'

//MUI components
import TextField from '@mui/material/TextField';
import { ThemeProvider } from '@mui/material/styles';


export default class Profile extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            picControlsVisible: false,
            userData: {
                aboutMe: null,
                email: null,
                lastSeen: null,
                preferredLang: null,
                registered: null,
                username: null
            },
            canUpdate: false,
            password: null,
            passwordHelperText: 'new password',
            passwordError: false,
            passwordRepeat: null,
            passwordRepeatHelperText: 'repeat new password',
            passwordRepeatError: false,
            canUpdatePassword: false
        }
    }

    NaegelsApi = new NaegelsApi();
    Cookies = new Cookies();

    getUserProfile = () => {
        this.NaegelsApi.getUser(this.props.match.params.username || this.Cookies.get('username'))
        .then((body)=>{
            if(body.errors) {
                console.log(body) 
            } else {
                this.setState({ userData: body, canUpdate: false })
            }
        })
    }

    updateProfile = () => {
        this.NaegelsApi.updateUser(this.props.match.params.username || this.Cookies.get('username'), this.Cookies.get('idToken'), this.state.userData.email, this.state.userData.aboutMe)
        .then((body)=>{
            if(body.errors) {
                console.log(body) // FIXME: change edit user errors format on BE and bring error text to corresponding form fields
            } else {
                this.setState({ userData: body, canUpdate: false })
            }
        })
    }

    updatePassword = () => {
        if(this.state.password !== this.state.passwordRepeat){
            this.setState({
                passwordRepeatHelperText: 'password confirmation does not match',
                passwordRepeatError: true
            })
        }
        console.log('Password update is triggered but not executed. The corresponding method is not ready yet')
    }

    activatePicControls = () => {
        if(this.props.isDesktop){
            this.setState({ picControlsVisible: true })
        }
    }

    deActivatePicControls = () => {
        if(this.props.isDesktop){
            this.setState({ picControlsVisible: false })
        }
    }

    handleEmailChange = (e) => {
        var newUserData = this.state.userData
        newUserData.email = e.target.value
        this.setState({ userData: newUserData, canUpdate: true })
    }

    handleAboutMeChange = (e) => {
        var newUserData = this.state.userData
        newUserData.aboutMe = e.target.aboutMe
        this.setState({ userData: newUserData, canUpdate: true })
    }

    handleNewPasswordChange = (e) => {
        this.setState({ password: e.target.value, canUpdatePassword: true })
    }

    handleRepeatNewPasswordChange = (e) => {
        this.setState({ passwordRepeat: e.target.value, canUpdatePassword: true })
    }

    uploadFile = async (e) => { // TODO upload avatar method is not working (problem may exist in FE, BE or both)
        console.log(e.target.files)
        /*this.NaegelsApi.uploadProfilePic(this.Cookies.get('idToken'), this.props.match.params.username || this.Cookies.get('username'), e.target.files[0])
        .then((body) => {
            if(body.errors) {
                console.log(body)
            } else {
                console.log('Success')
            }
        })*/
    }

    componentDidMount = () => {
        this.getUserProfile()
    }

    render () {
        return(
            <div className={`profile-form-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                <div className={`profile-picture-controls-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                    <div 
                        className={`profile-picture-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}
                        onMouseEnter={this.activatePicControls}
                        onMouseLeave={this.deActivatePicControls}
                    >
                        <NaegelsAvatar
                            username={this.props.match.params.username || this.Cookies.get('username')}
                            width={200}
                            height={200}
                        ></NaegelsAvatar>
                        <div 
                            className={`profile-picture-update-controls ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}
                            style={{ display: this.state.picControlsVisible ? 'block' : 'none' }}
                        >
                            <div className="avatar-upload-button-container">
                                <FormButton
                                    id='avatar_update_button'
                                    key='avatar_update_button'
                                    onSubmit={this.uploadFile} // FIXME
                                    variant='outlined'
                                    text='Upload new'
                                    color='shadowed'
                                ></FormButton>
                            </div>
                        </div>
                        <div className={`profile-username-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            {this.props.match.params.username || this.Cookies.get('username')}
                        </div>
                </div>
                </div>
                <div className={`profile-text-data-controls-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                    <ThemeProvider theme={defaultTheme}>
                        <div className={`profile-text-field-control-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            <TextField
                                id='email'
                                disabled={this.state.userData.username !== this.Cookies.get('username')}
                                helperText='email'
                                value={this.state.userData.email}
                                sx={{width: '26vw'}}
                                onChange={this.handleEmailChange}
                            ></TextField>
                        </div>
                        <div className={`profile-text-field-control-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            <TextField
                                id='registered'
                                disabled
                                variant='filled'
                                helperText='registered'
                                value={this.state.userData.registered}
                                sx={{width: '26vw'}}
                            ></TextField>
                        </div>
                        <div className={`profile-text-field-control-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            <TextField
                                id='about'
                                disabled={this.state.userData.username !== this.Cookies.get('username')}
                                helperText='about'
                                value={this.state.userData.aboutMe}
                                sx={{width: '35vw'}}
                                onChange={this.handleAboutMeChange}
                                multiline
                                rows={3}
                            ></TextField>
                        </div>
                        <div className={`profile-text-field-control-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            <FormButton
                                id='profile_update_button'
                                key='profile_update_button'
                                disabled={!this.state.canUpdate}
                                onSubmit={this.updateProfile}
                                variant='contained'
                                text='Update profile'
                            ></FormButton>
                        </div>
                        {this.state.userData.username === this.Cookies.get('username')?
                            <div className={`profile-text-field-control-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                                <TextField
                                    id='password'
                                    helperText={this.state.passwordHelperText}
                                    type='password'
                                    sx={{width: '26vw'}}
                                    onChange={this.handleNewPasswordChange}
                                    error={this.state.passwordError}
                                ></TextField>
                            </div>
                        :
                            ''
                        }
                        {this.state.userData.username === this.Cookies.get('username')?
                            <div className={`profile-text-field-control-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                                <TextField
                                    id='confirm_password'
                                    helperText={this.state.passwordRepeatHelperText}
                                    type='password'
                                    sx={{width: '26vw'}}
                                    onChange={this.handleRepeatNewPasswordChange}
                                    error={this.state.passwordRepeatError}
                                ></TextField>
                            </div>
                        :
                            ''
                        }
                        {this.state.userData.username === this.Cookies.get('username')?
                            <div className={`profile-text-field-control-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                                <FormButton
                                    id='password_update_button'
                                    key='password_update_button'
                                    disabled={!this.state.canUpdatePassword}
                                    onSubmit={this.updatePassword}
                                    variant='contained'
                                    text='Update password'
                                ></FormButton>
                            </div>
                        :
                            ''
                        }
                    </ThemeProvider>
                </div>
                <div className={`profile-stats-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                    User stats
                </div>
                
            </div>
        )
    }
}