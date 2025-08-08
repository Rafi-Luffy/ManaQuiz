# ManaQuiz

A modern quiz platform that transforms your study materials into interactive practice tests. Upload documents or use our comprehensive question bank covering programming, algorithms, data structures, and cloud computing.

![ManaQuiz Demo](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=ManaQuiz+Demo)

## ✨ Features

### 📁 Smart File Processing
- **Multi-format Support**: Upload PDF, Word documents, text files, and markdown
- **Intelligent Extraction**: Automatically extracts questions from your study materials
- **Content Analysis**: Smart categorization and difficulty assessment
- **Quality Control**: Removes duplicates and validates question format

### 🎯 Comprehensive Question Bank
- **800+ Ready-to-Use Questions** across major technical domains:
  - **Data Structures & Algorithms** (200 questions): Arrays, linked lists, trees, graphs, sorting
  - **Cloud Computing** (200 questions): AWS, Azure, DevOps, containerization
  - **Programming Concepts** (200 questions): OOP, design patterns, best practices
  - **Advanced Algorithms** (200 questions): Dynamic programming, optimization

### 🚀 Advanced Quiz Engine
- **Flexible Configuration**: Choose question count (5-50), time limits, difficulty levels
- **Multiple Modes**: Timed exams for practice or relaxed study sessions
- **Smart Navigation**: Question palette with review marking and progress tracking
- **Auto-save**: Never lose your progress with automatic answer saving

### 📊 Rich Analytics & Progress Tracking
- **Detailed Results**: Score breakdowns, category analysis, time management insights
- **Progress Dashboard**: Historical performance tracking with interactive charts
- **Achievement System**: Unlockable badges and learning streaks
- **Export Capabilities**: Download detailed reports in Excel format

### 🎨 Modern User Experience
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Dark Mode**: Eye-friendly theme with automatic switching
- **Accessibility**: Screen reader support and keyboard navigation
- **Progressive Web App**: Fast loading with offline capabilities

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend framework | 18.2.0 |
| **TypeScript** | Type-safe development | 5.0+ |
| **Tailwind CSS** | Styling framework | 3.3+ |
| **Zustand** | State management | 4.4+ |
| **Vite** | Build tool | 5.0+ |
| **React Router** | Client-side routing | 6.15+ |
| **Lucide React** | Icon library | Latest |

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/Rafi-Luffy/ManaQuiz.git
cd ManaQuiz

# Navigate to the web app
cd apps/web

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser
# Navigate to http://localhost:3001
```

## 📂 Project Structure

```
ManaQuiz/
├── apps/web/                    # Main React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Application pages
│   │   │   ├── FileUploadPage.tsx    # File upload & processing
│   │   │   ├── ExamSetupPage.tsx     # Quiz configuration
│   │   │   ├── ExamPage.tsx          # Quiz interface
│   │   │   ├── ResultsPage.tsx       # Results & analytics
│   │   │   └── DashboardPage.tsx     # Progress dashboard
│   │   ├── store/               # State management
│   │   │   ├── examStore.ts          # Quiz logic
│   │   │   └── progressStore.ts      # Progress tracking
│   │   ├── lib/                 # Utilities & helpers
│   │   ├── data/                # Question bank
│   │   └── hooks/               # Custom React hooks
│   ├── public/                  # Static assets
│   └── package.json
├── README.md
└── LICENSE
```

## 📖 How to Use

### 1. 📤 Upload Study Materials
- Drag and drop files or click to browse
- Supported formats: PDF, DOCX, TXT, MD
- Maximum file size: 10MB per file
- The system automatically extracts questions

### 2. ⚙️ Configure Your Quiz
- **Subject Selection**: Choose from uploaded content or question bank
- **Question Count**: Select 5-50 questions
- **Difficulty**: Easy, Medium, Hard, or Mixed
- **Time Limit**: Set duration or choose practice mode
- **Categories**: Filter by specific topics

### 3. 📝 Take the Quiz
- **Clean Interface**: Distraction-free exam environment
- **Navigation**: Easy question jumping with progress overview
- **Review System**: Mark questions for later review
- **Auto-save**: Answers saved automatically every 30 seconds
- **Timer**: Visual countdown with alerts

### 4. 📈 Analyze Results
- **Instant Feedback**: Immediate scoring and breakdown
- **Category Analysis**: Performance by topic area
- **Time Analysis**: Question-by-question timing
- **Improvement Tracking**: Historical progress charts
- **Export Options**: Download detailed Excel reports

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript checking
```

### Key Features Implementation

- **File Processing**: Advanced text parsing algorithms
- **Question Generation**: Pattern recognition for Q&A extraction
- **State Management**: Zustand stores for exam and progress data
- **Responsive Design**: Mobile-first Tailwind CSS approach
- **Performance**: Code splitting and lazy loading

## 🚀 Deployment

### GitHub Pages (Recommended)
```bash
# Build the project
npm run build

# Deploy dist/ folder to your hosting service
```

### Other Hosting Options
- **Vercel**: One-click deployment
- **Netlify**: Drag-and-drop deployment
- **AWS S3**: Static website hosting

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Ensure responsive design
- Test across different browsers
- Maintain accessibility standards

## 🐛 Known Issues & Limitations

- PDF parsing may not work with all PDF formats (especially scanned documents)
- Complex mathematical equations might not be processed correctly
- Large files (>10MB) may take longer to process
- Some Word document formatting may not be preserved

## 🔮 Roadmap

### Current Version (v1.0)
- ✅ File upload and processing
- ✅ Question bank with 800+ questions
- ✅ Quiz engine with timer
- ✅ Results and analytics
- ✅ Progress tracking

### Upcoming Features (v1.1)
- [ ] Enhanced AI question generation
- [ ] Improved PDF/Word parsing
- [ ] Collaborative study groups
- [ ] Mobile app version
- [ ] Advanced analytics with ML insights

### Future Plans (v2.0)
- [ ] Multi-language support
- [ ] Video content processing
- [ ] Real-time multiplayer quizzes
- [ ] LMS integration
- [ ] Advanced AI tutoring

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 About the Developer

**Rafi** - Full-stack developer passionate about educational technology and improving learning experiences through innovative tools.

## 📞 Support & Contact

Need help or have questions?

- 📧 **Email**: s.b.m.rafi01@gmail.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Rafi-Luffy/ManaQuiz/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Rafi-Luffy/ManaQuiz/discussions)
- ⭐ **Feature Requests**: [GitHub Issues](https://github.com/Rafi-Luffy/ManaQuiz/issues)

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for utility-first styling
- **Zustand** for lightweight state management
- **Open Source Community** for inspiration and tools
- **Beta Testers** who provided valuable feedback

---

**⭐ If you find ManaQuiz helpful, please consider starring the repository!**

Built with ❤️ by [Rafi-Luffy](https://github.com/Rafi-Luffy) | © 2025 ManaQuiz

## 🤝 Contributing

## Contributing

Feel free to open issues or submit pull requests to improve the project.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

- 📧 Email: s.b.m.rafi01@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Rafi-Luffy/ManaQuiz/issues)

---

Built by [Rafi-Luffy](https://github.com/Rafi-Luffy)
