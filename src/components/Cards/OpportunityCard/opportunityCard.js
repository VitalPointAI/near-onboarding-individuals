import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { appStore, onAppMount } from '../../../state/app'
import { useParams } from 'react-router-dom'
import { get, set, del } from '../../../utils/storage'
import {OPPORTUNITY_NOTIFICATION, PROPOSAL_NOTIFICATION} from '../../../state/near' 
import { catalystDao } from '../../../utils/catalystDao'
import { getStatus, daoRootName } from '../../../state/near'
import { parseNearAmount, formatNearAmount } from 'near-api-js/lib/utils/format'
import theme from '../../../theme'
// Material UI Components
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { green, red } from '@mui/material/colors'
import DoneIcon from '@mui/icons-material/Done'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import BlockIcon from '@mui/icons-material/Block'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
import Stack from '@mui/material/Stack'
import InfoIcon from '@mui/icons-material/Info'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import Slider from '@mui/material/Slider'

const axios = require('axios').default


  const imageName = require('../../../img/default-profile.png') // default no-image avatar
  const logoName = require('../../../img/default_logo.png') // default no-logo image

export default function OpportunityCard(props) {

    const [applicantName, setApplicantName] = useState('')
    const [applicantAvatar, setApplicantAvatar] = useState(imageName)
    const [pfpApplicantAvatar, setPfpApplicantAvatar] = useState('')
    const [pfpProposerAvatar, setPfpProposerAvatar] = useState('')
    const [applicantLogo, setApplicantLogo] = useState(logoName)

    const [proposerLogo, setProposerLogo] = useState(logoName)
    const [proposerName, setProposerName] = useState('')
    const [proposerAvatar, setProposerAvatar] = useState(imageName)
    const [pfpProposerLogo, setPfpProposerLogo] = useState('')
    const [pfpApplicantLogo, setPfpApplicantLogo] = useState('')

    const [accountType, setAccountType] = useState('')

    const [date, setDate] = useState('')
   
    const [avatar, setAvatar] = useState(imageName)
    const [shortBio, setShortBio] = useState('')
    const [reward, setReward] = useState('Calculating...')
    
    const [communityName, setCommunityName] = useState('')
    
  
    const [contract, setContract] = useState()
    const [dateValid, setDateValid] = useState(false)
    const [dateLoaded, setDateLoaded] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [formattedTime, setFormattedTime] = useState('')
    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)

    const { state, dispatch, update } = useContext(appStore)
    const [progress, setProgress] = useState(0)

    const {
      didRegistryContract,
      near, 
      appIdx,
      accountId,
      wallet,
      deposit,
      daoFactory,
      isUpdated, 
      nearPrice,
      proposalDeposit
    } = state


    const {
      creator,
      created,
      curDaoIdx,
      memberStatus,
      status,
      updated,
      title,
      details,
      projectName,
      category,
      opportunityStatus,
      permission,
      opportunityId,
      skillMatch,
      allSkills,
      suitabilitySmaterial,
      passedContractId,
      deadline,
      budget,
      usd,
      logo,
      name,
      communityDid
    } = props

    useEffect(
      () => {
        let timer

        async function updateNearPrice() {
            try {
              let getNearPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd')
              update('', {nearPrice: getNearPrice.data.near.usd})
            } catch (err) {
              console.log('get near price issue', err)
            }
        }
  
        function stop() {
          if (timer) {
              clearInterval(timer)
              timer = 0
          }
        }

        timer = setInterval(updateNearPrice, 5000)
       
        return () => {
          
          stop()
        }

      }, []
    )

    useEffect(() => {
      async function fetchPrice() {
          if(usd > 0 && nearPrice > 0){
            let near = (usd / nearPrice).toFixed(3)
            let parse = parseNearAmount(near)
            let formatNear = formatNearAmount(parse, 3)
            setReward(formatNear)
          } 
          if(!nearPrice){
            setReward('Calculating ')
          }
          if((!usd || usd == 0) && nearPrice) {
            setReward('0')
          }
      }

      fetchPrice()
      
    }, [usd, nearPrice]
    )


    useEffect(() => {
      if(deadline){
        let timer = setInterval(function() {
          setDateLoaded(false)
          let splitDate = deadline.split("-")
          let countDownDate = new Date(splitDate[0], splitDate[1]-1, splitDate[2]).getTime()
          let now = new Date().getTime()
          let distance = countDownDate - now
          if(distance > 0){
            let thisDays = Math.floor(distance / (1000 * 60 * 60 * 24))
            let thisHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 *60 * 60))
            let thisMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            let thisSeconds = Math.floor((distance % (1000 * 60)) / 1000)
            if(thisDays && thisHours && thisMinutes && thisSeconds){
              setDays(thisDays)
              setHours(thisHours)
              setMinutes(thisMinutes)
              setSeconds(thisSeconds)
              setDateValid(true)
            }
          } else {
            setDays(0)
            setHours(0)
            setMinutes(0)
            setSeconds(0)
            setDateValid(false)
            clearInterval(timer)
          }
          setDateLoaded(true)
        }, 1000)
      } 
    }, [deadline])


    useEffect(
        () => {
          if(isUpdated){}
        async function fetchData() {
         
          let notificationFlag = get(OPPORTUNITY_NOTIFICATION, [])
          if(notificationFlag[0]){
            //open the proposal with the correct id
            if(opportunityId == notificationFlag[0].proposalId){
              del(OPPORTUNITY_NOTIFICATION)
              handleOpportunityProposalDetailsClick()
            }
          }          
        }

        let mounted = true
        if(mounted){
        fetchData()
          .then((res) => {
            
          })
        return() => mounted = false
        }
    }, [appIdx, isUpdated]
    )
    

    useEffect(() => {
      if(progress < parseInt(suitabilitySmaterial)){
        const timer = setInterval(() => {
          setProgress((prevProgress) => (prevProgress < parseInt(suitabilitySmaterial) ? prevProgress + 1 : prevProgress))
        }, 25)
        return () => {
          clearInterval(timer)
        }
      }
    }, [])

    useEffect(() => {
      async function fetchContract(){
        if(wallet && passedContractId){
        let thisContract = await catalystDao.initDaoContract(wallet.account(), passedContractId)
        setContract(thisContract)
        }
      }

      fetchContract()
      .then(() => {

      })
    }, [wallet, passedContractId])
    
   
    function formatDate(timestamp) {
      let stringDate = timestamp.toString()
      let options = {year: 'numeric', month: 'long', day: 'numeric'}
      return new Date(parseInt(stringDate.slice(0,13))).toLocaleString('en-US', options)
    }

     // Opportunity Proposal Functions

     const handleEditOpportunityProposalDetailsClick = () => {
      handleExpanded()
      handleEditOpportunityProposalDetailsClickState(true)
    }
  
    function handleEditOpportunityProposalDetailsClickState(property){
      setEditOpportunityProposalDetailsClicked(property)
    }

    const handleOpportunityProposalDetailsClick = () => {
      handleExpanded()
      handleOpportunityProposalDetailsClickState(true)
    }
  
    function handleOpportunityProposalDetailsClickState(property){
      setOpportunityProposalDetailsClicked(property)
    }

    // Member proposal functions

    const handleMemberProfileDisplayClick = () => {
      handleExpanded()
      handleMemberProfileDisplayClickState(true)
    }

    function handleMemberProfileDisplayClickState(property){
      setMemberProfileDisplayClicked(property)
    }
    
    const handleMemberProposalClick = () => {
      handleExpanded()
      handleMemberProposalClickState(true)
    }

    function handleMemberProposalClickState(property) {
      setMemberProposalClicked(property)
    }

    // Funding Proposal Acceptance Functions

    const handleFundingProposalClick = () => {
      handleExpanded()
      setFundingProposalClicked(true)
    }

    function handleFundingProposalClickState(property) {
      setFundingProposalClicked(property)
    }
    
    function handleExpanded() {
      setAnchorEl(null)
    }

    return(
        <ThemeProvider theme={theme}>
   
        <Card sx={{width: '230px', backgroundColor: theme.palette.background.dark}} raised={true}>
            <Stack>  
          <CardHeader
            title={
	      <Stack>
	      <Box>
                <Typography variant="overline">
                {dateValid ? 
                  dateLoaded ? 'Expires: ' + days+'d:'+hours+'h:'+minutes+'m:'+seconds
                : 'Calculating..'
                : 'Expired'
                }</Typography>
              </Box>
                <Button href= {daoRootName + `/opportunity/${passedContractId}/${communityDid}/${opportunityId}`}>
		    <Typography variant='h6'>{title}</Typography>	   
                </Button>
		 <Link to={daoRootName + `/dao/${passedContractId}`}>
              		<Typography sx={{color: theme.palette.primary.main}} variant="h6">
	    			{name ? name : passedContractId}
	    		</Typography>
		</Link>
	      </Stack>
            }
          />
          <CardContent>
            <Grid container alignItems="center" style={{marginTop: '-20px', display:'inherit'}}>
	     <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
              <Typography variant="h6" align="center">Reward</Typography>
              <Typography variant="h6" align="center">{reward} Ⓝ</Typography>
              <Typography variant="subtitle1" color="textSecondary" align="center">~${usd ? usd + ' USD': null}</Typography><br></br>
	    	<Stack spacing={1} direction='row' alignItems='center' justifyContent='center'>
	    		<Typography variant='overline'>0</Typography>
	    		<Slider
	    			disabled
	    			sx={{
					"& .MuiSlider-thumb": {height: '0px', width: '0px'},
					'& .MuiSlider-track': {color: theme.palette.primary.main} 
				}}
	    			defaultValue={40}
	    	 	/>
	    		<Typography variant='overline'>100</Typography>
              	</Stack>
	    </Grid>
              
            </Grid>
          {status == 'Passed' ? (
            memberStatus ? (
              dateValid ? (  
                budget > 0 ? (
                  opportunityStatus ? (
                    <a href={daoRootName + `/opportunity/${passedContractId}/${communityDid}/${opportunityId}`}>
                      <Button 
                        color="primary"
                        align="right"
                      >
                          Details
                      </Button>
                    </a>
                  ) : 
                    <>
                    <Button 
                      color="primary" 
                      disabled>
                        Inactive
                    </Button>
                    </>
                ) :
                    <>
                  <Button 
                    color="primary" 
                    disabled>
                      Out of Budget
                  </Button>
                  </>            
              ) :
                <>
                <Button 
                  color="primary" 
                  disabled>
                    Expired
                </Button>
                </>
            ) :
	     <Stack>
              <Button variant='outlined' href={`${daoRootName}/dao/${passedContractId}`} 
		  sx={{maxWidth: '230px', maxHeight: '35px', fontSize: '12px', color: theme.palette.primary.main}}
              >
                  Join Project to Accept
              </Button>
	     </Stack>
          ) : null }
           
            
          </CardContent>
	   </Stack>
        </Card>
          </ThemeProvider>
    )
}
