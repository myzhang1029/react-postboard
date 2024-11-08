import './App.css';
import PostsList from './components/PostsList.jsx';
import NavBar from './components/NavBar.jsx';
import WritePostBox from './components/WritePostBox.jsx';

function App() {
  return (
    <>
      <NavBar title="React Post Board" />
      <WritePostBox />
      <PostsList />
    </>
  );
}

export default App;
