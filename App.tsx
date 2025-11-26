
import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Sparkles, Trees, ArrowRight, Wind, HandHeart, Feather, CheckCircle2, Lock } from 'lucide-react';
import { AppView, RitualResponse, StageConfig } from './types';
import { generateHealingRitual } from './services/geminiService';
import { Button } from './components/Button';
import { BreathingCircle } from './components/BreathingCircle';

// 5 Stages Configuration
const STAGES: StageConfig[] = [
  { 
    title: "看见", 
    subtitle: "我听见你了。", 
    key: 'acknowledgment', 
    themeClass: "border-moss-700 bg-moss-900/40" // Dark, receptive
  },
  { 
    title: "理解", 
    subtitle: "这不是你的错。", 
    key: 'understanding', 
    themeClass: "border-amber-900/30 bg-amber-900/10" // Warm understanding
  },
  { 
    title: "回响", 
    subtitle: "迟来的歉意。", 
    key: 'apology', 
    themeClass: "border-white/10 bg-white/5 italic font-light" // Paper-like, letter style
  },
  { 
    title: "安抚", 
    subtitle: "拥抱此刻的情绪。", 
    key: 'soothing', 
    themeClass: "border-amber-glow/20 bg-amber-glow/5 shadow-[inset_0_0_40px_rgba(255,202,40,0.05)]" // Glowing warmth
  },
  { 
    title: "新生", 
    subtitle: "让记忆安息。", 
    key: 'closure', 
    themeClass: "border-mist-200/10 bg-gradient-to-b from-transparent to-moss-800/50" // Fading out
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.INTRO);
  const [inputText, setInputText] = useState('');
  const [ritualData, setRitualData] = useState<RitualResponse | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Particle effect simulation
  useEffect(() => {
    const createParticles = () => {
      const container = document.getElementById('particles');
      if (!container) return;
      container.innerHTML = '';
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = Math.random() * 100 + 'vh';
        p.style.opacity = (Math.random() * 0.5).toString();
        p.style.animation = `float ${5 + Math.random() * 10}s ease-in-out infinite`;
        p.style.animationDelay = `-${Math.random() * 5}s`;
        container.appendChild(p);
      }
    };
    createParticles();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [view, currentStageIndex]);

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
      setError("树洞此刻有些安静，请检查网络连接后再试一次。");
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

  // --- Render Functions ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-md mx-auto animate-fade-in relative z-10">
      <div className="mb-10 relative">
        {/* Glowing Tree Hollow Concept */}
        <div className="absolute inset-0 bg-amber-glow/10 blur-[60px] rounded-full animate-pulse-slow"></div>
        <div className="relative z-10 w-24 h-24 rounded-full border border-moss-600/30 flex items-center justify-center bg-gradient-to-b from-moss-800 to-moss-950 shadow-2xl">
           <Trees size={40} className="text-mist-200/60" strokeWidth={1} />
        </div>
      </div>
      
      <h1 className="text-4xl font-serif text-mist-100 mb-2 tracking-[0.2em]">树洞</h1>
      <h2 className="text-sm font-sans text-moss-600 uppercase tracking-widest mb-8">The Hollow</h2>
      
      <p className="text-mist-200/60 mb-12 leading-loose font-serif text-lg">
        这里是存放痛苦的静谧之地。<br/>
        所有的闪回、纠结、无法言说，<br/>
        都可以在此安放，直至平静。
      </p>
      
      <Button onClick={() => setView(AppView.INPUT)}>进入树洞</Button>
    </div>
  );

  const renderInput = () => (
    <div className="flex flex-col min-h-screen max-w-xl mx-auto p-6 animate-fade-in relative z-10">
      <header className="py-6 flex items-center justify-between opacity-60">
        <div className="flex items-center gap-2">
            <Trees size={18} />
            <span className="text-xs font-serif tracking-widest">安全空间</span>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl font-serif text-mist-100 mb-4">有什么情绪困住了你？</h2>
        <p className="text-mist-200/50 mb-8 text-sm leading-relaxed">
          无论是过去的一句话、一个画面，还是当下的委屈。<br/>
          只有你和树洞知道。
        </p>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-moss-800 to-bark-800 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="glass-hollow rounded-2xl p-1 relative">
            <textarea
              className="w-full bg-transparent text-mist-100 p-6 min-h-[240px] resize-none outline-none placeholder-moss-700 font-serif leading-loose text-lg"
              placeholder="那一刻，我感到..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        
        {error && <p className="text-red-300/60 text-sm mt-4 text-center font-serif">{error}</p>}

        <div className="mt-10 flex justify-end">
          <Button onClick={handleSubmit} disabled={inputText.length < 3}>
            放入树洞 <ArrowRight className="inline ml-2 opacity-60" size={16} />
          </Button>
        </div>
      </main>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fade-in relative z-10">
      <div className="relative mb-8">
         <div className="absolute inset-0 bg-amber-glow/20 blur-3xl animate-pulse-slow"></div>
         <Wind className="text-mist-200/30 animate-float" size={48} strokeWidth={1}/>
      </div>
      <p className="text-mist-200/60 font-serif tracking-widest text-lg">树洞正在倾听...</p>
    </div>
  );

  const renderRitual = () => {
    if (!ritualData) return null;
    const stage = STAGES[currentStageIndex];
    const content = ritualData[stage.key];

    return (
      <div className="flex flex-col min-h-screen max-w-xl mx-auto p-6 relative z-10">
        {/* Step Indicator */}
        <div className="fixed top-0 left-0 w-full h-1 flex z-50">
          {STAGES.map((s, idx) => (
            <div 
              key={s.key} 
              className={`flex-1 transition-all duration-700 ${
                idx <= currentStageIndex ? 'bg-amber-glow/40 shadow-[0_0_10px_rgba(255,202,40,0.5)]' : 'bg-moss-900'
              }`}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center mt-8 animate-fade-in" key={currentStageIndex}>
          <div className="text-center mb-8">
            <span className="text-amber-dim/80 text-xs font-sans tracking-[0.3em] uppercase mb-2 block">{stage.title}</span>
            <h3 className="text-xl font-serif text-mist-200/80 italic">{stage.subtitle}</h3>
          </div>
          
          {/* The Dynamic Card */}
          <div className={`glass-paper relative rounded-sm p-8 md:p-10 shadow-2xl border transition-all duration-500 ${stage.themeClass}`}>
            {/* Specific Icon for Stage */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-moss-950 p-3 rounded-full border border-white/10">
               {stage.key === 'acknowledgment' && <Feather size={20} className="text-moss-400" />}
               {stage.key === 'understanding' && <Lock size={20} className="text-amber-700" />}
               {stage.key === 'apology' && <HandHeart size={20} className="text-mist-200" />}
               {stage.key === 'soothing' && <Wind size={20} className="text-amber-glow" />}
               {stage.key === 'closure' && <CheckCircle2 size={20} className="text-moss-500" />}
            </div>

            <div className="mt-4 relative">
                {/* Decorational quotes for apology stage */}
                {stage.key === 'apology' && <span className="absolute -top-2 -left-2 text-6xl text-white/5 font-serif">“</span>}
                
                <p className="text-lg md:text-xl font-serif text-mist-100 leading-loose whitespace-pre-wrap text-justify">
                {content}
                </p>

                {stage.key === 'apology' && <span className="absolute -bottom-8 -right-2 text-6xl text-white/5 font-serif leading-none">”</span>}
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <Button onClick={nextStage} variant={currentStageIndex === STAGES.length - 1 ? 'primary' : 'secondary'}>
              {currentStageIndex === STAGES.length - 1 ? "完成闭环" : "下一步"}
            </Button>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>
    );
  };

  const renderAftercare = () => {
    if (!ritualData) return null;

    // Generate background image
    const bgImage = `https://picsum.photos/seed/${ritualData.safeImageKeyword.replace(/\s/g, '')}/1080/1920`;

    return (
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background Transition */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-[3000ms] ease-in opacity-0 animate-fade-in"
          style={{ 
            backgroundImage: `url(${bgImage})`,
            opacity: 0.3,
            filter: 'grayscale(20%) blur(2px)'
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-moss-950 via-moss-950/90 to-moss-950/50" />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto w-full">
          
          {view === AppView.AFTERCARE && (
             <div className="w-full animate-fade-in">
               <h2 className="text-3xl font-serif text-mist-100 mb-2">平复</h2>
               <BreathingCircle onComplete={() => setView(AppView.COMPLETED)} />
             </div>
          )}

          {view === AppView.COMPLETED && (
            <div className="animate-fade-in space-y-10 w-full">
               <div className="glass-hollow p-8 rounded-2xl border-t border-amber-glow/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                 <div className="flex justify-center mb-4 text-amber-glow/80">
                    <Sparkles size={24} />
                 </div>
                 <h3 className="text-lg font-serif text-amber-100/80 mb-6 tracking-widest">新的安全记忆</h3>
                 <p className="text-mist-100 text-xl leading-relaxed font-serif">"{ritualData.encouragement}"</p>
               </div>

               <div className="space-y-3 opacity-70">
                  <p className="text-mist-200 text-sm tracking-widest">树洞已封存这段记忆</p>
                  <p className="text-mist-200 text-sm tracking-widest">你是安全的</p>
               </div>

               <Button onClick={handleRestart} variant="ghost" className="mt-8 text-sm">
                 回到专注状态
               </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="forest-bg min-h-screen text-mist-100 font-sans selection:bg-amber-900/50 relative">
      {/* Global Particles */}
      <div id="particles" className="absolute inset-0 z-0 overflow-hidden"></div>
      
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
