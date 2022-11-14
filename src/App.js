import React, { useState, useContext, useEffect } from 'react'
import { appStore, onAppMount } from './state/app'
import { get, set, del } from './utils/storage'
import { Route } from "react-router-dom"
import Header from './components/common/Header/header'
import Footer from './components/common/Footer/footer'
import RandomPhrase from './components/common/RandomPhrase/randomPhrase'
import NewKey from './components/mainPages/newKey'
import Choice from './components/mainPages/choice'
import IndivRegister from './components/mainPages/indivRegister'
import GuildRegister from './components/mainPages/guildRegister'
import IndivProfile from './components/Profiles/indivProfile'
import GuildProfile from './components/Profiles/guildProfile'
import Registration from './components/mainPages/registration'
import CreateIndivProfile from './components/mainPages/createIndividualProfile'
import CreateGuildProfile from './components/mainPages/createGuildProfile'
import ExploreGuilds from './components/mainPages/guilds'
import DisplayGuildProfile from './components/mainPages/displayGuildProfile'
import DisplayIndivProfile from './components/mainPages/displayIndivProfile'
import Admin from './components/mainPages/admin'
import Pledge from './components/mainPages/pledge'
import Announcements from './components/mainPages/announcements'
import Leaderboards from './components/mainPages/leaderboards'
import Rewards from './components/mainPages/rewards'
import Dashboard from './components/mainPages/dashboard'
import AccountInfo from './components/secondaryPages/AccountInfo/accountInfo'
import Opportunities from './components/secondaryPages/Opportunities/opportunities'
import { Home } from './components/mainPages/home'
import theme from './theme'
// Material-UI Components
import { makeStyles } from '@mui/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import {updateCurrentGuilds} from './state/near'
// helpers
export const btnClass = 'btn btn-sm btn-outline-primary mb-3 '
export const flexClass = 'd-flex justify-content-evenly align-items-center '
export const qs = (s) => document.querySelector(s)



const useStyles = makeStyles((theme) => ({
    root: {
	height: '88vh', 
        position: 'relative',
	overflowX: 'hidden',
	overflowY: 'hidden', 
    	backgroundColor: '#2e2e30'  
	   
    },
    centered: {
      width: '200px',
      height: '100px',
      textAlign: 'center',
      position: 'fixed',
      top: '50%',
      left: '50%',
      marginTop: '-100px',
      marginLeft: '-100px'
    },
    content: {
        maxWidth: '40%'
    },
    centeredPhrase: {
        maxWidth: '450px',
        height: '100px',
        textAlign: 'center',
        position: 'fixed',
        top: '50%',
        left: '50%',
        marginTop: '-80px',
        marginLeft: '-100px'
      },
    container: {
        maxWidth: '40%'
    },
    containerFull: {
        maxWidth: '100%'
    }
    }));

const App = () => {
    
    const { state, dispatch, update } = useContext(appStore)
    const classes = useStyles()
    const matches = useMediaQuery('(max-width:500px)')

	const [guildList, setGuildList] = useState([]);
    
	const onMount = () => {
        dispatch(onAppMount());
    };
    
    const {
        accountData, appIdx, funding, wallet, currentGuilds
    } = state

    useEffect(onMount, [guildList]);
    
	window.onerror = function (message, url, lineNo) {
        alert('Error: ' + message + 
       '\nUrl: ' + url + 
       '\nLine Number: ' + lineNo);
    return true;   
    }    
    
    function updateGuildList(newList){
		setGuildList(newList); 
	}

    let children = null

    if (!accountData || !wallet) {
        children = (<>
        <div className={classes.centered}><CircularProgress/><br></br>
            <Typography variant="h6">Setting Things Up...</Typography>
        </div>
        <div className={classes.centeredPhrase}>
            <RandomPhrase />
        </div></>)
    }

    // if (accountData) {
    //     children = <Receiver {...{ state, dispatch }} />
    // }

    // if (funding) {
    //     children = <div class="container container-custom">
    //         <h2>DO NOT CLOSE OR REFRESH THIS PAGE</h2>
    //         <h2>Creating Persona...</h2>
    //     </div>
    // }

    // if (wallet) {
    //     children = <PersonaPage {...{ state, dispatch, update }} />

    // }
    
    return(
	<ThemeProvider theme={theme}>
       
	<div className={classes.root}>
        
        <Header updateGuildList={updateGuildList} state={state}/>
        <Grid container alignItems="center" style={{height: '80vh', overflowY: 'scroll'}} justifyContent="center" >
            <Grid item align="center" className={`${!matches ? classes.container : classes.containerFull}`}>
        
            <Route exact path="/">
                <Home 
                    state={state}
                    >
                    { children }
                </Home>
            </Route>
            <Route exact path="/setup"> 
                <NewKey 
                    state={state}
                    >
                    { children }
                </NewKey>
            </Route>
            <Route exact path="/admin">
            <Admin
                state={state}
                >
                { children }
            </Admin>
            </Route>
            <Route exact path="/dashboard">
            <Dashboard
                state={state}
                >
                { children }
            </Dashboard>
            </Route>
            <Route exact path="/guilds">
                <ExploreGuilds 
                    state={state}
	    	    guilds={guildList}
                    guildCount={guildList.length}
	    		>
                    { children }
                </ExploreGuilds>
            </Route>
            <Route exact path="/leaderboards">
                <Leaderboards
                    state={state}
                    >
                    { children }
                </Leaderboards>
            </Route>
            <Route exact path="/rewards">
                <Rewards
                    state={state}
                    >
                    { children }
                </Rewards>
            </Route>
            <Route exact path="/pledge">
                <Pledge
                    state={state}
                    >
                    { children }
                </Pledge>
            </Route>
	    	<Route exact path="/opportunities">
	    		<Opportunities
					state={state}
	    			>
	    			{ children }
	    		</Opportunities>
	   		</Route>
            <Route exact path="/registration">
                <Registration
                    state={state}
                    >
                    { children }
                </Registration>
            </Route>
	    <Route exact path='/account-info'>
	    	<AccountInfo 
			state={state}
	    	>
	    		{ children }
	    	</AccountInfo>
	    </Route>
            <Route exact path="/register-individual">
                <IndivRegister
                    state={state}
                    >
                    { children }
                </IndivRegister>
            </Route>
            <Route exact path="/register-guild">
                <GuildRegister 
                    state={state}
                    >
                    { children }
                </GuildRegister>
            </Route>
            <Route exact path="/create-guild-profile">
                <CreateGuildProfile
                    state={state}
                    >
                    { children }
                </CreateGuildProfile>
            </Route>
            <Route exact path="/announcements">
                <Announcements
                    state={state}
                    >
                    { children }
                </Announcements>
            </Route>
            <Route exact path="/create-indiv-profile">
                <CreateIndivProfile
                    state={state}
                    >
                    { children }
                </CreateIndivProfile>
            </Route>
            <Route exact path="/indiv-profile">
                <IndivProfile 
                    state={state}
                    >
                    { children }
                </IndivProfile>
            </Route>
            <Route exact path="/guild-profile">
                <GuildProfile 
                    state={state}
                    >
                    { children }
                </GuildProfile>
            </Route>
            <Route path="/guild-profiles/:guildDid">
                <DisplayGuildProfile />
            </Route>
            <Route path="/indiv-profiles/:indivDid">
                <DisplayIndivProfile />
            </Route>
           </Grid>
        </Grid>
        
	</div>

        <Footer />
	</ThemeProvider>
    )
}

export default App
