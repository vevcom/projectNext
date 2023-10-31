'use client'
import styles from './GoogleMap.module.scss'
import GoogleMapReact from 'google-map-react';
import { Coords } from 'google-map-react';

type PropTypes = {
    location: Coords,
    height: number,
}

function GoogleMap({ location, height } : PropTypes) {
    return (
        <div style={{height: `${height}px`}} className={styles.GoogleMap}>
            <GoogleMapReact 
                defaultCenter={location} 
                defaultZoom={15}  
                bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY ?? 'no_key' }}
            />
        </div>
    )
}

export default GoogleMap;
