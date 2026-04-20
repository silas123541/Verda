import { LayoutDashboard, PlusCircle, BookMarked, Settings } from 'lucide-react';
import { Screen } from '../types';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: Screen) => void;
}

export const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => (
  <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-card-bg/95 backdrop-blur-xl z-[100] rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.12)] md:hidden border-t border-outline/10">
    <button onClick={() => onTabChange('DASHBOARD')} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'DASHBOARD' ? 'text-primary' : 'text-secondary'}`}>
      <LayoutDashboard className="w-6 h-6" />
      <span className="text-[10px] font-bold mt-1">Garden</span>
    </button>
    <button onClick={() => onTabChange('ADD_PLANT')} className={`flex flex-col items-center p-2 ${activeTab === 'ADD_PLANT' ? 'text-primary' : 'text-secondary'}`}>
      <PlusCircle className="w-6 h-6" />
      <span className="text-[10px] font-bold mt-1">Add</span>
    </button>
    <button onClick={() => onTabChange('TOMATO_CARE')} className={`flex flex-col items-center p-2 ${activeTab === 'TOMATO_CARE' ? 'text-primary' : 'text-secondary'}`}>
      <BookMarked className="w-6 h-6" />
      <span className="text-[10px] font-bold mt-1">Guides</span>
    </button>
    <button onClick={() => onTabChange('SETTINGS')} className={`flex flex-col items-center p-2 ${activeTab === 'SETTINGS' ? 'text-primary' : 'text-secondary'}`}>
      <Settings className="w-6 h-6" />
      <span className="text-[10px] font-bold mt-1">Settings</span>
    </button>
  </nav>
);
