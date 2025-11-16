# Textile Management System

A comprehensive, web-based system for managing all aspects of textile business operations.

## Overview

The **Textile Management System** is designed to streamline processes in textile shops, warehouses, or factories. This system simplifies inventory management, order processing, sales, purchasing, and customer interactions into an easy-to-use interface.

- **Technology stack**:  
  - JavaScript (96.8%)  
  - CSS (3%)  
  - HTML (0.2%)  
- **Frontend**: Built with React and Vite for a smooth, modern UI.
- **Backend**: Connects to local endpoints (`localhost:3001`) for cart, order, and product management.

> See [source code](https://github.com/yashodalasith/Textile-Management-System)

---

## Features

- Manage inventory with product tracking and pricing
- Shopping cart with quantity updates and real-time calculations
- Order confirmation and processing
- Customer account management
- Role-based access
- Responsive design for all devices

---

## 🖥️ Sneak Peek

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGkzYzJvcTRnMXBoOG43dnM5OGZlem8zZ2dlM2N5OGhyZDdnbjgwcyZlcD12MV9naWZzX3NlYXJjaCZjdD1z/26xBwdIuRJiAIqHwA/giphy.gif" width="600" alt="Textile Dashboard Demo" />
  <br><sup>Example product dashboard view</sup>
</p>

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3VhbTF5NWpvbm03dGRibWtkNWhwN2lseWVrYjV2eWNlNnAxMnZ0bCZlcD12MV9naWZzX3NlYXJjaCZjdD1z/13FrpeVH09Zrb2/giphy.gif" width="600" alt="Cart & Checkout Demo" />
  <br><sup>Shopping cart and checkout flow</sup>
</p>

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/)
- Backend API (ensure endpoints like `localhost:3001` are running)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yashodalasith/Textile-Management-System.git
   cd Textile-Management-System
   ```

2. **Install dependencies for the frontend:**

   ```bash
   cd frontend
   npm install
   ```

3. **Install dependencies for the backend**  
   *(If backend code is included, follow these steps to get the backend API running)*:

   ```bash
   cd ../backend
   npm install
   ```

   - **Configure Environment:**  
     Copy `.env.example` to `.env` (if provided) and set the required environment variables (such as PORT, database connection settings, etc).
   - **Start the backend server:**  
     ```bash
     npm start
     ```
   - The backend will typically be available at [http://localhost:3001](http://localhost:3001).

### Running the App

1. **Start the backend service** (see above).

2. **Start the frontend (React app):**

   ```bash
   cd ../frontend   # Make sure you are in the frontend directory
   npm run dev
   ```

   The app will run locally, typically at [http://localhost:5173](http://localhost:5173).

---

## Project Structure

- `frontend/` &mdash; React + Vite frontend ([see frontend README](https://github.com/yashodalasith/Textile-Management-System/blob/master/frontend/README.md))
- `backend/` &mdash; Backend service (if present, usually Express.js)
- `src/pages/CartPage.jsx` &mdash; Key page for managing shopping carts, orders, and checkout logic

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit and push your changes
4. Submit a pull request

---

## License

No explicit license present. Please contact the owner for usage details.

---

> *Built for streamlining the modern textile workflow.*
