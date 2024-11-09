import { useContext } from 'react';
import Markdown from 'react-markdown';
import { FaEdit, FaTrash } from "react-icons/fa";

import './PostCard.css';
import './card-common.css';
import { UserContext, PostContext, PostEditorContext } from '../contexts.js';
import { apiDeletePost, apiReloadPosts } from '../apiInterface.js';

function displayDate(date) {
    return date.toLocaleString({ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function editPost(id, content, setIsVisible, setPostToUpdate) {
    setPostToUpdate({ id, content });
    setIsVisible(true);
    console.log('Edit post: ' + id);
}

function deletePost(id, user, setPosts) {
    apiDeletePost(id, user)
        .then(responseJson => {
            if (!responseJson.status || responseJson.status !== 'ok') {
                console.error('Failed: ' + JSON.stringify(responseJson));
                return;
            }
            apiReloadPosts().then(posts => setPosts(posts));
        });
}

function PostCard({ pid, uid, user: postUser, content, created_at }) {
    const { user } = useContext(UserContext);
    const { setPosts } = useContext(PostContext);
    const { setIsVisible, setPostToUpdate } = useContext(PostEditorContext);
    return (
        <div className="post-card" key={pid}>
            <div className="post-card-info-row">
                <div className="post-card-user">{postUser}</div>
                <div className="post-card-created-at">{displayDate(created_at)}</div>
            </div>
            <div className="post-card-content"><Markdown>{content}</Markdown></div>
            { (user && user.id === uid) && (
                <div className="post-card-actions-row  twoside-row">
                    <button onClick={() => editPost(pid, content, setIsVisible, setPostToUpdate)}><FaEdit /></button>
                    <button onClick={() => deletePost(pid, user, setPosts)}><FaTrash /></button>
                </div>
            )}
        </div>
    );
}

export default PostCard;
