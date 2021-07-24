import axios from "axios";
import { ADD_CHANNEL, LOAD_CHANNELS, REMOVE_CHANNEL } from "../actionTypes";

function loadChannels(channels){
    return {
        type: LOAD_CHANNELS,
        channels
    }
}

function addChannel(channel){
    return {
        type: ADD_CHANNEL,
        channel
    }
}

function removeChannel(id){
    return {
        type: REMOVE_CHANNEL,
        id
    }
}

export function getChannels(){
    return (dispatch, getState) => {
        let { currentUser } = getState();
        const id = currentUser.user.id;
        
        return new Promise((resolve, reject) => {
            axios.get(`/api/users/${id}/sources/youtube-channels`)
                .then(res => {
                    dispatch(loadChannels(res.data));
                    resolve();
                })
                .catch(err => {
                    console.log("[ERROR] GETCHANNELS: ", err.response.data.error.message)
                    reject();
                })
        })
    }
}

export function postChannel(newChannel){
    return (dispatch, getState) => {
        let { currentUser } = getState();
        const id = currentUser.user.id;
        
        return new Promise((resolve, reject) => {
            axios.post(`/api/users/${id}/sources/youtube-channels`, newChannel)
                .then(res =>{
                    dispatch(addChannel(res.data));
                    resolve();
                })
                .catch(err => {
                    console.log("[ERROR] POSTCHANNEL: ", err.response.data.error.message)
                    reject();
                })
        })
    }
}

export function deleteChannel(id){
    return (dispatch, getState) => {
        let { currentUser } = getState();
        const userId = currentUser.user.id;

        return new Promise((resolve, reject) => {
            axios.delete(`/api/users/${userId}/sources/youtube-channels/${id}`)
                .then(() => {
                    dispatch(removeChannel(id));
                    resolve();
                })
                .catch(err => {
                    console.log("[ERROR] DELETECHANNEL: ", err.response.data.error);
                    reject();
                })
        })
    }
}