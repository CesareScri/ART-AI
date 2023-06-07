import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import ParentComponent from './ParentComponent';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuBar from './MenuBar';
import ChatComponent from './ChatComponent';
import Stability from './Stability';
import Restoration from './Restoration';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 750);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial width

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className={isMobile ? 'myApp mobile' : 'myApp'}>
              {isMobile ? true : <MenuBar />}
              <div className="App">
                <Navbar isMobile={isMobile} />
                <div className="container">
                  <ParentComponent />
                </div>
              </div>
            </div>
          }
        />

    <Route
          path="/chat-gpt"
          element={
            <div className={isMobile ? 'myApp mobile' : 'myApp'}>
              {isMobile ? true : <MenuBar />}
              <div className="App">
                <Navbar isMobile={isMobile} />
                <div className="container">
                  <ChatComponent />
                </div>
              </div>
            </div>
          }
        />

        <Route
          path="/stability-ai"
          element={
            <div className={isMobile ? 'myApp mobile' : 'myApp'}>
              {isMobile ? true : <MenuBar />}
              <div className="App">
                <Navbar isMobile={isMobile} />
                <div className="container">
                  <Stability />
                </div>
              </div>
            </div>
          }
        />

<Route
          path="/res"
          element={
            <div className={isMobile ? 'myApp mobile' : 'myApp'}>
              {isMobile ? true : <MenuBar />}
              <div className="App">
                <Navbar isMobile={isMobile} />
                <div className="container">
                  <Restoration />
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
  
}

export default App;
