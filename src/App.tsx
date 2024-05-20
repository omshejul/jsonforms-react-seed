import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Drawer from './Components/Drawer/Drawer';
import DialogueManager from './pages/DialogueManager/DialogueManager';
import DialogueManager2 from './pages/DialogueManager2/DialogueManager2';
import StoreConversation from './pages/StoreConversation/StoreConversation';
import UpdateAndEncode from './pages/UpdateAndEncode/UpdateAndEncode';
import Home from './pages/Home/Home';
import NodeRed from './pages/NodeRed/NodeRed';

const App = () => {
  return (
    <BrowserRouter>
      <Drawer />
      <Routes>
        <Route path='/' element={<Home/>} />
        {/* <Route path='/' element={<Navigate to='/dialogue-manager' replace />} /> */}
        <Route path='/dialogue-manager' element={<DialogueManager />} />
        <Route path='/dialogue-manager-v2' element={<DialogueManager2 />} />
        <Route path='/update-and-encode' element={<UpdateAndEncode />} />
        <Route path='/store-conversation' element={<StoreConversation />} />
        <Route path='/node-red' element={<NodeRed />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
