import React, { useState } from 'react';
import { EvaluationResult as EvaluationResultType } from '../types';
import ScoreCard from './ScoreCard';
import Section from './Section';
import OverallScoreGauge from './OverallScoreGauge';
import BarChart from './BarChart';
import Chatbot from './Chatbot';
import FinancialViabilityGauge from './FinancialViabilityGauge';

interface EvaluationResultProps {
  result: EvaluationResultType;
  isHistoryView?: boolean;
}

const SWOT_ICONS = {
    Strengths: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>,
    Weaknesses: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-4.707l-3-3a1 1 0 011.414-1.414L9 10.586V7a1 1 0 112 0v3.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>,
    Opportunities: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 10.607a1 1 0 011.414 0l.707-.707a1 1 0 11-1.414-1.414l-.707.707zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>,
    Threats: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.001-1.742 3.001H4.42c-1.532 0-2.492-1.667-1.742-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
};

const SWOT_COLORS = {
    Strengths: 'text-emerald-400',
    Weaknesses: 'text-rose-400',
    Opportunities: 'text-sky-400',
    Threats: 'text-amber-400'
};

const SWOTSection: React.FC<{ title: keyof typeof SWOT_COLORS; items: string[]; animationDelay: string; }> = ({ title, items, animationDelay }) => (
  <div className="animate-fade-in-up" style={{ animationDelay }}>
    <h4 className={`font-bold mb-2 flex items-center ${SWOT_COLORS[title]}`}>
        {SWOT_ICONS[title]}
        {title}
    </h4>
    <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm pl-7">
      {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  </div>
);

const SuggestionItem: React.FC<{ item: string }> = ({ item }) => (
  <li className="flex items-start">
    <svg className="w-5 h-5 text-teal-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <span className="text-gray-300">{item}</span>
  </li>
);

const KeyQuestionsSection: React.FC<{questions: string[], onDiscuss: () => void}> = ({ questions, onDiscuss }) => (
    <div className="mt-8 animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <Section 
            title="Key Questions to Address" 
            onClick={onDiscuss}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>}
        >
            <ul className="space-y-3">
                {questions.map((q, i) => (
                    <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        <span>{q}</span>
                    </li>
                ))}
            </ul>
        </Section>
    </div>
);


const EvaluationResult: React.FC<EvaluationResultProps> = ({ result, isHistoryView = false }) => {
  const { scores, swotAnalysis, suggestions, marketAnalysis, competitiveLandscape, keyQuestions } = result;
  const [activeTab, setActiveTab] = useState('summary');
  const [chatbotState, setChatbotState] = useState<{isOpen: boolean, context: string, title: string}>({ isOpen: false, context: '', title: '' });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const tabs = [
    { id: 'summary', label: 'Executive Summary' },
    { id: 'swot', label: 'SWOT Analysis' },
    { id: 'market', label: 'Market & Competition' },
    { id: 'suggestions', label: 'Actionable Suggestions' },
  ];
  
  const overallScore = Math.round((scores.clarity.score + scores.feasibility.score + scores.innovation.score + scores.marketUnderstanding.score + scores.financialViability.score) / 5);

  const openChatbot = (title: string, context: any) => {
    setChatbotState({ isOpen: true, title, context: JSON.stringify(context, null, 2) });
  };

  const renderTabContent = () => {
    switch (activeTab) {
        case 'summary':
            return (
                <div className="space-y-8">
                    <div 
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-fade-in-up"
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                         <div className="flex justify-around items-center h-full">
                           <div 
                             onMouseEnter={() => setHoveredItem('overall-score')}
                             className={`transition-all duration-300 ease-out cursor-pointer ${hoveredItem === 'overall-score' ? 'scale-110' : ''}`} 
                             onClick={() => openChatbot('Overall Score', { overallScore })}
                           >
                               <OverallScoreGauge score={overallScore} />
                           </div>
                           <div 
                             onMouseEnter={() => setHoveredItem('financial-score')}
                             className={`transition-all duration-300 ease-out cursor-pointer ${hoveredItem === 'financial-score' ? 'scale-110' : ''}`} 
                             onClick={() => openChatbot('Financial Viability Score', scores.financialViability)}
                            >
                                <FinancialViabilityGauge score={scores.financialViability.score} />
                            </div>
                        </div>
                        <div 
                          onMouseEnter={() => setHoveredItem('bar-chart')}
                          className={`h-80 transition-all duration-300 ease-out cursor-pointer ${hoveredItem === 'bar-chart' ? 'scale-105 -translate-y-2' : ''}`}
                          onClick={() => openChatbot('Score Breakdown', scores)}
                        >
                            <BarChart scores={scores} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" onMouseLeave={() => setHoveredItem(null)}>
                        {[
                            { id: 'clarity', label: 'Clarity', score: scores.clarity, color: 'text-sky-400', delay: '100ms', cols: '' },
                            { id: 'feasibility', label: 'Feasibility', score: scores.feasibility, color: 'text-emerald-400', delay: '200ms', cols: '' },
                            { id: 'innovation', label: 'Innovation', score: scores.innovation, color: 'text-purple-400', delay: '300ms', cols: '' },
                            { id: 'market', label: 'Market', score: scores.marketUnderstanding, color: 'text-amber-400', delay: '400ms', cols: '' },
                            { id: 'financials', label: 'Financials', score: scores.financialViability, color: 'text-green-400', delay: '500ms', cols: 'sm:col-span-2 lg:col-span-1' },
                        ].map(item => {
                            const isAnotherItemHovered = hoveredItem !== null && hoveredItem !== item.id && ['clarity', 'feasibility', 'innovation', 'market', 'financials'].includes(hoveredItem);
                            return (
                                <div 
                                    key={item.id}
                                    onMouseEnter={() => setHoveredItem(item.id)}
                                    onClick={() => openChatbot(`${item.label} Score`, item.score)}
                                    className={`transition-all duration-300 ease-in-out group cursor-pointer ${isAnotherItemHovered ? 'blur-sm opacity-60 scale-95' : 'scale-100'} ${item.cols}`}
                                >
                                    <ScoreCard label={item.label} score={item.score.score} justification={item.score.justification} color={item.color} animationDelay={item.delay} onClick={() => {}} />
                                </div>
                            );
                        })}
                    </div>

                    {keyQuestions.summary.length > 0 && <KeyQuestionsSection questions={keyQuestions.summary} onDiscuss={() => openChatbot('Key Summary Questions', {keyQuestions: keyQuestions.summary})} />}
                </div>
            );
        case 'swot':
            return (
                <div onMouseLeave={() => setHoveredItem(null)}>
                    <div 
                        onMouseEnter={() => setHoveredItem('swot-section')} 
                        className={`transition-all duration-300 ease-in-out group`}
                    >
                        <Section 
                            title="SWOT Analysis" 
                            onClick={() => openChatbot('SWOT Analysis', { swotAnalysis })}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SWOTSection title="Strengths" items={swotAnalysis.strengths} animationDelay="0s" />
                                <SWOTSection title="Weaknesses" items={swotAnalysis.weaknesses} animationDelay="100ms" />
                                <SWOTSection title="Opportunities" items={swotAnalysis.opportunities} animationDelay="200ms" />
                                <SWOTSection title="Threats" items={swotAnalysis.threats} animationDelay="300ms" />
                            </div>
                        </Section>
                    </div>
                    {keyQuestions.swot.length > 0 && <KeyQuestionsSection questions={keyQuestions.swot} onDiscuss={() => openChatbot('Key SWOT Questions', {keyQuestions: keyQuestions.swot})} />}
                </div>
            );
        case 'market':
             return (
                <div onMouseLeave={() => setHoveredItem(null)}>
                    <div
                        onMouseEnter={() => setHoveredItem('market-section')}
                        className={`transition-all duration-300 ease-in-out group`}
                    >
                        <Section 
                            title="Market & Competitive Analysis" 
                            onClick={() => openChatbot('Market & Competitive Analysis', { marketAnalysis, competitiveLandscape })}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                        >
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-lg mb-2 text-gray-100">Market Analysis</h4>
                                    <div className="text-sm space-y-2 text-gray-300 pl-4 border-l-2 border-white/20">
                                    <p><strong>Target Audience:</strong> {marketAnalysis.targetAudience}</p>
                                    <p><strong>Market Size:</strong> {marketAnalysis.marketSize}</p>
                                    <p><strong>Growth Potential:</strong> {marketAnalysis.growthPotential}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2 text-gray-100">Competitive Landscape</h4>
                                    <div className="text-sm space-y-3 text-gray-300 pl-4 border-l-2 border-white/20">
                                    <p><strong>Competitive Advantage:</strong> {competitiveLandscape.competitiveAdvantage}</p>
                                    <div>
                                            <h5 className="font-semibold">Key Competitors:</h5>
                                            <ul className="list-disc list-inside mt-1">
                                                {competitiveLandscape.keyCompetitors.map((item, index) => <li key={index}>{item}</li>)}
                                            </ul>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </Section>
                    </div>
                    {keyQuestions.market.length > 0 && <KeyQuestionsSection questions={keyQuestions.market} onDiscuss={() => openChatbot('Key Market Questions', {keyQuestions: keyQuestions.market})} />}
                </div>
            );
        case 'suggestions':
            return (
                <div onMouseLeave={() => setHoveredItem(null)}>
                    <div
                        onMouseEnter={() => setHoveredItem('suggestions-section')}
                        className={`transition-all duration-300 ease-in-out group`}
                    >
                        <Section 
                            title="Actionable Suggestions" 
                            onClick={() => openChatbot('Actionable Suggestions', { suggestions })}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>}
                        >
                            <div className="space-y-6">
                                <div>
                                <h4 className="font-semibold text-lg mb-2 text-gray-100">Tone & Language</h4>
                                <ul className="space-y-2">
                                    {suggestions.tone.map((item, index) => <SuggestionItem key={index} item={item}/>)}
                                </ul>
                                </div>
                                <div>
                                <h4 className="font-semibold text-lg mb-2 text-gray-100">Flow & Narrative</h4>
                                <ul className="space-y-2">
                                    {suggestions.flow.map((item, index) => <SuggestionItem key={index} item={item}/>)}
                                </ul>
                                </div>
                                <div>
                                <h4 className="font-semibold text-lg mb-2 text-gray-100">Visuals & Data</h4>
                                <ul className="space-y-2">
                                    {suggestions.visuals.map((item, index) => <SuggestionItem key={index} item={item}/>)}
                                </ul>
                                </div>
                            </div>
                        </Section>
                    </div>
                    {keyQuestions.suggestions.length > 0 && <KeyQuestionsSection questions={keyQuestions.suggestions} onDiscuss={() => openChatbot('Key Suggestion Questions', {keyQuestions: keyQuestions.suggestions})} />}
                </div>
            );
        default:
            return null;
    }
  };

  return (
    <div className="space-y-10 mt-8">
       {isHistoryView && (
          <div className="glassmorphism p-3 rounded-lg text-center bg-sky-900/50 border-sky-700 animate-fade-in-up">
              <p className="text-sky-300 font-medium">Viewing a pitch from your history.</p>
          </div>
       )}
       <div className="glassmorphism p-1 rounded-2xl shadow-lg animate-fade-in-up" style={{ animationDelay: '100ms'}}>
         <div className="border-b border-white/10 px-4">
           <nav className="-mb-px flex space-x-6" aria-label="Tabs">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`${
                   activeTab === tab.id
                     ? 'border-sky-500 text-sky-400'
                     : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                 } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none`}
               >
                 {tab.label}
               </button>
             ))}
           </nav>
         </div>
         
         <div className="p-6 md:p-8">
            <div className="animate-fade-in-up">
                {renderTabContent()}
            </div>
         </div>
      </div>

      {chatbotState.isOpen && (
        <Chatbot
            isOpen={chatbotState.isOpen}
            onClose={() => setChatbotState({ isOpen: false, context: '', title: '' })}
            context={chatbotState.context}
            title={chatbotState.title}
        />
      )}
    </div>
  );
};

export default EvaluationResult;