import React, { useRef, useState } from "react"
import { Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import EditPrompt from "./EditPrompt"

export default function AddPrompt(props) {
    const { currentUser } = useAuth();
    const bodyRef = useRef()
    const tagsRef = useRef()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const { prompts, deletePrompt, editPrompt, allTags, formatTags } = props

    function handleDelete(id) {
        deletePrompt(id)
    }

    function handleEdit(id, body, tags) {
        editPrompt(id, body, tags)
    }

    //console.log("prompts from prompt list", prompts)

    return (
        <>
            <Card>
                <ul>
                {
                            prompts.map((prompt) => {
                                return (
                                    <div key={prompt.id}>
                                        <li>{prompt.body} 
                                        <Button onClick={() => handleDelete(prompt.id)}>Delete</Button>
                                        <EditPrompt 
                                        promptId={prompt.id}
                                        body={prompt.body} 
                                        tags={prompt.tags}
                                        editPrompt={handleEdit}
                                        allTags={allTags}
                                        formatTags={formatTags}
                                        />
                                        </li>
                                    </div>
                                )
                            })
                        } 
                </ul>
            </Card>
        </>
    )
}
