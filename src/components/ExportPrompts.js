import React, { useRef, useState, useEffect } from "react"
import { Button, Card, Alert, Modal, Form } from "react-bootstrap"
import { useAuth } from '../contexts/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ExportPrompts(props) {
    const { copyDeck, exportDeck, deck, decks, sendCurrentUser } = props
    const deckCodeRef = useRef();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => {
        setShow(true)
        sendCurrentUser()
    };

    async function handleCopy() {
        try {
            setMessage("")
            setError("")
            setLoading(true)
            await copyDeck();
            setMessage("Deck successfully copied!")
        } catch {
            setError("Copy failed")
        }
        setLoading(false)
    }

    async function handleExport() {
        try {
            setMessage("")
            setError("")
            setLoading(true)
            await copyDeck(deckCodeRef.current.value);
            setMessage("Prompts successfully exported!")
        } catch {
            setError("Export failed")
        }
        setLoading(false)
    }

    return (
        <>
            <Button variant="text" onClick={handleShow}>
                <FontAwesomeIcon icon={['far', 'clone']} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title><h4>Export {deck.name}</h4></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form>
                        <Button disabled={loading} className="w-100" onClick={handleCopy}>Make a copy</Button>
                        <hr/>
                        <Form.Group id="deck-select">
                            <Form.Label>Or</Form.Label>
                            <Form.Control ref={deckCodeRef} as="select">
                                <option value="" disabled selected>Export into existing deck</option>
                                {
                                    decks.filter((d) => d.id !== deck.id).map((deck, index) => {
                                        return (
                                            <option value={deck.id} key={index}>
                                                {deck.name}
                                            </option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Form.Group>
                        <Button disabled={loading} className="w-100" onClick={handleExport}>Export Prompts</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </>
    );
}