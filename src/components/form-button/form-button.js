import React from 'react';

import './form-button.css';

//MUI components
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';

// local components
import defaultTheme from '../../themes/default';


export default class FormButton extends React.Component{

    render() {
        return(
            <div className="button-container">
                <ThemeProvider theme={defaultTheme}>
                    <Button
                        id={this.props.id}
                        variant={this.props.variant}
                        disabled={this.props.disabled}
                        onClick={this.props.onSubmit}
                    >{this.props.text}</Button>
                </ThemeProvider>
            </div>
        )
    }
}