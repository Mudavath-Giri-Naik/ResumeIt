# ResumeIt - AI-Powered Resume Editor

A modern landing page for ResumeIt, built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. Inspired by Aceternity UI design principles.

## Features

- 🎨 Modern, clean design with minimal UI
- 📱 Fully responsive layout
- ⚡ Smooth animations with Framer Motion
- 🎯 Clear call-to-actions throughout
- 💼 Resume-focused landing page with all key sections

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Navigation.tsx      # Top navigation bar
│   ├── AnnouncementBanner.tsx
│   ├── HeroSection.tsx     # Main hero section
│   ├── ProductPreview.tsx  # Product mockup
│   ├── HowItWorks.tsx      # 4-step process
│   ├── KeyFeatures.tsx     # Feature cards
│   ├── Differentiation.tsx # vs competitors
│   ├── UseCases.tsx
│   ├── PricingPreview.tsx
│   ├── FinalCTA.tsx
│   └── Footer.tsx
└── lib/
    └── utils.ts            # Utility functions
```

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Aceternity UI patterns** - Design inspiration

## Build for Production

```bash
npm run build
npm start
```

## License

MIT

