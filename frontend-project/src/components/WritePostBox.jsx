import { useContext, useState } from 'react';

import './WritePostBox.css';
import './card-common.css';
import { UserContext, PostContext, PostEditorContext } from '../contexts.js';
import { apiPostPost, apiReloadPosts } from '../apiInterface.js';

function postPost(content, user, postIdtoUpdate, setMessage, setIsVisible, setPosts) {
    if (content === '') {
        setMessage('Content cannot be empty');
    }
    apiPostPost(content, user, postIdtoUpdate, setPosts)
        .then(responseJson => {
            console.log(responseJson);
            if (!responseJson.status || responseJson.status !== 'ok') {
                setMessage('Failed: ' + JSON.stringify(responseJson));
            }
            // Update the post list with the new post
            apiReloadPosts().then(posts => setPosts(posts));
            setIsVisible(false);
            setMessage('');
        });
}

function WritePostBox() {
    const { user } = useContext(UserContext);
    const { setIsVisible, postToUpdate } = useContext(PostEditorContext);
    const { setPosts } = useContext(PostContext);
    const [post, setPost] = useState(postToUpdate ? postToUpdate.content : '');
    const [message, setMessage] = useState('');

    if (!user || !user.token) {
        return (
            <>
                <div className="write-post-box-mask"></div>
                <div className="write-post-box post-card">
                    <h3>Log in to write a post</h3>
                    <p>Click the login button at the top right corner to log in or sign up</p>
                    <div className="write-post-box-actions-row">
                        <button onClick={() => setIsVisible(false)}>Got it!</button>
                    </div>
                </div>
            </>
        );
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
                    <button onClick={() => setIsVisible(false)}>Cancel</button>
                    <button onClick={() => postPost(post, user, postToUpdate ? postToUpdate.id : null, setMessage, setIsVisible, setPosts)}>Post</button>
                </div>
            </div>
        </>
    );
}

export default WritePostBox;
