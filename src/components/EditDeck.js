import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import firebase from 'firebase/app'
import AddPrompt from './AddPrompt'
import PromptsList from './PromptsList'
import FilterPrompts from './FilterPrompts'
import DeckSettings from './DeckSettings'

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
                <DeckSettings
                    deck={this.state.deck}
                    onChange={this.updateSettings}
                    download={this.download}
                ></DeckSettings>
                <AddPrompt
                    addPrompt={this.addPrompt}
                    allTags={this.state.allTags}
                    formatTags={this.formatTags}
                    deck={this.state.deck}
                ></AddPrompt>
                <FilterPrompts
                    allTags={this.state.allTags}
                    formatTags={this.formatTags}
                    andOr={this.setAndOr}
                    filterPrompts={this.filterPrompts}
                    deck={this.state.deck}
                ></FilterPrompts>
                <PromptsList
                    prompts={this.state.prompts}
                    deletePrompt={this.deletePrompt}
                    editPrompt={this.editPrompt}
                    allTags={this.state.allTags}
                    formatTags={this.formatTags}
                    deck={this.state.deck}
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
        console.log("serialized tags", uniqTags);
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
        console.log("update settings called", setting, settingValue)
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
            tags: tags,
            dateUpdated: firebase.firestore.FieldValue.serverTimestamp()
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

    filterPrompts = async (tags) => {
        console.log(tags, this.state.prompts.length, this.state.andOr);
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
        console.log(filteredPrompts);
        const random = Math.floor(Math.random() * Math.floor(filteredPrompts.length));
        console.log("random", filteredPrompts[random])
        return filteredPrompts[random];
    }

}


export default EditDeck;
