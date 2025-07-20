// Get references to form elements and buttons
const employeeIdInput = document.getElementById('employeeId');
const employeeNameInput = document.getElementById('employeeName');
const salaryInput = document.getElementById('salary');
const hraInput = document.getElementById('hra');
const daInput = document.getElementById('da');
const deductionInput = document.getElementById('deduction');

const saveBtn = document.getElementById('saveBtn');
const changeBtn = document.getElementById('changeBtn');
const resetBtn = document.getElementById('resetBtn');
const messageBox = document.getElementById('messageBox');

// Connection Token (added as per user request)
const connToken = "764066628|7385821557891514811|764067497";

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
 * - Disables all fields except Employee ID.
 * - Disables Save, Change, and Reset buttons.
 * - Sets focus to Employee ID.
 */
function initForm() {
    // Clear all input fields
    employeeIdInput.value = '';
    employeeNameInput.value = '';
    salaryInput.value = '';
    hraInput.value = '';
    daInput.value = '';
    deductionInput.value = '';

    // Disable all fields except Employee ID
    employeeIdInput.disabled = false;
    employeeNameInput.disabled = true;
    salaryInput.disabled = true;
    hraInput.disabled = true;
    daInput.disabled = true;
    deductionInput.disabled = true;

    // Disable all control buttons
    saveBtn.disabled = true;
    changeBtn.disabled = true;
    resetBtn.disabled = true;

    // Remove validation feedback
    employeeIdInput.classList.remove('is-invalid');
    employeeNameInput.classList.remove('is-invalid');
    salaryInput.classList.remove('is-invalid');
    hraInput.classList.remove('is-invalid');
    daInput.classList.remove('is-invalid');
    deductionInput.classList.remove('is-invalid');

    // Set focus to Employee ID
    employeeIdInput.focus();
}

/**
 * Validates all form fields to ensure they are not empty.
 * Adds Bootstrap 'is-invalid' class for visual feedback.
 * @returns {boolean} True if all fields are valid, false otherwise.
 */
function validateForm() {
    let isValid = true;
    const fields = [
        { element: employeeIdInput, name: 'Employee ID' },
        { element: employeeNameInput, name: 'Employee Name' },
        { element: salaryInput, name: 'Salary' },
        { element: hraInput, name: 'HRA' },
        { element: daInput, name: 'DA' },
        { element: deductionInput, name: 'Deduction' }
    ];

    // Check if employeeIdInput is disabled, if so, skip its validation for empty check
    // as it's handled by the `checkEmployeeId` logic for existence
    const isIdDisabled = employeeIdInput.disabled;

    fields.forEach(field => {
        // If the employeeIdInput is disabled, it means we are in 'change' mode,
        // and its value is already populated and validated for existence.
        // So, we only check other fields for emptiness.
        if (isIdDisabled && field.element.id === 'employeeId') {
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
 * Checks if an employee ID exists in local storage.
 * If it exists, populates the form and enables Change/Reset.
 * If not, enables Save/Reset and allows new data entry.
 */
function checkEmployeeId() {
    const id = employeeIdInput.value.trim();

    // Clear previous validation state for ID
    employeeIdInput.classList.remove('is-invalid');

    if (id === '') {
        // If ID is empty, reset form to initial state
        initForm();
        return;
    }

    const employeeData = localStorage.getItem(`employee_${id}`);

    if (employeeData) {
        // Employee exists: populate form, enable Change/Reset
        const employee = JSON.parse(employeeData);
        employeeNameInput.value = employee.name;
        salaryInput.value = employee.salary;
        hraInput.value = employee.hra;
        daInput.value = employee.da;
        deductionInput.value = employee.deduction;

        // Disable Employee ID field
        employeeIdInput.disabled = true;

        // Enable other fields
        employeeNameInput.disabled = false;
        salaryInput.disabled = false;
        hraInput.disabled = false;
        daInput.disabled = false;
        deductionInput.disabled = false;

        // Enable Change and Reset buttons, disable Save
        saveBtn.disabled = true;
        changeBtn.disabled = false;
        resetBtn.disabled = false;

        // Move cursor to Employee Name
        employeeNameInput.focus();
        showMessage(`Employee ID ${id} found. You can change the data.`, 'success');
    } else {
        // Employee does not exist: clear other fields, enable Save/Reset
        employeeNameInput.value = '';
        salaryInput.value = '';
        hraInput.value = '';
        daInput.value = '';
        deductionInput.value = '';

        // Enable other fields
        employeeNameInput.disabled = false;
        salaryInput.disabled = false;
        hraInput.disabled = false;
        daInput.disabled = false;
        deductionInput.disabled = false;

        // Enable Save and Reset buttons, disable Change
        saveBtn.disabled = false;
        changeBtn.disabled = true;
        resetBtn.disabled = false;

        // Move cursor to Employee Name
        employeeNameInput.focus();
        showMessage(`Employee ID ${id} not found. Please enter new data.`, 'success');
    }
}

/**
 * Saves new employee data to local storage.
 */
function saveEmployee() {
    if (!validateForm()) {
        return; // Stop if validation fails
    }

    const id = employeeIdInput.value.trim();
    const name = employeeNameInput.value.trim();
    const salary = parseFloat(salaryInput.value);
    const hra = parseFloat(hraInput.value);
    const da = parseFloat(daInput.value);
    const deduction = parseFloat(deductionInput.value);

    const employee = { id, name, salary, hra, da, deduction };

    // Check if ID already exists (should ideally be handled by checkEmployeeId, but good to double check)
    if (localStorage.getItem(`employee_${id}`)) {
        showMessage(`Employee with ID ${id} already exists. Use Change button to update.`, 'danger');
        return;
    }

    localStorage.setItem(`employee_${id}`, JSON.stringify(employee));
    showMessage(`Employee ${name} (ID: ${id}) saved successfully!`, 'success');
    initForm(); // Reset form after saving
}

/**
 * Updates existing employee data in local storage.
 */
function changeEmployee() {
    if (!validateForm()) {
        return; // Stop if validation fails
    }

    const id = employeeIdInput.value.trim();
    const name = employeeNameInput.value.trim();
    const salary = parseFloat(salaryInput.value);
    const hra = parseFloat(hraInput.value);
    const da = parseFloat(daInput.value);
    const deduction = parseFloat(deductionInput.value);

    const employee = { id, name, salary, hra, da, deduction };

    // Check if ID exists before attempting to change
    if (!localStorage.getItem(`employee_${id}`)) {
        showMessage(`Employee with ID ${id} does not exist. Use Save button to add.`, 'danger');
        return;
    }

    localStorage.setItem(`employee_${id}`, JSON.stringify(employee));
    showMessage(`Employee ${name} (ID: ${id}) updated successfully!`, 'success');
    initForm(); // Reset form after changing
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

// Trigger checkEmployeeId when focus leaves the Employee ID field
employeeIdInput.addEventListener('blur', checkEmployeeId);

// Optional: Trigger checkEmployeeId on Enter key press in Employee ID field
employeeIdInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        checkEmployeeId();
    }
});

saveBtn.addEventListener('click', saveEmployee);
changeBtn.addEventListener('click', changeEmployee);
resetBtn.addEventListener('click', resetForm);

// Add real-time validation feedback on input for other fields
[employeeNameInput, salaryInput, hraInput, daInput, deductionInput].forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.classList.remove('is-invalid');
        }
    });
});
