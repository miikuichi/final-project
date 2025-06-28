// NavBar for Login, Admin, and HR Employee
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

export function LoginNavBar({ onHome, onIssueTicket }) {
  return (
    <nav className="navbar login-navbar">
      <div className="navbar-logo">PayrollPro</div>
      <button onClick={onHome}>Home</button>
      <button onClick={onIssueTicket}>Issue Ticket</button>
    </nav>
  );
}

export function AdminNavBar({ onHome, onLogout }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/users/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(!!data && !!data.username))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      navigate("/admin");
    }
  };

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        await fetch("http://localhost:8080/api/users/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        // Optionally handle error
      } finally {
        localStorage.removeItem("userRole");
        navigate("/");
      }
    }
  };

  return (
    <nav className="navbar admin-navbar">
      <div className="navbar-logo">PayrollPro</div>
      <button onClick={handleHome}>Home</button>
      {isLoggedIn && <button onClick={handleLogout}>Log out</button>}
    </nav>
  );
}

export function HRNavBar({ onHome, onIssueTicket, onLogout }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/users/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(!!data && !!data.username))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleHome = async () => {
    if (onHome) {
      onHome();
    } else {
      try {
        const res = await fetch("http://localhost:8080/api/users/session", {
          credentials: "include",
        });
        const data = await res.json();
        if (data && data.username) {
          navigate("/hr");
        } else {
          navigate("/");
        }
      } catch {
        navigate("/");
      }
    }
  };

  const handleIssueTicket = () => {
    if (onIssueTicket) {
      onIssueTicket();
    } else {
      navigate("/issue-ticket");
    }
  };

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        await fetch("http://localhost:8080/api/users/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        // Optionally handle error
      } finally {
        localStorage.removeItem("userRole");
        navigate("/");
      }
    }
  };

  return (
    <nav className="navbar hr-navbar">
      <div className="navbar-logo">PayrollPro</div>
      <button onClick={handleHome}>Home</button>
      <button onClick={handleIssueTicket}>Issue Ticket</button>
      {isLoggedIn && <button onClick={handleLogout}>Log out</button>}
    </nav>
  );
}
