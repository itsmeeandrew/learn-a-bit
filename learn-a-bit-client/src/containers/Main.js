import React from "react";

import { Route, Switch, withRouter } from "react-router";
import { connect } from "react-redux";

import { authUser, signUpUser } from "../store/actions/auth";
import { addError, removeError } from "../store/actions/errors";

import Homepage from "../components/Homepage";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const Main = (props) => {
    const { authUser, signUpUser, errors, addError, removeError } = props;
    
    return (
        <Switch>
            <Route 
                exact path="/" 
                component={Homepage}
            />
            <Route 
                exact path="/signup" 
                render={(props) => {
                    return (
                        <SignupForm
                            {...props}
                            onSignUp={signUpUser}
                            errors={errors}
                            addError={addError}
                            removeError={removeError}
                        />
                    )
                }} 
            />
            <Route 
                exact path="/signin" 
                render={(props) => {
                    return (
                        <LoginForm 
                            {...props} 
                            onAuth={authUser} 
                            errors={errors}
                            removeError={removeError}
                        />
                    )
                }}
            />
        </Switch>
    );
};

function mapStateToProps(state){
    return {
        errors: state.errors
    }
}

export default withRouter(
    connect(mapStateToProps, 
        { 
            authUser, 
            signUpUser,
            addError,
            removeError
        }
    )(Main)
);
