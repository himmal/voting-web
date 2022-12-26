import React, { createContext, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import ListBody from "./components/ListBody";
import Navigation from "./components/Navigation";
import LoginBody from "./components/LoginBody";

export const LoginContext = createContext(null);

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [loginToken, setLoginToken] = useState({ token: "", userId: "", name: "" })
  const [logged, setLogged] = useState(false)

  const toggleLogin = () => {
    setShowLogin(!showLogin)
  }

  const toggleLogged = (choice) => {
    console.log("logged")
    setLogged(choice)
  }

  const updateToken = (object) => {
    setLoginToken({ ...object })
  }

  return (
    <div >
      <LoginContext.Provider value={{ showLogin, loginToken, logged, toggleLogin, toggleLogged, updateToken }}>
        <Navigation />
        <p style={{ paddingLeft: 10, paddingRight: 10 }}>
          Expand one of the campaigns and start voting!
        </p>
        <LoginBody />
        <Container>
          <ListBody />
        </Container>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
