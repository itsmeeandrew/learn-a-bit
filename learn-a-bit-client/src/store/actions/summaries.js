import axios from "axios";
import { LOAD_SUMMARIES, ADD_SUMMARY, REMOVE_SUMMARY} from "../actionTypes";

function loadSummaries(summaries){
    return {
        type: LOAD_SUMMARIES,
        summaries
    }
}

function addSummary(summary){
    return {
        type: ADD_SUMMARY,
        summary
    }
}

function removeSummary(id){
    return {
        type: REMOVE_SUMMARY,
        id
    }
}

export function getSummaries(){
    return (dispatch, getState) => {
        const { currentUser } = getState();
        const userId = currentUser.user.id;

        return new Promise((resolve, reject) => {
            axios.get(`/api/users/${userId}/summaries`)
                .then(res => {
                    dispatch(loadSummaries(res.data))
                    resolve();
                })
                .catch(err => {
                    console.log("[ERROR] GETSUMMARIES: ", err);
                    reject();
                })
        })
    }
}

export function postSummary(newSummary){
    return (dispatch, getState) => {
        const { currentUser } = getState();
        const userId = currentUser.user.id;

        return new Promise((resolve, reject) => {
            axios.post(`/api/users/${userId}/summaries`, newSummary)
                .then(res => {
                    dispatch(addSummary(res.data));
                    resolve();
                })
                .catch(err => {
                    console.log("[ERROR] POSTSUMMARY: ", err.response.data.error.message);
                    reject();
                })
        })
    }
}

export function deleteSummary(summaryId){
    return (dispatch, getState) => {
        const { currentUser } = getState();
        const userId = currentUser.user.id;
        
        return new Promise((resolve, reject) => {
            axios.delete(`/api/users/${userId}/summaries/${summaryId}`)
                .then(() => {
                    dispatch(removeSummary(summaryId));
                    resolve();
                })
                .catch(err => {
                    console.log("[ERROR] DELETESUMMARY: ", err);
                    reject();
                })
        })
    }
}