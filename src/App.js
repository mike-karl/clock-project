import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { useCallback, useEffect, useState} from 'react';
import './App.css';

function App() {
  //initialize state here:
  const [ brkLength, setBrkLength ] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerState, setTimerState] = useState('paused');
  const [timerType, setTimerType ] = useState('session');
  const [timer, setTimer] = useState(1500);

  /*a callback hook that is used in the useEffect hook to change the timer type
   and set the timer to the length of the selected timerType (break or session).*/
  const changeTimerType = useCallback(() => {
    if (timerType === 'session') {
      setTimerType('break');
      setTimer(brkLength * 60);
    } else {
      setTimerType('session');
      setTimer(sessionLength * 60);
    }
  }, [timerType, brkLength, sessionLength]);
  /*this function formats the timer(in seconds) to display as mm:ss */
  const timerFormat = (timer) => {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    let formattedTime = minutes + ':' + seconds;
    if (minutes < 10) {
    seconds > 10 ? formattedTime = '0' + minutes + ':' + seconds : formattedTime = '0' + minutes + ':0' + seconds;
     return formattedTime;
    } else {
      seconds > 10 ? formattedTime = minutes + ':' + seconds : formattedTime = minutes + ':0' + seconds;
      return formattedTime;
    }
  } 
  /*Variable used to display the timer in mm:ss format. Calls the timerFormat function and passes 
  in the timer state variable which is in seconds and formats it to mm:ss*/
  const timerDisplay = timerFormat(timer);

  // This is the timer logic
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
  the timer time will be set to the new break/session length */
  function handleTimeIncrement(e) {
    if (timerState === 'paused') {
      if (e.currentTarget.id === 'break-increment') {
        setBrkLength(brkLength + 1);
        if (timerType === 'break') {
          setTimer((brkLength + 1) * 60);
        }
      } else if (e.currentTarget.id === 'session-increment') {
        setSessionLength(sessionLength + 1)
        if (timerType === 'session') {
          setTimer((sessionLength + 1) * 60);
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
  the timer time will be set to the new break/session length */
  function handleTimeDecrement(e) {
    if (timerState === 'paused') {
      if (e.currentTarget.id === 'break-decrement' && brkLength > 1) {
        setBrkLength(brkLength - 1);
        if (timerType === 'break') {
          setTimer((brkLength - 1) * 60);
        }
      } else if (e.currentTarget.id === 'session-decrement' && sessionLength > 1) {
        setSessionLength(sessionLength - 1)
        if (timerType === 'session') {
          setTimer((sessionLength - 1) * 60);
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
        <h2 id="time-left">{timerDisplay}</h2>
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
