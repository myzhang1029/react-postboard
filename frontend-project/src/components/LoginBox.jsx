import { useContext, useState } from 'react';

import './LoginBox.css';
import { UserContext } from '../contexts.js';
import { apiLoginOrSignup } from '../apiInterface.js';


/// Form action function to handle login or signup
async function loginOrSignup(username, email, display_name, isSignup, setMessage, setUser) {
  if (username === '' || email === '') {
    setMessage('Username and email cannot be empty');
    return;
  }
  const response_data = await apiLoginOrSignup(username, email, display_name, isSignup);
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
  const [isSignup, setIsSignup] = useState(true);
  const [message, setMessage] = useState('');
  const { setUser } = useContext(UserContext);
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
          setUser
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
