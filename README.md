# TimeBuddy - Time-Based Helper & Companion Marketplace

A modern, safe, and verified marketplace platform connecting helpers with customers for hourly services including event support, elder care, errands, and more.

## Features

### For Customers

-   Browse verified helpers by category
-   Filter by rate, rating, and availability
-   Book helpers by time slot with hourly rates
-   In-app messaging
-   Real-time booking management
-   Rate and review helpers
-   Live location tracking during jobs
-   Emergency SOS button

### For Helpers

-   Manage availability calendar
-   Set hourly rates
-   Accept/reject booking requests
-   Track earnings
-   Update service categories
-   Build reputation through ratings

### Safety Features

-   Government ID verification
-   Phone and email verification
-   Escrow-based payments
-   Location tracking during jobs
-   In-app chat only
-   Emergency SOS system

## Tech Stack

-   **Frontend Framework**: Vue 3 with Composition API
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **State Management**: Pinia
-   **Routing**: Vue Router
-   **API Layer**: Mock API with async/await structure

## Project Structure

```
src/
├── components/         # Reusable Vue components
│   └── Navbar.vue     # Navigation component
├── views/             # Page components
│   ├── Home.vue       # Landing page
│   ├── Login.vue      # Login page
│   ├── Register.vue   # Registration page
│   ├── Helpers.vue    # Helper listing with filters
│   ├── HelperDetail.vue  # Individual helper profile
│   ├── Dashboard.vue     # Customer dashboard
│   ├── HelperDashboard.vue  # Helper dashboard
│   ├── Bookings.vue      # Booking management
│   ├── Chat.vue          # Messaging interface
│   ├── Profile.vue       # User profile settings
│   └── Admin.vue         # Admin panel
├── stores/            # Pinia state stores
│   ├── auth.js        # Authentication state
│   ├── booking.js     # Booking management
│   └── helper.js      # Helper data and filters
├── services/          # API and data layer
│   ├── api.js         # Mock API service
│   └── mockData.js    # Dummy data
├── router/            # Vue Router configuration
│   └── index.js
├── style.css          # Global styles and Tailwind
├── App.vue            # Root component
└── main.js            # Application entry point
```

## Getting Started

### Prerequisites

-   Node.js 16+ and npm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Demo Accounts

### Customer Account

-   Email: `customer@test.com`
-   Password: `password`

### Helper Account

-   Email: `helper@test.com`
-   Password: `password`

## API Structure

The application uses a mock API layer (`src/services/api.js`) that simulates real backend calls:

### Main API Methods

-   `getHelpers(filters)` - Fetch helpers with optional filters
-   `getHelper(id)` - Get individual helper details
-   `getCategories()` - Fetch service categories
-   `createBooking(data)` - Create new booking
-   `getBookings(userId, role)` - Fetch user bookings
-   `updateBookingStatus(id, status)` - Update booking status
-   `getChats()` - Fetch chat conversations
-   `sendMessage(chatId, message)` - Send message
-   `login(email, password)` - User authentication
-   `register(userData)` - User registration

All API methods return promises and simulate network delays for realistic behavior.

## Key Features Implementation

### Authentication

-   Role-based access (Customer, Helper, Admin)
-   JWT token simulation
-   LocalStorage persistence
-   Route guards for protected pages

### Booking System

-   Multi-step booking flow
-   Real-time availability checking
-   Status management (pending, upcoming, completed)
-   Escrow payment simulation

### Messaging

-   Real-time chat interface
-   Unread message indicators
-   Conversation history

### Safety Features

-   Verification status display
-   SOS button implementation
-   Location tracking simulation
-   Secure in-app communication only

## Responsive Design

The application is fully responsive with breakpoints for:

-   Mobile (< 768px)
-   Tablet (768px - 1024px)
-   Desktop (> 1024px)

## Color Scheme

-   **Primary**: Blue (#0284c7) - Trust and reliability
-   **Success**: Green - Confirmations and success states
-   **Warning**: Yellow - Pending and attention states
-   **Danger**: Red - Errors and critical actions

## Future Backend Integration

The mock API can be easily replaced with real backend calls. Simply update the methods in `src/services/api.js` to point to your actual API endpoints while maintaining the same response structure.

Example:

```javascript
async getHelpers(filters) {
  const response = await fetch('/api/helpers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters)
  });
  return response.json();
}
```

## License

This project is part of a development prototype.
