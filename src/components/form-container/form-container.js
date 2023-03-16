import React from 'react';

import './form-container.css';
import FormInputField from '../form-input-field';
import FormButton from '../form-button';

/*
                title="Login"
                onKeyPress={this.handleKeyPress}
                textFieldsList={this.state.textFieldsList}
                onSubmit={this.SendLoginRequest}
                submitText="Login"
                textFieldsList: [
                    {id:"username", name:"username", type: "text", placeholder: "Username      ", onChange: this.handleUsernameChange, errorMessage: "", value: ""},
                    {id:"password", name:"password", type: "password", placeholder: "Password      ", onChange: this.handlePasswordChange, errorMessage: "", value: ""}
                ]
*/


export default class FormContainer extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props)
        return(
            <div class="form-container" onKeyPress={this.props.onKeyPress}>
                <div class="form-title">{this.props.title}</div>
                {this.props.infoMessage ? 
                    <div className="form-message">{this.props.infoMessage}</div>
                :
                    ''
                }
                {this.props.textFieldsList.map(field => {
                    return <FormInputField
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        onChange={field.onChange}
                        errorMessage={field.errorMessage}
                        onClick={this.clearErrorMessage}
                    ></FormInputField>
                })}
                {this.props.submitButtonList.map(button => {
                    return <FormButton
                        type={button.type}
                        value={button.text}
                        onClick={button.onSubmit}
                    ></FormButton>
                })}
            </div>
        )
    }
}