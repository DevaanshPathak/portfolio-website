# Devaansh Pathak - Portfolio Website

A modern, programmer-themed portfolio website showcasing Python development skills and projects. Built with Next.js and featuring a fully interactive terminal, Git-style timeline, and optional 3D elements.

🌐 **Live Site**: [View Portfolio](https://your-domain.com)

## ✨ Features

### 🖥️ Interactive Terminal
- **Real Commands**: `fastfetch`, `cat projects.txt`, `wget resume.pdf`, `neofetch`, `ls`, `pwd`, etc.
- **GitHub ASCII Art**: Beautiful fastfetch display with system information
- **Tab Completion**: Auto-complete commands and filenames
- **Command History**: Navigate with ↑/↓ arrows
- **Window Controls**: Close (🔴), minimize (🟡), maximize (🟢), and resize
- **Keyboard Shortcuts**: `Ctrl+L` (clear), `Ctrl+M` (minimize), `Esc` (exit fullscreen)

### 🎨 Programmer-Themed Design
- **Terminal Hero**: Interactive terminal window with command-line interface
- **CLI-Style Buttons**: Monospace font buttons with backdrop blur effects
- **Grid Background**: Code-editor-inspired background with subtle scanlines
- **Git Timeline**: Education section styled as `git log --oneline` output
- **Code Aesthetics**: Monospace fonts, terminal colors, developer-friendly UI

### 🚀 Interactive Elements
- **3D Scene**: Optional Three.js keyboard and monitor (toggle-able)
- **Dark/Light Mode**: Seamless theme switching with programmer-friendly colors
- **Live GitHub Activity**: Real-time commit feed from GitHub API
- **Responsive Design**: Mobile-first approach with smooth animations
- **Resizable Terminal**: Drag corners to resize, just like a real application

### 📊 Dynamic Content
- **Featured Projects**: Automatic GitHub repository cards with languages and stars
- **Recent Activity**: Live GitHub commit timeline with formatted dates
- **Skills Showcase**: Technology badges and competencies
- **Education Timeline**: Git-style commit history for educational background

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, React Server Components)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **3D Graphics**: React Three Fiber + drei (optional)
- **Theme**: next-themes for dark/light mode
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone https://github.com/DevaanshPathak/portfolio-website.git
   cd portfolio-website
   npm install
   ```

2. **Configure Your Details**
   ```bash
   # Edit lib/config.ts with your information
   vim lib/config.ts
   ```

3. **Add Your Resume**
   ```bash
   # Place your resume at public/resume.pdf
   cp your-resume.pdf public/resume.pdf
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

## ⚙️ Configuration

### Personal Information (`lib/config.ts`)

```typescript
export const siteConfig = {
  name: "Your Name",
  role: "Your Role", 
  summary: "Your professional summary...",
  githubUsername: "your-github-username",
  
  // Featured repositories (optional)
  pinnedRepos: [
    "https://github.com/username/repo-name",
    { 
      url: "https://github.com/username/special-repo", 
      label: "Custom Name",
      description: "Custom description"
    }
  ],
  
  // Education entries for Git-style timeline
  education: [
    {
      institution: "University Name",
      degree: "Degree Name", 
      start: "2020",
      end: "2024",
      status: "Completed",
      description: "Brief description...",
      highlights: ["Achievement 1", "Achievement 2"]
    }
  ],

  // Fastfetch terminal display configuration
  fastfetch: {
    os: "Portfolio OS",
    host: "your-hostname",
    kernel: "Node.js 20.x",
    uptime: "Always Online",
    packages: "npm (1337 packages)",
    shell: "bash 5.1.8",
    resolution: "Responsive", 
    theme: "Dark/Light Auto",
    icons: "Lucide React",
    terminal: "Interactive Web Terminal",
    cpu: "Python Engine",
    gpu: "CSS Animations",
    memory: "Optimized for Performance",
    disk: "Cloud Storage",
    battery: "Powered by Coffee ☕"
  },
  
  links: {
    github: "https://github.com/username",
    linkedin: "https://linkedin.com/in/username", 
    email: "mailto:your-email@example.com",
    resume: "/resume.pdf"
  }
}
```

### Environment Variables (Optional)

Create `.env.local` for higher GitHub API limits:

```bash
GITHUB_TOKEN=your_github_personal_access_token
```

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx           # Main page composition
│   └── globals.css        # Global styles and CSS variables
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── hero-section.tsx   # Terminal hero with 3D toggle
│   ├── hero-fallback.tsx  # Terminal window fallback
│   ├── hero-3d.tsx        # Interactive 3D scene
│   ├── interactive-terminal.tsx # Full terminal implementation
│   ├── education.tsx      # Git-style education timeline
│   ├── projects-pinned.tsx # Featured project cards
│   ├── activity-snapshot.tsx # GitHub activity feed
│   └── ...               # Other components
├── lib/
│   ├── config.ts          # Site configuration
│   └── utils.ts           # Utility functions
└── public/
    └── resume.pdf         # Your resume file
```

## 🖥️ Terminal Commands

The interactive terminal supports these commands:

### 📁 File Operations
- `ls` - List files and directories
- `cat [file]` - Display file contents (`projects.txt`, `skills.txt`, `about.txt`, `contact.txt`, `.env`)
- `wget [file]` - Download files (`wget resume.pdf` actually downloads your resume)

### ℹ️ System Information  
- `whoami` - Show current user
- `pwd` - Show current directory
- `date` - Show current date/time
- `uptime` - Show portfolio uptime
- `neofetch` - Simple system information
- `fastfetch` - Detailed system info with GitHub ASCII logo

### 🛠️ Utilities
- `echo [text]` - Display text
- `clear` - Clear terminal screen  
- `help` - Show all available commands
- `exit` - Exit message

### ⌨️ Shortcuts & Controls
- **Tab** - Auto-complete commands and files
- **↑/↓** - Browse command history
- **Ctrl+L** - Clear screen
- **Ctrl+M** - Minimize/restore terminal
- **Esc** - Exit fullscreen mode

### 🖱️ Window Controls
- **🔴 Red Button** - Close terminal
- **🟡 Yellow Button** - Minimize/restore
- **🟢 Green Button** - Maximize/restore  
- **Bottom-right corner** - Resize terminal

## 🎨 Design System

### Color Palette
- **Primary**: Cyan-teal (#164e63) - brand color
- **Secondary**: Rose (#be123c) - accent color  
- **Background**: Dynamic light/dark with subtle grid patterns
- **Terminal**: Emerald green text on dark background
- **Accent**: GitHub-style colors for authenticity

### Typography
- **Body**: Manrope (clean, modern sans-serif)
- **Code/Terminal**: Geist Mono (monospace for CLI elements)  
- **Buttons**: Monospace styling for programmer aesthetic
- **Terminal**: Authentic terminal font styling

### Components
- **Buttons**: CLI-styled with backdrop blur and monospace font
- **Cards**: Subtle borders with programmer-friendly hover effects
- **Timeline**: Git commit-style layout with hashes and branch indicators
- **Terminal**: Fully interactive with real terminal UX

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy with default settings

3. **Add Environment Variables** (Optional)
   - In Vercel dashboard: Settings → Environment Variables
   - Add `GITHUB_TOKEN` if needed for API limits

### Custom Domain
Update `siteConfig.seo.url` in `lib/config.ts` with your domain.

## 🔧 Customization

### Terminal Configuration
- Edit `siteConfig.fastfetch` for system information display
- Add new commands in `components/interactive-terminal.tsx`
- Customize file contents in the `FILES` object

### Disable 3D Effects  
Set the 3D toggle to OFF by default in `components/three-toggle.tsx` for better performance.

### Modify Timeline Style
Edit `components/education.tsx` to customize the Git-style timeline appearance.

### Add More Sections
Create new components and import them in `app/page.tsx` following the existing pattern.

### Theme Colors
Modify CSS variables in `app/globals.css` for custom color schemes.

## 🐛 Troubleshooting

### Common Issues

1. **Terminal Not Interactive**
   - Ensure JavaScript is enabled
   - Check browser console for errors
   - Try refreshing the page

2. **3D Scene Not Loading**
   - Ensure browser supports WebGL
   - Check browser console for Three.js errors
   - Use fallback terminal view

3. **GitHub API Rate Limits**
   - Add `GITHUB_TOKEN` environment variable
   - Rate limits reset hourly

4. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Clean install: `rm -rf node_modules package-lock.json && npm install`

5. **Terminal Commands Not Working**
   - Click inside terminal to focus
   - Try typing `help` to see available commands
   - Check browser console for JavaScript errors

## 🎯 Terminal Tips

- Type `fastfetch` to see the impressive GitHub ASCII art display
- Use `cat .env` to see fun environment variables
- Try `wget resume.pdf` to actually download the resume
- Resize the terminal by dragging the bottom-right corner
- Use keyboard shortcuts for faster navigation

## 📝 License

MIT License - feel free to use this as a template for your own portfolio!

## 🤝 Contributing

Issues and pull requests welcome! This is a personal portfolio but improvements to the template are appreciated.

---

**Built with ❤️ by Devaansh Pathak** | [GitHub](https://github.com/DevaanshPathak) | [LinkedIn](https://linkedin.com/in/your-profile)
