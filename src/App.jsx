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

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/customers");
        if (!res.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await res.json();

        // Calculate distances for each customer
        const customersWithDistance = data.map((customer) => ({
          ...customer,
          distance: calculateDistance(
            predefinedLocation.lat,
            predefinedLocation.lng,
            customer.location.coordinates[1], // latitude
            customer.location.coordinates[0] // longitude
          ),
        }));

        setCustomers(customersWithDistance);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, [predefinedLocation]); // Re-fetch customers if predefinedLocation changes

  // Add a new customer
  const addCustomer = async (customerData) => {
    try {
      if (predefinedLocation) {
        const response = await fetch("http://localhost:5000/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: customerData.name,
            address: customerData.address,
            contact: customerData.contact,
            latitude: customerData.lat,
            longitude: customerData.lng,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add customer");
        }

        // Fetch the updated list of customers
        const fetchResponse = await fetch("http://localhost:5000/api/customers");
        if (!fetchResponse.ok) {
          throw new Error("Failed to fetch updated customers");
        }
        const updatedCustomers = await fetchResponse.json();

        // Calculate distances for the updated customers
        const customersWithDistance = updatedCustomers.map((customer) => ({
          ...customer,
          distance: calculateDistance(
            predefinedLocation.lat,
            predefinedLocation.lng,
            customer.location.coordinates[1], // latitude
            customer.location.coordinates[0] // longitude
          ),
        }));

        // Update the state with the new list of customers
        setCustomers(customersWithDistance);
      }
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };
  // Update an existing customer
  const handleUpdateCustomer = async (updatedCustomer) => {
    try {
      const response = await fetch(`http://localhost:5000/api/customers/${updatedCustomer._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: updatedCustomer.name,
          address: updatedCustomer.address,
          contact: updatedCustomer.contact,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update customer");
      }

      const data = await response.json();
      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === updatedCustomer._id ? { ...customer, ...data } : customer
        )
      );
      setEditingCustomer(null);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  // Delete a customer
  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/customers/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      setCustomers((prev) => prev.filter((customer) => customer._id !== customerId));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Handle adding a new customer
  const handleAddCustomerClick = (location) => {
    setSelectedLocation(location);
    setShowForm(true);
  };

  // Close the form
  const handleFormClose = () => {
    setShowForm(false);
  };

  // Handle editing a customer
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
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
