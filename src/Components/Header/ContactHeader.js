import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import {
	ArrowBack as ArrowBackIcon,
	MoreVert,
	Search as SearchIcon
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => {
	return {
    appbar: {
      textAlign: 'center',
      top: 0,
      left: 'auto',
      right: 0,
      position: 'sticky',
    },
    toolbar: { textAlign: 'center', padding: '8px 0', maxHeight: '36px', minHeight: '36px' },
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
    headingContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'left',
      paddingLeft: '8px'
    },
		iconContainer: {
			color: theme.palette.primary.contrastText,
			paddingRight: '8px',
			paddingLeft: 0,
		},
		searchIcon: {
			color: theme.palette.primary.contrastText,
			// paddingRight: '8px',
		},
		addContactIcon: {
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

class ContactHeader extends Component {
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
			<AppBar className={classes.appbar} >
				<Toolbar
					variant="dense"
					className={classes.toolbar}
				>
					<IconButton color="inherit" aria-label="menu" onClick={this.handleGoBack}>
						<ArrowBackIcon />
					</IconButton>
					<Box className={classes.headingContainer}>
            <Typography
              variant="body1"
            >
              {this.props.headerText.primary}
            </Typography>
            <Typography variant="body2">
              {this.props.headerText.secondary}
            </Typography>
          </Box>
					<IconButton className={classes.searchIcon}>
						<SearchIcon />
					</IconButton>
					<IconButton className={classes.moreIcon}>
						<MoreVert />
					</IconButton>
				</Toolbar>
			</AppBar>
		);
	}
}

export default withRouter(withStyles(styles)(ContactHeader));