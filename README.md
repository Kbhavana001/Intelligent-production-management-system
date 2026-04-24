Intelligent Production Management System
An advanced real-time production management system powered by AI-driven insights from Google Gemini. Monitor live KPIs, detect anomalies, perform root cause analysis, and simulate market strategies to optimize production and market position.

Table of contents

Features
Tech stack
Quick start
Project structure
Configuration
User roles
Authentication
AI features
Deployment
Contributing
License


🌟 Features
AI-powered analytics

Anomaly detection — real-time detection of unusual patterns in production data using Google Gemini
Root cause analysis — AI-driven insights to identify underlying causes of performance issues
Predictive analytics — forecast production trends and potential issues before they occur
Sentiment analysis — analyze customer feedback and vendor communications automatically

Production monitoring

Real-time KPI dashboard — live monitoring of key performance indicators
Interactive data visualization — charts and graphs powered by Recharts
Multi-role access — separate dashboards for manufacturers and vendors

Advanced capabilities

Price simulation — predict market impact of pricing changes
Competitive analysis — track competitor pricing and market share
Sustainability metrics — monitor energy usage and environmental impact


🛠 Tech stack
LayerTechnologyFrontendReact 19, TypeScript 5, Tailwind CSS 4Build toolVite 7ChartsRecharts 3BackendNode.js 20, ExpressDatabaseSQLite (development) / MySQL (production)AIGoogle Gemini API (@google/genai)AuthJWT, bcrypt, HTTP-only cookies

🚀 Quick start
Prerequisites

Node.js 18 or higher
npm
A Google Gemini API key
Git

Installation
1. Clone the repository
bashgit clone https://github.com/Kbhavana001/Intelligent-production-management-system.git
cd Intelligent-production-management-system
2. Install frontend dependencies
bashnpm install
3. Install backend dependencies
bashcd server
npm install
cd ..
4. Set up environment variables
Create a .env file in the project root:
envVITE_API_KEY=your_gemini_api_key_here
5. Start the backend server (Terminal 1)
bashcd server
npm start
6. Start the frontend dev server (Terminal 2)
bashnpm run dev
7. Open the app

Frontend: http://localhost:3000
Backend API: http://localhost:4000

Default login credentials
RoleUsernamePasswordManufacturermanufacturerpass123Vendorvendorpass123

These credentials are for local development only.


📁 Project structure
intelligent-production-management-system/
├── components/                  # React UI components
│   ├── common/                  # Reusable UI components
│   ├── Dashboard.tsx            # Main dashboard
│   ├── Login.tsx                # Authentication screen
│   ├── AnomalyDetection.tsx     # Anomaly detection panel
│   ├── PriceSimulation.tsx      # Price simulation tool
│   ├── SentimentAnalysis.tsx    # Sentiment analysis panel
│   └── VendorDashboard.tsx      # Vendor-specific dashboard
├── services/                    # API and AI service layer
│   ├── auth.ts                  # Authentication service
│   └── geminiService.ts         # Google Gemini AI integration
├── server/                      # Node.js backend
│   ├── index.js                 # Express server entry point
│   ├── db.js                    # Database setup (SQLite/MySQL)
│   └── ...                      # Auth middleware, routes
├── src/                         # App entry point
│   ├── App.tsx                  # Root component
│   ├── AuthContext.tsx          # Authentication context
│   └── main.tsx                 # Vite entry point
├── data/                        # Mock production data
├── public/                      # Static assets
├── types.ts                     # TypeScript type definitions
├── index.html                   # HTML entry point
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── package.json                 # Frontend dependencies


🔧 Configuration
Google Gemini API setup

Get your API key from Google AI Studio
Create a .env file in the project root and add:

envVITE_API_KEY=your_api_key_here
Database configuration
The system supports SQLite for development and MySQL for production.
SQLite (default — no setup required)
Data is stored automatically in server/server.sqlite.
MySQL (production)
Create a .env file inside the server/ directory:
envMYSQL_HOST=localhost
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=ips_db

🎯 User roles & features
Manufacturer dashboard

Production KPI monitoring
Anomaly detection and real-time alerts
Root cause analysis
Vendor performance analytics
Price simulation tools
Sustainability and energy metrics
Competitive market analysis

Vendor dashboard

Performance tracking
Feedback submission system
Production insights
Quality metrics
Communication tools


🔒 Authentication
The system includes a complete authentication system with:

User registration and login
Role-based access control (Manufacturer / Vendor)
Secure password hashing with bcrypt
JWT token-based sessions
HTTP-only cookies for security


📊 AI features
Anomaly detection
Automatically identifies unusual patterns in:

Revenue fluctuations
Return rate spikes
Production batch anomalies
Quality issues

Root cause analysis
AI-powered analysis of:

Performance degradation causes
Regional performance variations
Vendor-specific issues
Channel performance problems

Sentiment analysis
Analyzes customer feedback to:

Categorize feedback sentiment (positive / neutral / negative)
Identify recurring themes
Track satisfaction trends over time
Generate actionable insights

Price simulation

Predicts sales and revenue impact of price changes
Returns confidence score and AI reasoning
Supports market strategy planning


🚀 Deployment
Frontend (Vercel / Netlify)
bashnpm run build
Deploy the generated dist/ folder and set the VITE_API_KEY environment variable in your hosting platform's settings.
Backend (Heroku / Railway / Render)
Deploy the server/ directory and set the following environment variables:
envMYSQL_HOST=...
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_DATABASE=...

🤝 Contributing

Fork the repository
Create a feature branch: git checkout -b feature/your-feature-name
Commit your changes: git commit -m 'Add your feature'
Push to the branch: git push origin feature/your-feature-name
Open a Pull Request


📝 License
This project is licensed under the MIT License. See the LICENSE file for details.

🙏 Acknowledgments

Google Gemini AI for AI capabilities
React for the UI framework
Tailwind CSS for styling
Recharts for data visualization
Vite for the build tooling


Built with ❤️ for intelligent production management
