import React from 'react';
import './main-container.css'
import { useMediaQuery } from 'react-responsive';

// Local components
import NavMenu from '../nav-menu';
import ActiveContainer from '../active-container';

const MainContainer = () => {
    var isMobile = false
    var isDesktop = false
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isMobileWidth = useMediaQuery({query: '(max-width: 480px)'})
    const isDesktopWidth = useMediaQuery({query: '(min-width: 1024px)'})
    const isMobileHeight = useMediaQuery({query: '(max-height: 480px)'})
    const isDesktopHeight = useMediaQuery({query: '(min-height: 768px)'})
    if(isPortrait){
        isMobile = isMobileWidth
        isDesktop = isDesktopWidth
    } else {
        isMobile = isMobileHeight
        isDesktop = isDesktopHeight
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
                <ActiveContainer
                    isMobile = {isMobile}
                    isDesktop = {isDesktop}
                    isTablet = {isTablet}
                    isPortrait = {isPortrait}
                ></ActiveContainer>
            </div>
        </div>
    )
}

export default MainContainer;
