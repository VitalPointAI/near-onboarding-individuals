import React, { useState, useEffect, useContext } from 'react'
import { appStore, onAppMount } from '../../../state/app'
import AccountTransactionActivity from '../../common/AccountTransactionActivity/accountTransactionActivity'
//MATERIAL UI
import Paper from '@mui/material/Paper' 
import Typography from '@mui/material/Typography' 
import Stack from '@mui/material/Stack' 
import theme from '../../../theme'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import InsightsOutlinedIcon from '@mui/icons-material/Insights';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import CircularProgress from '@mui/material/CircularProgress';
const StyledPaper = styled(Paper)(({theme}) => ({
	backgroundColor: theme.palette.background.dark,
	padding: '15px',
	width: '230px',
	minHeight: '400px'
}))
export default function AccountInfo(props){
	const { state, dispatch, update } = useContext(appStore)

	const {
		accountId
	} = state

	return(
		<>
		{
		accountId ? 
		<Stack alignItems='center' justifyContent='center' spacing={2} sx={{marginTop: '30px', marginBottom: '50px'}}>
			<Typography variant='h5' sx={{fontWeight: 550, color: theme.palette.primary.main}}>
				Hello {accountId}.				
			</Typography>
			<StyledPaper sx={{marginBottom: '50px'}}>
				<Stack spacing={2} sx={{marginTop: '15px'}} justifyContent='center' alignItems='center'>
				<ContentPasteOutlinedIcon sx={{
					fontSize: '60px',
					color: theme.palette.primary.main,
					stroke: theme.palette.background.dark, 
					strokeWidth: 1}}/>
				<Typography variant='h6' sx={{color: theme.palette.primary.main}}>
					Generate Activity Report
				</Typography>
				<AccountTransactionActivity />
				</Stack>
			</StyledPaper>
		</Stack> : 
		<CircularProgress />
		}
		</>
	)
}
