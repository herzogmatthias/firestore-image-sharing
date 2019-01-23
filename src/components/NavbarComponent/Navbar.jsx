import React from 'react';
import Button from '@material-ui/core/Button';
import {auth} from '../../firebase/index.js'
import {withRouter} from 'react-router';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

class Navbar extends React.Component {
    constructor() {
        super();
        this.state = {
            someKey: 'someValue',
            user: JSON.parse(localStorage.getItem('user'))
        };
    }
    singOut = (e) => {
        auth
            .auth
            .signOut()
            .then(() => {
                localStorage.removeItem("user")
                this
                    .props
                    .history
                    .push('/');
            })
            .catch(error => console.log(error))
    }
    render() {
        return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton className="menuButton" color="inherit" aria-label="Menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography className="grow" variant="h6" color="inherit">
                        Image-Sharing
                    </Typography>
                    <Button onClick={this.singOut} color="inherit">Logout</Button>
                    <Button onClick={this.props.handleClickOpen} color="inherit">
                        Add Picture
                    </Button>
                    <Avatar alt="" src={this.state.user.photoURL}/>
                </Toolbar>
            </AppBar>
        )
    }
}

export default withRouter(Navbar);
