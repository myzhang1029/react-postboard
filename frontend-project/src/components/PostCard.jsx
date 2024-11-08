import { useContext } from 'react';
import Markdown from 'react-markdown';

import './PostCard.css';
import './card-common.css';
import { UserContext } from '../contexts.js';

function displayDate(date) {
    return date.toLocaleString({ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function PostCard({ pid, uid, user: postUser, content, created_at }) {
    const { user } = useContext(UserContext);
    return (
        <div className="post-card" key={pid}>
            <div className="post-card-info-row">
                <div className="post-card-user">{postUser}</div>
                <div className="post-card-created-at">{displayDate(created_at)}</div>
            </div>
            <div className="post-card-content"><Markdown>{content}</Markdown></div>
            { (user && user.id === uid) && (
                <div className="post-card-actions-row">
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            )}
        </div>
    );
}

export default PostCard;
