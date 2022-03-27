import React, { useState, useEffect, useContext } from 'react'
import * as nearAPI from 'near-api-js'
import { Link } from 'react-router-dom'
import { appStore, onAppMount } from '../../../state/app'
import { ceramic } from '../../../utils/ceramic'
import { catalystDao } from '../../../utils/catalystDao'
import Purpose from '../Purpose/purpose'
import Social from '../../common/Social/social'
import { signalCounter, rootName } from '../../../state/near'


// Material UI Components
import { makeStyles, withStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import { LinearProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { Grid } from '@mui/material'
import { Typography } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import { Stack, Paper } from '@mui/material'
import { Badge, Chip } from '@mui/material'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import InfoIcon from '@mui/icons-material/Info'
import Tooltip from '@mui/material/Tooltip'
import CategoryIcon from '@mui/icons-material/Category'

const useStyles = makeStyles((theme) => ({
    pos: {
        marginTop: 0,
    },
    card: {
      minWidth: '200px',
      maxWidth: '200px',
      verticalAlign: 'middle',
      margin: '10px 10px 10px 10px',
      padding: '2px'
    },
    cardMobile: {
      minWidth: '100%',
      verticalAlign: 'middle',
      margin: '10px 10px 10px 10px',
      padding: '2px'
    },
    square: {
      float: 'left',
      marginRight: '10px',
      marginTop: '5px',
    }
  }));

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: '95%',
    fontSize: '12px',
    border: '1px solid #dadde9',
  },
}))(Tooltip)

const imageName = require('../../../img/default_logo.png') // default no-image avatar
const sortDown = require('../../../img/sortdown.png')
const sortUp = require('../../../img/sortup.png')
const heart = require('../../../img/heart.png')
const brokenHeart = require('../../../img/broken-heart.png')

export default function GuildCard(props) {

  const { state, dispatch, update } = useContext(appStore);

    const [date, setDate] = useState()
    const [name, setName] = useState('')
    const [logo, setLogo] = useState(imageName)
    const [purpose, setPurpose] = useState('')
    const [owner, setOwner] = useState('')
    const [editDaoClicked, setEditDaoClicked] = useState(false)
    const [purposeClicked, setPurposeClicked] = useState(false)
    const [claimed, setClaimed] = useState(false)
    const [curGuildIdx, setCurGuildIdx] = useState()
    const [display, setDisplay] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null)
    const [anchorE2, setAnchorE2] = useState(null)
    const [finished, setFinished] = useState(false)
    const [created, setCreated] = useState()
    const [detailsClicked, setDetailsClicked] = useState(false) 
    const [memberStatus, setMemberStatus] = useState() 
    const [memberIcon, setMemberIcon] = useState(<NotInterestedIcon />)
    const [verified, setVerified] = useState(false)
    const [daoPlatform, setDaoPlatform] = useState('')
    const [daoPlatformLink, setDaoPlatformLink] = useState('')
    const [guildDid, setGuildDid] = useState('')
    const [changeFinished, setChangeFinished] = useState(true)
    const [tier, setTier] = useState('0')
    const [skills, setSkills] = useState([])
    const [specificSkills, setSpecificSkills] = useState([])
    const [values, setValues] = useState([])
    const [teach, setTeach] = useState([])
    const [focus, setFocus] = useState([])
    const [projects, setProjects] = useState([])
    const [services, setServices] = useState([])

    const [profileExists, setProfileExists] = useState(false)
    const [valuePercentMatch, setValuePercentMatch] = useState(0)
    const [subjectMatch, setSubjectMatch] = useState(false)
    const [generalSkillsPercentMatch, setGeneralSkillsPercentMatch] = useState(0)
    const [specificSkillsPercentMatch, setSpecificSkillsPercentMatch] = useState(0)
    const [workPercentMatch, setWorkPercentMatch] = useState(0)
    const [overallMatch, setOverallMatch] = useState(0)

    const [currentLikes, setCurrentLikes] = useState([])
    const [currentDisLikes, setCurrentDisLikes] = useState([])
    const [currentNeutrals, setCurrentNeutrals] = useState([])

    const classes = useStyles();

    const { 
      summoner,
      contractId,
      status,
      makeSearchGuilds,
      did,
      category
   } = props
 
   const {
     accountId, 
     appIdx,
     isUpdated,
     near,
     didRegistryContract,
     factoryContract,
     admins,
     isVerifier,
     isAdmin
   } = state

    useEffect(
      () => {
      
      async function fetchData() {
        if(isUpdated){}

        let guildInfo = await appIdx.get('guildProfile', did)
        console.log('guildInfo', guildInfo)
        console.log('guild did', did)
        let thisDaoPlatform
        if(guildInfo && guildInfo.contractId){
          if(guildInfo.contractId.split('.')[1].substr(0,4)=='cdao'){
            thisDaoPlatform = 'Catalyst'
            setDaoPlatform(thisDaoPlatform)
            setDaoPlatformLink(`https://cdao.app/dao/${guildInfo.contractId}`)
          }
          if(guildInfo && guildInfo.contractId.split('.')[1].substr(0,7)=='sputnik'){
            thisDaoPlatform = 'Astro'
            setDaoPlatform(thisDaoPlatform)
            setDaoPlatformLink(`https://app.astrodao.com/dao/${guildInfo.contractId}`)
          }
        }
         
        // Get Member Status if using Catalyst
        if(contractId && thisDaoPlatform=='Catalyst'){
          let thisMemberStatus
          try{
            let contract = await catalystDao.initDaoContract(state.wallet.account(), contractId)
            thisMemberStatus = await contract.getMemberStatus({member: accountId})
            setMemberStatus(thisMemberStatus)
            memberStatus ? setMemberIcon(<CheckCircleIcon />) : setMemberIcon(<NotInterestedIcon />)
          } catch (err) {
              console.log('error retrieving member status', err)
          }
        }

        // Get Verification Status
        if(didRegistryContract){
          try{
            let verificationStatus = await didRegistryContract.getVerificationStatus({accountId: contractId})
            console.log('verification status', verificationStatus)
            if(verificationStatus != 'null'){
              setVerified(verificationStatus)
            }
          } catch (err) {
            console.log('error retrieving verification status', err)
          }
        }

        // Get Tier
        if(didRegistryContract){
          try{
            let tierStatus = await didRegistryContract.getTier({accountId: contractId})
            console.log('tierstatus', tierStatus)
            if(tierStatus != 'null'){
              setTier(tierStatus)
            }
          } catch (err) {
            console.log('error retrieving tier')
          }
        }

        // Get relevant profile info after finding DID
        if(near){
          let thisCurGuildIdx
          try{
            let guildAccount = new nearAPI.Account(near.connection, accountId)
            thisCurGuildIdx = await ceramic.getUserIdx(guildAccount, appIdx, near, didRegistryContract)
            setCurGuildIdx(thisCurGuildIdx)
          } catch (err) {
            console.log('problem getting curguildidx', err)
            return false
          }          
          if(thisCurGuildIdx){
            let thisGuildDid = await ceramic.getDid(contractId, factoryContract, didRegistryContract)
            setGuildDid(thisGuildDid)
            let result = await appIdx.get('guildProfile', thisGuildDid)
            console.log('result', result)
            if(result){
                  result.name != '' ? setName(result.name) : setName('')
                  result.date ? setDate(result.date) : setDate('')
                  result.logo !='' ? setLogo(result.logo) : setLogo(imageName)
                  result.purpose != '' ? setPurpose(result.purpose) : setPurpose('')
                  result.owner != '' ? setOwner(result.owner) : setOwner('')
                  result.status = memberStatus
                  result.skills ? setSkills(result.skills) : setSkills([])
                  result.specificSkills ? setSpecificSkills(result.specificSkills) : setSpecificSkills([])
                  result.teach ? setTeach(result.teach) : setTeach([])
                  result.focus ? setFocus(result.focus) : setFocus([])
                  result.projects ? setProjects(result.projects) : setProjects([])
                  result.values ? setValues(result.values) : setValues([])
                  result.services ? setServices(result.services) : setServices([])
                  result.likes ? setCurrentLikes(result.likes) : setCurrentLikes([])
                  result.dislikes ? setCurrentDisLikes(result.dislikes) : setCurrentDisLikes([])
                  result.neutrals ? setCurrentNeutrals(result.neutrals) : setCurrentNeutrals([])
            } else {
              setName('')
              setDate('')
              setLogo(imageName)
              setPurpose('')
              setOwner('')
            }
          }
        }
        
        return true
      }

      let mounted = true
        if(mounted){
        fetchData()
          .then((res) => {
            setFinished(true)
            makeSearchGuilds(res)
          })
        return () => mounted = false
        }

  }, [contractId, near, isUpdated]
  )

  useEffect(()=> {
    async function determineMatch(){
      let profile = await appIdx.get('profile', state.did)
      console.log('profile', profile)
      if(profile != null){
        setProfileExists(true)
      }
      if(profile && profile.values && values){
        let valueMatch = 0
        let valueTotal = profile.values ? profile.values.length : 0
        console.log('valueTotal', valueTotal)
        for(let x = 0; x < profile.values.length; x++){
          for(let i = 0; i < values.length; i++){

            console.log('profile value', profile.values[x].name.toLowerCase())
            console.log('value value', values[i].name.toLowerCase())
            if(profile.values[x].name.toLowerCase() == values[i].name.toLowerCase()){
              valueMatch ++
              console.log('valueMatch here', valueMatch)
            }
          }
        }
        let thisValuePercentMatch = Math.round((valueMatch/valueTotal * 100))
        setValuePercentMatch(thisValuePercentMatch)

        // Check if guild teaches what user wants to learn
        let thisSubjectMatch = false
        for(let y = 0; y < profile.learningGoals.length; y++){
          for(let z = 0; z < teach.length; z++){
            if(profile.learningGoals[y].name.toLowerCase() == teach[z].name.toLowerCase()){
              thisSubjectMatch = true
            }
          }
        }
        setSubjectMatch(thisSubjectMatch)

        // Check for general skills match
        let generalSkillsMatch = 0
        let generalSkillsTotal = profile.personaSkills.length
        for(let x = 0; x < profile.personaSkills.length; x++){
          for(let i = 0; i < skills.length; i++){
            if(profile.personaSkills[x].name.toLowerCase() == skills[i].name.toLowerCase()){
              generalSkillsMatch ++
            }
          }
        }
        let thisGeneralSkillsPercentMatch = Math.round((generalSkillsMatch/generalSkillsTotal * 100))
        setGeneralSkillsPercentMatch(thisGeneralSkillsPercentMatch)

         // Check for specific skills match
         let specificSkillsMatch = 0
         let specificSkillsTotal = profile.personaSkills.length
         for(let x = 0; x < profile.personaSkills.length; x++){
           for(let i = 0; i < skills.length; i++){
             if(profile.personaSkills[x].name.toLowerCase() == skills[i].name.toLowerCase()){
               specificSkillsMatch ++
             }
           }
         }
         let thisSpecificSkillsPercentMatch = Math.round((specificSkillsMatch/specificSkillsTotal * 100))
         setSpecificSkillsPercentMatch(thisSpecificSkillsPercentMatch)

          // Check for work/services match
          let workMatch = 0
          let workTotal = profile.workDesires.length
          for(let x = 0; x < profile.workDesires.length; x++){
            for(let i = 0; i < services.length; i++){
              if(profile.workDesires[x].name.toLowerCase() == services[i].name.toLowerCase()){
                workMatch ++
              }
            }
          }
          let thisWorkPercentMatch = Math.round((workMatch/workTotal * 100))
          setWorkPercentMatch(thisWorkPercentMatch)

          let overall = Math.round((thisValuePercentMatch + thisGeneralSkillsPercentMatch + thisSpecificSkillsPercentMatch + workMatch) / 4)
          setOverallMatch(overall)
      }

    }

    determineMatch()
    .then((res) => {

    })
  }, [values])

  function handleUpdate(property){
    setIsUpdated(property)
  }

  const handleEditDaoClick = () => {
    handleExpanded()
    handleEditDaoClickState(true)
  }
  const handleDetailsClick= () => {
    handleExpandedDetails()
    handleDetailsClickedState(true)
  }

  function handleDetailsClickedState(property){
    setDetailsClicked(property)
  }

  function handleEditDaoClickState(property){
    setEditDaoClicked(property)
  }

  const handlePurposeClick = () => {
    handleExpanded()
    handlePurposeClickState(true)
  }

  function handlePurposeClickState(property){
    setPurposeClicked(property)
  }

  function handleExpanded() {
    setAnchorEl(null)
  }

  function handleExpandedDetails(){
    setAnchorE2(null)
  }

  async function changeVerify(){
    setChangeFinished(false)
    try{
      await didRegistryContract.changeVerificationStatus(
        {
          accountId: contractId,
          verified: !verified
        }
      )
    } catch (err) {
      console.log('error changing verification status', err)
    }
  }

  async function handleSignal(sig, contractId){
    await signalCounter(sig, contractId, accountId, 'guild', near, appIdx, didRegistryContract, guildDid)
    update('', {isUpdated: !isUpdated})
  }
  
  function formatDate(timestamp) {
    let stringDate = timestamp.toString()
    let options = {year: 'numeric', month: 'long', day: 'numeric'}
    return new Date(parseInt(stringDate.slice(0,13))).toLocaleString('en-US', options)
  }

  async function handleTier(event){
    setChangeFinished(false)
    try{
      await didRegistryContract.changeTier({
        accountId: contractId,
        tier: event.target.value
      })
    } catch (err) {
      console.log('problem changing tier', err)
    }
  }

    return(
        <>
        {!display ? <LinearProgress /> : 
                    
          finished ? 
          (
            <>
            <ListItem alignItems="flex-start" style={{flexWrap:'wrap'}}>
            <Paper elevation={2} style={{padding: '5px'}}>
            <Grid container spacing={1} alignItems="center" justifyContent="space-between">
              
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                <Stack direction="row" spacing={1} justifyContent="space-evenly">
                {profileExists ? <>
                  <Typography variant="overline">V: {valuePercentMatch}%</Typography>
                  <Typography variant="overline">L: {subjectMatch ? 'yes' : 'no'}</Typography>
                  <Typography variant="overline">G: {generalSkillsPercentMatch}%</Typography>
                  <Typography variant="overline">S: {specificSkillsPercentMatch}%</Typography>
                  <Typography variant="overline">W: {workPercentMatch}%</Typography>
                  <Typography variant="h5">{overallMatch}%</Typography>
                  <HtmlTooltip
                    title={<>
                      <Typography variant="h5">Suitability Score</Typography>
                      <div><Typography variant="body1">
                      The higher the percentage score, the more suitable the guild is for you.<br></br>
                      V = Values<br></br>
                      L = Teaches what you want to learn<br></br>
                      G = General Skills<br></br>
                      S = Specific Skills<br></br>
                      W = Work Type
                      </Typography></div>
                      </>
                    }
                    placement="bottom-start"
                  >
                    <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                  </HtmlTooltip>
                  </>
                  : null
                }
                </Stack>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                  
                    <a href={`${rootName}/guild-profiles/${guildDid}`}>
                    <div style={{width: '100%', 
                      height: '100px',
                      backgroundImage: `url(${logo})`, 
                      backgroundSize: 'contain',
                      backgroundPosition: 'center', 
                      backgroundRepeat: 'no-repeat',
                      backgroundOrigin: 'content-box'
                      }}>
                    </div>
                    <Typography variant="h5">{name != '' ? name : contractId.split('.')[0]}</Typography>
                    </a>
                    <Stack direction="row" spacing={1} justifyContent="center" style={{marginTop:'5px'}}>
                    {verified ? 
                      <>
                      <Chip icon={
                          <VerifiedUserIcon />
                      } label="Verified"/>
                      <Chip icon={
                            <MilitaryTechIcon />
                      } label={`Tier ${tier}`}/>
                      </>
                    : <>
                    <Chip icon={
                          <GppMaybeIcon color="secondary"/>
                    } label="Not Verified"/>
                    <Chip icon={
                            <MilitaryTechIcon />
                    } label={`Tier ${tier}`}/>
                    </>
                    }
                   
                      <Badge badgeContent={currentLikes.length} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }} color="primary" max={9999999}>  
                        <img src={heart} style={{height: '30px'}} onClick={(e) => handleSignal('like', contractId)}/>
                      </Badge>
                      
                  </Stack>
                  
                </Grid>                     
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                  <Stack direction="row" spacing={1} justifyContent="space-between">  
                    {purpose ? (<Button variant="outlined" style={{textAlign: 'center', fontSize: '80%', marginTop:'5px'}} onClick={handlePurposeClick}>Purpose</Button>) : null}
                    {category != '' && category != 'undefined' && category ? <Chip icon={<CategoryIcon />} label={category} variant="outlined" style={{marginTop: '5px'}}/> : null}
                  </Stack>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <Social did={guildDid} type={'guild'} appIdx={appIdx} platform={daoPlatform} platformLink={daoPlatformLink}/>
              </Grid>
              {(isVerifier || isAdmin) && accountId != contractId ?
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                  <Stack direction="row" spacing={1} justifyContent="space-between" style={{backgroundColor:'#d7d7d757', padding: '5px'}}>
                  {changeFinished ? 
                    <FormControl>
                      <FormLabel id="demo-radio-buttons-group-label">Tier</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        defaultValue="0"
                        value={tier}
                        onChange={handleTier}
                      >
                        <FormControlLabel value="1" control={<Radio />} label="1" />
                        <FormControlLabel value="2" control={<Radio />} label="2" />
                        <FormControlLabel value="3" control={<Radio />} label="3" />
                        <FormControlLabel value="4" control={<Radio />} label="4" />
                      </RadioGroup>
                    </FormControl>
                    : <LinearProgress />
                  }
                  {changeFinished ? 
                    !verified ? 
                    <Button variant="outlined" style={{textAlign: 'center', marginTop:'20px'}} onClick={changeVerify}>
                      Verify
                    </Button> 
                    : <Button variant="outlined" style={{textAlign: 'center', marginTop:'20px'}} onClick={changeVerify}>
                        Unverify
                      </Button>
                  : <LinearProgress />
                  }
                    </Stack>
                </Grid>
              : null }          
            </Grid>
            </Paper>
            <Divider variant="middle" style={{marginTop: '15px', width:'100%', marginBottom: '15px'}}/>
            </ListItem>
            </>
            ) 
          : null
        }
       

          {purposeClicked ? <Purpose
            handlePurposeClickState={handlePurposeClickState}
            contractId={contractId}
            /> : null }
        </>
       
    )
}