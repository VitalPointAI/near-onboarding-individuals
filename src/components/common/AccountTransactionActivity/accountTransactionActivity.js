import React, { useState, useEffect, useContext } from 'react'
import { appStore } from '../../../state/app'
import { 
  formatDate,
  formatKoinlyDate,
  getPrice,
  buildPriceTable,
  buildTransactionTable,
  formatNearAmount,
  updateNearPriceAPI,
  allAccountActivity,
  updateNearTransactionAPI } from '../../../state/near'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { CSVLink, CSVDownload } from 'react-csv'
import Decimal from 'decimal.js'
const axios = require('axios').default

// Material UI components
import { makeStyles } from '@mui/styles'
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
import koinlyIcon from '../../../img/koinly-icon.png'
import quickenIcon from '../../../img/quicken-icon.png'
import { validators } from 'near-api-js'

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
    const [allActivity, setAllActivity] = useState([])
    const [currency, setCurrency] = useState('cad')
    const [csvSingleExport, setCsvSingleExport] = useState([])
    const [koinlyExport, setKoinlyExport] = useState([])
    const [csvToQuickenExport, setCsvToQuickenExport] = useState([])
    const [accountValidators, setAccountValidators] = useState([])
    const [relatedAccounts, setRelatedAccounts] = useState([])
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
    },[appIdx])

    useEffect(() => {
      async function fetchPersona(){
        if(appIdx){
          let accountPersona = await appIdx.get('profile', did)
          if(accountPersona && accountPersona.validators){
              setAccountValidators(accountPersona.validators)
          }
          if(accountPersona && accountPersona.relatedAccounts){
            setRelatedAccounts(accountPersona.relatedAccounts)
          }          
        }
      }

      fetchPersona()
      .then((res) => {

      })
    },[appIdx])

    // useEffect(() => {
    //   async function activityUpdate(){
    //     console.log('here activity')
    //     if(accountId){
    //       let update = await allAccountActivity(accountId)
    //       console.log('update', update)
    //       setAllActivity(update)
    //     }
    //   }

    //   activityUpdate()
    //   .then(() => {

    //   })
    // }, [accountId])

    // console.log('all Activity', allActivity)

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

    const koinlyDataHeaders = [
      {label: "Date", key: "Date"},
      {label: "Sent Amount", key: "SentAmount"},
      {label: "Sent Currency", key: "SentCurrency"},
      {label: "Received Amount", key: "ReceivedAmount"},
      {label: "Received Currency", key: "ReceivedCurrency"},
      {label: "Fee Amount", key: "FeeAmount"},
      {label: "Fee Currency", key: "FeeCurrency"},
      {label: "Net Worth Amount", key: "NetWorthAmount"},
      {label: "Net Worth Currency", key: "NetWorthCurrency"},
      {label: "Label", key: "Label"},
      {label: "Description", key: "Description"},
      {label: "TxHash", key: "TxHash"}
    ]

    const csvToQuickenDataHeaders = [
      {label: "date", key: "Date"},
      {label: "amount", key: "Amount"},
      {label: "price", key: "Price"},
      {label: "quantity", key: "Quantity"},
      {label: "full security name", key: "FullSecurityName"},
      {label: "investment action", key: "InvestmentAction"},
      {label: "commission", key: "Commission"},
      {label: "memo", key: "Memo"},
      {label: "name", key: "Name"},
      {label: "category", key: "Category"}
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

      let priceArray = await fetchPriceTable(fromDate, toDate, accountId)
     // let transactionArray = await fetchTransactionTable(fromDate, toDate, accountId, account, factoryContract, didRegistryContract)
      let transactionArray = await allAccountActivity(accountId)
      console.log('transaction array', transactionArray)
      
      let csvSingle = [] 
      let koinly = []
      let csvToQuicken = []

      let totalFees = 0
      
      setDownloadReady(false)
      setClicked(true)
               
      //let sortedArray = _.sortBy(transactionArray, 'block_timestamp')
      let sortedArray = _.sortBy(transactionArray, 'receipt_included_in_block_timestamp')
      console.log('sorted Array', sortedArray)    
      setActivity(sortedArray)                  
      setTransactionCount(sortedArray.length)

      for(let x = 0; x < sortedArray.length; x++){

        //let date = formatDate(sortedArray[x].transaction.block_timestamp/1000000)
        let date = formatDate(sortedArray[x].receipt_included_in_block_timestamp/1000000)
        console.log('datehere', date)

        //let koinlyDate = formatKoinlyDate(sortedArray[x].transaction.block_timestamp/1000000)
        let koinlyDate = formatKoinlyDate(sortedArray[x].receipt_included_in_block_timestamp/1000000)
        console.log('koinlydate', koinlyDate)

        let price= getPrice(priceArray, date, currency)
        console.log('this price', price)
        if(!price){
          price = 0
        }

        //console.log('blocktime here', sortedArray[x].transaction.block_timestamp)
        console.log('blocktime here', sortedArray[x].receipt_included_in_block_timestamp)

        let re = /,/gi
        // let fee = parseFloat(sortedArray[x].transaction.transaction_fee).toLocaleString('fullwide', {useGrouping: false})
        // let thisFeeFormatted = formatNearAmount(fee, 6)
        // let cleanFee = thisFeeFormatted.replace(re, '')

        //let value = parseFloat(sortedArray[x].transaction.deposit_value).toLocaleString('fullwide', {useGrouping: false})
        let valueFormatted
        let cleanValue
        if(sortedArray[x].args.deposit){
          let value = parseFloat(sortedArray[x].args.deposit).toLocaleString('fullwide', {useGrouping: false})
          console.log('value', value)
          valueFormatted = formatNearAmount(value, 6)
          cleanValue = valueFormatted.replace(re, '')
        } else {
          valueFormatted = '0'
          cleanValue = '0'
        }

        // let thisFee = (parseFloat(cleanFee) * price).toFixed(2)
        // totalFees = totalFees + parseFloat(thisFee)
        // setFeesPaid(totalFees.toFixed(2))

        let sent = ''
        let received = ''
        let name = ''
        // if(sortedArray[x].transaction.from == accountId){
        if(sortedArray[x].receipt_predecessor_account_id == accountId){
          sent = cleanValue
          received = ''
          name = sortedArray[x].receipt_receiver_account_id
        }
        //if(sortedArray[x].transaction.to == accountId){
        if(sortedArray[x].receipt_receiver_account_id == accountId){
          received = cleanValue
          sent = ''
          name = sortedArray[x].receipt_predecessor_account_id
        }

        let isValidator = false
        for(let i = 0; i < accountValidators.length; i++){
          console.log('accountValidators', accountValidators)
          if(sortedArray[x].receipt_predecessor_account_id == accountValidators[i].name){
            isValidator = true
            break
          }
        }

        let isRelated = false
        for(let j = 0; j < relatedAccounts.length; j++){
          console.log('relatedAccounts', relatedAccounts)
          if(sortedArray[x].receipt_predecessor_account_id == relatedAccounts[j].name
            || sortedArray[x].receipt_receiver_account_id == relatedAccounts[j].name){
            isRelated = true
            break
          }
        }

        let kind = sortedArray[x].action_kind
        if(kind == 'FUNCTION_CALL'){
          kind = sortedArray[x].args.method_name
        }

        let isSystem = false
        if(sortedArray[x].receipt_predecessor_account_id == 'system'){
            isSystem = true
        }
        

        let label = ''
        //switch(sortedArray[x].transaction.type){
        if(sortedArray[x].args.method_name == 'deposit_and_stake'){
          label = 'stake'
        }
        // switch(sortedArray[x].args.method_name){
        //   case 'deposit_and_stake':
        //     label = 'stake'
        //   default:
        //     label = ''
        // }
         console.log('label', label)

        // csvSingle.push({
        //   Date: date,
        //   TransactionType: sortedArray[x].transaction.type,
        //   Block: sortedArray[x].transaction.height,
        //   BlockHash: sortedArray[x].transaction.included_in_block_hash,
        //   From: sortedArray[x].transaction.from,
        //   To: sortedArray[x].transaction.to,
        //   Currency: currency.toUpperCase(),
        //   Quantity: cleanValue,
        //   Value: (parseFloat(cleanValue) * price).toFixed(2),
        //   Price: price,
        //   TransactionFee: thisFeeFormatted,
        //   TransactionFeeValue: (parseFloat(thisFeeFormatted) * price).toFixed(2)
        // })

        // koinly.push({
        //   Date: koinlyDate,
        //   SentAmount: sent,
        //   SentCurrency: 'NEAR',
        //   ReceivedAmount: received,
        //   ReceivedCurrency: 'NEAR',
        //   FeeAmount: thisFeeFormatted,
        //   FeeCurrency: 'NEAR',
        //   NetWorthAmount: '',
        //   NetWorthCurrency: '',
        //   Label: label,
        //   Description: `Block: ${sortedArray[x].transaction.height}, Quantity: ${cleanValue}`,
        //   TxHash: sortedArray[x].transaction.transaction_hash
        // })

        let amount = (parseFloat(cleanValue) * price).toFixed(2)
        console.log('amount', amount)
        if(label != 'stake' && !isValidator && !isSystem && !isRelated && amount != '0.00' && new Date(date).getTime() >= new Date(fromDate).getTime() && new Date(date).getTime() <= new Date(toDate).getTime()){
          csvToQuicken.push({
            Date: date,
            Amount: amount,
            Price: price,
            Quantity: cleanValue,
            FullSecurityName: 'NEAR',
            InvestmentAction: sortedArray[x].receipt_receiver_account_id == accountId ? 'BUY' : 'SELL',
            Commission: '',
            Memo: sortedArray[x].receipt_id, 
            Name: name,
            Category: kind
          })
        }

      }
              
      // setCsvSingleExport(csvSingle)
      // setKoinlyExport(koinly)
      setCsvToQuickenExport(csvToQuicken)
      setDownloadReady(true)
      return true
    }

  return (
            <Grid container alignItems="center" justifyContent="center" spacing={0} >
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="center" style={{marginBottom: '20px'}}>
                <Card>
                  <Typography variant="h6" align="center">Transactions</Typography>
                  <Typography variant="caption" align="center"></Typography>
                  <Typography variant="body1" align="center">{transactionCount}</Typography>
                </Card>
              </Grid>
            
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="center" style={{marginBottom: '20px'}}>
                <Card>
                  <Typography variant="h6" align="center">Fees Paid
                    <Tooltip TransitionComponent={Zoom} title="The total value of fees paid throughout the period based on NEAR price at time of transaction.">
                      <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                    </Tooltip>
                  </Typography>
                  <Typography variant="body1" align="center">${feesPaid}</Typography>
                </Card>
              </Grid>

              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="fromDate"
                  type = "date"
                  name="fromdate"
                  label="From"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  InputLabelProps={{shrink: true,}}
                  inputRef={register({
                      required: false                              
                  })}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="currency">Currency</InputLabel>
                  <Select
                    labelId="currency"
                    label="Currency"
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
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="toDate"
                  type = "date"
                  name="todate"
                  label="To"
                  value={toDate}
                  onChange={handleToDateChange}
                  InputLabelProps={{shrink: true,}}
                  inputRef={register({
                      required: false                              
                  })}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{marginTop: '20px'}}>
              
              {!downloadReady ?
                !clicked ?
                  <Button 
                    variant="outlined"
                    onClick={(e) => createExport(fromDate, toDate, accountId)}
                  >
                  Create CSV Export
                </Button>
                : <>
                  <Typography variant="body1">Preparing Data</Typography>
                  <Typography variant="caption" color="textSecondary">Powered by Nearblocks.io APIs</Typography>
                  <LinearProgress />
                  </>
                : <Grid container spacing={0} justifyContent="space-between" alignItems="center">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{marginTop:'20px'}} align="center">
                  <Typography variant="h6">
                    Downloads
                  </Typography>
                </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="center">
                    <CSVLink data={koinlyExport} filename={`${accountId.split('.')[0]}-activity-koinly.csv`} headers={koinlyDataHeaders}>
                      <img src={koinlyIcon} style={{width:'30px', height:'auto'}}/>
                      <Typography variant="body1" style={{marginTop: '-5px'}}>
                        Koinly
                      </Typography>
                    </CSVLink>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="center">
                    <CSVLink data={csvToQuickenExport} filename={`quicken-${accountId.split('.')[0]}-activity.csv`} headers={csvToQuickenDataHeaders}>
                      <img src={quickenIcon} style={{width:'30px', height:'auto'}}/>
                      <Typography variant="body1" style={{marginTop: '-5px'}}>
                        Quicken
                      </Typography>
                    </CSVLink>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="center">
                    <CSVLink data={csvSingleExport} filename={`${accountId.split('.')[0]}-activity.csv`} headers={transactionDataHeaders}>
                      <img src={csvIcon} style={{width:'30px', height:'auto'}}/>
                      <Typography variant="body1" style={{marginTop: '-5px'}}>
                        CSV
                      </Typography>
                    </CSVLink>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                    <Button 
                      variant="outlined"
                      onClick={handleReset}
                    >
                    Reset
                    </Button>
                  </Grid>
                </Grid>
              }
              </Grid>
            </Grid>
    )
}