# Intelligent Production Management System# React + TypeScript + Vite



An advanced real-time production management system powered by AI-driven insights from Google Gemini. Monitor live KPIs, detect anomalies, perform root cause analysis, and simulate market strategies to optimize production and market position.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



![System Overview](https://img.shields.io/badge/Status-Production%20Ready-green)Currently, two official plugins are available:

![React](https://img.shields.io/badge/React-18.x-blue)

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh

![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-blue)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)

## Expanding the ESLint configuration

## 🌟 Features

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

### AI-Powered Analytics

- **Anomaly Detection**: Real-time detection of unusual patterns in production data using Google Gemini```js

- **Root Cause Analysis**: AI-driven insights to identify the underlying causes of performance issuesexport default defineConfig([

- **Predictive Analytics**: Forecast production trends and potential issues before they occur  globalIgnores(['dist']),

  {

### Production Monitoring    files: ['**/*.{ts,tsx}'],

- **Real-time KPI Dashboard**: Live monitoring of key performance indicators    extends: [

- **Interactive Data Visualization**: Beautiful charts and graphs using Recharts      // Other configs...

- **Multi-role Access**: Separate dashboards for manufacturers and vendors

      // Remove tseslint.configs.recommended and replace with this

### Advanced Capabilities      tseslint.configs.recommendedTypeChecked,

- **Sentiment Analysis**: Analyze customer feedback and vendor communications      // Alternatively, use this for stricter rules

- **Price Simulation**: Predict market impact of pricing changes      tseslint.configs.stylisticTypeChecked,

- **Competitive Analysis**: Track competitor pricing and market share

- **Sustainability Metrics**: Monitor energy usage and environmental impact      // Other configs...

    ],

### Modern Tech Stack    languageOptions: {

- **Frontend**: React 18 + TypeScript + Tailwind CSS      parserOptions: {

- **Backend**: Node.js + Express + Authentication        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- **Database**: SQLite (development) / MySQL (production)        tsconfigRootDir: import.meta.dirname,

- **AI Integration**: Google Gemini API      },

- **Charts**: Recharts for interactive data visualization      // other options...

    },

## 🚀 Quick Start  },

])

### Prerequisites```

- Node.js 18+ and npm

- Google Gemini API keyYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

- Git

```js

### Installation// eslint.config.js

import reactX from 'eslint-plugin-react-x'

1. **Clone the repository**import reactDom from 'eslint-plugin-react-dom'

   ```bash

   git clone https://github.com/Kbhavana001/Intelligent-production-management-system.gitexport default defineConfig([

   cd intelligent-production-system  globalIgnores(['dist']),

   ```  {

    files: ['**/*.{ts,tsx}'],

2. **Install dependencies**    extends: [

   ```bash      // Other configs...

   # Install frontend dependencies      // Enable lint rules for React

   npm install      reactX.configs['recommended-typescript'],

      // Enable lint rules for React DOM

   # Install backend dependencies      reactDom.configs.recommended,

   cd server    ],

   npm install    ## Local auth demo

   cd ..

   ```    This project includes a small demo auth server under `server/` which you can run locally for development.



3. **Environment Setup**    - Change into the server folder and install dependencies:

   ```bash

   # Create .env file and add your Google Gemini API key      cd server; npm install

   echo "VITE_API_KEY=your_gemini_api_key_here" > .env

   ```    - Start the server:



4. **Start the development servers**      npm start

   

   **Terminal 1 - Backend Server:**    - Set Vite env `VITE_API_BASE` to `http://localhost:4000` to make the frontend call the demo server.

   ```bash

   cd server    The server seeds two users: `manufacturer` and `vendor` (password `pass123`). This server is for local development only.

   npm start    languageOptions: {

   ```      parserOptions: {

           project: ['./tsconfig.node.json', './tsconfig.app.json'],

   **Terminal 2 - Frontend Development Server:**        tsconfigRootDir: import.meta.dirname,

   ```bash      },

   npm run dev      // other options...

   ```    },

  },

5. **Access the application**])

   - Frontend: http://localhost:3000```

   - Backend API: http://localhost:4000

### Default Login Credentials
- **Manufacturer**: username: `manufacturer`, password: `pass123`
- **Vendor**: username: `vendor`, password: `pass123`

## 📁 Project Structure

```
intelligent-production-system/
├── components/                 # React components
│   ├── common/                # Reusable UI components
│   ├── Dashboard.tsx          # Main dashboard
│   ├── Login.tsx              # Authentication
│   └── ...                    # Feature-specific components
├── services/                  # API services
│   ├── auth.ts               # Authentication service
│   └── geminiService.ts      # AI service integration
├── server/                   # Backend server
│   ├── index.js             # Express server
│   ├── db.js                # Database setup
│   └── ...                  # Server utilities
├── src/                     # Main application
│   ├── App.tsx              # Root component
│   ├── AuthContext.tsx      # Authentication context
│   └── ...                  # App configuration
├── data/                    # Mock data and samples
├── types.ts                 # TypeScript type definitions
└── package.json            # Dependencies
```

## 🔧 Configuration

### Google Gemini API Setup
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env` file:
   ```env
   VITE_API_KEY=your_api_key_here
   ```

### Database Configuration
The system supports both SQLite (default) and MySQL:

**SQLite (Development):**
- No additional setup required
- Data stored in `server/server.sqlite`

**MySQL (Production):**
1. Create `.env` file in the `server/` directory
2. Configure database connection:
   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=your_username
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=ips_db
   ```

## 🎯 User Roles & Features

### Manufacturer Dashboard
- Production KPI monitoring
- Anomaly detection and alerts
- Root cause analysis
- Vendor performance analytics
- Price simulation tools
- Sustainability metrics

### Vendor Dashboard
- Performance tracking
- Feedback submission system
- Production insights
- Quality metrics
- Communication tools

## 🔒 Authentication

The system includes a complete authentication system with:
- User registration and login
- Role-based access control (Manufacturer/Vendor)
- Secure password hashing with bcrypt
- JWT token-based sessions
- HTTP-only cookies for security

## 📊 AI Features

### Anomaly Detection
Automatically identifies unusual patterns in:
- Revenue fluctuations
- Return rate spikes
- Production anomalies
- Quality issues

### Root Cause Analysis
AI-powered analysis of:
- Performance degradation causes
- Regional performance variations
- Vendor-specific issues
- Channel performance problems

### Sentiment Analysis
Analyzes customer feedback to:
- Categorize feedback sentiment
- Identify key themes
- Track satisfaction trends
- Generate actionable insights



### Building for Production
```bash
# Build frontend
npm run build

# Start production server
npm run preview
```

### Code Style
- ESLint configuration included
- TypeScript strict mode enabled
- Prettier for code formatting

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist/` folder
3. Set environment variables in your hosting platform

### Backend Deployment (Heroku/Railway)
1. Deploy the `server/` directory
2. Set production environment variables
3. Configure database connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for AI capabilities
- [React](https://reactjs.org/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for data visualization
- [Vite](https://vitejs.dev/) for build tooling

## 📞 Support

For questions and support:
- Create an issue on GitHub
- Email: [your-email@example.com]
- Documentation: [Project Wiki](../../wiki)

---

Built with ❤️ for intelligent production management
