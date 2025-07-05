# Flow Wallet Extension with AI Agent

This is a forked version of the Flow Wallet extension enhanced with an AI Agent for DeFi onboarding and automation.

## 🚀 What's New

### AI Agent Features

We've added a comprehensive AI Agent panel that includes:

1. **AI Chat Interface**
   - Conversational AI assistant for DeFi guidance
   - Context-aware responses about portfolio, staking, swapping, and security
   - Quick action suggestions
   - Interactive help with actionable buttons

2. **Portfolio Analysis**
   - Real-time portfolio overview with charts
   - Asset allocation visualization
   - Performance tracking with 24h changes
   - Token breakdown with pie charts and bar graphs

3. **DeFi Actions Hub**
   - Curated DeFi opportunities with risk ratings
   - APY information for staking and liquidity provision
   - One-click access to protocols like Increment Finance and KittyPunch
   - Risk-adjusted recommendations

4. **Learning Center**
   - Step-by-step onboarding tutorials
   - Interactive guides for beginners to advanced users
   - DeFi education with practical examples
   - Progress tracking and completion rewards

## 🎯 Hackathon Goals

This extension aims to solve the **DeFi onboarding problem** by:

- **Abstracting complexity**: AI explains DeFi concepts in simple terms
- **Guided experiences**: Step-by-step tutorials for first-time users
- **Risk awareness**: Clear risk ratings and educational warnings
- **Automated suggestions**: AI recommends actions based on user portfolio
- **Safety first**: Built-in security best practices and warnings

## 🛠 Technical Implementation

### New Components Added

- `src/ui/views/AIAgent/index.tsx` - Main AI Agent component with tabs
- `src/ui/views/AIAgent/DefiActions.tsx` - DeFi opportunities interface
- `src/ui/views/AIAgent/PortfolioAnalysis.tsx` - Portfolio visualization
- `src/ui/views/AIAgent/OnboardingTutorials.tsx` - Learning center
- `src/ui/components/iconfont/IconAI.tsx` - AI icon component

### Integration Points

- Added AI Agent as 4th tab in the main wallet interface
- Integrated with existing Flow wallet hooks and state management
- Responsive design matching Flow's UI/UX patterns
- Uses Material-UI components for consistency

## 🚀 Getting Started

### Prerequisites

- Node.js v22.11 or later
- pnpm package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.dev
   # Edit .env.dev with your configuration
   ```

4. Build the extension:
   ```bash
   pnpm build:dev-ci
   ```

5. Load in Chrome:
   - Go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## 🎨 Features in Detail

### AI Chat Assistant
- Natural language processing for DeFi questions
- Context-aware responses based on user's wallet state
- Actionable suggestions with one-click execution
- Educational responses with safety warnings

### Portfolio Dashboard
- Visual portfolio breakdown with charts
- Real-time balance tracking
- Performance analytics
- Asset allocation recommendations

### DeFi Opportunities
- Curated list of DeFi protocols on Flow
- Risk-adjusted APY information
- Direct integration with external DeFi platforms
- Safety ratings and educational content

### Learning Center
- Progressive difficulty tutorials
- Interactive step-by-step guides
- Completion tracking
- Safety-first educational approach

## 🔒 Security Considerations

- All AI suggestions are for educational purposes only
- Users must confirm all transactions
- Built-in warnings for high-risk activities
- No private key access by AI components
- Integration respects existing wallet security model

## 🌟 Future Enhancements

Potential features for future development:

- **Real-time DeFi analytics** from on-chain data
- **Automated portfolio rebalancing** suggestions
- **Cross-chain bridge integration** with AI guidance
- **Yield optimization** algorithms
- **Social features** for DeFi strategy sharing
- **Advanced risk modeling** and alerts
- **Integration with more DeFi protocols**
- **Mobile-responsive** design improvements

## 🤝 Contributing

This project is part of ETH Global Cannes 2025 hackathon. Feel free to:

- Report issues
- Suggest improvements
- Contribute new features
- Enhance AI responses
- Add more DeFi integrations

## 📝 License

This project inherits the LGPL-3.0-or-later license from the original Flow Wallet extension.

## 🏆 Hackathon Impact

This AI Agent addresses a critical problem in DeFi adoption:

- **Reduces barrier to entry** for new users
- **Provides safe learning environment** with guided tutorials
- **Automates complex DeFi research** through AI assistance
- **Promotes responsible DeFi practices** through education
- **Enhances user experience** with intuitive interfaces

The goal is to make DeFi accessible to everyone, regardless of their technical background, while maintaining the highest security standards.
