import { createMuiTheme }  from '@material-ui/core/styles'

const theme = createMuiTheme({
	  palette: {
		type: "dark",
	  	primary:
		  {
			  main: '#c05b05',
			  light: '#fba051', 
			  dark: '#c85f04',
		  },
		background: {
			light: '#929090',
			dark: '#202023'
		}
	  },
	  
})

export default theme
