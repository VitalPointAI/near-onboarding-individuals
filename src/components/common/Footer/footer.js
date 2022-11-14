import React from 'react'
import { Link } from 'react-router-dom'
import ImageLoader from '../ImageLoader/imageLoader'
import projectLogo from '../../../img/footer-vpai.png'
import powered from '../../../img/powered-by.png'

//material ui imputs
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'
import {createTheme, ThemeProvider, styled} from '@mui/material/styles' 
import Toolbar from '@mui/material/Toolbar' 
import IconButton from '@mui/material/IconButton' 
import HomeIcon from '@mui/icons-material/Home'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PersonIcon from '@mui/icons-material/Person'
import SearchIcon from '@mui/icons-material/Search'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider' 
import Paper from '@mui/material/Paper' 
import { shadows } from '@mui/system';

const CustomFooter = styled(Stack)(({ theme }) => ({
	    height: theme.footer.height, 
	    backgroundColor: theme.footer.background,
		marginBottom: theme.footer.marginBottom
}))

const CustomSearchIcon = styled(SearchIcon)(({ theme }) => ({
		color: theme.footer.color 
}))
const CustomPersonIcon = styled(PersonIcon)(({ theme }) => ({
		color: theme.footer.color,
		margin: theme.icon.margin
}))
const CustomHomeIcon = styled(HomeIcon)(({ theme }) => ({
		color: theme.footer.color 
}))
const CustomEmojiEventsIcon = styled(EmojiEventsIcon)(({ theme }) => ({
		color: theme.footer.color
}))
const CustomTypography = styled(Typography)(({ theme }) => ({
		color: theme.footer.color,
		padding: theme.text.padding,
		fontSize: theme.text.fontSize
}))
const CustomIconButton = styled(IconButton)(({theme}) => ({ 
		padding: theme.icon.padding,
		marginTop: theme.icon.marginTop,
		marginBottom: theme.icon.marginBottom 
}))
const theme = createTheme({
        footer: {
        	background: "#202023",
			marginBottom: 0, 
			height: '12vh',
			color: "#C05B05"
        },
		icon: { 
			padding: 0,
			marginTop: 10,
			marginBottom: 0, 
		},
		text: {
				padding: 0,
				marginBottom: 5,
				fontSize: '10px' 
		}
})

const Footer = ({}) => {
    const matches = useMediaQuery('(max-width:500px)')

    return (
    	<ThemeProvider theme={theme}>
		{ !matches ? 
			<CustomFooter direction='row' alignItems='center' justifyContent='space-evenly'>
        			<IconButton><HomeIcon /></IconButton>
					<IconButton><SearchIcon /></IconButton>
					<IconButton><EmojiEventsIcon /></IconButton>
					<IconButton><PersonIcon /></IconButton>	
			</CustomFooter>
        	:
			<CustomFooter direction='row' alignItems='center' justifyContent='space-evenly'>
       				<Stack>
						<CustomIconButton href='dashboard' ><CustomHomeIcon /></CustomIconButton>
						<CustomTypography variant='overline'>Home</CustomTypography>
					</Stack>
					<Stack>
						<CustomIconButton href='/guilds'><CustomSearchIcon  /></CustomIconButton>
						<CustomTypography variant='overline'>Explore</CustomTypography>
					</Stack>
					<Stack >
						<CustomIconButton href='/rewards' ><CustomEmojiEventsIcon /></CustomIconButton>
						<CustomTypography variant='overline'>Rewards</CustomTypography>
					</Stack>
					<Stack >
						<CustomIconButton href='/indiv-profiles'><CustomPersonIcon /></CustomIconButton>			
						<CustomTypography variant='overline' >Profile</CustomTypography>
					</Stack>
			</CustomFooter>
		}	
		</ThemeProvider>
    )
}

export default Footer
