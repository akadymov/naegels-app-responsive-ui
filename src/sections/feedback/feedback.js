import React from 'react';

import './feedback.css'

//MUI components

//Local components
import FormContainer from '../../components/form-container';

//Local services
import NaegelsApi from '../../services/naegels-api-service';
import Cookies from 'universal-cookie';


export default class Feedback extends React.Component{

    constructor(props){
        super(props);
        this.handleSenderNameChange = this.handleSenderNameChange.bind(this);
        this.handleSenderEmailChange = this.handleSenderEmailChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.state = {
            title: 'Feedback',
            senderName: null,
            senderEmail: null,
            message: null,
            feedbackSent: false,
            errors: {},
            textFieldsList: [
                {
                    id:"sender_name", 
                    label:"name", 
                    variant:"outlined", 
                    type: "text", 
                    autoComplete: 'on',
                    width: "70vw",
                    onChange: this.handleSenderNameChange, 
                    errorMessage: "", 
                    onClick: this.clearErrorMessage
                },
                {
                    id:"sender_email", 
                    label:"email", 
                    variant:"outlined", 
                    type: "text", 
                    autoComplete: 'on',
                    width: "70vw",
                    onChange: this.handleSenderEmailChange, 
                    errorMessage: "", 
                    onClick: this.clearErrorMessage
                },
                {
                    id:"message", 
                    label:'message (0/500)', 
                    variant:"outlined", 
                    type: "text", 
                    autoComplete: 'on',
                    width: "70vw",
                    rows: 5,
                    onChange: this.handleMessageChange, 
                    errorMessage: "", 
                    onClick: this.clearErrorMessage
                }
            ],
            submitButtonList: [
                {
                    id:"submit_button", 
                    type:"contained", 
                    text:"Submit", 
                    width: "220px",
                    disabled: true,
                    onSubmit: this.sendFeedback
                },
                {
                    id:"more_feedback", 
                    type:"contained", 
                    text:"Another message", 
                    width: "220px",
                    disabled: false,
                    hidden: true,
                    onSubmit: () => window.location.reload()
                }
            ]
        }
    }

    NaegelsApi = new NaegelsApi();
    Cookies = new Cookies();



    CheckIfAlreadyLoggedIn = () => {
        const username = this.Cookies.get('username')
        if(username) {
            this.NaegelsApi.getUser(username)
            .then((body)=>{
                if(!body.errors){
                    this.setState({
                        senderName: username,
                        senderEmail: body.email
                    })
                }
            })
        }
    }

    sendFeedback = () => {
        this.NaegelsApi.sendFeedback(this.state.senderName, this.state.senderEmail, this.state.message)
        .then((body)=>{
            if(body.errors){
                var newTextFieldsList = this.state.textFieldsList
                var newSubmitButtonList = this.state.submitButtonList
                body.errors.forEach(error=>{
                    switch(error.field) {
                        case 'message':
                            newTextFieldsList[2].errorMessage=error.message
                        break
                        default:
                            console.log('Unhandled error field in feedback method response!')
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
                newSubmitButtonList[0].hidden = true
                newSubmitButtonList[1].hidden = false
                var newTextFieldsList = this.state.textFieldsList
                newTextFieldsList[0].hidden=true
                newTextFieldsList[1].hidden=true
                newTextFieldsList[2].hidden=true
                this.setState({
                    submitButtonList: newSubmitButtonList,
                    senderName: null,
                    senderEmail: null,
                    message: null,
                    feedbackSent: true
                })
            }
        })
    }

    handleSenderNameChange = (e) => {
        var newTextFieldsList = this.state.textFieldsList
        newTextFieldsList[0].errorMessage=''
        this.setState({ 
            senderName: e.target.value,
            textFieldsList: newTextFieldsList,
            feedbackSent: false
        })
    }

    handleSenderEmailChange = (e) => {
        var newTextFieldsList = this.state.textFieldsList
        newTextFieldsList[1].errorMessage=''
        this.setState({ 
            senderEmail: e.target.value,
            textFieldsList: newTextFieldsList,
            feedbackSent: false
        })
    }

    handleMessageChange = (e) => {
        var newTextFieldsList = this.state.textFieldsList
        var newSubmitButtonList = this.state.submitButtonList
        newTextFieldsList[0].errorMessage=''
        newTextFieldsList[1].errorMessage=''
        newTextFieldsList[2].errorMessage=e.target.value.length > 500 ? 'too long message (' + e.target.value.length + '/500)' : ''
        newTextFieldsList[2].label='message (' + e.target.value.length + '/500)'
        newSubmitButtonList[0].disabled = false
        this.setState({ 
            message: e.target.value,
            textFieldsList: newTextFieldsList,
            feedbackSent: false
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
                <div className="feedback-sent-confirmation-message" style={{ display: this.state.feedbackSent ? 'block' : 'none' }}>Thank you for the feedback! Naegels Application admins will contact you soon.</div>
            </div>
        )
    }
}