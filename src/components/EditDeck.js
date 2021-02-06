import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import firebase from 'firebase/app'
import AddPrompt from './AddPrompt'
import PromptsList from './PromptsList'
import FilterPrompts from './FilterPrompts'
import DeckSettings from './DeckSettings'
import { useAuth } from '../contexts/AuthContext'

class EditDeck extends React.Component {
    constructor() {
        super();
        this.state = {
            deckId: window.location.pathname.replace("/deck/", ""),
            deck: {},
            decks: [],
            prompts: [],
            allTags: [],
            andOr: false,
            currentUserUid: ""
        }
        console.log(this.state)
        this.setCurrentUserDecks = this.setCurrentUserDecks.bind(this);
        this.copyDeck = this.copyDeck.bind(this);
    }

    render() {
        return (
            <Container>
                {this.state.deck !== undefined ?
                    <>
                        <Row className="mb-4">
                            <Col md="12">
                                <FilterPrompts
                                    allTags={this.state.allTags}
                                    andOr={this.setAndOr}
                                    filterPrompts={this.filterPrompts}
                                    deck={this.state.deck}
                                    decks={this.state.decks}
                                    setCurrentUserDecks={this.setCurrentUserDecks}
                                    copyDeck={this.copyDeck}
                                    promptCount={this.state.prompts.length}
                                    deletePrompt={this.deletePrompt}
                                    editPrompt={this.editPrompt}
                                ></FilterPrompts>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="5">
                                <AddPrompt
                                    addPrompt={this.addPrompt}
                                    allTags={this.state.allTags}
                                    formatTags={this.formatTags}
                                    deck={this.state.deck}
                                ></AddPrompt>
                                <DeckSettings
                                    deck={this.state.deck}
                                    onChange={this.updateSettings}
                                    download={this.download}
                                    deleteDeck={this.deleteDeck}
                                ></DeckSettings>
                            </Col>
                            <Col md="7">
                                <PromptsList
                                    prompts={this.state.prompts}
                                    deletePrompt={this.deletePrompt}
                                    editPrompt={this.editPrompt}
                                    allTags={this.state.allTags}
                                    formatTags={this.formatTags}
                                    deck={this.state.deck}
                                ></PromptsList>
                            </Col>
                        </Row>
                    </>
                    :
                    <Card>
                        <Card.Body>
                            This pod does not exist.
                    </Card.Body>
                        <Card.Footer>
                            <Link to="/">Go Back</Link>
                        </Card.Footer>
                    </Card>
                }
            </Container>
        )
    }

    //Initialize the selected deck
    componentDidMount() {
        firebase.firestore().collection('deck').onSnapshot(serverUpdate => {
            const decks = serverUpdate.docs.map(_doc => {
                const data = _doc.data();
                data['id'] = _doc.id;
                return data;
            })
            const currentDeck = decks.filter(deck => deck.id == this.state.deckId);
            this.setState({
                deck: currentDeck[0],
            })
            //console.log(this.state.deck);
        });
        this.getPrompts(this.state.deckId);
    }

    setCurrentUserDecks(uid) {
        //get the CurrentUser from a child component because EditDeck itself cant use the Auth hooks
        firebase.firestore().collection('deck').where("createdBy", "==", uid).onSnapshot(serverUpdate => {
            const decks = serverUpdate.docs.map(_doc => {
                const data = _doc.data();
                data['id'] = _doc.id;
                return data;
            })
            this.setState({
                decks: decks,
                currentUserUid: uid
            })
        });
    }

    async copyDeck(exportToId) {
        const deckToCopy = this.state.deck;
        const uid = this.state.currentUserUid;
        let newId = exportToId;

        if (deckToCopy.private) return false
        
        if(!exportToId) {
            //Create a new deck with the old deck's settings
            const newFromDb = await firebase.firestore().collection('deck').add({
                name: deckToCopy.name + " Copy",
                createdBy: uid,
                openEdit: deckToCopy.openEdit,
                private: deckToCopy.private,
                dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
                dateEdited: firebase.firestore.FieldValue.serverTimestamp()
            });
            newId = newFromDb.id;
        }

        //Create new prompts based on the old decks prompts
        await firebase.firestore().collection('prompts').where("deckId", "==", deckToCopy.id).get().then(function (querySnapshot) {
            var batch = firebase.firestore().batch();

            querySnapshot.forEach(function (doc) {
                var newPrompt = firebase.firestore().collection('prompts').doc();
                batch.set(newPrompt,{
                    deckId: newId,
                    body: doc.data().body,
                    tags: doc.data().tags,
                    comment: doc.data().comment,
                    title: doc.data().title,
                    dateUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
            });

            batch.commit();
        })
    }

    //Combine every tag in the deck into one array
    serializeTags() {
        const prompts = this.state.prompts;
        var combinedPrompts = [];
        for (var i = 0; i < prompts.length; i++) {
            combinedPrompts = combinedPrompts.concat(prompts[i].tags);
        }
        const uniqTags = combinedPrompts.filter(function (el) {
            if (!this[el.id]) {
                this[el.id] = true;
                return true;
            }
            return false;
        }, Object.create(null));
        //console.log("serialized tags", uniqTags);
        this.setState({
            allTags: uniqTags
        })
    }

    // formatTags(tagsRef) {
    //     const tags = tagsRef.split(",");
    //     const trimmedTags = [];
    //     for (var i = 0; i < tags.length; i++) {
    //         let tag = tags[i].trim().toLowerCase();
    //         trimmedTags.push(tag)
    //     }
    //     const uniqTags = [...new Set(trimmedTags)];
    //     console.log(uniqTags);
    //     return uniqTags;
    // }

    updateSettings = (setting, settingValue) => {
        //console.log("update settings called", setting, settingValue)
        firebase.firestore().collection('deck').doc(this.state.deck.id).update(setting, settingValue);

    }

    download = () => {
        let items = this.state.prompts.map((prompt, index) => {
            return (
                [prompt.body.replace(/,/g, ''), prompt.tags.map((tag) => {
                    return tag.id
                })]
            )
        })

        let csv = "data:text/csv;charset=utf-8,"
            + items.map(e => e.join(",")).join("\n");

        // Once we are done looping, download the .csv by creating a link
        let link = document.createElement('a')
        link.id = 'download-csv'
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
        link.setAttribute('download', 'prompts.csv');
        document.body.appendChild(link)
        document.querySelector('#download-csv').click()
        link.remove();
    }

    getPrompts = (deckId) => {
        firebase.firestore().collection('prompts').where("deckId", "==", deckId).onSnapshot(serverUpdate => {
            const prompts = serverUpdate.docs.map(_doc => {
                const data = _doc.data();
                data['id'] = _doc.id;
                return data;
            })
            prompts.sort((a,b) => (b.dateUpdated < a.dateUpdated) ? 1 : -1 )
            this.setState({
                prompts: prompts,
            })
            this.serializeTags();
        });
    }

    addPrompt = async (body, tags, comment, title) => {
        //console.log("Added: " + body + " " + tags)
        const promptTitle = title == null ? "Untitled" : title
        const newFromDb = await firebase.firestore().collection('prompts').add({
            deckId: this.state.deckId,
            body: body,
            tags: tags,
            comment: comment,
            title: promptTitle,
            dateUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    editPrompt = (id, body, tags, comment, title) => {
        //console.log(title, body, comment)
        const promptTitle = title == "" ? "Untitled" : title
        firebase.firestore().collection('prompts').doc(id).update({
            body: body,
            tags: tags,
            comment: comment,
            title: promptTitle,
            dateUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    deletePrompt = (id) => {
        console.log("Deleted Prompt")
        firebase.firestore().collection('prompts').doc(id).delete();
    }

    deleteDeck = async (id) => {
        console.log("Deleted Deck")
        await firebase.firestore().collection('prompts').where("deckId", "==", id).get().then(function (querySnapshot) {
            // Once we get the results, begin a batch
            var batch = firebase.firestore().batch();

            querySnapshot.forEach(function (doc) {
                // For each doc, add a delete operation to the batch
                batch.delete(doc.ref);
            });

            // Commit the batch
            batch.commit();
        }).then(function () {
            firebase.firestore().collection('deck').doc(id).delete();
        });
    }

    setAndOr = async () => {
        //FALSE= OR; TRUE= AND
        console.log(this.state.andOr)
        console.log("toggle toggle :D")
        await this.setState({
            andOr: !this.state.andOr
        })
        console.log(this.state.andOr)
    }

    filterPrompts = async (tags) => {
        //console.log(tags, this.state.prompts.length, this.state.andOr);
        let andOr = this.state.andOr; //FALSE= OR; TRUE= AND
        let filteredPrompts = [];
        //let and = (arr, target) => target.every(v => arr.includes(v));
        //let or = (arr, target) => target.some(v => arr.indexOf(v) >= 0);

        if (tags.length == 0) {
            filteredPrompts = this.state.prompts;
        }
        else {
            //filter prompts, then pick from remaining prompts
            if (andOr) { // "AND" query
                for (var i = 0; i < this.state.prompts.length; i++) {
                    // if (and(this.state.prompts[i].tags, tags)) {
                    //     filteredPrompts.push(this.state.prompts[i]);
                    // }

                    if (tags.every(tag => this.state.prompts[i].tags.find(x => x.id === tag.id))) {
                        filteredPrompts.push(this.state.prompts[i])
                    }
                }
            }
            else { // "OR" query
                for (var i = 0; i < this.state.prompts.length; i++) {
                    // console.log(this.state.prompts[i].tags, tags)
                    // if (or(this.state.prompts[i].tags, tags)) {
                    //     filteredPrompts.push(this.state.prompts[i]);
                    // }

                    // for (var t = 0; t < this.state.prompts[i].tags.length; t++) {
                    //     if(tags.some(filter => filter.id === this.state.prompts[i].tags[t].id)) {
                    //         filteredPrompts.push(this.state.prompts[i])
                    //     }
                    // }

                    if (tags.some(tag => this.state.prompts[i].tags.find(x => x.id === tag.id))) {
                        filteredPrompts.push(this.state.prompts[i])
                    }
                }
            }
        }
        //console.log(filteredPrompts);
        const random = Math.floor(Math.random() * Math.floor(filteredPrompts.length));
        return filteredPrompts[random];
    }

}


export default EditDeck;
