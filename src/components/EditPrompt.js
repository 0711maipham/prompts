import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card, Alert, Modal } from "react-bootstrap"
import Tags from "./Tags"

export default function EditPrompt(props) {
    const { promptId, body, promptTags, editPrompt, allTags, comment, title, disabled } = props;
    const bodyRef = useRef();
    const commentRef = useRef();
    const titleRef = useRef();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [changed, setChanged] = useState(false)
    const [tags, setTags] = useState(promptTags);
    const handleClose = () => {
        setShow(false)
        setChanged(false)
    };
    const handleShow = () => setShow(true);

    // useEffect(() => {
    //     console.log("use effect in edit prompt called", promptTags);
    //     setTags(promptTags);
    // }, [])

    function handleSubmit(e) {
        e.preventDefault()

        // let uniqTags = [];
        // if (tagsRef.current.value) {
        //     console.log(tagsRef.current.value)
        //     uniqTags = formatTags(tagsRef.current.value)
        // }
        editPrompt(promptId, bodyRef.current.value, tags, commentRef.current.value, titleRef.current.value)
        handleClose();
    }

    // function handleDropdown(e) {
    //     setChanged(true);
    //     if(e.target.value !== "") {
    //         tagsRef.current.value = tagsRef.current.value + ", " + e.target.value;
    //     }
    //     if (tagsRef.current.value[0] == ',') { 
    //         tagsRef.current.value = tagsRef.current.value.substring(1);
    //       }
    // }

    async function handleTags(tags) {
        await setTags(tags);
        setChanged(true);
        console.log(tags);
    }

    return (
        <>
            <Button variant="primary" disabled={disabled} onClick={handleShow}>
                E
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Prompt</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control onChange={() => setChanged(true)} type="text" ref={titleRef} defaultValue={title} maxLength={50} />
                        </Form.Group>
                        <Form.Group id="prompt-body">
                            <Form.Label className="mr-2">Prompt</Form.Label> <span className="subline">Required.</span>
                            <Form.Control onChange={() => setChanged(true)} as="textarea" ref={bodyRef} defaultValue={body} maxLength={550} required />
                        </Form.Group>
                        <Form.Group id="comment">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control onChange={() => setChanged(true)} type="text" ref={commentRef} defaultValue={comment} maxLength={200} />
                        </Form.Group>
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
                                preventAdd={false}
                            />
                        <Button disabled={loading || !changed} className="w-100" type="submit">
                            Submit changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}