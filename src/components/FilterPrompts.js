import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card, Row, Col, OverlayTrigger, Tooltip, Accordion, Fade } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Toggle from 'react-toggle'
import Tags from "./Tags"
import ExportPrompts from "./ExportPrompts"
import EditPrompt from "./EditPrompt"
import ConfirmDelete from "./ConfirmDelete"

export default function FilterPrompts(props) {
    const { currentUser } = useAuth();
    const tagsRef = useRef()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [tags, setTags] = useState([]);
    const [uid, setUid] = useState("")
    const [prompt, setPrompt] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const { allTags, deck, decks, andOr, filterPrompts, promptCount, setCurrentUserDecks, copyDeck, exportDeck, deletePrompt, editPrompt, markDone } = props
    const [done, setDone] = useState();

    useEffect(() => {
        //console.log("use effect in filter prompt called");
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

    useEffect(() => {
        if(prompt) {
            setDone(prompt.done)
        }
    }, [])

    function sendCurrentUser() {
        setCurrentUserDecks(currentUser.uid)
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setMessage("")
            setError("")
            setLoading(true)
            await filterPrompts(tags).then((res) => {
                setPrompt(res)
                setDone(res.done)
            });
            setMessage("Success")
            console.log(prompt)
        } catch {
            setError("Failed")
        }
        setLoading(false)
    }

    function handleToggle() {
        andOr();
    }

    async function handleTags(tags) {
        await setTags(tags);
        console.log(tags);
    }

    function handleDelete(id, current) {
        deletePrompt(id)
        setPrompt(null);
    }

    function handleDone(marked) {
        console.log(prompt.done, marked)
        setDone(marked);
        markDone(prompt.id, marked);
    }

    function handleEdit(id, body, tags, comment, title) {
        editPrompt(id, body, tags, comment, title);
        setPrompt({
            id: id,
            body: body,
            comment: comment,
            tags: tags,
            title: title,
        })
    }

    const renderPrivacyTooltip = (props) => (
        <Tooltip id="button-tooltip">
            {props}
        </Tooltip>
    );

    return (
        <>
            {(uid == deck.createdBy) || (!deck.private) ?
                <>
                    <div className="deck-header mb-3">
                        <h2>
                            {deck.name + " : "}
                            <span className="subline">
                                {promptCount + " sparks"}
                            </span>
                            {
                                uid !== "anon" ?
                                    <span>
                                        <ExportPrompts
                                            copyDeck={copyDeck}
                                            exportDeck={exportDeck}
                                            deck={deck}
                                            decks={decks}
                                            sendCurrentUser={sendCurrentUser}
                                        ></ExportPrompts>
                                        <Button variant="text">
                                            <FontAwesomeIcon icon={['far', 'heart']} />
                                        </Button>
                                    </span>
                                    :
                                    ""
                            }
                        </h2>
                    </div>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col md="5" className="mb-3">
                                    <h2 className="text-center mb-4">Draw Spark</h2>
                                    <Form onSubmit={handleSubmit}>
                                        <Accordion className="mb-3">
                                            <Card>
                                                <Accordion.Toggle style={{ height: "50px" }} as={Card.Header} eventKey="0">
                                                    <h4>Narrow pool with tags</h4>
                                                </Accordion.Toggle>
                                                <Accordion.Collapse eventKey="0">
                                                    <Card.Body>
                                                        <Tags
                                                            allTags={allTags}
                                                            changeHandler={handleTags}
                                                            promptTags={tags}
                                                            preventAdd={true}
                                                        />
                                                        <label>
                                                            <OverlayTrigger
                                                                placement="right"
                                                                delay={{ show: 250, hide: 400 }}
                                                                overlay={renderPrivacyTooltip("Include prompts that have at least one of the specified tags.")}
                                                            >
                                                                <Button variant="text" size="sm" className="mb-3">Or</Button>
                                                            </OverlayTrigger>
                                                            <Toggle
                                                                icons={false}
                                                                onChange={handleToggle}
                                                            />
                                                            <OverlayTrigger
                                                                placement="right"
                                                                delay={{ show: 250, hide: 400 }}
                                                                overlay={renderPrivacyTooltip("Include prompts that have all of the specified tags.")}
                                                            >
                                                                <Button variant="text" size="sm" className="mb-3">And</Button>
                                                            </OverlayTrigger>
                                                        </label>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>
                                        <Button disabled={loading || promptCount == 0} className="w-100" type="submit">
                                            Draw Random
                                    </Button>
                                        <hr />
                                    </Form>
                                </Col>
                                <Col md="7">
                                    {
                                        prompt !== null ?
                                            <Fade in={true} appear={true} timeout={500}>
                                                <div className="">
                                                    <h3>{prompt.title}
                                                        {
                                                            done ? 
                                                            <span className="subline ml-2">
                                                            (done)
                                                            </span> : ""
                                                        }
                                                    </h3>
                                                    <p>{prompt.body}</p>
                                                    <p className="subline">{prompt.comment}</p>
                                                    <hr />
                                                    {prompt.tags.map((tag) => {
                                                        return (
                                                            <span key={tag.id} className="tag">{tag.text}</span>
                                                        )
                                                    })}
                                                    {!disabled ?
                                                        <>
                                                            {prompt.tags.length > 0 ? <hr /> : ""}
                                                            <Row>
                                                                <Col lg="4">
                                                                    <EditPrompt
                                                                        promptId={prompt.id}
                                                                        body={prompt.body}
                                                                        promptTags={prompt.tags}
                                                                        title={prompt.title}
                                                                        comment={prompt.comment}
                                                                        editPrompt={handleEdit}
                                                                        allTags={allTags}
                                                                        disabled={disabled}
                                                                    />
                                                                </Col>
                                                                <Col lg="4">
                                                                    <ConfirmDelete
                                                                        handleDelete={() => handleDelete(prompt.id)}
                                                                        title={"Delete spark?"}
                                                                        body={"This can't be undone"}
                                                                        disabled={disabled}
                                                                    />
                                                                </Col>
                                                                <Col lg="4">
                                                                    <Button variant="text" className="btn-tertiary icon-button" onClick={() => handleDone(!done)}>
                                                                        {done ? "Mark Undone" : "Mark Done"}
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </>
                                                        : 
                                                        <>
                                                        {prompt.tags.length > 0 ? <hr /> : ""}
                                                        <Row>
                                                            <Col lg="4">
                                                                <Button variant="text" disabled={!deck.markDone} className="btn-tertiary icon-button" onClick={() => handleDone(!done)}>
                                                                        {done ? "Mark Undone" : "Mark Done"}
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                        </>
                                                        }
                                                </div>
                                            </Fade>
                                            :

                                            <div className="placeholder-box mt-5">
                                                <p>
                                                    {
                                                        promptCount < 1 ? "This pod is empty, add a few sparks to get started." : 'Click "Draw Random" to get started.'
                                                    }
                                                </p>
                                            </div>
                                    }
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </>
                :
                <Card>
                    This Pod is Private
                </Card>
            }
        </>
    )
}
