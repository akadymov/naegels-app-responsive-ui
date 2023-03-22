import React from 'react';

import './naegels-modal.css';

//MUI components
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import FormButton from '../../components/form-button';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider } from '@mui/material/styles';

// local components
import defaultTheme from '../../themes/default';


export default class NaegelsModal extends React.Component{

    render() {
        return(
            <Modal
                open={this.props.open}
            >
                <div className={`modal-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                    <div className='modal-content-container'>
                        <div className="modal-header">{this.props.header}</div>
                        <div className="modal-text-container">
                            <p>{this.props.text}</p>
                        </div>
                        <div className="modal-controls-container">
                            {this.props.controls.map(control => {
                                switch(control.type){
                                    case 'input':
                                        return (
                                            <div className="modal-control-container" key={control.id}>
                                                <ThemeProvider theme={defaultTheme}>
                                                    <TextField
                                                        id={control.id}
                                                        key={control.id}
                                                        label={control.label}
                                                        type={control.textFormat}
                                                        variant={control.variant}
                                                        onChange={control.onChange}
                                                        width={control.width}
                                                        defaultValue={control.text}
                                                        error={control.errorMessage}
                                                        helperText={control.errorMessage}
                                                    ></TextField>
                                                </ThemeProvider>
                                            </div>
                                        )
                                    case 'button':
                                        return(
                                            <div className="modal-control-container" key={control.id}>
                                            <FormButton
                                                id={control.id}
                                                key={control.id}
                                                onSubmit={control.onSubmit}
                                                variant={control.variant}
                                                disabled={control.disabled}
                                                text={control.text}
                                                width={control.width}
                                                color={control.color}
                                            ></FormButton>
                                            </div>
                                        )
                                    default:
                                        return('')
                                }
                            })}
                        </div>
                        {this.props.modalCanClose ?
                            <div class="modal-close-icon-container">
                                <ThemeProvider theme={defaultTheme}>
                                    <CloseIcon
                                        onClick={this.props.closeModal}
                                    ></CloseIcon>
                                </ThemeProvider>
                            </div>
                        : 
                            ''
                        }
                    </div>
                </div>
            </Modal>
        )
    }
}