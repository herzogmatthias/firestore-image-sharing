import React from 'react';
import './Home.css';
import Button from '@material-ui/core/Button';
import {auth} from '../../firebase/index.js'
import {withRouter} from 'react-router';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import ImageDialog from '../ImageDialog/ImageDialog';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            open: false
        };
        this.singOut = this
            .singOut
            .bind(this);
    }
    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };
    singOut(e) {
        console.log(this.props)
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
            <div className="root">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className="menuButton" color="inherit" aria-label="Menu">
                            <MenuIcon/>
                        </IconButton>
                        <Typography className="grow" variant="h6" color="inherit">
                            Image-Sharing
                        </Typography>
                        <Button onClick={this.singOut} color="inherit">Logout</Button>
                        <Button onClick={this.handleClickOpen} color="inherit">
                            Add Picture
                        </Button>
                        <Avatar alt="" src={this.state.user.photoURL}/>
                    </Toolbar>
                </AppBar>
                <ImageDialog open={this.state.open} onClose={this.handleClose}></ImageDialog>
            </div>
        )

    }

    componentDidMount() {
        this.setState({someKey: 'otherValue'});
    }
}

export default withRouter(Home);
