import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripService } from '../services/api';
import { MapPin, Calendar, ArrowRight, Compass, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const TravelHistory = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    tripService.getTrips()
      .then(res => {
        setTrips(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredTrips = trips.filter(t => 
    t.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Travel History</h1>
          <p className="text-slate-500">Relive your past adventures and manage upcoming ones.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search destinations..."
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-80 focus:ring-2 focus:ring-primary outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-3xl" />)}
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={trip.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 premium-shadow group hover:border-primary/20 transition-all"
            >
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                <img 
                  src={`https://source.unsplash.com/800x600/?${trip.destination}`}
                  alt={trip.destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">
                  {trip.status}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">{trip.destination}</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4" />
                    <span>{trip.travel_type} • ₹{trip.budget.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <Link 
                  to={`/dashboard/${trip.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all group-hover:bg-primary group-hover:text-white"
                >
                  Open Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Compass className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No journeys found</h3>
          <p className="text-slate-500 mb-8">You haven't planned any trips yet. Ready to start?</p>
          <Link to="/create" className="bg-primary text-white px-8 py-3 rounded-xl font-bold premium-shadow">
            Create Your First Trip
          </Link>
        </div>
      )}
    </div>
  );
};

export default TravelHistory;
