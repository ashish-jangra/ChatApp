import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import {
	ArrowBack as ArrowBackIcon,
	Person as PersonIcon,
	MoreVert,
	Videocam,
	Call,
	Group as GroupIcon,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => {
	return {
		heading: {
			textTransform: 'capitalize',
			paddingLeft: '8px',
			textAlign: 'left',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			width: '100%',
		},
		avatarImage: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			height: '40px',
			width: '40px',
			padding: '0 8px',
			marginLeft: 0,
			marginRight: '6px',
			background: 'white',
			color: 'gray',
			borderRadius: '200px',
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
					<Box className={classes.avatarImage}>{this.props.isGroup ? <GroupIcon /> : <PersonIcon />}</Box>
					<Typography
						variant="body1"
						className={classes.heading}
					>
						{this.props.headerText}
					</Typography>
					<IconButton className={classes.videoIcon}>
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

export default withRouter(withStyles(styles)(ChatHeader));
