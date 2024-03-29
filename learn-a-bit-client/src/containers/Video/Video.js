import React, { Component } from "react";
import "./Video.css";
import { connect } from "react-redux";
import { Redirect } from "react-router";

import withAuth from "../../hocs/withAuth";
import NewSummaryForm from "../NewSummaryForm/NewSummaryForm";

import axios from "axios";

class Video extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            currentVideo: {}
        }
    }

    render(){
        const { currentChannel } = this.props;
        const { isLoading, currentVideo } = this.state;
        const videoURL = "https://www.youtube.com/embed/" + currentVideo.videoId;

        // If there was no channel clicked on beforehand, redirect to /channels
        if (!Boolean(Object.keys(currentChannel).length)){
            <Redirect to="/channels" />
        } 

        if (!isLoading) {
            return (
                <div className="hero-default hero-video">
                    <div className="container-default container-video">
                        <h1>{currentVideo.channelTitle}</h1>
                        <h4><i>presents</i></h4>
                        <h3>{currentVideo.videoTitle}</h3>

                        <iframe
                            title={currentVideo.videoTitle}
                            src={videoURL}
                        > 
                        </iframe>
                    
                        <NewSummaryForm
                            videoSource={currentVideo.channelTitle}
                            videoTitle={currentVideo.videoTitle}
                        />
                    </div>
                </div>
            )
        } 
        else if (!isLoading && Boolean(Object.keys(currentVideo).length)) {
            return (
                <div className="hero-default hero-video">
                    <div className="container-default container-video">
                        <h3>We couldn't get a video for <b>{currentChannel.channelName}</b> :(</h3>
                        <h3>Are you sure you gave the correct channel ID?</h3>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="hero-default hero-video">
                    <div className="container-default container-video">
                        <h3>Getting a video from <b>{currentChannel.channelName}...</b></h3>
                        <div className="loading-icon-container">
                            <div className="loading-icon"></div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    componentDidMount(){
        const userId = this.props.currentUser.user.id;
        const channelId = this.props.currentChannel._id;
        const URL = `/api/users/${userId}/sources/youtube-channels/${channelId}/randomvideo`;

        // Development version
        //  -> Simulating the request for videos

        /* this.setState(previousState => {
            return {
                ...previousState,
                isLoading: false,
                currentVideo: {
                    channelTitle: "Kurzgesagt – In a Nutshell",
                    videoId: "G-WO-z-QuWI",
                    videoTitle: "How To Terraform Venus (Quickly)"
                }
            }
        }) */


        // Production version
        axios.get(URL)
            .then(res => {
                let videos = res.data;
                let randomIndex = Math.floor(Math.random() * videos.length);
                this.setState({
                    isLoading: false,
                    currentVideo: videos[randomIndex]
                })
            })
            .catch(err => {
                console.log("[ERROR] RANDOMVIDEO: ", err)
            })
    }
}

function mapStateToProps(state){
    return {
        currentChannel: state.currentChannel,
        currentUser: state.currentUser
    }
}

export default withAuth(connect(mapStateToProps, null)(Video));