import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import Testcontainer from './test-container'
import useGlobalStore from '../../global-stores';
import './popup.css';

const Popup = () => {
  const [todos, addTodo] = useGlobalStore(state => [state.todos, state.addTodo]);
  const [text, setText] = useState('');
  return (
    <div className="App">
      <Testcontainer />
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => {
        console.log("adding", text);
        addTodo(text)
      }}>Add todo ---</button>
      <ul>
        {todos.map(todo => <li key={todo}>{todo}</li>)}
      </ul>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/Popup/popup.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React! tetsing 
        </a>
      </header>
    </div>
  );
};

export default Popup;
