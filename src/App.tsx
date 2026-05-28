import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import type { User } from './data/mockData';
import './styles/theme.css';

function App() {
  const [activeUser, setActiveUser] = useState<User | null>(null);

  const handleEnterDashboard = (user: User) => {
    setActiveUser(user);
  };

  const handleExitDashboard = () => {
    setActiveUser(null);
  };

  const handleSwitchUser = (user: User) => {
    setActiveUser(user);
  };

  return (
    <>
      {!activeUser ? (
        <LandingPage onEnterDashboard={handleEnterDashboard} />
      ) : (
        <Dashboard 
          activeUser={activeUser} 
          onExit={handleExitDashboard}
          onSwitchUser={handleSwitchUser}
        />
      )}
    </>
  );
}

export default App;
