import { useEffect, useState, useRef } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({ socket, username, room, hasJoinedRoom }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  // State to manage recording status and media recorder

  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]); // To store audio data chunks

  const sendMessage = async () => {

    if (currentMessage.trim() === '') return;

    const messageData = {
      room,
      author: username,
      message: currentMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };

    // Emit the message to the server

    await socket.emit('send_message', messageData);
    setMessageList((prev) => [...prev, messageData]);
    setCurrentMessage('');
  };

  // Function to start recording audio

  const startRecording = async () => {

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        const reader = new FileReader();

        reader.onloadend = async () => {
          const base64AudioMessage = reader.result;

          const messageData = {
            room,
            author: username,
            message: base64AudioMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'audio',
          };

          // Emit the audio message to the server

          await socket.emit('send_message', messageData);
          setMessageList((prev) => [...prev, messageData]);
        };

        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Listen for incoming messages and previous messages 

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((prev) => [...prev, data]);
    });

    socket.on('load_previous_messages', (data) => {
      setMessageList(data);
    });

    return () => {
      socket.off('receive_message');
      socket.off('load_previous_messages');
    };
  }, [socket]);

  if (!hasJoinedRoom) return null;

  return (
    
    <div className="max-w-3xl w-full mx-auto mt-10 border border-white/30 rounded-xl shadow-2xl flex flex-col h-[80vh] bg-gradient-to-br from-blue-100 via-white to-blue-200 backdrop-blur-md">

      <div className="bg-purple-300 text-center p-4 font-semibold font-serif text-lg rounded-t-xl shadow-md">

        <p>💬 Live Chat - Room <strong>{room}</strong></p>
      </div>

      <ScrollToBottom className="flex-1 p-4 overflow-y-auto bg-white/10 space-y-3">

        {messageList.map((msg, index) => {
          const isMyMessage = msg.author === username;
          const isAudio = msg.type === 'audio';

          return (

            <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>

              <div className={` px-4 py-3 max-w-[70%] rounded-2xl text-sm shadow-lg ${
                  isMyMessage
                    ? 'bg-blue-400 text-white rounded-br-none'
                    : 'bg-white/90 text-gray-800 rounded-bl-none'
                }`}>


                  <div className="text-xs font-semibold mb-1 text-gray-800">
                    {isMyMessage ? 'You' : msg.author}
                  </div>
    

                {isAudio ? (
                  <audio controls className="w-full">
                    <source src={msg.message} type="audio/webm" />
                    Your browser does not support the audio element.
                  </audio>

                ) : (


                  <p className="break-words">{msg.message}</p>
                )}


                <div className="text-xs mt-1 opacity-70 text-right ">
                  {msg.author} • {msg.time}
                </div>


              </div>
            </div>
          );
        })}
      </ScrollToBottom>



      <div className="bg-slate-300 flex flex-col gap-2 border-white/20 p-2 bg-white/30">

        <div className=" flex">

          <input
            type="text"
            placeholder="Type a message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="flex-grow px-4 py-2 rounded-l-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />


          <button
            onClick={sendMessage}
            className="px-5 bg-blue-400 rounded-r-lg text-white font-bold"
          >  &#9658; </button>


          <button
            onClick={recording ? stopRecording : startRecording}
            className={`px-4 py-1 rounded-lg text-white font-medium shadow ${
              recording ? 'bg-red-400' : 'bg-green-500'
            }`}
          >
            {recording ? 'Stop 🎙️' : 'Record 🎤'}
          </button>
     
          
        </div>
      </div>
    </div>
  );
}

export default Chat;
