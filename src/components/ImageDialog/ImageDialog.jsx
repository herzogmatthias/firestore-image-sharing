import React from 'react';
import './ImageDialog.css';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {uploadImg, storage} from '../../firebase/firebase';
import {db} from '../../firebase/index.js';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

class ImageDialog extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            user: JSON.parse(localStorage.getItem('user')),
            src: {
                lastModified: 0,
                lastModifiedDate: new Date(),
                name: "",
                size: 0,
                type: '',
                webkitRelativePath: ""
            },
            desc: '',
            progress: 0,
            isUploading: true
        };
    }
    handleClose = () => {
        this
            .props
            .onClose();
    };
    handleChange = (e) => {
        console.log(e.target.files)
        this.setState({src: e.target.files[0]});
    }
    handleMultiLine = (e) => {
        this.setState({desc: e.target.value})
    }
    filterTags = () => {
        let descArray = this
            .state
            .desc
            .split('#');
        console.log(descArray);
        descArray.splice(0, 1);
        let tags = [];
        for (const tag of descArray) {
            if (tag !== "") {
                tags.push(tag);
            }
        }
        return tags;
    }
    startUpload = () => {
        var uploadTask = uploadImg(this.state.src);
        this.setState({isUploading: true})
        uploadTask.on(storage.TaskEvent.STATE_CHANGED, (snapshot) => {
            this.setState({
                progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            })
        }, (error) => console.log(error), () => {
            this.setState({isUploading: false})
            uploadTask
                .snapshot
                .ref
                .getDownloadURL()
                .then((downloadURL) => {
                    const tags = this.filterTags();
                    console.log('File available at', downloadURL);
                    const post = {
                        title: this.state.title,
                        user: this.state.user,
                        imgURL: downloadURL,
                        description: this.state.desc,
                        tags: tags
                    }
                    const postRef = db.addPost(post);
                    const like = {
                        users : [],
                        imgURL: downloadURL,
                        likeCount: 0,
                    }
                    const likeRef = db.addLikesForPic(like);
                    console.log(likeRef);
                    console.log(postRef);
                });
        })
    }

    render() {
        const {
            onClose,
            ...other
        } = this.props;
        return (
            <Dialog
                onClose={this.handleClose}
                aria-labelledby="simple-dialog-title"
                {...other}>
                <DialogTitle id="simple-dialog-title">Add your Image</DialogTitle>
                <DialogContent>
                    <Grid className="divider" container alignItems="center" direction="column">
                        <TextField
                            onChange={(e) => this.setState({title: e.target.value})}
                            color="primary"
                            value={this.state.title}
                            margin="normal"
                            label="Title of your image"/>
                    </Grid>
                    <input
                        accept="image/*"
                        style={{
                        display: 'none'
                    }}
                        id="raised-button-file"
                        type="file"
                        onChange={this.handleChange}/>
                    <label htmlFor="raised-button-file">
                        <Button variant="contained" component="span">
                            Upload
                        </Button>
                    </label>
                    <TextField
                        color="primary"
                        InputProps={{
                        readOnly: true
                    }}
                        value={this.state.src.name}/>
                    <div className="divider"></div>
                    <LinearProgress variant="determinate" value={this.state.progress}/>
                    <Grid container alignItems="center" direction="column">
                        <TextField
                            id="standard-multiline-flexible"
                            label="Description (# for tag)"
                            multiline
                            rowsMax="5"
                            fullWidth
                            value={this.state.desc}
                            onChange={this.handleMultiLine}
                            margin="normal"/>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.startUpload} color="primary" autoFocus>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
export default ImageDialog;