import { createContext, useContext } from 'react';

import API_ENDPOINT from './config.js';

const UserContext = createContext({
    // user: {
    //     id: number,
    //     username: string,
    //     display_name: string,
    //     token: string,
    // }
    user: null,
    setUser: () => {},
});

const PostContext = createContext({
    // posts: {
    //     id: number,
    //     content: string,
    //     user: number,
    //     user_display_name: string,
    //     created_at: date,
    // }
    posts: [],
    setPosts: () => {},
});

const PostEditorContext = createContext({
    // isVisible: boolean,
    // postToUpdate: {
    //     id: number,
    //     content: string,
    // }
    isVisible: false,
    postToUpdate: null,
    setIsVisible: () => {},
    setPostToUpdate: () => {},
});

async function reloadPosts(setPosts) {
    await fetch(`${API_ENDPOINT}/posts`)
        .then(response => response.json())
        .then(post_infos => {
            // TODO: Error handling
            const postPromises = post_infos.posts.map(async post_info => {
                const response = await fetch(`${API_ENDPOINT}/posts/${post_info.post_id}`);
                const post = await response.json();
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
            return Promise.all(postPromises);
        })
        .then(posts => setPosts(posts));
}

export { UserContext, PostContext, PostEditorContext, reloadPosts };
