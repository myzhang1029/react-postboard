import { useState, useEffect } from 'react';

import PostCard from "./PostCard.jsx";
import API_ENDPOINT from "./config.js";

function PostsList() {
    // posts: {
    //     id: number,
    //     content: string,
    //     user: number,
    //     user_display_name: string,
    //     created_at: string,
    // }
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
                            return {
                                id: post.post.id,
                                content: post.post.content,
                                created_at: post.post.created_at,
                                user: post.post.user.id,
                                user_display_name: post.post.user.display_name || post.post.user.username,
                            };
                        });
                });
                return Promise.all(postPromises);
            })
            .then(posts => setPosts(posts))
    }, []);
    return (
        <div className="posts-list">
            <h2>Posts</h2>
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}

export default PostsList;
