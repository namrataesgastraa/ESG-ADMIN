'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Rss, Folder, LogOut, Tags, History, LayoutGrid } from 'lucide-react';
import { useAppDispatch } from '@/lib/store/hooks';
import { logoutThunk } from '@/lib/store/slices/authSlice';
import Swal from 'sweetalert2';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Case Studies', href: '/case-studies', icon: FileText },
    { name: 'Category', href: '/category', icon: Tags },
    { name: 'Blogs', href: '/blogs', icon: Rss },
    { name: 'Whitepapers Category', href: '/white-paper-category', icon: LayoutGrid },
    { name: 'White papers', href: '/white-paper', icon: Folder },
    { name: 'Logs', href: '/logs', icon: History },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to end your session?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7C3AED',
      confirmButtonText: 'Yes, Logout',
    });

    if (result.isConfirmed) {
      await dispatch(logoutThunk());

      // Show success popup
      await Swal.fire({
        title: 'Success!',
        text: 'You have been logged out.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      router.push('/login');
    }
  };

  return (
    <div className="flex h-screen bg-[#F6F7F8] overflow-hidden font-raleway text-astraa-dark">
      {/* SIDEBAR */}
      <aside className="w-[250px] bg-astraa-dark text-white flex flex-col shrink-0 border-r border-white/5">
        <div className="h-[80px] flex items-center justify-center px-6 border-b border-white/15">
          <img
            src="./logo.gif"
            className="h-10 w-auto max-w-full object-contain opacity-95 hover:opacity-100 transition-opacity"
            alt="Astraa Logo"
          />
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition-all
                  
                  ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  
                `}
              >
                <Icon size={17} strokeWidth={2} />

                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        {/* <div className="px-6 py-5 border-t border-white/5 bg-black/20">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Delivery Phase</p>

          <p className="text-[12px] text-gray-500 mt-1">System v1.0.4 • Secure</p>
        </div> */}
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Astraa Intelligence
            </span>
          </div>

          {/* USER / LOGOUT */}
          <button
            onClick={handleLogout}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all text-[12px] font-semibold"
          >
            <LogOut size={15} />
            Logout
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
