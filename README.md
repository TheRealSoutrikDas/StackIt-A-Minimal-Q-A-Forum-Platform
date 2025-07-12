# StackIt - A Minimal Q&A Forum Platform

StackIt is a minimal question-and-answer platform that supports collaborative learning and structured knowledge sharing. It’s designed to be simple, user-friendly, and focused on the core experience of asking and answering questions within a community.
StackIt is a modern web app built with [Next.js 15](https://nextjs.org/) using the App Router, TypeScript, TailwindCSS, and Quill.js for rich text editing. It provides a clean interface for content creation and includes a responsive dashboard with metric cards.

---

# Probelm statement

StackIt – A Minimal Q&A Forum Platform

## Overview

StackIt is a minimal question-and-answer platform that supports collaborative
learning and structured knowledge sharing. It’s designed to be simple, user-friendly,
and focused on the core experience of asking and answering questions within a
community.

## Team : Team 0849


## 🚀 Features

### Core Features
- **Ask Questions**: Create detailed questions with rich text formatting
- **Rich Text Editor**: Full-featured editor with formatting options
- **Tag System**: Organize questions with relevant tags
- **Voting System**: Upvote and downvote questions and answers
- **Answer Management**: Post answers and mark them as accepted
- **Notification System**: Real-time notifications for interactions
- **Search Functionality**: Find questions and answers quickly
- **Responsive Design**: Works seamlessly on all devices

### Rich Text Editor Features
- **Text Formatting**: Bold, Italic, Strikethrough
- **Lists**: Numbered and bullet points
- **Text Alignment**: Left, Center, Right alignment
- **Media Support**: Image uploads and hyperlinks
- **Emoji Support**: Insert emojis in content
- **Clean Interface**: Intuitive toolbar with all formatting options

### User Roles & Permissions
- **Guest**: View all questions and answers
- **User**: Register, log in, post questions/answers, vote
- **Admin**: Moderate content, manage users, platform administration

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Rich Text Editor**: TipTap
- **Icons**: Lucide React
- **UI Components**: Headless UI
- **Package Manager**: pnpm

## 📦 Installation

1. **Clone the repository**
   ```bash
    git clone https://github.com/TheRealSoutrikDas/StackIt-A-Minimal-Q-A-Forum-Platform.git
    cd StackIt-A-Minimal-Q-A-Forum-Platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI components
│   │   ├── Navigation.tsx
│   │   └── QuestionCard.tsx
│   ├── forms/            # Form components
│   │   ├── AskQuestionForm.tsx
│   │   └── TagInput.tsx
│   └── editor/           # Rich text editor
│       └── RichTextEditor.tsx
└── lib/                  # Utilities and types
    └── types/            # TypeScript type definitions
        └── index.ts
```

## 🎯 Key Components

### Navigation Component
- Logo and branding
- Search functionality
- Notification bell with unread count
- User authentication status
- Mobile-responsive menu

### Question Card
- Question title and description
- Tag display
- Vote buttons (upvote/downvote)
- Author information
- Answer count and view count
- Accepted answer indicator

### Rich Text Editor
- TipTap-based editor
- Comprehensive formatting toolbar
- Image and link support
- Emoji insertion
- Text alignment options

### Tag Input
- Multi-select tag interface
- Search and filter functionality
- Tag removal capability
- Maximum tag limit enforcement

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Tailwind CSS
The project uses Tailwind CSS v4 with custom configurations for:
- Custom color schemes
- Responsive design utilities
- Component-specific styles

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Adapted layout with collapsible elements
- **Mobile**: Touch-friendly interface with mobile menu

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize component styles in individual component files

### Components
- All components are modular and reusable
- Props interfaces are well-defined with TypeScript
- Easy to extend and modify functionality

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/TheRealSoutrikDas/StackIt-A-Minimal-Q-A-Forum-Platform/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Roadmap

### Planned Features
- [ ] User authentication system
- [ ] Question detail pages
- [ ] Comment system
- [ ] User profiles
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Question categories
- [ ] User reputation system
- [ ] API endpoints for backend integration

### Future Enhancements
- [ ] Dark mode support
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA)
- [ ] Real-time chat
- [ ] Question bookmarking
- [ ] Advanced analytics

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
