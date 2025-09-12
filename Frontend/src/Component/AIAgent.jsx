import React, { useState, useEffect, useRef } from 'react';

const AIAgent = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 320, height: 400 });
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // ✅ Groq API Configuration
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API;
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  // Medical System Prompt
  const MEDICAL_SYSTEM_PROMPT = `You are a doctor. Your role is to:
1. Explain medical conditions in simple and positive words
2. Always reassure the patient 
3. Only answer medical and health-related questions
4. If asked about non-medical topics, politely redirect to medical concerns
5. At the end of EVERY answer, add: "⚠️ This information is not 100% accurate. Please consult your doctor for confirmation."
6. Use encouraging and supportive language
7. Provide practical, safe advice for symptom management
8. Always emphasize when to seek immediate medical attention for serious symptoms`;

  // Initialize welcome messages
  useEffect(() => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: '🩺 Hello! I\'m Dr. AI, your medical assistant. I can help you understand medical conditions and provide guidance on symptoms and treatments.',
        timestamp: new Date()
      },
      {
        id: 2,
        type: 'bot',
        content: '💊 Please describe your symptoms or ask any medical question. I\'m here to help you feel better!',
        timestamp: new Date()
      }
    ]);
  }, []);

  // Initialize position in bottom right and handle window resize
  useEffect(() => {
    const updatePosition = () => {
      setPosition(prev => ({
        x: window.innerWidth - 100,
        y: window.innerHeight - 100
      }));
    };

    // Set initial position
    updatePosition();

    // Update position on window resize
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Calculate dynamic window size based on content
  const calculateWindowSize = () => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const scrollHeight = container.scrollHeight;
    const currentHeight = container.clientHeight;
    
    // Base dimensions
    const minWidth = 320;
    const maxWidth = Math.min(500, window.innerWidth - 40);
    const minHeight = 400;
    const maxHeight = Math.min(600, window.innerHeight - 100);
    
    // Calculate new dimensions based on content
    let newHeight = minHeight;
    if (scrollHeight > currentHeight) {
      // Add extra space for long content
      newHeight = Math.min(maxHeight, minHeight + Math.min(200, (scrollHeight - currentHeight)));
    }
    
    // Calculate width based on longest message
    const messages = container.querySelectorAll('.message-content');
    let maxContentWidth = minWidth;
    messages.forEach(msg => {
      const textLength = msg.textContent.length;
      if (textLength > 100) {
        maxContentWidth = Math.min(maxWidth, minWidth + Math.min(180, (textLength - 100) * 0.8));
      }
    });
    
    setWindowSize({
      width: isExpanded ? maxWidth : maxContentWidth,
      height: isExpanded ? maxHeight : newHeight
    });
  };

  // Recalculate size when messages change
  useEffect(() => {
    if (isOpen) {
      setTimeout(calculateWindowSize, 100);
    }
  }, [messages, isOpen, isExpanded]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        calculateWindowSize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Modified scroll-based position adjustment to keep it at bottom right
  useEffect(() => {
    const handleScroll = () => {
      // Keep the AI agent in bottom right, but allow slight movement based on scroll
      const scrollY = window.scrollY;
      const baseY = window.innerHeight - 100;
      
      // Slight movement upward when scrolling down (optional)
      const scrollOffset = Math.min(scrollY * 0.1, 50);
      
      setPosition(prev => ({ 
        x: window.innerWidth - 100,
        y: Math.max(20, baseY - scrollOffset)
      }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Drag functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const handleMouseMove = (e) => {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 80, e.clientX - offsetX)),
        y: Math.max(0, Math.min(window.innerHeight - 80, e.clientY - offsetY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const toggleChat = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
  };

  // Handle double-click on header to expand/collapse
  const handleHeaderDoubleClick = () => {
    setIsExpanded(!isExpanded);
    setTimeout(calculateWindowSize, 100);
  };

  // Send message to Groq API
  const sendMessageToGroq = async (message) => {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: MEDICAL_SYSTEM_PROMPT },
            { role: 'user', content: message }
          ],
          temperature: 0.3,
          max_tokens: 500,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('Error communicating with Groq:', error);
      return `I apologize, but I'm experiencing technical difficulties right now. For any medical concerns, please consult with a healthcare professional immediately if it's urgent, or contact your doctor for non-urgent questions.

⚠️ This information is not 100% accurate. Please consult your doctor for confirmation.`;
    }
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToGroq(userMessage.content);
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: '❌ I\'m sorry, I\'m having trouble connecting right now. For any medical emergencies, please call emergency services immediately. For other medical questions, please consult your healthcare provider.\n\n⚠️ This information is not 100% accurate. Please consult your doctor for confirmation.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick reply buttons
  const handleQuickReply = async (text) => {
    if (isLoading) return;
    
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToGroq(text);
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible) return null;

  // Calculate position to keep window in viewport (adjust for bottom-right positioning)
  const adjustedPosition = {
    x: Math.min(position.x - windowSize.width + 80, window.innerWidth - windowSize.width - 20),
    y: Math.max(Math.min(position.y - 80, window.innerHeight - windowSize.height - 20), 20)
  };

  return (
    <>
      {/* AI Agent Avatar - Bottom Right Position */}
      <div 
        className="fixed z-50 cursor-pointer transition-all duration-300 hover:scale-110"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: isDragging ? 'scale(1.1)' : 'scale(1)'
        }}
        onMouseDown={handleMouseDown}
        onClick={toggleChat}
      >
        <div className="relative">
          {/* AI Agent Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )}
          </div>
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 w-16 h-16 bg-blue-500 rounded-full animate-ping opacity-20"></div>
          
          {/* Notification Badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">Dr</span>
          </div>
          
          {/* Tooltip - Adjusted for bottom-right position */}
          <div className="absolute -top-12 -left-32 bg-gray-800 text-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Dr. AI - Medical Assistant
            <div className="absolute top-full right-8 transform w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      </div>

      {/* Chat Window - Positioned relative to bottom-right icon */}
      {isOpen && (
        <div 
          className="fixed z-40 bg-white rounded-lg shadow-2xl border flex flex-col transition-all duration-300 ease-in-out"
          style={{
            left: `${adjustedPosition.x}px`,
            top: `${adjustedPosition.y}px`,
            width: `${windowSize.width}px`,
            height: `${windowSize.height}px`
          }}
        >
          {/* Chat Header - Double-click to expand */}
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg flex-shrink-0 cursor-pointer select-none"
            onDoubleClick={handleHeaderDoubleClick}
            title="Double-click to expand/collapse"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  Dr. AI Medical Assistant
                  {isExpanded && (
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      Expanded
                    </span>
                  )}
                </h3>
                <p className="text-xs opacity-80">
                  {isLoading ? 'Thinking...' : 'Online • Double-click to resize'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {/* Expand/Collapse button */}
                <button 
                  onClick={handleHeaderDoubleClick}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                  title="Expand/Collapse window"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isExpanded ? "M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" : "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"} />
                  </svg>
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Chat Messages - Dynamic height and scrollable */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3"
            style={{ minHeight: '200px' }}
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3 rounded-lg message-content ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : message.isError 
                      ? 'bg-red-50 border border-red-200 text-red-700 rounded-bl-none'
                      : 'bg-white shadow-sm border rounded-bl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <div className="text-xs opacity-50 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white shadow-sm border p-3 rounded-lg rounded-bl-none">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <span className="text-xs text-gray-500 ml-2">Dr. AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input - Fixed at bottom */}
          <div className="flex-shrink-0 p-4 border-t bg-white rounded-b-lg">
            <div className="flex flex-col space-y-2 mb-3">
              <div className="flex flex-wrap gap-1">
                <button 
                  onClick={() => handleQuickReply('I have a headache, what should I do?')}
                  disabled={isLoading}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 disabled:opacity-50 transition-colors"
                >
                  Headache relief
                </button>
                <button 
                  onClick={() => handleQuickReply('My back hurts, how can I feel better?')}
                  disabled={isLoading}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 disabled:opacity-50 transition-colors"
                >
                  Back pain
                </button>
                <button 
                  onClick={() => handleQuickReply('I have joint pain, what causes it?')}
                  disabled={isLoading}
                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 disabled:opacity-50 transition-colors"
                >
                  Joint pain
                </button>
                <button 
                  onClick={() => handleQuickReply('I have fever symptoms, please help')}
                  disabled={isLoading}
                  className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs hover:bg-orange-200 disabled:opacity-50 transition-colors"
                >
                  Fever care
                </button>
              </div>
            </div>
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms..." 
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            {/* API Key Warning */}
            {!GROQ_API_KEY && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                ⚠️ Please add your Groq API key to .env file
              </div>
            )}
            
            {/* Window size indicator */}
            <div className="mt-2 text-xs text-gray-500 text-center">
              {windowSize.width}×{windowSize.height} • {isExpanded ? 'Expanded' : 'Auto-sized'}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAgent;