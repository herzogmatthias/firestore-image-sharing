import React from 'react';
import './ImageList.css'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ChatBoubleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import {updateLikesForPic} from '../../firebase/firestore.js';
import {db} from '../../firebase/firebase';
import {withRouter} from 'react-router-dom'

class ImageList extends React.Component {
  constructor() {
    super();
    this.state = {
      user: JSON.parse(localStorage.getItem('user')),
      like: {
        users: [],
        imgURL: "",
        likeCount: 0
      },
      hasLiked: false
    };
  }
  handleUpdate = () => {
    console.log("I tried")
    console.log(this.state.hasLiked);
    if (!this.state.hasLiked) {
      console.log(this.state.like);
      updateLikesForPic(this.state.like, this.state.user);
    }
  }
  hasAlreadyLiked = (data) => {
    console.log(data);
    data
      .users
      .forEach(value => {
        if (value.uid === this.state.user.uid) {
          this.setState({hasLiked: true});
        }
      })
  }
  navigateToDetails = (e) => {
    this
      .props
      .history
      .push({
        pathname: '/details',
        search: '?id=' + this.props.post.id
      });
  }
  async componentWillMount() {
    console.log(this.props)
    db
      .collection('likesForPic')
      .where('imgURL', '==', this.props.post.imgURL)
      .onSnapshot(snapshot => {
        console.log("hello bois");
        snapshot
          .docChanges()
          .forEach(change => {
            this.hasAlreadyLiked(change.doc.data());
            if (change.type === "added") {
              this.setState({
                like: change
                  .doc
                  .data()
              })
            }
            if (change.type === "modified") {
              console.log("hello bois");
              console.log(change.doc.data());
              this.setState({
                like: change
                  .doc
                  .data()
              });
            }
          })
      }, error => console.log(error));
    console.log(this.state.like)
  }
  getTags = () => {
    return this
      .props
      .post
      .tags
      .map((val, id) => {
        return (
          <Typography
            key={id}
            onClick={() => this.changeFilter(val)}
            color="primary"
            component="p">
            #{val}
          </Typography>
        )

      })
  }
  onDelete = () => {
    this
      .props
      .onDelete(this.props.post);
  }
  changeFilter = (val) => {
    this
      .props
      .changeFilter(val)
  }

  render() {
    return (
      <div>

        <Card className="card">
            <CardContent>
              <Grid container justify="space-between">
                <Avatar alt="" src={this.props.post.user.photoURL}></Avatar>
                <Typography gutterBottom variant="h5" component="h2">
                  {this.props.post.user.displayName}
                </Typography>
                {this.state.user.uid === this.props.post.user.uid
                  ? (
                    <IconButton onClick={this.onDelete}>
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  )
                  : (
                    <span></span>
                  )}
              </Grid>

            </CardContent>
            <div className="image-content" style={{backgroundImage: 'url('+this.props.post.imgURL+')'}}>
              <div className="flex-space"></div>
              <img src={this.props.post.imgURL} alt="" className="media"></img>
              <div className="flex-space"></div>
            </div>

            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {this.props.post.title}
              </Typography>
              <span style={{
                display: 'inline-flex'
              }}>
                <Typography component="p">
                  {this
                    .props
                    .post
                    .description
                    .split('#')[0]}

                </Typography>
                {this.getTags()}
              </span>

            </CardContent>
          <CardActions>
            <Grid container justify="space-between">
              <div>
              <span style={{verticalAlign: 'middle'}}><b style={{fontSize: '20px'}}>{this.state.like.likeCount}
                  </b></span>
                <IconButton onClick={this.handleUpdate}>
                  <FavoriteBorder fontSize="large" color="primary"></FavoriteBorder>
                </IconButton>
              </div>
              <div>
                <IconButton onClick={this.navigateToDetails}>
                  <ChatBoubleRoundedIcon fontSize="large" color="primary"></ChatBoubleRoundedIcon>
                </IconButton>
              </div>
            </Grid>

          </CardActions>
        </Card>
      </div>

    )
  }

}

export default withRouter(ImageList);
