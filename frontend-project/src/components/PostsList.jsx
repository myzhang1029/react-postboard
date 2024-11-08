import { useState, useEffect } from 'react';

import PostCard from "./PostCard.jsx";
import API_ENDPOINT from "../config.js";

function PostsList() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch(`${API_ENDPOINT}/posts`)
            .then(response => response.json())
            .then(post_infos => {
                // TODO: Error handling
                const postPromises = post_infos.posts.map(post_info => {
                    return fetch(`${API_ENDPOINT}/posts/${post_info.post_id}`)
                        .then(response => response.json())
                        .then(post => {
                            // TODO: Error handling
                            console.log(post);
                            const user_display_name = post.post.user.display_name || post.post.user.username;
                            const created_at = new Date(post.post.created_at);
                            return {
                                id: post.post.id,
                                content: post.post.content,
                                user: post.post.user.id,
                                user_display_name,
                                created_at,
                            };
                        });
                });
                return Promise.all(postPromises);
            })
            .then(posts => setPosts(posts))
    }, []);
    return (
        <div className="posts-list-container">
            <h2>Posts</h2>
            <div className="posts-list">
                {
                    // Sort the posts by created_at in descending order
                    posts
                        .sort((a, b) => b.created_at - a.created_at)
                        .map(post => (
                            <PostCard
                                pid={post.id}
                                content={post.content}
                                uid={post.user}
                                user={post.user_display_name}
                                created_at={post.created_at}
                            />
                        ))
                }
            </div>
        </div>
    );
}

export default PostsList;
