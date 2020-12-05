import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card, Alert, Accordion } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import Tags from "./Tags"

export default function AddPrompt(props) {
    const { currentUser } = useAuth();
    const bodyRef = useRef()
    const commentRef = useRef()
    const titleRef = useRef()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [tags, setTags] = useState([])
    const [uid, setUid] = useState("")
    const { addPrompt, allTags, deck } = props

    useEffect(() => {
        console.log("use effect in add prompt called");
        if (currentUser == null) {
            setUid("anon")
        }
        else {
            setUid(currentUser.uid)
        }
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()

        let uniqTags = [];
        // if (tagsRef.current.value) {
        //     console.log(tagsRef.current.value)
        //     uniqTags = formatTags(tagsRef.current.value)
        // }

        try {
            setMessage("")
            setError("")
            setLoading(true)
            await addPrompt(bodyRef.current.value, tags, commentRef.current.value, titleRef.current.value)
            setMessage("Added successfully.")
        } catch {
            setError("Failed to add spark.")
        }
        e.target.reset();
        //resetting the Tags doesnt update the Tags state of the Tags component for some reason... :(
        //setTags([]);
        setLoading(false)
    }

    async function handleTags(tags) {
        await setTags(tags);
        console.log(tags);
    }

    return (
        <>
            {(uid == deck.createdBy) || (deck.openEdit) ?
                <Accordion className="mb-2">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                            <h2>Add a Spark</h2>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {error && <Alert variant="danger">{error}</Alert>}
                                {message && <Alert variant="success">{message}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group id="title">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control type="text" ref={titleRef} maxLength={50} />
                                    </Form.Group>
                                    <Form.Group id="body">
                                        <Form.Label className="mr-2">Body</Form.Label><span className="subline">Required.</span>
                                        <Form.Control as="textarea" ref={bodyRef} maxLength={550} required />
                                    </Form.Group>
                                    <Form.Group id="comment">
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control type="text" ref={commentRef} maxLength={200} />
                                    </Form.Group>
                                    <Tags
                                        allTags={allTags}
                                        changeHandler={handleTags}
                                        promptTags={tags}
                                        preventAdd={false}
                                    />
                                    <Button disabled={loading} className="w-100" type="submit">
                                        Add
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                :
                <div className="placeholder-box">
                    <p>
                        Editing disabled for this pod.
                    </p>
                </div>
            }
        </>
    )
}
