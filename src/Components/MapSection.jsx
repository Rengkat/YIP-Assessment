import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from "@react-google-maps/api";
const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

const MapSection = ({ onAddCustomer, customers, predefinedLocation }) => {
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 });
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log("Error: The Geolocation service failed.");
        }
      );
    } else {
      console.log("Error: Your browser doesn't support geolocation.");
    }
  }, []);

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    onAddCustomer({ lat, lng });
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.local.VITE_MAP_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        options={mapOptions}
        onClick={handleMapClick}>
        {/* Render markers for each customer */}
        {customers.map((customer) => (
          <Marker
            key={customer.id}
            position={{ lat: customer.lat, lng: customer.lng }}
            onClick={() => setSelectedMarker(customer)}
          />
        ))}

        {/* Render polylines from predefined location to each customer */}
        {predefinedLocation &&
          customers.map((customer) => (
            <Polyline
              key={customer.id}
              path={[
                { lat: predefinedLocation.lat, lng: predefinedLocation.lng },
                { lat: customer.lat, lng: customer.lng },
              ]}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
              }}
            />
          ))}
        {/* Render InfoWindow for the selected marker */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}>
            <div>
              <h3>{selectedMarker.name}</h3>
              <p>{selectedMarker.address}</p>
              <p>Contact: {selectedMarker.contact}</p>
              <p>Distance: {selectedMarker.distance} km</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapSection;
