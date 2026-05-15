import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { tripService, aiService } from '../services/api';
import { 
  Calendar, MapPin, Clock, Zap, Sparkles, Send, 
  ChevronRight, Utensils, Settings, RefreshCw, 
  Train, Bus, Coffee, Moon, AlertCircle, Info, Activity, Terminal
} from 'lucide-react';
import ReasoningInspector from '../components/ReasoningInspector';
import { motion, AnimatePresence } from 'framer-motion';

const TripDashboard = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [showInspector, setShowInspector] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [proactiveSuggestions, setProactiveSuggestions] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const fetchTrip = async () => {
    try {
      const res = await tripService.getTrip(id);
      setTrip(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await aiService.chat(id, message);
      const aiData = res.data;
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: aiData.message,
        cue: aiData.personalization_cue 
      }]);
      
      if (aiData.proactive_prompts) {
        setProactiveSuggestions(aiData.proactive_prompts);
      }

      if (aiData.updated_plan && Object.keys(aiData.updated_plan).length > 0) {
        fetchTrip();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] space-y-4">
      <RefreshCw className="w-12 h-12 text-primary animate-spin" />
      <p className="text-slate-500 font-medium">Synchronizing your travel context...</p>
    </div>
  );

  if (!trip) return <div className="p-10 text-center">Trip not found.</div>;

  const isActive = trip.status.toUpperCase() === 'ACTIVE';

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden bg-slate-50">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        {/* Status Badge */}
        <div className={`absolute top-8 right-8 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          isActive ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-blue-100 text-blue-700'
        }`}>
          {isActive ? '• Live Travel Mode' : trip.status}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              {trip.destination} {isActive && <Zap className="w-6 h-6 text-accent fill-accent" />}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {trip.start_date}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {trip.travel_type}</span>
              <span>•</span>
              <span className="text-slate-900 font-bold text-lg">₹{trip.budget.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {isActive ? (
            /* ACTIVE MODE DASHBOARD */
            <div className="space-y-8">
              <section className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Train className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">Currently Happening</span>
                  <h2 className="text-2xl font-bold mb-4">Temple Visit & Local Exploration</h2>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" /> Ends in 45 mins
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <MapPin className="w-4 h-4" /> Virupaksha Temple
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 premium-shadow">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" /> Up Next
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                      <div className="bg-white p-2.5 rounded-xl shadow-sm text-primary">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400">1:30 PM</div>
                        <div className="text-sm font-bold text-slate-800">Authentic South Indian Thali</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl opacity-60">
                      <div className="bg-white p-2.5 rounded-xl shadow-sm text-slate-400">
                        <Bus className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400">3:00 PM</div>
                        <div className="text-sm font-bold text-slate-800">Local Market Walk</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 premium-shadow">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" /> Live Suggestions
                  </h3>
                  <div className="space-y-3">
                    {proactiveSuggestions.length > 0 ? proactiveSuggestions.map((s, i) => (
                      <button key={i} className="w-full text-left p-3 rounded-2xl text-xs font-medium bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all">
                        "{s}"
                      </button>
                    )) : (
                      <>
                        <button className="w-full text-left p-3 rounded-2xl text-xs font-medium bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-all">
                          "You've walked 8km today. Want to find a rest spot?"
                        </button>
                        <button className="w-full text-left p-3 rounded-2xl text-xs font-medium bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-all">
                          "Expect light rain at 4 PM. Shift outdoor activities?"
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 premium-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-600 p-3 rounded-2xl">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Budget Status</h4>
                    <p className="text-xs text-slate-500">₹{(trip.budget * 0.42).toLocaleString('en-IN')} spent / ₹{trip.budget.toLocaleString('en-IN')} total</p>
                  </div>
                </div>
                <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[42%]" />
                </div>
              </div>
            </div>
          ) : (
            /* PLANNING / UPCOMING DASHBOARD */
            <>
              <div className="grid grid-cols-4 gap-4 mb-12">
                {[
                  { label: 'Find Trains', intent: 'FIND_TRAINS', icon: Train, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Find Stays', intent: 'FIND_STAYS', icon: Coffee, color: 'bg-orange-50 text-orange-600' },
                  { label: 'Local Food', intent: 'SUGGEST_FOOD', icon: Utensils, color: 'bg-green-50 text-green-600' },
                  { label: 'Optimize Plan', intent: 'OPTIMIZE_DAY', icon: Zap, color: 'bg-purple-50 text-purple-600' },
                ].map((action, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      setMessage(`I want to ${action.label.toLowerCase()}`);
                      // Trigger message immediately if desired
                    }}
                    className={`${action.color} p-4 rounded-2xl flex flex-col items-center gap-2 font-bold text-[10px] transition-transform hover:scale-105 shadow-sm border border-transparent hover:border-current/20`}
                  >
                    <action.icon className="w-5 h-5" />
                    {action.label}
                  </button>
                ))}
              </div>

              <div className="space-y-12 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
                {trip.itinerary_days.sort((a,b) => a.day_number - b.day_number).map((day, idx) => (
                  <div key={day.id} className="relative pl-12">
                    <div className="absolute left-0 top-0 w-10 h-10 bg-white border-4 border-primary rounded-full flex items-center justify-center text-sm font-bold text-slate-800 z-10 shadow-sm">
                      {day.day_number}
                    </div>
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-slate-800">{day.title}</h2>
                      <p className="text-sm text-slate-500 mt-1">{day.notes || "Ready for exploration."}</p>
                    </div>
                    <div className="space-y-4">
                      {day.activities.map((activity) => (
                        <div key={activity.id} className="bg-white p-5 rounded-2xl border border-slate-100 premium-shadow group hover:border-primary/30 transition-all">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div className="bg-slate-50 p-3 rounded-xl text-slate-400 group-hover:text-primary transition-colors">
                                {activity.category === 'Dining' ? <Utensils className="w-5 h-5" /> : 
                                 activity.category === 'Transport' ? <Train className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{activity.time}</span>
                                  <span className="bg-slate-100 text-[9px] font-bold px-2 py-0.5 rounded-full text-slate-500">{activity.category}</span>
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">{activity.name}</h3>
                                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {activity.location}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs font-bold text-slate-800">₹{activity.estimated_cost}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* AI Sidebar */}
      <aside className={`w-[420px] border-l border-slate-200 bg-white flex flex-col transition-all duration-300 ${chatOpen ? 'translate-x-0' : 'translate-x-full absolute right-0'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Travel Companion</h3>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
                <span className="text-[9px] text-slate-400 uppercase font-bold">{isActive ? 'Live Guide Active' : 'Planner Mode'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowInspector(!showInspector)}
              className={`p-1.5 rounded-lg transition-colors ${showInspector ? 'text-green-400 bg-white/10' : 'text-slate-400 hover:text-white'}`}
              title="Debug Reasoning"
            >
              <Terminal className="w-4 h-4" />
            </button>
            <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {chatHistory.length === 0 && (
            <div className="text-center py-10 space-y-6">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Coffee className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">Namaste!</h4>
                <p className="text-xs text-slate-500 px-10 leading-relaxed">
                  I'm your {isActive ? 'live coordinator' : 'trip planner'}. 
                  {isActive ? ' Need help adjusting the plan for weather or fatigue?' : ' Want me to optimize your route or suggest local dhabas?'}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 px-6">
                {isActive ? (
                  ["Suggest food nearby", "I'm feeling tired", "Rain update"].map((s, i) => (
                    <button key={i} onClick={() => setMessage(s)} className="text-[10px] bg-white border border-slate-200 p-3 rounded-2xl text-slate-600 hover:border-primary transition-all text-left font-medium">"{s}"</button>
                  ))
                ) : (
                  ["Best temples to visit", "Plan an overnight bus", "Optimize for budget"].map((s, i) => (
                    <button key={i} onClick={() => setMessage(s)} className="text-[10px] bg-white border border-slate-200 p-3 rounded-2xl text-slate-600 hover:border-primary transition-all text-left font-medium">"{s}"</button>
                  ))
                )}
              </div>
            </div>
          )}

          {chatHistory.map((msg, i) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.cue && (
                <span className="text-[9px] font-bold text-primary mb-1 ml-4 bg-primary/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Info className="w-2.5 h-2.5" /> {msg.cue}
                </span>
              )}
              <div className={`max-w-[90%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-white">
          <form onSubmit={handleSendMessage} className="relative">
            <input 
              type="text"
              placeholder={isActive ? "Ask your live guide..." : "Ask your planner..."}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-5 pr-14 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary transition-all shadow-md">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>

      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} className="fixed right-6 bottom-6 bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50 animate-float">
          <Sparkles className="w-6 h-6" />
        </button>
      )}
      {showInspector && (
        <ReasoningInspector 
          tripId={id} 
          onClose={() => setShowInspector(false)} 
        />
      )}
    </div>
  );
};

export default TripDashboard;
