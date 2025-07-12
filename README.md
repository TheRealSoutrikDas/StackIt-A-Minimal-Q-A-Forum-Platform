# StackIt-A-Minimal-Q-A-Forum-Platform
StackIt is a minimal question-and-answer platform that supports collaborative  learning and structured knowledge sharing. It’s designed to be simple, user-friendly,  and focused on the core experience of asking and answering questions within a  community.
StackIt is a modern web app built with [Next.js 14](https://nextjs.org/) using the App Router, TypeScript, TailwindCSS, and Quill.js for rich text editing. It provides a clean interface for content creation and includes a responsive dashboard with metric cards.

---
# Probelm statement
StackIt – A Minimal Q&A Forum Platform 
## Overview 
StackIt is a minimal question-and-answer platform that supports collaborative 
learning and structured knowledge sharing. It’s designed to be simple, user-friendly, 
and focused on the core experience of asking and answering questions within a 
community. 

## Team : Team 0849
---

## 🚀 Features

- ✅ **Next.js 14 (App Router)**
- 🎨 **TailwindCSS** for styling
- 💡 **TypeScript** for type safety
- 🖋️ **Quill.js** integration for rich text editing
- 📊 **Dashboard UI** with Lucide icons
- 📁 Clean `src/` structure with `@/*` alias support

---

## 📂 Project Structure

```bash
stackit/
├── public/
├── src/
│   ├── app/               # App router pages
│   ├── components/        # Reusable UI components
│   │   ├── StackIt.tsx    # Quill editor component
│   │   └── StatsOverview.tsx
│   ├── styles/            # Tailwind/global styles
│   └── lib/               # Utility functions (optional)
├── tailwind.config.ts
├── tsconfig.json
└── README.md
````

---

## 🧰 Tech Stack

| Tool              | Purpose                   |
| ----------------- | ------------------------- |
| Next.js           | React framework           |
| TypeScript        | Static typing             |
| TailwindCSS       | Utility-first CSS         |
| React Quill       | WYSIWYG editor            |
| Lucide React      | Feather-like icon library |
| ESLint & Prettier | Linting and formatting    |

---

## 🛠️ Setup Instructions

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/stackit.git
   cd stackit
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Visit**

   ```
   http://localhost:3000
   ```

---

## 📦 Installing Dependencies (Manually if Needed)

If not already installed, run:

```bash
npm install react-quill lucide-react
```

And import Quill’s styles in `src/app/globals.css` or `layout.tsx`:

```ts
import 'react-quill/dist/quill.snow.css';
```

---

## 📋 Components

### 🖋️ StackIt Editor

A Quill-based WYSIWYG editor component that:

* Loads and saves content from `localStorage`
* Uses the "snow" theme

### 📊 StatsOverview

A Tailwind + Lucide-react-based card UI displaying:

* Total Users
* Questions
* More (extensible)

---

## 🧪 Future Enhancements

* ✅ Auth integration
* 📝 Markdown support/export
* 📁 Backend API / database storage
* 🖼️ File/image upload support

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

