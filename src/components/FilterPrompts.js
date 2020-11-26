import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
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

    return (
        <>
            { (uid == deck.createdBy) || (!deck.private) ?
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Draw Prompt</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && <Alert variant="success">{message}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="tags">
                                <Form.Label>Tags</Form.Label>
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
                                />
                            </Form.Group>
                            <label>
                                <span>"Or"</span>
                                <Toggle
                                    icons={false}
                                    onChange={handleToggle}
                                />
                                <span>"And"</span>
                            </label>
                            <Button disabled={loading} className="w-100" type="submit">
                                Draw
                        </Button>
                        </Form>
                    </Card.Body>
                    <Card.Footer>
                        {
                            prompt !== null ? 
                            
                            <div>
                                {prompt.body}
                                <hr/>
                                {prompt.tags.map((tag) => {
                                    return (
                                        <span id={tag.id}>{tag.text}</span>
                                    )
                                })}
                            </div>
                            
                            : ""
                        }
                    </Card.Footer>
                </Card>
                :
                <Card>
                    This Deck is Private
                </Card>
            }
        </>
    )
}
