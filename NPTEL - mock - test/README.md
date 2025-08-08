# 🎯 ManaQuiz - Intelligent Quiz Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

> **Transform your study materials into interactive quizzes with AI-powered question generation**

ManaQuiz is a modern, responsive web application that intelligently converts your PDF, Word, and text documents into comprehensive multiple-choice quizzes. Perfect for students, educators, and professionals looking to create effective practice tests.

## ✨ Key Features

### 🚀 **Smart File Processing**
- **Multi-format Support**: Upload PDF, DOCX, DOC, TXT, and MD files
- **AI Question Generation**: Automatically extract and generate questions from your content
- **Intelligent Parsing**: Advanced content understanding with multiple language support
- **Fallback System**: Sample questions when content processing isn't possible

### 📚 **Flexible Quiz Configuration**  
- **Customizable Length**: Choose from 10 to 150+ questions
- **Difficulty Levels**: Easy, Medium, Hard, or Mixed complexity
- **Two Test Modes**: 
  - ⏱️ **Timed Simulation**: Realistic exam conditions with countdown timer
  - 🎯 **Practice Mode**: Unlimited time for thorough learning
- **Smart Recommendations**: Duration suggestions based on question count

### 🎮 **Enhanced Exam Experience**
- **Intuitive Navigation**: Question palette with visual status indicators
- **Mark for Review**: Flag questions for later consideration  
- **Save & Continue**: Persist answers throughout the session
- **Real-time Progress**: Track completion status and time remaining
- **Auto-submit**: Automatic submission when time expires

### 📊 **Comprehensive Analytics**
- **Detailed Scoring**: Percentage scores with performance levels
- **Category Analysis**: Breakdown by topic and difficulty
- **Question Review**: Detailed explanations for all answers
- **Excel Export**: Professional reports with dual worksheets
- **Result History**: Previous quiz attempts and progress tracking

### 🎨 **Modern User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Themes**: System preference or manual toggle
- **Smooth Animations**: Polished transitions and interactions
- **Accessibility**: WCAG compliant with keyboard navigation
- **Progressive Web App**: Works offline once loaded

## 🖥️ Live Demo

**Application URL**: [http://localhost:3001](http://localhost:3001)

### Quick Start Demo:
1. Visit the homepage and click "Use Sample Questions"
2. Configure your quiz (25 questions, mixed difficulty recommended)
3. Choose between timed simulation or practice mode
4. Experience the full exam simulation
5. View comprehensive results and download reports

## 🛠️ Technical Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend Framework | 18.2.0 |
| **TypeScript** | Type Safety | 5.0+ |
| **Vite** | Build Tool & Dev Server | 4.5+ |
| **Tailwind CSS** | Styling & Design System | 3.3+ |
| **Zustand** | State Management | 4.4+ |
| **React Router** | Client-side Routing | 6.8+ |
| **React Hook Form** | Form Management | 7.4+ |
| **Lucide React** | Icon Library | 0.263+ |
| **React Hot Toast** | Notifications | 2.4+ |

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser with JavaScript enabled

### Quick Setup
```bash
# Clone the repository
git clone <repository-url>
cd manaQuiz

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3001
```

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run type-check # TypeScript compilation check
```

## 📁 Project Structure

```
manaQuiz/
├── apps/web/                   # Main application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── Layout.tsx      # App layout with navigation
│   │   ├── lib/               # Utility libraries
│   │   │   ├── fileProcessor.ts           # File parsing & question extraction
│   │   │   ├── advancedQuestionGenerator.ts # AI question generation
│   │   │   └── utils.ts                   # Helper functions
│   │   ├── pages/             # Route components
│   │   │   ├── HomePage.tsx              # Landing page
│   │   │   ├── FileUploadPage.tsx        # File upload interface
│   │   │   ├── ExamSetupPage.tsx         # Quiz configuration
│   │   │   ├── ExamPage.tsx              # Exam taking interface
│   │   │   └── ResultsPage.tsx           # Results & analytics
│   │   ├── store/             # State management
│   │   │   └── examStore.ts    # Zustand store for exam state
│   │   ├── index.css          # Global styles & Tailwind
│   │   └── App.tsx            # Root component
│   ├── public/                # Static assets
│   └── package.json           # Dependencies & scripts
├── docs/                      # Documentation
├── tests/                     # Testing files
└── README.md                  # This file
```

## 🔧 Configuration Options

### Environment Variables
```bash
# Optional API keys for enhanced features
VITE_WORDNIK_API_KEY=your_wordnik_key
VITE_DATAMUSE_API_KEY=your_datamuse_key
```

### Customization
- **Question Bank**: Modify `src/lib/fileProcessor.ts` to add default questions
- **Themes**: Extend `src/index.css` for custom color schemes  
- **Difficulty Logic**: Adjust `determineDifficulty()` function for better classification
- **Timer Settings**: Configure duration limits in `ExamSetupPage.tsx`

## 📖 Usage Guide

### 1. **Upload Study Materials**
- Click "Upload Files" or drag-and-drop your documents
- Supported formats: PDF, DOCX, DOC, TXT, MD
- Maximum file size: 10MB per file
- AI processes content and extracts questions

### 2. **Configure Your Quiz**
- Set subject name and quiz parameters
- Choose number of questions (10, 25, 50, 75, 100+)
- Select difficulty level (Easy, Medium, Hard, Mixed)
- Pick quiz mode (Timed simulation or Practice mode)

### 3. **Take the Quiz**
- Experience realistic exam conditions
- Use the question palette for navigation
- Mark questions for review with visual indicators
- Track time with the countdown timer (timed mode)
- Save answers and navigate freely

### 4. **Analyze Results**
- View comprehensive performance analytics
- Review correct/incorrect answers with explanations
- Download detailed Excel reports
- Share your achievements
- Access result history for progress tracking

## 🧪 Testing

### Manual Testing Checklist
- [x] **File Upload**: PDF, DOCX, TXT file processing
- [x] **Quiz Setup**: All configuration options
- [x] **Exam Taking**: Navigation, timing, answer saving
- [x] **Results**: Scoring, filtering, Excel export
- [x] **Responsive**: Mobile, tablet, desktop layouts
- [x] **Themes**: Light, dark, system preference
- [x] **Persistence**: Local storage, page refresh handling

### Automated Testing
```bash
# Run test suite (when available)
npm run test

# Run E2E tests (when available)  
npm run test:e2e
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled, proper typing required
- **ESLint**: Follow the configured rules
- **Prettier**: Code formatting enforced
- **Conventional Commits**: Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the beautiful design system
- **Lucide** for the comprehensive icon library
- **React Community** for the excellent ecosystem
- **TypeScript Team** for type safety and developer experience

## 🔗 Links

- **Documentation**: [View Docs](./docs/)
- **Issue Tracker**: [Report Bugs](https://github.com/your-repo/issues)
- **Discussions**: [Community Forum](https://github.com/your-repo/discussions)
- **Changelog**: [Release Notes](./CHANGELOG.md)

---

<div align="center">

**Built with ❤️ by the ManaQuiz Team**

[⭐ Star this repo](https://github.com/your-repo) • [🐛 Report Bug](https://github.com/your-repo/issues) • [💡 Request Feature](https://github.com/your-repo/issues)

</div>

```
nptel-exam-generator/
├── apps/
│   └── web/                    # Main React application
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── pages/          # Page components
│       │   ├── lib/            # Utilities and helpers
│       │   └── store/          # State management
│       ├── public/             # Static assets
│       └── package.json
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── file-processor/         # File processing utilities
│   └── exam-engine/            # Exam logic and algorithms
├── package.json                # Root package.json
├── turbo.json                  # Turborepo configuration
└── README.md
```

## 🛠️ Tech Stack

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Development

Built with:
- React + TypeScript
- Vite (build tool)
- Tailwind CSS
- Zustand (state management)

## File Structure

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd manaquiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
# Build all packages
npm run build

# Preview production build
npm run preview
```

## 📖 Usage Guide

### 1. Upload Study Materials
- Click "Upload Files" or drag-and-drop your study materials
- Supported formats: PDF, DOCX, DOC, TXT, MD
- Maximum file size: 10MB per file

### 2. Configure Your Quiz
- Set subject name and quiz parameters
- Choose number of questions (10, 25, 50, 75, 100)
- Select difficulty level (Easy, Medium, Hard, Mixed)
- Pick quiz mode (Timed simulation or Practice mode)

### 3. Take the Quiz
- Experience realistic exam conditions
- Use the question palette for smooth navigation
- Mark questions for review
- Track time with the countdown timer

### 4. Analyze Results
- View comprehensive performance analytics
- Review correct/incorrect answers with explanations
- Download detailed reports
- Share your achievements

## 🔧 Development

### Project Structure

```
apps/web/src/
├── components/
│   ├── Layout.tsx              # Main layout component
│   └── ...                     # Other components
├── pages/
│   ├── HomePage.tsx            # Landing page
│   ├── FileUploadPage.tsx      # File upload interface
│   ├── ExamSetupPage.tsx       # Exam configuration
│   ├── ExamPage.tsx            # Exam interface
│   └── ResultsPage.tsx         # Results and analytics
├── lib/
│   ├── utils.ts                # Utility functions
│   └── fileProcessor.ts        # File processing logic
├── store/
│   └── examStore.ts            # Zustand store
└── styles/
    └── index.css               # Global styles
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Type checking
npm run format           # Format with Prettier

# Monorepo Management
npm run clean            # Clean all build artifacts
turbo run build          # Build all packages
turbo run dev            # Run all dev servers
```

### Adding New Features

1. **Create components** in `apps/web/src/components/`
2. **Add pages** in `apps/web/src/pages/`
3. **Update routing** in `apps/web/src/App.tsx`
4. **Manage state** using Zustand store
5. **Style with Tailwind** CSS classes

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Write tests for new features
- Ensure responsive design
- Maintain accessibility standards

## 📋 Roadmap

### Phase 1 ✅
- [x] Basic file upload and processing
- [x] Question generation from text content
- [x] Exam simulation interface
- [x] Results and analytics
- [x] Responsive design

### Phase 2 🚧
- [ ] Advanced AI question generation
- [ ] PDF/Word parsing improvements
- [ ] Offline functionality
- [ ] Performance optimizations
- [ ] Advanced analytics

### Phase 3 📅
- [ ] Collaborative features
- [ ] Custom question banks
- [ ] Advanced AI models
- [ ] Mobile app version
- [ ] Integration with NPTEL platform

## 🐛 Known Issues

- PDF parsing may not work with all PDF formats
- Complex mathematical equations might not be processed correctly
- Some Word document styles may not be preserved

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NPTEL for inspiring this educational tool
- Open source community for amazing libraries
- Contributors and beta testers
- Students who provided feedback

## 📞 Support

- 📧 Email: support@nptel-exam-generator.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)
- 📚 Documentation: [Wiki](https://github.com/your-repo/wiki)

---

**Made with ❤️ for NPTEL students worldwide**

*Transform your study materials into comprehensive mock exams and ace your NPTEL certification!*
