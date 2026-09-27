import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getSupportResponse } from '../services/conciergeService';

export default function MarketSupportDesk() {
  const navigate = useNavigate();
  const { role, switchRole, currentUser } = useAuth();
  const { setIsDrawerOpen } = useCart();
  const { t, isRTL } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'support',
      text: `Hello ${currentUser ? currentUser.name.split(' ')[0] : 'there'}! Welcome to **MarketLink Community Support**.\n\nWe can assist you with **market locations & operating hours**, checking **available fresh harvest**, or guiding you through our **pre-order and stall cash pickup** process.`,
      actions: [
        { label: 'Find Open Markets', path: '/markets', icon: 'fa-map-marked-alt' },
        { label: 'Browse Produce', path: '/products', icon: 'fa-carrot' }
      ],
      suggestions: [
        'What markets are open this Saturday?',
        'How does cash payment work?',
        'Show produce under $5'
      ],
      timestamp: 'Just now'
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (customText) => {
    const text = (customText || inputValue).trim();
    if (!text || isTyping) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: currentTime
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Response latency
    setTimeout(() => {
      const response = getSupportResponse(text, { role, currentUser });

      const supportMsg = {
        id: `supp-${Date.now()}`,
        sender: 'support',
        text: response.text,
        actions: response.actions || [],
        suggestions: response.suggestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, supportMsg]);
      setIsTyping(false);
    }, 350);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAction = (action) => {
    if (action.path) {
      navigate(action.path);
      setIsOpen(false);
    } else if (action.roleSwitch) {
      switchRole(action.roleSwitch);
      if (action.roleSwitch === 'farmer') navigate('/farmer');
      if (action.roleSwitch === 'admin') navigate('/admin');
      if (action.roleSwitch === 'customer') navigate('/customer');
      setIsOpen(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'support',
        text: `Conversation restarted. How can we assist with your harvest pre-orders or stall pickups today?`,
        actions: [
          { label: 'Find Open Markets', path: '/markets', icon: 'fa-map-marked-alt' },
          { label: 'Browse Produce', path: '/products', icon: 'fa-carrot' }
        ],
        suggestions: [
          'What markets are open this Saturday?',
          'How does cash payment work?'
        ],
        timestamp: 'Just now'
      }
    ]);
  };

  const quickTopics = [
    { label: 'Market Timings', query: 'What are the market operating days and hours?' },
    { label: 'Cash on Pickup', query: 'How does cash on stall pickup work?' },
    { label: 'Budget Harvest', query: 'Show fresh produce under $5' },
    { label: 'Customer Portal', query: 'How do I track my active pre-orders?' }
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div 
        className="position-fixed" 
        style={{ 
          bottom: '24px', 
          right: isRTL ? 'auto' : '24px', 
          left: isRTL ? '24px' : 'auto', 
          zIndex: 1050 
        }}
      >
        {!isOpen && (
          <button
            type="button"
            className="btn btn-primary rounded-pill shadow-lg d-flex align-items-center gap-2 px-3 py-2 border-0"
            style={{ 
              height: '52px', 
              boxShadow: '0 8px 24px rgba(25, 135, 84, 0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onClick={() => setIsOpen(true)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            title="MarketLink Support Desk"
            aria-label="Open MarketLink Support Desk"
          >
            <div 
              className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
            >
              <i className="fa fa-headset fs-6"></i>
            </div>
            <div className={`pe-1 d-none d-sm-block ${isRTL ? 'text-end' : 'text-start'}`}>
              <span className="fw-bold d-block text-white" style={{ fontSize: '0.85rem', lineHeight: '1.1' }}>
                {isRTL ? 'سپورٹ ڈیسک' : 'Support Desk'}
              </span>
              <small className="text-white-50" style={{ fontSize: '0.7rem' }}>
                {isRTL ? 'آن لائن رہنمائی' : 'Live Help & Guidance'}
              </small>
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div 
          className="position-fixed bg-white rounded-4 shadow-lg border d-flex flex-column"
          style={{
            bottom: '24px',
            right: isRTL ? 'auto' : '24px',
            left: isRTL ? '24px' : 'auto',
            width: '400px',
            maxWidth: '92vw',
            height: '580px',
            maxHeight: '82vh',
            zIndex: 1050,
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.16)'
          }}
        >
          {/* Header */}
          <div className="bg-primary text-white px-3 py-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div 
                className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center shadow-sm position-relative" 
                style={{ width: '38px', height: '38px' }}
              >
                <i className="fa fa-headset fs-5"></i>
                <span 
                  className="position-absolute bottom-0 end-0 rounded-circle bg-success border border-white"
                  style={{ width: '10px', height: '10px' }}
                ></span>
              </div>
              <div>
                <h6 className="mb-0 fw-bold text-white" style={{ fontSize: '0.95rem' }}>
                  {isRTL ? 'مارکیٹ لنک سپورٹ ڈیسک' : 'MarketLink Support Desk'}
                </h6>
                <small className="text-white-50" style={{ fontSize: '0.72rem' }}>
                  {isRTL ? 'آن لائن • فوری رہنمائی' : 'Online • Instant Stall Guide'}
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-1">
              <button
                type="button"
                className="btn btn-sm btn-link text-white text-opacity-75 p-1"
                onClick={handleResetChat}
                title="Restart conversation"
              >
                <i className="fa fa-redo-alt" style={{ fontSize: '0.85rem' }}></i>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-link text-white text-opacity-75 p-1"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                <i className="fa fa-times fs-5"></i>
              </button>
            </div>
          </div>

          {/* Quick Topic Chips */}
          <div className="px-3 py-2 bg-light border-bottom overflow-auto text-nowrap d-flex gap-1" style={{ scrollbarWidth: 'none' }}>
            {quickTopics.map((topic, i) => (
              <button
                key={i}
                type="button"
                className="btn btn-sm btn-white bg-white border rounded-pill px-2 py-1 text-secondary d-flex align-items-center gap-1"
                style={{ fontSize: '0.72rem' }}
                onClick={() => handleSendMessage(topic.query)}
              >
                <i className="fa fa-lightbulb text-warning" style={{ fontSize: '0.65rem' }}></i>
                {topic.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div 
            className="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-3"
            style={{ backgroundColor: '#f9fbf9' }}
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`d-flex flex-column ${msg.sender === 'user' ? 'align-items-end' : 'align-items-start'}`}
              >
                <div 
                  className={`p-3 rounded-4 shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-bottom-end-0' 
                      : 'bg-white text-dark border rounded-bottom-start-0'
                  }`}
                  style={{ 
                    maxWidth: '85%', 
                    fontSize: '0.875rem',
                    lineHeight: '1.45',
                    wordBreak: 'break-word'
                  }}
                >
                  <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>

                  {/* Action Navigation Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mt-2 pt-2 border-top border-light">
                      {msg.actions.map((act, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="btn btn-sm btn-outline-primary bg-light rounded-pill px-2 py-1 text-dark"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => handleAction(act)}
                        >
                          <i className={`fa ${act.icon} me-1 text-primary`}></i>
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Follow-up Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mt-2 ps-1">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        className="btn btn-sm btn-light border rounded-pill px-2 py-1 text-muted"
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => handleSendMessage(sug)}
                      >
                        <i className="fa fa-arrow-right me-1 text-primary" style={{ fontSize: '0.65rem' }}></i>
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                <small className="text-muted mt-1 px-1" style={{ fontSize: '0.65rem' }}>
                  {msg.timestamp}
                </small>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="d-flex align-items-center gap-1 bg-white p-2 rounded-3 border align-self-start shadow-sm" style={{ width: '60px' }}>
                <span className="spinner-grow spinner-grow-sm text-primary" style={{ width: '6px', height: '6px' }}></span>
                <span className="spinner-grow spinner-grow-sm text-primary" style={{ width: '6px', height: '6px', animationDelay: '0.2s' }}></span>
                <span className="spinner-grow spinner-grow-sm text-primary" style={{ width: '6px', height: '6px', animationDelay: '0.4s' }}></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-2 border-top bg-white">
            <div className="input-group">
              <input 
                ref={inputRef}
                type="text" 
                className="form-control border-end-0 rounded-start-pill ps-3" 
                placeholder={isRTL ? 'منڈی، اوقات یا فصل کے بارے میں پوچھیں...' : 'Ask about markets, produce, or pickup...'}
                style={{ fontSize: '0.85rem' }}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isTyping}
              />
              <button 
                className="btn btn-primary rounded-end-pill px-3" 
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
              >
                <i className="fa fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
