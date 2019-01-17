import React from 'react';
import './ImageDetails.css'
import Navbar from '../NavbarComponent/Navbar';
import {getPostForId, getLikesForImage, addCommentsForPicture, getTokenForUid} from '../../firebase/firestore.js';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import PublishIcon from '@material-ui/icons/Publish';
import IconButton from '@material-ui/core/IconButton';
import {db} from '../../firebase/firebase';
import Comment from '../CommentComponent/Comment';
import List from '@material-ui/core/List';
const queryString = require('query-string');
const SERVER_KEY = 'AAAAovx93tQ:APA91bFSepepPGmVM95GyPrqHF-U5gAFITYQ7xOgnPQUEhN4yOOBXiXcxiUyq9pJnLmfl5fFlAgBvgi6Ad0eDZGyZXnjSs6nXJQNIba4zoduXnGV0n5i3PcNmd0v2_kHCusAqVNYYROo';

class ImageDetails extends React.Component {
    constructor() {
        super();
        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            post: {},
            loading: true,
            likes: {},
            comments: [],
            myComment: {
                postId: "",
                text: "",
                user: {},
                date: new Date()
            }
        };
    }
    handleChange = (e) => {
        let myComment = {
            ...this.state.myComment
        };
        myComment.text = e.target.value;
        this.setState({myComment: myComment});
        console.log(this.state);
    }
    addComment = async () => {
        let myComment = {
            ...this.state.myComment
        }
        myComment.date = new Date();
        myComment.user = this.state.user;
        console.log(this.state.user)
        console.log(this.state.post.user.uid);
        const tokenRef = await getTokenForUid(this.state.post.user.uid);
        let token = {};
        tokenRef.docs.forEach(doc => token = doc.data())
        const id = queryString.parse(this.props.location.search);
        if(token != null) {
            let notificationBody = {
                "notification": {
                    "title": "new Comment",
                    "body": "You have a new Comment for one of your posts",
                    "click_action": "https://https://firestore-image-sharing.firebaseapp.com/details?id="+ id.id,
                },
                "to": token.id
            };
            console.log(notificationBody)
            fetch('https://fcm.googleapis.com/fcm/send', {method: 'POST', body: JSON.stringify(notificationBody), headers: {
                "Content-Type": 'application/json',
                "Authorization": 'key='+ SERVER_KEY
            }}).then(this.handleErrors).then((value) => {
                console.log(value);
            }).catch(error => console.log(error));
        }
        this.setState({myComment: myComment});
        addCommentsForPicture(myComment);
    }
    handleErrors = (response) => {
        if (!response.ok) {
            console.log(response);
            throw Error(response);
        }
        return response;
    }
    getTags = () => {
        return this
            .state
            .post
            .tags
            .map((val, id) => {
                return (
                    <Typography key={id} color="primary" variant="h5">
                        #{val}
                    </Typography>
                )

            })
    }
    async componentWillMount() {
        console.log(queryString.parse(this.props.location.search).id.id);
        const id = queryString.parse(this.props.location.search)
        console.log(id);
        
        let myComment = {
            ...this.state.myComment
        };
        myComment.postId = id.id;
        this.setState({myComment: myComment});
        let post = await getPostForId(id.id);
        await post
            .get()
            .then(snapshot => {
                const post = {
                    id: snapshot.id,
                    tags: snapshot
                        .data()
                        .tags,
                    imgURL: snapshot
                        .data()
                        .imgURL,
                    title: snapshot
                        .data()
                        .title,
                    user: snapshot
                        .data()
                        .user,
                    description: snapshot
                        .data()
                        .description
                };
                this.setState({post: post});
            })
        let likes = await getLikesForImage(this.state.post);
        await likes
            .get()
            .then(snapshot => {
                snapshot
                    .docs
                    .forEach(val => this.setState({
                        like: val.data()
                    }));
                    this.setState({loading: false});
            })
            db
            .collection('commentsForPicture')
            .where('postId', '==', id.id)
            .onSnapshot(snapshot => {
                snapshot
                    .docChanges()
                    .forEach(changes => {
                        if (changes.type === 'added') {
                            const comment = {
                                postId: changes.doc.data().postId,
                                text: changes.doc.data().text,
                                user: changes.doc.data().user,
                                date: changes.doc.data().date.toDate()
                            }
                            this.setState(prevState => ({
                                comments: [
                                    ...prevState.comments,
                                    comment
                                ]
                            }))
                            this.state.comments.sort((a, b) =>  b.date.getTime() - a.date.getTime())
                        }
                        this.setState({loading: false});
                    })
            })
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <Navbar></Navbar>
                <div className="divider"></div>
                {this.state.loading
                    ? (
                        <div
                            style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <CircularProgress variant="indeterminate" className="center-text"></CircularProgress>
                        </div>
                    )
                    : (
                        <Grid container justify="center">
                            <div className="image-card">
                                <Grid container justify="space-between">

                                    <Typography component="h2" variant="h3">{this.state.post.user.displayName}</Typography>
                                    <Avatar alt="" src={this.state.post.user.photoURL}></Avatar>
                                </Grid>
                                <Grid container justify="center">
                                    <div className="image-content">
                                        <div className="flex-space"></div>
                                        <img src={this.state.post.imgURL} alt={this.state.post.title} className="media"></img>
                                        <div className="flex-space"></div>
                                    </div>

                                </Grid>
                                <Grid container justify="space-between">
                                    <div>
                                        <Typography variant="h4">
                                            <b>{this.state.like.likeCount}
                                            </b>
                                            <ThumbUpAltIcon fontSize="large" color="primary"></ThumbUpAltIcon>
                                        </Typography>

                                    </div>
                                    <div>
                                        <Typography variant="h4">
                                            <b>{this.state.post.title}
                                            </b>
                                        </Typography>
                                    </div>

                                </Grid>
                                <Divider/>
                                <span
                                    style={{
                                    display: 'inline-flex'
                                }}>
                                    <Typography variant="h5">
                                        {this
                                            .state
                                            .post
                                            .description
                                            .split('#')[0]}

                                    </Typography>
                                    {this.getTags()}
                                </span>
                                <Divider/>
                                <Grid container justify="space-between">
                                    <TextField
                                        id="standard-name"
                                        label="Write Your Comment"
                                        value={this.state.commentText}
                                        onChange={this.handleChange}
                                        margin="none"
                                        className="text-field-width"/>
                                    <IconButton onClick={this.addComment}>
                                        <PublishIcon color="primary" fontSize="large"></PublishIcon>
                                    </IconButton>
                                </Grid>
                                <Typography variant="h4">
                                            Comments
                                </Typography>
                                <List style={{height:'300px', overflow:'auto'}}>
                                    {this
                                        .state
                                        .comments
                                        .map((val, ind, arr) => {
                                            return <Comment key={ind} comment={val}></Comment>
                                        })}
                                </List>

                            </div>
                        </Grid>

                    )}

            </div>
        )
    }

}

export default ImageDetails;
