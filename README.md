# ⚡ DeviceVault — University Lab Equipment & Hardware Loan Tracker

> A complete, beginner-friendly Full-Stack CRUD Web Application built for university laboratory evaluations and technical vivas.

---

## 📖 Table of Contents
1. [Project Overview & Unique Theme](#-project-overview--unique-theme)
2. [Tech Stack](#-tech-stack)
3. [Folder Architecture (MVC)](#-folder-architecture-mvc)
4. [Step 1: MongoDB Atlas Setup & `.env` Configuration](#-step-1-mongodb-atlas-setup---env-configuration)
5. [Step 2: Running the Project Locally](#-step-2-running-the-project-locally)
6. [Step 3: Postman Desktop Testing Cheat-Sheet (All 5 Endpoints)](#-step-3-postman-desktop-testing-cheat-sheet)
7. [Step 4: GitHub Push Instructions](#-step-4-github-push-instructions)
8. [Evaluation & Viva Q&A Cheat-Sheet](#-evaluation--viva-qa-cheat-sheet)

---

## 🎯 Project Overview & Unique Theme

**DeviceVault** is a central University Lab Equipment & Hardware Loan Tracker designed for engineering faculties (Computer Science, IoT, Robotics, and Electronics).

In university laboratories, students frequently borrow hardware components (such as *Raspberry Pi kits*, *Digital Oscilloscopes*, *VR Headsets*, and *Arduino kits*) to conduct lab practicals, hackathons, and final-year capstone projects. 

DeviceVault provides a live real-time dashboard where lab managers and professors can:
- **Register** incoming lab equipment and hardware with asset tags.
- **Track** whether each item is currently on the shelf (**"Available"**) or borrowed by a student (**"Issued"**).
- **Issue** hardware to a specific student using their **Student Roll Number**.
- **Return** items back to the lab inventory with one click.
- **Delete** retired, damaged, or decommissioned hardware records.

---

## 💻 Tech Stack

- **Backend Runtime:** [Node.js](https://nodejs.org/) (JavaScript V8 engine)
- **Web Framework:** [Express.js](https://expressjs.com/) (RESTful routing & middleware)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud NoSQL database)
- **ODM:** [Mongoose](https://mongoosejs.com/) (Schema definition, validation, and queries)
- **Frontend:** Pure **HTML5** & **CSS3** (Served statically via Express `public` folder; zero frameworks, zero external CSS dependencies like Bootstrap/Tailwind, and vanilla `fetch()` API calls).

---

## 📁 Folder Architecture (MVC)

The project follows a clean **Model-View-Controller (MVC)** design pattern:

```text
device-vault-crud-api/
├── models/
│   ├── device.model.js          # Mongoose Schema & Model for equipment records
│   └── book.model.js            # Evaluation alias re-export
├── controllers/
│   ├── device.controller.js     # Express Controller functions for all 5 CRUD operations
│   └── book.controller.js       # Evaluation alias re-export
├── routes/
│   ├── device.route.js          # Express Router mapping HTTP verbs to controllers
│   └── book.route.js            # Evaluation alias route (/api/books)
├── public/
│   ├── index.html               # Pure HTML interface (Dashboard, Form, Table, Stats)
│   └── style.css                # Warm Editorial / Lab Vault CSS theme
├── .env                         # Environment variables (PORT, MONGO_URI)
├── .env.example                 # Template for repository viewers
├── .gitignore                   # Excludes node_modules and .env from Git
├── index.js                     # Main entry point, MongoDB connection & Express server
├── package.json                 # Project dependencies and npm scripts
└── README.md                    # Complete evaluation guide, Postman & Git cheat-sheet
```

---

## 🗄️ Step 1: MongoDB Atlas Setup & `.env` Configuration

Your credentials are pre-configured in `.env`:
- **Database Username:** `sachinsaini25cse_db_user`
- **Database Password:** `NwIgg9OV39NjBSwI`

### How to get your MongoDB Atlas Connection String:
1. Log into your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2. On your Database Deployment page, click the blue **"Connect"** button next to your cluster.
3. Select **"Drivers"** (under *Connect to your application*).
4. Select **Driver: Node.js** and copy the connection string. It will look like:
   ```text
   mongodb+srv://sachinsaini25cse_db_user:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
5. Open `.env` in this project folder and paste the string with your password and database name:
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://sachinsaini25cse_db_user:NwIgg9OV39NjBSwI@cluster0.abcde.mongodb.net/devicevault?retryWrites=true&w=majority
   ```
6. **Important:** In MongoDB Atlas, go to **Network Access** (left sidebar) -> click **"Add IP Address"** -> select **"Allow Access from Anywhere" (`0.0.0.0/0`)** so your laptop can connect from university Wi-Fi or mobile hotspot.

---

## 🚀 Step 2: Running the Project Locally

Open your terminal inside the project directory:

```bash
cd /Users/sachin/.gemini/antigravity/scratch/device-vault-crud-api
```

### Start the Server:
```bash
# Production mode
npm start

# Development mode (auto-restarts on code changes using nodemon)
npm run dev
```

### Access in Browser:
- **Web Dashboard:** [http://localhost:3000](http://localhost:3000)
- **API Endpoint:** [http://localhost:3000/api/devices](http://localhost:3000/api/devices)
- **Evaluation Alias:** [http://localhost:3000/api/books](http://localhost:3000/api/books)
- **Health Check:** [http://localhost:3000/health](http://localhost:3000/health)

---

## 📮 Step 3: Postman Desktop Testing Cheat-Sheet

Here is the exact step-by-step Postman testing procedure for all 5 CRUD operations.

### 1. CREATE a New Equipment Record (POST)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/devices`
- **Headers:**
  - Key: `Content-Type` | Value: `application/json`
- **Body:** Select `raw` -> `JSON`:
  ```json
  {
    "deviceName": "Raspberry Pi 4 Model B (4GB)",
    "assetTag": "RP-LAB-042",
    "category": "Microcontrollers & IoT",
    "studentRollNo": "None",
    "status": "Available"
  }
  ```
- **Expected Response:** Status `201 Created`
  ```json
  {
    "success": true,
    "message": "Record successfully registered in DeviceVault.",
    "data": {
      "_id": "672...",
      "deviceName": "Raspberry Pi 4 Model B (4GB)",
      "assetTag": "RP-LAB-042",
      "category": "Microcontrollers & IoT",
      "studentRollNo": "None",
      "status": "Available",
      "createdAt": "2026-11-02T...",
      "updatedAt": "2026-11-02T..."
    }
  }
  ```
*(Copy the generated `_id` to use in requests 3, 4, and 5 below!)*

---

### 2. READ ALL Records (GET)
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/devices`
- **Headers:** None required
- **Expected Response:** Status `200 OK`
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "672...",
        "deviceName": "Raspberry Pi 4 Model B (4GB)",
        "assetTag": "RP-LAB-042",
        "category": "Microcontrollers & IoT",
        "studentRollNo": "None",
        "status": "Available"
      }
    ]
  }
  ```

---

### 3. READ A SINGLE Record by ID (GET)
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/devices/PASTE_COPIED_ID_HERE`
- **Headers:** None required
- **Expected Response:** Status `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "672...",
      "deviceName": "Raspberry Pi 4 Model B (4GB)",
      "assetTag": "RP-LAB-042",
      "category": "Microcontrollers & IoT",
      "studentRollNo": "None",
      "status": "Available"
    }
  }
  ```
*(If you send an ID that does not exist, it returns `404 Not Found`)*

---

### 4. UPDATE / ISSUE Equipment (PUT)
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/devices/PASTE_COPIED_ID_HERE`
- **Headers:**
  - Key: `Content-Type` | Value: `application/json`
- **Body:** Select `raw` -> `JSON`:
  ```json
  {
    "status": "Issued",
    "studentRollNo": "21BCSE104"
  }
  ```
- **Expected Response:** Status `200 OK`
  ```json
  {
    "success": true,
    "message": "Record successfully updated.",
    "data": {
      "_id": "672...",
      "deviceName": "Raspberry Pi 4 Model B (4GB)",
      "assetTag": "RP-LAB-042",
      "category": "Microcontrollers & IoT",
      "studentRollNo": "21BCSE104",
      "status": "Issued"
    }
  }
  ```

---

### 5. DELETE a Record (DELETE)
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/devices/PASTE_COPIED_ID_HERE`
- **Headers:** None required
- **Expected Response:** Status `200 OK`
  ```json
  {
    "success": true,
    "message": "Record 'Raspberry Pi 4 Model B (4GB)' successfully deleted.",
    "data": {
      "_id": "672...",
      "deviceName": "Raspberry Pi 4 Model B (4GB)"
    }
  }
  ```

---

## 🐙 Step 4: GitHub Push Instructions

Push this complete repository to your GitHub account (`sachinsaini25cse-rgb`).

### Option A: Create Repository on GitHub Website (Recommended)
1. Go to [https://github.com/new](https://github.com/new) in your browser.
2. Enter Repository name: `device-vault-crud-api`
3. Set visibility to **Public**.
4. Leave *"Initialize this repository with a README"* **unchecked** (we already have a complete one).
5. Click **Create repository**.
6. Run these commands in your project terminal:
   ```bash
   cd /Users/sachin/.gemini/antigravity/scratch/device-vault-crud-api
   git init
   git add .
   git commit -m "feat: complete DeviceVault CRUD application with MVC architecture"
   git branch -M main
   git remote add origin https://github.com/sachinsaini25cse-rgb/device-vault-crud-api.git
   git push -u origin main
   ```
7. When prompted for your password, enter your GitHub Personal Access Token:
   ```text
   <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
   ```

---

## 🎓 Evaluation & Viva Q&A Cheat-Sheet

Here are typical viva questions asked by evaluators and the answers:

| Question | Clear Answer to Give the Evaluator |
|---|---|
| **What is MVC Architecture?** | Model-View-Controller separates concerns: **Model** (`models/device.model.js`) defines the data schema & MongoDB interaction; **View** (`public/index.html` & `style.css`) is what the user sees; **Controller** (`controllers/device.controller.js`) handles request validation, logic, and sends HTTP responses. |
| **Why Mongoose over native MongoDB driver?** | Mongoose provides strict schema validation, type casting, default values, middleware hooks, and cleaner querying methods compared to low-level raw drivers. |
| **What does `{ new: true, runValidators: true }` do in `findByIdAndUpdate`?** | By default, Mongoose returns the old document *before* modification. `{ new: true }` instructs Mongoose to return the freshly updated document. `{ runValidators: true }` ensures schema validations (like enum and minlength) are checked during updates. |
| **Why use HTTP status code 201 for POST?** | HTTP `200` means "OK/Success", but HTTP `201` specifically denotes "Created" — confirming that a new resource has been permanently created on the server/database. |
| **Why is `.env` kept in `.gitignore`?** | Security best practice. Database credentials, cluster hostnames, and secret API keys should never be committed to public version control to avoid unauthorized database access or credential leaks. |
| **Why is `app.use(express.static('public'))` used?** | It instructs Express to serve static files (HTML, CSS, client-side JavaScript, images) directly from the `public` directory when the root URL `http://localhost:3000` is visited. |
