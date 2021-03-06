import React from 'react'
import { Link } from 'react-router-dom'
import ImageLoader from '../ImageLoader/imageLoader'
import projectLogo from '../../../img/footer-vpai.png'
import powered from '../../../img/powered-by.png'
import './footer.css'

import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'

const Footer = ({}) => {
    const matches = useMediaQuery('(max-width:500px)')

    return (
    !matches ? 
        <div className="footer">
            <div className="left">
                <a href="https://vitalpoint.ai" style={{color:'#FFFFFF'}}>
                by <ImageLoader image={projectLogo} style={{height: "0.9em", marginTop: '7px'}} />
                </a>
                <br></br>
                <Typography variant="body2" style={{fontSize: '90%'}}>
                    a NEAR guild
                </Typography>
                <a href="https://vitalpoint.ai" style={{color:'#FFFFFF'}}>
                    <Typography variant="body2" style={{fontSize: '90%'}}>
                        Join us.
                    </Typography>
                </a>
            </div>
            <div>
                <ImageLoader image={powered} style={{height: "3em", marginTop: '8px'}} />
            </div>
           
            <div className="footerright">
            <Typography variant="body2" style={{fontSize: '90%'}}>NEAR Personas<br></br>Open source/as is.<br></br>
           No warranty of any kind.
            </Typography>
            </div>
        </div>
        :
        <>
        <div className="footer-mobile">
        <div className="left">
            <a href="https://vitalpoint.ai" style={{color:'#FFFFFF'}}>
            by <ImageLoader image={projectLogo} style={{height: "0.9em", marginTop: '7px'}} />
            </a>
            <br></br>
            <Typography variant="body2" style={{fontSize: '90%'}}>
                a NEAR guild
            </Typography>
            <a href="https://vitalpoint.ai" style={{color:'#FFFFFF'}}>
                <Typography variant="body2" style={{fontSize: '90%'}}>
                    Join us.
                </Typography>
            </a>
        </div>
        <div>
            <ImageLoader image={powered} style={{height: "3em", marginTop: '8px'}} />
        </div>
        <div className="footerright">
            <Typography variant="body2" style={{fontSize: '90%'}}>NEAR Personas<br></br>
            Open source/as is.<br></br>
            No warranty.
            </Typography>
        </div>
        </div>
        </>
    )
}

export default Footer