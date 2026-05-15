import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Calendar, History, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Compass },
    { name: 'Create Trip', path: '/create', icon: PlusCircle },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-primary p-2 rounded-xl">
          <Compass className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-800">Sojourner</span>
      </div>
      
      <div className="flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              location.pathname === item.path ? 'text-primary' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
          Log In
        </button>
        <Link 
          to="/create"
          className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold premium-shadow hover:opacity-90 transition-all"
        >
          Start Planning
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
