import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Tabs, Tab } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon, Person as PersonIcon, MoreVert, Videocam, Call, Group as GroupIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => {
	console.log(theme);
	return {
    appbar: {
      textAlign: 'center',
      top: 0,
      left: 'auto',
      right: 0,
      position: 'sticky',
    },
    toolbar: { textAlign: 'center', padding: '8px 0', maxHeight: '36px', minHeight: '36px' },
    heading: { padding: '0 16px' },
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
			paddingRight: '8px',
		},
		callIcon: {
			color: theme.palette.primary.contrastText,
			paddingRight: '0px',
		},
		moreIcon: {
      color: theme.palette.primary.contrastText,
      position: 'absolute',
      right: 0,
      top: 0
		},
		tabs: {
			justifyContent: 'center'
		},
		tab: {
			width: '33.33%'
		}
	};
};

class HomeHeader extends Component {
	constructor(props){
		super(props);
		this.state = {
			activeTab: 0
		}
	}
	handleGoBack = () => {
		this.props.history.goBack();
	};
	handleTabClick = (newTabIndex, url) => {
		if(this.state.activeTab !== newTabIndex){
			this.setState({
				activeTab: newTabIndex
			});
			this.props.history.push(url)
		}
	}
	componentDidUpdate(){
		let newTabIndex = ['/', '/status', '/calls'].indexOf(this.props.history.location.pathname);
		if(newTabIndex !== -1 && newTabIndex !== this.state.activeTab){
			this.setState({
				activeTab: newTabIndex
			})
		}
	}
	render() {
		const { classes } = this.props;
		return (
			<AppBar className={classes.appbar}>
				<Toolbar
					variant="dense"
					className={classes.toolbar}
				>
					<Typography
						variant="h6"
						className={classes.heading}
					>
						{this.props.headerText}
					</Typography>
          <IconButton className={classes.moreIcon}>
            <MoreVert />
          </IconButton>
				</Toolbar>
				<Tabs indicatorColor="secondary" value={this.state.activeTab} classes={{flexContainer: classes.tabs}}>
					<Tab classes={{root: classes.tab}} label="Chats" onClick={()=> this.handleTabClick(0, '/')} />
					<Tab classes={{root: classes.tab}} label="Status" onClick={()=> this.handleTabClick(1, '/status')} />
					<Tab classes={{root: classes.tab}} label="Calls" onClick={()=> this.handleTabClick(2, '/calls')} />
				</Tabs>
			</AppBar>
		);
	}
}

export default withRouter(withStyles(styles)(HomeHeader));