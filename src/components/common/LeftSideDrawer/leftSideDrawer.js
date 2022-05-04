import React, { useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { appStore, onAppMount } from '../../../state/app'
import EditProfileForm from '../../EditProfile/editProfile'
import GoToGuilds from '../../Cards/GoToGuilds/goToGuilds'

// Material UI
import { makeStyles, useTheme } from '@mui/styles'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import EditIcon from '@mui/icons-material/Edit'
import ExploreIcon from '@mui/icons-material/Explore'
import useMediaQuery from '@mui/material/useMediaQuery'
import InfoIcon from '@mui/icons-material/Info'
import SchoolIcon from '@mui/icons-material/School'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'
import PieChartIcon from '@mui/icons-material/PieChart'
import NotificationsIcon from '@mui/icons-material/Notifications'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SettingsIcon from '@mui/icons-material/Settings'
import Badge from '@mui/material/Badge'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import CampaignIcon from '@mui/icons-material/Campaign'

const useStyles = makeStyles((theme) => ({
    list: {
        width: 250,
        padding: '10px',
      },
    fullList: {
        width: 'auto',
    },
    menuButton: {
        marginTop: '5px',
        float: 'left',
        
    },
    small: {
        width: '50',
        height: '50',
        float: 'right',
      },
  }));

export default function LeftSideDrawer(props) {

const classes = useStyles()
const matches = useMediaQuery('(max-width:500px)')

const [anchorEl, setAnchorEl] = useState(null);
const [editProfileClicked, setEditProfileClicked] = useState(false)
const [editGuildClicked, setEditGuildClicked] = useState(false)
const [notificationsClicked, setNotificationsClicked] = useState(false)
const [newNotifications, setNewNotifications] = useState(0)

const { state, update } = useContext(appStore);

const [drawerState, setDrawerState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

const {
  wallet,
  accountId,
  isUpdated,
  curUserIdx,
  did,
  accountType,
  admins
} = state

// useEffect(
//   () => {

    // async function fetchData(){
    //   if(isUpdated){}
    //   if(accountId){
    //     //get the list of all notifications for all accounts
    //     let result = await ceramic.downloadKeysSecret(appIdx, 'notifications')
    //     if(result){

    //         //convert the object from ceramic to map in order to more easily
    //         //return notifications associated with current account
    //         if(result[0]){
    //           let notificationMap = new Map(Object.entries(result[0])) 

    //           let notifications = 0;

    //           //loop thorugh all notifications for user, if the read flag is false, increase the count
    //           //for the notification badge
    //           if(notificationMap.get(accountId)){
    //             for(let i = 0; i < notificationMap.get(accountId).length; i++){
    //                 if(notificationMap.get(accountId)[i].read == false){
    //                     notifications++;
    //                 }
    //             }
    //           }
            

    //         //set the counter for the badge to the amount of unread notifications
    //         setNewNotifications(notifications)
    //         }
    //     }
    //   }
    // }

//     let intervalController = setInterval(checkDash, 500)
//     function checkDash(){
//       let newVisit = get(DASHBOARD_DEPARTURE, [])
//       if(newVisit[0]){
         
//           if(newVisit[0].status=="true" && !newVisit[1]){
//           setStepsEnabled(true)
//           setDrawerState({ ...drawerState, ['left']: true})
//           newVisit.push({arrived: 'true'})
//           set(DASHBOARD_DEPARTURE, newVisit)
//         }
//         clearInterval(intervalController)
//       }
//     }

//     fetchData()
//     .then((res) => {
  
//     })
//   }, [isUpdated, accountId]
// )

const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
}

function handleEditProfileClickState(property){
    setEditProfileClicked(property)
}

const editProfileClick = (event) => {
    setEditProfileClicked(true)
    handleClick(event)
}

function handleEditGuildClickState(property){
  setEditGuildClicked(property)
}

const editGuildClick = (event) => {
  setEditGuildClicked(true)
  handleClick(event)
}

function handleNotificationClick(property){
  setNotificationsClicked(property)
}

// const notificationsClick = (event) => {
//     setNotificationsClicked(true)
//     handleClick(event)
// }

const toggleDrawer = (anchor, open) => (event) => {
if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return
}

setDrawerState({ ...drawerState, [anchor]: open });
}

const list = (anchor) => (
<div
    className={clsx(classes.list, {
    [classes.fullList]: anchor === 'top' || anchor === 'bottom',
    })}
    role="presentation"
    onClick={toggleDrawer(anchor, false)}
    onKeyDown={toggleDrawer(anchor, false)}
>
{!matches && wallet.signedIn ? (
  <div className='toolbar'>
  <List>
    <Link to='/dashboard'>
        <ListItem button key={1}>
        <ListItemIcon><PieChartIcon /></ListItemIcon>
        <ListItemText primary='Dashboard'/>
        </ListItem>
    </Link>
  </List>
  <Divider />

  <Typography variant='h6'>Account</Typography>
  <List>
    <ListItem button key={2} onClick={accountType == 'guild' ? (e) =>  editGuildClick(e) : (e) => editProfileClick(e)}>
        <ListItemIcon><EditIcon /></ListItemIcon>
        <ListItemText primary='Edit Profile'/>
    </ListItem>
    <Link to='/setup'>
      <ListItem className='recoverKey' button key={4}>
      <ListItemIcon><LocalHospitalIcon /></ListItemIcon>
      <ListItemText primary='Recover Profile'/>
    </ListItem>
    </Link>
    <Link to='/registration'>
    <ListItem className='registration' button key={5}>
      <ListItemIcon><AppRegistrationIcon /></ListItemIcon>
      <ListItemText primary='Manage Registration'/>
    </ListItem>
    </Link>
  </List>
  <Divider />
  <Typography variant='h6'>Discover</Typography>
  <List>
    <Link to='/announcements'>
      <ListItem className='announcements' button key={6}>
        <ListItemIcon><CampaignIcon /></ListItemIcon>
        <ListItemText primary='Announcements'/>
      </ListItem>
    </Link>
    <Link to='/guilds'>
      <ListItem className='exploreGuilds' button key={7}>
        <ListItemIcon><ExploreIcon /></ListItemIcon>
        <ListItemText primary='Explore Guilds'/>
      </ListItem>
    </Link>
  </List>
  <Divider />
  <Typography variant='h6'>Rewards</Typography>
  <List>
    <Link to='/leaderboards'>
      <ListItem className='exploreleaderboards' button key={8}>
      <ListItemIcon><LeaderboardIcon /></ListItemIcon>
      <ListItemText primary='Leaderboards'/>
      </ListItem>
    </Link>
    <Link to='/rewards'>
      <ListItem className='exploreRewards' button key={9}>
      <ListItemIcon><EmojiEventsIcon /></ListItemIcon>
      <ListItemText primary='Explore Rewards'/>
      </ListItem>
    </Link>
    <Divider />
    {admins && admins.includes(accountId) ? <>
    <Link to='/admin'>
      <ListItem className='admin' button key={99}>
      <ListItemIcon><SettingsIcon /></ListItemIcon>
      <ListItemText primary='Admin'/>
      </ListItem>
    </Link>
<Divider />
</>
: null }

</List>
  </div>
  ) :
    wallet.signedIn ? (
      <>
        <List>
            <Link to='/dashboard'>
                <ListItem button key={1}>
                <ListItemIcon><PieChartIcon /></ListItemIcon>
                <ListItemText primary='Dashboard'/>
                </ListItem>
            </Link>
        </List>
        <Divider />

        <Typography variant='h6'>Account</Typography>
        <List>
          <ListItem button key={2} onClick={(e) => editProfileClick(e)}>
              <ListItemIcon><EditIcon /></ListItemIcon>
              <ListItemText primary='Edit Profile'/>
          </ListItem>
          <Link to='/setup'>
            <ListItem className='recoverKey' button key={4}>
            <ListItemIcon><LocalHospitalIcon /></ListItemIcon>
            <ListItemText primary='Recover Profile'/>
          </ListItem>
          </Link>
          <Link to='/registration'>
          <ListItem className='registration' button key={5}>
            <ListItemIcon><AppRegistrationIcon /></ListItemIcon>
            <ListItemText primary='Manage Registration'/>
          </ListItem>
        </Link>
        </List>
        <Divider />
        <Typography variant='h6'>Discover</Typography>
        <List>
        <Link to='/announcements'>
          <ListItem className='announcements' button key={6}>
            <ListItemIcon><CampaignIcon /></ListItemIcon>
            <ListItemText primary='Announcements'/>
          </ListItem>
        </Link>
        <Link to='/guilds'>
          <ListItem className='exploreGuilds' button key={7}>
            <ListItemIcon><ExploreIcon /></ListItemIcon>
            <ListItemText primary='Explore Guilds'/>
          </ListItem>
        </Link>
        </List>
        <Divider />
        <Typography variant='h6'>Rewards</Typography>
        <List>
        <Link to='/leaderboards'>
          <ListItem className='exploreleaderboards' button key={8}>
          <ListItemIcon><LeaderboardIcon /></ListItemIcon>
          <ListItemText primary='Leaderboards'/>
          </ListItem>
        </Link>
        <Link to='/rewards'>
            <ListItem className='exploreRewards' button key={9}>
            <ListItemIcon><EmojiEventsIcon /></ListItemIcon>
            <ListItemText primary='Explore Rewards'/>
            </ListItem>
        </Link>
        <Divider />
        {admins && admins.includes(accountId) ? <>
          <Link to='/admin'>
          <ListItem className='admin' button key={99}>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary='Admin'/>
          </ListItem>
          </Link>
          <Divider />
          </>
        : null }
      
      </List>
    </>
    ) : null }
    
    <Typography variant='h6' style={{marginTop:'50px'}}></Typography>
    <List>
    <a href='https://vitalpoint.ai/near-personas'>
      <ListItem button key={10}>
        <ListItemIcon><InfoIcon /></ListItemIcon>
        <ListItemText primary='About NEAR Personas'/>
      </ListItem>
    </a>
    <a href='https://vitalpoint.ai/docs-near-personas'>
      <ListItem button key={11}>
        <ListItemIcon><SchoolIcon /></ListItemIcon>
        <ListItemText primary='Docs'/>
      </ListItem>
    </a>
    <a href='https://vitalpoint.ai/contact'>
      <ListItem button key={12}>
        <ListItemIcon><ContactSupportIcon /></ListItemIcon>
        <ListItemText primary='Contact'/>
      </ListItem>
    </a>
    </List>
    
</div>
)

return (
    <React.Fragment key={'left'}>
        
        <MenuIcon style={{fontSize: 35, color: 'white'}} onClick={toggleDrawer('left', true)}/>
  
  
        <Drawer anchor={'left'} open={drawerState['left']} onClose={toggleDrawer('left', false)}>
        {list('left')}
        </Drawer>

        {editProfileClicked ? <EditProfileForm
          state={state}
          handleEditProfileClickState={handleEditProfileClickState}
          accountId={accountId}
          did={did}
          curUserIdx={curUserIdx}
        /> : null }

        {editGuildClicked ? <GoToGuilds
          handleEditGuildClickState={handleEditGuildClickState}
        /> : null }


        {notificationsClicked ? 
        <NotificationCard
        toolbar={true}
        state={state}
        handleNotificationClick={handleNotificationClick}
        />: null
        }

    </React.Fragment>   
    )
}
