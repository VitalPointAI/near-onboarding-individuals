import React, { useState, useEffect, useContext } from 'react'
import { appStore, onAppMount } from '../../state/app'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import FileUpload from '../common/IPFSUpload/fileUpload'
import { IPFS_PROVIDER } from '../../utils/ceramic' 
import { config } from '../../state/config'
import { formatDate } from '../../state/near'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { EditorState, convertFromRaw, convertToRaw, ContentState } from 'draft-js'
import { Editor } from "react-draft-wysiwyg"

// Material UI components
import { makeStyles } from '@mui/styles'
import InfoIcon from '@mui/icons-material/Info'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import LinearProgress from '@mui/material/LinearProgress'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Input from '@mui/material/Input'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Rating from '@mui/material/Rating'
import FormHelperText from '@mui/material/FormHelperText'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EmailIcon from '@mui/icons-material/Email'
import RedditIcon from '@mui/icons-material/Reddit'
import TwitterIcon from '@mui/icons-material/Twitter'
import TelegramIcon from '@mui/icons-material/Telegram'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import Zoom from '@mui/material/Zoom'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Paper } from '@mui/material'

const axios = require('axios').default

const useStyles = makeStyles((theme) => ({
    progress: {
      width: '100%',
      '& > * + *': {
        marginTop: '10px',
      },
    },
    input: {
      minWidth: 100,
      maxWidth: 400,
    },
    square: {
      width: '175px',
      height: 'auto'
    },
    large: {
        width: '100px',
        height: '100px',
        textAlign: 'center'
    }, 
    formControl: {
      margin: '20px',
    },
    hide: {
      display: 'none'
    },
    waiting: {
      minWidth: '100%',
      minHeight: '100%',
      overflow: 'hidden',
      padding: '20px'
    }
    }));

const imageName = require('../../img/default-profile.png') // default no-image avatar
const discordIcon = require('../../img/discord-icon.png')

export const {
  FUNDING_DATA, FUNDING_DATA_BACKUP, ACCOUNT_LINKS, DAO_LINKS, GAS, SEED_PHRASE_LOCAL_COPY, FACTORY_DEPOSIT, DAO_FIRST_INIT, CURRENT_DAO, REDIRECT,
  NEW_PROPOSAL, NEW_SPONSOR, NEW_CANCEL, KEY_REDIRECT, OPPORTUNITY_REDIRECT, NEW_PROCESS, NEW_VOTE, NEW_DONATION, NEW_EXIT, NEW_RAGE, NEW_DELEGATION, NEW_REVOCATION,
  networkId, nodeUrl, walletUrl, nameSuffix, factorySuffix, explorerUrl,
  contractName, didRegistryContractName, factoryContractName
} = config

export default function EditProfileForm(props) {

    const [open, setOpen] = useState(true)
    const [finished, setFinished] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [date, setDate] = useState('')
    const [name, setName] = useState('')
    const [avatar, setAvatar] = useState(imageName)
    const [pfpAvatar, setPfpAvatar] = useState(imageName)
    const [shortBio, setShortBio] = useState('')
    const [email, setEmail] = useState('')
    const [discord, setDiscord] = useState('')
    const [reddit, setReddit] = useState('')
    const [twitter, setTwitter] = useState('')
    const [telegram, setTelegram] = useState('')
    const [birthdate, setBirthdate] = useState('')
    const [country, setCountry] = useState('')
    const [language, setLanguage] = useState([])
    const [skill, setSkill] = useState([])
    const [familiarity, setFamiliarity] = useState('0')
    const [intro, setIntro] = useState(EditorState.createEmpty())
    const [nftContract, setNftContract] = useState('')
    const [nftTokenId, setNftTokenId] = useState('')
   
    const [otherSkills, setOtherSkills] = useState([])
    const [notifications, setNotifications] = useState([])

    const [currentLikes, setCurrentLikes] = useState([])
    const [currentDisLikes, setCurrentDisLikes] = useState([])
    const [currentNeutrals, setCurrentNeutrals] = useState([])

    const [avatarLoaded, setAvatarLoaded] = useState(true)
    const [progress, setProgress] = useState(false)

    const [pfpAvatarLoaded, setPfpAvatarLoaded] = useState(true)
    const [pfpProgress, setPfpProgress] = useState(false)

    const [introLength, setIntroLength] = useState(0)

    const { state, dispatch, update } = useContext(appStore)

    const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
    const languages = ['Abkhazian','Afar','Afrikaans','Akan','Albanian','Amharic','Arabic','Aragonese','Armenian','Assamese','Avaric','Avestan','Aymara','Azerbaijani','Bambara','Bashkir','Basque','Belarusian','Bengali','Bihari languages','Bislama','Bosnian','Breton','Bulgarian','Burmese','Catalan, Valencian','Central Khmer','Chamorro','Chechen','Chichewa, Chewa, Nyanja','Chinese','Church Slavonic, Old Bulgarian, Old Church Slavonic','Chuvash','Cornish','Corsican','Cree','Croatian','Czech','Danish','Divehi, Dhivehi, Maldivian','Dutch, Flemish','Dzongkha','English','Esperanto','Estonian','Ewe','Faroese','Fijian','Finnish','French','Fulah','Gaelic, Scottish Gaelic','Galician','Ganda', 'Georgian','German','Gikuyu, Kikuyu','Greek (Modern)','Greenlandic, Kalaallisut','Guarani','Gujarati','Haitian, Haitian Creole','Hausa','Hebrew','Herero','Hindi','Hiri Motu','Hungarian','Icelandic','Ido','Igbo','Indonesian','Interlingua (International Auxiliary Language Association)','Interlingue','Inuktitut','Inupiaq','Irish','Italian','Japanese','Javanese','Kannada','Kanuri','Kashmiri','Kazakh','Kinyarwanda','Komi','Kongo','Korean','Kwanyama, Kuanyama','Kurdish','Kyrgyz','Lao','Latin','Latvian','Letzeburgesch, Luxembourgish','Limburgish, Limburgan, Limburger','Lingala','Lithuanian','Luba-Katanga','Macedonian','Malagasy','Malay','Malayalam','Maltese','Manx','Maori','Marathi','Marshallese','Moldovan, Moldavian, Romanian','Mongolian','Nauru','Navajo, Navaho','Northern Ndebele','Ndonga','Nepali','Northern Sami','Norwegian','Norwegian Bokm??l','Norwegian Nynorsk','Nuosu, Sichuan Yi','Occitan (post 1500)','Ojibwa','Oriya','Oromo','Ossetian, Ossetic','Pali','Panjabi, Punjabi','Pashto, Pushto','Persian','Polish','Portuguese','Quechua','Romansh','Rundi','Russian','Samoan','Sango','Sanskrit','Sardinian','Serbian','Shona','Sindhi','Sinhala, Sinhalese','Slovak','Slovenian','Somali','Sotho, Southern','South Ndebele','Spanish, Castilian','Sundanese','Swahili','Swati','Swedish','Tagalog','Tahitian','Tajik','Tamil','Tatar','Telugu','Thai','Tibetan','Tigrinya','Tonga (Tonga Islands)','Tsonga','Tswana','Turkish','Turkmen','Twi','Uighur,Uyghur','Ukrainian','Urdu','Uzbek','Venda','Vietnamese','Volap_k','Walloon','Welsh','Western Frisian','Wolof','Xhosa','Yiddish','Yoruba','Zhuang, Chuang','Zulu' ]
    
    const [skillSet, setSkillSet] = useState({})
    const [developerSkillSet, setDeveloperSkillSet] = useState({})

    const { register, handleSubmit, watch, errors, control, reset, setValue, getValues } = useForm()
    const {
      fields: personaValuesFields,
      append: personaValuesAppend,
      remove: personaValuesRemove} = useFieldArray({
     name: "personaValues",
     control
    })
    
    const {
      fields: personaSkillsFields,
      append: personaSkillsAppend,
      remove: personaSkillsRemove} = useFieldArray({
     name: "personaSkills",
     control
    })

    const {
      fields: personaSpecificSkillsFields,
      append: personaSpecificSkillsAppend,
      remove: personaSpecificSkillsRemove} = useFieldArray({
     name: "personaSpecificSkills",
     control
    })

    const {
      fields: personaInterestsFields,
      append: personaInterestsAppend,
      remove: personaInterestsRemove} = useFieldArray({
     name: "personaInterests",
     control
    })

    const {
      fields: personaLearnFields,
      append: personaLearnAppend,
      remove: personaLearnRemove} = useFieldArray({
     name: "personaLearn",
     control
    })

    const {
      fields: personaWorkFields,
      append: personaWorkAppend,
      remove: personaWorkRemove} = useFieldArray({
     name: "personaWork",
     control
    })

    const {
      fields: personaValidatorFields,
      append: personaValidatorAppend,
      remove: personaValidatorRemove} = useFieldArray({
     name: "personaValidators",
     control
    })

    const {
      fields: relatedAccountsFields,
      append: relatedAccountsAppend,
      remove: relatedAccountsRemove} = useFieldArray({
     name: "relatedAccounts",
     control
    })
    
    const personaInterests = watch('personaInterests', personaInterestsFields)
    const personaLearn = watch('personaLearn', personaLearnFields)
    const personaWork = watch('personaWork', personaWorkFields)
    const personaValues = watch('personaValues', personaValuesFields)
    const personaSkills = watch('personaSkills', personaSkillsFields)
    const personaSpecificSkills = watch('personaSpecificSkills', personaSpecificSkillsFields)
    const personaValidators = watch('personaValidators', personaValidatorFields)
    const relatedAccounts = watch('relatedAccounts', relatedAccountsFields)

    const {
        handleEditProfileClickState,
        curUserIdx,
        accountId,
        did
    } = props

    const {
      appIdx,
      isUpdated,
      account,
      near
    } = state
    
    const classes = useStyles()

    useEffect(() => {
      if(avatar != imageName && avatarLoaded){
        setProgress(false)
      }
      if(avatar != imageName && !avatarLoaded){
        setProgress(true)
      }
    }, [avatar, avatarLoaded]
    )

    useEffect(() => {
      if(pfpAvatar != imageName && pfpAvatarLoaded){
        setPfpProgress(false)
      }
      if(pfpAvatar != imageName && !pfpAvatarLoaded){
        setPfpProgress(true)
      }
    }, [pfpAvatar, pfpAvatarLoaded]
    )

    useEffect(() => {
      async function fetchNftData() {
        if(nftContract && nftTokenId && near){
          let data = await account.viewFunction(nftContract, 'nft_token', { token_id: nftTokenId })
          if(data.metadata.media.length == 46 && data.metadata.media.substr(0,2) == "Qm"){
            setPfpAvatar(`${IPFS_PROVIDER}/${data.metadata.media}`)
          }
          if(data.metadata.media.length == 59 && data.metadata.media.substr(0,4) == "bafy"){
            setPfpAvatar(`${IPFS_PROVIDER}/${data.metadata.media}`)
          }
          if(data.metadata.media.substr(0,4) == "http"){
            setPfpAvatar(data.metadata.media)
          }
        }
      }
      

      fetchNftData()
      .then((res) => {

      })

    }, [nftContract, nftTokenId])

    useEffect(() => {
        async function fetchData() {
          setLoaded(false)

           // Set Card Persona Idx       
           if(accountId && did){
          
              let result = await appIdx.get('profile', did)   
            console.log('result', result)
              if(result) {
                if(result.intro){
                  let contentBlock = htmlToDraft(result.intro)
                  if(contentBlock){
                      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                      const editorState = EditorState.createWithContent(contentState)
                      setIntro(editorState)
                  }
                } else {
                    setIntro(EditorState.createEmpty())
                }
                result.date ? setDate(result.date) : setDate('')
                result.avatar ? setAvatar(result.avatar) : setAvatar(imageName)
                result.shortBio ? setShortBio(result.shortBio) : setShortBio('')
                result.name ? setName(result.name) : setName('')
                result.email ? setEmail(result.email): setEmail('')
                result.discord ? setDiscord(result.discord): setDiscord('')
                result.twitter ? setTwitter(result.twitter): setTwitter('')
                result.telegram ? setTelegram(result.telegram): setTelegram('')
                result.birthdate ? setBirthdate(result.birthdate): setBirthdate('')
                result.country ? setCountry(result.country): setCountry('')
                result.language ? setLanguage(result.language): setLanguage([])
                result.skill ? setSkill(result.skill): setSkill([])
                result.familiarity? setFamiliarity(result.familiarity): setFamiliarity('0')
                result.notifications? setNotifications(result.notifications): setNotifications([])
                result.skillSet ? setSkillSet(result.skillSet) : setSkillSet({})
                result.developerSkillSet ? setDeveloperSkillSet(result.developerSkillSet) : setDeveloperSkillSet({})
                result.personaSkills? setValue('personaSkills', result.personaSkills): setValue('personaSkills', {name: ''})
                result.personaSpecificSkills? setValue('personaSpecificSkills', result.personaSpecificSkills): setValue('personaSpecificSkills', {name: ''})
                result.values && result.values.length > 0 ? setValue('personaValues', result.values) : null
                result.validators && result.validators.length > 0 ? setValue('personaValidators', result.validators) : null
                result.relatedAccounts && result.relatedAccounts.length > 0 ? setValue('relatedAccounts', result.relatedAccounts) : null
                result.interests && result.interests.length > 0 ? setValue('personaInterests', result.interests) : null
                result.learningGoals && result.learningGoals.length > 0 ? setValue('personaLearn', result.learningGoals) : null
                result.workDesires && result.workDesires.length > 0 ? setValue('personaWork', result.workDesires) : null
                result.likes ? setCurrentLikes(result.likes) : setCurrentLikes([])
                result.dislikes ? setCurrentDisLikes(result.dislikes) : setCurrentDisLikes([])
                result.neutrals ? setCurrentNeutrals(result.neutrals) : setCurrentNeutrals([])  
                result.nftContract ? setNftContract(result.nftContract) : setNftContract('')
                result.nftTokenId ? setNftTokenId(result.nftTokenId) : setNftTokenId('')
                result.profileNft ? setPfpAvatar(result.profileNft) : setPfpAvatar(imageName)
                
              }
              return true
           }
        }
       
        fetchData()
          .then((res) => {
            res ? setLoaded(true) : setLoaded(false)
          })

    },[accountId, did])

    function handleFileHash(hash) {  
      setAvatar(IPFS_PROVIDER + hash)
    }

    function handleAvatarLoaded(property){
      setAvatarLoaded(property)
    }

    function handlePfpAvatarLoaded(property){
      setPfpAvatarLoaded(property)
    }

    const handleClose = () => {
        handleEditProfileClickState(false)
        setOpen(false)
    }

    const handleNameChange = (event) => {
        let value = event.target.value;
        setName(value)
    }

    const handleEmailChange = (event) => {
       let value = event.target.value;
       setEmail(value)
    }

    const handleDiscordChange = (event) => {
      let value = event.target.value;
      setDiscord(value) 
    }

    const handleTelegramChange = (event) => {
      let value = event.target.value;
      setTelegram(value) 
    }

    const handleRedditChange = (event) => {
      let value = event.target.value;
      setReddit(value);
    }

    const handleIntroChange = (editorState) => {
      let size = editorState.getCurrentContent().getPlainText('').length
      setIntro(editorState)
      setIntroLength(size)
    }

    const handleCountryChange = (event) => {
      let value = event.target.value;
      setCountry(value);
    }

    const handleTwitterChange = (event) =>{
      let value = event.target.value;
      setTwitter(value); 
    }

    const handleBirthdateChange = (event) => {
      let value = event.target.value.toString() 
      setBirthdate(value); 
    }

    const handleLanguageChange = (event) => {
      let value = event.target.value
      setLanguage(value)
    }

    const handleNftContractChange = (event) => {
      let value = event.target.value
      setNftContract(value)
    }

    const handleNftTokenIdChange = (event) => {
      let value = event.target.value
      setNftTokenId(value)
    }
   
    const handleRatingChange = (event, newValue) => {
      if(newValue != null){
        setFamiliarity(newValue.toString())
      }
    }

    const handleSkillSetChange = (event) => {
      let newSkills = { ...skillSet, [event.target.name]: event.target.checked }
      setSkillSet(newSkills)
    }
  
    const handleDeveloperSkillSetChange = (event) => {
      let newSkills = { ...developerSkillSet, [event.target.name]: event.target.checked }
      setDeveloperSkillSet(newSkills)
    }
    
    const onSubmit = async (values) => {
        event.preventDefault();
        setFinished(false)
        let now = new Date().getTime()
       
        let formattedDate = formatDate(now)
        
        let record = {
            date: formattedDate,
            owner: state.accountId,
            name: name,
            avatar: avatar,
            shortBio: shortBio,
            email: email,
            discord: discord,
            twitter: twitter,
            telegram: telegram,
            reddit: reddit,
            birthdate: birthdate,
            country: country,
            language: language,
            intro: draftToHtml(convertToRaw(intro.getCurrentContent())),
            familiarity: familiarity,
            skillSet: skillSet,
            developerSkillSet: developerSkillSet,
            personaSkills: personaSkills,
            personaSpecificSkills: personaSpecificSkills,
            values: personaValues,
            learningGoals: personaLearn,
            workDesires: personaWork,
            interests: personaInterests,
            notifications: notifications,
            likes: currentLikes,
            dislikes: currentDisLikes,
            neutrals: currentNeutrals,
            nftContract: nftContract,
            nftTokenId: nftTokenId,
            profileNft: pfpAvatar,
            validators: personaValidators,
            relatedAccounts: relatedAccounts
        }
     
      try {
        let result = await curUserIdx.set('profile', record)
        setFinished(true)
        update('', { isUpdated: !isUpdated })
        window.location.assign('/')
        setOpen(false)
        handleClose()
      } catch (err) {
        console.log('error updating profile', err)
        setFinished(true)
        update('', { isUpdated: !isUpdated })
        setOpen(false)
        handleClose()
      }
  
      
    }

        return (
           
            <div>
       
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            { loaded ? (<>
              <DialogTitle id="form-dialog-title">Profile Data</DialogTitle>
              <DialogContent>
                  <DialogContentText style={{marginBottom: 10}}>
                  Provide as much detail as you'd like.
                  </DialogContentText>
                  <div>
                  <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <Typography variant="h6">Upload an Avatar</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2} style={{marginBottom: '5px'}}>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Avatar
                              alt={accountId}
                              src={avatar} 
                              className={avatarLoaded ? classes.square : classes.hide}
                              imgProps={{
                                onLoad:(e) => { handleAvatarLoaded(true) }
                              }}  
                            />
                            {progress ?
                              <CircularProgress />
                            : null }
                          </Grid>
                          <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                            <FileUpload handleFileHash={handleFileHash} handleAvatarLoaded={handleAvatarLoaded}/>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                  </Accordion>
                  <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                      >
                        <Typography variant="h6">Specify NFT Avatar</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2} style={{marginBottom: '5px'}}>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Avatar
                              alt={accountId}
                              src={pfpAvatar} 
                              className={pfpAvatarLoaded ? classes.square : classes.hide}
                              imgProps={{
                                onLoad:(e) => { handlePfpAvatarLoaded(true) }
                              }}  
                            />
                            {pfpProgress ?
                              <CircularProgress />
                            : null }
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                              autoFocus
                              margin="dense"
                              id="profile-nftcontract"
                              variant="outlined"
                              name="nftContract"
                              label="NFT Contract"
                              placeholder="x.paras.near"
                              value={nftContract}
                              onChange={handleNftContractChange}
                              inputRef={register({
                                  required: false                              
                              })}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                              autoFocus
                              margin="dense"
                              id="profile-nftcontract"
                              variant="outlined"
                              name="nftTokenId"
                              label="Token Id"
                              value={nftTokenId}
                              onChange={handleNftTokenIdChange}
                              inputRef={register({
                                  required: false                              
                              })}
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                  </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header"
                      >
                      <Typography variant="h6">General Information</Typography>
                      <Tooltip TransitionComponent={Zoom} title="Here you can add information to let people, and communities know some basic information about yourself.">
                             <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                      </Tooltip>
                      </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="profile-name"
                                variant="outlined"
                                name="name"
                                label="Name"
                                placeholder="Billy Jo Someone"
                                value={name}
                                onChange={handleNameChange}
                                inputRef={register({
                                    required: false                              
                                })}
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="profile-birthdate"
                                type = "date"
                                name="birthdate"
                                label="Birthdate"
                                value={birthdate}
                                onChange={handleBirthdateChange}
                                InputLabelProps={{shrink: true,}}
                                inputRef={register({
                                    required: false                              
                                })}
                              />
                            </Grid> 
                              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <FormControl className={classes.input}>
                                  <InputLabel id="country-label">Country</InputLabel>
                                  <Select
                                    className={classes.input}
                                    label = "Country"
                                    id = "profile-country"
                                    value = {country}
                                    onChange = {handleCountryChange}
                                    input={<Input />}
                                    >
                                    {countries.map((country) => (
                                      <MenuItem key={country} value={country}>
                                        {country}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <FormControl>
                                <InputLabel id="language-label">Languages</InputLabel>
                                <Select multiple
                                  className={classes.input}
                                  label = "Language"
                                  id = "profile-language"
                                  value = {language}
                                  onChange = {handleLanguageChange}
                                  input={<Input />}
                                  >
                                  {languages.map((language) => (
                                      <MenuItem key={language} value={language}>
                                        {language}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  <FormHelperText>Select the languages you are comfortable with.</FormHelperText>
                                </FormControl>
                              </Grid>
                              <Typography variant="h6" style={{marginTop: '15px', marginLeft:'5px', width:'100%'}}>Short Introduction</Typography><br></br>
                              <Typography variant="overline" style={{marginLeft:'5px'}}>{`${introLength}/2000`}</Typography>
                              <Paper style={{padding: '5px'}}>
                                  <Editor
                                  editorState={intro}
                                  toolbarClassName="toolbar-class"
                                  wrapperClassName="wrapper-class"
                                  editorClassName="editor-class"
                                  toolbar={{
                                      inline: { inDropdown: true },
                                      list: { inDropdown: true },
                                      textAlign: { inDropdown: true },
                                      link: { inDropdown: true },
                                      image: { inDropdown: true },
                                      history: { inDropdown: true },
                                    }}
                                  onEditorStateChange={handleIntroChange}
                                  editorStyle={{minHeight:'200px'}}
                                  inputRef={register({
                                    required: false,
                                    maxLength: 2000                             
                                  })}
                                  />
                              </Paper>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                  <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                  >
                  <Typography variant="h6">Skills and Values</Typography>
                  </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                     
                        
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container justifyContent="space-between" alignItems="flex-end" spacing={1}>
                        <Typography variant="body1" style={{fontSize: 'large', fontWeight:'400', marginTop: '10px', marginBottom:'10px'}}>Values</Typography>
                        {
                          personaValuesFields.map((field, index) => {
                           
                          return(
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={field.id}>
                            <TextField
                              
                              margin="dense"
                              id={`personaValues[${index}].name`}
                              variant="outlined"
                              name={`personaValues[${index}].name`}
                              defaultValue={field.name}
                              label="Values:"
                              InputProps={{
                                endAdornment: <div>
                                <Tooltip TransitionComponent={Zoom} title="Short name of value.">
                                    <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                                </Tooltip>
                                </div>
                              }}
                              inputRef={register({
                                  required: true                              
                              })}
                            />
                            {errors[`personaValues${index}.name`] && <p style={{color: 'red', fontSize:'80%'}}>You must provide a value name.</p>}
                            
                            <Button type="button" onClick={() => personaValuesRemove(index)} style={{float: 'right', marginLeft:'10px'}}>
                              <DeleteForeverIcon />
                            </Button>
                            </Grid>
                            
                          )
                        }) 
                        }
                        {!personaValuesFields || personaValuesFields.length == 0 ?
                          <Typography variant="body1" style={{marginLeft: '5px'}}>No values defined yet.</Typography>
                        : null }
                          <Button
                            type="button"
                            onClick={() => personaValuesAppend({name: ''})}
                            startIcon={<AddBoxIcon />}
                          >
                            Add Value
                          </Button>
                        </Grid>
                      </Grid>
                      <Divider variant="middle" style={{marginTop: '15px', marginBottom: '15px'}}/>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container justifyContent="space-between" alignItems="flex-end" spacing={1}>
                        <Typography variant="body1" style={{fontSize: 'large', fontWeight:'400', marginTop: '10px', marginBottom:'10px'}}>General Skills</Typography>
                        {
                          personaSkillsFields.map((field, index) => {
                          return(
                            
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={field.id}>
                            <TextField
                              
                              margin="dense"
                              id={`personaSkills[${index}].name`}
                              variant="outlined"
                              name={`personaSkills[${index}].name`}
                              defaultValue={field.name}
                              label="General Skill:"
                              InputProps={{
                                endAdornment: <div>
                                <Tooltip TransitionComponent={Zoom} title="Short name of skill.">
                                    <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                                </Tooltip>
                                </div>
                              }}
                              inputRef={register({
                                  required: true                              
                              })}
                            />
                            {errors[`personaSkills${index}.name`] && <p style={{color: 'red', fontSize:'80%'}}>You must provide a skill name.</p>}
                            
                            <Button type="button" onClick={() => personaSkillsRemove(index)} style={{float: 'right', marginLeft:'10px'}}>
                              <DeleteForeverIcon />
                            </Button>
                            </Grid>
                            
                          )
                        }) 
                        }
                        {!personaSkillsFields || personaSkillsFields.length == 0 ?
                          <Typography variant="body1" style={{marginLeft: '5px'}}>No values defined yet.</Typography>
                        : null }
                          <Button
                            type="button"
                            onClick={() => personaSkillsAppend({name: ''})}
                            startIcon={<AddBoxIcon />}
                          >
                            Add Value
                          </Button>
                        </Grid>
                      </Grid>
                      <Divider variant="middle" style={{marginTop: '15px', marginBottom: '15px'}}/>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container justifyContent="space-between" alignItems="flex-end" spacing={1}>
                        <Typography variant="body1" style={{fontSize: 'large', fontWeight:'400', marginTop: '10px', marginBottom:'10px'}}>Skills & Competencies</Typography>
                        {
                          personaSpecificSkillsFields.map((field, index) => {
                          return(
                            
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={field.id}>
                            <TextField
                              
                              margin="dense"
                              id={`personaSpecificSkills[${index}].name`}
                              variant="outlined"
                              name={`personaSpecificSkills[${index}].name`}
                              defaultValue={field.name}
                              label="Skill Name:"
                              InputProps={{
                                endAdornment: <div>
                                <Tooltip TransitionComponent={Zoom} title="Short name of skill.">
                                    <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                                </Tooltip>
                                </div>
                              }}
                              inputRef={register({
                                  required: true                              
                              })}
                            />
                            {errors[`personaSpecificSkills${index}.name`] && <p style={{color: 'red', fontSize:'80%'}}>You must provide a skill name.</p>}
                            
                            <Button type="button" onClick={() => personaSpecificSkillsRemove(index)} style={{float: 'right', marginLeft:'10px'}}>
                              <DeleteForeverIcon />
                            </Button>
                            </Grid>
                            
                          )
                        }) 
                        }
                        {!personaSpecificSkillsFields || personaSpecificSkillsFields.length == 0 ?
                          <Typography variant="body1" style={{marginLeft: '5px'}}>No additional general skills defined yet. Add them for better chance of being matched to opportunities.</Typography>
                        : null }
                          <Button
                            type="button"
                            onClick={() => personaSpecificSkillsAppend({name: ''})}
                            startIcon={<AddBoxIcon />}
                          >
                            Add Skill
                          </Button>
                        </Grid>
                      </Grid>
                      <Divider variant="middle" style={{marginTop: '15px', marginBottom: '15px'}}/>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography>Level of NEAR familiarity</Typography>
                            <Rating name="Familiarity" onChange={handleRatingChange} value={parseInt(familiarity)} />
                      </Grid>
                
                  </Grid>
                  </Grid>
                  </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel5bh-content"
                  id="panel5bh-header"
                >
                <Typography variant="h6">Interests and Goals</Typography>
                </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  
                      
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Grid container justifyContent="space-between" alignItems="flex-end" spacing={1}>
                      <Typography variant="body1" style={{fontSize: 'large', fontWeight:'400', marginTop: '10px', marginBottom:'10px'}}>Interests</Typography>
                      {
                        personaInterestsFields.map((field, index) => {
                        
                        return(
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={field.id}>
                          <TextField
                            
                            margin="dense"
                            id={`personaInterests[${index}].name`}
                            variant="outlined"
                            name={`personaInterests[${index}].name`}
                            defaultValue={field.name}
                            label="Interests:"
                            InputProps={{
                              endAdornment: <div>
                              <Tooltip TransitionComponent={Zoom} title="Short name of interest.">
                                  <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                              </Tooltip>
                              </div>
                            }}
                            inputRef={register({
                                required: true                              
                            })}
                          />
                          {errors[`personaInterests${index}.name`] && <p style={{color: 'red', fontSize:'80%'}}>You must provide an interest name.</p>}
                          
                          <Button type="button" onClick={() => personaInterestsRemove(index)} style={{float: 'right', marginLeft:'10px'}}>
                            <DeleteForeverIcon />
                          </Button>
                          </Grid>
                          
                        )
                      }) 
                      }
                      {!personaInterestsFields || personaInterestsFields.length == 0 ?
                        <Typography variant="body1" style={{marginLeft: '5px'}}>No interests defined yet.</Typography>
                      : null }
                        <Button
                          type="button"
                          onClick={() => personaInterestsAppend({name: ''})}
                          startIcon={<AddBoxIcon />}
                        >
                          Add Interest
                        </Button>
                      </Grid>
                    </Grid>
                    <Divider variant="middle" style={{marginTop: '15px', marginBottom: '15px'}}/>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Grid container justifyContent="space-between" alignItems="flex-end" spacing={1}>
                      <Typography variant="body1" style={{fontSize: 'large', fontWeight:'400', marginTop: '10px', marginBottom:'10px'}}>I Want to Learn</Typography>
                      {
                        personaLearnFields.map((field, index) => {
                        return(
                          
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={field.id}>
                          <TextField
                            
                            margin="dense"
                            id={`personaLearn[${index}].name`}
                            variant="outlined"
                            name={`personaLearn[${index}].name`}
                            defaultValue={field.name}
                            label="Learn:"
                            InputProps={{
                              endAdornment: <div>
                              <Tooltip TransitionComponent={Zoom} title="Short name of skill to learn.">
                                  <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                              </Tooltip>
                              </div>
                            }}
                            inputRef={register({
                                required: true                              
                            })}
                          />
                          {errors[`personaLearn${index}.name`] && <p style={{color: 'red', fontSize:'80%'}}>You must provide a skill name to learn.</p>}
                          
                          <Button type="button" onClick={() => personaLearnRemove(index)} style={{float: 'right', marginLeft:'10px'}}>
                            <DeleteForeverIcon />
                          </Button>
                          </Grid>
                          
                        )
                      }) 
                      }
                      {!personaLearnFields || personaLearnFields.length == 0 ?
                        <Typography variant="body1" style={{marginLeft: '5px'}}>No learning goals defined yet.</Typography>
                      : null }
                        <Button
                          type="button"
                          onClick={() => personaLearnAppend({name: ''})}
                          startIcon={<AddBoxIcon />}
                        >
                          Add Learning Goal
                        </Button>
                      </Grid>
                    </Grid>
                    <Divider variant="middle" style={{marginTop: '15px', marginBottom: '15px'}}/>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Grid container justifyContent="space-between" alignItems="flex-end" spacing={1}>
                      <Typography variant="body1" style={{fontSize: 'large', fontWeight:'400', marginTop: '10px', marginBottom:'10px'}}>Types of Work I Want</Typography>
                      {
                        personaWorkFields.map((field, index) => {
                        return(
                          
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={field.id}>
                          <TextField
                            
                            margin="dense"
                            id={`personaWork[${index}].name`}
                            variant="outlined"
                            name={`personaWork[${index}].name`}
                            defaultValue={field.name}
                            label="Work Type:"
                            InputProps={{
                              endAdornment: <div>
                              <Tooltip TransitionComponent={Zoom} title="Short name of work you want to do.">
                                  <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                              </Tooltip>
                              </div>
                            }}
                            inputRef={register({
                                required: true                              
                            })}
                          />
                          {errors[`personaWork${index}.name`] && <p style={{color: 'red', fontSize:'80%'}}>You must provide the name of work you want to do.</p>}
                          
                          <Button type="button" onClick={() => personaWorkRemove(index)} style={{float: 'right', marginLeft:'10px'}}>
                            <DeleteForeverIcon />
                          </Button>
                          </Grid>
                          
                        )
                      }) 
                      }
                      {!personaWorkFields || personaWorkFields.length == 0 ?
                        <Typography variant="body1" style={{marginLeft: '5px'}}>No work types defined yet. Add them for better chance of being matched to opportunities.</Typography>
                      : null }
                        <Button
                          type="button"
                          onClick={() => personaWorkAppend({name: ''})}
                          startIcon={<AddBoxIcon />}
                        >
                          Add Work Type
                        </Button>
                      </Grid>
                    </Grid>              
                </Grid>
                </Grid>
                </AccordionDetails>
            </Accordion>
                        
            <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel5bh-content"
                  id="panel5bh-header"
                >
                <Typography variant="h6">Staking Validators</Typography>
                </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  
                      
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container justifyContent="space-between" alignItems="flex-end" spacing={1}>
                        <Typography variant="body1" style={{fontSize: 'large', fontWeight:'400', marginTop: '10px', marginBottom:'10px'}}>Validators</Typography>
                        {
                          personaValidatorFields.map((field, index) => {
                          
                          return(
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={field.id}>
                            <TextField
                              
                              margin="dense"
                              id={`personaValidators[${index}].name`}
                              variant="outlined"
                              name={`personaValidators[${index}].name`}
                              defaultValue={field.name}
                              label="Validators:"
                              InputProps={{
                                endAdornment: <div>
                                <Tooltip TransitionComponent={Zoom} title="Validator contract Id -eg. epic.poolv1.near">
                                    <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                                </Tooltip>
                                </div>
                              }}
                              inputRef={register({
                                  required: true                              
                              })}
                            />
                            {errors[`personaValidators${index}.name`] && <p style={{color: 'red', fontSize:'80%'}}>You must provide a validator contract name.</p>}
                            
                            <Button type="button" onClick={() => personaValidatorRemove(index)} style={{float: 'right', marginLeft:'10px'}}>
                              <DeleteForeverIcon />
                            </Button>
                            </Grid>
                            
                          )
                        }) 
                        }
                        {!personaValidatorFields || personaValidatorFields.length == 0 ?
                          <Typography variant="body1" style={{marginLeft: '5px'}}>No validators defined yet.</Typography>
                        : null }
                          <Button
                            type="button"
                            onClick={() => personaValidatorAppend({name: ''})}
                            startIcon={<AddBoxIcon />}
                          >
                            Add Validator
                          </Button>
                        </Grid>
                      </Grid>
                      </Grid>
                   </Grid>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel5bh-content"
                  id="panel5bh-header"
                >
                <Typography variant="h6">Related Accounts</Typography>
                </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  
                      
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container justifyContent="space-between" alignItems="flex-end" spacing={1}>
                        <Typography variant="body1">Accounts you enter here will exclude them from capital gain/loss reports.</Typography><br></br>
                        <Typography variant="body1">Also used for shareholder notes payable/loans.</Typography><br></br>
                        <Typography variant="body1">64 digits or named account (e.g. bob.near)</Typography><br></br>
                        {
                          relatedAccountsFields.map((field, index) => {
                          
                          return(
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={field.id}>
                            <TextField
                              
                              margin="dense"
                              id={`relatedAccounts[${index}].name`}
                              variant="outlined"
                              name={`relatedAccounts[${index}].name`}
                              defaultValue={field.name}
                              label="Related Accounts:"
                              InputProps={{
                                endAdornment: <div>
                                <Tooltip TransitionComponent={Zoom} title="Account name-eg. bob.near">
                                    <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                                </Tooltip>
                                </div>
                              }}
                              inputRef={register({
                                  required: true                              
                              })}
                            />
                            {errors[`relatedAccounts${index}.name`] && <p style={{color: 'red', fontSize:'80%'}}>You must provide an account name.</p>}
                            
                            <Button type="button" onClick={() => relatedAccountsRemove(index)} style={{float: 'right', marginLeft:'10px'}}>
                              <DeleteForeverIcon />
                            </Button>
                            </Grid>
                            
                          )
                        }) 
                        }
                        {!relatedAccountsFields || relatedAccountsFields.length == 0 ?
                          <Typography variant="body1" style={{marginLeft: '5px'}}>No accounts defined yet.</Typography>
                        : null }
                          <Button
                            type="button"
                            onClick={() => relatedAccountsAppend({name: ''})}
                            startIcon={<AddBoxIcon />}
                          >
                            Add Account
                          </Button>
                        </Grid>
                      </Grid>
                      </Grid>
                   </Grid>
                </AccordionDetails>
            </Accordion>

                      <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel6bh-content"
                        id="panel6bh-header"
                      >
                      <Typography variant="h6">Accounts and Notifications</Typography>
                      <Tooltip TransitionComponent={Zoom} title="Here you can add some of your social media handles if you would like others to be able to find or contact you elsewhere.">
                        <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                      </Tooltip>
                      </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="profile-email"
                                variant="outlined"
                                name="email"
                                type="email"
                                label="Email"
                                placeholder="someone@someplace"
                                value={email}
                                onChange={handleEmailChange}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <EmailIcon />
                                    </InputAdornment>
                                  ),
                                }}
                                inputRef={register({
                                    required: false                              
                                })}
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="profile-discord"
                                variant="outlined"
                                name="discord"
                                label="Discord"
                                placeholder="someone#1234"
                                value={discord}
                                onChange={handleDiscordChange}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <img src={discordIcon} style={{width: '24px', height: 'auto'}}/>
                                    </InputAdornment>
                                  ),
                                }}
                                inputRef={register({
                                    required: false,
                                    pattern: /@?[^#@:]{2,32}#[0-9]{4}/              
                                })}
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="profile-twitter"
                                variant="outlined"
                                name="twitter"
                                label="Twitter (no @)"
                                placeholder="some_one"
                                value={twitter}
                                onChange={handleTwitterChange}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <TwitterIcon />
                                    </InputAdornment>
                                  ),
                                }}
                                inputRef={register({
                                    required: false,
                                    pattern: /^[a-z0-9_]{1,15}$/i                          
                                })}
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                              <TextField
                              
                              margin="dense"
                              id="profile-telegram"
                              variant="outlined"
                              name="telegram"
                              label="Telegram (no @)"
                              placeholder="some_one"
                              value={telegram}
                              onChange={handleTelegramChange}
                              InputProps={{
                                  startAdornment: (
                                  <InputAdornment position="start">
                                      <TelegramIcon />
                                  </InputAdornment>
                                  ),
                              }}
                              inputRef={register({
                                  required: false,
                                  pattern: /^[a-z0-9_]{1,15}$/i                         
                              })}
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="profile-reddit"
                                variant="outlined"
                                name="reddit"
                                label="Reddit"
                                placeholder="some user"
                                value={reddit}
                                onChange={handleRedditChange}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <RedditIcon />
                                    </InputAdornment>
                                  ),
                                }}
                                inputRef={register({
                                    required: false                              
                                })}
                              />
                            </Grid>
                          </Grid>

                        </AccordionDetails>
                      </Accordion>
                  </div>
              
                  <div>
               
                  </div>
                </DialogContent>
               
              {!finished ? <LinearProgress className={classes.progress} style={{marginBottom: '25px' }}/> : (
              <DialogActions>
              <Button onClick={handleSubmit(onSubmit)} color="primary" type="submit">
                  Submit Details
                </Button>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
              </DialogActions>)}
              <Divider style={{marginBottom: 10}}/>
              </>) : (
              <div className={classes.waiting}>
              <Grid container spacing={1} alignItems="center" justifyContent="center" >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                <CircularProgress/>  
                <Typography variant="h5" align="center">Loading Profile</Typography>
              </Grid>
              </Grid>
              </div>
              )}
            </Dialog>
           
          </div>
        
        )
}