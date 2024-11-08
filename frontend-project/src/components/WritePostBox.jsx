import { useContext, useState } from 'react';

import './WritePostBox.css';
import './card-common.css';
import API_ENDPOINT from "../config.js";
import { UserContext } from '../contexts.js';

async function postPost(content, user, setMessage) {
    if (content === '') {
        setMessage('Content cannot be empty');
        return;
    }
    const post_data = {
        content,
        user_id: user.id,
        token: user.token,
    };
    const response = await fetch(`${API_ENDPOINT}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post_data),
    });
    const responseJson = await response.json();
    console.log(responseJson);
    if (!responseJson.status || responseJson.status !== 'ok') {
        setMessage('Failed: ' + JSON.stringify(responseJson));
        return;
    }
    setMessage('');
}

function WritePostBox() {
    const { user } = useContext(UserContext);
    const [post, setPost] = useState('');
    const [message, setMessage] = useState('');

    if (!user || !user.token) {
        return (
            <div className="write-post-box post-card">
                <h3>Log in to write a post</h3>
            </div>
        );
    }
    return (
        <div className="write-post-box post-card">
            <h3>Write a Post...</h3>
            <textarea id="write-post-content" rows="4" cols="50" className="post-card-content" value={post} onChange={e => setPost(e.target.value)}></textarea>
            <div className="write-post-box-message-row">
                <div id="write-post-box-message" className="message-div"></div>
            </div>
            <button onClick={() => postPost(post, user, setMessage)}>Post</button>
        </div>
    );
}

export default WritePostBox;
