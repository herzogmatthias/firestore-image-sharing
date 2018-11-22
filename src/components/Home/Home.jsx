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
import CircularProgress from '@material-ui/core/CircularProgress';
import {db, firebase} from '../../firebase/firebase';
import {getPostForImgURL} from '../../firebase/firestore.js';
import {deleteLikesForPic} from '../../firebase/firestore.js';
import ImageList from '../ImageList/ImageList';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            open: false,
            posts: [],
            isLoading: true,
            tags: [
                {
                    label: 'select All'
                }
            ],
            selectedTag: {label: ""},
            customStyles : {
                menu: base => ({
                  ...base,
                  // override border radius to match the box
                  borderRadius: 0,
                  // kill the gap
                  marginTop: 0,
                }),
                menuList: base => ({
                  ...base,
                  // kill the white space on first and last option
                  padding: 0,
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: "white",
                    color : "black",
                })

              }
        };
        this.singOut = this
            .singOut
            .bind(this);
    }
    
    search = (nameKey, myArray) => {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].label === nameKey) {
                return myArray[i];
            }
        }
        return null;
    }
    componentWillMount() {
        db
            .collection('posts')
            .onSnapshot((snapshot) => {
                snapshot
                    .docChanges()
                    .forEach((change) => {
                        if (change.type === 'added') {
                            this.setState(prevState => ({
                                posts: [
                                    ...prevState.posts,
                                    change
                                        .doc
                                        .data()
                                ]
                            }))
                            change
                                .doc
                                .data()
                                .tags
                                .forEach(tag => {
                                    if (this.search(tag, this.state.tags) == null) 
                                        this.setState(prevState => ({
                                            tags: [
                                                ...prevState.tags, {
                                                    label: tag
                                                }
                                            ]
                                        }))
                                })
                        }
                        if (change.type === 'removed') {
                            var arr = [...this.state.posts];
                            let postToDelete = arr.findIndex((val) => val.imgURL === change.doc.data().imgURL);
                            console.log(postToDelete);
                            arr.splice(postToDelete, 1);
                            console.log(arr);
                            this.setState({posts: arr});
                        }

                        console.log(this.state.posts);
                    })
                this.setState({isLoading: false});
            })
    }
    handleClickOpen = () => {
        this.setState({open: true});
    };
    changeFilter = (newTag) => {
        this.setState({selectedTag: {label: newTag}})
    }

    handleClose = () => {
        this.setState({open: false});
    };
    handleDelete = async post => {
        const postToDelete = await getPostForImgURL(post.imgURL);
        const likesToDelete = await deleteLikesForPic(post.imgURL);
        console.log(postToDelete);

        const imgRef = firebase
            .storage()
            .refFromURL(post.imgURL);
        postToDelete
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((doc) => doc.ref.delete());
            });
        likesToDelete
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((doc) => doc.ref.delete());
            });
        console.log(imgRef);
        imgRef.delete();

    }
    handleSearch = (e) => {
        console.log(e);
        this.setState({selectedTag: {label: e.label}})
    }
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
                <Select
                    options={this.state.tags}
                    isSearchable
                    styles={this.state.customStyles}
                    Input
                    value={this.state.selectedTag}
                    onChange={(e) => this.handleSearch(e)}
                    placeholder="Search after Tags"/> {this.state.isLoading
                    ? (
                        <div
                            style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <CircularProgress variant="indeterminate" className="center-text"></CircularProgress>
                        </div>
                    )
                    : (this.state.posts.map((val, ind, arr) => {
                        console.log(val.tags);
                        if (val.tags.includes(this.state.selectedTag.label) || this.state.selectedTag.label === "" || this.state.selectedTag.label === 'select All') 
                            return (
                                <Grid key={ind} container justify="center">
                                    <ImageList
                                        onDelete={this.handleDelete}
                                        changeFilter={this.changeFilter}
                                        post={val}
                                        key={ind}></ImageList>
                                </Grid>

                            )

                    }))}
                <ImageDialog open={this.state.open} onClose={this.handleClose}></ImageDialog>
            </div>
        )

    }
}

export default withRouter(Home);