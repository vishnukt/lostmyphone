import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>LostMyPhone</h1>
        <p className="tagline">No phone? No problem. Access your contacts anytime.</p>
      </header>
      <main className="App-main">
        <div className="coming-soon-container">
          <h2>Coming Soon</h2>
          <p>We're building something amazing to help you access your important contacts when you need them most.</p>
          <div className="features">
            <div className="feature" role="button" tabIndex="0" aria-label="Secure storage">
              <h3>🔒 Secure</h3>
              <p>Your contacts are safe and encrypted</p>
            </div>
            <div className="feature" role="button" tabIndex="0" aria-label="Easy access">
              <h3>📱 Easy Access</h3>
              <p>Access your contacts from any device</p>
            </div>
            <div className="feature" role="button" tabIndex="0" aria-label="Limited contacts">
              <h3>👥 Limited Contacts</h3>
              <p>Store only your most important numbers</p>
            </div>
          </div>
          <div className="mobile-cta">
            <p>Optimized for mobile devices - access on the go!</p>
          </div>
        </div>
      </main>
      <footer className="App-footer">
        <p>© 2024 LostMyPhone. All rights reserved.</p>
        <p className="mobile-note">Perfect for emergency access on any device</p>
      </footer>
    </div>
  );
}

export default App;
