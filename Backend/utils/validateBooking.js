const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[0-9\s-]{10,15}$/;

const REQUIRED_FIELDS = {
  name: "Name is required",
  email: "Email is required",
  phone: "Phone is required",
  service: "Please select a service",
  location: "Please select a location",
};

// Returns an object of { field: errorMessage } - empty object means valid
function validateBooking(data = {}) {
  const errors = {};

  for (const [field, message] of Object.entries(REQUIRED_FIELDS)) {
    if (!(data[field] || "").trim()) {
      errors[field] = message;
    }
  }

  if (data.email && !EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (data.phone && !PHONE_REGEX.test(data.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }

  return errors;
}

module.exports = { validateBooking };
