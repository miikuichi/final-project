// NavBar for Login, Admin, and HR Employee
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import "../styles.css";

export function LoginNavBar({ onHome, onIssueTicket }) {
  return (
    <nav className="navbar login-navbar">
      <div className="navbar-left">
        <div className="navbar-logo">PayrollPro</div>
      </div>
      <div className="navbar-nav">
        <Button onClick={onHome} label="Home" />
        <Button onClick={onIssueTicket} label="Issue Ticket" />
      </div>
    </nav>
  );
}

export function AdminNavBar({ onHome, onLogout }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/users/session", {
          credentials: "include",
        });
        const data = await res.json();
        if (isMounted) {
          setIsLoggedIn(!!data && !!data.username);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoggedIn(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleHome = React.useCallback(() => {
    if (onHome) {
      onHome();
    } else {
      navigate("/admin");
    }
  }, [onHome, navigate]);

  const handleLogout = React.useCallback(async () => {
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
  }, [onLogout, navigate]);

  return (
    <nav className="navbar admin-navbar">
      <div className="navbar-left">
        <div className="navbar-logo">PayrollPro</div>
      </div>
      <div className="navbar-nav">
        <Button onClick={handleHome} label="Home" />
        {isLoggedIn && (
          <Button
            className="logout-btn"
            onClick={handleLogout}
            label="Log out"
          />
        )}
      </div>
    </nav>
  );
}

export function HRNavBar({ onHome, onIssueTicket, onLogout }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/users/session", {
          credentials: "include",
        });
        const data = await res.json();
        if (isMounted) {
          setIsLoggedIn(!!data && !!data.username);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoggedIn(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleHome = React.useCallback(async () => {
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
  }, [onHome, navigate]);

  const handleIssueTicket = React.useCallback(() => {
    if (onIssueTicket) {
      onIssueTicket();
    } else {
      navigate("/issue-ticket");
    }
  }, [onIssueTicket, navigate]);

  const handleLogout = React.useCallback(async () => {
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
  }, [onLogout, navigate]);

  return (
    <nav className="navbar hr-navbar">
      <div className="navbar-left">
        <div className="navbar-logo">PayrollPro</div>
      </div>
      <div className="navbar-nav">
        <Button onClick={handleHome} label="Home" />
        <Button onClick={handleIssueTicket} label="Issue Ticket" />
        {isLoggedIn && (
          <Button
            className="logout-btn"
            onClick={handleLogout}
            label="Log out"
          />
        )}
      </div>
    </nav>
  );
}
