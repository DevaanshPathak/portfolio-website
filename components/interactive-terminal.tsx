"use client"

"use client"

import { useState, useRef, useEffect } from "react"
import { siteConfig } from "@/lib/config"

type TerminalLine = {
  type: "command" | "output" | "error"
  content: string
}

const COMMANDS = {
  help: "Available commands: help, clear, ls, pwd, whoami, cat [file], wget [file], echo [text], date, uptime, neofetch, fastfetch, exit",
  pwd: "/home/devaansh/portfolio",
  whoami: siteConfig.name,
  ls: "projects.txt  resume.pdf  skills.txt  contact.txt  about.txt  .env",
  date: () => new Date().toLocaleString(),
  uptime: () => {
    const start = new Date("2024-01-01") // Portfolio creation date
    const now = new Date()
    const days = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return `Portfolio uptime: ${days} days`
  }
}

const FILES = {
  "projects.txt": () => {
    const projects = Array.isArray(siteConfig.pinnedRepos)
      ? siteConfig.pinnedRepos.map((repo, i) => {
          const url = typeof repo === "string" ? repo : repo.url
          const name = typeof repo === "string" ? url.split("/").pop() : repo.label || url.split("/").pop()
          return `${i + 1}. ${name} - ${url}`
        }).join("\n")
      : "No featured projects configured"

    return `Featured Projects:\n${projects}\n\nView all projects at: ${siteConfig.links.github}`
  },
  "skills.txt": () => {
    const skills = ["Python", "FastAPI", "Django", "PostgreSQL", "Docker", "Git", "Linux", "PyTest", "REST APIs", "CI/CD"]
    return `Technical Skills:\n${skills.map(skill => `• ${skill}`).join("\n")}`
  },
  "about.txt": () => {
    return `Name: ${siteConfig.name}\nRole: ${siteConfig.role}\nLocation: ${siteConfig.location}\n\nSummary:\n${siteConfig.summary}`
  },
  "contact.txt": () => {
    return `Contact Information:\n• Email: ${siteConfig.links.email?.replace("mailto:", "")}\n• GitHub: ${siteConfig.links.github}\n• LinkedIn: ${siteConfig.links.linkedin}`
  },
  ".env": () => {
    return `# Portfolio Environment Variables
DEVELOPER_NAME="${siteConfig.name}"
ROLE="Python Developer"
PASSION_LEVEL="Maximum"
COFFEE_CONSUMPTION="High"
DEBUG_MODE="Always"
LEARNING_MODE="Continuous"
COLLABORATION="Open"
HIRING_STATUS="Available"

# Fun stats
COMMITS_THIS_MONTH="42"
BUGS_FIXED="∞"
FEATURES_SHIPPED="Many"`
  },
  "resume.pdf": () => "Error: Cannot display binary file. Use 'wget resume.pdf' to download."
}

export function InteractiveTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: `Welcome to ${siteConfig.name}'s Portfolio Terminal` },
    { type: "output", content: `Type 'help' for available commands` },
  ])
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [terminalSize, setTerminalSize] = useState({ width: 800, height: 320 })
  const [isResizing, setIsResizing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [lines])

  // Window control handlers
  const handleClose = () => setIsVisible(false)
  const handleMinimize = () => setIsMinimized(!isMinimized)
  const handleMaximize = () => {
    if (isMaximized) {
      setTerminalSize({ width: 800, height: 320 })
    } else {
      setTerminalSize({ width: window.innerWidth - 32, height: window.innerHeight - 200 })
    }
    setIsMaximized(!isMaximized)
  }

  // Resize handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = terminalSize.width
    const startHeight = terminalSize.height

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(400, startWidth + (e.clientX - startX))
      const newHeight = Math.max(200, startHeight + (e.clientY - startY))
      setTerminalSize({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  if (!isVisible) {
    return (
      <section className="py-8 border-t bg-muted/30" suppressHydrationWarning>
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Interactive Terminal</h2>
            <button
              onClick={() => setIsVisible(true)}
              className="px-3 py-1 text-sm border rounded-md hover:bg-muted/70 font-mono"
            >
              Reopen Terminal
            </button>
          </div>
        </div>
      </section>
    )
  }

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    // Add command to history
    setHistory(prev => [...prev, trimmedCmd])
    setHistoryIndex(-1)

    // Add command line
    const newLines: TerminalLine[] = [
      { type: "command", content: `$ ${trimmedCmd}` }
    ]

    const [command, ...args] = trimmedCmd.toLowerCase().split(" ")

    switch (command) {
      case "clear":
        setLines([])
        return

      case "help":
        const helpText = `Available Commands:

📁 File Operations:
  ls                    List files and directories
  cat [file]           Display file contents
  wget [file]          Download files

ℹ️  System Info:
  whoami               Show current user
  pwd                  Show current directory
  date                 Show current date/time
  uptime               Show portfolio uptime
  neofetch             Show system information (simple)
  fastfetch            Show detailed system info with logo

🛠️  Utilities:
  echo [text]          Display text
  clear                Clear terminal screen
  help                 Show this help message
  exit                 Exit message

⌨️  Shortcuts:
  Tab                  Auto-complete commands
  ↑/↓                  Command history
  Ctrl+L               Clear screen
  Ctrl+M               Minimize/restore terminal
  Esc                  Exit fullscreen mode

🖱️  Window Controls:
  Red button           Close terminal
  Yellow button        Minimize/restore
  Green button         Maximize/restore
  Bottom-right corner  Resize terminal

Try: cat projects.txt, cat .env, wget resume.pdf`
        newLines.push({ type: "output", content: helpText })
        break

      case "pwd":
        newLines.push({ type: "output", content: COMMANDS.pwd })
        break

      case "whoami":
        newLines.push({ type: "output", content: COMMANDS.whoami })
        break

      case "ls":
        newLines.push({ type: "output", content: COMMANDS.ls })
        break

      case "cat":
        if (args.length === 0) {
          newLines.push({ type: "error", content: "cat: missing file operand" })
        } else {
          const filename = args[0]
          if (filename in FILES) {
            const content = FILES[filename as keyof typeof FILES]()
            newLines.push({ type: "output", content })
          } else {
            newLines.push({ type: "error", content: `cat: ${filename}: No such file or directory` })
          }
        }
        break

      case "wget":
        if (args.length === 0) {
          newLines.push({ type: "error", content: "wget: missing URL" })
        } else if (args[0] === "resume.pdf") {
          newLines.push({ type: "output", content: "Downloading resume.pdf..." })
          newLines.push({ type: "output", content: "✓ resume.pdf saved successfully" })
          // Trigger actual download
          setTimeout(() => {
            const link = document.createElement("a")
            link.href = siteConfig.links.resume
            link.download = "resume.pdf"
            link.click()
          }, 500)
        } else {
          newLines.push({ type: "error", content: `wget: ${args[0]}: File not found` })
        }
        break

      case "echo":
        const text = args.join(" ")
        newLines.push({ type: "output", content: text || "" })
        break

      case "date":
        newLines.push({ type: "output", content: COMMANDS.date() })
        break

      case "uptime":
        newLines.push({ type: "output", content: COMMANDS.uptime() })
        break

      case "neofetch":
        const neofetch = `
┌───────────���──────────────��──────────┐
│  ${siteConfig.name.padEnd(35)} │
├─────────────────────────────────────┤
│ 💻 Role: ${siteConfig.role.padEnd(25)} │
│ 🌍 Location: ${siteConfig.location?.padEnd(21) || "Unknown".padEnd(21)} │
│ 🚀 Tech: Python, FastAPI, Django   │
│ 📧 Contact: Available via terminal  │
│ 🔗 GitHub: DevaanshPathak          │
└─────────────────────────────────────┘`
        newLines.push({ type: "output", content: neofetch })
        break

      case "fastfetch":
        const config = siteConfig.fastfetch
        const hostName = config?.host || 'portfolio'
        const username = siteConfig.name.toLowerCase().replace(' ', '')
        const fastfetch = `        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@        ${username}@${hostName}
      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@      ${'─'.repeat(username.length + hostName.length + 1)}
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    OS: ${config?.os || 'Portfolio OS'}
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  Host: ${config?.host || 'devaansh-dev'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Kernel: ${config?.kernel || 'Node.js 20.x'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Uptime: ${config?.uptime || 'Always Online'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Packages: ${config?.packages || 'npm (1337 packages)'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Shell: ${config?.shell || 'bash 5.1.8'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Resolution: ${config?.resolution || 'Responsive'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@DE: ${config?.theme || 'Dark/Light Auto'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@WM: ${config?.icons || 'Lucide React'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Terminal: ${config?.terminal || 'Interactive Web Terminal'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@CPU: ${config?.cpu || 'Python Engine'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@GPU: ${config?.gpu || 'CSS Animations'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Memory: ${config?.memory || 'Optimized for Performance'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Disk (/): ${config?.disk || 'Cloud Storage'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Local IP: ${config?.localip || '127.0.0.1'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Public IP: ${config?.publicip || 'Fly.dev'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Battery: ${config?.battery || 'Powered by Coffee ☕'}
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Locale: ${config?.locale || 'en_US.UTF-8'}
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@      ████ ████ ████ ████ ████ ████ ████ ████
        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@        ████ ████ ████ ████ ████ ████ ████ ████`
        newLines.push({ type: "output", content: fastfetch })
        break

      case "exit":
        newLines.push({ type: "output", content: "Thanks for visiting! 👋" })
        break

      case "sudo":
        newLines.push({ type: "error", content: "Nice try! 😏 This is a portfolio terminal, not a real system." })
        break

      case "rm":
        newLines.push({ type: "error", content: "rm: Operation not permitted. This portfolio is read-only!" })
        break

      case "mv":
      case "cp":
        newLines.push({ type: "error", content: `${command}: Permission denied. Portfolio files are protected.` })
        break

      default:
        newLines.push({ type: "error", content: `Command not found: ${command}. Type 'help' for available commands.` })
    }

    setLines(prev => [...prev, ...newLines])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCommand(input)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= history.length) {
          setHistoryIndex(-1)
          setInput("")
        } else {
          setHistoryIndex(newIndex)
          setInput(history[newIndex])
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Simple tab completion for commands and files
      const commands = ["help", "clear", "ls", "pwd", "whoami", "cat", "wget", "echo", "date", "uptime", "neofetch", "fastfetch", "exit"]
      const files = Object.keys(FILES)
      const allOptions = [...commands, ...files]

      const matches = allOptions.filter(option => option.startsWith(input.toLowerCase()))
      if (matches.length === 1) {
        setInput(matches[0])
      } else if (matches.length > 1) {
        const newLines: TerminalLine[] = [
          { type: "command", content: `$ ${input}` },
          { type: "output", content: matches.join("  ") }
        ]
        setLines(prev => [...prev, ...newLines])
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault()
      setLines([])
      setInput("")
    } else if (e.key === "m" && e.ctrlKey) {
      e.preventDefault()
      handleMinimize()
    } else if (e.key === "Escape") {
      e.preventDefault()
      if (isMaximized) {
        handleMaximize()
      }
    }
  }

  return (
    <section className="py-8 border-t bg-muted/30" suppressHydrationWarning>
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-xl font-semibold mb-4">Interactive Terminal</h2>
        <div
          ref={containerRef}
          className="bg-background border rounded-lg shadow-lg overflow-hidden relative"
          style={{
            width: isMaximized ? '100%' : terminalSize.width,
            maxWidth: '100%'
          }}
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 border-b relative">
            <div className="flex gap-1.5">
              <button
                onClick={handleClose}
                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer"
                title="Close terminal"
              />
              <button
                onClick={handleMinimize}
                className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer"
                title="Minimize terminal"
              />
              <button
                onClick={handleMaximize}
                className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer"
                title="Maximize terminal"
              />
            </div>
            <span className="ml-2 text-sm font-mono text-muted-foreground">
              terminal — bash — {Math.floor(terminalSize.width/10)}×{Math.floor(terminalSize.height/16)}
            </span>
          </div>

          {/* Terminal Content */}
          {!isMinimized && (
            <div
              ref={terminalRef}
              className="overflow-y-auto p-4 font-mono text-sm bg-background/95"
              style={{ height: terminalSize.height }}
              onClick={() => inputRef.current?.focus()}
            >
            {lines.map((line, i) => (
              <div key={i} className={`${
                line.type === "command" 
                  ? "text-emerald-400" 
                  : line.type === "error" 
                    ? "text-red-400" 
                    : "text-foreground/90"
              } whitespace-pre-wrap`}>
                {line.content}
              </div>
            ))}
            
            {/* Input Line */}
            <form onSubmit={handleSubmit} className="flex items-center mt-2">
              <span className="text-emerald-400 mr-2">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-foreground font-mono caret-emerald-400"
                placeholder="Type a command..."
              />
              <span className="animate-pulse text-emerald-400">▍</span>
            </form>
            </div>
          )}

          {/* Resize Handle */}
          {!isMaximized && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute bottom-1 right-1 w-0 h-0 border-l-2 border-b-2 border-muted-foreground" />
              <div className="absolute bottom-0.5 right-0.5 w-0 h-0 border-l-2 border-b-2 border-muted-foreground" />
            </div>
          )}
        </div>
        
        <div className="mt-3 text-sm text-muted-foreground space-y-1">
          <p>
            Try commands: <code className="font-mono bg-muted px-1 rounded">fastfetch</code>,
            <code className="font-mono bg-muted px-1 rounded ml-1">cat projects.txt</code>,
            <code className="font-mono bg-muted px-1 rounded ml-1">wget resume.pdf</code>
          </p>
          <div className="text-xs space-y-1">
            <p>
              ⌨️ <kbd className="font-mono bg-muted px-1 rounded text-xs">Tab</kbd> for completion,
              <kbd className="font-mono bg-muted px-1 rounded text-xs">↑↓</kbd> for history,
              <kbd className="font-mono bg-muted px-1 rounded text-xs">Ctrl+L</kbd> to clear,
              <kbd className="font-mono bg-muted px-1 rounded text-xs">Ctrl+M</kbd> to minimize
            </p>
            <p>
              🖱️ Click <span className="inline-block w-2 h-2 rounded-full bg-red-500 mx-1"></span> to close,
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mx-1"></span> to minimize,
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mx-1"></span> to maximize •
              Drag bottom-right corner to resize
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
