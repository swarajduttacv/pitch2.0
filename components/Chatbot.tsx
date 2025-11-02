import React, { useState, useEffect, useRef } from 'react';
import { createChat, getChatbotResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import type { Chat } from '@google/genai';

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
    context: string;
    title: string;
}

const renderMarkdown = (text: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    const blocks = text.trim().split(/\n\s*\n/);

    blocks.forEach((block, blockIndex) => {
        if (!block.trim()) return;
        const lines = block.split('\n');
        const isList = lines.every(line => line.trim().startsWith('* '));

        if (isList) {
            elements.push(
                <ul key={`ul-${blockIndex}`} className="list-disc list-inside space-y-1 my-2">
                    {lines.map((line, lineIndex) => {
                        const content = line.trim().substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        return <li key={lineIndex} dangerouslySetInnerHTML={{ __html: content }} />;
                    })}
                </ul>
            );
        } else {
            const content = block.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');
            elements.push(
                <p key={`p-${blockIndex}`} className="my-2" dangerouslySetInnerHTML={{ __html: content }} />
            );
        }
    });

    return elements;
};


const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, context, title }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<Chat | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Create a new chat session when the modal opens
            chatRef.current = createChat(context);
        } else {
            // Cleanup on close
            chatRef.current = null;
            setMessages([]);
        }
    }, [isOpen, context]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (messageToSend: string) => {
        if (!messageToSend.trim() || !chatRef.current) return;

        const newMessages: ChatMessage[] = [...messages, { role: 'user', content: messageToSend }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        setSuggestedQuestions([]);

        try {
            const response = await getChatbotResponse(chatRef.current, messageToSend);
            
            const lines = response.split('\n');
            const suggestions = lines
                .filter(line => line.trim().startsWith('* '))
                .map(line => line.trim().substring(2).trim())
                .slice(0, 3);
            const mainContent = lines.filter(line => !line.trim().startsWith('* ')).join('\n');

            setMessages(prev => [...prev, { role: 'model', content: mainContent }]);
            setSuggestedQuestions(suggestions);

        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-up" style={{animationDuration: '0.3s'}} onClick={onClose}>
            <div className="glassmorphism w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M10 2a6 6 0 00-6 6v3.586l-1.293 1.293a1 1 0 001.414 1.414L6 12.586V8a4 4 0 018 0v4.586l2.293 2.293a1 1 0 001.414-1.414L16 11.586V8a6 6 0 00-6-6zM4 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm12 0a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1z" />
                        </svg>
                        <h2 className="text-lg font-bold text-gray-100">Discussing: <span className="text-sky-400">{title}</span></h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md px-4 py-2 rounded-xl break-words overflow-hidden ${msg.role === 'user' ? 'bg-sky-600 text-white' : 'bg-gray-700/80 text-gray-200'}`}>
                                <div className="text-sm leading-relaxed">
                                    {renderMarkdown(msg.content)}
                                </div>
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-md px-4 py-2 rounded-xl bg-gray-700/80 text-gray-200">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                </div>
                             </div>
                        </div>
                     )}
                    <div ref={messagesEndRef} />
                </div>
                
                <footer className="p-4 border-t border-white/10 flex-shrink-0">
                    {suggestedQuestions.length > 0 && !isLoading && (
                        <div className="mb-3 flex flex-wrap gap-2">
                            {suggestedQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(q)}
                                    className="px-3 py-1.5 bg-gray-700/60 text-sky-300 text-xs rounded-full hover:bg-gray-700 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center bg-gray-900/80 rounded-lg">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend(input)}
                            placeholder="Ask a follow-up question..."
                            className="flex-1 bg-transparent p-3 text-gray-200 placeholder-gray-500 focus:outline-none"
                            disabled={isLoading}
                        />
                        <button onClick={() => handleSend(input)} disabled={isLoading || !input.trim()} className="p-3 text-sky-400 hover:text-sky-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Chatbot;