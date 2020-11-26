import React, { useRef, useState, useEffect } from "react"
import { Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import EditPrompt from "./EditPrompt"

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
            if(deck.openEdit) {
                setDisabled(false)
            }
        }
        else {
            setUid(currentUser.uid)
            if(currentUser.uid == deck.createdBy) {
                setDisabled(false)
            }
            else if(deck.openEdit) {
                setDisabled(false)
            }
        }
    })

    console.log("disabled?", disabled)

    function handleDelete(id) {
        deletePrompt(id)
    }

    function handleEdit(id, body, tags) {
        editPrompt(id, body, tags)
    }

    //console.log("prompts from prompt list", prompts)

    return (
        <>
            { (uid == deck.createdBy) || (!deck.private) ?
                <Card>
                <ul>
                {
                            prompts.map((prompt) => {
                                return (
                                    <div key={prompt.id}>
                                        <li>{prompt.body}
                                        <Button 
                                        onClick={() => handleDelete(prompt.id)}
                                        disabled={disabled}
                                        >Delete
                                        </Button>
                                        <EditPrompt 
                                        promptId={prompt.id}
                                        body={prompt.body} 
                                        promptTags={prompt.tags}
                                        editPrompt={handleEdit}
                                        allTags={allTags}
                                        formatTags={formatTags}
                                        disabled={disabled}
                                        />
                                        </li>
                                    </div>
                                )
                            })
                        } 
                </ul>
            </Card>
            :
            <>
            </>
            }
        </>
    )
}
