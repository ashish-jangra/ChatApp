import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Box, AppBar, Toolbar, Button, IconButton } from '@material-ui/core';
import {
	ArrowBack as ArrowBackIcon,
	Person as PersonIcon,
	MoreVert,
	Videocam,
	Call,
	Group as GroupIcon,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import ImageThumbnail from '../Utility/imgThumbnail';
import config from '../config';

const styles = (theme) => {
	console.log(theme)
	return {
		heading: {
			...theme.typography.body1,
			display: 'inline',
			textTransform: 'capitalize',
			padding: '12px 8px',
			borderRadius: 0,
			color: theme.palette.primary.contrastText,
			textAlign: 'left',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			width: '100%',
		},
		iconContainer: {
			color: theme.palette.primary.contrastText,
			paddingRight: '8px',
			paddingLeft: 0,
		},
		videoIcon: {
			color: theme.palette.primary.contrastText,
			// paddingRight: '8px',
		},
		callIcon: {
			color: theme.palette.primary.contrastText,
			// paddingRight: '0px',
		},
		moreIcon: {
			color: theme.palette.primary.contrastText,
		},
		tabs: {
			justifyContent: 'center',
		},
		tab: {
			width: '33.33%',
		},
	};
};

class ChatHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 0,
		};
	}
	handleGoBack = () => {
		this.props.history.goBack();
	};
	handleShowProfile = () => {
		this.props.history.push('/profile/'+this.props.userId)
	}
	makeVideoCall = () => {
		// this.props.history.push('/call/'+this.props.userId)
		this.props.setCallData({
			active: true,
			userId: this.props.userId,
			name: this.props.headerText,
			initiator: true
		})
	}
	render() {
		const { classes } = this.props;
		return (
			<AppBar
				style={{
					textAlign: 'center',
					top: 0,
					left: 'auto',
					right: 0,
					position: 'sticky',
				}}
			>
				<Toolbar
					variant="dense"
					style={{ textAlign: 'center', padding: '8px 0', maxHeight: '36px', minHeight: '36px' }}
				>
					<IconButton color="inherit" aria-label="menu" onClick={this.handleGoBack}>
						<ArrowBackIcon />
					</IconButton>
					<ImageThumbnail src={config.getProfilePic(this.props.userId)+'&width=128&height=128'} height="40px" width="40px" />
					<Button
						onClick={this.handleShowProfile}
						className={classes.heading}
					>
						{this.props.headerText}
					</Button>
					<IconButton onClick={this.makeVideoCall} className={classes.videoIcon}>
						<Videocam />
					</IconButton>
					<IconButton className={classes.callIcon}>
						<Call />
					</IconButton>
					<IconButton className={classes.moreIcon}>
						<MoreVert />
					</IconButton>
				</Toolbar>
			</AppBar>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	setCallData: callData => dispatch({type: 'SET_CALL_DATA', callData})
})

export default withRouter (connect(null, mapDispatchToProps) (withStyles(styles)(ChatHeader)));
