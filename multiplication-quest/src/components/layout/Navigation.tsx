interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  studentName: string;
}

export default function Navigation({ currentView, onNavigate, studentName }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'study', label: 'Study Guide', icon: '📚' },
    { id: 'practice', label: 'Practice', icon: '✏️' },
    { id: 'test', label: 'Test', icon: '📝' },
    { id: 'adventure', label: 'Adventure', icon: '🎮' },
    { id: 'parent', label: 'Parent', icon: '👨‍👩‍👧' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-tertiary rounded-full flex items-center justify-center text-2xl">
              ✖️
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Multiplication Quest</h1>
              <p className="text-sm text-gray-600">Welcome, {studentName}!</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-button font-medium transition-all ${
                  currentView === item.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <span className="text-2xl">☰</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex overflow-x-auto gap-2 mt-4 pb-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-button font-medium text-sm transition-all ${
                currentView === item.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
