import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, X, Send, Bot, User, Paperclip,
  Phone, Video, MoreHorizontal, Minimize2
} from 'lucide-react';

const LiveChat = ({ isOpen, onToggle, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: '¡Hola! Soy el asistente de AgentHub. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(Date.now() - 2000)
    },
    {
      id: 2,
      type: 'bot',
      message: 'Puedo ayudarte con:\n• Encontrar el agente perfecto\n• Resolver problemas técnicos\n• Información sobre precios\n• Soporte de instalación',
      timestamp: new Date(Date.now() - 1000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta del bot
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('agente') || message.includes('buscar')) {
      return '¡Perfecto! Tenemos más de 5,000 agentes especializados. ¿Qué tipo de agente necesitas? Por ejemplo: desarrollo, marketing, análisis de datos, etc.';
    }
    
    if (message.includes('precio') || message.includes('costo')) {
      return 'Tenemos agentes gratuitos y premium. Los agentes gratuitos no tienen costo, mientras que los premium van desde $19/mes hasta $99/mes dependiendo de sus capacidades.';
    }
    
    if (message.includes('install') || message.includes('instalar')) {
      return 'Instalar un agente es muy fácil:\n1. Busca el agente que necesitas\n2. Haz clic en "Instalar"\n3. Sigue las instrucciones de configuración\n4. ¡Listo para usar!\n\n¿Necesitas ayuda con algún agente específico?';
    }
    
    if (message.includes('problema') || message.includes('error')) {
      return 'Lamento que tengas problemas. Para ayudarte mejor, ¿podrías contarme:\n• ¿Qué agente estás usando?\n• ¿Cuál es el error específico?\n• ¿Cuándo ocurrió?\n\nTambién puedes contactar a nuestro soporte técnico especializado.';
    }
    
    return 'Gracias por tu mensaje. Un especialista de AgentHub se pondrá en contacto contigo pronto. Mientras tanto, puedes explorar nuestro marketplace o consultar nuestra documentación.';
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-96'
      } w-80`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-slate-900" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Soporte AgentHub</h3>
              <p className="text-xs text-emerald-400">En línea</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Minimize2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs ${
                    message.type === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-200'
                  } rounded-2xl px-3 py-2`}>
                    <div className="flex items-center space-x-2 mb-1">
                      {message.type === 'bot' ? (
                        <Bot size={12} className="text-emerald-400" />
                      ) : (
                        <User size={12} className="text-emerald-200" />
                      )}
                      <span className="text-xs opacity-75">
                        {message.type === 'bot' ? 'Asistente' : 'Tú'}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {message.message}
                    </p>
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString().slice(0, 5)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-slate-200 rounded-2xl px-3 py-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Escribe tu mensaje..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <Paperclip size={14} />
                  </button>
                  <span className="text-xs text-slate-500">Adjuntar archivo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <Phone size={14} />
                  </button>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <Video size={14} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveChat;
