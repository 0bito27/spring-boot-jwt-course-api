import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                username,
                password,
            });

            setMessage(response.data);
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            if (error.response && error.response.data) {
                setMessage(error.response.data);
            } else {
                setMessage('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="register-form">
            <h2 className="mb-3">Register</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formRegUsername">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formRegPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Register
                </Button>
                {message && <Alert variant={message.includes("successfully") ? "success" : "danger"} className="mt-3">{message}</Alert>}
            </Form>
        </div>
    );
}

export default Register;