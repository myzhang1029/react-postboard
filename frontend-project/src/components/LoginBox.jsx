import { useContext, useState } from 'react';

import './LoginBox.css';
import API_ENDPOINT from '../config.js';
import { UserContext } from '../contexts.js';

/// Actually use the login/signup API and return the JSON response
async function loginOrSignupInner(username, email, display_name, isSignup) {
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

/// Form action function to handle login or signup
async function loginOrSignup(username, email, display_name, isSignup, setMessage, setUser, setToken) {
  if (username === '' || email === '') {
    setMessage('Username and email cannot be empty');
    return;
  }
  const response_data = await loginOrSignupInner(username, email, display_name, isSignup);
  if (!response_data.status || response_data.status !== 'ok') {
    setMessage('Failed: ' + JSON.stringify(response_data));
    return;
  }
  console.log(response_data);
  setUser({
    id: response_data.user_id,
    username: response_data.username,
    display_name: response_data.display_name,
    token: response_data.token,
  });
  setMessage('');
}

function LoginFormInner() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState('');
  const { setUser, setToken } = useContext(UserContext);
  return (
    <div className="login-box">
      <div className="login-box-input-row twoside-row">
        <label htmlFor="login-box-username">Username:&nbsp;</label>
        <input
          type="text"
          id="login-box-username"
          name="login-box-username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div className="login-box-input-row twoside-row">
        <label htmlFor="login-box-email">Email:&nbsp;</label>
        <input
          type="email"
          id="login-box-email"
          name="login-box-email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      {isSignup && (
        <div className="login-box-input-row twoside-row">
          <label htmlFor="login-box-display-name">Display Name:&nbsp;</label>
          <input
            type="text"
            id="login-box-display-name"
            name="login-box-display-name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </div>
      )}
      <div className="login-box-message-row">
        <div id="login-box-message" className="message-div">{message}</div>
      </div>
      <div className="login-box-input-row twoside-row">
        <button onClick={() => loginOrSignup(
          username,
          email,
          displayName,
          isSignup,
          setMessage,
          setUser,
          setToken
        )}>Submit</button>
        <button onClick={() => setIsSignup(!isSignup)}>{isSignup ? 'Log In' : 'Sign Up'} instead</button>
      </div>
    </div>
  );
}

function LoginBox() {
  const { user } = useContext(UserContext);
  if (user && user.id && user.username && user.display_name && user.token) {
    return (
      <div className="login-box">
        <div className="login-box-title">Logged in as {user.display_name || user.username}</div>
      </div>
    );
  }
  return <LoginFormInner />;
}

export default LoginBox;
