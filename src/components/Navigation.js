import { useEffect, useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import jwt from 'jwt-decode'
import { LoginContext } from '../App'


function Navigation() {
  const { loginToken, logged, toggleLogin, toggleLogged, updateToken } = useContext(LoginContext);

  useEffect(() => {
    if (loginToken.token == "") {
      let loginToken = localStorage.getItem('token')
      if (loginToken) {
        let payload = jwt(loginToken)
        updateToken({
          token: loginToken.token,
          userId: payload.id,
          name: payload.name,
        })
        toggleLogged(true);
      }
    } else {
      toggleLogged(true);
      console.log("logged as - ", loginToken.name)
    }
  }, [loginToken])

  const logout = () => {
    localStorage.removeItem('token')
    updateToken({ token: "", userId: "", name: "" });
    toggleLogged(false);
    alert("You have been logged out")
  }

  return (
    <Navbar bg="light" expand="sm" style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Navbar.Brand href="#home">Simple Voting System</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {logged ?
            <div style={{ display: 'flex' }}>
              <Nav.Link style={{ textTransform: 'capitalize' }}>Hi {loginToken.name}</Nav.Link>
              <Nav.Link onClick={logout}>Logout</Nav.Link></div> :
            <Nav.Link onClick={toggleLogin}>Login</Nav.Link>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;