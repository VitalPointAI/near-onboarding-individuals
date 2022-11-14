import React, {useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import { appStore, onAppMount } from '../../../state/app'
import LeftSideDrawer from '../LeftSideDrawer/leftSideDrawer'
import LoginButton from '../LogInButton/loginButton'
import LogoutButton from '../LogoutButton/logoutButton'
import {updateCurrentGuilds} from '../../../state/near'
import {ceramic} from '../../../utils/ceramic'
import AccountInfo from '../AccountInfo/accountInfo'
// Material UI
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import Stack from '@mui/material/Stack'
import { Typography } from '@mui/material'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import { TextField } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import theme from '../../../theme'
import IconButton from '@mui/material/IconButton'; 

const CustomGrid = styled(Grid)(({ theme })=>({
		backgroundColor: theme.palette.background.dark,
		height: '16vh'

}))
const CustomAccountInfo = styled(AccountInfo)(({ theme }) => ({
		maxHeight: '50px',
		maxWidth: '50px'
}))
const CustomTextField = styled(TextField)(({theme}) => ({
		maxWidth: '180px',	
		'.MuiOutlinedInput-root': {
			borderRadius: '25px'
		}
}))
	
const Header = ({ state, handleUpdate, updateGuildList }) => {
    const [guilds, setGuilds] = useState([])
    const [anchorEl, setAnchorEl] = useState(null);
    const { update } = useContext(appStore);

    const {
	currentGuilds,
        wallet,
        appIdx,
        isUpdated,
        accountId,
	page
    } = state

    
    useEffect(
        () => {
        async function fetchData(){
        	let theseGuilds = await updateCurrentGuilds(); 
		update('', {currentGuilds: theseGuilds})
		
		if(currentGuilds && appIdx){
		    sortedGuilds = _.sortBy(currentGuilds, 'registered').reverse()
                    console.log('sortedGuildsFromHeader', sortedGuilds)
		    for(let x = 0; x < sortedGuilds.length; x++){
                        let result = await appIdx.get('guildProfile', sortedGuilds[x].did)
                        console.log('result', result)
                        
			if(result){
                            let category, name
                            result.category ? category = result.category : category = ''
                            result.name ? name = result.name : name  = ''
			    let newObject = {...sortedGuilds[x], category: category, name: name}
                            sortedGuilds[x] = newObject
                        }
                    }
	            setGuilds(sortedGuilds)
                    console.log('sortedguilds after from header', sortedGuilds)
		    updateGuildList(sortedGuilds); 
    		 
		}
	}
        fetchData()
        .then((res) => {
        
        })
    }, [accountId, isUpdated, page])

    const matches = useMediaQuery('(max-width:500px)')

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        update('', {isUpdated: !isUpdated})
        setPopoverOpen(true)

    }

    const handleClose = () => {
        setAnchorEl(null);
        update('', {isUpdated: !isUpdated})
        setPopoverOpen(false)
    }
   const search = (searchTerm) => {
	titleArray = []
	 console.log('guildslist', guilds)
	for(var i in guilds){
		console.log("guild in list", guilds[i])
		titleArray.push(guilds[i].name)
	}
	console.log("titleArray", titleArray)
	const matches = titleArray.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
	console.log("matches,", matches)
	
	searchedGuilds = []
	for(i in matches){
		for(j in guilds){
			if(matches[i] == guilds[j].name){
				searchedGuilds.push(guilds[j])
			}
		}
	}
	updateGuildList(searchedGuilds) 

   }  

	return (
        <ThemeProvider theme={theme}>
        <CustomGrid sx={{boxShadow: 10}} container justifyContent="flex-end" alignItems="center" spacing={1} style={{paddingRight: '10px', paddingLeft: '10px', paddingBottom: '5px'}}>
            
            {wallet && wallet.signedIn ? 
                !matches ? (
                    <>
                    	<Grid item >
                    		<div style={{float:'left', marginTop: '15px'}}>
                        		<LeftSideDrawer
                        		state={state}    
                        		/>
                    		</div>
                    	</Grid>
			{
				page == 'guilds'? 
				<TextField>guilds</TextField>:<></>
			}
                    	<Grid item style={{minWidth: '100px'}}>
        	
            	            {wallet && !wallet.signedIn ? <LoginButton /> :  
                                	<CustomAccountInfo /> 
                        	}
                    	</Grid>
                    </>
                )
                : (
                    <>
			<Grid item>
			{
				page == 'guilds'? 
				<CustomTextField label='Search Guilds'i
				onChange={(e) => search(e.target.value)} 
				InputProps={{
					endAdornment: 
						 <InputAdornment position="end">
						 	<IconButton>
								 <SearchIcon />
							</IconButton>
						 </InputAdornment>
				}}
				/>:<></>
			}
			</Grid>
                    	<Grid item >
                        	{wallet && !wallet.signedIn ? <LoginButton /> :  
                                	<CustomAccountInfo /> 
                        	}
                    	</Grid>
                    </>
                )
            :  
            wallet && !wallet.signedIn ? 
                !matches ? (
                    <>
                    	<Grid item xs={4} style={{minWidth: '100px'}}>
                        	{wallet && !wallet.signedIn ? <LoginButton /> :   
                                	<CustomAccountInfo /> 
                        	}
                    	</Grid>
                    </>
                ) : (
                    <>
                    	<Grid item xs={4} style={{minWidth: '100px'}}>
                        	{wallet && !wallet.signedIn ? <LoginButton /> :  
					<CustomAccountInfo /> 
                        	}
                    	</Grid>
                    </>
                ) 
            : null
        }
            
        </CustomGrid>
        </ThemeProvider>

      
    )
}

export default Header
