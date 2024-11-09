import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import NavBar from "./components/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { AuthContext } from "./context/AuthContext.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Mapbox from "./pages/mapbox.jsx";
function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/mapbox/:type/:id"
            render={(props) =>
              user ? (
                <Mapbox
                  type={props.match.params.type}
                  id={props.match.params.id}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
            element={user ? <Mapbox /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
