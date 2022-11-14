import React, {useEffect, useState, useContext, useRef} from 'react'
import OpportunityCard from '../../Cards/OpportunityCard/opportunityCard'
import { appStore, onAppMount } from '../../../state/app'
import { getStatus, getCombinedSkills } from '../../../state/near'
import { catalystDao } from '../../../utils/catalystDao'


//MATERIAL UI
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack' 

export default function Opportunities(props){
	const [oppsLoaded, setOppsLoaded] = useState(false)
	const [suitabilityScore, setSuitabilityScore] = useState()
	const [recommendationsLoaded, setRecommendationsLoaded] = useState(false)
	const [opportunityId, setOpportunityId] = useState()
	const [recommendations, setRecommendations] = useState([])
	
	const { state, dispatch, update } = useContext(appStore)

	const {
		accountId,
		account,
		currentGuilds,
		near,
		did,
		accountType,
		wallet,
		appIdx,
		didRegistryContract,
		factoryContract,
		isUpdated,
		currentActiveDaos
	 } = state

	useEffect(
	()=>{
		async function fetchData(){
		
			if(appIdx){
				//build list of opportunities for active daos
				let allOpportunities = []
				if(currentActiveDaos && currentActiveDaos.length > 0){
					for(x = 0; x < currentActiveDaos.length; x++){
						let singleDaoOpportunity
						try{
							singleDaoOpportunity = await appIdx.get("opportunities", currentActiveDaos[x].did)
							if(singleDaoOpportunity && Object.keys(singleDaoOpportunity).length > 0){
								let j = 0
								while(j < singleDaoOpportunity.opportunities.length){
									allOpportunities.push(singleDaoOpportunity.opportunities[j])
									j++; 
								}
							}
						}
						catch(err){
							console.log('error loading singledao opportunity', err)
						}
					}
				}
				console.log("Complete step 1")
				//retrieve current persona data

				let currentPersona 
				if(accountType != 'guild' && did){
					currentPersona = await appIdx.get('profile', did)
				}
				else{
					currentPersona = await appIdx.get('guildProfile', did)
				}

				//for each opportunity, compare skillset with persona skillset and add to reccomendations array if same
				//and calculate suitability
				
				let currentRecommendations = []
				let skillMatch
				let combinedOpportunitySkills = []
				let combinedPersonaSkills = getCombinedSkills(accountType, currentPersona)
				let j = 0
				while(j < allOpportunities.length){
					
					skillMatch = 0 
					for(const [key,value] of Object.entries(allOpportunities[j].desiredSkillSet)){
						if(value){
							combinedOpportunitySkills.push(key)

						}
					}
					if(allOpportunities && allOpportunities[j].opportunitySkills.length > 0){
						allOpportunities[j].opportunitySkills.map((values,index)=>{
							if(values.name){
								combinedOpportunitySkills.push(values.name)
							}
						})
					}
					let k = 0
					while(k < combinedOpportunitySkills.length){
						let n = 0
						while(n < combinedPersonaSkills.length){
							if(combinedPersonaSkills[n] == combinedOpportunitySkills[k]){
								skillMatch++ 
							}
							n++
						}
						k++
					}
					let asuitabilityScore = ((skillMatch / combinedOpportunitySkills.length)*100).toFixed(0)
					if(!asuitabilityScore){
						asuitabilityScore = 0
					}
					setSuitabilityScore(asuitabilityScore)

					let thisContract = await catalystDao.initDaoContract(account, allOpportunities[j].contractId)
					let propFlags
					//confirm proposal exists
					let exists
					console.log("here 1.9")
					try{
						console.log("ID", allOpportunities[j])
						let index = await thisContract.getProposal({proposalId: parseInt(allOpportunities[j].opportunityId)})
						if(index){
							exists = true
						}
						else{
							exists = false
						}
					}
					catch(err){
						console.log("error getting proposal", err)
						exists=false
					
					}
					console.log("here 2")
					if(exists){
						propFlags = await thisContract.getProposalFlags({proposalId: parseInt(allOpportunities[j].opportunityId)})

						let oppStatus = getStatus(propFlags)
						
						letContractDid
						for(let x = 0; x < currentActiveDaos.length;x++){
							if(currentActiveDaos[x].contractId == allOpportunities[j].contractId){
								contractDid = currentActiveDaos[x].did

							}

						}

						let result 
						if(contractDid){
							result = await appIdx.get('daoProfile', contractDid)
							console.log("result1", result)
						}
						if(result && oppStatus == 'Passed' && allOpportunities[j].budget > 0 

							&& Date.now() <= new Date(allOpportunities[j].deadline)){
								currentRecommendations.push({
									opportunity: allOpportunities[j],
									communuityLogo: result.logo,
									communityName: result.name,
									communityPurpose: result.purpose,
									baseReward: parseFloat(allOpportunities[j].reward),
									skillMatch: skillMatch,
									allSkills: combinedOpportunitySkills.length,
									communityDid: contractDid,
									status: oppStatus
								})
						}
					}
					j++
				}
				console.log("step 3 finit", allOpportunities)
				setRecommendations(currentRecommendations)
				setRecommendationsLoaded(true)
			}
		}
		let mounted = true
		if(mounted){
			fetchData()
			.then(res => {
				setOppsLoaded(true)
			})
			return () => {
				mounted=false
			}
		}
		
	}, [currentGuilds, did]		
	)

	return(
		<Stack spacing={2} sx={{marginTop: '20px', marginBottom: '40px'}}>
		{ recommendations && recommendations.length > 0 ?
			( recommendations.map((row, index) => {
				console.log("here in the retur", recommendations)
				console.log("row", row)
				return (
					<OpportunityCard
						
						opportunityId = {row.opportunity.opportunityId}
						permission = {row.opportunity.permission}
						creator={row.opportunity.proposer}
						created={row.opportunity.submitDate}
						title = {row.opportunity.title}
						details = {row.opportunity.details}
						projectName = {row.opportunity.projectName}
						category = {row.opportunity.category}
						skillMatch = {row.opportunity.skillMatch}
						allSkills = {row.opportunity.allSkills}
						suitabilityScore = {row.opportunity.suitabilityScore}
						passedContractId = {row.opportunity.contractId}
						deadline = {row.opportunity.deadline}
						budget = {row.opportunity.budget}
						opportunityStatus = {row.opportunity.status}
						status = {row.status}
						usd = {row.opportunity.usd}
						logo={row.communityLogo}
						name={row.communityName}
						communityDid = {row.communityDid}
					/>
				)
			}))
		: <CircularProgress /> }
		</Stack>
	)
}
