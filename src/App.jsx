import React, { useState, useEffect } from "react";
import MapSection from "./Components/MapSection";
import CustomerForm from "./Components/CustomerForm";
import CustomerList from "./Components/CustomerList";

const App = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1">
        <MapSection />
      </div>

      <CustomerForm />

      <CustomerForm />

      <div className="w-full md:w-64 p-4 bg-white shadow-lg">
        <CustomerList />
      </div>
    </div>
  );
};

export default App;
