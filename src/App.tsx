import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Drawer from './Components/Drawer/Drawer';
import DialogueManager from './pages/DialogueManager/DialogueManager';
import StoreConversation from './pages/StoreConversation/StoreConversation';
import UpdateAndEncode from './pages/UpdateAndEncode/UpdateAndEncode';
import NodeRed from './pages/NodeRed/NodeRed';

const App = () => {
  return (
    <BrowserRouter>
      <Drawer />
      <Routes>
        <Route path='/' element={<Navigate to='/dialogue-manager' replace />} />
        <Route path='/dialogue-manager' element={<DialogueManager />} />
        <Route path='/update-and-encode' element={<UpdateAndEncode />} />
        <Route path='/store-conversation' element={<StoreConversation />} />
        <Route path='/node-red' element={<NodeRed />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
