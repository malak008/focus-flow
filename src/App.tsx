import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import bg from "./assets/bg.png";
import bg2 from "./assets/bg2.png";
import break1 from "./assets/break1.png";
import break3 from "./assets/break3.png";
import close from "./assets/close.png";
import restart from "./assets/restart.png";
import minimize from "./assets/minimize.png";
import start from "./assets/start.png";
import work from "./assets/work.png";
import work2 from "./assets/work2.png";
import task from "./assets/tasks.png";


function App() {
  const [timeLeft, setTimeLeft] = useState(25*60);
  const [isRunning, setIsRunning] = useState(false);
  const [breakButtonImage, setBreakButtonImage] = useState(break1);
  const [taskButtonImage, setTaskButtonImage] = useState(task);
  const [workButtonImage, setWorkButtonImage] = useState(work);
  const [isBreak, setIsBreak] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const [image, setImage] = useState(start);

  // tasks consts
  const [tasks, setTasks] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [showTasks, setShowTasks] = useState(false);
  const [newTask, setNewTask] = useState("");
  

  const encouragementText = [
    "Keep going, you'll crush this",
    "Let's get this done!",
    "Focus now, reward later",
    "Small steps gradually add up",
    "Push through it, you got it",
    "Steady progress!",
    "Eyes on task",
    "Almost done with this part!",
    "You are doing amazing!!!"
  ];

    const breakMessages = [
      "Hydration is key",
      "Relax, you earned it!",
      "Clear your mind",
      "Snacks?!! :D",
      "Walk around!",
      "Breathe some fresh air",
      "Grab some water",
      "Stretch a bit"

    ];
// message updater for enc

useEffect(() => {
  let messageIntreval: NodeJS.Timeout;

  if (isRunning) {
    const messages = isBreak ? breakMessages : encouragementText;
    setEncouragement(messages[0]);
    let index = 1


    messageIntreval = setInterval(() => {
      setEncouragement(messages[index]);
      index = (index + 1) % messages.length;
    }, 9000);
  } else {
    setEncouragement("");
}


return () => clearInterval(messageIntreval);
}, [isRunning, isBreak])
// timer
  useEffect( () => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0 ) {
      timer = setInterval( () => {
        setTimeLeft(prev => prev - 1 );
      }, 1000);
    }
    return() => clearInterval(timer);
  }, [isRunning, timeLeft]);
  

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode);
    setIsRunning(false);
    setBreakButtonImage(breakMode ? break3 : break1);
    setWorkButtonImage(breakMode ? work2 : work);
    setTimeLeft(breakMode ? 5 * 60 : 25 * 60);
  }
  

  const  handleClick = () => {
    if (!isRunning) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setTimeLeft(isBreak ? 5 * 60 : 25*60);
    }
  }
    // tasks functions

const addTask = () => {
  if (newTask.trim() === "") return;
  setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
  setNewTask("");
};  // closes here

const removeTask = (id: number) => {
  setTasks(tasks.filter(task => task.id !== id));
};

const toggleTask = (id: number) => {
  setTasks(tasks.map(task => task.id === id ? {...task, done: !task.done} : task));
};




const handleCloseClick = () => {
  
  console.log("close clicked");
  console.log("electronAPI:", window.electronAPI);
  if (window.electronAPI?.closeApp) {
    window.electronAPI.closeApp();
  } else {
    console.warn("Electron API not available");
  }
}


const containerClass = `home-container ${isRunning ? "bg1" : ""}`;
  return (
    <div className={containerClass} style={{ position: 'relative' }}>
      {/* <div> */}
<button 
  onClick={() => {

    window.electronAPI?.closeApp();
  }}
  style={{ 
    position: 'fixed', 
    top: 10, 
    right: 10, 
    zIndex: 99999,
    width: '40px',
    height: '40px',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  }}
>
  <img src={close} alt="Close" style={{ width: '100%' }} />
</button>
      {/* </div> */}

      <div className="home-content">
        <div className="home-controls">
          <button className="image-button" onClick={ () => switchMode(false)}>
            <img src={workButtonImage} alt="Work" />
          </button>
          <button className="image-button" onClick={ () => switchMode(true)}>
            <img src={breakButtonImage} alt="Break" />

          </button>
          <button className="image-button" onClick={() => setShowTasks(!showTasks)}>
            <img src={taskButtonImage} alt="Task"/>
          </button>
        </div>
        {showTasks && (
  <div className="task-panel">
    <div className="task-input-row">
      <input
        className="task-input"
        type="text"
        placeholder="Add a task..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />
      <button className="task-add-btn" onClick={addTask}>+</button>
    </div>
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id} className="task-item">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleTask(task.id)}
          />
          <span style={{ textDecoration: task.done ? "line-through" : "none" }}>
            {task.text}
          </span>
          <button className="task-remove-btn" onClick={() => removeTask(task.id)}>✕</button>
        </li>
      ))}
    </ul>
  </div>
)}
        <div className="frosted-box">

        
        <p className={`encouragement-text ${!isRunning ? "hidden" : ""}`}>
          { encouragement }
        </p>
        </div>
     
        <div className="frosted-box">
        <h1 className="home-timer">{formatTime(timeLeft)}</h1>
        </div>
        <button className="home-button" onClick={handleClick}>
          <img src={start} alt="Start" />
        

        </button>
      


      </div>
    </div>
  );

}


export default App;