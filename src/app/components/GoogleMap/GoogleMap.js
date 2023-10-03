'use client'

import GoogleMapReact from "google-map-react";

function GoogleMap({ location }) {
    console.log(process.env.GOOGLE_MAPS_API_KEY)
    return (
        <div style={{ height: '400px', width: '100%' }}>
        <GoogleMapReact 
            defaultCenter={location} 
            defaultZoom={15}  
            bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
        />
        </div>
    )
}

export default GoogleMap;