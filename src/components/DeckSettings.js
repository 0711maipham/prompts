import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card, Alert, InputGroup, Tooltip, OverlayTrigger, Accordion } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Toggle from 'react-toggle'
import ConfirmDelete from './ConfirmDelete'

export default function DeckSettings(props) {
    const { deck, onChange, download, deleteDeck } = props
    const { currentUser } = useAuth()
    const history = useHistory();
    const deckNameRef = useRef()
    const deckCodeRef = useRef()
    const [privacy, setPrivacy] = useState(deck.private)
    const [openEdit, setOpenEdit] = useState(deck.openEdit)
    const [uid, setUid] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        console.log("use effect in deck settings called");
        setPrivacy(deck.private);
        setOpenEdit(deck.openEdit)
        if (currentUser == null) {
            setUid("anon")
        }
        else {
            setUid(currentUser.uid)
        }
    }, [])

    async function handleChange(e) {
        e.preventDefault();
        //console.log(e.target.getAttribute('name'))
        if (e.target.name == "private") {
            await setPrivacy(!privacy)
            try {
                if (!deck.private) {
                    onChange("openEdit", false);
                }
                onChange(e.target.name, !deck.private)
            }
            catch {
                { setError("Could no update settings") }
            }
        }
        else if (e.target.name == "openEdit") {
            await setOpenEdit(!openEdit)
            try {
                onChange(e.target.name, !deck.openEdit)
            }
            catch { setError("Could no update settings") }
        }
        else {
            try {
                onChange("name", deckNameRef.current.value)
                setMessage("Name changed successfully")
            }
            catch {
                setError("Could not update settings")
            }

        }
    }

    function handleCopy() {
        deckCodeRef.current.select();
        document.execCommand('copy');
    }

    function handleDownload() {
        download();
    }

    function handleDelete() {
        deleteDeck(deck.id)
        history.push("/")
    }

    const renderPrivacyTooltip = (props) => (
        <Tooltip id="button-tooltip">
            {props}
        </Tooltip>
    );

    return (
        <>{(uid == deck.createdBy) ?
            <Accordion className="mb-2">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        <h2>Settings</h2>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && <Alert variant="success">{message}</Alert>}
                        <Form onSubmit={handleChange}>
                            <Form.Group id="deck-name">
                                <Form.Label>Name</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        ref={deckNameRef}
                                        placeholder="Deck Name"
                                        aria-label="Deck Name"
                                        defaultValue={deck.name}
                                        maxLength={30}
                                    />
                                    <InputGroup.Append>
                                        <Button type="submit" variant="outline-secondary">Update</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                        <label>
                            <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderPrivacyTooltip("Turn on to prevent others from accessing your prompts.")}
                            >
                                <Button variant="text" size="sm" className="mb-3">Private</Button>
                            </OverlayTrigger>
                            <Toggle
                                icons={false}
                                checked={deck.private}
                                onChange={handleChange}
                                name="private"
                            />
                        </label>
                        <label>
                            <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderPrivacyTooltip("Turn on to allow anyone to add, edit, and delete prompts.")}
                            >
                                <Button variant="text" size="sm" className="mb-3">Open Editing</Button>
                            </OverlayTrigger>
                            <Toggle
                                icons={false}
                                checked={deck.private ? false : deck.openEdit}
                                onChange={handleChange}
                                name="openEdit"
                                disabled={deck.private}
                            />
                        </label>
                        <Form.Group id="deck-code">
                            <Form.Label>Code</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    ref={deckCodeRef}
                                    placeholder="Deck Code"
                                    aria-label="Deck Code"
                                    defaultValue={deck.id}
                                    readOnly={true}
                                    onClick={handleCopy}
                                />
                                <InputGroup.Append>
                                    <Button onClick={handleCopy} variant="outline-secondary">Copy</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                        <Button className="w-100" onClick={handleDownload}>
                            Download prompts to .CSV
                    </Button>
                        <ConfirmDelete
                            handleDelete={handleDelete}
                            title={"Delete deck?"}
                            body={"All prompts will be deleted and this can't be undone."}
                            disabled={false}
                        />
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            :
            <>
            </>
        }
        </>
    )
}
