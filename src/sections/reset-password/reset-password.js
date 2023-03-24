import React from 'react';

import './reset-password.css'

//MUI components

//Local components
import FormContainer from '../../components/form-container';

//Local services
import NaegelsApi from '../../services/naegels-api-service';
import Cookies from 'universal-cookie';


export default class ResetPassword extends React.Component{

    constructor(props){
        super(props);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
        this.state = {
            title: 'Reset password',
            newPassword: null,
            repeatPassword: null,
            passwordUpdated: false,
            errors: {},
            textFieldsList: [
                {
                    id:"new_password", 
                    label:"new password", 
                    variant:"outlined", 
                    type: "password", 
                    autoComplete: 'on',
                    width: "220px",
                    onChange: this.handleNewPasswordChange, 
                    errorMessage: "", 
                    onClick: this.clearErrorMessage
                },
                {
                    id:"repeat_password", 
                    label:"repeat password", 
                    variant:"outlined", 
                    type: "password", 
                    autoComplete: 'on',
                    width: "220px",
                    onChange: this.handleRepeatPasswordChange, 
                    errorMessage: "", 
                    onClick: this.clearErrorMessage
                }
            ],
            submitButtonList: [
                {
                    id:"reset_password_button", 
                    type:"contained", 
                    text:"Submit", 
                    width: "220px",
                    disabled: true,
                    onSubmit: this.resetPassword
                },
                {
                    id:"login_button", 
                    type:"contained", 
                    text:"Login", 
                    width: "220px",
                    disabled: false,
                    hidden: true,
                    onSubmit: ()=>window.location.assign('/')
                }
            ]
        }
    }

    NaegelsApi = new NaegelsApi();
    Cookies = new Cookies();



    CheckIfAlreadyLoggedIn = () => {
        const idToken = this.Cookies.get('idToken')
        if(idToken) {
            window.location.assign('/lobby/');
        }
    }

    resetPassword = () => {
        this.NaegelsApi.resetPassword(this.props.match.params.resetPasswordToken, this.state.newPassword, this.state.repeatPassword)
        .then((body)=>{
            if(body.errors){
                var newTextFieldsList = this.state.textFieldsList
                var newSubmitButtonList = this.state.submitButtonList
                body.errors.forEach(error=>{
                    switch(error.field) {
                        case 'newPassword':
                            newTextFieldsList[0].errorMessage=error.message
                        break
                        case 'repeatPassword':
                            newTextFieldsList[1].errorMessage=error.message
                        break
                        default:
                            console.log('Unhandled error field in reset password method!')
                    }
                    newSubmitButtonList[0].disabled = true
                    
                })
                this.setState({
                    textFieldsList: newTextFieldsList,
                    submitButtonList: newSubmitButtonList
                })
            } else {
                var newSubmitButtonList = this.state.submitButtonList
                newSubmitButtonList[0].disabled = true
                newSubmitButtonList[1].hidden = false
                this.setState({
                    submitButtonList: newSubmitButtonList,
                    newPassword: null,
                    repeatPassword: null,
                    passwordUpdated: true
                })
            }
        })
    }

    handleNewPasswordChange = (e) => {
        var newTextFieldsList = this.state.textFieldsList
        var newSubmitButtonList = this.state.submitButtonList
        newTextFieldsList[0].errorMessage=''
        newTextFieldsList[1].errorMessage=''
        newSubmitButtonList[0].disabled = false
        this.setState({ 
            newPassword: e.target.value,
            textFieldsList: newTextFieldsList,
            passwordUpdated: false
        })
    }

    handleRepeatPasswordChange = (e) => {
        var newTextFieldsList = this.state.textFieldsList
        var newSubmitButtonList = this.state.submitButtonList
        newTextFieldsList[0].errorMessage=''
        newTextFieldsList[1].errorMessage=''
        newSubmitButtonList[0].disabled = false
        this.setState({ 
            repeatPassword: e.target.value,
            textFieldsList: newTextFieldsList,
            passwordUpdated: false
        })
    }

    clearErrorMessage = () => {
        var newTextFieldsList = this.state.textFieldsList
        newTextFieldsList[0].errorMessage=''
        newTextFieldsList[1].errorMessage=''
        this.setState({
            textFieldsList: newTextFieldsList
        })
    }

    componentDidMount = () => {
        this.CheckIfAlreadyLoggedIn()
    }

    render() {
        return(
            <div style={{height: '50vh'}}>
                <FormContainer 
                    isMobile = {this.props.isMobile}
                    isDesktop = {this.props.isDesktop}
                    isPortrait = {this.props.isPortrait}
                    title={this.state.title}
                    onKeyPress={this.handleKeyPress}
                    textFieldsList={this.state.textFieldsList}
                    submitButtonList={this.state.submitButtonList}
                    onSubmit={this.SendLoginRequest}
                >
                </FormContainer>
                <div className="password-updated-confirmation-message" style={{ display: this.state.recoverySent ? 'block' : 'none' }}>Password is updated</div>
            </div>
        )
    }
}