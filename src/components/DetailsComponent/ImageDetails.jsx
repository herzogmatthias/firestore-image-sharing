import React from 'react';
import './ImageDetails.css'
import Navbar from '../NavbarComponent/Navbar';
import {getPostForId, getLikesForImage} from '../../firebase/firestore.js';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import PublishIcon from '@material-ui/icons/Publish';
import IconButton from '@material-ui/core/IconButton';
const queryString = require('query-string');

class ImageDetails extends React.Component {
    constructor() {
        super();
        this.state = {
            someKey: 'someValue',
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
        const id = queryString.parse(this.props.location.search)
        console.log(id);

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
        likes
            .get()
            .then(snapshot => {
                snapshot
                    .docs
                    .forEach(val => this.setState({
                        like: val.data(),
                        loading: false
                    }));
            })
    }

    render() {

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
                                    <IconButton>
                                        <PublishIcon color="primary" fontSize="large"></PublishIcon>
                                    </IconButton>
                                </Grid>

                            </div>
                        </Grid>

                    )}

            </div>
        )
    }

}

export default ImageDetails;
