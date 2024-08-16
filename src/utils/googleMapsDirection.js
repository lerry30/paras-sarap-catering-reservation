
export const generateGoogleMapsDirection = (destination, setState) => {
    setState('');
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const origin = `${latitude},${longitude}`;
                const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
                //window.location.href = googleMapsUrl;
                window.open(googleMapsUrl, '_blank');
            },

            (error) => {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                          setState('Geolocation request denied. Please enable location permissions in your browser to access directions.');
                          break;
                    case error.POSITION_UNAVAILABLE:
                          setState('Location information is unavailable.');
                          break;
                    case error.TIMEOUT:
                          setState('The request to get user location timed out.');
                          break;
                    case error.UNKNOWN_ERROR:
                          setState('An unknown error occurred.');
                          break;
                }
            }
        );
    } else {
        setState('Geolocation is not supported by this browser.');
        //alert("Geolocation is not supported by this browser.");
    }
}
