/** React Contexts */
import { createContext } from 'react';

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

export { UserContext, PostContext, PostEditorContext  };
