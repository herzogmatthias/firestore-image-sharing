import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography';
import './Comment.css';

class Comment extends React.Component {
    constructor() {
        super();
        this.state = {
            someKey: 'someValue'
        };
    }

    render() {
        return (
            <ListItem className="item">
                <ListItemAvatar>
                    <Avatar sizes="small" alt="Remy Sharp" src={this.props.comment.user.photoURL}/>
                </ListItemAvatar>
                <ListItemText
                    primary={<Typography component="span" className="inline" color="textPrimary"> {Intl.DateTimeFormat('de-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                    }).format(this.props.comment.date)},&nbsp;
                        {this.props.comment.user.displayName}
                    </Typography>}
                    secondary={<>
                    {this.props.comment.text} </>}/>
            </ListItem>
        )
    }

    componentDidMount() {
        console.log(this.props);
    }
    componentWillMount() {
        console.log(this.props)
    }
}

export default Comment;
