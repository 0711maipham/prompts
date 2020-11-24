import React, { useRef, useState } from "react"
import { WithContext as ReactTags } from 'react-tag-input';

export default function Tags(props) {
    const { allTags } = props;
    const [ tags, setTags ] = useState([])

    function handleDelete(i) {
        setTags(
          tags.filter((tag, index) => index !== i),
        );
    }

    function handleAddition(t) {
        console.log(t)
        let tagArry = tags;
        tagArry.push(t);
        setTags(tagArry);
    }

    function handleTagClick(index) {
        console.log('The tag at index ' + index + ' was clicked');
    }

    return (
        <ReactTags
          tags={tags}
          suggestions={allTags}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          allowDragDrop={false}
          handleTagClick={handleTagClick}
        />
    )
}

