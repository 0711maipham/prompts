import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import Tags from "./Tags"

export default function AddPrompt(props) {
    const { currentUser } = useAuth();
    const bodyRef = useRef()
    const tagsRef = useRef()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [tags, setTags] = useState([])
    const [uid, setUid] = useState("")
    const { addPrompt, allTags, deck, formatTags } = props

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
            await addPrompt(bodyRef.current.value, tags)
            setMessage("Added successfully.")
        } catch {
            setError("Failed to add prompt.")
        }
        e.target.reset();
        //resetting the Tags doesnt update the Tags state of the Tags component for some reason... :(
        //setTags([]);
        setLoading(false)
    }

    function handleDropdown(e) {
        if (e.target.value !== "") {
            tagsRef.current.value = tagsRef.current.value + ", " + e.target.value;
        }
        if (tagsRef.current.value[0] == ',') {
            tagsRef.current.value = tagsRef.current.value.substring(1);
        }
    }

    async function handleTags(tags) {
        await setTags(tags);
        console.log(tags);
    }

    return (
        <>
            { (uid == deck.createdBy) || (deck.openEdit) ?
                <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Add Prompt</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="body">
                            <Form.Label>Prompt</Form.Label>
                            <Form.Control as="textarea" ref={bodyRef} required />
                        </Form.Group>
                        <Form.Group id="tags">
                            <Form.Label>Tags</Form.Label>
                            {/* <Form.Control as="select" onChange={handleDropdown}>
                                <option value="" disabled selected>Select existing tag</option>
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
                        <Button disabled={loading} className="w-100" type="submit">
                            Add
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            :
            <Card>

            </Card>
            }
        </>
    )
}
