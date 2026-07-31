import { lazy, Suspense, useEffect, useState } from "react";
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiTool,
  FiMapPin,
  FiBookOpen,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiRefreshCw,
  FiLogOut,
  FiX,
  FiSave,
} from "react-icons/fi";
import { API_URL } from "../config";

const EstimateModal = lazy(() => import("../components/Estimate/EstimateModal"));
import "./Admin.css";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  service: "",
  location: "",
  message: "",
};

const SERVICE_OPTIONS = [
  "Carpentry",
  "Electrical",
  "Painting",
  "Welding",
  "General Repair",
];

const LOCATION_OPTIONS = [
  "Bangalore",
  "Mysore",
  "Tumkur",
  "Chennai",
  "Hyderabad",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[0-9\s-]{10,15}$/;

const validateField = (name, value) => {
  switch (name) {
    case "name":
      return value.trim() ? "" : "Name is required";
    case "email":
      if (!value.trim()) return "Email is required";
      return EMAIL_REGEX.test(value.trim()) ? "" : "Enter a valid email address";
    case "phone":
      if (!value.trim()) return "Phone is required";
      return PHONE_REGEX.test(value.trim()) ? "" : "Enter a valid phone number";
    case "service":
      return value ? "" : "Please select a service";
    case "location":
      return value ? "" : "Please select a location";
    default:
      return "";
  }
};

const validateForm = (form) => {
  const errors = {};
  ["name", "email", "phone", "service", "location"].forEach((field) => {
    const message = validateField(field, form[field]);
    if (message) errors[field] = message;
  });
  return errors;
};

const navItems = [
  { label: "Dashboard", icon: FiHome },
  { label: "Bookings", icon: FiCalendar, active: true },
  { label: "Customers", icon: FiUsers },
  { label: "Reports", icon: FiBarChart2 },
  { label: "Settings", icon: FiSettings },
];

function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">E</div>
        <div className="brand-text">
          <h2>Elshadai</h2>
          <span>ENTERPRISES</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`nav-item${item.active ? " active" : ""}`}
            >
              <Icon />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">Admin Panel v1.0</div>
    </aside>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        <Icon />
      </div>
      <div className="stat-info">
        <p>{value}</p>
        <h3>{title}</h3>
      </div>
    </div>
  );
}

function Admin() {
  const [token, setToken] = useState(
    () => localStorage.getItem("admin_token") || ""
  );
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [estimateBooking, setEstimateBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken("");
    setBookings([]);
  };

  // Generic handler for all form fields
  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Once the user has tried to submit, re-validate live as they type
    if (submitted) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  // Validate a single field when the user leaves it (onBlur)
  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
  };

  // Fetch all bookings
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    const loadBookings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          handleLogout();
          return;
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBookings();
  }, [token]);

  // Login: exchange the password for the admin token
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("admin_token", data.token);
      setToken(data.token);
      setLoginPassword("");
      setLoginError("");
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginError("Unable to connect to the server");
    }
  };

  // Delete booking
  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        setBookings(bookings.filter((booking) => booking._id !== id));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Something went wrong!");
    }
  };

  // Edit booking
  const handleEdit = (booking) => {
    setEditingBooking(booking);

    setErrors({});
    setSubmitted(false);

    setFormData({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      service: booking.service,
      location: booking.location,
      message: booking.message,
    });
  };

  // Update booking
  const updateBooking = async () => {
    try {
      const response = await fetch(
        `${API_URL}/bookings/${editingBooking._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        fetchBookings();

        setEditingBooking(null);

        resetForm();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Something went wrong!");
    }
  };

  const closeEditor = () => {
    setEditingBooking(null);

    setErrors({});
    setSubmitted(false);

    resetForm();
  };

  // Dashboard Statistics
  const totalBookings = bookings.length;

  const totalServices = new Set(
    bookings.map((booking) => booking.service)
  ).size;

  const totalLocations = new Set(
    bookings.map((booking) => booking.location)
  ).size;

  const totalCustomers = new Set(
    bookings.map((booking) => booking.email)
  ).size;

  // Search Filter
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Keep existing database values in the dropdown if they are not in the list
  const serviceOptions = SERVICE_OPTIONS.includes(formData.service)
    ? SERVICE_OPTIONS
    : [formData.service, ...SERVICE_OPTIONS];

  const locationOptions = LOCATION_OPTIONS.includes(formData.location)
    ? LOCATION_OPTIONS
    : [formData.location, ...LOCATION_OPTIONS];

  const isFormValid = Object.keys(validateForm(formData)).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    setSubmitted(true);

    if (Object.keys(validationErrors).length > 0) return;

    updateBooking();
  };

  if (!token) {
    return (
      <div className="login-screen">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="login-logo">E</div>
          <h2>Admin Login</h2>
          <p>Elshadai Enterprises — Booking Dashboard</p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          {loginError && <span className="field-error">{loginError}</span>}
          <button type="submit" className="btn btn-save login-btn">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Booking Dashboard</h1>
            <p>Manage all customer bookings from one place</p>
          </div>
          <div className="header-buttons">
            <button
              className="btn btn-refresh"
              onClick={fetchBookings}
              disabled={isLoading}
            >
              <FiRefreshCw /> {isLoading ? "Loading..." : "Refresh"}
            </button>
            <button className="btn btn-logout" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <StatCard
            title="Total Bookings"
            value={totalBookings}
            icon={FiBookOpen}
            color="#D4AF37"
          />
          <StatCard
            title="Services"
            value={totalServices}
            icon={FiTool}
            color="#2563eb"
          />
          <StatCard
            title="Locations"
            value={totalLocations}
            icon={FiMapPin}
            color="#059669"
          />
          <StatCard
            title="Customers"
            value={totalCustomers}
            icon={FiUsers}
            color="#d97706"
          />
        </section>

        <section className="table-card">
          <div className="table-toolbar">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, email, service or location..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>Location</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      Loading bookings...
                    </td>
                  </tr>
                ) : filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="td-name">
                        <span className="avatar">{booking.name.charAt(0)}</span>
                        {booking.name}
                      </td>
                      <td>{booking.email}</td>
                      <td>{booking.phone}</td>
                      <td>
                        <span className="badge">{booking.service}</span>
                      </td>
                      <td>{booking.location}</td>
                      <td className="td-message">{booking.message}</td>

                      <td>
                        <div className="action-btns">
                          <button
                            className="icon-btn estimate-btn"
                            title="Create Estimate"
                            onClick={() => setEstimateBooking(booking)}
                          >
                            <FiFileText />
                          </button>

                          <button
                            className="icon-btn edit-btn"
                            title="Edit"
                            onClick={() => handleEdit(booking)}
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            className="icon-btn delete-btn"
                            title="Delete"
                            onClick={() => deleteBooking(booking._id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {estimateBooking && (
        <Suspense fallback={null}>
          <EstimateModal
            booking={estimateBooking}
            onClose={() => setEstimateBooking(null)}
          />
        </Suspense>
      )}

      {editingBooking && (
        <div className="modal-overlay" onClick={closeEditor}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Booking</h2>
              <button className="icon-btn close-btn" onClick={closeEditor}>
                <FiX />
              </button>
            </div>

            <form className="modal-body" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={errors.name ? "error" : ""}
                  aria-invalid={errors.name ? true : false}
                />
                {errors.name && (
                  <span className="field-error">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={errors.email ? "error" : ""}
                  aria-invalid={errors.email ? true : false}
                />
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={errors.phone ? "error" : ""}
                  aria-invalid={errors.phone ? true : false}
                />
                {errors.phone && (
                  <span className="field-error">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label>Service</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={errors.service ? "error" : ""}
                  aria-invalid={errors.service ? true : false}
                >
                  <option value="">Select a Service</option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <span className="field-error">{errors.service}</span>
                )}
              </div>

              <div className="form-group">
                <label>Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={errors.location ? "error" : ""}
                  aria-invalid={errors.location ? true : false}
                >
                  <option value="">Select a Location</option>
                  {locationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.location && (
                  <span className="field-error">{errors.location}</span>
                )}
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleFieldChange}
                />
              </div>
            </form>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={closeEditor}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-save"
                disabled={!isFormValid}
              >
                <FiSave /> Update Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
