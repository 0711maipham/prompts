import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import firebase from 'firebase/app'
import AddPrompt from './AddPrompt'
import PromptsList from './PromptsList'
import FilterPrompts from './FilterPrompts'

class EditDeck extends React.Component {
    constructor() {
        super();
        this.state = {
            deckId: window.location.pathname.replace("/deck/", ""),
            deck: {},
            prompts: [],
            allTags: [],
            andOr: false,
        }
        console.log(this.state)
    }

    render() {
        return (
            <Container>
                <div>{this.state.deck.name}</div>
                <AddPrompt
                    addPrompt={this.addPrompt}
                    allTags={this.state.allTags}
                    formatTags={this.formatTags}
                ></AddPrompt>
                <FilterPrompts
                    allTags={this.state.allTags}
                    formatTags={this.formatTags}
                    andOr={this.setAndOr}
                    filterPrompts={this.filterPrompts}
                ></FilterPrompts>
                <PromptsList
                    prompts={this.state.prompts}
                    deletePrompt={this.deletePrompt}
                    editPrompt={this.editPrompt}
                    allTags={this.state.allTags}
                    formatTags={this.formatTags}
                ></PromptsList>
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

    //Combine every tag in the deck into one array
    serializeTags() {
        const prompts = this.state.prompts;
        var combinedPrompts = "";
        for (var i = 0; i < prompts.length; i++) {
            var stringTags = prompts[i].tags.join();
            combinedPrompts = combinedPrompts + "," + stringTags;
        }
        //console.log("combinedPromptsare: " + combinedPrompts);
        const uniqTags = [...new Set(combinedPrompts.split(","))];
        const index = uniqTags.indexOf(""); //remove empty tags
        if (index > -1) {
            uniqTags.splice(index, 1);
        }
        uniqTags.sort();
        console.log("serialized tags", uniqTags);
        this.setState({
            allTags: uniqTags
        })
    }

    formatTags(tagsRef) {
        const tags = tagsRef.split(",");
        const trimmedTags = [];
        for (var i = 0; i < tags.length; i++) {
            let tag = tags[i].trim().toLowerCase();
            trimmedTags.push(tag)
        }
        const uniqTags = [...new Set(trimmedTags)];
        console.log(uniqTags);
        return uniqTags;
    }

    getPrompts = (deckId) => {
        firebase.firestore().collection('prompts').where("deckId", "==", deckId).onSnapshot(serverUpdate => {
            const prompts = serverUpdate.docs.map(_doc => {
                const data = _doc.data();
                data['id'] = _doc.id;
                return data;
            })
            this.setState({
                prompts: prompts,
            })
            this.serializeTags();
        });
    }

    addPrompt = async (body, tags) => {
        console.log("Added: " + body + " " + tags)
        const newFromDb = await firebase.firestore().collection('prompts').add({
            deckId: this.state.deckId,
            body: body,
            tags: tags
        });
    }

    editPrompt = (id, body, tags) => {
        firebase.firestore().collection('prompts').doc(id).update({
            body: body,
            tags: tags,
            dateUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    deletePrompt = (id) => {
        console.log("Deleted Prompt")
        firebase.firestore().collection('prompts').doc(id).delete();
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

    filterPrompts = (tags) => {
        let andOr = this.state.andOr; //FALSE= OR; TRUE= AND
        let filteredPrompts = [];
        let and = (arr, target) => target.every(v => arr.includes(v));
        let or = (arr, target) => target.some(v => arr.indexOf(v) >= 0);
        if (tags.length == 0) {
            filteredPrompts = this.state.prompts;
        }
        else {
            //filter prompts, then pick from remaining prompts
            if (andOr) { // "AND" query
                for (var i = 0; i < this.state.prompts.length; i++) {
                    if (and(this.state.prompts[i].tags, tags)) {
                        filteredPrompts.push(this.state.prompts[i]);
                    }
                }
            }
            else { // "OR" query
                for (var i = 0; i < this.state.prompts.length; i++) {
                    if (or(this.state.prompts[i].tags, tags)) {
                        filteredPrompts.push(this.state.prompts[i]);
                    }
                }
            }
        }
        console.log(filteredPrompts);
        const random = Math.floor(Math.random() * Math.floor(filteredPrompts.length));
        console.log(filteredPrompts[random])
    }

}


export default EditDeck;
