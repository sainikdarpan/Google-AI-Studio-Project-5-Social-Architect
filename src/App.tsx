import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  RefreshCcw, 
  Calendar, 
  Send,
  Zap,
  ChevronRight,
  Hash,
  LayoutGrid,
  Type as FontIcon,
  Copy,
  Check,
  Share2,
  Twitter,
  Linkedin,
  Download,
  Sparkles,
  ArrowRight,
  Trash,
  Film
} from 'lucide-react';
import { generateCampaign, transformCaption, generatePostImage, generateBaseContent, getInspirationFeed } from './services/socialService';
import { CampaignIdea, AppView } from './types';

const PLATFORMS = ['Instagram', 'LinkedIn', 'X (Twitter)', 'TikTok'];

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('campaigns');
  const [scheduledPosts, setScheduledPosts] = useState<CampaignIdea[]>([]);

  const handleSchedule = (post: CampaignIdea) => {
    setScheduledPosts(prev => {
      // Avoid duplicates or update existing
      const exists = prev.find(p => p.theme === post.theme && p.scheduledDate === post.scheduledDate);
      if (exists) return prev;
      return [...prev, post];
    });
  };

  const handleUnschedule = (post: CampaignIdea) => {
    setScheduledPosts(prev => prev.filter(p => p !== post));
  };
  
  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-[400px_1fr] bg-void">
      {/* Sidebar */}
      <nav className="border-b md:border-b-0 md:border-r border-border p-10 flex flex-col justify-between bg-void z-10 overflow-y-auto md:h-screen">
        <div>
          <div className="micro-label mb-8">Social Architect v1.0</div>
          <div className="flex flex-col mb-16">
            <h1 className="text-[90px] leading-[0.8] mb-2 text-white">CAMP<br/><span className="text-brand">AIGN</span></h1>
            <p className="text-[14px] text-white/40 tracking-[0.2em]">Crafting <span className="text-accent italic font-serif">global</span> narratives.</p>
          </div>

          <div className="flex flex-col gap-4">
            <NavButton 
              active={activeView === 'campaigns'} 
              onClick={() => setActiveView('campaigns')}
              label="01 / Strategy"
            />
            <NavButton 
              active={activeView === 'studio'} 
              onClick={() => setActiveView('studio')}
              label="02 / Visuals"
            />
            <NavButton 
              active={activeView === 'transformer'} 
              onClick={() => setActiveView('transformer')}
              label="03 / Channels"
            />
            <NavButton 
              active={activeView === 'calendar'} 
              onClick={() => setActiveView('calendar')}
              label="04 / Calendar"
            />
          </div>
        </div>

        <div className="mt-12 md:mt-0">
          <div className="micro-label">Standalone Core System</div>
          <div className="micro-label">No Database Required</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="bg-paper p-6 md:p-16 h-screen overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeView === 'campaigns' && <CampaignView key="campaigns" onSchedule={handleSchedule} />}
          {activeView === 'studio' && <StudioView key="studio" />}
          {activeView === 'transformer' && <TransformerView key="transformer" />}
          {activeView === 'calendar' && <CalendarView key="calendar" posts={scheduledPosts} onUnschedule={handleUnschedule} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`text-left py-2 font-black text-lg tracking-tighter uppercase transition-colors ${
        active 
          ? 'text-brand' 
          : 'text-white/30 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

// --- Views ---

const CAMPAIGN_TEMPLATES = [
  { name: '⚡️ Flash Sale', event: '48H Flash Sale', brand: 'Core Retail', persona: 'Bargain Hunters' },
  { name: '✨ Luxury Launch', event: 'Exclusive Gala', brand: 'Aurelia', persona: 'HNW Individuals' },
  { name: '🌿 Eco Drive', event: 'Earth Day 2026', brand: 'Terra', persona: 'Sustainability Advocates' },
  { name: '🚀 Product Drop', event: 'Winter Collection', brand: 'Nexus', persona: 'Early Adopters' },
];

function CampaignView({ onSchedule }: { onSchedule: (post: CampaignIdea) => void, key?: string }) {
  const [loading, setLoading] = useState(false);
  const [holiday, setHoliday] = useState('');
  const [brand, setBrand] = useState('');
  const [audience, setAudience] = useState('');
  const [ideas, setIdeas] = useState<CampaignIdea[]>([]);
  const [scheduledIndices, setScheduledIndices] = useState<Set<number>>(new Set());

  const applyTemplate = (t: typeof CAMPAIGN_TEMPLATES[0]) => {
    setHoliday(t.event);
    setBrand(t.brand);
    setAudience(t.persona);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await generateCampaign(holiday, brand, audience);
      setIdeas(results);
      setScheduledIndices(new Set());
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scheduleItem = (idx: number) => {
    const idea = ideas[idx];
    if (!idea.scheduledDate) {
      alert('Please select a date first');
      return;
    }
    onSchedule(idea);
    setScheduledIndices(prev => new Set([...prev, idx]));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl"
    >
      <header className="mb-16">
        <div className="micro-label mb-4">Strategic Framework</div>
        <h2 className="text-7xl font-black mb-6">HOLIDAY<br/><span className="text-brand">ENGINE</span></h2>
        <p className="text-[#888] text-lg max-w-lg normal-case">Analyze trends and synthesize a cohesive creative direction for seasonal events.</p>
      </header>

      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-4">
          <label className="micro-label">Quick Start Templates</label>
          <div className="flex flex-wrap gap-2">
            {CAMPAIGN_TEMPLATES.map(t => (
              <button 
                key={t.name}
                type="button"
                onClick={() => applyTemplate(t)}
                className="px-4 py-2 border border-border text-[10px] font-bold tracking-widest uppercase hover:border-brand hover:text-brand transition-colors"
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-16 border-b border-border">
          <InputGroup label="Event Context" value={holiday} onChange={setHoliday} placeholder="e.g. Summer Solstice" />
          <InputGroup label="Brand ID" value={brand} onChange={setBrand} placeholder="e.g. Zenith" />
          <div className="md:col-span-2">
            <InputGroup label="User Persona" value={audience} onChange={setAudience} placeholder="e.g. Eco-conscious Gen Z" />
          </div>
          <button 
            type="submit" 
            disabled={loading || !holiday}
            className="accent-button flex items-center gap-4"
          >
            {loading ? <RefreshCcw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            SYNTHESIZE CONTENT
          </button>
        </form>

        <div className="flex flex-col gap-8 pb-16">
          {ideas.length === 0 && !loading && (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border text-white/10 uppercase tracking-widest text-xs">
              <Calendar size={48} className="mb-4 opacity-5" />
              <p>Awaiting Strategy Input</p>
            </div>
          )}

          {ideas.length > 0 && (
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  const csv = [
                    ['Theme', 'Hook', 'Caption', 'Visual Prompt', 'Scheduled Date'],
                    ...ideas.map(i => [i.theme, i.hook, i.caption, i.visualPrompt, i.scheduledDate || 'Not Scheduled'])
                  ].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
                  navigator.clipboard.writeText(csv);
                  alert('CSV data copied to clipboard!');
                }}
                className="text-[10px] text-brand font-bold tracking-widest uppercase hover:underline flex items-center gap-2"
              >
                <Copy size={12} /> Copy CSV for Spreadsheet
              </button>
            </div>
          )}

          {ideas.map((idea, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bold-card"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black tracking-tighter">{idea.theme}</h3>
                <span className="font-serif italic text-brand text-xl">0{idx + 1}</span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="micro-label">Set Launch Date</label>
                  <input 
                    type="date"
                    className="bg-void border border-border p-2 text-xs text-brand focus:outline-none"
                    value={idea.scheduledDate || ''}
                    onChange={(e) => {
                      const newIdeas = [...ideas];
                      newIdeas[idx] = { ...newIdeas[idx], scheduledDate: e.target.value };
                      setIdeas(newIdeas);
                    }}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label className="micro-label">Channel Selection</label>
                  <select 
                    className="bg-void border border-border p-2 text-xs text-brand focus:outline-none appearance-none"
                    value={idea.platform || ''}
                    onChange={(e) => {
                      const newIdeas = [...ideas];
                      newIdeas[idx] = { ...newIdeas[idx], platform: e.target.value };
                      setIdeas(newIdeas);
                    }}
                  >
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <button 
                  onClick={() => scheduleItem(idx)}
                  disabled={scheduledIndices.has(idx)}
                  className={`mt-auto px-6 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                    scheduledIndices.has(idx) 
                      ? 'bg-green-500/20 text-green-500 border border-green-500/20' 
                      : 'bg-brand text-white border border-brand hover:bg-white hover:text-brand'
                  }`}
                >
                  {scheduledIndices.has(idx) ? 'Scheduled ✅' : 'Commit to Calendar'}
                </button>
              </div>

              <p className="font-serif italic text-white/50 text-xl mb-6 normal-case">{idea.hook}</p>
              <div className="text-[#888] leading-relaxed mb-8 normal-case text-[15px]">
                {idea.caption}
              </div>
              <div className="pt-6 border-t border-border mt-auto">
                <div className="micro-label mb-2">Visual Core</div>
                <p className="text-xs text-white/40 normal-case italic font-serif tracking-wide">{idea.visualPrompt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CalendarView({ posts, onUnschedule }: { posts: CampaignIdea[], onUnschedule: (post: CampaignIdea) => void, key?: string }) {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filterPlatform, setFilterPlatform] = useState<string>('All');
  const [filterTheme, setFilterTheme] = useState<string>('All');
  
  const sortedPosts = [...posts].sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''));

  const filteredPosts = sortedPosts.filter(post => {
    const matchesPlatform = filterPlatform === 'All' || post.platform === filterPlatform;
    const matchesTheme = filterTheme === 'All' || post.theme === filterTheme;
    return matchesPlatform && matchesTheme;
  });

  const platforms = Array.from(new Set(posts.map(p => p.platform).filter(Boolean))) as string[];
  const themes = Array.from(new Set(posts.map(p => p.theme))) as string[];

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleExport = () => {
    if (posts.length === 0) return;
    
    const headers = ['Date', 'Theme', 'Hook', 'Caption', 'Visual Prompt', 'Platform'];
    const rows = filteredPosts.map(post => [
      post.scheduledDate,
      post.theme,
      post.hook,
      post.caption,
      post.visualPrompt,
      post.platform
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `social_architect_plan_${currentMonth.getMonth() + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calendarDays = [];
  const totalDays = daysInMonth(currentMonth);
  const startOffset = firstDayOfMonth(currentMonth);

  for (let i = 0; i < startOffset; i++) calendarDays.push(null);
  for (let i = 1; i <= totalDays; i++) calendarDays.push(i);

  const getPostsForDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredPosts.filter(p => p.scheduledDate === dateStr);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl">
      <header className="mb-12">
        <div className="micro-label mb-4">Tactical Roadmap</div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-white">
          <div>
            <h2 className="text-7xl font-black mb-6">POST<br/><span className="text-brand">CALENDAR</span></h2>
            <p className="text-[#888] normal-case max-w-md leading-relaxed">
              Operational view of your scheduled tactical output. Optimize your posting cadence across all semantic channels.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex bg-void border border-border p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 text-[10px] font-bold transition-all ${viewMode === 'grid' ? 'bg-brand text-white' : 'text-white/40 hover:text-white'}`}
              >
                GRID VIEW
              </button>
              <button 
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 text-[10px] font-bold transition-all ${viewMode === 'timeline' ? 'bg-brand text-white' : 'text-white/40 hover:text-white'}`}
              >
                TIMELINE
              </button>
            </div>
            
            {posts.length > 0 && (
              <button 
                onClick={handleExport}
                className="accent-button border-white/20 hover:border-brand flex items-center gap-3 px-6"
              >
                <Download size={14} /> EXPORT CSV
              </button>
            )}
          </div>
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center border border-dashed border-border group">
          <Calendar size={64} className="mb-6 text-white/5 group-hover:text-brand/20 transition-colors" />
          <p className="text-white/20 micro-label tracking-[0.3em]">Operational Void - No Content Scheduled</p>
          <p className="text-white/10 text-[10px] mt-2 normal-case italic">Head to Campaign View to commit ideas to the calendar.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Filters */}
          <div className="flex flex-wrap gap-8 items-center border-b border-border pb-8">
            <div className="flex flex-col gap-2">
              <label className="micro-label">Channel Matrix</label>
              <div className="flex gap-2">
                {['All', ...platforms].map(p => (
                  <button 
                    key={p}
                    onClick={() => setFilterPlatform(p)}
                    className={`px-3 py-1.5 text-[9px] font-black tracking-widest uppercase border transition-all ${
                      filterPlatform === p ? 'bg-brand border-brand text-white' : 'border-border text-white/40 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="micro-label">Strategic Theme Filter</label>
              <select 
                value={filterTheme}
                onChange={(e) => setFilterTheme(e.target.value)}
                className="bg-void border border-border p-2 text-[10px] font-bold text-brand uppercase focus:outline-none"
              >
                <option value="All">ALL THEMES</option>
                {themes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="ml-auto text-[10px] font-bold text-white/20 uppercase tracking-widest">
              Filtering <span className="text-brand">{filteredPosts.length}</span> / {posts.length} Assets
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="bold-card p-0 overflow-hidden border-border/40">
              <div className="bg-void p-6 border-b border-border flex justify-between items-center">
                <h3 className="font-black text-xl tracking-tighter uppercase">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 border border-border hover:border-brand transition-colors">
                    <RefreshCcw size={14} className="rotate-180" />
                  </button>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 border border-border hover:border-brand transition-colors">
                    <RefreshCcw size={14} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 border-b border-border">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="p-4 text-[10px] font-bold text-white/20 uppercase text-center border-r border-border last:border-r-0">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 bg-white/5">
                {calendarDays.map((day, idx) => {
                  const dayPosts = day ? getPostsForDay(day) : [];
                  return (
                    <div 
                      key={idx} 
                      className={`min-h-[140px] p-2 border-r border-b border-border last:border-r-0 relative group transition-all ${day ? 'bg-void hover:bg-brand/5' : 'bg-transparent'}`}
                    >
                      {day && (
                        <>
                          <span className="text-[10px] font-black text-white/20 group-hover:text-brand transition-colors">{day}</span>
                          <div className="mt-2 flex flex-col gap-1">
                            {dayPosts.map((p, pIdx) => (
                              <div key={pIdx} className="bg-brand/10 border-l-2 border-brand p-1.5 rounded-sm">
                                <p className="text-[9px] font-bold truncate tracking-tight text-brand uppercase">{p.theme}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredPosts.map((post, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bold-card grid grid-cols-1 md:grid-cols-12 gap-6 items-center group"
                >
                  <div className="md:col-span-2">
                    <div className="micro-label mb-1 opacity-40">Phase Date</div>
                    <div className="text-xl font-black text-brand tracking-tighter">{post.scheduledDate}</div>
                    <div className="text-[10px] font-bold text-white/30 uppercase mt-1">{post.platform}</div>
                  </div>
                  
                  <div className="md:col-span-3">
                    <div className="micro-label mb-1 opacity-40">Strategic Theme</div>
                    <div className="text-lg font-black uppercase leading-tight line-clamp-1">{post.theme}</div>
                  </div>

                  <div className="md:col-span-5">
                    <div className="micro-label mb-1 opacity-40">Primary Hook</div>
                    <div className="text-white/60 normal-case italic text-xs line-clamp-2">{post.hook}</div>
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onUnschedule(post)}
                      className="p-3 text-red-500 hover:bg-red-500/10 rounded transition-all"
                      title="Remove from Calendar"
                    >
                      <Trash size={16} />
                    </button>
                    <div className="p-3 text-brand/40 bg-brand/5 rounded">
                      <Send size={16} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function StudioView() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [style, setStyle] = useState('photorealistic');
  const [quality, setQuality] = useState('standard');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [fetchingInspiration, setFetchingInspiration] = useState(false);
  const [inspiration, setInspiration] = useState<{title: string, prompt: string, platform: string}[]>([]);

  // History Management
  const [history, setHistory] = useState<{prompt: string, aspectRatio: string, style: string, quality: string, mediaType: 'image' | 'video', content: string | null}[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = (newState: {prompt: string, aspectRatio: string, style: string, quality: string, mediaType: 'image' | 'video', content: string | null}) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    if (newHistory.length > 50) newHistory.shift(); 
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const jumpToHistory = (index: number) => {
    if (index >= 0 && index < history.length) {
      const state = history[index];
      setHistoryIndex(index);
      setPrompt(state.prompt);
      setAspectRatio(state.aspectRatio);
      setStyle(state.style);
      setQuality(state.quality);
      setMediaType(state.mediaType);
      setImage(state.content);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setPrompt(prevState.prompt);
      setAspectRatio(prevState.aspectRatio);
      setStyle(prevState.style);
      setQuality(prevState.quality);
      setMediaType(prevState.mediaType);
      setImage(prevState.content);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setPrompt(nextState.prompt);
      setAspectRatio(nextState.aspectRatio);
      setStyle(nextState.style);
      setQuality(nextState.quality);
      setMediaType(nextState.mediaType);
      setImage(nextState.content);
    }
  };

  const handleGenerate = async (type: 'image' | 'video') => {
    setMediaType(type);
    setLoading(true);
    try {
      const result = await generatePostImage(prompt, aspectRatio, style, quality, type === 'video');
      setImage(result);
      saveToHistory({ prompt, aspectRatio, style, quality, mediaType: type, content: result });
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadInspiration = async () => {
    setFetchingInspiration(true);
    try {
      const feed = await getInspirationFeed();
      setInspiration(feed);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingInspiration(false);
    }
  };

  React.useEffect(() => {
    loadInspiration();
  }, []);

  const aspectClass = aspectRatio === '1:1' ? 'aspect-square' : aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl">
      <header className="mb-16">
        <div className="micro-label mb-4">Visual Synthesis</div>
        <h2 className="text-7xl font-black mb-6">RAW ASSET<br/><span className="text-brand">STUDIO</span></h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <p className="text-[#888] normal-case max-w-lg">Direct AI-driven visual generation for production-ready social assets. Toggle between static imagery and high-motion architectural clips.</p>
          <div className="flex gap-6 items-center">
            {image && (
              <div className="flex gap-4 items-center border-r border-border pr-6">
                <button 
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: 'Social Architect Visual',
                          text: `Check out this visual generated for: ${prompt}`,
                          url: window.location.href,
                        });
                      } catch (err) {
                        console.log('Error sharing:', err);
                      }
                    } else {
                      alert('Web Share not supported. Use the platform links below.');
                    }
                  }}
                  className="micro-label flex items-center gap-2 hover:text-brand transition-all"
                >
                  <Share2 size={12} /> Share
                </button>
                <div className="flex gap-2">
                  <a 
                    href={`https://twitter.com/intent/tweet?text=Architected with Social Architect: ${prompt}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#444] hover:text-white transition-colors"
                  >
                    <Twitter size={14} />
                  </a>
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#444] hover:text-white transition-colors"
                  >
                    <Linkedin size={14} />
                  </a>
                </div>
              </div>
            )}
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-4">
                <button 
                  onClick={undo} 
                  disabled={historyIndex <= 0}
                  className="micro-label flex items-center gap-2 hover:text-white disabled:opacity-20 transition-all cursor-pointer"
                >
                  <RefreshCcw size={12} className="-scale-x-100" /> Undo
                </button>
                <button 
                  onClick={redo} 
                  disabled={historyIndex >= history.length - 1}
                  className="micro-label flex items-center gap-2 hover:text-white disabled:opacity-20 transition-all cursor-pointer"
                >
                  Redo <RefreshCcw size={12} />
                </button>
              </div>
              
              {history.length > 0 && (
                <div className="flex gap-1.5 items-center">
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter mr-2">Synthesis Pipeline</span>
                  <div className="flex gap-1">
                    {history.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => jumpToHistory(i)}
                        className={`w-1.5 h-4 transition-all ${
                          i === historyIndex 
                            ? 'bg-brand' 
                            : i < historyIndex 
                              ? 'bg-white/10 hover:bg-white/30' 
                              : 'bg-white/5 opacity-30 hover:opacity-100 hover:bg-white/20'
                        }`}
                        title={`State ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-5 flex flex-col gap-8">
          <form onSubmit={(e) => { e.preventDefault(); handleGenerate('image'); }} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="micro-label">Visual Concept</label>
            <input 
              className="bold-input text-2xl py-6"
              placeholder="ENTER VISUAL PARAMETERS..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <label className="micro-label">Aspect Ratio</label>
              <div className="flex gap-2">
                {['1:1', '16:9', '9:16'].map(ratio => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex-1 py-2 text-xs font-bold border transition-all ${
                      aspectRatio === ratio ? 'bg-brand border-brand text-white' : 'border-border text-white/40 hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="micro-label">Artistic Style</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  'photorealistic', 'illustration', 'abstract', 
                  'cyberpunk', 'minimalist', '3d render', 
                  'anime', 'watercolor', 'pixel art', 
                  'noir', 'sketch', 'cartoon', 'video',
                  'vintage', 'steampunk', 'low poly'
                ].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(s)}
                    className={`py-2 text-[10px] font-bold border transition-all uppercase ${
                      style === s ? 'bg-brand border-brand text-white' : 'border-border text-white/40 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="micro-label">Image Quality</label>
              <div className="flex gap-2">
                {['standard', 'high', 'ultra'].map(q => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuality(q)}
                    className={`flex-1 py-2 text-[10px] font-bold border transition-all uppercase ${
                      quality === q ? 'bg-accent border-accent text-white' : 'border-border text-white/40 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              type="button" 
              disabled={loading || !prompt}
              onClick={() => handleGenerate('image')}
              className={`accent-button flex items-center justify-center gap-3 ${mediaType === 'image' ? 'border-brand' : 'border-white/10 opacity-50'}`}
            >
              {loading && mediaType === 'image' ? (
                <>
                  <RefreshCcw className="animate-spin" size={16} /> GENERATING...
                </>
              ) : (
                <>
                  <ImageIcon size={16} /> RENDER IMAGE
                </>
              )}
            </button>
            <button 
              type="button" 
              disabled={loading || !prompt}
              onClick={() => handleGenerate('video')}
              className={`accent-button flex items-center justify-center gap-3 bg-transparent ${mediaType === 'video' ? 'text-accent border-accent' : 'text-white/40 border-white/10 opacity-50'} hover:bg-accent hover:text-white`}
            >
              {loading && mediaType === 'video' ? (
                <>
                  <RefreshCcw className="animate-spin" size={16} /> GENERATING...
                </>
              ) : (
                <>
                  <Film size={16} /> RENDER VIDEO
                </>
              )}
            </button>
          </div>
        </form>
      </div>

        <div className="xl:col-span-7 flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="micro-label">Content Inspiration Feed</label>
              <button 
                onClick={loadInspiration} 
                disabled={fetchingInspiration}
                className="text-[10px] font-bold text-brand hover:underline flex items-center gap-2"
              >
                <RefreshCcw size={10} className={fetchingInspiration ? 'animate-spin' : ''} /> REFRESH FEED
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fetchingInspiration ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-32 bg-white/5 animate-pulse border border-border" />
                ))
              ) : (
                inspiration.map((item, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(item.prompt);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bold-card flex flex-col text-left group hover:border-brand transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-black text-brand tracking-widest uppercase">{item.platform}</span>
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h5 className="font-bold text-xs mb-2 line-clamp-1">{item.title}</h5>
                    <p className="text-[10px] text-white/40 normal-case line-clamp-2 italic">{item.prompt}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="micro-label">Architecture Preview</label>
            <div className={`border border-border ${aspectClass} relative bg-void flex items-center justify-center overflow-hidden mx-auto max-w-full w-full`}>
              {image ? (
                mediaType === 'video' ? (
                  <video src={image} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                ) : (
                  <img src={image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )
              ) : (
                <div className="text-white/10 micro-label uppercase tracking-[0.4em]">Awaiting Output</div>
              )}
              
              {loading && (
                <div className="absolute inset-0 bg-void/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <RefreshCcw className="animate-spin text-brand" size={32} />
                    <span className="micro-label animate-pulse">Materializing Concept...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TransformerView() {
  const [caption, setCaption] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium');
  const [includeKeywords, setIncludeKeywords] = useState('');
  const [excludeKeywords, setExcludeKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [brainstorming, setBrainstorming] = useState(false);
  const [topic, setTopic] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const TONES = [
    'Professional', 'Provocative', 'Minimalist', 
    'Socratic', 'Humorous', 'Academic', 
    'Inspirational', 'Casual', 'Urgent'
  ];

  const LENGTHS = ['Short', 'Medium', 'Long'];

  const getKeywordConfig = () => ({
    include: includeKeywords.split(',').map(k => k.trim()).filter(Boolean),
    exclude: excludeKeywords.split(',').map(k => k.trim()).filter(Boolean)
  });

  const handleTransform = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const transformed = await transformCaption(caption, PLATFORMS, tone, length.toLowerCase(), getKeywordConfig());
      setResults(transformed);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAll = () => {
    const allText = Object.entries(results)
      .map(([platform, text]) => `--- ${platform.toUpperCase()} ---\n${text}`)
      .join('\n\n');
    copyToClipboard(allText, 'all');
  };

  const handleBrainstorm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);
    try {
      const content = await generateBaseContent(topic, "engagement", length.toLowerCase(), getKeywordConfig());
      setCaption(content);
      setBrainstorming(false);
      setTopic('');
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl">
      <header className="mb-16">
        <div className="micro-label mb-4">Semantic Adaptation</div>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-7xl font-black mb-6">CHANNEL<br/><span className="text-brand">ADAPTER</span></h2>
            <p className="text-[#888] normal-case">Rewrite and optimize core messaging for specific platform ecosystems.</p>
          </div>
          {Object.keys(results).length > 0 && (
            <button 
              onClick={copyAll}
              className="micro-label flex items-center gap-2 hover:text-brand transition-all cursor-pointer"
            >
              {copiedId === 'all' ? <Check size={12} /> : <Copy size={12} />} Copy All Adaptive Scripts
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <form onSubmit={handleTransform} className="flex flex-col gap-8 sticky top-16">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-1">
                <label className="micro-label">Base Content Asset</label>
                <button 
                  type="button"
                  onClick={() => setBrainstorming(!brainstorming)}
                  className={`flex items-center gap-2 text-[10px] font-bold transition-all px-2 py-1 rounded ${
                    brainstorming ? 'bg-brand text-white' : 'text-brand hover:bg-brand/10'
                  }`}
                >
                  <Sparkles size={10} /> {brainstorming ? 'CANCEL AI' : 'AI BRAINSTORM'}
                </button>
              </div>

              <AnimatePresence>
                {brainstorming && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="p-4 bg-brand/5 border border-brand/20 flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-brand/60">Topic or Brief</span>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            className="flex-1 bg-void border border-border p-2 text-xs focus:ring-1 focus:ring-brand outline-none"
                            placeholder="e.g., Why sustainable architecture matters in 2024..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            autoFocus
                          />
                          <button 
                            type="button"
                            onClick={handleBrainstorm}
                            disabled={loading || !topic}
                            className="bg-brand text-white px-4 flex items-center justify-center disabled:opacity-50"
                          >
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea 
                className="bold-input min-h-[300px] normal-case text-lg leading-relaxed placeholder:opacity-10"
                placeholder="PROMPT: PASTE RAW CAPTION OR CAMPAIGN HOOK HERE..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="micro-label">Narrative Architecture (Tone)</label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`py-2 text-[10px] font-bold border transition-all uppercase ${
                        tone === t ? 'bg-accent border-accent text-white' : 'border-border text-white/40 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="micro-label">Syntactic Volume (Length)</label>
                <div className="flex flex-col gap-2">
                  {LENGTHS.map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLength(l)}
                      className={`py-2 text-[10px] font-bold border transition-all uppercase ${
                        length === l ? 'bg-brand border-brand text-white' : 'border-border text-white/40 hover:text-white'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-4 border border-border/40 bg-white/5">
              <div className="flex flex-col gap-2">
                <label className="micro-label">Include Lexical Tokens (Keywords)</label>
                <input 
                  type="text"
                  placeholder="Comma separated: luxury, modern, green..."
                  className="bg-transparent border border-border p-2 text-xs focus:ring-1 focus:ring-brand outline-none"
                  value={includeKeywords}
                  onChange={(e) => setIncludeKeywords(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="micro-label">Exclude Lexical Tokens</label>
                <input 
                  type="text"
                  placeholder="Comma separated: cheap, fast, quick..."
                  className="bg-transparent border border-border p-2 text-xs focus:ring-1 focus:ring-brand outline-none"
                  value={excludeKeywords}
                  onChange={(e) => setExcludeKeywords(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={loading || !caption} className="accent-button flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <RefreshCcw className="animate-spin" size={16} /> PROCESSING CHANNELS...
                </>
              ) : (
                <>
                  <Zap size={16} /> EXECUTE ADAPTATION
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="popLayout">
            {Object.keys(results).length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] flex flex-col items-center justify-center border border-dashed border-border text-white/10 uppercase tracking-widest text-xs"
              >
                <Hash size={48} className="mb-4 opacity-5" />
                <p>Waiting for Synthesis</p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-6">
                {Object.entries(results).map(([platform, text]: [string, string], idx) => (
                  <motion.div 
                    key={platform}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bold-card group relative hover:border-brand/50 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                          {platform.toLowerCase().includes('twitter') || platform.toLowerCase().includes('x') ? (
                            <Twitter size={14} className="text-brand" />
                          ) : platform.toLowerCase().includes('linkedin') ? (
                            <Linkedin size={14} className="text-brand" />
                          ) : (
                            <ImageIcon size={14} className="text-brand" />
                          )}
                        </div>
                        <span className="text-white font-black tracking-widest text-xs uppercase">{platform}</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(text, platform)}
                        className={`p-2 rounded transition-all ${
                          copiedId === platform ? 'bg-green-500/20 text-green-500' : 'text-[#444] hover:text-white hover:bg-white/5'
                        }`}
                        title="Copy to clipboard"
                      >
                        {copiedId === platform ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    <div className="text-white/60 normal-case text-[15px] leading-relaxed whitespace-pre-wrap font-sans selection:bg-brand selection:text-white">
                      {text}
                    </div>
                    
                    <div className="mt-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-brand/50 to-transparent self-center" />
                      <div className="micro-label">Ready for Deployment</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// --- Helpers ---

function InputGroup({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="micro-label">{label}</label>
      <input 
        className="bold-input uppercase placeholder:text-white/10"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
