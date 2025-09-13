"use client"

import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, Settings, LogOut, ChevronLeft, ChevronRight, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className={`text-2xl font-bold ${isCollapsed ? 'hidden' : 'block'}`}>Quriosity</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-md ${isCollapsed ? 'justify-center' : ''} ${
                isActive
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon className={`w-6 h-6 ${!isCollapsed ? 'mr-3' : ''}`} />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`} alt="Avatar" className="w-8 h-8 rounded-full" />
            {!isCollapsed && (
                <div className="ml-3">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
            )}
        </div>
        <Button
          variant="ghost"
          className={`w-full mt-4 ${isCollapsed ? 'px-2' : ''}`}
          onClick={handleLogout}
        >
          <LogOut className={`w-6 h-6 ${!isCollapsed ? 'mr-3' : ''}`} />
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Logout</span>
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
            <PanelLeft className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-r transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute z-10 -right-5 top-1/2"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </Button>
      {sidebarContent}
    </div>
  );
}