# React Documentation (react.dev)

React is a JavaScript library for building user interfaces. It lets you build UI from reusable pieces called components and manage how data flows through your application with state and props. React components are JavaScript functions that return markup (JSX), enabling a declarative approach to building interactive web applications.

This repository contains the source code and documentation for react.dev, the official React documentation website. Built with Next.js 15 and React 19, it serves comprehensive guides, tutorials, and API references for React developers. The documentation covers everything from quick start tutorials to advanced patterns like server components, and includes interactive code examples powered by Sandpack.

## useState Hook

The `useState` hook lets you add state variables to functional components. It returns an array with the current state value and a function to update it. State updates trigger re-renders, and React batches multiple state updates for performance.

```jsx
import { useState } from 'react';

function Counter() {
  // Declare state with initial value
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: 'Taylor', age: 42 });

  // Basic state update
  function handleIncrement() {
    setCount(count + 1);
  }

  // Updater function for multiple updates in same event
  function handleIncrementThree() {
    setCount(c => c + 1); // 0 → 1
    setCount(c => c + 1); // 1 → 2
    setCount(c => c + 1); // 2 → 3
  }

  // Updating objects (always replace, never mutate)
  function handleNameChange(newName) {
    setUser({
      ...user,           // Copy existing fields
      name: newName      // Override specific field
    });
  }

  // Lazy initialization for expensive computations
  const [todos, setTodos] = useState(() => createInitialTodos());

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+1</button>
      <button onClick={handleIncrementThree}>+3</button>
      <p>User: {user.name}, {user.age}</p>
      <input value={user.name} onChange={e => handleNameChange(e.target.value)} />
    </div>
  );
}
```

## useEffect Hook

The `useEffect` hook synchronizes components with external systems like APIs, browser DOM, timers, or third-party libraries. It runs after render and accepts a setup function that can return a cleanup function. Dependencies control when the effect re-runs.

```jsx
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [messages, setMessages] = useState([]);

  // Effect with cleanup - runs on mount and when dependencies change
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();

    connection.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Cleanup function runs before re-running or on unmount
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // Re-run when these change

  // Effect that runs only once on mount
  useEffect(() => {
    document.title = `Chat: ${roomId}`;
  }, []); // Empty array = run once

  // Data fetching with race condition handling
  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const response = await fetch(`/api/rooms/${roomId}`);
      const data = await response.json();
      if (!ignore) {
        setMessages(data.messages);
      }
    }

    fetchData();
    return () => { ignore = true; };
  }, [roomId]);

  // Event listener example
  useEffect(() => {
    function handleResize() {
      console.log('Window resized');
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div>{messages.map(m => <p key={m.id}>{m.text}</p>)}</div>;
}
```

## useContext Hook

The `useContext` hook reads and subscribes to context, enabling data sharing across components without prop drilling. Create context with `createContext`, provide values with a context provider, and consume values with `useContext`.

```jsx
import { createContext, useContext, useState } from 'react';

// Create contexts
const ThemeContext = createContext('light');
const UserContext = createContext(null);

// Provider component that wraps the app
function App() {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState({ name: 'Alice', role: 'admin' });

  return (
    <ThemeContext value={theme}>
      <UserContext value={{ user, setUser }}>
        <Header />
        <Main />
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          Toggle Theme
        </button>
      </UserContext>
    </ThemeContext>
  );
}

// Consumer components
function Header() {
  const theme = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  return (
    <header className={`header-${theme}`}>
      Welcome, {user.name}!
    </header>
  );
}

function Main() {
  const theme = useContext(ThemeContext);

  return (
    <main className={`main-${theme}`}>
      <LoginButton />
    </main>
  );
}

function LoginButton() {
  const { user, setUser } = useContext(UserContext);

  if (user) {
    return <button onClick={() => setUser(null)}>Log out</button>;
  }
  return <button onClick={() => setUser({ name: 'Guest' })}>Log in</button>;
}
```

## useRef Hook

The `useRef` hook creates a mutable reference that persists across renders without causing re-renders when changed. It's commonly used to reference DOM elements or store values that don't affect visual output.

```jsx
import { useRef, useState, useEffect } from 'react';

function VideoPlayer({ src }) {
  // DOM element reference
  const videoRef = useRef(null);

  // Mutable value that persists across renders
  const intervalRef = useRef(null);
  const renderCount = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Track renders without causing re-renders
  renderCount.current++;

  function handlePlayPause() {
    if (isPlaying) {
      videoRef.current.pause();
      clearInterval(intervalRef.current);
    } else {
      videoRef.current.play();
      intervalRef.current = setInterval(() => {
        setCurrentTime(videoRef.current.currentTime);
      }, 1000);
    }
    setIsPlaying(!isPlaying);
  }

  // Focus input on mount
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div>
      <video ref={videoRef} src={src} />
      <button onClick={handlePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <p>Time: {currentTime.toFixed(1)}s</p>
      <p>Render count: {renderCount.current}</p>
      <input ref={inputRef} placeholder="Auto-focused" />
    </div>
  );
}
```

## useMemo Hook

The `useMemo` hook caches expensive calculations between re-renders. It only recalculates when dependencies change, improving performance for computationally intensive operations.

```jsx
import { useMemo, useState } from 'react';

function ProductList({ products, filterText, sortBy }) {
  // Cache expensive filtering and sorting
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products
      .filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, filterText, sortBy]);

  // Cache object to prevent unnecessary re-renders of child components
  const chartData = useMemo(() => ({
    labels: filteredProducts.map(p => p.name),
    values: filteredProducts.map(p => p.price),
  }), [filteredProducts]);

  // Cache callback for context optimization
  const contextValue = useMemo(() => ({
    products: filteredProducts,
    total: filteredProducts.reduce((sum, p) => sum + p.price, 0),
  }), [filteredProducts]);

  return (
    <div>
      <p>Showing {filteredProducts.length} products</p>
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      <Chart data={chartData} />
    </div>
  );
}
```

## useCallback Hook

The `useCallback` hook caches function definitions between re-renders. It's useful when passing callbacks to optimized child components that rely on reference equality.

```jsx
import { useCallback, useState, memo } from 'react';

// Memoized child component - only re-renders when props change
const ExpensiveList = memo(function ExpensiveList({ items, onItemClick }) {
  console.log('ExpensiveList rendered');
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});

function ShoppingCart({ items }) {
  const [selectedId, setSelectedId] = useState(null);
  const [theme, setTheme] = useState('light');

  // Without useCallback, this function is recreated every render
  // causing ExpensiveList to re-render even when only theme changes
  const handleItemClick = useCallback((id) => {
    setSelectedId(id);
    console.log('Selected:', id);
  }, []); // No dependencies - function never changes

  // Callback with dependencies
  const handleSubmit = useCallback((formData) => {
    submitOrder(formData, selectedId);
  }, [selectedId]); // Recreated when selectedId changes

  return (
    <div className={theme}>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
      <ExpensiveList items={items} onItemClick={handleItemClick} />
      <OrderForm onSubmit={handleSubmit} />
    </div>
  );
}
```

## useReducer Hook

The `useReducer` hook manages complex state logic with a reducer function. It's ideal when state updates depend on previous state or when multiple sub-values are updated together.

```jsx
import { useReducer } from 'react';

// Reducer function - pure function that returns new state
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added':
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    case 'changed':
      return tasks.map(t =>
        t.id === action.task.id ? action.task : t
      );
    case 'deleted':
      return tasks.filter(t => t.id !== action.id);
    default:
      throw Error('Unknown action: ' + action.type);
  }
}

function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  const [text, setText] = useState('');

  function handleAddTask() {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text
    });
    setText('');
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddTask}>Add</button>
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}

const initialTasks = [
  { id: 0, text: 'Buy groceries', done: true },
  { id: 1, text: 'Walk the dog', done: false }
];
let nextId = 2;
```

## createRoot API

The `createRoot` function from `react-dom/client` creates a root for rendering React components into the DOM. It's the entry point for React 18+ applications.

```jsx
import { createRoot } from 'react-dom/client';
import App from './App';

// Basic usage - render app into DOM node
const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<App />);

// With strict mode for development checks
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Error handling options
const root = createRoot(domNode, {
  onUncaughtError: (error, errorInfo) => {
    console.error('Uncaught error:', error);
    console.log('Component stack:', errorInfo.componentStack);
    // Send to error reporting service
  },
  onCaughtError: (error, errorInfo) => {
    console.warn('Error caught by boundary:', error);
  },
  onRecoverableError: (error) => {
    console.log('Recovered from:', error);
  }
});
root.render(<App />);

// Unmounting (rare, for cleanup)
root.unmount();

// Multiple roots on same page (for gradual migration)
const headerRoot = createRoot(document.getElementById('header'));
headerRoot.render(<Header />);

const mainRoot = createRoot(document.getElementById('main'));
mainRoot.render(<MainContent />);
```

## Component Composition with Props

React components receive data through props and can render children passed to them. This enables flexible, reusable component patterns.

```jsx
// Basic props
function Greeting({ name, age, isAdmin = false }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Age: {age}</p>
      {isAdmin && <span className="badge">Admin</span>}
    </div>
  );
}

// Children prop for composition
function Card({ title, children }) {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// Render props pattern
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return render(position);
}

// Usage
function App() {
  return (
    <div>
      <Greeting name="Alice" age={28} isAdmin />

      <Card title="Welcome">
        <p>This is the card content.</p>
        <button>Click me</button>
      </Card>

      <MouseTracker render={({ x, y }) => (
        <p>Mouse position: {x}, {y}</p>
      )} />
    </div>
  );
}
```

## Event Handling

React handles events with camelCase naming and passes event handler functions rather than strings. Events are synthetic wrappers around native browser events.

```jsx
function EventExamples() {
  const [inputValue, setInputValue] = useState('');

  // Basic click handler
  function handleClick(event) {
    console.log('Button clicked');
    console.log('Event type:', event.type);
  }

  // Passing arguments to handlers
  function handleItemClick(itemId, event) {
    console.log('Clicked item:', itemId);
    event.stopPropagation(); // Prevent bubbling
  }

  // Form handling
  function handleSubmit(event) {
    event.preventDefault(); // Prevent page reload
    console.log('Form submitted with:', inputValue);
  }

  // Input change handler
  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  return (
    <div>
      {/* Click events */}
      <button onClick={handleClick}>Click me</button>
      <button onClick={(e) => handleItemClick(42, e)}>Item 42</button>

      {/* Form events */}
      <form onSubmit={handleSubmit}>
        <input
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => console.log('Focused')}
          onBlur={() => console.log('Blurred')}
        />
        <button type="submit">Submit</button>
      </form>

      {/* Keyboard events */}
      <input
        onKeyDown={(e) => {
          if (e.key === 'Enter') console.log('Enter pressed');
        }}
      />

      {/* Mouse events */}
      <div
        onMouseEnter={() => console.log('Mouse entered')}
        onMouseLeave={() => console.log('Mouse left')}
      >
        Hover over me
      </div>
    </div>
  );
}
```

## Conditional Rendering and Lists

React uses JavaScript expressions for conditional rendering and array methods for rendering lists. Each list item needs a unique `key` prop.

```jsx
function ConditionalAndListExamples({ user, items, isLoading, error }) {
  // Early return pattern
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <div>
      {/* Ternary for if-else */}
      {user ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <p>Please log in</p>
      )}

      {/* && for conditional display */}
      {user?.isAdmin && <AdminPanel />}

      {/* Rendering lists with map */}
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>

      {/* Filtered and transformed lists */}
      <ul>
        {items
          .filter(item => item.inStock)
          .map(item => (
            <li key={item.id}>
              <strong>{item.name}</strong>
              {item.onSale && <span className="sale">Sale!</span>}
            </li>
          ))}
      </ul>

      {/* Empty state handling */}
      {items.length === 0 ? (
        <p>No items found</p>
      ) : (
        <ItemList items={items} />
      )}
    </div>
  );
}
```

## Custom Hooks

Custom hooks let you extract and reuse stateful logic across components. They must start with "use" and can call other hooks.

```jsx
import { useState, useEffect, useCallback } from 'react';

// Custom hook for fetching data
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Custom hook for local storage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key]);

  return [storedValue, setValue];
}

// Custom hook for window size
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const { width } = useWindowSize();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading user</p>;

  return (
    <div className={theme}>
      <h1>{user.name}</h1>
      <p>Window width: {width}px</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}
```

## Summary

React provides a declarative, component-based approach to building user interfaces. The core hooks (`useState`, `useEffect`, `useContext`, `useRef`, `useMemo`, `useCallback`, `useReducer`) handle state management, side effects, and performance optimization. Components communicate through props and context, while custom hooks enable reusable stateful logic.

The main integration patterns include: using `createRoot` to mount React apps into the DOM, composing components with props and children, managing complex state with reducers and context, and optimizing performance with memoization. React's unidirectional data flow and immutable state updates make applications predictable and easier to debug. For production applications, consider using a React framework like Next.js, Remix, or Gatsby that provides routing, server rendering, and build optimization out of the box.
