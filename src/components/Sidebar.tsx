import { Leaf, LayoutDashboard, PlusCircle, BookMarked, Settings } from 'lucide-react';
import { Screen } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: Screen) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => (
  <aside className="w-64 bg-sidebar-bg text-text-light p-10 flex flex-col gap-10 h-screen sticky top-0 shrink-0 hidden md:flex">
    <div className="flex items-center gap-3 text-white font-extrabold text-2xl">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Leaf className="w-5 h-5 text-white" />
      </div>
      <span>Verda</span>
    </div>
    <nav className="flex flex-col gap-3">
      <button 
        onClick={() => onTabChange('DASHBOARD')}
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-medium transition-all ${activeTab === 'DASHBOARD' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-text-light/70'}`}
      >
        <LayoutDashboard className="w-5 h-5" />
        My Garden
      </button>
      <button 
        onClick={() => onTabChange('ADD_PLANT')}
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-medium transition-all ${activeTab === 'ADD_PLANT' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-text-light/70'}`}
      >
        <PlusCircle className="w-5 h-5" />
        Add New Plant
      </button>
      <button 
        onClick={() => onTabChange('TOMATO_CARE')}
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-medium transition-all ${activeTab === 'TOMATO_CARE' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-text-light/70'}`}
      >
        <BookMarked className="w-5 h-5" />
        Care Guides
      </button>
      <button 
        onClick={() => onTabChange('SETTINGS')}
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-medium transition-all ${activeTab === 'SETTINGS' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-text-light/70'}`}
      >
        <Settings className="w-5 h-5" />
        Settings
      </button>
    </nav>
  </aside>
);
