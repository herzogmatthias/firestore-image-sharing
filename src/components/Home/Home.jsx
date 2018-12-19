import React from 'react';
import './Home.css';
import ImageDialog from '../ImageDialog/ImageDialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import {db, firebase} from '../../firebase/firebase';
import {getPostForId, deleteCommentsForPic, addMessagingToken, updateTokenForUid} from '../../firebase/firestore.js';
import {deleteLikesForPic, checkForToken} from '../../firebase/firestore.js';
import ImageList from '../ImageList/ImageList';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select'
import Navbar from '../NavbarComponent/Navbar';
import { askForPermissionToReceiveNotifications } from '../../firebase/messaging';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            posts: [],
            isLoading: true,
            tags: [
                {
                    label: 'select All'
                }
            ],
            selectedTag: {
                label: ""
            },
            customStyles: {
                menu: base => ({
                    ...base,
                    // override border radius to match the box
                    borderRadius: 0,
                    // kill the gap
                    marginTop: 0
                }),
                menuList: base => ({
                    ...base,
                    // kill the white space on first and last option
                    padding: 0
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: "white",
                    color: "black"
                })

            }
        };
    }

    search = (nameKey, myArray) => {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].label === nameKey) {
                return myArray[i];
            }
        }
        return null;
    }
    async componentWillMount() {
        let token = {id: "", uid: ""};
        token.id = await askForPermissionToReceiveNotifications();
        if(token.id != null) {
            token.uid = JSON.parse(localStorage.getItem('user')).uid;
            const tokenRef = await checkForToken(token);
            if(tokenRef.docs.length === 0) {
                addMessagingToken(token);
            } else {
                let copyToken = {};
                tokenRef.docs.forEach(doc => copyToken = doc.data());
                updateTokenForUid(copyToken, token.id);
            }
        }
        db
            .collection('posts')
            .onSnapshot((snapshot) => {
                snapshot
                    .docChanges()
                    .forEach((change) => {
                        if (change.type === 'added') {
                            const post = {
                                id: change.doc.id,
                                tags: change
                                    .doc
                                    .data()
                                    .tags,
                                imgURL: change
                                    .doc
                                    .data()
                                    .imgURL,
                                title: change
                                    .doc
                                    .data()
                                    .title,
                                user: change
                                    .doc
                                    .data()
                                    .user,
                                description: change
                                    .doc
                                    .data()
                                    .description
                            }
                            this.setState(prevState => ({
                                posts: [
                                    ...prevState.posts,
                                    post
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
                            let postToDelete = arr.findIndex((val) => val.id === change.doc.id);
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
        this.setState({
            selectedTag: {
                label: newTag
            }
        })
    }

    handleClose = () => {
        this.setState({open: false});
    };
    handleDelete = async post => {
        const postToDelete = await getPostForId(post.id);
        const commentsToDelete = await deleteCommentsForPic(post.id);
        const likesToDelete = await deleteLikesForPic(post.imgURL);
        console.log(postToDelete);

        const imgRef = firebase
            .storage()
            .refFromURL(post.imgURL);
        postToDelete.delete();
        commentsToDelete.get().then(querySnapshot => {
            querySnapshot.forEach((doc) => doc.ref.delete());
        })
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
        this.setState({
            selectedTag: {
                label: e.label
            }
        })
    }
    render() {
        return (
            <div className="root">
                <Navbar handleClickOpen={this.handleClickOpen}></Navbar>
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

export default Home;