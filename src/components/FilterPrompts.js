import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import Toggle from 'react-toggle'

export default function FilterPrompts(props) {
    const { currentUser } = useAuth();
    const tagsRef = useRef()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const { allTags, formatTags, andOr, filterPrompts } = props

    async function handleSubmit(e) {
        e.preventDefault()

        let uniqTags = [];
        if (tagsRef.current.value) {
            console.log(tagsRef.current.value)
            uniqTags = formatTags(tagsRef.current.value)
        }

        try {
            setMessage("")
            setError("")
            setLoading(true)
            await filterPrompts(uniqTags);
            setMessage("Success")
        } catch {
            setError("Failed")
        }
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

    function handleToggle() {
        andOr();
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Draw Prompt</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="tags">
                            <Form.Label>Tags</Form.Label>
                            <Form.Control as="select" onChange={handleDropdown}>
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
                            <Form.Control type="text" ref={tagsRef} />
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
            </Card>
        </>
    )
}
