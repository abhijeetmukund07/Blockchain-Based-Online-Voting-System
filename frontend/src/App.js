import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import {HashRouter,Routes,Route} from "react-router-dom";
import LoginPage from './components/LoginPage';
import About from './components/About';
import Navbar from './components/Navbar';
import Foot from './components/foot';
import Home from './components/Home';
import VoterHome from './components/VoterHome';
import RegistrationPage from './components/RegistrationPage';
import AdminHome from './components/AdminHome';
import VoterList from './components/VoterList';
import Election from './components/Election';
import EditElection from  './components/EditElection';
import VoterVote from './components/VoterVote';
import AdminResults from './components/AdminResults';
import ResultsPage from './components/Results';

function App() {
  return (
    <div class=''>
      <HashRouter>
          <Routes>
            <Route path='/about' element={<About/>}/>
            <Route path='/' element={<Home/>}/>
            <Route path='/foot' element={<Foot/>}/>
            <Route path='/navbar' element={<Navbar/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/voter-home/:voterName" element={<VoterHome/>} />
            <Route path="/vote/:electionTitle/:voterName" element={<VoterVote />} />
            <Route path="/admin-home" element={<AdminHome/>} />
            <Route path="/Admin/VoterList" element={<VoterList />} />
            <Route path="/Admin/Election" element={<Election/>} />
            <Route path="/Admin/election/:electionTitle" element={<EditElection />} />
            <Route path="/Admin/Results" element={<AdminResults/>} />
            <Route path="/Results/:voterName" element={<ResultsPage />} />
          </Routes>
      </HashRouter>
    </div>
  );
}

export default App;