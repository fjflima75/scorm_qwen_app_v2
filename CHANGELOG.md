# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Backend API with FastAPI and PostgreSQL
- User management system with RBAC
- Persistent storage for courses and assets
- File upload and asset management
- Advanced SCORM 2004 support
- Multi-language support
- Course templates library
- Advanced analytics dashboard

## [1.0.0] - 2024-01-15

### Added
- **Course Authoring**
  - Visual course editor with drag & drop
  - 15+ content block types (heading, text, image, video, callout, accordion, cards, timeline, quote, tabs, divider, etc.)
  - Quiz and assessment blocks (multiple choice, true/false, fill in blank, matching, ordering)
  - Course structure management (modules, lessons, pages)
  - Course preview mode
  - Customizable themes (Corporate, Modern, Minimal, Compliance, Training, Interactive)

- **SCORM Engine**
  - SCORM 1.2 package generation
  - Automatic validation of SCORM packages
  - Manifest generation (imsmanifest.xml)
  - SCORM runtime API implementation
  - Zero external dependencies in exported packages
  - Package structure validation

- **Mock LMS**
  - Complete LMS simulator for testing
  - Real-time SCORM API debugger
  - Session tracking and management
  - Student simulation
  - Automated test scenarios (new student, resume, pass, fail, multiple attempts)
  - Progress and score tracking

- **AI Assistant**
  - AI-powered course generation
  - Content generation for individual blocks
  - Quiz question generation
  - Course review and quality analysis
  - Support for Ollama (local) and OpenAI-compatible APIs
  - Privacy guard for external AI providers

- **Enterprise Features**
  - User authentication system
  - Role-based access control (RBAC)
  - Audit logging system
  - Dashboard with system health monitoring
  - Local storage for development
  - Responsive design for all screen sizes

- **Developer Experience**
  - TypeScript for type safety
  - Vite for fast builds
  - Tailwind CSS for styling
  - React Router for navigation
  - Zustand for state management
  - Comprehensive documentation

### Technical Details
- React 18 with hooks
- TypeScript 5.x
- Vite 6.x
- Tailwind CSS 4.x
- React Router 6.x
- Lucide React for icons
- UUID for unique identifiers

### Known Limitations
- Data stored in localStorage (no persistence across devices)
- SCORM export generates structure but not actual ZIP file
- AI features require manual provider configuration
- No backend API (planned for v2.0.0)
- No file upload system (planned for v2.0.0)

## [0.1.0] - 2024-01-01

### Added
- Initial project setup
- Basic React + TypeScript + Vite configuration
- Tailwind CSS integration
- Project structure and documentation

---

## Version History

### Versioning Scheme

This project uses [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backward compatible manner
- **PATCH** version for backward compatible bug fixes

### Release Process

1. Update version in `package.json`
2. Update this CHANGELOG
3. Create a git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub release with release notes

### Categories

Changes are grouped into these categories:

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerability fixes

---

For more information about the project roadmap, see [README.md](README.md#-roadmap).
