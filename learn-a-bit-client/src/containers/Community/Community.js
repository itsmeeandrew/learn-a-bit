import React, { Component } from "react";
import "./Community.css";

import { connect } from "react-redux";
import { getSummaries, switchUpdootOnSummary } from "../../store/actions/summaries";

import SummaryItem from "../../components/SummaryItem/SummaryItem";

const TABS = {
    SORT_BY_DATE: "SORT_BY_DATE",
    SORT_BY_UPDOOTS: "SORT_BY_UPDOOTS",
    CUSTOM_SEARCH: "CUSTOM_SEARCH"
}

const SORT_BY = {
    DATE: {
        createdAt: -1
    },
    UPDOOTS: {
        updootsCount: -1
    }
}

class Community extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            activeTab: TABS.SORT_BY_DATE,
            customSearch: {
                authorInput: "",
                channelNameInput: "",
                videoTitleInput: ""
            }
        }

        this.handleUpdoot = this.handleUpdoot.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.loadSummaries = this.loadSummaries.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onCustomSearch = this.onCustomSearch.bind(this);
    }
    
    render(){
        const { summaries, currentUser } = this.props;
        const { 
                isLoading, 
                activeTab, 
                customSearch: {
                authorInput,
                channelNameInput,
                videoTitleInput
            } 
        } = this.state;
        const userId = currentUser.user.id;
        console.log(summaries);
        if (Array.isArray(summaries) && !isLoading) {
            const summariesList = summaries.map(summary => {
                return (
                    <SummaryItem
                        key={summary._id}
                        videoSource={summary.videoSource}
                        videoTitle={summary.videoTitle}
                        title={summary.title}
                        text={summary.text}
                        author={summary.author.username}
                        updoots={summary.updoots}
                        updootsCount={summary.updootsCount}
                        createdAt={summary.createdAt}
                        onUpdoot={this.handleUpdoot.bind(this, summary._id)}
                        currentUserId={userId}
                    ></SummaryItem>
                )
            })
            return (
                <div className="hero-default hero-community">
                    <div className="container-default">
                        <h2>Community</h2>
                        <div className="order-list-by">
                                <button 
                                    className={`btn-order-by ${activeTab === TABS.SORT_BY_DATE ? "btn-order-by-active" : ""}`}
                                    onClick={this.handleTabChange.bind(this, TABS.SORT_BY_DATE)}
                                >
                                    Newest
                                </button>
                                <button 
                                    className={`btn-order-by ${activeTab === TABS.SORT_BY_UPDOOTS ? "btn-order-by-active" : ""}`}
                                    onClick={this.handleTabChange.bind(this, TABS.SORT_BY_UPDOOTS)}
                                >
                                    Most updooted
                                </button>
                                <button 
                                    className={`btn-order-by ${activeTab === TABS.CUSTOM_SEARCH ? "btn-order-by-active" : ""}`}
                                    onClick={this.handleTabChange.bind(this, TABS.CUSTOM_SEARCH)}
                                >
                                    Search
                                </button>
                        </div>
                        { activeTab === TABS.CUSTOM_SEARCH ? 
                            <div className="container-form-custom-search">
                                <div>
                                    <label className="form-label">Author:</label>
                                    <input 
                                        className="form-control"
                                        name="authorInput"
                                        value={authorInput}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                
                                <div>
                                    <label className="form-label">Channel name:</label>
                                    <input 
                                        className="form-control"
                                        name="channelNameInput"
                                        value={channelNameInput}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                
                                <div>
                                    <label className="form-label">Video title:</label>
                                    <input 
                                        className="form-control"
                                        name="videoTitleInput"
                                        value={videoTitleInput}
                                        onChange={this.handleChange}
                                    />
                                </div>

                                <div>
                                    <button 
                                        className="btn-default btn-submit-default"
                                        onClick={this.onCustomSearch}
                                    >
                                            Search
                                    </button>
                                </div>
                            </div> : null
                        }
                        <div className="list-items">
                            {summariesList.length === 0 ? 
                                <p>No summaries found. :(</p> :
                                summariesList
                            }
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="hero-default hero-community">
                    <div className="container-default">
                        <h2>Community</h2>
                        <div className="loading-icon-container">
                            <div className="loading-icon"></div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    componentDidMount(){
        this.loadSummaries(SORT_BY.DATE, {})
    }
    
    handleUpdoot(id){
        this.props.switchUpdootOnSummary(id);
    }

    handleChange(e) {
        this.setState(previousState => {
            return {
                customSearch: {
                    ...previousState.customSearch,
                    [e.target.name]: e.target.value
                }
            }
        })
    }

    handleTabChange(tab){
        this.setState({
            activeTab: tab
        })

        switch(tab){
            case TABS.SORT_BY_DATE:
                this.loadSummaries(SORT_BY.DATE, {})
                break
            
            case TABS.SORT_BY_UPDOOTS:
                this.loadSummaries(SORT_BY.UPDOOTS, {})
                break

            default:
                console.log("No tab found.")
        }
    }

    onCustomSearch(){
        const {
            customSearch: {
                authorInput,
                channelNameInput,
                videoTitleInput
            }
        } = this.state;
        
        const customSearchParams = {
            authorName: authorInput,
            videoSource: channelNameInput,
            videoTitle: videoTitleInput
        }
        
        this.loadSummaries({}, customSearchParams);
    }

    loadSummaries(sortByParams, customSearchParams){
        this.setState({
            isLoading: true
        })

        this.props.getSummaries(sortByParams, customSearchParams)
            .then(() => {
                this.setState({
                    isLoading: false
                })
            });
    }
}

function mapStateToProps(state){
    return {
        summaries: state.summaries,
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps, { getSummaries, switchUpdootOnSummary })(Community);
