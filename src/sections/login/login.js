import React from 'react';
import NaegelsApi from '../../services/naegels-api-service';
import Cookies from 'universal-cookie';
import FormContainer from '../../components/form-container';

export default class Login extends React.Component{

    constructor(props) {
        super(props);
        this.SendLoginRequest = this.SendLoginRequest.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleErrorResponse = this.handleErrorResponse.bind(this);
        this.clearErrorMessage = this.clearErrorMessage.bind(this);
        this.CheckIfAlreadyLoggedIn = this.CheckIfAlreadyLoggedIn.bind(this);
        this.state = {
            title: 'Login',
            textFieldsList: [
                {id:"username", name:"username", type: "text", placeholder: "Username      ", onChange: this.handleUsernameChange, errorMessage: "", value: ""},
                {id:"password", name:"password", type: "password", placeholder: "Password      ", onChange: this.handlePasswordChange, errorMessage: "", value: ""}
            ],
            submitButtonList: [
                {type:"Submit", text:"Submit", onSubmit: this.SendLoginRequest},
                {type:"secondary", text:"Register new player", onSubmit: () => this.props.history.push('/register/')},
                {type:"secondary", text:"Forgot password", onSubmit: () => this.props.history.push('/forgot-password/')}
            ],
            email:'',
            password:'',
            repeatPassword:'',
            username:''
        }
    };
    
    NaegelsApi = new NaegelsApi();
    Cookies = new Cookies();
    CheckIfAlreadyLoggedIn = () => {
        const idToken = this.Cookies.get('idToken')
        if(idToken) {
            window.location.replace('/lobby/');
        }
    }

    SignOut = () => {
        this.Cookies.remove('idToken');
        this.Cookies.remove('username');
        window.location.replace('/signin');
    }

    SendLoginRequest = () => {
        this.NaegelsApi.login(
            this.state.username, 
            this.state.password
        )
        .then((body) => {
            if(body.errors) {
                this.handleErrorResponse(body)
            } else {
                var currentDate = new Date(); 
                var expiresIn = new Date(currentDate.getTime() + body.expiresIn * 1000)
                this.Cookies.set('idToken', body.token, { path: '/' , expires: expiresIn})
                this.Cookies.set('username', this.state.username, { path: '/' , expires: expiresIn})
                window.location.replace('/lobby/');
            }
        });
    };

    handleUsernameChange=(e) => {
        this.setState({username: e.target.value})
    };

    handlePasswordChange=(e) => {
        this.setState({password: e.target.value})
    };
    
    handleErrorResponse(body) {
        let textFieldsListUpdated = [...this.state.textFieldsList]
        textFieldsListUpdated.forEach(f => {
            f.errorMessage="";
        })
        body.errors.forEach(er => {
            var elementsIndex = this.state.textFieldsList.findIndex(element => element.name === er.field )
            textFieldsListUpdated[elementsIndex] = {...textFieldsListUpdated[elementsIndex], errorMessage: er.message}
        });
        this.setState({textFieldsList: textFieldsListUpdated});
    };

    clearErrorMessage=(e) => {
        let textFieldsListUpdated = [...this.state.textFieldsList]
        var elementsIndex = this.state.textFieldsList.findIndex(element => element.id === e.target.id )
        textFieldsListUpdated[elementsIndex] = {...textFieldsListUpdated[elementsIndex], errorMessage: ""}
        this.setState({textFieldsList: textFieldsListUpdated});
    };

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          this.SendLoginRequest();
        }
      };

    render() {
      
        if(this.props.location.pathname === '/signout') {
            this.SignOut();
        }
      
        this.CheckIfAlreadyLoggedIn();

        return (
            <FormContainer 
                title={this.state.title}
                onKeyPress={this.handleKeyPress}
                textFieldsList={this.state.textFieldsList}
                submitButtonList={this.state.submitButtonList}
                onSubmit={this.SendLoginRequest}
            >
            </FormContainer>
        )
    }

}