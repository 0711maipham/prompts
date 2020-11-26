import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Modal } from "react-bootstrap"
import Tags from "./Tags"

export default function EditPrompt(props) {
    const { promptId, body, promptTags, editPrompt, allTags, disabled } = props;
    const bodyRef = useRef();
    const tagsRef = useRef();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [changed, setChanged] = useState(false)
    const [tags, setTags] = useState(promptTags);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleSubmit(e) {
        e.preventDefault()
        
        // let uniqTags = [];
        // if (tagsRef.current.value) {
        //     console.log(tagsRef.current.value)
        //     uniqTags = formatTags(tagsRef.current.value)
        // }

        editPrompt(promptId, bodyRef.current.value, tags)
        handleClose();
    }

    function handleDropdown(e) {
        setChanged(true);
        if(e.target.value !== "") {
            tagsRef.current.value = tagsRef.current.value + ", " + e.target.value;
        }
        if (tagsRef.current.value[0] == ',') { 
            tagsRef.current.value = tagsRef.current.value.substring(1);
          }
    }

    async function handleTags(tags) {
        await setTags(tags);
        setChanged(true);
        console.log(tags);
    }

    return (
        <>
            <Button variant="primary" disabled={disabled} onClick={handleShow}>
                Edit
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Prompt</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleSubmit}>
                        <Form.Group id="prompt-body">
                            <Form.Label>Body</Form.Label>
                            <Form.Control onChange={()=> setChanged(true)} as="textarea" ref={bodyRef} defaultValue={body} required />
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
                            <Form.Control type="text" onChange={()=> setChanged(true)} ref={tagsRef} defaultValue={tags} /> */}
                            <Tags 
                                allTags={allTags}
                                promptTags={promptTags}
                                changeHandler={handleTags}
                            />
                        </Form.Group>
                        <Button disabled={loading || !changed} className="w-100" type="submit">
                            Submit changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}