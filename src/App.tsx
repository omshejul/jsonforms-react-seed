import React from 'react';
import './App.css';
import Drawer from './Components/Drawer/Drawer';
import DialogueManager from './pages/DialogueManager/DialogueManager';
import UpdateAndEncode from './pages/UpdateAndEncode/UpdateAndEncode';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StoreConversation from './pages/StoreConversation/StoreConversation';

const App = () => {
  return (
    <BrowserRouter>
      <Drawer />
      <Routes>
        <Route path='/' element={<Navigate to='/dialogue-manager' replace />} />
        <Route path='/dialogue-manager' element={<DialogueManager />} />
        <Route path='/update-and-encode' element={<UpdateAndEncode />} />
        <Route path='/store-conversation' element={<StoreConversation />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
