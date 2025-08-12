import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, User } from 'lucide-react';
import { Suspect, InterrogationEntry } from '../types/game';

interface InterrogationModalProps {
  suspect: Suspect;
  onClose: () => void;
  onAskQuestion: (question: string) => Promise<string>;
  interrogationLog: InterrogationEntry[];
}

export const InterrogationModal: React.FC<InterrogationModalProps> = ({
  suspect,
  onClose,
  onAskQuestion,
  interrogationLog
}) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLog, setCurrentLog] = useState<InterrogationEntry[]>([]);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MAX_QUESTIONS = 5;

  useEffect(() => {
    // Filter log for current suspect
    const suspectLog = interrogationLog.filter(entry => entry.suspect === suspect.name);
    setCurrentLog(suspectLog);
    setQuestionsAsked(suspectLog.length);
  }, [interrogationLog, suspect.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentLog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading || questionsAsked >= MAX_QUESTIONS) return;

    const currentQuestion = question.trim();
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await onAskQuestion(currentQuestion);
      
      const newEntry: InterrogationEntry = {
        suspect: suspect.name,
        question: currentQuestion,
        response,
        timestamp: new Date().toISOString()
      };
      
      setCurrentLog(prev => [...prev, newEntry]);
      setQuestionsAsked(prev => prev + 1);
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const remainingQuestions = MAX_QUESTIONS - questionsAsked;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center space-x-4">
            <img 
              src={suspect.avatar} 
              alt={suspect.displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Interrogating {suspect.displayName}</h2>
              <p className="text-sm text-gray-600">{suspect.occupation} • {suspect.relationship}</p>
              <p className="text-xs text-blue-600 font-medium">
                {remainingQuestions > 0 ? `${remainingQuestions} questions remaining` : 'Interview complete'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentLog.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Start your interrogation by asking a question</p>
              <p className="text-sm text-blue-600 mt-2">You have {MAX_QUESTIONS} questions for this interview</p>
            </div>
          )}
          
          {currentLog.map((entry, index) => (
            <div key={index} className="space-y-3">
              {/* Question */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-xs opacity-75">You</span>
                    <span className="text-xs opacity-75">Q{index + 1}</span>
                  </div>
                  <p>{entry.question}</p>
                </div>
              </div>
              
              {/* Response */}
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <img 
                      src={suspect.avatar} 
                      alt={suspect.displayName}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span className="text-xs text-gray-600">{suspect.displayName}</span>
                  </div>
                  <p className="text-gray-800">{entry.response}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-6 border-t bg-gray-50">
          {questionsAsked >= MAX_QUESTIONS ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-2">You have used all {MAX_QUESTIONS} questions for this suspect.</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                End Interview
              </button>
            </div>
          ) : (
            <>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask your question..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!question.trim() || isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Ask</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Question {questionsAsked + 1} of {MAX_QUESTIONS} • Press Enter to send your question
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};