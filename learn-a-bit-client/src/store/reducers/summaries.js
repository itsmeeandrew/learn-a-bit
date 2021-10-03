import { LOAD_SUMMARIES, UPDATE_SUMMARY_WITH_UPDOOT } from "../actionTypes";

// eslint-disable-next-line
export default (state=[], action) => {
    switch(action.type){
        case LOAD_SUMMARIES:
            return [...action.summaries];
        
        case UPDATE_SUMMARY_WITH_UPDOOT:
            let newState = [ ...state ];
            let summaryIdx = state.findIndex(summary => {
                return summary._id === action.payload.id;
            });
            newState[summaryIdx].updoots = action.payload.updootsArray;
            newState[summaryIdx].updootsCount = action.payload.updootsCount;

            return newState;

        default:
            return state;
    }
}