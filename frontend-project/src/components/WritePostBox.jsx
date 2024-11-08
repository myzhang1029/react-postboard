import './WritePostBox.css';
import './card-common.css';
import API_ENDPOINT from "../config.js";

async function postPost(content) {
    const post_data = {
        content,
        user_id: 1, // TODO: Get the user ID from the session
        token: 'TODO: Get the token from the session',
    };
    const response = await fetch(`${API_ENDPOINT}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post_data),
    });
    return await response.json();
}

function readFormPost() {
    const content = document.getElementById('write-post-content').value;
    if (content === '') {
        document.getElementById('write-post-box-message').innerText = 'Content cannot be empty';
        return;
    }
    postPost(content)
        .then(post => {
            console.log(post);
            if (!post.status || post.status !== 'ok') {
                document.getElementById('write-post-box-message').innerText = 'Failed: ' + post;
                return;
            }
        });
}

function WritePostBox() {
    return (
        <div className="write-post-box post-card">
            <h3>Write a Post...</h3>
            <textarea id="write-post-content" rows="4" cols="50" className="post-card-content"></textarea>
            <div className="write-post-box-message-row">
                <div id="write-post-box-message"></div>
            </div>
            <button onClick={readFormPost}>Post</button>
        </div>
    );
}

export default WritePostBox;
