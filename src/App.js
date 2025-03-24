import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>LostMyPhone</h1>
        <p className="tagline">Never lose your important contacts again</p>
      </header>
      <main className="App-main">
        <div className="coming-soon-container">
          <h2>Coming Soon</h2>
          <p>We're building something amazing to help you access your important contacts when you need them most.</p>
          <div className="features">
            <div className="feature">
              <h3>🔒 Secure</h3>
              <p>Your contacts are safe and encrypted</p>
            </div>
            <div className="feature">
              <h3>📱 Easy Access</h3>
              <p>Access your contacts from any device</p>
            </div>
            <div className="feature">
              <h3>👥 Limited Contacts</h3>
              <p>Store only your most important numbers</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="App-footer">
        <p>© 2024 LostMyPhone. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
