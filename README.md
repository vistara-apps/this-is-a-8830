# KnowYourRights Buddy

Your Pocket Guide to Understanding Your Rights During Police Interactions.

## Overview

KnowYourRights Buddy is a mobile-first web application that provides accessible, actionable legal scripts and interaction logging for individuals during police encounters. The app empowers users with clear, concise, and legally sound guidance while providing tools to document interactions safely.

## Features

### Core Features
- **State-Specific Legal Scripts**: Mobile-optimized guides with 'what to say' and 'what not to say' scripts tailored to common police interaction scenarios
- **Real-time Interaction Logging**: Discreet audio recording and timestamping capabilities
- **Quick Record Button**: Prominent, easily accessible recording initiation
- **Shareable Interaction Summary**: AI-generated concise summaries of interactions
- **Custom Script Generation**: AI-powered script creation for specific scenarios (Premium)

### Premium Features
- Unlimited custom script generation
- Cloud storage for recordings
- AI-powered interaction summaries
- State-specific legal customizations
- Advanced script personalization

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + useReducer
- **APIs**: 
  - OpenAI API for script generation and summaries
  - Stripe API for subscription management
  - AWS S3 for cloud storage
- **Audio**: Web Audio API for recording

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys for:
  - OpenAI API
  - Stripe (test/live keys)
  - AWS S3 (optional, for cloud storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vistara-apps/this-is-a-8830.git
cd this-is-a-8830
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with the required API keys:
```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# AWS S3 Configuration (Optional)
VITE_AWS_REGION=us-east-1
VITE_AWS_BUCKET_NAME=your_bucket_name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Application Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## API Integration Setup

### OpenAI API
1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add the key to your `.env` file as `VITE_OPENAI_API_KEY`

### Stripe Integration
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable and secret keys from the dashboard
3. Set up products and pricing in your Stripe dashboard
4. Configure webhook endpoints for subscription events

### AWS S3 (Optional)
1. Create an AWS account and S3 bucket
2. Set up IAM user with S3 permissions
3. Configure CORS policy for your bucket
4. Add credentials to `.env` file

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ActionButton.jsx
│   ├── ScriptCard.jsx
│   └── ...
├── context/            # React Context for state management
│   └── AppContext.jsx
├── pages/              # Main application pages
│   ├── HomePage.jsx
│   ├── ScriptsPage.jsx
│   ├── RecordingPage.jsx
│   └── ProfilePage.jsx
├── services/           # API service modules
│   ├── api.js         # Core API functions
│   ├── openai.js      # OpenAI integration
│   ├── stripe.js      # Stripe integration
│   └── storage.js     # Cloud storage
└── styles/            # CSS and styling
    └── index.css
```

## Design System

The app uses a custom design system built with Tailwind CSS:

### Colors
- **Primary**: `hsl(220, 70%, 50%)` - Main brand color
- **Accent**: `hsl(160, 70%, 45%)` - Success/accent color
- **Text**: `hsl(220, 15%, 15%)` - Primary text
- **Muted**: `hsl(220, 15%, 60%)` - Secondary text
- **Surface**: `hsl(0, 0%, 100%)` - Card backgrounds
- **Background**: `hsl(220, 15%, 98%)` - Page background

### Typography
- **Display**: `text-4xl font-semibold` - Large headings
- **Heading**: `text-2xl font-bold` - Section headings
- **Body**: `text-base font-normal leading-7` - Body text
- **Caption**: `text-sm font-medium` - Small text

### Components
- **ActionButton**: Primary, secondary, and danger variants
- **ScriptCard**: Collapsible and expanded states
- **Modal**: Dialog and sheet variants

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- ESLint for code linting
- Prettier for code formatting
- Conventional commit messages

### Testing

Audio recording functionality requires HTTPS in production. For local development, the app works on `localhost` which is treated as a secure context.

## Deployment

### Environment Setup

1. Set up production environment variables
2. Configure Stripe webhooks for your production domain
3. Set up AWS S3 bucket with proper CORS configuration
4. Deploy to a platform that supports HTTPS (required for audio recording)

### Recommended Platforms

- **Vercel**: Easy deployment with automatic HTTPS
- **Netlify**: Simple static site hosting
- **AWS Amplify**: Full-stack deployment with AWS integration

### Build Command

```bash
npm run build
```

The build artifacts will be generated in the `dist/` directory.

## Security Considerations

- All API keys should be kept secure and never committed to version control
- Audio recordings are handled with user consent and stored securely
- HTTPS is required for audio recording functionality
- Stripe handles all payment processing securely

## Legal Disclaimer

This application provides general legal information and should not be considered as legal advice. Users should consult with qualified legal professionals for specific legal situations. The scripts and information provided are for educational purposes only.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@knowyourrightsbuddy.com or create an issue in this repository.

## Roadmap

- [ ] Multi-language support (Spanish, French)
- [ ] Offline functionality with service workers
- [ ] Location-based safety alerts
- [ ] Integration with legal aid organizations
- [ ] Mobile app versions (iOS/Android)
- [ ] Voice-activated recording
- [ ] Real-time transcription
- [ ] Legal resource database

---

Built with ❤️ for civil rights and community safety.
