import React from 'react';
import FormButton from '../form-button';

import './section-header.css';

export default class SectionHeader extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {

        return(
            <div className={`section-header-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                <div className={`controls-container  ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                    {this.props.controls.map(control => {
                        return(
                            <FormButton
                                key={control.id}
                                id={control.id}
                                variant={control.variant}
                                text={control.text}
                                disabled={control.disabled}
                                onSubmit={control.onSubmit}
                            ></FormButton>
                        )
                    })}
                </div>
            </div>
        )
    }
}