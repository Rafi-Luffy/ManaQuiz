# ManaQuiz

A modern, intelligent quiz generation platform that transforms your study materials into personalized practice exams. Built with React, TypeScript, and advanced analytics for comprehensive learning assessment.

## 🎯 Features

### Smart Content Processing
- **Multi-format Support**: PDF, Word documents, text files, and markdown
- **Intelligent Question Extraction**: AI-powered content analysis from uploaded materials
- **Automatic Categorization**: Smart subject detection and classification
- **Difficulty Assessment**: Automated easy/medium/hard question classification

### Comprehensive Question Bank
- **800+ Predefined Questions** across 4 major technical domains
- **Data Structures & Algorithms**: Arrays, linked lists, trees, graphs, sorting (200 questions)
- **Cloud Computing**: AWS, Azure, DevOps, containerization, microservices (200 questions)
- **Programming Concepts**: OOP, functional programming, design patterns, best practices (200 questions)
- **Advanced Algorithms**: Dynamic programming, graph algorithms, optimization (200 questions)

### Advanced Exam Engine
- **Customizable Exams**: Configure question count, time limits, difficulty levels
- **Smart Question Selection**: Category-based filtering with intelligent randomization
- **Real-time Progress Tracking**: Live timer, question navigation, auto-save functionality
- **Multiple Exam Modes**: Timed exams, practice mode, category-focused assessments

### Comprehensive Analytics Dashboard
- **Performance Metrics**: Detailed score tracking, accuracy analysis, time management
- **Progress Visualization**: Interactive charts, trend analysis, improvement tracking
- **Achievement System**: Unlockable badges, learning streaks, milestone rewards
- **Detailed Reports**: Exportable analytics, category breakdowns, recommendation engine

### Modern User Experience
- **Responsive Design**: Mobile-first approach, seamless experience across all devices
- **Dark Mode Support**: Automatic theme switching with user preference memory
- **Accessibility**: Full screen reader support, keyboard navigation, high contrast modes
- **Progressive Web App**: Offline capabilities, local storage, fast loading

## 🚀 Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Frontend Framework | React | 18.2.0 | Component-based UI development |
| Language | TypeScript | 5.0+ | Type-safe development |
| Styling | Tailwind CSS | 3.3+ | Utility-first CSS framework |
| State Management | Zustand | 4.4+ | Lightweight state management |
| Routing | React Router | 6.15+ | Client-side routing |
| File Processing | React Dropzone | 14.2+ | Drag-and-drop file uploads |
| Charts & Analytics | Recharts | 2.8+ | Data visualization |
| Icons | Lucide React | Latest | Modern icon library |
| Build Tool | Vite | 5.0+ | Fast development and building |
| Package Manager | npm | 9.0+ | Dependency management |

## 📋 Prerequisites

Before running ManaQuiz, ensure you have:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher
- **Git**: For version control
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Rafi-Luffy/ManaQuiz.git
cd ManaQuiz
```

### 2. Navigate to Web Application
```bash
cd apps/web
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open in Browser
Navigate to `http://localhost:3001` to access the application.

## 🏗️ Project Structure

```
ManaQuiz/
├── apps/web/                           # Main React application
│   ├── src/
│   │   ├── components/                 # Reusable UI components
│   │   │   ├── ui/                     # Base UI components
│   │   │   └── layout/                 # Layout components
│   │   ├── pages/                      # Application pages/routes
│   │   │   ├── FileUploadPage.tsx      # File upload and processing
│   │   │   ├── ExamSetupPage.tsx       # Exam configuration
│   │   │   ├── ExamPage.tsx            # Quiz taking interface
│   │   │   ├── ResultsPage.tsx         # Results and analytics
│   │   │   └── DashboardPage.tsx       # Progress dashboard
│   │   ├── store/                      # Zustand state management
│   │   │   ├── examStore.ts            # Exam state and logic
│   │   │   └── progressStore.ts        # Progress tracking
│   │   ├── lib/                        # Utility functions
│   │   │   ├── utils.ts                # General utilities
│   │   │   ├── questionBank.ts         # Sample questions
│   │   │   └── fileProcessing.ts       # File parsing logic
│   │   ├── types/                      # TypeScript definitions
│   │   │   └── index.ts                # Global type definitions
│   │   └── styles/                     # Global styles
│   │       └── globals.css             # Tailwind and custom styles
│   ├── public/                         # Static assets
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── index.html                      # Entry HTML file
│   ├── package.json                    # Dependencies and scripts
│   ├── tailwind.config.js              # Tailwind configuration
│   ├── tsconfig.json                   # TypeScript configuration
│   └── vite.config.ts                  # Vite build configuration
├── .gitignore                          # Git ignore rules
├── README.md                           # Project documentation
└── LICENSE                             # MIT License
```

## 📖 Usage Guide

### 1. Getting Started
1. **Launch Application**: Open ManaQuiz in your browser
2. **Choose Input Method**: Upload files or use sample question bank
3. **Configure Exam**: Set preferences for your quiz session
4. **Take Quiz**: Complete questions at your own pace
5. **Review Results**: Analyze performance and track progress

### 2. File Upload Process
- **Supported Formats**: PDF, DOCX, TXT, MD files
- **Maximum Size**: 10MB per file
- **Processing**: Automatic question extraction and categorization
- **Quality Control**: Duplicate detection and content validation

### 3. Exam Configuration
- **Categories**: Select from technical domains or upload-based categories
- **Difficulty Levels**: Easy, Medium, Hard, or Mixed
- **Question Count**: 5 to 50 questions per exam
- **Time Limits**: 5 minutes to 2 hours, or untimed practice mode

### 4. Taking Exams
- **Navigation**: Previous/Next buttons with question overview
- **Auto-save**: Automatic answer saving every 30 seconds
- **Timer**: Real-time countdown with visual indicators
- **Review**: Flag questions for review before submission

### 5. Results Analysis
- **Immediate Feedback**: Instant scoring and performance metrics
- **Detailed Breakdown**: Category-wise performance analysis
- **Recommendations**: Personalized study suggestions
- **Export Options**: Download results as Excel or PDF reports

## 📊 Analytics Features

### Performance Metrics
- **Accuracy Tracking**: Overall and category-specific success rates
- **Time Analysis**: Question-by-question timing and efficiency
- **Difficulty Progression**: Performance across difficulty levels
- **Improvement Trends**: Historical progress visualization

### Achievement System
- **Learning Streaks**: Consecutive days of practice
- **Score Milestones**: Accuracy-based achievements
- **Category Mastery**: Subject-specific expertise badges
- **Speed Achievements**: Time-based performance rewards

### Progress Dashboard
- **Visual Analytics**: Interactive charts and graphs
- **Recent Activity**: Latest quiz attempts and scores
- **Study Recommendations**: AI-powered learning suggestions
- **Goal Tracking**: Personal learning objective monitoring

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Code formatting
npm run format
```

## 🤝 Contributing

We welcome contributions to ManaQuiz! Please follow these guidelines:

1. **Fork the Repository**: Create your own copy for development
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: Use conventional commit messages
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**: Describe your changes and their benefits

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions:

1. **GitHub Issues**: Report bugs and request features
2. **Documentation**: Check this README and inline code comments

---

**ManaQuiz** - Transforming learning through intelligent assessment technology.

Built with ❤️ by [Rafi-Luffy](https://github.com/Rafi-Luffy)

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

## 🚀 Deployment

This is a **100% client-side application** - perfect for GitHub Pages!

### GitHub Pages (Recommended)

#### **Automatic Deployment**
1. Fork this repository on GitHub
2. Enable **GitHub Pages** in repository settings
3. Set **Source** to "GitHub Actions"
4. Push to `main` branch - automatic deployment will start!

#### **Manual Deployment**
```bash
# Clone and build
git clone https://github.com/your-username/manaquiz.git
cd manaquiz
npm install && cd apps/web && npm install
npm run build

# Deploy the apps/web/dist/ folder to your hosting service
```

### **Why GitHub Pages is Perfect**
- ✅ **Free hosting** for static sites
- ✅ **Automatic SSL** certificate
- ✅ **CDN distribution** via GitHub infrastructure  
- ✅ **No backend required** - pure client-side app
- ✅ **Version control** integrated deployment

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
