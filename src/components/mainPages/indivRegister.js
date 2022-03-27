import React, { useState, useEffect, useContext } from 'react'
import { appStore, onAppMount } from '../../state/app'
import { ceramic } from '../../utils/ceramic'

// Material UI components
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import Divider from '@mui/material/Divider'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import StarsIcon from '@mui/icons-material/Stars'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    },
    spacing: {
        marginTop: '15px',
        marginBottom: '15px'
    },
  }));
  
export default function IndivRegister(props) {

    const classes = useStyles()

    const { state, dispatch, update } = useContext(appStore)

    const {
      didRegistryContract,
      accountId,
      did,
      accountType,
      pKey
    } = state

    useEffect(
        () => {
          let urlVariables = window.location.search
          const urlParameters = new URLSearchParams(urlVariables)
          let transactionHash = urlParameters.get('transactionHashes')
          accountType == 'individual' ? window.location.assign('/create-indiv-profile') : null
    }, [accountType]
    )

    async function register(type){
      if(did){
          let freeContract = await ceramic.useFundingAccount(accountId)
         
          try{
              await freeContract.contract.putDID({
                  accountId: accountId,
                  did: did,
                  type: type
              })
              update('', {accountType: type})
          } catch (err) {
          console.log('error registering', err)
          }
      }
      location.reload()
    }


    function handleNo(){
      window.location.assign('/create-indiv-profile')
    }
    
    return (
        <>
        <Grid container spacing={1} style={{padding: '10px'}}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography variant="h4" style={{marginTop:'40px', marginBottom: '40px'}}>To be found or not to be found?</Typography>
          <Typography variant="h6" style={{marginTop:'40px'}}>Decide if you want to register your persona.</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
          <List>
              <ListItem className={classes.spacing}>
                <ListItemIcon>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Showcases your persona and is the first step towards obtaining verified status."
                />
              </ListItem>
              <Divider variant="middle" />
              <ListItem className={classes.spacing}>
                <ListItemIcon>
                  <SupervisedUserCircleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Enables community and opportunity recommendations based on your skills and values."
                />
              </ListItem>
              <Divider variant="middle" />
              <ListItem className={classes.spacing}>
              <ListItemIcon>
                <StarsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Allows your persona to show up on leaderboards and be eligible for reputation based rewards."
              />
            </ListItem>
            <Divider variant="middle" />
          </List>
          <Grid container spacing={1} style={{padding: '10px'}}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
              <Button className={classes.spacing} style={{float: 'left', marginTop: '20px', marginRight: '15px'}} variant="contained" color="primary" onClick={(e) => register('individual')}>
                Register
              </Button>
              <Typography variant="body2" style={{marginTop: '30px'}}>
                You can unregister at any time.
              </Typography>
              <div style={{clear:'both'}} />
              <Button
                color="secondary"
                style={{marginTop: '20px'}}
                onClick={handleNo}
              >
                No Thanks
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
        </>
        
    )
}