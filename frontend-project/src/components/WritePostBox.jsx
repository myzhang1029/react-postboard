import { useContext, useState } from 'react';

import './WritePostBox.css';
import './card-common.css';
import API_ENDPOINT from "../config.js";
import { UserContext, PostContext, PostEditorContext, reloadPosts } from '../contexts.js';

async function postPost(content, user, postIdtoUpdate, setMessage, setIsVisible, setPosts) {
    if (content === '') {
        setMessage('Content cannot be empty');
        return;
    }
    const form_data = {
        content,
        user_id: user.id,
        token: user.token,
    };
    const url = postIdtoUpdate ? `${API_ENDPOINT}/posts/${postIdtoUpdate}` : `${API_ENDPOINT}/posts`;
    const method = postIdtoUpdate ? 'PUT' : 'POST';
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(form_data),
    });
    const responseJson = await response.json();
    console.log(responseJson);
    if (!responseJson.status || responseJson.status !== 'ok') {
        setMessage('Failed: ' + JSON.stringify(responseJson));
        return;
    }
    setMessage('');
    setIsVisible(false);
    // Update the post list with the new post
    reloadPosts(setPosts);
}

function WritePostBox() {
    const { user } = useContext(UserContext);
    const { isVisible, setIsVisible, postToUpdate } = useContext(PostEditorContext);
    const { setPosts } = useContext(PostContext);
    const [post, setPost] = useState('');
    const [message, setMessage] = useState('');

    if (!isVisible) {
        return null;
    }
    if (!user || !user.token) {
        return (
            <div className="write-post-box post-card">
                <h3>Log in to write a post</h3>
            </div>
        );
    }
    if (postToUpdate) {
        setPost(postToUpdate.content);
    }
    return (
        <>
            <div className="write-post-box-mask"></div>
            <div className="write-post-box post-card">
                <h3>Write your Post...</h3>
                <textarea id="write-post-content" rows="4" cols="50" className="post-card-content" value={post} onChange={e => setPost(e.target.value)}></textarea>
                <div className="write-post-box-message-row">
                    <div id="write-post-box-message" className="message-div">{message}</div>
                </div>
                <div className="write-post-box-actions-row  twoside-row">
                    <button onClick={() => postPost(post, user, postToUpdate ? postToUpdate.id : null, setMessage, setIsVisible, setPosts)}>Post</button>
                    <button onClick={() => setIsVisible(false)}>Cancel</button>
                </div>
            </div>
        </>
    );
}

export default WritePostBox;
