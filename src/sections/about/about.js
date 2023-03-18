import React from 'react';


//Local services
import NaegelsApi from '../../services/naegels-api-service';
import Cookies from 'universal-cookie';

//Local components
import FormContainer from '../../components/form-container';

export default class About extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            gameInfo: '',
            submitButtonList: [
                {
                    id: 'lobby_or_login',
                    type: 'contained',
                    text: "Register and start playing"
                }
            ]
        }
    };

    NaegelsApi = new NaegelsApi();
    Cookies = new Cookies();

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
        var newSubmitButtonList = this.state.submitButtonList
        if(this.Cookies.get('idToken')) {
            newSubmitButtonList[0].text = "Go to games lobby"
            newSubmitButtonList[0].onSubmit = () => window.location.replace('/lobby/')
        } else {
            newSubmitButtonList[0].onSubmit = () => window.location.replace('/register/')
        }
    };

    render() {
        return(
            <FormContainer 
                isMobile = {this.props.isMobile}
                isDesktop = {this.props.isDesktop}
                isPortrait = {this.props.isPortrait}
                title="About Naegels"
                htmlMessage={this.state.gameInfo}
                submitButtonList={this.state.submitButtonList}
            >
            </FormContainer>
        )
    };

}