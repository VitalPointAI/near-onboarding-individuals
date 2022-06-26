import React, { useState, useEffect, useContext } from 'react'
import { appStore, onAppMount } from '../../state/app'
import Social from '../common/Social/social'

// Material UI components
import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Rating from '@mui/material/Rating'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import VerifiedIcon from '@mui/icons-material/Verified'
import { Divider, LinearProgress } from '@mui/material'

// CSS Styles

const useStyles = makeStyles((theme) => ({
    progress: {
        display: 'flex',
        justifyContent: 'center',
        height: '200px',
        width: '200px',
        alignItems: 'center',
    },
    }));

const imageName = require('../../img/default-profile.png') // default no-image avatar
const logoName = require('../../img/default_logo.png') // default logo

export default function IndivProfile(props) {

    const [individual, setIndividual] = useState(false)
    const [guild, setGuild] = useState(false)

    const [open, setOpen] = useState(true)
    const [avatar, setAvatar] = useState(imageName)
    const [name, setName] = useState('')
    const [finished, setFinished] = useState(false)
    const [birthdate, setBirthdate] = useState('')
    const [country, setCountry] = useState('')
    const [language, setLanguage] = useState([])
    const [skill, setSkill] = useState([])
    const [familiarity, setFamiliarity] = useState('')
    const [skillSet, setSkillSet] = useState({})
    const [developerSkillSet, setDeveloperSkillSet] = useState({})
    const [personaSkillSet, setPersonaSkillSet] = useState([])
    const [personaValueSet, setPersonaValueSet] = useState([])
    const [personaValidators, setPersonaValidators] = useState([])
    const [relatedAccounts, setRelatedAccounts] = useState([])
    const [personaSpecificSkillSet, setPersonaSpecificSkillSet] = useState([])
    const [interests, setInterests] = useState([])
    const [learningGoals, setLearningGoals] = useState([])
    const [workDesires, setWorkDesires] = useState([])
    const [personId, setPersonId] = useState()
    const [intro, setIntro] = useState('')
    const [date, setDate] = useState('')
    const [email, setEmail] = useState('')
    const [website, setWebsite] = useState('')
    const [telegram, setTelegram] = useState('')
    const [twitter, setTwitter] = useState('')
    const [reddit, setReddit] = useState('')
    const [discord, setDiscord] = useState('')
    const [pfpAvatar, setPfpAvatar] = useState(imageName)
    const [nftContract, setNftContract] = useState('')
    const [nftTokenId, setNftTokenId] = useState('')

    const classes = useStyles()

    const { state, dispatch, update } = useContext(appStore)

    const {
      isUpdated,
      curUserIdx,
      appIdx,
      near,
      did,
      accountId,
      accountType,
      verificationStatus
    } = state

    const {
      indivDid
    }= props

    
    
    useEffect(
        () => {
 
          async function fetchData() {
            if(isUpdated){}
            if(indivDid && appIdx){
              let result = await appIdx.get('profile', indivDid)
              console.log('result', result)
              if(result) {
                  setIndividual(true)
                  result.avatar ? setAvatar(result.avatar) : setAvatar(imageName)
                  result.name ? setName(result.name) : setName('')
                  result.email ? setEmail(result.email) : setEmail('')
                  result.discord? setDiscord(result.discord) : setDiscord('')
                  result.reddit ? setReddit(result.reddit) : setReddit('')
                  result.twitter ? setTwitter(result.twitter) : setTwitter('')
                  result.telegram ? setTelegram(result.telegram) : setTelegram('')
                  result.website ? setWebsite(result.website) : setWebsite('')
                  result.country ? setCountry(result.country) : setCountry('')
                  result.birthdate ? setBirthdate(result.birthdate) : setBirthdate('')
                  result.language ? setLanguage(result.language) : setLanguage([])
                  result.skill ? setSkill(result.skill) : setSkill([])
                  result.familiarity ? setFamiliarity(result.familiarity): setFamiliarity('')
                  result.skillSet ? setSkillSet(result.skillSet) : setSkillSet({})
                  result.developerSkillSet ? setDeveloperSkillSet(result.developerSkillSet) : setDeveloperSkillSet({})
                  result.personaSkills ? setPersonaSkillSet(result.personaSkills) : setPersonaSkillSet([])
                  result.personaSpecificSkills ? setPersonaSpecificSkillSet(result.personaSpecificSkills) : setPersonaSpecificSkillSet([])
                  result.values ? setPersonaValueSet(result.values) : setPersonaValueSet([])
                  result.validators ? setPersonaValidators(result.validators) : setPersonaValidators([])
                  result.relatedAccounts ? setRelatedAccounts(result.relatedAccounts) : setRelatedAccounts([])
                  result.interests ? setInterests(result.interests) : setInterests([])
                  result.learningGoals ? setLearningGoals(result.learningGoals) : setLearningGoals([])
                  result.workDesires ? setWorkDesires(result.workDesires) : setWorkDesires([])
                  result.owner ? setPersonId(result.owner) : null
                  result.intro ? setIntro(result.intro) : null
                  result.nftContract ? setNftContract(result.nftContract) : setNftContract('')
                  result.nftTokenId ? setNftTokenId(result.nftTokenId) : setNftTokenId('')
                  result.profileNft ? setPfpAvatar(result.profileNft) : setPfpAvatar(imageName)
                }
            } else {
              if(did && appIdx){
                  let result = await appIdx.get('profile', did)
                  console.log('result', result)
                      if(result) {
                        result.avatar ? setAvatar(result.avatar) : setAvatar(imageName)
                        result.name ? setName(result.name) : setName('')
                        result.email ? setEmail(result.email) : setEmail('')
                        result.discord? setDiscord(result.discord) : setDiscord('')
                        result.reddit ? setReddit(result.reddit) : setReddit('')
                        result.twitter ? setTwitter(result.twitter) : setTwitter('')
                        result.telegram ? setTelegram(result.telegram) : setTelegram('')
                        result.website ? setWebsite(result.website) : setWebsite('')
                        result.country ? setCountry(result.country) : setCountry('')
                        result.birthdate ? setBirthdate(result.birthdate) : setBirthdate('')
                        result.language ? setLanguage(result.language) : setLanguage([])
                        result.skill ? setSkill(result.skill) : setSkill([])
                        result.familiarity ? setFamiliarity(result.familiarity): setFamiliarity('')
                        result.skillSet ? setSkillSet(result.skillSet) : setSkillSet({})
                        result.developerSkillSet ? setDeveloperSkillSet(result.developerSkillSet) : setDeveloperSkillSet({})
                        result.personaSkills ? setPersonaSkillSet(result.personaSkills) : setPersonaSkillSet([])
                        result.personaSpecificSkills ? setPersonaSpecificSkillSet(result.personaSpecificSkills) : setPersonaSpecificSkillSet([])
                        result.values ? setPersonaValueSet(result.values) : setPersonaValueSet([])
                        result.validators ? setPersonaValidators(result.validators) : setPersonaValidators([])
                        result.relatedAccounts ? setRelatedAccounts(result.relatedAccounts) : setRelatedAccounts([])
                        result.interests ? setInterests(result.interests) : setInterests([])
                        result.learningGoals ? setLearningGoals(result.learningGoals) : setLearningGoals([])
                        result.workDesires ? setWorkDesires(result.workDesires) : setWorkDesires([])
                        result.owner ? setPersonId(result.owner) : null
                        result.intro ? setIntro(result.intro) : null
                        result.nftContract ? setNftContract(result.nftContract) : setNftContract('')
                        result.nftTokenId ? setNftTokenId(result.nftTokenId) : setNftTokenId('')
                        result.profileNft ? setPfpAvatar(result.profileNft) : setPfpAvatar(imageName)
                      }
              }
            }
          }

          fetchData()
            .then((res) => {
              setFinished(true)
            })
          
    }, [did, indivDid, appIdx, isUpdated]
    )

    const languages = language.map((item, i) => {
      if (i == language.length -1){
        item = item
      } else {
        item = item + ', '
      }
      return (
        <Typography key={i} variant="overline">{item}</Typography>
        ) 
      })

        return (
            <div>
     
            {finished ? (<>
              
                <Grid container justifyContent="space-evenly" spacing={1} style={{marginTop:'20px', padding:'10px'}}>
                  
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                        <Avatar src={pfpAvatar && pfpAvatar != imageName && pfpAvatar != '' ? pfpAvatar : avatar} style={{width:'150px', height:'auto', marginBottom:'10px'}}  />
                        <Typography variant="h5">
                            {name ? name : accountId}
                        </Typography>
                        
                        <Stack direction="row" spacing={1} justifyContent="center">
                            {accountType == 'individual' ? <Chip icon={<AppRegistrationIcon />} label="Registered" /> : <Chip icon={<AppRegistrationIcon />} label=" Not Registered" /> }
                            {verificationStatus ? <Chip icon={<VerifiedIcon />} label="Verified" variant="outlined" /> : null }
                        </Stack>
                        <Divider variant="middle" style={{marginTop: '15px', marginBottom:'15px'}}/>
                        <Social did={indivDid ? indivDid : did} type={accountType} appIdx={appIdx} style={{paddingLeft: '15px', paddingRight:'15px'}}/>
                        <Divider variant="middle" style={{marginTop: '15px', marginBottom:'15px'}}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                      <div dangerouslySetInnerHTML={{ __html: intro}}></div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                        <Typography variant="h6">General Information</Typography>
                        <TableContainer component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                            
                            </TableHead>
                            <TableBody>
                            {personId || accountId ? <TableRow key={personId ? personId : accountId}><TableCell>NEAR Account</TableCell><TableCell component="th" scope="row">{personId ? personId : accountId}</TableCell></TableRow> : null }       
                            {birthdate ? <TableRow key={birthdate}><TableCell>Birthday</TableCell><TableCell component="th" scope="row">{birthdate}</TableCell></TableRow> : null }
                            {country ? <TableRow key={country}><TableCell>Country</TableCell><TableCell component="th" scope="row">{country}</TableCell></TableRow> : null }
                            {language && language.length > 0 ? <TableRow key='language'><TableCell>Language</TableCell><TableCell component="th" scope="row">{language.map((item, i) => { return (<><Typography key={i} variant="overline">{item},</Typography> </>) })}</TableCell></TableRow>: null } 
                            </TableBody>
                        </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            <Typography variant="body1" color="primary">More</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Grid container spacing={1} justifyContent="center">
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Typography variant="h6">Values</Typography>
                                <TableContainer component={Paper}>
                                    <Table className={classes.table} size="small" aria-label="a dense table">
                                    <TableHead>
                                    
                                    </TableHead>
                                    <TableBody>
                                    {personaValueSet && personaValueSet.length > 0 ?
                                        personaValueSet.map((values, index) => {
                                        
                                            return (
                                            <TableRow key={values.name}>
                                                <TableCell>{values.name}</TableCell>
                                            </TableRow>
                                            )
                                        
                                    })
                                    : null
                                    }
                                             
                                    </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography variant="h6">General Skills</Typography>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                
                                </TableHead>
                                <TableBody>
                                
                                {skillSet ?
                                  Object.entries(skillSet).map(([key, value]) => {
                                      if(value){
                                      return(
                                          <TableRow key={key}>
                                          <TableCell>{key}</TableCell>
                                          </TableRow>
                                      )
                                      }
                                  })
                                  : null
                              }
                                {personaSkillSet && personaSkillSet.length > 0 ?
                                
                                    personaSkillSet.map((values, index) => {
                                        
                                        return (
                                            <TableRow key={values.name}>
                                            <TableCell>{values.name}</TableCell>
                                            </TableRow>
                                        )
                                    
                                    })
                                    : null
                                }
                                
                                </TableBody>
                                </Table>
                            </TableContainer>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography variant="h6">Specific Skills</Typography>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                
                                </TableHead>
                                <TableBody>
                                
                                {developerSkillSet ?
                                    Object.entries(developerSkillSet).map(([key, value]) => {
                                        if(value){
                                        return(
                                            
                                            <TableRow key={key}>
                                            <TableCell>{key}</TableCell>
                                            </TableRow>
                                            
                                        )
                                        }
                                    })
                                    : null
                                }
                                {personaSpecificSkillSet && personaSpecificSkillSet.length > 0 ?
                                
                                    personaSpecificSkillSet.map((values, index) => {
                                        
                                        return (
                                            <TableRow key={values.name}>
                                            <TableCell>{values.name}</TableCell>
                                            </TableRow>
                                        )
                                    
                                    })
                                    : null
                                }
                                
                                </TableBody>
                                </Table>
                            </TableContainer>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography variant="h6">Interests</Typography>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                
                                </TableHead>
                                <TableBody>
                                
                                {interests && interests.length > 0 ?
                                    interests.map((values, index) => { 
                                        return (
                                            <TableRow key={values.name}>
                                            <TableCell>{values.name}</TableCell>
                                            </TableRow>
                                        )
                                    })
                                    : null
                                }
                                
                                </TableBody>
                                </Table>
                            </TableContainer>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography variant="h6">Learning Goals</Typography>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                
                                </TableHead>
                                <TableBody>
                                
                                {learningGoals && learningGoals.length > 0 ?
                                    learningGoals.map((values, index) => { 
                                        return (
                                            <TableRow key={values.name}>
                                            <TableCell>{values.name}</TableCell>
                                            </TableRow>
                                        )
                                    })
                                    : null
                                }
                                
                                </TableBody>
                                </Table>
                            </TableContainer>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography variant="h6">Type of Work Desired</Typography>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                
                                </TableHead>
                                <TableBody>
                                
                                {workDesires && workDesires.length > 0 ?
                                    workDesires.map((values, index) => { 
                                        return (
                                            <TableRow key={values.name}>
                                            <TableCell>{values.name}</TableCell>
                                            </TableRow>
                                        )
                                    })
                                    : null
                                }
                                
                                </TableBody>
                                </Table>
                            </TableContainer>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography variant="overline">Level of NEAR familiarity: <Rating readOnly value={parseInt(familiarity)} /> </Typography>
                            </Grid>
                            </Grid>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            <Typography variant="body1" color="primary">Staking</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Grid container spacing={1} justifyContent="center">
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Typography variant="h6">Staking Validators</Typography>
                                <TableContainer component={Paper}>
                                    <Table className={classes.table} size="small" aria-label="a dense table">
                                    <TableHead>
                                    
                                    </TableHead>
                                    <TableBody>
                                    {personaValidators && personaValidators.length > 0 ?
                                        personaValidators.map((values, index) => {
                                        
                                            return (
                                            <TableRow key={values.name}>
                                                <TableCell>{values.name}</TableCell>
                                            </TableRow>
                                            )
                                        
                                    })
                                    : null
                                    }
                                             
                                    </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            </Grid>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            <Typography variant="body1" color="primary">Related Accounts</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Grid container spacing={1} justifyContent="center">
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Typography variant="h6">Related Accounts</Typography>
                                <Typography variant="body1">The accounts listed here will not be included in tax reports (assumed to be transfers between your accounts).</Typography>
                                <TableContainer component={Paper}>
                                    <Table className={classes.table} size="small" aria-label="a dense table">
                                    <TableHead>
                                    
                                    </TableHead>
                                    <TableBody>
                                    {relatedAccounts && relatedAccounts.length > 0 ?
                                        relatedAccounts.map((values, index) => {
                                        
                                            return (
                                            <TableRow key={values.name}>
                                                <TableCell>{values.name}</TableCell>
                                            </TableRow>
                                            )
                                        
                                    })
                                    : null
                                    }
                                             
                                    </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
              </Grid>
              </>)
              : (
                    <div className={classes.progress}>
                        <CircularProgress size={100} color="primary"  />
                   </div>
              )
        }
           
          </div>
        )
}