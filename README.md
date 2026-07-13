# Climate Data Repository Portal

A full-stack web application developed to securely manage, search, and distribute climate datasets. This portal serves as a centralized hub for researchers and individuals to upload climate data (such as rainfall, temperature, and hydrology), categorize it, and make it available for the public to download and analyze.

### 🚀 Live Demo
**[https://climate-data-repository-portal.vercel.app](https://climate-data-repository-portal.vercel.app)**

---

## ✨ Features

- **User Authentication:** Secure registration and login using Spring Security and JSON Web Tokens (JWT).
- **Dataset Management:** A dedicated Dashboard allowing users to easily upload datasets and attach metadata.
- **Search & Filtering:** Dynamic browsing capabilities to search datasets by category (e.g., Rainfall, Temperature) or keywords.
- **Role-Based Access Control:** Secure endpoints ensuring actions are performed only by authenticated users.
- **Cloud Storage:** Integrated database management deployed entirely on cloud infrastructure.
- **Modern UI/UX:** A highly responsive, premium design built with Material-UI (MUI).

---

## 🛠️ Tech Stack

**Frontend:**
- React (v19)
- TypeScript
- Vite
- Material-UI (MUI)
- Zustand (State Management)
- React Query (Data Fetching)

**Backend:**
- Java 21
- Spring Boot 3
- Spring Security (JWT)
- PostgreSQL
- Flyway (Database Migrations)
- Lombok

**Deployment:**
- Vercel (Frontend)
- Render (Backend)
- Neon (PostgreSQL Database)

---

## 📂 Repository Structure

The repository is divided into two main components:

- `/frontend` - Contains the React/Vite web application.
- `/backend` - Contains the Java Spring Boot REST API.

---

## 💻 Running Locally

### 1. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Ensure you have a local PostgreSQL instance running, or configure `application.yml` to point to your cloud database.
3. Build the project using Maven: `mvn clean install`
4. Run the Spring Boot application: `mvn spring-boot:run`
5. The backend will start on `http://localhost:8080`.

### 2. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. The frontend will start on `http://localhost:5173`.

---

## 👨‍💻 Author
**Krishnendu Chakraborty**  
*Intern, IIT Delhi*
