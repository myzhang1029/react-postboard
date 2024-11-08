import { useContext, useEffect } from 'react';

import PostCard from "./PostCard.jsx";
import { PostContext, PostEditorContext, reloadPosts } from '../contexts.js';

function PostsList() {
    const { posts, setPosts } = useContext(PostContext);
    const { setIsVisible, setPostToUpdate } = useContext(PostEditorContext);

    useEffect(() => {
        reloadPosts(setPosts);
    }, []);
    return (
        <div className="posts-list-container">
            <div className="posts-list-header">
                <h2>Posts</h2>
                <button onClick={() => {
                    setIsVisible(true);
                    setPostToUpdate(null);
                }
                }>Write a post</button>
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
                            />
                        ))
                }
            </div>
        </div>
    );
}

export default PostsList;
