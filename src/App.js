
import './App.css';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom'
import { history } from './utils/history';
import Login from '@/pages/Login';
import GeekLayout from '@/pages/Layout/';
import Home from './pages/Home';
import Article from './pages/Article';
import Publish from './pages/Publish';

function App() {
  return (
    <HistoryRouter history={history}>

      <div className="App">
        <Routes>
          <Route path='/' element={<GeekLayout />}>
            <Route index element={<Home></Home>}></Route>
            <Route path='article' element={<Article />}></Route>
            <Route path='publish' element={<Publish />}></Route>
          </Route>
          <Route path='/login' element={<Login />}> </Route>
        </Routes>
      </div>

    </HistoryRouter>

  );
}

export default App;
