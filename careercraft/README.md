# CareerCraft 🛠️🎓🚀

**CareerCraft** is an interactive, gamified career path discovery web application inspired by the viral gameplay mechanics of *Infinite Craft*. It turns educational planning, skill acquisition, and professional growth into a playful, addictive exploration game.

Users can combine basic elements (like *Logic*, *Mathematics*, and *Curiosity*) to unlock skills, academic subjects, college degrees, professional experiences, and certifications, eventually "crafting" their path toward their dream careers.

---

## 🌟 Key Features

### 1. Infinite Crafting Workspace
*   **Infinite Canvas**: Pan across an endless workspace and arrange elements freely.
*   **Smooth Drag-and-Drop**: Built using custom HTML5 Pointer Event listeners for fluid, low-latency dragging on both desktop and mobile devices.
*   **Collision Merging**: Drag one card onto another; if they overlap, they combine with a nice merge animation.
*   **Interactive Card Controls**:
    *   **Double-click** any card to clone/duplicate it.
    *   **Close (X) button** to quickly clear individual cards.
*   **Zoom Controls**: Smoothly zoom in, zoom out, and reset view (0.5x to 2.0x support with automatic pointer tracking).

### 2. Left Sidebar (The Collection)
*   **Starter Elements**: Begin with 10 fundamental blocks: *Mathematics*, *Logic*, *Curiosity*, *Business*, *Science*, *Writing*, *Creativity*, *Finance*, *Computers*, and *People*.
*   **Category Filters**: Filter your library by *Skills*, *Academic Subjects*, *Degrees*, *Experiences*, *Certifications*, and *Careers*.
*   **Favorites Tab**: Star cards to pin them in a separate favorites tab.
*   **Search**: Find unlocked elements instantly.

### 3. Right Sidebar (Dream Job Mode)
*   **Profession Checklists**: Select a career (e.g., *Software Engineer*, *Data Scientist*, *Aerospace Engineer*, *Quant Researcher*, *Doctor*, *Robotics Engineer*, *Investment Banker*, *Entrepreneur*) to view its checklist.
*   **Requirements Classification**:
    *   🔴 **Mandatory Requirements**: Realistic essentials (e.g., *DSA*, *Programming*).
    *   🟡 **Recommended Skills**: Improving your chances significantly (e.g., *Internships*, *Open Source*).
    *   🟢 **Bonus / Advantages**: Enhancements (e.g., *Hackathons*, *Research Papers*).
*   **Dynamic Checklist Sync**: Unlocked elements automatically check off, updating your completion percentage.
*   **Recommended Pathways**: Expandable recipe guides showing you how to craft complex sub-requirements (e.g., `Computers + Physics = Embedded Systems`).

### 4. Reward & Discovery System
*   **New Discoveries**: Crafting a card for the first time reveals a celebratory modal.
*   **First Discovery Worldwide!**: Obscure or custom formulas trigger first discoveries with a shimmering gold layout, spinning globes, and custom spark particle effects.
*   **Rarity Index**: Displays the percentage rarity of elements.

### 5. Smart Dynamic Formula Engine
*   **100+ Static Recipes**: Pre-mapped formulas for all core educational and career goals.
*   **Fallback Generator**: If you combine two obscure elements, the engine dynamically creates a logical hybrid card (e.g. combining `BSc Science` with `Investment` dynamically creates a custom card `Investment-certified BSc Science`), allowing gameplay to remain infinite and rewarding!

---

## 📂 Project Structure

```
careercraft/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryIcon.tsx             # Maps categories to Lucide icons & styling glows
│   │   │   ├── Canvas.tsx                   # Main infinite pan, zoom, and drag workspace
│   │   │   ├── Sidebar.tsx                  # Left sidebar containing collection & search
│   │   │   ├── CareerBlueprintPanel.tsx     # Right sidebar for Dream Job Mode
│   │   │   └── DiscoveryModal.tsx           # Celebration popup for unlocking new cards
│   │   ├── App.tsx                          # App state & combining logic
│   │   ├── main.tsx                         # Entry point
│   │   ├── recipes.ts                       # Static recipes & dynamic formula combiner
│   │   └── index.css                        # Styling: animations, glows, scrollbars
│   ├── index.html                           # SEO meta & titles
│   ├── tailwind.config.js                   # Custom design theme configuration
│   ├── postcss.config.js
│   ├── package.json                         # Node dependencies (Framer Motion, Lucide, Tailwind)
│   └── tsconfig.json                        # TypeScript settings
└── README.md                                # General project documentation
```

---

## 🚀 How to Run Locally

### Prerequisites
*   Node.js (version 20.19+ or 22.12+)
*   npm (version 10+)

### Setup Instructions

1.  Navigate to the frontend directory:
    ```bash
    cd careercraft/frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open the local address in your browser (typically `http://localhost:5173`).

---

## 🛠️ Technology Stack Used
*   **Core**: React (v18), TypeScript, HTML5
*   **Styling**: Vanilla CSS + TailwindCSS (v3.4)
*   **Animations**: Framer Motion (for modal transitions)
*   **Icons**: Lucide React
*   **Bundler**: Vite (v8)
