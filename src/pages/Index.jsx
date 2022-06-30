import React, { useRef, useState } from 'react';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'

import { IoIosNavigate } from 'react-icons/io';
import { MdOutlineGpsFixed } from 'react-icons/md';
import { ImLocation2 } from 'react-icons/im';
import { IoMdCloseCircle } from 'react-icons/io';


const api = "AIzaSyBooopbItqJYBBVISpUZHkad1ewqdafgrw"


const center = { lat: 28.612894, lng: 77.229446 }
const containerStyle = {
    width: '1420px',
    height: '590px'
};
const Index = () => {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: api,
        libraries: ['places']
    })
    const [mapCenter, setmapCenter] = React.useState(/** @type google.maps.Map */(null))
    const [directionResponse, setdirectionResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');

    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destinationRef = useRef();

    if (!isLoaded) {
        return "Map Loading..."
    }

    async function calculateRoute() {
        if (originRef.current.value === '' || destinationRef.current.value === '') {
            return
        }
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()

        const results = await directionsService.route({
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING
        })
        setdirectionResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
    }
    function clearRoute() {
        setdirectionResponse(null)
        setDistance('')
        setDuration('')
        originRef.current.value = ''
        destinationRef.current.value = ''
        window.location.reload(true)
    }

    return (
        <div>
            <div className="flex flex-col items-center justify-center bg-zinc-100">
                <div className="p-5 leading-tight text-center bg-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline lables">
                    <h1 className="text-xl font-bold tracking-wider text-gray-600 uppercase">Find Your Path </h1>
                    <h1 className="text-base font-medium tracking-wider text-gray-600 ">This App Will Help You to Calculate Your Travelling Distance</h1>
                    <div className="flex flex-row pt-3 space-x-6 inputs">
                        <div className="flex items-center space-x-2">
                            <span><MdOutlineGpsFixed className="text-2xl text-pink-700" /></span>
                            <Autocomplete>
                                <input autoComplete="off" ref={originRef} className="px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none w-44 focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Origin" />
                            </Autocomplete>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span><ImLocation2 className="text-2xl text-pink-700" /></span>
                            <Autocomplete>
                                <input autoComplete="off" ref={destinationRef} className="px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none w-44 focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Destination" />
                            </Autocomplete>
                        </div>
                        <button onClick={calculateRoute} className="p-2 text-sm font-medium tracking-wider text-gray-100 bg-pink-600 rounded hover:bg-pink-700">Calculate Route</button>
                    </div>
                    <div className="flex pt-3 space-x-40 result">
                        <span className="text-base font-bold tracking-wider text-gray-600 uppercase">Distance: <span className="text-pink-600">{distance}</span></span>
                        <span className="text-base font-bold tracking-wider text-gray-600 uppercase">Duration: <span className="text-pink-600">{duration}</span></span>
                        <div className="flex space-x-2 ">
                            <span><IoIosNavigate className="float-right p-1 text-3xl bg-gray-200 rounded-full cursor-pointer" onClick={() => mapCenter.panTo(center)} /></span>
                            <span><IoMdCloseCircle className="float-right p-1 text-3xl bg-gray-200 rounded-full cursor-pointer" onClick={clearRoute} /></span>
                        </div>

                    </div>
                </div>
                <div className="pt-1 map">
                    <div>
                        <GoogleMap
                            center={center}
                            zoom={15}
                            mapContainerStyle={containerStyle}
                            options={{
                                zoomControl: false,
                                streetView: false,
                                mapTypeControl: false,
                                fullscreenControl: false
                            }}
                            onLoad={(mapCenter) => setmapCenter(mapCenter)}
                        >
                            <Marker position={center} />
                            {directionResponse && <DirectionsRenderer directions={directionResponse} />}
                        </GoogleMap>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Index;
