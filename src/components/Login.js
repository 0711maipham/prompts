import React, { useRef, useState } from 'react'
import { Card, Button, Form, Alert, InputGroup } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const deckCodeRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            console.log("bloop")
            history.push("/")
        } catch {
            console.log("catch block")
            setError("Failed to log in.")
        }

        setLoading(false);
    }

    function handleLoadDeckSubmit(e) {
        e.preventDefault();
        history.push(`/deck/${deckCodeRef.current.value}`)
    }

    return (
        <div>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Log In :)</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required></Form.Control>
                        </Form.Group>
                        <Button disabled={loading} type="submit" className="w-100">Log In</Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Load Deck</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    Have a code? Paste it below to go ahead without an account.
                    <Form onSubmit={handleLoadDeckSubmit}>
                        <Form.Group id="deck-code">
                            <InputGroup className="mb-3">
                                <Form.Control
                                    ref={deckCodeRef}
                                    placeholder="Load from code"
                                    aria-label="Deck code"
                                />
                                <InputGroup.Append>
                                    <Button type="submit" variant="outline-secondary">Go</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                        </Form>
                </Card.Body>
            </Card>

            <div className="w-100 text-center mt-2">
                Need an account? <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    );
}
