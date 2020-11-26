import React, { useRef, useState } from "react"
import { WithContext as ReactTags } from 'react-tag-input';
import '../styles/tags.css'

export default function Tags(props) {
    const { allTags, changeHandler, promptTags } = props;
    const [ tags, setTags ] = useState(promptTags)

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
        console.log(t)
        t.id = t.id.toLowerCase();
        t.text = t.text.toLowerCase();
        let newTags = tags;
        newTags.push(t);
        await setTags(newTags);
        handleChange(newTags);
    }

    function handleTagClick(index) {
        console.log('The tag at index ' + index + ' was clicked');
    }

    function handleChange(newTags) {
        console.log("tag change was handled");
        changeHandler(newTags);
    }

    return (
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
          autofocus={false}
        />
    )
}

