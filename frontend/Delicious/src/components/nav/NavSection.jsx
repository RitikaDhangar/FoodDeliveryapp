import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./NavSection.css";

const NavSection = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("persist:root");
    navigate("/login");
  };

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark" fixed="top"           style={{zIndex:'1000'}}
          style={{zIndex:'100'}}
>
        <Container>
          <Navbar.Brand>Delicious</Navbar.Brand>

          <Nav
            className="me-auto"
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "space-between",
              width: "100%",
              
            }}
          >
            {/* Left Side */}
            <div style={{ display: "flex", gap: "12px" }}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "activeNavbar" : "Navbar"
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/history"
                className={({ isActive }) =>
                  isActive ? "activeNavbar" : "Navbar"
                }
              >
                History
              </NavLink>
            </div>

            {token ? (
              <NavLink
                to="/login"
                className="Navbar"
                onClick={logoutHandler}
              >
                Logout
              </NavLink>
            ) : (
              <NavLink
                to={isLoginPage ? "/signup" : "/login"}
                className={({ isActive }) =>
                  isActive ? "activeNavbar" : "Navbar"
                }
              >
                {isLoginPage ? "Sign Up" : "Log In"}
              </NavLink>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Outlet />
    </div>
  );
};

export default NavSection;