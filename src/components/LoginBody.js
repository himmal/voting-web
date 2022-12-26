import React, { useState, useContext } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { fetchPost } from './FetchRequest';
import eyeFill from '../assets/image/eyeFill.svg'
import jwt from 'jwt-decode'
import { LoginContext } from '../App'


const HkidFormat = /^[A-Z]{1,2}[0-9]{6}$/

function LoginBody() {
    const { showLogin, toggleLogged, toggleLogin, updateToken } = useContext(LoginContext);

    const [input, setInput] = useState('')
    const [inputVisable, setInputVisable] = useState(false)
    const [nameInput, setNameInput] = useState('')
    const [registerBox, setRegisterBox] = useState(false)

    const login = async (e) => {
        e.preventDefault();

        if (!input.match(HkidFormat)) {
            alert("Invalid HKID")
            return
        }

        let result = await fetchPost('user', { hkid: input })
        if (result.data == "Continue to create user") {
            console.log('continue to login')
            setRegisterBox(true)
        }
        if (result.token) {
            let payload = jwt(result.token)
            localStorage.setItem('token', result.token)
            updateToken({
                token: result.token,
                userId: payload.id,
                name: payload.name,
            })
            setInput('')
            toggleLogged(true);
            toggleLogin()
        }

    }

    const register = async (e) => {
        e.preventDefault();

        if (nameInput == "") {
            alert("Missing name")
            return
        }

        let result = await fetchPost('create-user', { hkid: input, name: nameInput })
        if (result.token) {
            let payload = jwt(result.token)
            localStorage.setItem('token', result.token)
            updateToken({
                token: result.token,
                userId: payload.id,
                name: payload.name,
            })
            setRegisterBox(false)
            setInput('')
            setNameInput('')
            toggleLogged(true);
            toggleLogin()
        }

    }

    const handleChange = e => {
        e.persist();
        setInput(e.target.value);
    };

    const handleNameChange = e => {
        e.persist();
        setNameInput(e.target.value);
    };

    return (
        <div>
            <Modal show={showLogin} onHide={toggleLogin}>
                <Modal.Header closeButton>
                    {!registerBox ?
                        <Modal.Title>Login/Register</Modal.Title> : <Modal.Title>Register</Modal.Title>
                    }
                </Modal.Header>

                {!registerBox ?
                    <Modal.Body>
                        <Form.Label htmlFor="inputHkid">Input your HKID (first 7 digits) below</Form.Label>
                        <div style={{ display: 'flex' }}>
                            <Form.Control
                                type={inputVisable ? "text" : "password"}
                                id="inputHkid"
                                aria-describedby="passwordHelpBlock"
                                onChange={handleChange}
                            />
                            <img src={eyeFill} onClick={() => setInputVisable(!inputVisable)} style={{ cursor: 'pointer', position: 'relative', right: 25 }} />
                        </div>
                        <Form.Text id="passwordHelpBlock" muted>
                            Your HKID will only be used for login purpose.
                        </Form.Text>
                    </Modal.Body> :
                    <Modal.Body>
                        <Form.Label htmlFor="inputName">Input your username below</Form.Label>
                        <Form.Control
                            type={"text"}
                            id="inputName"
                            aria-describedby="passwordHelpBlock"
                            onChange={handleNameChange}
                        />
                    </Modal.Body>
                }

                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleLogin}>
                        Cancel
                    </Button>
                    {!registerBox ?
                        <Button variant="primary" onClick={login}>
                            Login/Register
                        </Button> : <Button variant="primary" onClick={register}>
                            Register
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default LoginBody;