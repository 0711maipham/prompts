import React, { useRef, useState } from "react"
import { WithContext as ReactTags } from 'react-tag-input';
import { Form } from "react-bootstrap"
import '../styles/tags.css'

export default function Tags(props) {
    const { allTags, changeHandler, promptTags, preventAdd } = props;
    const [tags, setTags] = useState(promptTags)

    // console.log("tags.js", tags)
    // console.log(promptTags);

    const KeyCodes = {
        comma: 188,
        enter: 13,
    };

    const delimiters = [KeyCodes.comma, KeyCodes.enter];

    async function handleDelete(i) {
        const newTags = tags.filter((tag, index) => index !== i);
        await setTags(newTags);
        handleChange(newTags);
    }

    async function handleAddition(t) {
        //console.log(t)
        //Check if the t matches any of the tags in suggestions
        const match = allTags.find(x => x.id === t.id);
        //console.log("Is Unique", match)
        if (!preventAdd || match) {
            t.id = t.id.toLowerCase();
            t.text = t.text.toLowerCase();
            let newTags = [...tags, t];
            //newTags.push(t);
            await setTags(newTags);
            handleChange(newTags);
        }
        else {
            return false;
        }
    }

    function handleTagClick(index) {
        console.log('The tag at index ' + index + ' was clicked');
    }

    function handleChange(newTags) {
        console.log("tag change was handled");
        changeHandler(newTags);
    }

    return (
        <Form.Group id="tags">
        <Form.Label className="mr-2">Tags</Form.Label><span className="subline">Separate with commas or press enter.</span>
        <ReactTags
            tags={tags}
            suggestions={allTags}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            delimiters={delimiters}
            allowDragDrop={false}
            handleTagClick={handleTagClick}
            maxLength={20}
            minQueryLength={1}
            autofocus={true}
            autocomplete={preventAdd}
        />
        </Form.Group>
    )
}

