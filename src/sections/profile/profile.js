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
            aboutMeSymbols: 0,
            canUpdate: false,
            currentPassword: null,
            newPassword: null,
            repeatPassword: null,
            canUpdatePassword: false,
            passwordUpdated: false,
            errors:{}
        }
    }

    NaegelsApi = new NaegelsApi();
    Cookies = new Cookies();

    getUserProfile = () => {
        this.NaegelsApi.getUser(this.props.match.params.username || this.Cookies.get('username'))
        .then((body)=>{
            if(body.errors) {
                var newErrors = {}
                var fieldName = ''
                var helperMessage = ''
                body.errors.forEach(error => {
                    fieldName = error.field
                    helperMessage = error.message
                    newErrors[fieldName] = helperMessage
                })
                this.setState({ errors: newErrors })
            } else {
                this.setState({ 
                    userData: body, 
                    canUpdate: false, 
                    canUpdatePassword: false, 
                    aboutMeSymbols: body.aboutMe ? body.aboutMe.length : 0
                })
            }
        })
    }

    updateProfile = () => {
        this.NaegelsApi.updateUser(this.props.match.params.username || this.Cookies.get('username'), this.Cookies.get('idToken'), this.state.userData.email, this.state.userData.aboutMe || '')
        .then((body)=>{
            if(body.errors) {
                var newErrors = this.state.errors
                var fieldName = ''
                var helperMessage = ''
                body.errors.forEach(error => {
                    fieldName = error.field
                    helperMessage = error.message
                    newErrors[fieldName] = helperMessage
                })
                this.setState({ 
                    errors: newErrors, 
                    canUpdate: false,
                    passwordUpdated: false 
                })
            } else {
                this.setState({ 
                    userData: body, 
                    canUpdate: false, 
                    passwordUpdated: false,
                    errors: {}
                })
            }
        })
    }

    updatePassword = () => {
        if(this.state.newPassword !== this.state.repeatPassword){
            var newErrors = {
                repeatPassword: 'password confirmation does not match'
            }
            this.setState({ errors: newErrors })
        } else {
            this.NaegelsApi.updatePassword(this.Cookies.get('idToken'), this.state.currentPassword, this.state.newPassword, this.state.repeatPassword)
            .then((body)=>{
                if(body.errors) {
                    var newErrors = this.state.errors
                    var fieldName = ''
                    var helperMessage = ''
                    body.errors.forEach(error => {
                        fieldName = error.field
                        helperMessage = error.message
                        newErrors[fieldName] = helperMessage
                    })
                    this.setState({ 
                        errors: newErrors, 
                        canUpdate: false, 
                        passwordUpdated: false 
                    })
                } else {
                    this.setState({ 
                        currentPassword: null, 
                        newPassword: null, 
                        repeatPassword: null, 
                        passwordUpdated: true,
                        canUpdatePassword: false,
                        errors: {}
                    })
                }
            })
        }
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
        var newErrors = this.state.errors
        newErrors.email = null
        this.setState({ 
            userData: newUserData, 
            canUpdate: true,
            passwordUpdated: false,
            errors: newErrors
        })
    }

    handleAboutMeChange = (e) => {
        var newUserData = this.state.userData
        newUserData.aboutMe = e.target.value
        var newErrors = this.state.errors
        newErrors.aboutMe = e.target.value.length > 500 ? 'about me (' + this.state.aboutMeSymbols + '/500)' : null
        this.setState({ 
            userData: newUserData, 
            canUpdate: newErrors.aboutMe == null, 
            aboutMeSymbols: e.target.value.length,
            passwordUpdated: false ,
            errors: newErrors
        })
    }

    handlecurrentPasswordChange = (e) => {
        var newErrors = this.state.errors
        newErrors.currentPassword = null
        this.setState({ 
            currentPassword: e.target.value, 
            canUpdatePassword: true ,
            passwordUpdated: false,
            errors: newErrors
        })
    }

    handleNewPasswordChange = (e) => {
        var newErrors = this.state.errors
        newErrors.newPassword = null
        this.setState({ 
            newPassword: e.target.value, 
            canUpdatePassword: true ,
            passwordUpdated: false,
            errors: newErrors
        })
    }

    handleRepeatNewPasswordChange = (e) => {
        var newErrors = this.state.errors
        newErrors.repeatPassword = null
        this.setState({ 
            repeatPassword: e.target.value, 
            canUpdatePassword: true ,
            passwordUpdated: false,
            errors: newErrors
        })
    }

    uploadFile = async () => { // TODO upload avatar method is not working (problem may exist in FE, BE or both)
        alert('Work in progress: upload tool is in development')
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
                        onClick={this.uploadFile} // FIXME
                    >
                        <NaegelsAvatar
                            username={this.props.match.params.username || this.Cookies.get('username')}
                            width={this.props.isMobile ? 120 : 200}
                            height={this.props.isMobile ? 120 : 200}
                        ></NaegelsAvatar>
                        <div 
                            className={`profile-picture-update-controls ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}
                            style={{ display: this.state.picControlsVisible ? 'block' : 'none' }}
                        >
                            <div className="avatar-upload-button-container">
                                <FormButton
                                    id='avatar_update_button'
                                    key='avatar_update_button'
                                    onClick={this.uploadFile} // FIXME
                                    variant='outlined'
                                    text='Upload new'
                                    size={this.props.isMobile ? 'small' : 'medium'}
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
                                size='small'
                                helperText={this.state.errors.email || 'email'}
                                error={this.state.errors.email}
                                value={this.state.userData.email}
                                sx={{width: this.props.isMobile ? (this.props.isPortrait ? '90vw' : '55vw') : '30vw'}}
                                onChange={this.handleEmailChange}
                            ></TextField>
                        </div>
                        {!this.props.isMobile ? 
                            <div className={`profile-text-field-control-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                                <TextField
                                    id='registered'
                                    disabled
                                    variant='filled'
                                    size='small'
                                    helperText='registered'
                                    value={this.state.userData.registered}
                                    sx={{width: this.props.isMobile ? (this.props.isPortrait ? '90vw' : '55vw') : '30vw'}}
                                ></TextField>
                            </div>
                        :
                            ''
                        }
                        <div className={`profile-text-field-control-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            <TextField
                                id='about'
                                disabled={this.state.userData.username !== this.Cookies.get('username')}
                                helperText={this.state.errors.aboutMe || 'about me (' + this.state.aboutMeSymbols + '/500)'}
                                error={this.state.errors.aboutMe}
                                value={this.state.userData.aboutMe}
                                sx={{width: this.props.isMobile ? (this.props.isPortrait ? '90vw' : '55vw') : '49vw'}}
                                onChange={this.handleAboutMeChange}
                                multiline
                                rows={2}
                            ></TextField>
                        </div>
                        {this.state.userData.username === this.Cookies.get('username')?
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
                        :
                            ''
                        }
                        {this.state.userData.username === this.Cookies.get('username')?
                            <div className={`profile-text-field-control-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                                <TextField
                                    id='current_password'
                                    helperText={this.state.errors.currentPassword || 'current password'}
                                    error={this.state.errors.currentPassword}
                                    value={this.state.currentPassword}
                                    type='password'
                                    size='small'
                                    sx={{width: this.props.isMobile ? (this.props.isPortrait ? '90vw' : '55vw') : '24vw'}}
                                    onChange={this.handlecurrentPasswordChange}
                                ></TextField>
                            </div>
                        :
                            ''
                        }
                        {this.state.userData.username === this.Cookies.get('username')?
                            <div className={`profile-text-field-control-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                                <TextField
                                    id='new_password'
                                    helperText={this.state.errors.newPassword || 'new password'}
                                    error={this.state.errors.newPassword}
                                    value={this.state.newPassword}
                                    type='password'
                                    size='small'
                                    sx={{width: this.props.isMobile ? (this.props.isPortrait ? '90vw' : '55vw') : '24vw'}}
                                    onChange={this.handleNewPasswordChange}
                                ></TextField>
                            </div>
                        :
                            ''
                        }
                        {this.state.userData.username === this.Cookies.get('username')?
                            <div className={`profile-text-field-control-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                                <TextField
                                    id='confirm_password'
                                    helperText={this.state.errors.repeatPassword || 'repeat password'}
                                    error={this.state.errors.repeatPassword}
                                    value={this.state.repeatPassword}
                                    type='password'
                                    size='small'
                                    sx={{width: this.props.isMobile ? (this.props.isPortrait ? '90vw' : '55vw') : '24vw'}}
                                    onChange={this.handleRepeatNewPasswordChange}
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
                                <div className="password-update-confirmation-message" style={{ display: this.state.passwordUpdated ? 'block' : 'none' }}>Password is saved</div>
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