import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, LogOut, Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [displayName, setDisplayName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
    setMobileOpen(false);
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
        flexDirection: "column",
        width: "min(1440px, calc(100% - 24px))",
        margin: "12px auto 10px",
        padding: "14px 20px",
        background: "color-mix(in oklab, var(--surface-panel) 94%, white)",
        borderRadius: "20px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Top Navbar Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "grid",
              placeItems: "center",
              width: "36px",
              height: "36px",
              borderRadius: "12px",
              background: "var(--navy-600)",
              color: "white",
              boxShadow: "0 8px 18px rgba(51, 79, 150, 0.2)",
              flexShrink: 0,
            }}
          >
            <BriefcaseBusiness size={18} />
          </div>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "var(--ink-900)",
              fontSize: "clamp(16px, 2.5vw, 19px)",
              fontWeight: "800",
              letterSpacing: "-0.02em",
            }}
          >
            Campus recruiting{" "}
            <span style={{ color: "var(--navy-600)" }}>portal</span>
          </Link>
        </div>

        {/* Desktop Navigation Links & User Bar */}
        <div className="navbar-desktop-content">
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

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "var(--navy-600)",
                  background: "var(--navy-100)",
                  padding: "4px 10px",
                  borderRadius: "999px",
                }}
              >
                {displayName} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ fontSize: "13px", padding: "8px 14px" }}
              >
                <LogOut size={15} />
                Log out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ fontSize: "14px", padding: "8px 18px" }}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="navbar-toggle-btn"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer (Visible on <= 768px when opened) */}
      <div className={`navbar-mobile-drawer ${mobileOpen ? "open" : ""}`}>
        {user && user.role === "COMPANY" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <NavLink to="/company/dashboard" style={mobileNavLinkStyle} onClick={() => setMobileOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/company/post-job" style={mobileNavLinkStyle} onClick={() => setMobileOpen(false)}>
              Post a job
            </NavLink>
            <NavLink to="/company/jobs" style={mobileNavLinkStyle} onClick={() => setMobileOpen(false)}>
              Job openings
            </NavLink>
          </div>
        )}

        {user && user.role === "ADMIN" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <NavLink to="/admin/dashboard" style={mobileNavLinkStyle} onClick={() => setMobileOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/companies" style={mobileNavLinkStyle} onClick={() => setMobileOpen(false)}>
              Companies
            </NavLink>
            <NavLink to="/admin/jobs/pending" style={mobileNavLinkStyle} onClick={() => setMobileOpen(false)}>
              Pending jobs
            </NavLink>
            <NavLink to="/admin/analytics" style={mobileNavLinkStyle} onClick={() => setMobileOpen(false)}>
              Analytics
            </NavLink>
            <NavLink to="/admin/students" style={mobileNavLinkStyle} onClick={() => setMobileOpen(false)}>
              Students
            </NavLink>
          </div>
        )}

        {user ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              paddingTop: "10px",
              borderTop: "1px solid var(--line-soft)",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "var(--navy-600)",
              }}
            >
              Signed in as: {displayName} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ width: "100%", justifyContent: "center", fontSize: "14px" }}
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", fontSize: "14px" }}
            onClick={() => setMobileOpen(false)}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

const navLinkStyle = ({ isActive }) => ({
  textDecoration: "none",
  color: isActive ? "var(--navy-600)" : "var(--ink-700)",
  fontSize: "14px",
  fontWeight: "700",
  padding: "6px 10px",
  borderRadius: "8px",
  background: isActive ? "var(--navy-100)" : "transparent",
  transition: "all 0.15s ease",
});

const mobileNavLinkStyle = ({ isActive }) => ({
  textDecoration: "none",
  color: isActive ? "var(--navy-600)" : "var(--ink-800)",
  fontSize: "15px",
  fontWeight: "700",
  padding: "10px 14px",
  borderRadius: "10px",
  background: isActive ? "var(--navy-100)" : "var(--surface-muted)",
  display: "block",
});

export default Navbar;
