import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Calendar as CalendarIcon, ArrowRight, Sparkles, Zap, IndianRupee } from 'lucide-react';
import { tripService } from '../services/api';
import { motion } from 'framer-motion';

const Home = () => {
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripService.getTrips()
      .then(res => {
        setRecentTrips(res.data.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] mb-12 h-[450px] flex items-center px-12 text-white premium-shadow">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1524492717547-2249978a688b?auto=format&fit=crop&q=80&w=2000" 
          alt="India Travel" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>India-First Travel Platform</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Rediscover <br /> the Subcontinent.
            </h1>
            <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-lg">
              Sojourner is your contextual companion for the Indian road. From spiritual circuits to high-altitude treks, we coordinate it all.
            </p>
            <Link 
              to="/create"
              className="bg-primary text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-2xl w-fit"
            >
              <Plus className="w-5 h-5" />
              Plan New Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Your Journeys</h2>
            <Link to="/history" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              All Trips <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              [1, 2].map(i => <div key={i} className="h-72 bg-slate-200 animate-pulse rounded-3xl" />)
            ) : recentTrips.length > 0 ? (
              recentTrips.map((trip) => (
                <Link key={trip.id} to={`/dashboard/${trip.id}`}>
                  <motion.div whileHover={{ y: -5 }} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 premium-shadow group relative">
                    {trip.status === 'ACTIVE' && (
                      <div className="absolute top-4 right-4 z-10 bg-accent text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" /> Live
                      </div>
                    )}
                    <div className="h-40 bg-slate-100 overflow-hidden relative">
                      <img 
                        src={`https://source.unsplash.com/800x400/?${trip.destination},india`}
                        alt={trip.destination}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1524492717547-2249978a688b?auto=format&fit=crop&q=80&w=800"; }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{trip.destination}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> {trip.start_date}</div>
                        <div className="flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" /> {trip.budget.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center">
                <p className="text-slate-400 font-medium mb-6">No trips planned yet. Where to next?</p>
                <Link to="/create" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold inline-block hover:bg-slate-800 transition-all">Start Your First Trip</Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <Sparkles className="w-10 h-10 text-primary mb-6" />
            <h3 className="text-xl font-bold mb-4">Contextual Memory</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Sojourner learns your pacing and budget habits over time. It knows if you prefer early morning train journeys or late-night bus arrivals.
            </p>
            <div className="space-y-3">
              <div className="bg-white/5 p-4 rounded-2xl text-[11px] border border-white/10 text-slate-300 italic">
                "Based on your previous temple-focused trips, I've prioritized early morning visits for Varanasi."
              </div>
              <div className="bg-white/5 p-4 rounded-2xl text-[11px] border border-white/10 text-slate-300 italic">
                "You usually stay under budget on food, so I've suggested some local dhabas for this route."
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Indian Connectivity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm"><Zap className="w-4 h-4 text-primary" /></div>
                <div className="text-xs font-bold text-slate-600">Real-time IRCTC Status</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm"><Zap className="w-4 h-4 text-primary" /></div>
                <div className="text-xs font-bold text-slate-600">Volvo/Sleeper Bus Integration</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm"><Zap className="w-4 h-4 text-primary" /></div>
                <div className="text-xs font-bold text-slate-600">Local Guide Coordination</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
