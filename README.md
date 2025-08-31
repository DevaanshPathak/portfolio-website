# Devaansh Pathak - Portfolio Website

A modern, programmer-themed portfolio website showcasing my Python development skills and projects. Built with Next.js and featuring a terminal-inspired design, Git-style timeline, and interactive 3D elements.

🌐 **Live Site**: [View Portfolio](https://your-domain.com)

## ✨ Features

### 🎨 Programmer-Themed Design
- **Terminal Hero**: Interactive terminal window with command-line interface styling
- **CLI-Style Buttons**: Monospace font buttons with backdrop blur effects
- **Grid Background**: Subtle code-editor-inspired background pattern with scanlines
- **Git Timeline**: Education section styled as `git log` output with commit hashes

### 🚀 Interactive Elements
- **3D Scene**: Optional Three.js keyboard and monitor (toggle-able)
- **Dark/Light Mode**: Seamless theme switching
- **Live GitHub Activity**: Real-time commit feed from GitHub API
- **Responsive Design**: Mobile-first approach with smooth animations

### 📊 Dynamic Content
- **Featured Projects**: Automatic GitHub repository cards with languages and stars
- **Recent Activity**: Live GitHub commit timeline
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

## 🎨 Design System

### Color Palette
- **Primary**: Cyan-teal (#164e63) - brand color
- **Secondary**: Rose (#be123c) - accent color  
- **Background**: Dynamic light/dark with subtle patterns
- **Terminal**: Emerald green text on dark background

### Typography
- **Body**: Manrope (clean, modern sans-serif)
- **Code/Terminal**: Geist Mono (monospace for CLI elements)
- **Buttons**: Monospace styling for programmer aesthetic

### Components
- **Buttons**: CLI-styled with backdrop blur and monospace font
- **Cards**: Subtle borders with programmer-friendly hover effects
- **Timeline**: Git commit-style layout with hashes and branch indicators

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

### Disable 3D Effects
Set the 3D toggle to OFF by default in `components/three-toggle.tsx` for better performance on low-end devices.

### Modify Timeline Style
Edit `components/education.tsx` to customize the Git-style timeline appearance.

### Add More Sections
Create new components and import them in `app/page.tsx` following the existing pattern.

### Theme Colors
Modify CSS variables in `app/globals.css` for custom color schemes.

## 🐛 Troubleshooting

### Common Issues

1. **3D Scene Not Loading**
   - Ensure browser supports WebGL
   - Check browser console for Three.js errors
   - Use fallback terminal view

2. **GitHub API Rate Limits**
   - Add `GITHUB_TOKEN` environment variable
   - Rate limits reset hourly

3. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Clean install: `rm -rf node_modules package-lock.json && npm install`

## 📝 License

MIT License - feel free to use this as a template for your own portfolio!

## 🤝 Contributing

Issues and pull requests welcome! This is a personal portfolio but improvements to the template are appreciated.

---

**Built with ❤️ by Devaansh Pathak** | [GitHub](https://github.com/DevaanshPathak) | [LinkedIn](https://linkedin.com/in/your-profile)
