import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/api';
import { MapPin, Calendar, Heart, Wind, Coffee, ArrowRight, Loader2, IndianRupee, Info, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    start_date: '',
    end_date: '',
    budget: 25000,
    travel_type: 'Family',
    preferences: {
      budget_range: 'Mid-range',
      travel_style: 'Cultural',
      food_preferences: 'Regional Indian',
      pace: 'Balanced',
      interests: 'Temples, Heritage, Food'
    }
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await tripService.createTrip(formData);
      navigate(`/dashboard/${response.data.id}`);
    } catch (error) {
      console.error("Failed to create trip:", error);
      setLoading(false);
    }
  };

  const updateNested = (key, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  const steps = [
    { title: "Basics", icon: MapPin },
    { title: "Budget", icon: IndianRupee },
    { title: "Style", icon: Heart },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">Start Your Indian Odyssey</h1>
        <p className="text-slate-500 text-center text-lg">From spiritual circuits to hill station retreats, Sojourner AI knows the way.</p>

        <div className="flex justify-center items-center gap-4 mt-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === i + 1 ? 'bg-primary text-white scale-110 shadow-lg' :
                  step > i + 1 ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                } transition-all duration-300`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && <div className="w-12 h-1 bg-slate-200" />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] premium-shadow p-10 relative overflow-hidden border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Navigation className="w-3 h-3" /> Starting City (Source)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Delhi, Mumbai"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Going To (Destination)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Varanasi, Manali, Hampi"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Wind className="w-3 h-3" /> Group Type
                    </label>
                    <select
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium appearance-none"
                      value={formData.travel_type}
                      onChange={(e) => setFormData({ ...formData, travel_type: e.target.value })}
                    >
                      <option>Solo</option>
                      <option>Couple</option>
                      <option>Family</option>
                      <option>Friends</option>
                      <option>Spiritual Group</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Departure (from Source)
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Arrival (back at Source)
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="bg-slate-900 rounded-3xl p-8 text-white">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest block mb-4">Total Estimated Budget</label>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-white/10 p-4 rounded-2xl">
                      <IndianRupee className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <span className="text-4xl font-bold">₹{formData.budget.toLocaleString('en-IN')}</span>
                      <p className="text-slate-400 text-xs mt-1">AI will optimize for {formData.preferences.budget_range} preferences</p>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="5000"
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-bold uppercase">
                    <span>₹5,000 (Backpacker)</span>
                    <span>₹50,000 (Comfort)</span>
                    <span>₹1,00,000+ (Luxe/Heritage)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Info className="w-3 h-3 text-primary" /> Spending Approach
                    </label>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Your budget of ₹{formData.budget.toLocaleString('en-IN')} will be used to prioritize
                      {formData.budget < 20000 ? ' affordable stays and local transport' :
                        formData.budget < 60000 ? ' comfortable hotels and AC travel' :
                          ' premium stays and private transfers'}.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Primary Interest</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Spiritual', 'Adventure', 'Leisure', 'Business'].map(style => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => updateNested('travel_style', style)}
                          className={`py-3 px-2 rounded-xl text-[10px] font-bold uppercase transition-all ${formData.preferences.travel_style === style ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 text-slate-400'
                            }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Coffee className="w-3 h-3" /> Food & Pacing
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {['Slow', 'Balanced', 'Intense'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => updateNested('pace', p)}
                        className={`py-4 rounded-2xl text-xs font-bold transition-all border-2 ${formData.preferences.pace === p ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400'
                          }`}
                      >
                        {p} Pace
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none h-24 text-slate-800 font-medium"
                    placeholder="Vegetarian, prefer street food, avoid spicy..."
                    value={formData.preferences.food_preferences}
                    onChange={(e) => updateNested('food_preferences', e.target.value)}
                  />
                </div>
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3">
                  <Info className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    <strong>AI Note:</strong> Since this is your first spiritual trip, Sojourner will prioritize temple timings and suggest nearby dhabas known for traditional food.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center pt-8 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                Go Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                disabled={loading}
                type="submit"
                className="bg-primary text-white px-12 py-4 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all premium-shadow disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Crafting Experience...</span>
                  </>
                ) : (
                  <>
                    <span>Create Trip</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
