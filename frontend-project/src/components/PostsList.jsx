import { useContext, useEffect } from 'react';

import PostCard from "./PostCard.jsx";
import { PostContext, PostEditorContext } from '../contexts.js';
import { apiReloadPosts } from '../apiInterface.js';

function reloadPosts(setPosts) {
    apiReloadPosts().then(posts => setPosts(posts));
}

function PostsList() {
    const { posts, setPosts } = useContext(PostContext);
    const { setIsVisible, setPostToUpdate } = useContext(PostEditorContext);

    useEffect(() => {
        reloadPosts(setPosts);
        console.log('PostsList: useEffect');
    }, []);
    return (
        <div className="posts-list-container">
            <div className="posts-list-header">
                <div className="posts-list-buttons twoside-row">
                    <button onClick={() => {
                        setIsVisible(true);
                        setPostToUpdate(null);
                    }}>Write a post</button>
                    <button onClick={() => reloadPosts(setPosts)}>Reload</button>
                </div>
                <h2>Posts</h2>
            </div>
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
                                key={post.id}
                            />
                        ))
                }
            </div>
        </div>
    );
}

export default PostsList;
