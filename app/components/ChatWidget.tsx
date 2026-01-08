'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ user: string; bot: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message
    setMessages((prev) => [...prev, { user: userMessage, bot: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { user: userMessage, bot: data.bot };
        return updated;
      });
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          user: userMessage,
          bot: 'Sorry, there was an error. Please try again.',
        };
        return updated;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      <button
        id="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#0D1625',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        💬
      </button>
      <div
        id="chat-box-container"
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '300px',
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          zIndex: 999,
        }}
      >
          <div
            id="chat-box"
            ref={chatBoxRef}
            style={{
              height: '300px',
              overflowY: 'auto',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {messages.map((msg, idx) => (
              <div key={idx}>
                {msg.user && (
                  <div
                    className="message user"
                    style={{
                      maxWidth: '80%',
                      padding: '10px',
                      borderRadius: '10px',
                      wordWrap: 'break-word',
                      alignSelf: 'flex-end',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: '1px solid #ddd',
                    }}
                  >
                    {msg.user}
                  </div>
                )}
                {msg.bot && (
                  <div
                    className="message bot"
                    dangerouslySetInnerHTML={{ __html: msg.bot }}
                    style={{
                      maxWidth: '80%',
                      padding: '10px',
                      borderRadius: '10px',
                      wordWrap: 'break-word',
                      alignSelf: 'flex-start',
                      backgroundColor: '#0D1625',
                      color: '#ffffff',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div
            id="chat-input"
            style={{
              display: 'flex',
              borderTop: '1px solid #ccc',
            }}
          >
            <input
              type="text"
              id="chat-message"
              placeholder="Type a message..."
              autoComplete="off"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                flex: 1,
                border: 'none',
                padding: '10px',
              }}
            />
            <button
              id="chat-send"
              onClick={sendMessage}
              style={{
                background: '#0D1625',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
    </>
  );
}

