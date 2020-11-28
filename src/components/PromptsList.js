import React, { useRef, useState, useEffect, useContext } from "react"
import { Button, Card, Row, Col, Accordion, Fade } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import EditPrompt from "./EditPrompt"
import ConfirmDelete from "./ConfirmDelete"

export default function PromptList(props) {
    const { currentUser } = useAuth();
    const expandRef = useRef();
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [uid, setUid] = useState("")
    const [expandPrompt, setExpandPrompt] = useState(false)
    const [expandAccordion, setExpandAccordion] = useState(false)
    const handleAccordion = () => { setExpandAccordion(!expandAccordion) }
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

    function handleExpand() {
        console.log("expanded")
        setExpandPrompt(!expandPrompt);
    }

    //console.log("prompts from prompt list", prompts)

    return (
        <>
            {(uid == deck.createdBy) || (!deck.private) ?
                <Accordion >
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} onClick={handleAccordion} variant="link" eventKey="0">
                                <h2>Contents</h2>
                            </Accordion.Toggle>
                            <Fade in={expandAccordion} dimension="width" timeout={500}>
                                <Button onClick={handleExpand} className="btn-secondary icon-button btn-small">{expandPrompt ? "Hide prompts" : "Show full prompts"}</Button>
                            </Fade>
                        </Card.Header>
                        <Accordion.Collapse ref={expandRef} eventKey="0">
                            <Card.Body className="prompts-list">
                                {
                                    prompts.map((prompt) => {
                                        return (
                                            <Row key={prompt.id} className="bottom-divider">
                                                <Col xs="9">
                                                    <h4>{prompt.title}</h4>
                                                    <p>{expandPrompt ? prompt.body.substring(0, 85) : prompt.body.substring(0, 85) + "..."}
                                                    <Fade in={expandPrompt} dimension="width" timeout={500} unmountOnExit={true}>
                                                        <span>{prompt.body.substring(85, prompt.body.length)}</span>
                                                    </Fade>
                                                    </p>
                                                    <Fade in={expandPrompt} timeout={500} unmountOnExit={true}>
                                                        <div>
                                                            <p className="subline">{prompt.comment}</p>
                                                            {prompt.tags.map((tag) => {
                                                                return (
                                                                    <span key={tag.id} className="tag">{tag.text}</span>
                                                                )
                                                            })}
                                                        </div>
                                                    </Fade>
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
