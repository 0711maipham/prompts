import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card, Row, Col, OverlayTrigger, Tooltip} from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import Toggle from 'react-toggle'
import Tags from "./Tags"

export default function FilterPrompts(props) {
    const { currentUser } = useAuth();
    const tagsRef = useRef()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [tags, setTags] = useState([]);
    const [uid, setUid] = useState("")
    const [prompt, setPrompt] = useState(null);
    const { allTags, deck, formatTags, andOr, filterPrompts } = props

    useEffect(() => {
        console.log("use effect in filter prompt called");
        if (currentUser == null) {
            setUid("anon")
        }
        else {
            setUid(currentUser.uid)
        }
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()

        // let uniqTags = [];
        // if (tagsRef.current.value) {
        //     console.log(tagsRef.current.value)
        //     uniqTags = formatTags(tagsRef.current.value)
        // }

        try {
            setMessage("")
            setError("")
            setLoading(true)
            await filterPrompts(tags).then((res) => setPrompt(res));
            setMessage("Success")
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

    const renderPrivacyTooltip = (props) => (
        <Tooltip id="button-tooltip">
            {props}
        </Tooltip>
    );

    return (
        <>
            {(uid == deck.createdBy) || (!deck.private) ?
                <Card>
                    <Card.Body>
                        <Row>
                            <Col md="5" className="mb-3">
                                <h2 className="text-center mb-4">Draw Prompt</h2>
                                <Form onSubmit={handleSubmit}>
                                    {/* <Form.Control as="select" onChange={handleDropdown}>
                            <option value="" selected>Select existing tag</option>
                                {
                                    allTags.map((tag, index) => {
                                        return (
                                            <option key={index}>
                                                {tag}
                                            </option>
                                        )
                                    })
                                }
                            </Form.Control>
                            <Form.Control type="text" ref={tagsRef} /> */}
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
                                    <Button disabled={loading} className="w-100" type="submit">
                                        Draw
                                    </Button>
                                    <hr />
                                </Form>
                            </Col>
                            <Col md="7">
                                {
                                    prompt !== null ?

                                        <div className="">
                                            <h3>{prompt.title}</h3>
                                            <p>{prompt.body}</p>
                                            <p className="subline">{prompt.comment}</p>
                                            <hr />
                                            {prompt.tags.map((tag) => {
                                                return (
                                                    <span key={tag.id} className="tag">{tag.text}</span>
                                                )
                                            })}
                                        </div>

                                        :

                                        <div className="placeholder-box mt-5">
                                            <p>
                                                Click "Draw" to get started.
                                            </p>
                                        </div>
                                }
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                :
                <Card>
                    This Deck is Private
                </Card>
            }
        </>
    )
}
