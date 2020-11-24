import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function AddDeck(props) {
    const { resetPassword } = useAuth()
    const deckNameRef = useRef()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { newDeck } = props

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)
            await newDeck(deckNameRef.current.value)
        } catch {
            setError("Failed to create deck")
        }

        setLoading(false)
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Create a New Deck</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="deck-name">
                            <Form.Label>Deck Name</Form.Label>
                            <Form.Control type="text" ref={deckNameRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">
                            Add Deck
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}
