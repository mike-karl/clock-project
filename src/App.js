import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import soundFile from './breakTime.mp3'; 
import './App.css';

function App() {
  //initialize state here:
  const [brkLength, setBrkLength ] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerType, setTimerType] = useState('session');
  const [timerState, setTimerState] = useState('paused');
  const [timer, setTimer] = useState(25 * 60);
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  // initialize useRef hook for audio beep
  const beep = useRef(null);

  /* This is the timer logic. The timer accounts for drift and changes 
  the interval based on the previous runs drift. This means the timer 
  will always lag slightly behind in miliseconds but the drift will 
  never get out of control, thus makaing the timer far more accurate.*/
 
  useEffect(() => {

    /* Function used in the useEffect hook to change the timer type
   and set the timer to the length of the selected timerType (break or session).*/
   const changeTimerType = () => { 
   if (timerType === 'session') {
      setTimerType('break');
      setTimer(brkLength * 60);
    } else {
      setTimerType('session');
      setTimer(sessionLength * 60);
    }
  }
    console.log('rendered');
    let interval = null;
    if (timerState === 'running' && timer > 0) {
      if (startTime === null) {
        setStartTime(Date.now());
        setTotalTime(Date.now());
      } else {
      interval = setInterval(() => {
        setTotalTime(t => t + 1000 );
        setTimer( timer => timer - 1);
      }, 1000 - (Date.now() - totalTime)); 
    }
    } else if (timerState === 'paused' && timer !== 0) {
      clearInterval(interval);
      setStartTime(null);
    } else if (timerState === 'running' && timer === 0) {
      clearInterval(interval);
      setStartTime(null);
      beep.current.play();
      // creates pause effect for timer, also stops and rewinds audio after 1 second of playing;
      let pause = setTimeout(() => {
        changeTimerType();
        beep.current.pause();
        beep.current.load();
        console.log(timerType);
      }, 1000);
      return () => clearTimeout(pause);
    } 
    return () => clearInterval(interval);
  }, [timerState, timer, timerType, startTime, totalTime, brkLength, sessionLength]);

  /*When the timerState is 'paused' increments the sessionLength or brkLength 
  depending on which element is clicked by 1 minute. If the timerType is actively displayed 
  the timer time will be set to the new break/session length */
  function handleTimeIncrement(e) {
    if (timerState === 'paused') {
      if (e.currentTarget.id === 'break-increment' && brkLength < 60) {
        setBrkLength(prevLength => prevLength + 1);
        if (timerType === 'break') {
          setTimer((brkLength + 1) * 60);
        }
      } else if (e.currentTarget.id === 'session-increment'  && sessionLength < 60) {
        setSessionLength(prevLength => prevLength + 1);
        if (timerType === 'session') {
          setTimer((sessionLength + 1) * 60);
        }
      }
    } 
}

  /*When the timerState is 'paused' decrements the sessionLength or brkLength 
  depending on which element is clicked by 1 minute. If the timerType is actively displayed 
  the timer time will be set to the new break/session length */
  function handleTimeDecrement(e) {
    if (timerState === 'paused') {
      if (e.currentTarget.id === 'break-decrement' && brkLength > 1) {
        setBrkLength(prevLength => prevLength - 1);
        if (timerType === 'break') {
          setTimer((brkLength - 1) * 60);
        }
      } else if (e.currentTarget.id === 'session-decrement' && sessionLength > 1) {
        setSessionLength(prevLength => prevLength - 1)
        if (timerType === 'session') {
          setTimer((sessionLength - 1) * 60);
        }
      } 
    } 
  }
  // resets the timer to initial state.
  function handleReset() {
    setTimer(1500);
    setTimerState('paused');
    setBrkLength(5);
    setSessionLength(25);
    setTimerType('session');
    beep.current.pause();
    beep.current.load();
  }

  // this function switches the state of the timer from 'paused' to 'running' or 'running' to 'paused' 
   function handleTimerState() {
    if (timerState === 'paused') {
      setTimerState('running')
      console.log(timerState);
     } else if (timerState === 'running'){
       setTimerState('paused')
       console.log(timerState);
     }
  }
    /*this function formats the timer(in seconds) to display as mm:ss */
    const timerFormat = (time) => {
      let minutes = Math.floor(timer / 60);
      let seconds = time - minutes * 60;
      let formattedTime;
      console.log(seconds);
      if (minutes < 10) {
      seconds >= 10 ? formattedTime = '0' + minutes + ':' + seconds : formattedTime = '0' + minutes + ':0' + seconds;
        return formattedTime;
      } else {
        seconds >= 10 ? formattedTime = minutes + ':' + seconds : formattedTime = minutes + ':0' + seconds;
        return formattedTime;
      }
    } 
  

  return (
    <div className="App">
      <h1 className='title'>25 + 5 Clock</h1>
      <div className='breakControls'>
        <h2 className='break-item' id="break-label">Break Length</h2>
        <div className='break-item button' id="break-increment" onClick={handleTimeIncrement}>
          <ImArrowUp /> 
        </div>
        <div className='break-item' id="break-length">{brkLength}</div>
        <div className='break-item button' id="break-decrement" onClick={handleTimeDecrement}>
          <ImArrowDown />
        </div>
      </div>

      <div className='sessionControls'>
        <h2 className='session-item' id="session-label">Session Length</h2>
        <div className='session-item button' id="session-increment" onClick={handleTimeIncrement}>
          <ImArrowUp /> 
        </div>
        <div className='session-item' id="session-length" >{sessionLength}</div>
        <div className='session-item button' id="session-decrement" onClick={handleTimeDecrement}>
          <ImArrowDown />
        </div>
      </div>
      <div className='timerDisplay'>
        <h2 className='timer-item' id="timer-label">{timerType}</h2>
        <div className='timer-item' id='time-left-container'>
          <h2  id="time-left" style={timer === 0 ? {color: "#FF6663"} : {color: "#BFD7EA"}}>{timerFormat(timer)}</h2>
        </div>
        <audio id='beep' ref={beep} src={soundFile} type="audio/mpeg"></audio>
        <div className='timer-item button' id="start_stop" onClick={handleTimerState}>
          <FaPlay />
          <FaPause />
        </div >
        <div className='timer-item button' id="reset" onClick={handleReset}>
          <FaRedo />
        </div>
      </div>

    </div>
  );
}

export default App;
