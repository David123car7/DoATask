'use client'; // Mark this as a Client Component

import { useState } from 'react';
import { sendMessage } from './utils/message.api'; // Corrected import path

export default function Home() {
  const [inputMessage, setInputMessage] = useState('');
  const [backendResponse, setBackendResponse] = useState('');

  const handleSendMessage = async () => {
    try {
      const response = await sendMessage(inputMessage);
      setBackendResponse(response.message); // Display the backend's response
    } catch (error) {
      console.error(error);
      setBackendResponse('Error sending message');
    }
  };

  return (
    <div>
      <h1>Send a Message to the Backend</h1>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={handleSendMessage}>Send</button>

      {backendResponse && (
        <div>
          <h2>Response from Backend:</h2>
          <p>{backendResponse}</p>
        </div>
      )}
    </div>
  );
}