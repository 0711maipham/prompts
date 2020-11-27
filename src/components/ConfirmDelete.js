import React, { useRef, useState, useEffect } from "react"
import { Button, Card, Alert, Modal } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
            <Button disabled={disabled} variant="text" className="btn-secondary icon-button" onClick={handleShow}>
            Delete
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title><h4>{title}</h4></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {body}
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={loading} onClick={handleSubmit} className="btn-primary">
                        Delete
                    </Button>
                    <Button disabled={loading} onClick={handleClose} className="btn-secondary">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}