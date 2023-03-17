import React from 'react';

import './form-container.css';
import FormInputField from '../form-input-field';
import FormButton from '../native-form-button';


export default class FormContainer extends React.Component{

    render() {
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
                        onClick={field.onClick}
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