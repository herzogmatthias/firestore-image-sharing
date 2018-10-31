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
import  Grid  from '@material-ui/core/Grid';

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

                    console.log('File available at', downloadURL);
                    const post = {
                        title: this.state.title,
                        user: this.state.user,
                        imgURL: downloadURL
                    }
                    const postRef = db.addDb(post);
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
                <TextField onChange={(e) => this.setState({title: e.target.value})} color="primary" value={this.state.title} label="title of your image"/>
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
                    <TextField color="primary" value={this.state.src.name}/>
                    <div className="divider"></div>
                    <LinearProgress variant="determinate" value={this.state.progress}/>
                
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Disagree
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