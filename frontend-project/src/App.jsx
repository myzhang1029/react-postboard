import { useState } from 'react';

import './App.css';
import PostsList from './components/PostsList.jsx';
import NavBar from './components/NavBar.jsx';
import WritePostBox from './components/WritePostBox.jsx';
import { UserContext, PostContext } from './contexts.js';

function App() {
  const [user, setUser] = useState({});
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavBar title="React Post Board" />
      <WritePostBox />
      <PostsList />
    </UserContext.Provider>
  );
}

export default App;
