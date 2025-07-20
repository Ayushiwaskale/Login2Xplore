# Login2Xplore
Micro Project Code

Student Enrollment Form

This project implements a simple Student Enrollment Form using HTML, Bootstrap for styling, and JavaScript for client-side logic and interaction with a JsonPowerDB database. It allows users to enroll new students, view existing student details, and update their information.

Table of Contents
Description
Features
Benefits of using JsonPowerDB
Technologies Used
Setup Instructions
Database Configuration (JsonPowerDB)
How to Use
Project Structure
Troubleshooting
Release History
Scope of Functionalities
Project Status
Sources
Other Information

Description
This web-based application provides a user-friendly interface for managing student enrollment data. It serves as a practical example of building a client-side form that interacts with a cloud-based NoSQL database (JsonPowerDB) without requiring a separate backend server. The form ensures data integrity through validation and provides real-time feedback to the user regarding data existence and operation status.

Features
--Student Enrollment: Add new student records to the database with unique Roll Numbers.
--Student Data Retrieval: Fetch and display existing student data instantly when a valid Roll No (Primary Key) is entered.
--Student Data Update: Modify and save changes to existing student records, ensuring data consistency.
--Form Reset: Clear all form fields and reset the form to its initial state, ready for new input.
--Dynamic Button Control: Control buttons (Save, Update, Reset) are intelligently enabled or disabled based on whether the entered Roll No exists in the database and the form's current state.
--Input Validation: Basic client-side validation ensures that all required fields are populated before data can be saved or updated, preventing incomplete records.
--User Feedback: Provides clear success or error messages to the user for each operation (e.g., "Student saved successfully!", "Roll No not found.").

Benefits of using JsonPowerDB
JsonPowerDB is a lightweight and easy-to-use NoSQL database that offers several advantages for projects like this:
  --No Backend Required: It provides direct REST API access, eliminating the need to set up and manage a separate server-side application. This simplifies development and deployment.
  --Schema-less: Its NoSQL nature allows for flexible data structures, which can be beneficial during the development phase as your data model evolves.
  --Real-time Capabilities: While not explicitly used for real-time updates in this simple form, JsonPowerDB supports real-time data synchronization, which can be extended for more complex applications.
  --Ease of Use: The API is straightforward, making it quick to integrate database operations into client-side JavaScript.
  --Cost-Effective: For small to medium-sized projects or prototypes, it can be a very economical solution.

Technologies Used
--HTML5: For the basic structure of the web page.
--CSS3 (with Bootstrap 5): For responsive and modern styling, ensuring a clean and user-friendly interface.
--JavaScript (ES6+): For all client-side logic, form handling, and asynchronous interactions with the JsonPowerDB API.
--JsonPowerDB: A cloud-based NoSQL database used to store student enrollment data.

Setup Instructions
--To run this project locally, follow these steps:

Clone the Repository (or download files):
If you have a Git repository, clone it:

git clone <your-repository-url>
cd <your-repository-name>

--Otherwise, simply download the index.html and emp.js files into the same directory on your local machine.

Open index.html:
Open the index.html file in your web browser. You can usually do this by double-clicking the file.

Database Configuration (JsonPowerDB)
This project uses JsonPowerDB for data storage. You need to ensure your JsonPowerDB account is set up correctly.

Connection Token: The connToken used in emp.js is:
"764066628|7385821557891514811|764067497"
Important: This token is specific to your JsonPowerDB account. If you are deploying this or using a different account, you must replace this with your own valid connection token.

Database Name: SCHOOL-DB

Relation Name: STUDENT-TABLE

Ensure that SCHOOL-DB and STUDENT-TABLE exist in your JsonPowerDB account and are spelled exactly as shown (case-sensitive).

How to Use
--Initial State:
  On page load or after clicking any control button, the form will be empty.
  The cursor will automatically focus on the "Roll No" field.
  All other input fields and the Save, Update, and Reset buttons will be disabled.

--Entering Roll No:
  Enter a student's Roll No in the designated field.
  As you move out of the "Roll No" field (or press Enter), the form will check the database:
  
    If Roll No does NOT exist:
    --The Save and Reset buttons will be enabled.
    --All other input fields (Full Name, Class, Birth Date, Address, Enrollment Date) will become editable.
    --The cursor will move to the "Full Name" field.
    --A success message will indicate that the Roll No was not found and you can enter new data.

    If Roll No IS present:
    --The form will automatically populate with the existing student's data.
    --The Update and Reset buttons will be enabled.
    --The "Roll No" field will become disabled (as it's the primary key).
    --All other input fields will be editable, allowing you to modify the data.
    --The cursor will move to the "Full Name" field.
    --A success message will confirm that the student data was found.

--Data Entry and Validation:
  Fill in all the required fields.
  The form includes basic validation to ensure no fields are left empty before saving or updating. If any required field is empty, an error message will appear, and the corresponding input field will be highlighted.

--Control Buttons:
  Save: Click this button to store a new student record in the STUDENT-TABLE relation of your SCHOOL-DB database. After successful saving, the form will reset to its initial state.
  Update: Click this button to modify an existing student record in the database. After successful updating, the form will reset to its initial state.
  Reset: Click this button at any time to clear the form, disable all fields except "Roll No", and set the focus back to "Roll No".

Project Structure
.
├── index.html
└── emp.js

index.html: Contains the HTML structure of the Student Enrollment Form, including all input fields, labels, and control buttons. It also links to Bootstrap CSS and the emp.js JavaScript file.
emp.js: Contains all the JavaScript logic for:
  Handling form input and state.
  Interacting with the JsonPowerDB API (get, put, update operations).
  Validating form data.
  Displaying user messages.

Troubleshooting
If you encounter issues, especially net::ERR_FAILED or TypeError: Failed to fetch errors, consider the following:
  Internet Connectivity: Ensure you have a stable internet connection.
  JsonPowerDB Token Validity: Double-check that your connToken is correct and has not expired. Log into your JsonPowerDB dashboard to verify.
  Database/Relation Names: Confirm that SCHOOL-DB and STUDENT-TABLE are spelled correctly and exist in your JsonPowerDB account (case-sensitive).
  Browser Console: Open your browser's developer tools (F12), go to the "Network" tab, and then the "Console" tab. Look for any specific error messages when you try to save/update data. The "Network" tab might show details about failed requests.
  Firewall/VPN: Temporarily disable any firewalls, antivirus software, or VPNs that might be blocking network requests to api.jsonpowerdb.com.
  CORS: While JsonPowerDB generally handles CORS, ensure no browser extensions are interfering.

Release History
Initial Release (July 20, 2025):
  Basic Student Enrollment Form with HTML, Bootstrap, and JavaScript.
  Integration with JsonPowerDB for Save, Update, and Get operations.
  Client-side form validation and dynamic button control.

Scope of Functionalities
  This project focuses on the core CRUD (Create, Read, Update) operations for single student records. The current scope includes:
  Data Entry: Capturing student details (Roll No, Full Name, Class, Birth Date, Address, Enrollment Date).
  Primary Key Management: Utilizing Roll No as a unique identifier for efficient data retrieval and updates.
  User Interface: A responsive and intuitive form for data interaction.

Future enhancements could include:
  Search functionality for multiple records.
  Delete operation for student records.
  Data visualization of enrolled students.
  More advanced input validation (e.g., date formats, age calculation).

Project Status
The project is currently in a stable and functional state for its defined scope. It successfully demonstrates the core features of student enrollment, retrieval, and updates using JsonPowerDB.

Sources
Bootstrap 5 Documentation: https://getbootstrap.com/docs/5.3/

JsonPowerDB Documentation: Refer to the official JsonPowerDB documentation for API details and usage. (Specific link depends on their current documentation portal).

Other Information
This project serves as a micro-project example for demonstrating client-side database interactions without a dedicated backend. It highlights the ease of integrating external NoSQL services like JsonPowerDB into web applications.
