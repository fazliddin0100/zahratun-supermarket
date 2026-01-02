import { Search, Bell, UserCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Qidiruv qismi */}
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Qidiruv..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
        />
      </div>

      {/* Profil va Bildirishnomalar */}
      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-green-600 transition-colors">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>

        <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">Fazliddin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-full text-gray-600">
            <UserCircle size={28} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
