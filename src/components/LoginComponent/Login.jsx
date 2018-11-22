import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import './login.css';
import Typography from '@material-ui/core/Typography';

import {firebase} from '../../firebase/index.js';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      someKey: 'someValue'
    };
  }

  render() {
    return (
      <div className="fullscreen">
        <Card className="center-card">
          <CardActionArea>
            <CardContent>
              <Typography
                style={{
                textAlign: 'center'
              }}
                gutterBottom
                variant="h5"
                component="h2">
                Login
              </Typography>
              <Typography component="p">
                Log in with your Google Account to access the Image-Sharing-App
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <StyledFirebaseAuth
            uiCallback={ui => ui.disableAutoSignIn()}
              className="logInBtn"
              uiConfig={firebase.uiConfig}
              firebaseAuth={firebase.firebase.auth()}/>
          </CardActions>
        </Card>
      </div>

    );
  }

}

export default Login;
