'use client';
import { useState } from 'react';
import { Play, Save, Copy, Download, Share2, Settings, Code, FileText, Terminal } from 'lucide-react';

export default function CodePlayground() {
  const [activeTab, setActiveTab] = useState('code');
  const [code, setCode] = useState(`// Welcome to DevHub Code Playground
function greet(name) {
  return \`Hello, \${name}! Welcome to DevHub!\`;
}

// Try running this function
console.log(greet('Developer'));

// Add your own code here
const message = "Start coding...";
console.log(message);`);
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');

  const languages = [
    { id: 'javascript', label: 'JavaScript', icon: '🟨' },
    { id: 'python', label: 'Python', icon: '🐍' },
    { id: 'html', label: 'HTML', icon: '🌐' },
    { id: 'css', label: 'CSS', icon: '🎨' },
    { id: 'typescript', label: 'TypeScript', icon: '📘' }
  ];

  const templates = {
    javascript: {
      basic: `// Basic JavaScript Template
function hello(name) {
  return \`Hello, \${name}!\`;
}

console.log(hello("World"));`,
      function: `// Function Example
function calculateArea(width, height) {
  return width * height;
}

const area = calculateArea(10, 5);
console.log(\`Area: \${area}\`);`,
      array: `// Array Methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled);`,
      api: `// API Call Simulation
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}`
    },
    python: {
      basic: `# Basic Python Template
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
      function: `# Function Example
def calculate_area(width, height):
    return width * height

area = calculate_area(10, 5)
print(f"Area: {area}")`,
      list: `# List Comprehension
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(doubled)`,
      class: `# Class Example
class Person:
    def __init__(self, name):
        self.name = name
    
    def greet(self):
        return f"Hello, I'm {self.name}"

person = Person("Alice")
print(person.greet())`
    },
    html: {
      basic: `<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>Welcome to DevHub!</p>
</body>
</html>`,
      form: `<form>
    <label>Name:</label>
    <input type="text" name="name">
    <button type="submit">Submit</button>
</form>`,
      semantic: `<header>
    <nav>
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
        </ul>
    </nav>
</header>
<main>
    <section>
        <h1>Main Content</h1>
    </section>
</main>`
    },
    css: {
      basic: `/* Basic CSS */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
    text-align: center;
}`,
      flexbox: `/* Flexbox Layout */
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.item {
    flex: 1;
    margin: 10px;
    padding: 20px;
    background: #f0f0f0;
}`,
      animation: `/* CSS Animation */
@keyframes slideIn {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.slide-element {
    animation: slideIn 0.5s ease-out;
}`
    },
    typescript: {
      basic: `// TypeScript Basic
interface User {
    name: string;
    age: number;
}

function greet(user: User): string {
    return \`Hello, \${user.name}!\`;
}

const user: User = { name: "Alice", age: 30 };
console.log(greet(user));`,
      class: `// TypeScript Class
class Calculator {
    private result: number = 0;
    
    add(num: number): this {
        this.result += num;
        return this;
    }
    
    multiply(num: number): this {
        this.result *= num;
        return this;
    }
    
    getResult(): number {
        return this.result;
    }
}

const calc = new Calculator();
console.log(calc.add(5).multiply(2).getResult());`
    }
  };

  const runCode = () => {
    try {
      // Simple code execution simulation
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.join(' '));
      };

      // Execute the code (in a real app, this would use a sandbox)
      eval(code);
      
      setOutput(logs.join('\n') || 'Code executed successfully!');
      console.log = originalLog;
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'html' ? 'html' : language === 'css' ? 'css' : 'js'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setOutput('Code copied to clipboard!');
  };

  const shareCode = () => {
    const shareableCode = btoa(code);
    const shareUrl = `${window.location.origin}/playground?code=${shareableCode}&lang=${language}`;
    navigator.clipboard.writeText(shareUrl);
    setOutput('Share link copied to clipboard!');
  };

  const loadTemplate = (templateName) => {
    const template = templates[language]?.[templateName];
    if (template) {
      setCode(template);
      setOutput('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Code Playground</h3>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>
                {lang.icon} {lang.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.keys(templates[language] || {}).map(templateName => (
          <button
            key={templateName}
            onClick={() => loadTemplate(templateName)}
            className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          >
            {templateName.charAt(0).toUpperCase() + templateName.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Code Editor</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={copyCode}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Copy code"
              >
                <Copy className="h-3 w-3 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={saveCode}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Save code"
              >
                <Download className="h-3 w-3 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={shareCode}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Share code"
              >
                <Share2 className="h-3 w-3 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full h-64 p-3 font-mono text-sm rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-700 text-gray-100' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Write your code here..."
              spellCheck={false}
            />
            <div className="absolute top-2 right-2 text-xs text-gray-400">
              {code.split('\n').length} lines
            </div>
          </div>
          <button
            onClick={runCode}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Play className="h-4 w-4" />
            Run Code
          </button>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</span>
          </div>
          <div className={`w-full h-64 p-3 font-mono text-sm rounded border overflow-auto ${
            theme === 'dark' 
              ? 'bg-black border-gray-700 text-green-400' 
              : 'bg-gray-900 border-gray-300 text-green-600'
          }`}>
            <pre className="whitespace-pre-wrap">{output || 'Click "Run Code" to see the output...'}</pre>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{code.length} characters</span>
            </div>
            <div className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              <span>{language}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Quick Tips</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Use the templates to get started quickly</li>
          <li>• Try different languages to compare syntax</li>
          <li>• Share your code with others using the share button</li>
          <li>• Download your code to save it locally</li>
        </ul>
      </div>
    </div>
  );
}
