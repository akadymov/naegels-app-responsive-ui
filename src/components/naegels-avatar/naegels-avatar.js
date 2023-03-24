import React from 'react';

import Avatar from '@mui/material/Avatar';



export default class NaegelsAvatar extends React.Component{



    stringToColor(string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
        return color;
    }
      
    stringAvatar(name) {
        return {
            sx: {
            bgcolor: this.stringToColor(name),
            },
            children: `${name[0][0]}`,
        };
    }

    render () {
        return(
            <Avatar 
                {...this.stringAvatar(this.props.username.toUpperCase())}
                src={`/img/profile-pics/${this.props.username}.png`}
                sx={{ 
                    width: this.props.width, 
                    height: this.props.height , 
                    outline: this.props.outline
                }}
            ></Avatar>
        )
    }
}