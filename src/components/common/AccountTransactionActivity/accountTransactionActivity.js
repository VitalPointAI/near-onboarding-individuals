import React, { useState, useEffect, useContext } from 'react'
import { appStore } from '../../../state/app'
import { 
  formatDate, 
  getPrice,
  buildPriceTable,
  buildTransactionTable,
  formatNearAmount,
  updateNearPriceAPI,
  updateNearTransactionAPI } from '../../../state/near'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { CSVLink, CSVDownload } from 'react-csv'
import Decimal from 'decimal.js'
const axios = require('axios').default
import theme from '../../../theme'
// Material UI components
import { makeStyles } from '@mui/styles'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Input from '@mui/material/Input'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import Zoom from '@mui/material/Zoom'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'

import csvIcon from '../../../img/csv-icon.png'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    },    
  }));
  
export default function AccountTransactionActivity(props) {
   
    const [activity, setActivity] = useState([])
    const [currency, setCurrency] = useState('cad')
    const [csvSingleExport, setCsvSingleExport] = useState([])
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [transactionTable, setTransactionTable] = useState([])
    const [priceTable, setPriceTable] = useState([])
    const [cardTotalReward, setCardTotalReward] = useState('0')
    const [feesPaid, setFeesPaid] = useState('0')
    const [downloadReady, setDownloadReady] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [transactionCount, setTransactionCount] = useState(0)

    const currencies = [
      "aed",
      "ars",
      "aud",
      "bch",
      "bdt",
      "bhd",
      "bmd",
      "bnb",
      "brl",
      "btc",
      "cad",
      "chf",
      "clp",
      "cny",
      "czk",
      "dkk",
      "dot",
      "eos",
      "eth",
      "eur",
      "gbp",
      "hkd",
      "huf",
      "idr",
      "ils",
      "inr",
      "jpy",
      "krw",
      "kwd",
      "lkr",
      "ltc",
      "mmk",
      "mxn",
      "myr",
      "ngn",
      "nok",
      "nzd",
      "php",
      "pkr",
      "pln",
      "rub",
      "sar",
      "sek",
      "sgd",
      "thb",
      "try",
      "twd",
      "uah",
      "usd",
      "vef",
      "vnd",
      "xag",
      "xau",
      "xdr",
      "xlm",
      "xrp",
      "yfi",
      "zar",
      "bits",
      "link",
      "sats",
    ]

    const classes = useStyles()
    const { register, handleSubmit, watch, errors, control, reset, setValue, getValues } = useForm()
    const { state, dispatch, update } = useContext(appStore)

    const {
      accountId,
      account,
      appIdx,
      did,
      factoryContract,
      didRegistryContract
    } = state

    useEffect(() => {
      async function update(){
        if(appIdx){
          await updateNearPriceAPI(accountId, appIdx, didRegistryContract)
          await updateNearTransactionAPI(accountId, appIdx, factoryContract, didRegistryContract, account)
        }
      }

      update()
      .then(() => {

      })
    },[appIdx, clicked])
console.log('accountId', accountId)
    const transactionDataHeaders = [
      {label: "Date", key: "Date"},
      {label: "TransactionType", key: "TransactionType"},
      {label: "Block", key: "Block"},
      {label: "BlockHash", key: "BlockHash"},
      {label: "From", key: "From"},
      {label: "To", key: "To"},
      {label: "Currency", key: "Currency"},
      {label: "Quantity", key: "Quantity"},
      {label: "Value", key: "Value"},
      {label: "Price", key: "Price"},
      {label: "TransactionFee", key: "TransactionFee"},
      {label: "TransactionFeeValue", key: "TransactionFeeValue"}
    ]

    const handleCurrencyChange = (event) => {
      let value = event.target.value
      setCurrency(value)
    }

    const handleFromDateChange = (event) => {
      let value = event.target.value.toString() 
      setFromDate(value)
    }

    const handleToDateChange = (event) => {
      let value = event.target.value.toString() 
      setToDate(value)
    }

    const handleReset = (event) => {
      setClicked(false)
      setDownloadReady(false)
    }

    async function fetchPriceTable(fromDate, toDate, accountId){
      if(fromDate && toDate){
        let prices = await buildPriceTable(fromDate, toDate, accountId)
        console.log('prices', prices)
        setPriceTable(prices)
        return prices
      }
    }

    async function fetchTransactionTable(fromDate, toDate, accountId, account, factoryContract, didRegistryContract){
      if(fromDate && toDate){
        let transactions = await buildTransactionTable(fromDate, toDate, accountId, account, factoryContract, didRegistryContract, appIdx)
        setTransactionTable(transactions)
        return transactions
      }
    }

    async function createExport(fromDate, toDate, accountId){
      setDownloadReady(false)
      setClicked(true); 
      let priceArray = await fetchPriceTable(fromDate, toDate, accountId)
      let transactionArray = await fetchTransactionTable(fromDate, toDate, accountId, account, factoryContract, didRegistryContract)
      console.log('transaction array', transactionArray)
      
      let csvSingle = [] 

      let totalFees = 0
      
       
               
      let sortedArray = _.sortBy(transactionArray, 'block_timestamp')
      console.log('sorted Array', sortedArray)    
      setActivity(sortedArray)                  
      setTransactionCount(sortedArray.length)

      for(let x = 0; x < sortedArray.length; x++){

        let date = formatDate(sortedArray[x].transaction.block_timestamp/1000000)
        console.log('datehere', date)

        let price= getPrice(priceArray, date, currency)
        console.log('this price', price)
        if(!price){
          price = 0
        }

        console.log('blocktime here', sortedArray[x].transaction.block_timestamp)
        
        let re = /,/gi
        let fee = parseFloat(sortedArray[x].transaction.transaction_fee).toLocaleString('fullwide', {useGrouping: false})
        let thisFeeFormatted = formatNearAmount(fee, 6)
        let cleanFee = thisFeeFormatted.replace(re, '')

        let value = parseFloat(sortedArray[x].transaction.deposit_value).toLocaleString('fullwide', {useGrouping: false})
        let valueFormatted = formatNearAmount(value, 6)
        let cleanValue = valueFormatted.replace(re,'')

        let thisFee = (parseFloat(cleanFee) * price).toFixed(2)
        totalFees = totalFees + parseFloat(thisFee)
        setFeesPaid(totalFees.toFixed(2))

        csvSingle.push({
          Date: date,
          TransactionType: sortedArray[x].transaction.type,
          Block: sortedArray[x].transaction.height,
          BlockHash: sortedArray[x].transaction.included_in_block_hash,
          From: sortedArray[x].transaction.from,
          To: sortedArray[x].transaction.to,
          Currency: currency,
          Quantity: cleanValue,
          Value: (parseFloat(cleanValue) * price).toFixed(2),
          Price: price,
          TransactionFee: thisFeeFormatted,
          TransactionFeeValue: (parseFloat(thisFeeFormatted) * price).toFixed(2)
        })

      }
              
      setCsvSingleExport(csvSingle)
      setDownloadReady(true)
      return true
    }

  return (
            <Stack alignItems="center" spacing={1} >
	  		<Grid container spacing={2} direction='row' justifyContent='center' alignItems='center'>
                	<Grid item>	
	  			<Typography variant='overline' >Currency: </Typography>
	  		</Grid>
	  		<Grid item>
                  		<Select
                    		id = "currency"
                    		variant="contained"
                    		value = {currency}
                    		onChange = {handleCurrencyChange}
                    		input={<Input />}
                    		>
                    		{currencies.map((currency) => (
                      			<MenuItem key={currency} value={currency}>
                        			{currency}
                     			 </MenuItem>
                   		 ))}
                  		</Select>
	  		</Grid>
	  	</Grid>
		<Grid container sx={{marginLeft: '3px', marginRight: '5px'}} spacing={1} justifyContent='space-evenly' alignItems='center' direction="row">
	  		<Grid item xs={3}>
	  			<Typography variant='overline'>
	  				Start: 
	  			</Typography>
	  		</Grid>
			<Grid item xs={9}>
                		<TextField
                  			autoFocus
                  			margin="dense"
                  			id="fromDate"
                  			type = "date"
                  			name="fromdate"
                  			value={fromDate}
                  			onChange={handleFromDateChange}
                  			InputLabelProps={{shrink: true,}}
                  			inputRef={register({
                      				required: false,                              
                 		 	})}
                		/>
	  		</Grid>
	  	</Grid>
	  	<Grid container sx={{marginLeft: '5px', marginRight: '5px'}} spacing={1} justifyContent='space-evenly' alignItems='center' direction='row'>
	  		<Grid item xs={3}>
	  			<Typography 
	  			variant='overline'>End:&nbsp;&nbsp;&nbsp;   
	  			</Typography>
	  		</Grid>
	  		<Grid item xs={9}>
                		<TextField
                  			autoFocus
                  			margin="dense"
                  			id="toDate"
                  			type = "date"
                  			name="todate"
                  			value={toDate}
                  			onChange={handleToDateChange}
                  			InputLabelProps={{shrink: true}}
                  			inputRef={register({
                      			required: false                              
					})}
                		/>
	  		</Grid>
	      </Grid>
              
              {!downloadReady ?
                
                <Grid container sx={{padding: '10px'}} justifyContent='center' alignItems='center'>
		  	<Grid item>
		      		{!clicked?
		 		 <Button 
                    		  variant="outlined"
                  		  onClick={(e) => createExport(fromDate, toDate, accountId)}
                  		 >
                  			Generate Report
               			 </Button>:
				<>
				<LinearProgress sx={{marginTop: '10px'}}/>
				<Typography variant="body1">Preparing Data</Typography>
				<Typography variant="caption" color="textSecondary">Powered by Nearblocks.io APIs</Typography>
				</>
				}
			</Grid>
		</Grid>
                : 
		 <Stack justifyContent='center' alignItems='flex-start' sx={{marginTop: '5px', marginBottom: '5x'}}>
		 <Typography variant='h6' sx={{color: theme.palette.primary.main, margin: '5px'}}>Report:</Typography>
		 <Grid container spacing={0} justifyContent="space-between" alignItems="center">
                 <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
			
                  	<Typography variant="overline" align="center">Transactions</Typography>
                  	<Typography variant="body1" align="center">{transactionCount}</Typography>
                	
		 </Grid>
		 <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                 	<Typography variant="overline" align="center">Fees Paid
                  	</Typography>
                  	<Typography variant="body1" align="center">${feesPaid}</Typography>
		 </Grid>
		 <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{marginTop:'20px'}} align="center">
                  <Stack spacing={1}>
		  	<Typography variant="overline">
                    		Download full report:
                  	</Typography>
		   	 <CSVLink data={csvSingleExport} filename={`${accountId.split('.')[0]}-activity.csv`} headers={transactionDataHeaders}>	
		  	<Button variant='outlined'>Download CSV</Button>
		        </CSVLink>
                  	<Typography variant="overline" color="textSecondary">Powered by Nearblocks.io APIs</Typography>
                  </Stack>
		 </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6} xl={6} sx={{paddingTop: '10px', paddingBottom: '5px' }} align="left">
                    <Button 
                      variant="outlined"
                      onClick={handleReset}
                    >
                    Reset
                    </Button>
                  </Grid>
		  
                </Grid>
		</Stack>      
              }
            </Stack>
    )
}
