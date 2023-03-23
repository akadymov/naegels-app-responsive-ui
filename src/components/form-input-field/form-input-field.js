import React from 'react';

import './form-input-field.css'

const FormInputField = ({type, id, name, placeholder, value, onChange, errorMessage, checked, onClick}) => {

    const status = errorMessage==='' ? 'active' : 'error'

    var errorDiv = ''
    if (status==='error' & errorMessage.length > 0) {
        errorDiv = <div className="error-div">{errorMessage}</div>;
    }

    return (
        <div>
            <input 
                className={`form-input-field${ status==='error'? ' error' : ''}`}
                type={type} 
                id={id} 
                name={name} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange}
                checked={checked}
                onClick={onClick}
                autoComplete={autoComplete}
            ></input>
            {errorDiv}
        </div>
    )
}

export default FormInputField;