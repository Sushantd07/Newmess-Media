import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid, Plus, Video, User, PlusCircle, AlertTriangle, MessageCircle } from 'lucide-react';

const MobileBottomNav = () => {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastScrollYRef = useRef(window.scrollY || 0);
  const tickingRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || 0;
          const lastY = lastScrollYRef.current;

          // Hide when scrolling down, show when scrolling up
          if (currentY > lastY + 6) {
            setHidden(true);
          } else if (currentY < lastY - 6) {
            setHidden(false);
          }
          lastScrollYRef.current = currentY;
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleAction = useCallback((action) => {
    setOpen(false);
    // Route placeholders – wire to real routes as needed
    if (action === 'add') navigate('/category');
    else if (action === 'complaint') navigate('/category');
    else if (action === 'ask') navigate('/category');
  }, [navigate]);

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ease-out ${hidden ? 'translate-y-full' : 'translate-y-0'}`}
      aria-label="Bottom Navigation"
    >
      <div className="relative mx-auto max-w-3xl">
        {/* Bar */}
        <div className="h-16 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] flex items-center justify-around px-2 pb-safe">
          <Link to="/" className="flex flex-col items-center justify-center text-gray-500 hover:text-orange-600 w-14">
            <Home className={`h-5 w-5 ${isActive('/') ? 'text-orange-600' : ''}`} />
            <span className={`text-[11px] font-semibold ${isActive('/') ? 'text-orange-600' : 'text-gray-600'}`}>Home</span>
          </Link>
          <Link to="/category" className="flex flex-col items-center justify-center text-gray-500 hover:text-orange-600 w-14">
            <Grid className={`h-5 w-5 ${isActive('/category') ? 'text-orange-600' : ''}`} />
            <span className={`text-[11px] font-semibold ${isActive('/category') ? 'text-orange-600' : 'text-gray-600'}`}>Category</span>
          </Link>

          {/* Center Add button */}
          <button type="button" onClick={() => { setOpen(false); navigate('/home/listing'); }} className="relative -mt-10" aria-label="Add options">
            <div className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center border-4 border-white transition-all ${open ? 'bg-orange-600 scale-110' : 'bg-orange-500'}`}>
              <Plus className="h-7 w-7 text-white" />
            </div>
          </button>

          <Link to="#" className="flex flex-col items-center justify-center text-gray-500 hover:text-orange-600 w-14">
            <Video className="h-5 w-5" />
            <span className="text-[11px] font-semibold text-gray-600">Video</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center justify-center text-gray-500 hover:text-orange-600 w-14">
            <User className={`h-5 w-5 ${isActive('/profile') ? 'text-orange-600' : ''}`} />
            <span className={`text-[11px] font-semibold ${isActive('/profile') ? 'text-orange-600' : 'text-gray-600'}`}>Profile</span>
          </Link>
        </div>
      </div>
      {/* Semi-circular radial menu (D format) */}
      {open && (
        <>
          <button aria-label="Close" className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40" onClick={() => setOpen(false)} />
          <div className="fixed bottom-16 left-0 right-0 z-50 md:hidden pointer-events-none">
            <div className="relative mx-auto max-w-3xl h-[150px]">
              {/* Clean semi-circle container */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[280px] h-[140px] rounded-t-full overflow-hidden shadow-[0_-8px_24px_rgba(0,0,0,0.12)] ring-1 ring-gray-200 bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#fff_0%,#f8fafc_60%,#eef2f7_100%)]" />
              </div>

              {/* Arc actions (evenly spaced) */}
              {[
                { key: 'add', label: 'Add', Icon: PlusCircle, color: 'text-orange-600', bg: 'bg-orange-50', angle: 210 },
                { key: 'complaint', label: 'Complaint', Icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', angle: 180 },
                { key: 'ask', label: 'Ask', Icon: MessageCircle, color: 'text-blue-600', bg: 'bg-blue-50', angle: 150 },
              ].map(({ key, label, Icon, color, bg, angle }) => {
                const radius = 98;
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;
                return (
                  <button
                    key={key}
                    onClick={() => handleAction(key)}
                    className="pointer-events-auto absolute left-1/2 bottom-[6px] -translate-x-1/2 flex flex-col items-center"
                    style={{ transform: `translate(-50%, 0) translate(${x}px, ${-Math.abs(y)}px)` }}
                  >
                    <div className={`w-12 h-12 rounded-2xl ${bg} border border-gray-200 shadow-md flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                    <span className="mt-1 text-[11px] font-semibold text-gray-800 drop-shadow-sm">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default MobileBottomNav;


