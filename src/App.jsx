import React, { useState, useEffect } from "react";
import MapSection from "./Components/MapSection";
import CustomerForm from "./Components/CustomerForm";
import CustomerList from "./Components/CustomerList";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance.toFixed(2);
};

const mockedCustomers = [];

const App = () => {
  const [customers, setCustomers] = useState(mockedCustomers);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [predefinedLocation, setPredefinedLocation] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPredefinedLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location", error);
          // Fallback to a default location if geolocation fails
          setPredefinedLocation({ lat: 40.7128, lng: -74.006 });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fallback to a default location if geolocation is not supported
      setPredefinedLocation({ lat: 40.7128, lng: -74.006 });
    }
  }, []);

  const addCustomer = (customerData) => {
    if (predefinedLocation) {
      const distance = calculateDistance(
        predefinedLocation.lat,
        predefinedLocation.lng,
        customerData.lat,
        customerData.lng
      );
      const newCustomer = { id: Date.now(), ...customerData, distance };
      setCustomers((prev) => [...prev, newCustomer]);
    }
  };

  const handleAddCustomerClick = (location) => {
    setSelectedLocation(location);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
  };

  const handleUpdateCustomer = (updatedCustomer) => {
    setCustomers((prev) =>
      prev.map((customer) => (customer.id === updatedCustomer.id ? updatedCustomer : customer))
    );
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== customerId));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1">
        {predefinedLocation && (
          <MapSection
            onAddCustomer={handleAddCustomerClick}
            customers={customers}
            predefinedLocation={predefinedLocation}
          />
        )}
      </div>
      {showForm && (
        <CustomerForm onClose={handleFormClose} onSave={addCustomer} location={selectedLocation} />
      )}
      {editingCustomer && (
        <CustomerForm
          onClose={() => setEditingCustomer(null)}
          onSave={handleUpdateCustomer}
          customer={editingCustomer}
        />
      )}
      <div className="w-full md:w-64 p-4 bg-white shadow-lg">
        <CustomerList
          customers={customers}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
        />
      </div>
    </div>
  );
};

export default App;
