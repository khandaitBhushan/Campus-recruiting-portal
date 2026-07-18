import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!user) {
      setDisplayName("");
      return;
    }

    if (user.role === "ADMIN") {
      setDisplayName("Admin");
      return;
    }

    const fallbackName = user.email
      .split("@")[0]
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    setDisplayName(fallbackName);

    if (user.profileId) {
      const fetchName = async () => {
        try {
          if (user.role === "STUDENT") {
            const response = await api.get(`/api/students/${user.profileId}`);
            setDisplayName(response.data.name);
          } else if (user.role === "COMPANY") {
            const response = await api.get(`/api/companies/${user.profileId}`);
            setDisplayName(response.data.name);
          }
        } catch (error) {
          console.error("Failed to load profile name:", error);
        }
      };

      fetchName();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (location.pathname.startsWith("/student/")) {
    return null;
  }

  return (
    <nav
      className="surface-card"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "18px",
        width: "min(1440px, calc(100% - 32px))",
        margin: "16px auto 10px",
        padding: "16px 20px",
        background: "color-mix(in oklab, var(--surface-panel) 92%, white)",
        borderRadius: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            display: "grid",
            placeItems: "center",
            width: "38px",
            height: "38px",
            borderRadius: "14px",
            background: "var(--navy-600)",
            color: "white",
            boxShadow: "0 10px 22px rgba(51, 79, 150, 0.24)",
          }}
        >
          <BriefcaseBusiness size={18} />
        </div>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "var(--ink-900)",
            fontSize: "20px",
            fontWeight: "800",
            letterSpacing: "-0.02em",
          }}
        >
          Campus recruiting{" "}
          <span style={{ color: "var(--navy-600)" }}>portal</span>
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        {user && user.role === "COMPANY" && (
          <>
            <NavLink to="/company/dashboard" style={navLinkStyle}>
              Dashboard
            </NavLink>
            <NavLink to="/company/post-job" style={navLinkStyle}>
              Post a job
            </NavLink>
            <NavLink to="/company/jobs" style={navLinkStyle}>
              Job openings
            </NavLink>
          </>
        )}

        {user && user.role === "ADMIN" && (
          <>
            <NavLink to="/admin/dashboard" style={navLinkStyle}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/companies" style={navLinkStyle}>
              Companies
            </NavLink>
            <NavLink to="/admin/jobs/pending" style={navLinkStyle}>
              Pending jobs
            </NavLink>
            <NavLink to="/admin/analytics" style={navLinkStyle}>
              Analytics
            </NavLink>
            <NavLink to="/admin/students" style={navLinkStyle}>
              Students
            </NavLink>
          </>
        )}

        {user ?
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "var(--navy-600)",
              }}
            >
              Welcome, {displayName} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ fontSize: "14px" }}
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        : <Link
            to="/login"
            className="btn btn-primary"
            style={{ fontSize: "14px" }}
          >
            Login
          </Link>
        }
      </div>
    </nav>
  );
};

const navLinkStyle = ({ isActive }) => ({
  textDecoration: "none",
  color: isActive ? "var(--navy-600)" : "var(--ink-700)",
  fontSize: "15px",
  fontWeight: "700",
});

export default Navbar;
