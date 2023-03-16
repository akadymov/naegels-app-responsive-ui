import React from 'react';
import NaegelsApi from '../../services/naegels-api-service';
import Cookies from 'universal-cookie';
import FormContainer from '../../components/form-container';

export default class Registration extends React.Component{

    constructor(props) {
        super(props);
        this.SendRegRequest = this.SendRegRequest.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
        this.handleErrorResponse = this.handleErrorResponse.bind(this);
        this.clearErrorMessage = this.clearErrorMessage.bind(this);
        this.state = {
            title: 'Register new player',
            email:'',
            password:'',
            repeatPassword:'',
            username:'',
            preferredLang: '',
            textFieldsList: [
                {id:"username", name:"username", type: "text", placeholder: "Username      ", onChange: this.handleUsernameChange, errorMessage: "", value: "", onClick: this.clearErrorMessage},
                {id:"email", name:"email", type: "text", placeholder: "Email      ", onChange: this.handleEmailChange, errorMessage: "", value: "", onClick: this.clearErrorMessage},
                {id:"password", name:"password", type: "password", placeholder: "Password      ", onChange: this.handlePasswordChange, errorMessage: "", value: "", onClick: this.clearErrorMessage},
                {id:"repeatPassword", name:"repeatPassword", type: "password", placeholder: "Repeat password   ", onChange: this.handleRepeatPasswordChange, errorMessage: "", value: "", onClick: this.clearErrorMessage}
            ],
            submitButtonList: [
                {type:"Submit", text:"Submit", onSubmit: this.SendRegRequest},
                {type:"secondary", text:"Login", onSubmit: () => this.props.history.push('/signin')}
            ],
            languages: [
                {type:"radio", id:"preferred-lang-en", name:"preferred-lang", lang:"en", errorMessage:""},
                {type:"radio", id:"preferred-lang-ru", name:"preferred-lang", lang:"ru", errorMessage:""}
            ]
      };
    }

    NaegelsApi = new NaegelsApi();
    Cookies = new Cookies();
    CheckIfAlreadyLoggedIn = () => {
        const idToken = this.Cookies.get('idToken')
        if(idToken) {
            window.location.replace('/lobby/');
        }
    }

    SendRegRequest = () => {
        this.NaegelsApi.registerUser(
            this.state.email, 
            this.state.username, 
            this.state.password, 
            this.state.repeatPassword,
            this.state.preferredLang
        )
        .then((body) => {
            if(body.errors) {
                this.handleErrorResponse(body)
            } else {
                window.location.replace('/registration-succeed/' + this.state.username);
            }
        });
    };

    handleUsernameChange(e) {
        this.setState({username: e.target.value})
    };

    handlePasswordChange(e) {
        this.setState({password: e.target.value})
    };

    handleRepeatPasswordChange(e) {
        this.setState({repeatPassword: e.target.value})
    };

    handleEmailChange(e) {
        this.setState({email: e.target.value})
    };

    handleLangChange=(e) => {
        this.setState({preferredLang: e.target.value})
    };

    clearErrorMessage=(e) => {
        let textFieldsListUpdated = [...this.state.textFieldsList]
        var elementsIndex = this.state.textFieldsList.findIndex(element => element.id === e.target.id )
        textFieldsListUpdated[elementsIndex] = {...textFieldsListUpdated[elementsIndex], errorMessage: ""}
        this.setState({textFieldsList: textFieldsListUpdated});
    }

    handleErrorResponse=(body) => {
        let textFieldsListUpdated = [...this.state.textFieldsList]
        textFieldsListUpdated.forEach(f => {
            f.errorMessage="";
        })
        body.errors.forEach(er => {
            var elementsIndex = this.state.textFieldsList.findIndex(element => element.name === er.field )
            textFieldsListUpdated[elementsIndex] = {...textFieldsListUpdated[elementsIndex], errorMessage: er.message}
        });
        this.setState({textFieldsList: textFieldsListUpdated});
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          this.SendRegRequest();
        }
      };

    render() {
      
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