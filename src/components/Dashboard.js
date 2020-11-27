import React, { useRef, useState, useEffect } from 'react'
import { Button, Container } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AddDeck from './AddDeck'
import firebase from 'firebase/app'

export default function Dashboard(props) {
    const { currentUser, logout } = useAuth();
    const [error, setError] = useState("");
    const [decks, setDecks] = useState([]);
    const history = useHistory();

    useEffect(() => {
        //console.log("use effect in dashboard called")
        const unsubscribe = firebase.firestore().collection('deck').where("createdBy", "==", currentUser.uid).onSnapshot(serverUpdate => {
            const decks = serverUpdate.docs.map(_doc => {
              const data = _doc.data();
              data['id'] = _doc.id;
              return data;
            })
            setDecks(decks)
          });
          return unsubscribe
        }, [])

    async function handleLogout() {
        setError("")

        try {
            await logout()
            history.push("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    async function newDeck(name) {
        console.log("New Deck Added: " + name + " " + currentUser.uid)

        // const deck = {
        //     name: name,
        // }
        const newFromDb = await firebase.firestore().collection('deck').add({
            name: name,
            createdBy: currentUser.uid,
            openEdit: false,
            private: false,
            dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
            dateEdited: firebase.firestore.FieldValue.serverTimestamp()
        });

        // firebase.firestore().collection('deck').onSnapshot(serverUpdate => {
        //     const decks = serverUpdate.docs.map(_doc => {
        //       const data = _doc.data();
        //       data['id'] = _doc.id;
        //       return data;
        //     })
        //     console.log(decks);
        // //const currentDeck = decks.filter(deck => deck.id == newFromDb.id);
        // });

        history.push(`/deck/${newFromDb.id}`)
    }

    return (
        <Container>
            {/* <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Profile</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <strong>Email: </strong>{currentUser && currentUser.email}
                <Link to="/update-profile" className="btn btn-primary w-100 mt-3">Update Profile</Link>
            </Card.Body>
        </Card> */}
            <AddDeck
                newDeck={newDeck}
                decks={decks}
            />

            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>Log Out</Button>
            </div>
        </Container>
    );
}