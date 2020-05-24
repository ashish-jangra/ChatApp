import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Box, AppBar, Toolbar, Typography, IconButton, Tabs, Tab } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon, Person as PersonIcon, MoreVert, Videocam, Call, Group as GroupIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => {
	console.log(theme);
	return {
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
		},
		tabs: {
			justifyContent: 'center'
		},
		tab: {
			width: '33.33%'
		}
	};
};

class Header extends Component {
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
					{!['/', '/status', '/calls'].includes(this.props.history.location.pathname) && (
						<IconButton color="inherit" aria-label="menu" onClick={this.handleGoBack}>
							<ArrowBackIcon />
						</IconButton>
					)}
					{this.props.showOptions && (
						<Box className={classes.avatarImage}>
							{this.props.isGroup ? <GroupIcon /> : <PersonIcon />}
						</Box>
					)}
					<Typography
						variant={this.props.history.location.pathname.startsWith('/chat') ? "body1" : "h6"}
						style={this.props.history.location.pathname.startsWith('/chat') ? {
							margin: '0 auto',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							width: '100%'
						} : {
							padding: '0 16px'
						}}
					>
						{this.props.headerText}
					</Typography>

					{this.props.showOptions && (
						<React.Fragment>
							<IconButton className={classes.videoIcon}>
								<Videocam />
							</IconButton>
							<IconButton className={classes.callIcon}>
								<Call />
							</IconButton>
							<IconButton className={classes.moreIcon}>
								<MoreVert />
							</IconButton>
						</React.Fragment>
					)}
				</Toolbar>
				{['/', '/status', '/calls'].includes(this.props.history.location.pathname) && (<Tabs indicatorColor="secondary" value={this.state.activeTab} classes={{flexContainer: classes.tabs}}>
					<Tab classes={{root: classes.tab}} label="Chats" onClick={()=> this.handleTabClick(0, '/')} />
					<Tab classes={{root: classes.tab}} label="Status" onClick={()=> this.handleTabClick(1, '/status')} />
					<Tab classes={{root: classes.tab}} label="Calls" onClick={()=> this.handleTabClick(2, '/calls')} />
				</Tabs>)}
			</AppBar>
		);
	}
}

const mapStateToProps = (state) => ({
	headerText: state.headerText,
	isGroup: state.group,
	showOptions: state.showOptions,
});

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Header)));
