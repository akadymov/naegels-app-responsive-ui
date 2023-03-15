import React from 'react';
import { useMediaQuery } from 'react-responsive'
import './main-container.css'
import NavMenu from '../nav-menu'
/*import ActiveContainer from '../active-container'*/

const MainContainer = () => {
    var isMobile = false
    var isDesktop = false
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isMobileWidth = useMediaQuery({query: '(max-width: 480px)'})
    const isDesktopWidth = useMediaQuery({query: '(min-width: 1024px)'})
    const isMobileHeight = useMediaQuery({query: '(max-height: 480px)'})
    const isDesktopHeight = useMediaQuery({query: '(min-height: 768px)'})
    if(isPortrait){
        var isMobile = isMobileWidth
        var isDesktop = isDesktopWidth
    } else {
        var isMobile = isMobileHeight
        var isDesktop = isDesktopHeight
    }
    var isTablet = !isMobile & !isDesktop
    return (
        <div>   
            <NavMenu 
                isMobile = {isMobile}
                isDesktop = {isDesktop}
                isTablet = {isTablet}
                isPortrait = {isPortrait}
            ></NavMenu>
            <div className={`main-container ${ isMobile ? "mobile" : (isDesktop ? "desktop" : "tablet")} ${ isPortrait ? "portrait" : "landscape"}`}>
                {/*<ActiveContainer></ActiveContainer>*/}
            </div>
        </div>
    )
}

export default MainContainer;
