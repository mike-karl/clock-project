import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { useEffect, useState} from 'react';
import './App.css';

function App() {
  //manage state here:
  const [ brkLength, setBrkLength ] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerState, setTimerState] = useState('paused');
  const [timerType, setTimerType ] = useState('session');
  const [timer, setTimer] = useState(10);

  // This is the timer logic
  const changeTimerType = (() => {
    if (timerType === 'session') {
      setTimerType('break');
      setTimer(brkLength);
    } else {
      setTimerType('session');
      setTimer(sessionLength);
    }
  }, [timerType, brkLength, sessionLength]);

  useEffect(() => {
    let interval = null;
    if (timerState === 'running' && timer > 0) {
      interval = setInterval(() => {
        setTimer( timer => timer - 1);
      }, 1000);
    } else if (timerState === 'paused' && timer !== 0) {
      clearInterval(interval);
    } else if (timer === 0) {
      changeTimerType();
      console.log('rendered');
    }
    return () => clearInterval(interval);
  }, [timerState, timer, changeTimerType])
  /*When the timerState is 'paused' increments the sessionLength or brkLength 
  depending on which element is clicked by 1 minute. If the timerType is actively displayed 
  the timer time will also increase by 1 min (60 seconds)*/
  function handleTimeIncrement(e) {
    if (timerState === 'paused') {
      if (e.currentTarget.id === 'break-increment') {
        setBrkLength(brkLength + 1);
        if (timerType === 'break') {
          setTimer(timer + 60);
        }
      } else if (e.currentTarget.id === 'session-increment') {
        setSessionLength(sessionLength + 1)
        if (timerType === 'session') {
          setTimer(timer + 60);
        }
      } else {
        return;
      }
    } else {
      return;
    }
}
  /*When the timerState is 'paused' decrements the sessionLength or brkLength 
  depending on which element is clicked by 1 minute. If the timerType is actively displayed 
  the timer time will also decrease by 1 min (60 seconds)*/
  function handleTimeDecrement(e) {
    if (timerState === 'paused') {
      if (e.currentTarget.id === 'break-decrement' && brkLength > 1) {
        setBrkLength(brkLength - 1);
        if (timerType === 'break') {
          setTimer(timer - 60);
        }
      } else if (e.currentTarget.id === 'session-decrement' && sessionLength > 1) {
        setSessionLength(sessionLength - 1)
        if (timerType === 'session') {
          setTimer(timer - 60);
        }
      } else {
        return;
      }
    } else {
      return;
    }
  }
  // resets the timer to initial state.
  function handleReset() {
    setTimerState('paused');
    setBrkLength(5);
    setSessionLength(25);
    setTimerType('session');
    setTimer(1500);
  }
  // this function switches the state of the timer from 'paused' to 'running' or 'running' to 'paused' 
  function handleTimerState() {
    timerState === 'paused' ? setTimerState('running') : setTimerState('paused')
  }

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>
      <div>
        <h2 id="break-label">Break Length</h2>
        <ImArrowUp id="break-increment" onClick={handleTimeIncrement}/> 
        <div id="break-length">{brkLength}</div>
        <ImArrowDown id="break-decrement" onClick={handleTimeDecrement}/>
      </div>

      <div>
        <h2 id="session-label">Session Length</h2>
        <ImArrowUp id="session-increment" onClick={handleTimeIncrement}/> 
        <div id="session-length">{sessionLength}</div>
        <ImArrowDown id="session-decrement" onClick={handleTimeDecrement}/>
      </div>

      <div>
        <h2 id="timer-label">{timerType}</h2>
        <h2 id="time-left">{timer}</h2>
        <div id="start_stop" onClick={handleTimerState}>
          <FaPlay />
          <FaPause />
        </div >
        <FaRedo id="reset" onClick={handleReset}/>
      </div>

    </div>
  );
}

export default App;
