/*
 * Fetch the list of patients from the backend and display them on the webpage
 */

document.addEventListener('DOMcontentLoaded', () => {
  fetchPatients();
});

// Implementing pagination and patient search by ID
async function fetchPatients(page = 1, limit = 10, searchQuery = '') {
  try {
    let url = `/patients?page=${page}&limit=${limit}`;
    if (searchQuery) {
      url += `&nationalId=${searchQuery}`;
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') // Assuming token is stored in localStorage after login
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch patients');
    }
    const patients = await response.json();
    displayPatients(patients);
  } catch (error) {
    console.error(error.message);
    const errorContainer = document.getElementById('patientList');
    errorContainer.innerHTML = `<p class="error-message">Error fetching patients: ${error.message}. Please try again later.</p>`;
  }
}

// An event listener to trigger search in the search input field.
document.addEventListener('DOMContentLoaded', () => {
  // Other initialization code
  
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const searchQuery = searchInput.value.trim();
    fetchPatients(1, 10, searchQuery);
  });
});

function displayPatients(patients) {
  const patientListContainer = document.getElementById('patientList');
  patientListContainer.innerHTML = '';
  patients.forEach(patient => {
    const patientItem = document.createElement('div');
    patientItem.classList.add('patient-item');
    patientItem.innerHTML = `
    <h3>${patient.nationalId}</h3>
    <p>Family History: ${patient.familyHistory}</p>
    <!-- More patient details here -->
    `;
    patientListContainer.appendChild(patientItem);
  });
}

/*
 * handle the login form submission and authenticate patients with the backend
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', login);
});

async function login(event) {
  event.preventDefault();

  const nationalId = document.getElementById('nationalId').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/patients/login', {
      methods: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nationalId, password })
    });
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    const data = await response.json();
    localStorage.setItem('token', data.token);
    // Redirect to patient dashboard or reload page to fetch patient data
    window.location.reload();
  } catch (error) {
    const loginError = document.getElementById('loginError');
    loginError.textContent = error.message;
  }
}

/* 
 * Fetch patients medical history and display it on the dashboard.
 * Add functionality to update the patients profile information.
 */
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    // If token exists, fetch patient data and display dashboard
    fetchPatientData(token);
  } else {
    // If token doesn't exist, display login form
    document.getElementById('loginForm').style.display = 'block';
  }

  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', login);

  const updateProfileForm = document.getElementById('updateProfileForm');
  updateProfileForm.addEventListener('submit', updateProfile);
})

async function fetchPatientData(token) {
  try {
    const response = await fetch('/patients', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch patient data');
    }
    const patient = await response.json();
    displayDashboard(patient);
  } catch (error) {
    console.error(error.message);
  }
}

function displayDashboard(patient) {
  // Hide login form and display patient dashboard
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('patientDashboard').style.display = 'block';

  // Display patient name
  document.getElementById('patientName').textContent = patient.nationalId;

  // Display medical history
  const medicalHistoryContainer = document.getElementById('medicalHistory');
  medicalHistoryContainer.innerHTML = '';
  if (patient.medicalHistory.length > 0) {
    patient.medicalHistory.forEach(history => {
      const historyItem = document.createElement('div');
      historyItem.innerHTML = `
        <h3>Date: ${new Date(history.date).toLocaleDateString()}</h3>
        <p>Hospital: ${history.hospital}</p>
        <p>Diagnosis: ${history.diagnosis}</p>
        <p>Medications: ${history.medications.join(', ')}</p>
        `;
      medicalHistoryContainer.appendChild(historyItem);
    });
  } else {
    medicalHistoryContainer.innerHTML = '<p>No medical history available</p>';
  }

  // Prefill profile form with current family history
  document.getElementById('familyHistory').value = patient.familyHistory;
}

// This function includes password update functionality
async function updateProfile(event) {
  event.preventDefault();

  const familyHistory = document.getElementById('familyHistory').value;
  const newPassword = document.getElementById('newPassword').value;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/patients/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'applicaion/json',
        'Authentication': token
      },
      body: JSON.stringify({ familyHistory, newPassword })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }
    document.getElementById('profileUpdateSuccess').textContent = 'Profile updated successfully';
    document.getElementById('profileUpdateError').textContent = '';
  } catch (error) {
    console.error(error.message);
    document.getElementById('profileUpdateError').textContent = `Error updating profile: ${error.message}. Please try again later.`;
  }
}

// handle logout functionality
document.addEventListener('DOMContentLoaded', () => {
  // Check if token exists in localStorage
  const token = localStorage.getItem('token');
  if (token) {
    // If token exists, fetch patient data and display dashboard
    fetchPatientData(token);
  } else {
    // If token doesn't exist, display login form
    document.getElementById('loginForm').style.display = 'block';
  }

  // Event listener for login form submission
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', login);

  // Event listener for update profile form submission
  const updateProfileForm = document.getElementById('updateProfileForm');
  updateProfileForm.addEventListener('submit', updateProfile);

  // Event listener for logout button click
  const logoutButton = document.getElement('logoutButton');
  logoutButton.addEventListener('click', logout);
});

async function logout() {
  // Clear token from localStorage and reload page to show login form
  localStorage.removeItem('token');
  window.location.reload();
}
