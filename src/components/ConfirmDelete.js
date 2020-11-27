import React, { useRef, useState, useEffect } from "react"
import { Button, Card, Alert, Modal } from "react-bootstrap"

export default function ConfirmDelete(props) {
    const { handleDelete, title, body, disabled } = props
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => setShow(true);

    const handleSubmit = () => handleDelete();

    return (
        <>
            <Button disabled={disabled} variant="text" className="delete-btn" onClick={handleShow}>
                X
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {body}
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={loading} onClick={handleSubmit} variant="danger">
                        Delete
                    </Button>
                    <Button disabled={loading} onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}