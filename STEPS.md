# Student Management System – Step-by-Step Implementation Guide

Tech: Node.js + Express + MongoDB Atlas + Mongoose, deployed on Render.

Project files (all given in the zip):

```
student-management/
├── models/student.js      <- Mongoose schema + validation
├── public/index.html      <- web page
├── public/style.css       <- styling
├── public/script.js       <- browser JavaScript (calls the API)
├── app.js                 <- Express server + CRUD routes
├── package.json
├── .env.example           <- copy to .env
└── .gitignore
```

---

## STEP 0 – Install what you need (one time)

1. **Node.js (LTS)** – https://nodejs.org. Check: open a terminal and run `node -v` and `npm -v`.
2. **VS Code** – https://code.visualstudio.com
3. **Postman** – https://www.postman.com/downloads
4. **Git** – https://git-scm.com. Check: `git --version`.
5. Make free accounts on **MongoDB Atlas**, **GitHub** and **Render**.

---

## STEP 1 – Create the database in MongoDB Atlas

1. Log in to Atlas → **Create** a project (e.g. `StudentManagement`) → **Create a cluster** → choose the **Free (M0)** plan → Create.
2. **Database Access** (left menu) → **Add New Database User** → choose *Password* → give a username and password (note both; avoid `@ : /` in the password) → role *Read and write to any database* → Add User.
3. **Network Access** → **Add IP Address** → **Allow Access From Anywhere** (`0.0.0.0/0`) → Confirm. (Render needs this.)
4. **Database** → your cluster → **Connect** → **Drivers** → copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Put your real username and password in it and add the database name `studentdb` before the `?`:
   `mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/studentdb?retryWrites=true&w=majority`
6. (Optional) **Browse Collections** → **Add My Own Data** → database `studentdb`, collection `students`. If you skip this, Mongoose creates it automatically when you add the first student.

---

## STEP 2 – Set up the project

1. Unzip `student-management.zip` and open the folder in VS Code (**File → Open Folder**).
2. Open the terminal in VS Code (**Terminal → New Terminal**).
3. Install the packages:
   ```
   npm install
   ```
   (This installs express, mongoose and dotenv from package.json.)
   If you want to build it from scratch instead: `npm init -y` then `npm install express mongoose dotenv`.
4. Make the `.env` file: copy `.env.example`, rename the copy to `.env`, and paste your connection string:
   ```
   MONGO_URI=mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/studentdb?retryWrites=true&w=majority
   PORT=3000
   ```

---

## STEP 3 – Run it on your computer

```
npm start
```

You should see:

```
Server running on port 3000
MongoDB connected
```

Open **http://localhost:3000** in your browser.

If you see `MongoDB connection error`, check the password, the database user, and that Network Access has `0.0.0.0/0`.

---

## STEP 4 – Test in the browser (screenshots 1 to 5)

| Screenshot | What to do |
|---|---|
| 1 | Open http://localhost:3000 and capture the empty homepage. |
| 2 | Add two students, e.g. `S101 / Rahul Patil / rahul101@example.com / 20` and `S102 / Priya Patil / priya102@example.com / 21`. Capture the form message and the table. |
| 3 | Click **Edit** on a student, change the name or age, click **Update Student**. Capture the table showing "Student updated successfully". |
| 4 | Click **Delete** on one student and confirm. Capture the updated list. |
| 5 | Validation: (a) type one letter in Full Name, (b) type `asd` as the email, (c) add a student with an ID that already exists. Capture the browser tooltip messages and the red "Student ID or email already exists" message. |

---

## STEP 5 – Test with Postman (screenshot 6)

Keep the server running. In Postman, for the requests with a body choose **Body → raw → JSON**.

| # | Method | URL | Body |
|---|---|---|---|
| 1 | POST | http://localhost:3000/api/students | `{"studentId":"S103","name":"Amit Shah","email":"amit103@example.com","age":22}` → **201 Created** |
| 2 | GET | http://localhost:3000/api/students | none → **200 OK** (list with count) |
| 3 | GET | http://localhost:3000/api/students/S103 | none → **200 OK** |
| 4 | PUT | http://localhost:3000/api/students/S103 | `{"name":"Amit R Shah","age":23}` → **200 OK** |
| 5 | DELETE | http://localhost:3000/api/students/S103 | none → **200 OK** |

Error checks (good extra screenshots):

- POST with `"name":"A"` → **400** "Name must be at least 2 characters".
- POST the same studentId again → **409** "Student ID or email already exists".
- GET `/api/students/S999` → **404** "Student not found".

---

## STEP 6 – Check the data in Atlas (screenshot 7)

Atlas → **Database** → **Browse Collections** → `studentdb` → `students`. Capture the documents.

---

## STEP 7 – Push the code to GitHub

1. On github.com click **New repository** → name it `student-management` → Create (do not add a README).
2. In the VS Code terminal run:
   ```
   git init
   git add .
   git commit -m "Student Management System with Node.js and MongoDB"
   git branch -M main
   git remote add origin https://github.com/<your-username>/student-management.git
   git push -u origin main
   ```
3. Check that `.env` and `node_modules` are NOT on GitHub (the `.gitignore` file stops them).

---

## STEP 8 – Deploy on Render (screenshot 8)

1. Log in to render.com → **New +** → **Web Service** → connect GitHub and choose your `student-management` repository.
2. Fill in:
   - **Name:** `student-management`
   - **Branch:** `main`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
3. Open **Environment** → **Add Environment Variable**: key `MONGO_URI`, value = your full connection string. (Do not add PORT – Render sets it.)
4. Click **Create Web Service** and wait until it says **Live**.
5. Open the URL shown at the top (`https://student-management-xxxx.onrender.com`), add a student and check it works.
6. Capture the Render dashboard (service name, Live status, URL) for screenshot 8.

Free Render services sleep after inactivity, so the first load can take about 50 seconds.

---

## STEP 9 – Finish the report

1. Paste screenshots 1 to 8 into the dashed boxes in the Word file.
2. Write your GitHub repository link and Render URL in **Project Links**.
3. Save as PDF if your teacher asks for it.

---

## Common problems

| Problem | Fix |
|---|---|
| `MongoDB connection error` | Wrong password, user not created, or `0.0.0.0/0` missing in Network Access. |
| `bad auth` | Username or password wrong. Special characters in the password must be URL-encoded (or use a simple password). |
| `Cannot GET /` | The `public` folder or `index.html` is missing or in the wrong place. |
| Port already in use | Change `PORT` in `.env` or stop the other program using port 3000. |
| Works locally but not on Render | `MONGO_URI` is missing in Render's Environment, or Atlas Network Access is not open. Check the Render **Logs** tab. |
| 409 error when adding | studentId or email already exists in the collection. |
