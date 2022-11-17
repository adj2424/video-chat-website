import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ChatRoom from './pages/ChatRoom.jsx';
import CreateRoom from './pages/CreateRoom.jsx';
import Home from './pages/Home.jsx';
import NoPage from './pages/NoPage.jsx';
import Layout from './components/Layout.jsx';
import JoinRoom from './pages/JoinRoom.jsx';
import About from './pages/About.jsx';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chatRoom" element={<ChatRoom socket={socket} />} />
          <Route path="createRoom" element={<CreateRoom />} />
          <Route path="joinRoom" element={<JoinRoom />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
