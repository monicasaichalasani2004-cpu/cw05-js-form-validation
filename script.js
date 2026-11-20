// CW-05: JavaScript form validation
// Keep the fields together so the same rules work for each one.
const form = document.getElementById('student-form');
const summary = document.getElementById('error-summary');
const resultSection = document.getElementById('result-section');

const fields = [
  { input: document.getElementById('student-id'), error: document.getElementById('id-error'), label: 'ID' },
  { input: document.getElementById('first-name'), error: document.getElementById('first-error'), label: 'First Name' },
  { input: document.getElementById('last-name'), error: document.getElementById('last-error'), label: 'Last Name' }
];

function getError(field) {
  const value = field.input.value.trim();

  if (value === '') {
    return field.label + ' is required.';
  }
  // IDs are numeric in the sample assignment. Do not change them to Number:
  // a student ID may start with zero.
  if (field.label === 'ID' && !/^\d+$/.test(value)) {
    return 'ID must contain numbers only.';
  }
  return '';
}

function showFieldError(field, message) {
  // The empty string removes an old warning when the field is corrected.
  field.error.innerHTML = message;
  field.input.classList.toggle('invalid', message !== '');
  field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function validateField(field) {
  const message = getError(field);
  showFieldError(field, message);
  return message;
}

// Update only the field being edited. Alerts are reserved for Add clicks.
fields.forEach(function (field) {
  field.input.addEventListener('input', function () {
    if (field.input.getAttribute('aria-invalid') === 'true') {
      validateField(field);
    }
    // An old summary should not continue to describe a previous attempt.
    summary.hidden = true;
    summary.innerHTML = '';
  });

  field.input.addEventListener('blur', function () {
    // Validate filled fields and fields previously marked as invalid.
    if (field.input.value.trim() !== '' || field.input.getAttribute('aria-invalid') === 'true') {
      validateField(field);
    }
  });
});

form.addEventListener('submit', function (event) {
  event.preventDefault(); // Stay on this page so the result can appear below.

  const errors = [];
  let firstInvalidField = null;

  fields.forEach(function (field) {
    const error = validateField(field);
    if (error) {
      errors.push(error);
      if (!firstInvalidField) firstInvalidField = field.input;
    }
  });

  if (errors.length > 0) {
    // innerHTML is safe here because the summary contains our own fixed
    // validation messages, not user-entered text.
    summary.innerHTML = '<strong>Please correct the following:</strong> ' + errors.join(' ');
    summary.hidden = false;

    // Loop through ALL errors, in the same order as the form fields.
    let alertText = 'Please correct the following errors:\n';
    for (let i = 0; i < errors.length; i++) {
      alertText += '\n' + (i + 1) + '. ' + errors[i];
    }
    window.alert(alertText);
    firstInvalidField.focus();
    return;
  }

  summary.hidden = true;
  summary.innerHTML = '';

  // textContent is safer than innerHTML when displaying user-supplied values.
  // Setting existing elements also replaces the previous result every time.
  document.getElementById('result-id').textContent = fields[0].input.value.trim();
  document.getElementById('result-first').textContent = fields[1].input.value.trim();
  document.getElementById('result-last').textContent = fields[2].input.value.trim();
  resultSection.hidden = false;

  form.reset();
  fields.forEach(function (field) { showFieldError(field, ''); });
});
