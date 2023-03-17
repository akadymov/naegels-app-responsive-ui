import React from 'react';

import './form-container.css';
import FormButton from '../form-button';
import TextField from '@mui/material/TextField';
import { ThemeProvider } from '@mui/material/styles';

// local components
import defaultTheme from '../../themes/default';


export default class FormContainer extends React.Component{

    render() {
        return(
            <div className="form-container" onKeyPress={this.props.onKeyPress}>
                <div className="form-title">{this.props.title}</div>
                {this.props.infoMessage ? 
                    <div className="form-message">{this.props.infoMessage}</div>
                :
                    ''
                }
                {this.props.textFieldsList.map(field => {
                    return (
                        <div className="form-element-container" key={`container-${field.id}`}>
                            <ThemeProvider theme={defaultTheme} key={`theme-provider-${field.id}`}>
                                <TextField
                                    id={field.id}
                                    key={field.id}
                                    label={field.label}
                                    variant={field.variant}
                                    onChange={field.onChange}
                                    onClick={field.onClick}
                                    error={field.errorMessage !== ''}
                                    helperText={field.errorMessage}
                                    type={field.type}x  
                                    sx={{width: field.width}}
                                ></TextField>
                            </ThemeProvider>
                        </div>
                    )
                })}
                {this.props.submitButtonList.map(button => {
                    return( 
                        <div className="form-element-container" key={`container-${button.id}`}>
                            <FormButton 
                                key={button.id}
                                variant={button.type}
                                text={button.text}
                                onSubmit={button.onSubmit}
                                width={button.width}
                                size={button.size}
                            ></FormButton>
                        </div>
                    )
                })}
            </div>
        )
    }
}