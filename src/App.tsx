import React from 'react';
import './App.css';
import Drawer from "./Components/Drawer/Drawer";
import DialogueManager from "./pages/DialogueManager/DialogueManager";
import UpdateAndEncode from './pages/UpdateAndEncode/UpdateAndEncode';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Drawer />
      <Routes>
        <Route path="/dialogue-manager" element={<DialogueManager />} />
        <Route path="/update-and-encode" element={<UpdateAndEncode />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
