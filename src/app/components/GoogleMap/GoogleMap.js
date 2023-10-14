'use client'

import styles from './GoogleMap.module.scss'

import GoogleMapReact from "google-map-react";

function GoogleMap({ location, height }) {
    return (
        <div style={{height: height+'px'}} className={styles.GoogleMap}>
            <GoogleMapReact 
                defaultCenter={location} 
                defaultZoom={15}  
                bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
            />
        </div>
    )
}

export default GoogleMap;