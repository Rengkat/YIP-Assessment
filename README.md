# Customer Location Pinning System

A web-based system where users can pin customer locations on a Google Map interface. The system allows users to add customer information along with their location and display the distance from a predefined location.

## Features
- **Google Maps Integration**: Users can add pins by clicking on the map.
- **Customer Information**: Users can input customer details (name, address, contact) and associate them with the pinned location.
- **Distance Calculation**: The system calculates and displays the distance from a predefined location to each pinned customer location.
- **Database Integration**: Customer data is stored in a MongoDB database.
- **Responsive UI**: The interface is clean and works on various screen sizes.

## Technologies Used
- **Frontend**: React, Google Maps API
- **Backend**: Node.js, Express, MongoDB
- **Other Libraries**: Mongoose (for MongoDB), Nodemon

## Project Structure
```
customer-location-pinning-system/
├── backend/
│   ├── controllers/
│   │   └── customerController.js
│   ├── models/
│   │   └── customerModel.js
│   ├── routes/
│   │   └── customerRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── MapSection.jsx
│   │   │   ├── CustomerForm.jsx
│   │   │   └── CustomerList.jsx
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   ├── package.json
│   └── README.md
├── README.md
└── .gitignore
```

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB installed and running
- Google Maps API key

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
2. Install dependencies:
   ```bash
   npm install
3. Create a `.env` file in the backend folder and add your MongoDB connection string and Google Maps API key:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/customerDB
   
4. Start the backend server:
   ```bash
   npm start

### Backend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
2. Install dependencies:
   ```bash
   npm install
3. Create a `.env` file in the `frontend` folder and add your Google Maps API key:
   ```bash
   VITE_MAP_KEY=your-google-maps-api-key
4. Start the frontend development server:
   ```bash
   npm run dev
### Demonstration

https://github.com/user-attachments/assets/540ae313-4499-47d7-924c-aae5d6cc9be3



### Hosting
   - Backend to render [Render](https://yip-assessment-backend.onrender.com) 
   - Frontend to vercel [Vercel](https://yip-assessment-frontend.vercel.app/) 
