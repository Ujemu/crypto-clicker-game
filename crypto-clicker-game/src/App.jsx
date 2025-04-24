import React, { useState } from 'react';
import Login from './components/Login';
import Game from './components/Game';

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {!user ? <Login onLogin={setUser} /> : <Game user={user} />}
    </>
  );
}

export default App;