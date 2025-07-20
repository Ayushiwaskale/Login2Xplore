// Get references to form elements and buttons
const rollNoInput = document.getElementById('rollNo');
const fullNameInput = document.getElementById('fullName');
const studentClassInput = document.getElementById('studentClass');
const birthDateInput = document.getElementById('birthDate');
const addressInput = document.getElementById('address');
const enrollmentDateInput = document.getElementById('enrollmentDate');

const saveBtn = document.getElementById('saveBtn');
const updateBtn = document.getElementById('updateBtn'); // Renamed from changeBtn
const resetBtn = document.getElementById('resetBtn');
const messageBox = document.getElementById('messageBox');

// Connection Token and Database Details for JsonPowerDB
const connToken = "764066628|7385821557891514811|764067497";
const DB_NAME = "SCHOOL-DB";
const RELATION_NAME = "STUDENT-TABLE";

/**
 * Displays a message in the message box.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message ('success' or 'danger').
 */
function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `alert-message alert-${type}`;
    messageBox.style.display = 'block';
    // Hide the message after 3 seconds
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

/**
 * Resets the form to its initial state:
 * - Clears all input fields.
 * - Disables all fields except Roll No.
 * - Disables Save, Update, and Reset buttons.
 * - Sets focus to Roll No.
 */
function initForm() {
    // Clear all input fields
    rollNoInput.value = '';
    fullNameInput.value = '';
    studentClassInput.value = '';
    birthDateInput.value = '';
    addressInput.value = '';
    enrollmentDateInput.value = '';

    // Disable all fields except Roll No
    rollNoInput.disabled = false;
    fullNameInput.disabled = true;
    studentClassInput.disabled = true;
    birthDateInput.disabled = true;
    addressInput.disabled = true;
    enrollmentDateInput.disabled = true;

    // Disable all control buttons
    saveBtn.disabled = true;
    updateBtn.disabled = true;
    resetBtn.disabled = true;

    // Remove validation feedback
    rollNoInput.classList.remove('is-invalid');
    fullNameInput.classList.remove('is-invalid');
    studentClassInput.classList.remove('is-invalid');
    birthDateInput.classList.remove('is-invalid');
    addressInput.classList.remove('is-invalid');
    enrollmentDateInput.classList.remove('is-invalid');

    // Set focus to Roll No
    rollNoInput.focus();
}

/**
 * Validates all form fields to ensure they are not empty.
 * Adds Bootstrap 'is-invalid' class for visual feedback.
 * @returns {boolean} True if all fields are valid, false otherwise.
 */
function validateForm() {
    let isValid = true;
    const fields = [
        { element: rollNoInput, name: 'Roll No' },
        { element: fullNameInput, name: 'Full Name' },
        { element: studentClassInput, name: 'Class' },
        { element: birthDateInput, name: 'Birth Date' },
        { element: addressInput, name: 'Address' },
        { element: enrollmentDateInput, name: 'Enrollment Date' }
    ];

    // If the rollNoInput is disabled, it means we are in 'update' mode,
    // and its value is already populated and validated for existence.
    // So, we only check other fields for emptiness.
    const isRollNoDisabled = rollNoInput.disabled;

    fields.forEach(field => {
        if (isRollNoDisabled && field.element.id === 'rollNo') {
            field.element.classList.remove('is-invalid');
            return;
        }

        if (field.element.value.trim() === '') {
            field.element.classList.add('is-invalid');
            isValid = false;
        } else {
            field.element.classList.remove('is-invalid');
        }
    });

    if (!isValid) {
        showMessage('Please fill in all required fields.', 'danger');
    }
    return isValid;
}

/**
 * Makes a POST request to the JsonPowerDB API.
 * @param {string} url - The API endpoint URL.
 * @param {object} data - The data payload for the request.
 * @returns {Promise<object>} - A promise that resolves with the JSON response.
 */
async function makeJsonPowerDBRequest(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('JsonPowerDB request failed:', error);
        showMessage(`Error: ${error.message}`, 'danger');
        return null;
    }
}

/**
 * Checks if a Roll No exists in the JsonPowerDB database.
 * If it exists, populates the form and enables Update/Reset.
 * If not, enables Save/Reset and allows new data entry.
 */
async function checkRollNo() {
    const rollNo = rollNoInput.value.trim();

    // Clear previous validation state for Roll No
    rollNoInput.classList.remove('is-invalid');

    if (rollNo === '') {
        // If Roll No is empty, reset form to initial state
        initForm();
        return;
    }

    const getRequestData = {
        token: connToken,
        dbName: DB_NAME,
        rel: RELATION_NAME,
        jsonStr: { "Roll-No": rollNo } // jsonStr for get is an object
    };

    const result = await makeJsonPowerDBRequest('https://api.jsonpowerdb.com/api/irl/get', getRequestData);

    if (result && result.status === 200 && result.data && result.data.length > 0) {
        // Student exists: populate form, enable Update/Reset
        const student = JSON.parse(result.data[0].record); // Assuming record is a JSON string
        fullNameInput.value = student["Full-Name"];
        studentClassInput.value = student["Class"];
        birthDateInput.value = student["Birth-Date"];
        addressInput.value = student["Address"];
        enrollmentDateInput.value = student["Enrollment-Date"];

        // Disable Roll No field
        rollNoInput.disabled = true;

        // Enable other fields
        fullNameInput.disabled = false;
        studentClassInput.disabled = false;
        birthDateInput.disabled = false;
        addressInput.disabled = false;
        enrollmentDateInput.disabled = false;

        // Enable Update and Reset buttons, disable Save
        saveBtn.disabled = true;
        updateBtn.disabled = false;
        resetBtn.disabled = false;

        // Move cursor to Full Name
        fullNameInput.focus();
        showMessage(`Student with Roll No ${rollNo} found. You can update the data.`, 'success');
    } else {
        // Student does not exist: clear other fields, enable Save/Reset
        fullNameInput.value = '';
        studentClassInput.value = '';
        birthDateInput.value = '';
        addressInput.value = '';
        enrollmentDateInput.value = '';

        // Enable other fields
        fullNameInput.disabled = false;
        studentClassInput.disabled = false;
        birthDateInput.disabled = false;
        addressInput.disabled = false;
        enrollmentDateInput.disabled = false;

        // Enable Save and Reset buttons, disable Update
        saveBtn.disabled = false;
        updateBtn.disabled = true;
        resetBtn.disabled = false;

        // Move cursor to Full Name
        fullNameInput.focus();
        showMessage(`Student with Roll No ${rollNo} not found. Please enter new data.`, 'success');
    }
}

/**
 * Saves new student data to JsonPowerDB.
 */
async function saveStudent() {
    if (!validateForm()) {
        return; // Stop if validation fails
    }

    const rollNo = rollNoInput.value.trim();
    const fullName = fullNameInput.value.trim();
    const studentClass = studentClassInput.value.trim();
    const birthDate = birthDateInput.value.trim();
    const address = addressInput.value.trim();
    const enrollmentDate = enrollmentDateInput.value.trim();

    const studentData = {
        "Roll-No": rollNo,
        "Full-Name": fullName,
        "Class": studentClass,
        "Birth-Date": birthDate,
        "Address": address,
        "Enrollment-Date": enrollmentDate
    };

    const putRequestData = {
        token: connToken,
        dbName: DB_NAME,
        rel: RELATION_NAME,
        jsonStr: JSON.stringify(studentData) // Corrected: stringify the studentData object
    };

    const result = await makeJsonPowerDBRequest('https://api.jsonpowerdb.com/api/irl/put', putRequestData);

    if (result && result.status === 200) {
        showMessage(`Student ${fullName} (Roll No: ${rollNo}) saved successfully!`, 'success');
        initForm(); // Reset form after saving
    } else {
        showMessage(`Failed to save student data. Error: ${result ? result.message : 'Unknown error'}`, 'danger');
    }
}

/**
 * Updates existing student data in JsonPowerDB.
 */
async function updateStudent() {
    if (!validateForm()) {
        return; // Stop if validation fails
    }

    const rollNo = rollNoInput.value.trim();
    const fullName = fullNameInput.value.trim();
    const studentClass = studentClassInput.value.trim();
    const birthDate = birthDateInput.value.trim();
    const address = addressInput.value.trim();
    const enrollmentDate = enrollmentDateInput.value.trim();

    const studentData = { // Re-create the full student object for update
        "Roll-No": rollNo,
        "Full-Name": fullName,
        "Class": studentClass,
        "Birth-Date": birthDate,
        "Address": address,
        "Enrollment-Date": enrollmentDate
    };

    const updateRequestData = {
        token: connToken,
        dbName: DB_NAME,
        rel: RELATION_NAME,
        jsonStr: JSON.stringify(studentData) // Corrected: stringify the entire studentData object for update
    };

    const result = await makeJsonPowerDBRequest('https://api.jsonpowerdb.com/api/irl/update', updateRequestData);

    if (result && result.status === 200) {
        showMessage(`Student ${fullName} (Roll No: ${rollNo}) updated successfully!`, 'success');
        initForm(); // Reset form after updating
    } else {
        showMessage(`Failed to update student data. Error: ${result ? result.message : 'Unknown error'}`, 'danger');
    }
}

/**
 * Resets the form and displays a confirmation message.
 */
function resetForm() {
    initForm();
    showMessage('Form has been reset.', 'success');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initForm(); // Initialize form on page load
});

// Trigger checkRollNo when focus leaves the Roll No field
rollNoInput.addEventListener('blur', checkRollNo);

// Optional: Trigger checkRollNo on Enter key press in Roll No field
rollNoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        checkRollNo();
    }
});

saveBtn.addEventListener('click', saveStudent);
updateBtn.addEventListener('click', updateStudent); // Changed from changeBtn to updateBtn
resetBtn.addEventListener('click', resetForm);

// Add real-time validation feedback on input for other fields
[fullNameInput, studentClassInput, birthDateInput, addressInput, enrollmentDateInput].forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.classList.remove('is-invalid');
        }
    });
});
