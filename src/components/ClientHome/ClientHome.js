import React from 'react';
import {connect} from 'react-redux';
import ClientNav from './ClientNav';
import CreateWorkflow from '../AdminHome/CreateWorkflow/CreateWorkflow';
import ExistingProjects from '../AdminHome/ExistingProjects/ExistingProjects';
import ClientRisk from './ClientRisk';
import CurrentWorkflow from './CurrentWorkflow';
import UserProfile from '../UserProfile/UserProfile'

const ClientHome =(props)=>{


    return (
        <>
            <ClientNav />
            
            {props.reduxState.client.clientDisplay.displayProfile === true 
                ?
                <UserProfile 
                /> 
                :
                null
            }
            {props.reduxState.client.clientDisplay.displayNewWorkFlow === true 
                ?
                <CreateWorkflow 
                /> 
                :
            null
            }
            {props.reduxState.client.clientDisplay.displayOldWorkFlow === true 
                ?
                <ExistingProjects
                /> 
                :
                null
            }
            {props.reduxState.client.clientDisplay.displayRisk === true 
                ?
                <ClientRisk
                /> 
                :
                null
            }
            {props.reduxState.client.clientDisplay.displayCurrentWorkflow === true 
                ?
                <CurrentWorkflow
                /> 
                :
                null
            }
        </>
    );
}

const putReduxStateOnProps=(reduxState)=>({
    reduxState
  });
  
export default connect(putReduxStateOnProps)(ClientHome);
