"use client"

import { useState, useRef, useEffect } from "react"
import { siteConfig } from "@/lib/config"

type TerminalLine = {
  type: "command" | "output" | "error"
  content: string
}

const COMMANDS = {
  help: "Available commands: help, clear, ls, pwd, whoami, cat [file], wget [file], echo [text], date, uptime, neofetch, exit",
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
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [lines])

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
        newLines.push({ type: "output", content: COMMANDS.help })
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
┌─────────────────────────────────────┐
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
    }
  }

  return (
    <section className="py-8 border-t bg-muted/30">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-xl font-semibold mb-4">Interactive Terminal</h2>
        <div className="bg-background border rounded-lg shadow-sm overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 border-b">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-2 text-sm font-mono text-muted-foreground">
              terminal — bash — 80×24
            </span>
          </div>

          {/* Terminal Content */}
          <div 
            ref={terminalRef}
            className="h-80 overflow-y-auto p-4 font-mono text-sm bg-background/95"
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
                autoFocus
              />
              <span className="animate-pulse text-emerald-400">▍</span>
            </form>
          </div>
        </div>
        
        <p className="mt-3 text-sm text-muted-foreground">
          Try commands like: <code className="font-mono bg-muted px-1 rounded">cat projects.txt</code>, <code className="font-mono bg-muted px-1 rounded">wget resume.pdf</code>, or <code className="font-mono bg-muted px-1 rounded">help</code>
        </p>
      </div>
    </section>
  )
}
