
import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:9999";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Registration states
  const [showRegister, setShowRegister] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Application states
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [status, setStatus] = useState("Applied");

  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch logged-in user's applications
  const fetchApplications = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/applications`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 401) {
        setIsLoggedIn(false);
        setApplications([]);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to fetch applications.");
      }

      const data = await response.json();

      setApplications(Array.isArray(data) ? data : []);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage(
        "Backend connection failed. Check Spring Boot."
      );
    }
  };

  // Check existing session when page loads
  useEffect(() => {
    fetchApplications();
  }, []);

  // Login
  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: loginEmail.trim(),
            password: loginPassword,
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        setMessage(data || "Login failed.");
        return;
      }

      setLoginPassword("");

      await fetchApplications();

      setMessage("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // Register a new user
  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!registerName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!registerEmail.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    if (registerPassword.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: registerName.trim(),
            email: registerEmail.trim(),
            password: registerPassword,
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        setMessage(data || "Registration failed.");
        return;
      }

      const registeredEmail = registerEmail.trim();

      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");

      setLoginEmail(registeredEmail);
      setLoginPassword("");
      setShowRegister(false);

      setMessage(
        "Registration successful! Please login."
      );
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // Clear application form
  const clearForm = () => {
    setCompanyName("");
    setJobRole("");
    setApplicationDate("");
    setInterviewDate("");
    setInterviewTime("");
    setJobLocation("");
    setStatus("Applied");
    setEditId(null);
  };

  // Add or update application with validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    // Validate required fields
    if (!companyName.trim()) {
      setMessage("Please enter the company name.");
      return;
    }

    if (!jobRole.trim()) {
      setMessage("Please enter the job role.");
      return;
    }

    if (!applicationDate) {
      setMessage("Please select the application date.");
      return;
    }

    if (!jobLocation.trim()) {
      setMessage("Please enter the job location.");
      return;
    }

    if (!status) {
      setMessage("Please select the application status.");
      return;
    }

    // Prepare application data
    const application = {
      companyName: companyName.trim(),
      jobRole: jobRole.trim(),
      applicationDate,
      interviewDate,
      interviewTime,
      jobLocation: jobLocation.trim(),
      status,
    };

    const url = editId
      ? `${API_URL}/api/applications/${editId}`
      : `${API_URL}/api/applications`;

    const method = editId ? "PUT" : "POST";

    setLoading(true);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(application),
      });

      const data = await response.text();

      if (response.status === 401) {
        setIsLoggedIn(false);
        setMessage("Please login again.");
        return;
      }

      if (!response.ok) {
        setMessage(
          data || "Unable to save application."
        );
        return;
      }

      setMessage(
        editId
          ? "Application updated successfully!"
          : "Application added successfully!"
      );

      clearForm();

      await fetchApplications();
    } catch (error) {
      console.error("Save error:", error);
      setMessage("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // Edit application
  const handleEdit = (app) => {
    setCompanyName(app.companyName || "");
    setJobRole(app.jobRole || "");
    setApplicationDate(app.applicationDate || "");
    setInterviewDate(app.interviewDate || "");
    setInterviewTime(app.interviewTime || "");
    setJobLocation(app.jobLocation || "");
    setStatus(app.status || "Applied");

    setEditId(app.id);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete application
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/applications/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.text();

      if (response.status === 401) {
        setIsLoggedIn(false);
        setMessage("Please login again.");
        return;
      }

      if (!response.ok) {
        setMessage(
          data || "Unable to delete application."
        );
        return;
      }

      setMessage("Application deleted successfully!");

      if (editId === id) {
        clearForm();
      }

      await fetchApplications();
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Unable to connect to the backend.");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    setIsLoggedIn(false);
    setApplications([]);
    clearForm();

    setLoginPassword("");
    setMessage("You have logged out.");
  };

  // Search applications
  const filteredApplications = applications.filter(
    (app) => {
      const searchText = search.toLowerCase();

      return (
        (app.companyName || "")
          .toLowerCase()
          .includes(searchText) ||
        (app.jobRole || "")
          .toLowerCase()
          .includes(searchText) ||
        (app.status || "")
          .toLowerCase()
          .includes(searchText) ||
        (app.jobLocation || "")
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

// Dashboard statistics
const totalApplications = applications.length;

const appliedCount = applications.filter(
  (app) => app.status === "Applied"
).length;

const assessmentCount = applications.filter(
  (app) => app.status === "Assessment"
).length;

const interviewCount = applications.filter(
  (app) => app.status === "Interview"
).length;

const selectedCount = applications.filter(
  (app) =>
    app.status === "Selected" ||
    app.status === "Offer"
).length;

const rejectedCount = applications.filter(
  (app) => app.status === "Rejected"
).length;


  // Login and Registration pages
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>CareerTrack</h1>

          <p>
            Track your job applications in one place.
          </p>

          <h2>
            {showRegister ? "Create Account" : "Login"}
          </h2>

          {message && (
            <div className="message" role="alert">
              {message}
            </div>
          )}

          {showRegister ? (
            // Registration form
            <form onSubmit={handleRegister}>
              <label>Full Name</label>

              <input
                type="text"
                value={registerName}
                onChange={(event) =>
                  setRegisterName(event.target.value)
                }
                placeholder="Enter your full name"
                required
              />

              <label>Email</label>

              <input
                type="email"
                value={registerEmail}
                onChange={(event) =>
                  setRegisterEmail(event.target.value)
                }
                placeholder="Enter your email"
                required
              />

              <label>Password</label>

              <input
                type="password"
                value={registerPassword}
                onChange={(event) =>
                  setRegisterPassword(event.target.value)
                }
                placeholder="Create a password"
                minLength={6}
                required
              />

              <label>Confirm Password</label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Re-enter your password"
                minLength={6}
                required
              />

              <button
                type="submit"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Register"}
              </button>

              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => {
                    setShowRegister(false);
                    setMessage("");
                  }}
                >
                  Login
                </button>
              </p>
            </form>
          ) : (
            // Login form
            <>
              <form onSubmit={handleLogin}>
                <label>Email</label>

                <input
                  type="email"
                  value={loginEmail}
                  onChange={(event) =>
                    setLoginEmail(event.target.value)
                  }
                  placeholder="Enter your registered email"
                  required
                />

                <label>Password</label>

                <input
                  type="password"
                  value={loginPassword}
                  onChange={(event) =>
                    setLoginPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Please wait..." : "Login"}
                </button>
              </form>

              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => {
                    setShowRegister(true);
                    setMessage("");
                  }}
                >
                  Register
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>CareerTrack</h1>
          <p>
            Your personal job application tracker
          </p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {message && (
        <div className="message" role="alert">
          {message}
        </div>
      )}

      {/* Dashboard statistics */}
<section className="dashboard-cards">
  <div className="dashboard-card total">
    <h3>Total Applications</h3>
    <p>{totalApplications}</p>
  </div>

  <div className="dashboard-card applied">
    <h3>Applied</h3>
    <p>{appliedCount}</p>
  </div>

  <div className="dashboard-card assessment">
    <h3>Assessment</h3>
    <p>{assessmentCount}</p>
  </div>

  <div className="dashboard-card interview">
    <h3>Interviews</h3>
    <p>{interviewCount}</p>
  </div>

  <div className="dashboard-card selected">
    <h3>Selected</h3>
    <p>{selectedCount}</p>
  </div>

  <div className="dashboard-card rejected">
    <h3>Rejected</h3>
    <p>{rejectedCount}</p>
  </div>
</section>


      {/* Add or edit application form */}
      <section className="form-section">
        <h2>
          {editId
            ? "Edit Job Application"
            : "Add Job Application"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="application-form"
        >
          <div className="form-group">
            <label>Company Name</label>

            <input
              type="text"
              value={companyName}
              onChange={(event) =>
                setCompanyName(event.target.value)
              }
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="form-group">
            <label>Job Role</label>

            <input
              type="text"
              value={jobRole}
              onChange={(event) =>
                setJobRole(event.target.value)
              }
              placeholder="Enter job role"
              required
            />
          </div>

          <div className="form-group">
            <label>Application Date</label>

            <input
              type="date"
              value={applicationDate}
              onChange={(event) =>
                setApplicationDate(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Interview Date (Optional)</label>

            <input
              type="date"
              value={interviewDate}
              onChange={(event) =>
                setInterviewDate(event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Interview Time (Optional)</label>

            <input
              type="time"
              value={interviewTime}
              onChange={(event) =>
                setInterviewTime(event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Job Location</label>

            <input
              type="text"
              value={jobLocation}
              onChange={(event) =>
                setJobLocation(event.target.value)
              }
              placeholder="Enter job location"
              required
            />
          </div>

          <div className="form-group">
            <label>Application Status</label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              required
            >
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : editId
                ? "Update Application"
                : "Add Application"}
            </button>

            {editId && (
              <button
                type="button"
                className="cancel-button"
                onClick={clearForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Applications table */}
      <section className="table-section">
        <h2>My Job Applications</h2>

        <input
          className="search-input"
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search company, role, status or location..."
        />

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Job Role</th>
                <th>Applied Date</th>
                <th>Interview Date</th>
                <th>Interview Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.companyName}</td>
                    <td>{app.jobRole}</td>
                    <td>{app.applicationDate || "-"}</td>
                    <td>{app.interviewDate || "-"}</td>
                    <td>{app.interviewTime || "-"}</td>
                    <td>{app.jobLocation || "-"}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          (app.status || "")
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(app)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(app.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="empty-message"
                  >
                    No job applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
