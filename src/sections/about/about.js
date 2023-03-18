import React from 'react';


//Local services
import NaegelsApi from '../../services/naegels-api-service';

//Local components
import FormContainer from '../../components/form-container';

export default class About extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            gameInfo: ''
        }
    };

    NaegelsApi = new NaegelsApi();

    getGameInfo = () => {
        this.NaegelsApi.getInfo()
        .then((body) => {
            if(body.errors) {
                this.setState({ gameInfo:'Something went wrong! Cannot get game info!'})
            } else {
                this.setState({gameInfo: body.info})
            }
        });
    }
    
    componentDidMount = () => {
        this.getGameInfo()
    };

    render() {
        return(
            <FormContainer 
                isMobile = {this.props.isMobile}
                isDesktop = {this.props.isDesktop}
                isPortrait = {this.props.isPortrait}
                title="About Naegels"
                htmlMessage={this.state.gameInfo}
            >
            </FormContainer>
        )
    };

}