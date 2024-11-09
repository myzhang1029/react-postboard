/** Functions for interacting with the backend API. */
import API_ENDPOINT from './config.js';


/// Actually use the login/signup API and return the JSON response
async function apiLoginOrSignup(username, email, display_name, isSignup) {
    const data = {
      username,
      email,
    };
    if (isSignup) {
      data.display_name = display_name === '' ? null : display_name;
    }
    const url = isSignup ? `${API_ENDPOINT}/signup` : `${API_ENDPOINT}/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
}


async function apiReloadPosts() {
    const response = await fetch(`${API_ENDPOINT}/posts`);
    const posts = response.json()
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
        });
    return posts;
}


async function apiPostPost(content, user, postIdtoUpdate) {
    const form_data = {
        content,
        user_id: user.id,
        token: user.token,
    };
    const url = postIdtoUpdate ? `${API_ENDPOINT}/posts/${postIdtoUpdate}` : `${API_ENDPOINT}/posts`;
    const method = postIdtoUpdate ? 'PUT' : 'POST';
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(form_data),
    });
    return await response.json();
}


async function apiDeletePost(id, user) {
    const response = await fetch(`${API_ENDPOINT}/posts/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id, token: user.token }),
    });
    return await response.json();
}

export { apiLoginOrSignup, apiReloadPosts, apiPostPost, apiDeletePost };
