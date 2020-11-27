import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, InputGroup, Row, Col } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function AddDeck(props) {
    const { resetPassword } = useAuth()
    const deckNameRef = useRef()
    const deckCodeRef = useRef()
    const deckCodeRef2 = useRef()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { newDeck, decks } = props
    const history = useHistory();

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

    function handleLoadDeckSubmit(e) {
        e.preventDefault();
        history.push(`/deck/${deckCodeRef.current.value}`)
    }

    function handleLoadDeckSubmit2(e) {
        e.preventDefault();
        history.push(`/deck/${deckCodeRef2.current.value}`)
    }

    return (
        <Row>
            <Col md="12">
            <Card>
                <Card.Body>
                    <Row>
                        <Col sm="6" className="right-divider col-padding mb-3">
                    <h2 className="text-center mb-4">Create a New Deck</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="deck-name">
                            <Form.Label>Deck Name</Form.Label>
                            <Form.Control type="text" ref={deckNameRef} maxLength={30} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">
                            {loading ? "Adding Deck..." : "Add Deck"}
                        </Button>
                    </Form>
                    </Col>
                    <Col sm="6" className="col-padding mb-3">
                    <h2 className="text-center mb-4">Load Existing Deck</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLoadDeckSubmit}>
                        <Form.Group id="deck-code">
                        <Form.Label>Load from deck code</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    ref={deckCodeRef}
                                    placeholder="Code"
                                    aria-label="Deck code"
                                />
                                <InputGroup.Append>
                                    <Button type="submit" variant="outline-secondary">Go</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group id="deck-select">
                            <Form.Control as="select" ref={deckCodeRef2} onChange={handleLoadDeckSubmit2}>
                            <option value="" disabled selected>...or select existing</option>
                                {
                                    decks.map((deck, index) => {
                                        return (
                                            <option value={deck.id} key={index}>
                                                {deck.name}
                                            </option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Form.Group>
                    </Form>
                    </Col>
                    </Row>
                </Card.Body>
            </Card>
            </Col>
        </Row>
    )
}
