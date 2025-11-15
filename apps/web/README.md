# UptimeFlux Web Application

A modern React application built with TypeScript, Vite, and a comprehensive set of libraries for building a full-featured web application.

## 🚀 Tech Stack

### Core
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Vite 7.2.2** - Build tool and dev server
- **Tailwind CSS 3.4.13** - Utility-first CSS framework

### Routing
- **React Router DOM 6.30.2** - Client-side routing

### State Management & Data Fetching
- **Zustand 5.0.8** - Lightweight state management
- **TanStack Query 5.90.9** - Server state management and data fetching

### Forms & Validation
- **React Hook Form 7.66.0** - Performant form library
- **Zod 4.1.12** - TypeScript-first schema validation

### UI Components
- **shadcn/ui** - High-quality component library
- **Lucide React 0.553.0** - Icon library
- **Recharts 3.4.1** - Charting library

### HTTP & Real-time
- **Axios 1.13.2** - HTTP client
- **Socket.io Client 4.8.1** - Real-time communication

### Utilities
- **React Hot Toast 2.6.0** - Toast notifications
- **js-cookie 3.0.5** - Cookie management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── constants/          # Application constants
├── features/           # Feature-based modules
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
│   └── mainLayout.tsx  # Main application layout
├── lib/                # Utility functions and helpers
│   └── utils.ts        # shadcn/ui utility functions
├── pages/              # Page components
│   └── home.tsx        # Home page
├── routes/             # Route configuration
│   └── routes.tsx      # React Router setup
├── styles/             # Global styles
│   └── index.css       # Tailwind CSS and CSS variables
├── App.tsx             # Root component
└── main.tsx            # Application entry point
```

## ⚙️ Configuration

### Path Aliases

The project uses path aliases for cleaner imports:

- `@/*` maps to `./src/*`

Example:
```typescript
import { MainLayout } from '@/layouts/mainLayout'
import { Home } from '@/pages/home'
```

Configuration files:
- `tsconfig.json` - TypeScript path aliases
- `tsconfig.app.json` - Application TypeScript config
- `vite.config.ts` - Vite path alias resolution

### Routing

Routes are configured in `src/routes/routes.tsx` using React Router v6's `createBrowserRouter`.

Current routes:
- `/` - Home page (wrapped in MainLayout)

To add new routes:
```typescript
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: '/about', element: <About /> },
      // Add more routes here
    ],
  },
])
```

### shadcn/ui

shadcn/ui is configured and ready to use. To add components:

```bash
npx shadcn@latest add [component-name]
```

Components will be added to `src/components/ui/`.

## 🛠️ Development

### Prerequisites

- Node.js (v18 or higher)
- pnpm (package manager)

### Installation

```bash
pnpm install
```

### Running the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Linting

```bash
pnpm lint
```

## 🔌 Provider Setup

Some libraries require providers to be set up at the app level. Here's how to configure them:

### TanStack Query Provider

Wrap your app with `QueryClientProvider`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app content */}
    </QueryClientProvider>
  )
}
```

### React Hot Toast Provider

Add `Toaster` component to your root layout:

```typescript
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      {/* Your app content */}
      <Toaster position="top-right" />
    </>
  )
}
```

## 📚 Usage Examples

### Using React Hook Form with Zod

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod' // Install: pnpm add @hookform/resolvers
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Using TanStack Query

```typescript
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchData = async () => {
  const { data } = await axios.get('/api/data')
  return data
}

const MyComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  })

  if (isLoading) return <div>Loading...</div>
  return <div>{JSON.stringify(data)}</div>
}
```

### Using Zustand

```typescript
import { create } from 'zustand'

interface Store {
  count: number
  increment: () => void
}

const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))

const MyComponent = () => {
  const { count, increment } = useStore()
  return <button onClick={increment}>{count}</button>
}
```

### Using React Hot Toast

```typescript
import toast from 'react-hot-toast'

// Success toast
toast.success('Operation successful!')

// Error toast
toast.error('Something went wrong!')

// Loading toast
const toastId = toast.loading('Processing...')
// Later: toast.success('Done!', { id: toastId })
```

### Using Socket.io Client

```typescript
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('message', (data) => {
  console.log('Received:', data)
})

socket.emit('event', { data: 'value' })
```

### Using Recharts

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
]

const MyChart = () => (
  <LineChart width={500} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
  </LineChart>
)
```

## 🎨 Styling

The project uses Tailwind CSS with shadcn/ui's design system. CSS variables are defined in `src/styles/index.css` for theming.

### Dark Mode

Dark mode classes are available through Tailwind's dark mode utilities:

```tsx
<div className="bg-white dark:bg-gray-900">
  Content
</div>
```

## 📦 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript root config
- `tsconfig.app.json` - Application TypeScript config
- `tailwind.config.js` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration
- `eslint.config.js` - ESLint configuration

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
