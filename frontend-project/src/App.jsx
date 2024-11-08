import { useState } from 'react';

import './App.css';
import PostsList from './components/PostsList.jsx';
import NavBar from './components/NavBar.jsx';
import WritePostBox from './components/WritePostBox.jsx';
import { UserContext, PostContext, PostEditorContext } from './contexts.js';

function App() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <PostContext.Provider value={{ posts, setPosts }}>
        <PostEditorContext.Provider value={{ isVisible, setIsVisible, postToUpdate, setPostToUpdate }}>
          <NavBar title="React Post Board" />
          { isVisible && <WritePostBox /> }
          <PostsList />
        </PostEditorContext.Provider>
      </PostContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
