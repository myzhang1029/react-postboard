import Markdown from 'react-markdown';

import './PostCard.css';
import './card-common.css';

function displayDate(date) {
    return date.toLocaleString({ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function PostCard({ user, content, created_at, key }) {
    return (
        <div className="post-card" key={key}>
            <div className="post-card-info-row">
                <div className="post-card-user">{user}</div>
                <div className="post-card-created-at">{displayDate(created_at)}</div>
            </div>
            <div className="post-card-content"><Markdown>{content}</Markdown></div>
        </div>
    );
}

export default PostCard;
