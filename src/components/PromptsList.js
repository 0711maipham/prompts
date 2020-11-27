import React, { useRef, useState, useEffect } from "react"
import { Card, Row, Col, Accordion } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import EditPrompt from "./EditPrompt"
import ConfirmDelete from "./ConfirmDelete"

export default function PromptList(props) {
    const { currentUser } = useAuth();
    const bodyRef = useRef()
    const tagsRef = useRef()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [uid, setUid] = useState("")
    const [disabled, setDisabled] = useState(true)
    const { prompts, deck, deletePrompt, editPrompt, allTags, formatTags } = props

    useEffect(() => {
        console.log("use effect in prompts list called");
        if (currentUser == null) {
            setUid("anon")
            if (deck.openEdit) {
                setDisabled(false)
            }
        }
        else {
            setUid(currentUser.uid)
            if (currentUser.uid == deck.createdBy) {
                setDisabled(false)
            }
            else if (deck.openEdit) {
                setDisabled(false)
            }
        }
    })

    //console.log("disabled?", disabled)

    function handleDelete(id) {
        deletePrompt(id)
    }

    function handleEdit(id, body, tags, comment, title) {
        editPrompt(id, body, tags, comment, title)
    }

    //console.log("prompts from prompt list", prompts)

    return (
        <>
            {(uid == deck.createdBy) || (!deck.private) ?
                <Accordion >
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                            <h2>Contents</h2>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body className="prompts-list">
                                {
                                    prompts.map((prompt) => {
                                        return (
                                            <Row key={prompt.id} className="bottom-divider">
                                                <Col xs="9">
                                                    <h4>{prompt.title}</h4>
                                                    <p>{prompt.body.substring(0, 85) + "..."}</p>
                                                </Col>
                                                <Col xs="3">
                                                    <EditPrompt
                                                        promptId={prompt.id}
                                                        body={prompt.body}
                                                        promptTags={prompt.tags}
                                                        title={prompt.title}
                                                        comment={prompt.comment}
                                                        editPrompt={handleEdit}
                                                        allTags={allTags}
                                                        formatTags={formatTags}
                                                        disabled={disabled}
                                                    />
                                                    <ConfirmDelete
                                                        handleDelete={() => handleDelete(prompt.id)}
                                                        title={"Delete prompt?"}
                                                        body={"This can't be undone"}
                                                        disabled={disabled}
                                                    />
                                                </Col>
                                                <hr />
                                            </Row>
                                        )
                                    })
                                }
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
