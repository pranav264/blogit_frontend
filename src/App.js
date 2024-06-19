import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Authentication from './Pages/Authentication';
import Documents from './Pages/Documents';
import './App.css';
import WriteABlog from './Pages/WriteABlog';
import Blog from './Pages/Blog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Authentication />} />
        <Route path='/documents' element={<Documents />} />
        <Route path='/write' element={<WriteABlog />} />
        <Route path='/blog/:blogId/:docId' element={<Blog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;