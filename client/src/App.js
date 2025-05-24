import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';

const socket = io('http://localhost:3001');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);

  const joinRoom = () => {
    if (username.trim() !== '' && room.trim() !== '') {
      socket.emit('join_room', room);
      setHasJoinedRoom(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-50 via-blue-200 to-sky-200 p-4">
      {!hasJoinedRoom ? (
        <div className="bg-white/30 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/20">
          <h2 className="text-3xl font-bold text-black mb-6 text-center drop-shadow-md">🎧 Join a Chat Room</h2>
          <input
            className="w-full p-3 mb-4 rounded-xl bg-white/80 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full p-3 mb-4 rounded-xl bg-white/80 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
            placeholder="Enter room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            onClick={joinRoom}
            className="w-full bg-white text-purple-700 font-bold py-3 rounded-xl hover:bg-pink-100 transition duration-300 shadow-lg"
          >
            Join Room
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} hasJoinedRoom={hasJoinedRoom} />
      )}
    </div>
  );
}

export default App;
