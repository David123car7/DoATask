"use client"; // Add this if you're using Next.js App Router

import { useState } from 'react';

export default function Page() {
  const [inputMessage, setInputMessage] = useState(''); // State to store the input message
  const [backendResponse, setBackendResponse] = useState(''); // State to store the backend response

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    try {
      // Send the message to the backend
      const res = await fetch('http://localhost:3333/user/message', {
        method: 'POST', // Use POST to send data
        headers: {
          'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify({ message: inputMessage }), // Send the message in the request body
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      // Parse the backend response
      const data = await res.json();
      setBackendResponse(data.message); // Update the response state
    } catch (error) {
      console.error(error);
      setBackendResponse('Error sending message');
    }
  };

  return (
    <div>
      <h1>Send a Message to the Backend</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)} // Update the input message state
          placeholder="Enter your message"
          required
        />
        <button type="submit">Send</button>
      </form>

      {backendResponse && (
        <div>
          <h2>Response from Backend:</h2>
          <p>{backendResponse}</p>
        </div>
      )}
    </div>
  );
}