# Kolhapur Tourism App 🛕🏰🌄

A premium, full-stack tourism application showcasing the cultural and natural beauty of Kolhapur, Maharashtra.

## ✨ Features

- **Explore by Taluka**: Discover attractions organized by region (Karveer, Panhala, Radhanagari, etc.).
- **Dynamic Content**: Category-based filtering (Religious, Historical, Nature, Adventure).
- **Interactive Modals**:
  - **Live Weather**: Current conditions and travel recommendations for every destination.
  - **Smart Routing**: Distance and duration calculation using OSRM and Geolocation.
  - **Venue Details**: Integrated discovery of nearby Hotels and Restaurants.
- **Admin Dashboard**: Secure management interface for adding, editing, and professionalizing destination data.
- **Smart Data Persistence**: A non-destructive seeding system that protects user-made name and description edits from being overwritten during code updates.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, Tailwind CSS, Shadcn UI, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **APIs**: OpenWeatherMap (Weather), OSRM (Routing), Nominatim (Geocoding).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally on default port 27017)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd v0-kolhapur-tourism-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd backend && npm install
   cd ..
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_WEATHER_API_KEY=43e3bf98c07b069f4839b6a2a1b73e64
   MONGODB_URI=mongodb://127.0.0.1:27017/kolhapur-tourism
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Seed the Database**:
   ```bash
   npm run seed
   # Or: node backend/seed.mjs
   ```

5. **Run the Application**:
   - Start Backend: `cd backend && npm run dev`
   - Start Frontend: `npm run dev`

## 🛡️ Smart Seeding Logic

The application includes a `seed.mjs` script designed for safe development. Unlike traditional seeders, it uses **UPSERT** logic and `$setOnInsert` for primary text fields. This means:
- **Names and Descriptions** stay exactly as you edited them in the Admin panel.
- **Technical Metadata** (ratings, coordinates, images) is safely updated to match the latest codebase.

---
*Proudly showcasing the Cultural Capital of Maharashtra.*
