import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>
      <div>
        <h2 id="break-label">Break Length</h2>
        <ImArrowUp /> 
        <div>this.state.breakLength</div>
        <ImArrowDown />
      </div>

      <div>
        <h2 id="session-label">Session Length</h2>
        <ImArrowUp /> 
        <div>this.state.sessionLength</div>
        <ImArrowDown />
      </div>

      <div>
        <h2 id="timer-label">Session</h2>
        <h2 id="time-left">mm:ss</h2>
        <div id="start_stop">
          <FaPlay />
          <FaPause />
        </div>
        <FaRedo />
      </div>

    </div>
  );
}

export default App;
