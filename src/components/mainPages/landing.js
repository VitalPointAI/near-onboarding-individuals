import React, { useState } from 'react'
import personaTitle from '../../img/personas-title.png'
import { Link } from 'react-router-dom'
import { login } from '../../state/near'

// Material UI Components
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite'
import { List, ListItem } from '@mui/material'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      },
    center: {
        textAlign: 'center',
        fontWeight: 700,
        paddingTop: 30, 
        paddingBottom: 60, 
    },
    button: {
        width: '80%',
        fontSize: '40px',
        marginBottom: '20px'
    }
}));

const steps = [
    {
      label: 'Design Your Persona',
      description: `Create a specific persona for each NEAR account you own.
      By using a persona you design for an account, you have total control 
      over how much or little information you want to provide when interacting
      with a community. A rich web 3 profile for your NEAR account is only a 
      few minutes away.`,
    },
    {
      label: 'Find Work and Community',
      description:
        `Including skills and values in your persona allows NEAR Personas
        to provide you with recommendations for NEAR guilds you may want to 
        join that hold those same values or need those skills. That leads to
        opportunities for work, new friends, and a community focused on
        objectives that matter to you.`,
    },
    {
      label: 'Control Your Data',
      description: `You own your persona data. Like your NEAR account, your 
      NEAR account persona is 100% yours, protected by a seed phrase for your
      data stream. Your Persona will automatically change/update anywhere it is
      in use anytime you make a change to it here. Manage in one place and it 
      propagates everywhere.`,
    },
]

const Landing = (state) => {
    const classes = useStyles()
    const matches = useMediaQuery('(max-width:500px)')
    const [activeStep, setActiveStep] = useState(0)
  

    return(
    <>
      
    {!matches ?
            <Grid container justifyContent="center" alignItems="center" spacing={0}>
                
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center" style={{marginTop: '50px'}}>
                    <img src={personaTitle} style={{width: '75%', marginTop: '20px'}}/>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center" style={{marginBottom: '40px'}}>
                  <Typography variant="h5">Give your NEAR Account a Personality.</Typography>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Accordion style={{marginLeft: '10px', marginRight:'10px'}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography style={{fontSize: '1.4em'}}>{steps[0].label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography align="left">
                   {steps[0].description}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion style={{marginLeft: '10px', marginRight:'10px'}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography style={{fontSize: '1.4em'}}>{steps[1].label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography align="left">
                   {steps[1].description}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion style={{marginLeft: '10px', marginRight:'10px'}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography style={{fontSize: '1.4em'}}>{steps[2].label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography align="left">
                    {steps[2].description}
                    </Typography>
                </AccordionDetails>
                </Accordion>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={login}
                        style={{marginTop: '20px', marginBottom: '20px'}}
                    ><PlayCircleFilledWhiteIcon style={{marginRight: '5px'}}/>
                        <Typography variant="body1" style={{fontSize: '26px'}}>
                            Let's Go
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        :
            <Grid container justifyContent="center" alignItems="center" spacing={0} >
              
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center" style={{marginTop:'50px'}}>
                    <img src={personaTitle} style={{width: '75%', marginTop: '20px'}}/>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center"  style={{marginBottom: '40px'}}>
                  <Typography variant="h5">Give your NEAR Account a Personality.</Typography>
                </Grid>
        
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Accordion style={{marginLeft: '10px', marginRight:'10px'}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography style={{fontSize: '1.4em'}}>{steps[0].label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography align="left">
                   {steps[0].description}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion style={{marginLeft: '10px', marginRight:'10px'}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography style={{fontSize: '1.4em'}}>{steps[1].label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography align="left">
                   {steps[1].description}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion style={{marginLeft: '10px', marginRight:'10px'}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography style={{fontSize: '1.4em'}}>{steps[2].label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography align="left">
                    {steps[2].description}
                    </Typography>
                </AccordionDetails>
                </Accordion>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center" style={{marginTop: '15px'}}>
                  
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={login}
                        style={{marginTop: '20px', marginBottom: '20px'}}
                    ><PlayCircleFilledWhiteIcon style={{marginRight: '5px'}}/>
                        <Typography variant="body1" style={{fontSize: '26px'}}>
                            Let's Go
                        </Typography>
                    </Button>
                    
                </Grid>
            </Grid>
    }
    </>
    )
}

export default Landing