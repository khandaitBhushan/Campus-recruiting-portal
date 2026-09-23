import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, LogOut, Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const COMPANY_LINKS = [
  { to: "/company/dashboard", label: "Dashboard" },
  { to: "/company/post-job", label: "Post a job" },
  { to: "/company/jobs", label: "Job openings" },
];

const ADMIN_LINKS = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/companies", label: "Companies" },
  { to: "/admin/jobs/pending", label: "Pending jobs" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/students", label: "Students" },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [displayName, setDisplayName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

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

    const fallback = user.email.split("@")[0].split(".").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
    setDisplayName(fallback);

    if (user.profileId) {
      const endpoint = user.role === "STUDENT" ? `/api/students/${user.profileId}` : `/api/companies/${user.profileId}`;
      api.get(endpoint)
        .then((res) => setDisplayName(res.data.name))
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate("/login");
  };

  if (location.pathname.startsWith("/student/")) return null;

  const links = user?.role === "ADMIN" ? ADMIN_LINKS : user?.role === "COMPANY" ? COMPANY_LINKS : [];

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "grid", placeItems: "center", width: "36px", height: "36px", borderRadius: "12px", background: "var(--navy-600)", color: "white", flexShrink: 0 }}>
            <BriefcaseBusiness size={18} />
          </div>
          <Link to="/" style={{ textDecoration: "none", color: "var(--ink-900)", fontSize: "clamp(16px, 2.5vw, 19px)", fontWeight: "800", letterSpacing: "-0.02em" }}>
            Campus recruiting <span style={{ color: "var(--navy-600)" }}>portal</span>
          </Link>
        </div>

        {/* Desktop Links & User Bar */}
        <div className="navbar-desktop-content">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} style={navLinkStyle}>
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--navy-600)", background: "var(--navy-100)", padding: "4px 10px", borderRadius: "999px" }}>
                {displayName} ({user.role})
              </span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ fontSize: "13px", padding: "8px 14px" }}>
                <LogOut size={15} /> Log out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ fontSize: "14px", padding: "8px 18px" }}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button className="navbar-toggle-btn" onClick={() => setMobileOpen((prev) => !prev)} aria-label="Toggle menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`navbar-mobile-drawer ${mobileOpen ? "open" : ""}`}>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} style={mobileNavLinkStyle} onClick={() => setMobileOpen(false)}>
            {link.label}
          </NavLink>
        ))}

        {user ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "10px", borderTop: "1px solid var(--line-soft)" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--navy-600)" }}>
              Signed in as: {displayName} ({user.role})
            </span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ width: "100%", justifyContent: "center", fontSize: "14px" }}>
              <LogOut size={16} /> Log out
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "14px" }} onClick={() => setMobileOpen(false)}>
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
