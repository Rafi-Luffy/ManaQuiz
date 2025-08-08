# 📚 ManaQuiz - Smart Quiz Generator

[![Deploy Status](https://github.com/your-username/manaquiz/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/your-username/manaquiz/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

A modern, intelligent quiz generation platform that transforms your study materials into interactive practice tests. Built with React, TypeScript, and powered by advanced text processing algorithms.

## ✨ Features

### 🎯 **Smart Content Processing**
- **Multi-format Support**: Upload PDF, DOCX, DOC, TXT, or Markdown files
- **Intelligent Question Extraction**: Advanced parsing algorithms identify questions, options, and answers
- **Content Analysis**: Automatic categorization and difficulty assessment
- **Fallback Generation**: Smart fallback questions when content parsing is challenging

### 🧠 **Advanced Quiz Engine**
- **Flexible Configuration**: Choose question count, time limits, and difficulty levels
- **Multiple Modes**: Timed exams or relaxed practice sessions  
- **Progress Tracking**: Real-time progress indicators and question navigation
- **Smart Review**: Mark questions for review and navigate seamlessly

### 📊 **Comprehensive Analytics**
- **Detailed Results**: Score breakdowns, category analysis, and performance insights
- **Export Capabilities**: Download results as Excel reports with detailed analytics
- **Historical Tracking**: Built-in result storage and progress monitoring
- **Performance Metrics**: Time analysis, accuracy rates, and improvement tracking

### 🔒 **Privacy & Security**
- **100% Client-Side Processing**: All data processing happens in your browser
- **Zero Data Collection**: No personal information sent to external servers
- **Offline Capable**: Works without internet connection once loaded
- **Secure by Design**: Your files never leave your device

## 🚀 Live Demo

**[Try ManaQuiz Now →](https://your-username.github.io/manaquiz)**

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend Framework | 18.2.0 |
| **TypeScript** | Type Safety | 5.2+ |
| **Vite** | Build Tool & Dev Server | 4.5+ |
| **Tailwind CSS** | Styling & UI Components | 3.3+ |
| **Zustand** | State Management | 4.4+ |
| **React Router** | Client-side Routing | 6.8+ |
| **Lucide React** | Modern Icon Library | 0.263+ |
| **React Hook Form** | Form Handling | 7.45+ |
| **React Hot Toast** | Toast Notifications | 2.4+ |

## 📋 Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/manaquiz.git
   cd manaquiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd apps/web && npm install
   ```

3. **Start development server** 
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3001
   ```

### Production Build

```bash
npm run build
```

The built files will be in `apps/web/dist/`

## 🎮 Usage Guide

### 1. **Upload Your Files**
- Drag and drop or click to select study materials
- Supports: PDF, DOCX, DOC, TXT, MD (up to 10MB each)
- Multiple files can be processed simultaneously

### 2. **Configure Your Quiz**
- **Questions**: Choose 5-50 questions from available content
- **Time Limit**: Set custom durations or practice without time pressure  
- **Difficulty**: Filter by Easy, Medium, Hard, or Mixed levels
- **Mode**: Timed exam simulation or relaxed practice mode

### 3. **Take the Quiz**
- **Navigate**: Use question palette or next/previous buttons
- **Mark for Review**: Flag questions you want to revisit
- **Save Answers**: Automatic saving with manual save option
- **Time Management**: Live countdown with progress indicators

### 4. **Review Results**
- **Comprehensive Analytics**: Score, percentage, time taken
- **Category Breakdown**: Performance analysis by subject areas
- **Question Review**: See correct answers and explanations
- **Export Reports**: Download detailed Excel reports
- **Share Results**: Copy results to clipboard for sharing

## 🗂️ Project Structure

```
manaquiz/
├── 📁 .github/workflows/     # GitHub Actions CI/CD
├── 📁 apps/web/             # Main React application
│   ├── 📁 src/
│   │   ├── 📁 components/   # Reusable UI components
│   │   ├── 📁 pages/        # Route-based page components
│   │   ├── 📁 store/        # Zustand state management
│   │   ├── 📁 lib/          # Utility functions & processors
│   │   └── 📁 styles/       # Global styles and themes
│   ├── 📄 package.json      # Web app dependencies
│   ├── 📄 vite.config.ts    # Vite configuration
│   └── 📄 tailwind.config.js # Tailwind CSS config
├── 📄 package.json          # Root package configuration
├── 📄 README.md             # Project documentation
├── 📄 netlify.toml          # Netlify deployment config
├── 📄 vercel.json           # Vercel deployment config
└── 📄 .gitignore            # Git ignore patterns
```

## 🚀 Deployment

### GitHub Pages (Recommended)
1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. GitHub Actions will automatically deploy on push to main

### Netlify
1. Connect your GitHub repository to Netlify
2. Build settings are automatically detected from `netlify.toml`
3. Deploy with one click

### Vercel  
1. Import project from GitHub to Vercel
2. Configuration is automatically detected from `vercel.json`
3. Deploy instantly with zero configuration

## 🧪 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint code analysis |
| `npm run type-check` | Run TypeScript type checking |
| `npm run clean` | Clean all dependencies and builds |

### Code Quality
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Automatic code formatting on save
- **TypeScript**: Strict type checking enabled
- **Husky**: Pre-commit hooks for code quality (optional)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Contribution Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint && npm run type-check`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📋 Roadmap

- [ ] **Real PDF Processing**: Integrate PDF.js for actual PDF text extraction
- [ ] **AI-Powered Questions**: GPT integration for intelligent question generation
- [ ] **Advanced Analytics**: Detailed learning pattern analysis
- [ ] **Mobile App**: React Native mobile application
- [ ] **Collaboration**: Share quizzes with teams and classmates
- [ ] **Cloud Sync**: Optional cloud storage for cross-device access
- [ ] **Voice Support**: Audio-based question reading and answering
- [ ] **Accessibility**: Enhanced WCAG 2.1 compliance

## 🐛 Known Issues

- PDF processing currently uses simulated extraction (real parsing coming soon)
- Large files (>5MB) may take longer to process
- Some complex document layouts may not parse perfectly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework  
- **Lucide** for the beautiful icon library
- **Vite** for the lightning-fast build tool
- **Community Contributors** for feedback and improvements

## 📞 Support

- 📧 **Email**: support@manaquiz.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/manaquiz/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/manaquiz/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/your-username/manaquiz/wiki)

---

<div align="center">

**Made with ❤️ by [Your Name](https://github.com/your-username)**

⭐ **Star this repo if you find it helpful!** ⭐

</div>
