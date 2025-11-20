import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Sparkles, TreeDeciduous, ArrowRight, Wind, HeartHandshake, Leaf, CheckCircle2, Lock } from 'lucide-react';
import { AppView, RitualResponse, StageConfig } from './types';
import { generateHealingRitual } from './services/geminiService';
import { Button } from './components/Button';
import { BreathingCircle } from './components/BreathingCircle';

const STAGES: StageConfig[] = [
  { title: "Acknowledgment", subtitle: "I hear you.", key: 'acknowledgment', icon: 'leaf' },
  { title: "Unburdening", subtitle: "It wasn't your fault.", key: 'understanding', icon: 'lock' },
  { title: "The Apology", subtitle: "Receiving what you were owed.", key: 'apology', icon: 'heart' },
  { title: "Soothing", subtitle: "Holding your pain gently.", key: 'soothing', icon: 'wind' },
  { title: "Release", subtitle: "Letting the memory fade.", key: 'closure', icon: 'check' }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.INTRO);
  const [inputText, setInputText] = useState('');
  const [ritualData, setRitualData] = useState<RitualResponse | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [view, currentStageIndex]);

  const handleStart = () => setView(AppView.INPUT);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    
    setView(AppView.PROCESSING);
    setError(null);

    try {
      const response = await generateHealingRitual(inputText);
      setRitualData(response);
      setView(AppView.RITUAL);
      setCurrentStageIndex(0);
    } catch (err) {
      console.error(err);
      setError("The Tree Hollow is quiet right now. Please check your connection and try again.");
      setView(AppView.INPUT);
    }
  };

  const nextStage = () => {
    if (currentStageIndex < STAGES.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
    } else {
      setView(AppView.AFTERCARE);
    }
  };

  const handleRestart = () => {
    setInputText('');
    setRitualData(null);
    setCurrentStageIndex(0);
    setView(AppView.INTRO);
  };

  // Render Helpers
  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-md mx-auto animate-fade-in">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-amber-glow/20 blur-3xl rounded-full"></div>
        <TreeDeciduous size={64} className="text-stone-300 relative z-10" strokeWidth={1} />
      </div>
      <h1 className="text-4xl font-serif text-stone-200 mb-4 tracking-wide">The Hollow</h1>
      <p className="text-stone-400 mb-12 leading-relaxed font-serif text-lg">
        A sanctuary for painful memories. <br/>
        Speak into the tree, let the ritual guide you from pain to peace.
      </p>
      <Button onClick={handleStart}>Enter the Sanctuary</Button>
    </div>
  );

  const renderInput = () => (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto p-6 animate-fade-in">
      <header className="py-6 flex items-center justify-between">
        <TreeDeciduous size={24} className="text-stone-500" />
        <span className="text-xs font-serif text-stone-600 tracking-widest uppercase">Safe Space</span>
      </header>
      
      <main className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl font-serif text-stone-300 mb-6">What is weighing on you today?</h2>
        <p className="text-stone-500 mb-6 text-sm">Describe the flashback, the words, or the image that hurts. No one sees this but you and the Hollow.</p>
        
        <div className="glass-panel rounded-2xl p-1 transition-all focus-within:border-stone-500 focus-within:ring-1 focus-within:ring-stone-500/50">
          <textarea
            className="w-full bg-transparent text-stone-200 p-4 min-h-[200px] resize-none outline-none placeholder-stone-700 font-serif leading-relaxed"
            placeholder="I keep remembering when..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            autoFocus
          />
        </div>
        
        {error && <p className="text-red-400/80 text-sm mt-4 text-center font-serif">{error}</p>}

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit} disabled={inputText.length < 5}>
            Place in Hollow <ArrowRight className="inline ml-2" size={16} />
          </Button>
        </div>
      </main>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-stone-400 animate-spin mb-8 opacity-50"></div>
      <p className="text-stone-400 font-serif italic text-lg animate-pulse-slow">The Guardian is listening...</p>
    </div>
  );

  const renderRitual = () => {
    if (!ritualData) return null;
    const stage = STAGES[currentStageIndex];
    const content = ritualData[stage.key];

    const getIcon = () => {
      switch(stage.key) {
        case 'acknowledgment': return <Leaf size={24} />;
        case 'understanding': return <Lock size={24} />;
        case 'apology': return <HeartHandshake size={24} />;
        case 'soothing': return <Wind size={24} />;
        case 'closure': return <CheckCircle2 size={24} />;
        default: return <Sparkles size={24} />;
      }
    };

    return (
      <div className="flex flex-col min-h-screen max-w-2xl mx-auto p-6 relative">
        {/* Progress Indicator */}
        <div className="absolute top-6 left-0 w-full px-6 flex gap-2">
          {STAGES.map((s, idx) => (
            <div 
              key={s.key} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                idx <= currentStageIndex ? 'bg-stone-400' : 'bg-stone-800'
              }`}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center mt-12 animate-fade-in" key={currentStageIndex}>
          <div className="flex items-center gap-3 text-amber-500/80 mb-4">
            {getIcon()}
            <span className="uppercase tracking-widest text-xs font-bold">{stage.title}</span>
          </div>
          
          <h3 className="text-xl font-serif text-stone-500 mb-8">{stage.subtitle}</h3>
          
          <div className="glass-panel p-8 rounded-3xl shadow-2xl border-t border-white/10">
            <p className="text-xl md:text-2xl font-serif text-stone-200 leading-loose whitespace-pre-wrap">
              {content}
            </p>
          </div>

          <div className="mt-12 flex justify-center">
            <Button onClick={nextStage} variant="secondary">
              {currentStageIndex === STAGES.length - 1 ? "Finish Ritual" : "Continue"}
            </Button>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>
    );
  };

  const renderAftercare = () => {
    if (!ritualData) return null;

    // Construct a safe image URL using picsum and keyword
    // Adding a random number to prevent caching if user restarts
    const bgImage = `https://picsum.photos/seed/${ritualData.safeImageKeyword.replace(/\s/g, '')}/1080/1920`;

    return (
      <div className="relative min-h-screen flex flex-col">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-[2000ms] opacity-0 animate-fade-in"
          style={{ 
            backgroundImage: `url(${bgImage})`,
            opacity: 0.4
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-stone-900/40" />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto">
          
          {view === AppView.AFTERCARE && (
             <div className="w-full">
               <h2 className="text-2xl font-serif text-stone-200 mb-2">Breathe</h2>
               <BreathingCircle onComplete={() => setView(AppView.COMPLETED)} />
             </div>
          )}

          {view === AppView.COMPLETED && (
            <div className="animate-fade-in space-y-8">
               <div className="glass-panel p-6 rounded-2xl border border-amber-500/20">
                 <h3 className="text-lg font-serif text-amber-100 mb-4">New Safe Memory</h3>
                 <p className="text-stone-300 italic">"{ritualData.encouragement}"</p>
               </div>

               <div className="space-y-2">
                  <p className="text-stone-400 text-sm">The hollow has absorbed your pain.</p>
                  <p className="text-stone-400 text-sm">You are safe. You are here.</p>
               </div>

               <Button onClick={handleRestart} className="mt-8">Return to Focus</Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-stone-900 min-h-screen text-stone-200 font-sans selection:bg-amber-500/30">
      {view === AppView.INTRO && renderIntro()}
      {view === AppView.INPUT && renderInput()}
      {view === AppView.PROCESSING && renderProcessing()}
      {view === AppView.RITUAL && renderRitual()}
      {(view === AppView.AFTERCARE || view === AppView.COMPLETED) && renderAftercare()}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
