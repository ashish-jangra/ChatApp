import React, { Component } from "react";
import { Person } from "@material-ui/icons";
import { Box } from "@material-ui/core";

class ImageThumbnail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageError: false,
    };
  }
  hanldeImageLoadError = (e) => {
    this.setState({
      imageError: true,
    });
  };
  render() {
    return !this.state.imageError ? (
      <img
        onError={this.hanldeImageLoadError}
        className={this.props.className}
        style={this.props.className ? {} : {
          height: this.props.height || "128px",
          width: this.props.width || "128px",
          borderRadius: '200px'
        }}
        src={this.props.src}
      />
    ) : (
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: this.props.height,
          minWidth: this.props.width,
          maxHeight: this.props.height,
          maxWidth: this.props.width,
          marginLeft: 0,
          marginRight: "6px",
          background: this.props.background || "white",
          color: "gray",
          borderRadius: "200px",
        }}
      >
        <Person style={this.props.fontSize ? {fontSize: this.props.fontSize} : {}} />
      </Box>
    );
  }
}

export default ImageThumbnail;
