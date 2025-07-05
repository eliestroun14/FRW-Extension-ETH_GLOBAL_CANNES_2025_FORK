import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import SchoolIcon from '@mui/icons-material/School';
import SecurityIcon from '@mui/icons-material/Security';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import { useWallet } from '@/ui/hooks/use-wallet';
import { useProfiles } from '@/ui/hooks/useProfileHook';

import DefiActions from './DefiActions';
import OnboardingTutorials from './OnboardingTutorials';
import PortfolioAnalysis from './PortfolioAnalysis';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  actions?: Array<{
    type: 'swap' | 'stake' | 'bridge' | 'send';
    label: string;
    onClick: () => void;
  }>;
}

interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'defi' | 'nft' | 'security' | 'portfolio';
  onClick: () => void;
}

const AIAgent = () => {
  const wallet = useWallet();
  const { currentWallet, activeAccountType, currentBalance } = useProfiles();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message when component mounts
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      text: `Hello! I'm your DeFi assistant. I can help you with swapping tokens, staking, bridging assets, and managing your portfolio. What would you like to do today?`,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const suggestedActions: SuggestedAction[] = [
    {
      id: 'check-balance',
      title: 'Check Portfolio',
      description: 'View your current balance and assets',
      icon: <AccountBalanceWalletIcon />,
      category: 'portfolio',
      onClick: () => handleSuggestedAction('Show me my current portfolio balance and breakdown'),
    },
    {
      id: 'swap-tokens',
      title: 'Swap Tokens',
      description: 'Exchange one token for another',
      icon: <SwapHorizIcon />,
      category: 'defi',
      onClick: () => handleSuggestedAction('I want to swap tokens. Show me available options'),
    },
    {
      id: 'staking',
      title: 'Stake Tokens',
      description: 'Earn rewards by staking your tokens',
      icon: <TrendingUpIcon />,
      category: 'defi',
      onClick: () => handleSuggestedAction('What staking opportunities are available for my tokens?'),
    },
    {
      id: 'security-check',
      title: 'Security Review',
      description: 'Review your wallet security settings',
      icon: <SecurityIcon />,
      category: 'security',
      onClick: () => handleSuggestedAction('Help me review my wallet security settings'),
    },
  ];

  const handleSuggestedAction = (actionText: string) => {
    setInputValue(actionText);
    handleSendMessage(actionText);
  };

  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let actions: ChatMessage['actions'] = [];

    if (lowerMessage.includes('portfolio') || lowerMessage.includes('balance')) {
      response = `Based on your current wallet, here's what I can see:

📊 **Portfolio Overview:**
- Wallet Address: ${currentWallet?.address ? `${currentWallet.address.slice(0, 6)}...${currentWallet.address.slice(-4)}` : 'Not available'}
- Account Type: ${activeAccountType || 'Main'}
- Network: Flow ${activeAccountType === 'evm' ? 'EVM' : 'Mainnet'}

💰 **Total Balance:** ${currentBalance || 'Loading...'}

**Available Actions:**
- View detailed token breakdown
- Set up portfolio tracking
- Enable balance notifications`;

      actions = [
        {
          type: 'send',
          label: 'View Token Details',
          onClick: () => handleSuggestedAction('Show me detailed breakdown of all my tokens'),
        },
      ];
    } else if (lowerMessage.includes('swap') || lowerMessage.includes('exchange')) {
      response = `🔄 **Token Swapping Options:**

For Flow ${activeAccountType === 'evm' ? 'EVM' : 'Mainnet'} network:
- **Increment Finance**: Best rates for major pairs
- **KittyPunch**: EVM-compatible swaps
- **FlowSwap**: Native Flow token swaps

**Before swapping:**
1. Check slippage tolerance (recommended: 0.5-1%)
2. Verify token contract addresses
3. Consider gas fees

Would you like me to open the swap interface or help you find the best rates?`;

      actions = [
        {
          type: 'swap',
          label: 'Open Swap Interface',
          onClick: () => {
            const swapUrl = activeAccountType === 'evm'
              ? 'https://swap.kittypunch.xyz/swap'
              : 'https://app.increment.fi/swap';
            window.open(swapUrl, '_blank');
          },
        },
      ];
    } else if (lowerMessage.includes('stak') || lowerMessage.includes('reward')) {
      response = `🚀 **Staking Opportunities:**

**Available on Flow:**
- **FLOW Staking**: 4-8% APY, minimum 1 FLOW
- **Liquid Staking**: Maintain liquidity while earning
- **DeFi Yield Farming**: Higher APY, higher risk

**Recommended for beginners:**
1. Start with FLOW staking (lower risk)
2. Diversify across validators
3. Consider lock-up periods

**Security Tips:**
- Only use verified staking providers
- Never share your private keys
- Start with small amounts

Would you like me to guide you through the staking process?`;

      actions = [
        {
          type: 'stake',
          label: 'Start Staking Guide',
          onClick: () => handleSuggestedAction('Guide me through staking FLOW tokens step by step'),
        },
      ];
    } else if (lowerMessage.includes('security') || lowerMessage.includes('safe')) {
      response = `🔒 **Security Recommendations:**

**Current Status:**
✅ Hardware wallet support enabled
✅ Transaction signing required
⚠️ Consider enabling 2FA for additional protection

**Best Practices:**
1. **Never share your seed phrase**
2. **Use strong, unique passwords**
3. **Enable all available security features**
4. **Regularly review connected dApps**
5. **Keep your extension updated**

**Advanced Security:**
- Set up hardware wallet integration
- Use multiple accounts for different purposes
- Regular security audits

Would you like me to walk you through enabling additional security features?`;

      actions = [
        {
          type: 'send',
          label: 'Security Settings',
          onClick: () => handleSuggestedAction('Take me to security settings'),
        },
      ];
    } else if (lowerMessage.includes('bridge') || lowerMessage.includes('cross-chain')) {
      response = `🌉 **Cross-Chain Bridging:**

**Supported Bridges:**
- **Flow ↔ Ethereum**: For ERC-20 tokens
- **Flow ↔ Polygon**: Lower fees, faster transfers
- **Flow ↔ BSC**: Wide token selection

**Bridge Safety:**
1. Always verify bridge contract addresses
2. Start with small test amounts
3. Double-check destination addresses
4. Be aware of bridge fees and timeouts

**Recommended Bridges:**
- **Official Flow Bridge**: Most secure
- **Multichain**: Multiple networks
- **Celer cBridge**: Fast transfers

Need help with a specific bridge operation?`;

      actions = [
        {
          type: 'bridge',
          label: 'Bridge Tokens',
          onClick: () => handleSuggestedAction('Help me bridge tokens between networks'),
        },
      ];
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what can')) {
      response = `🤖 **I can help you with:**

**DeFi Operations:**
- Token swapping and trading
- Staking and yield farming
- Cross-chain bridging
- Portfolio analysis

**Security & Management:**
- Wallet security review
- Transaction monitoring
- Best practices guidance
- Risk assessment

**Educational:**
- DeFi concepts explanation
- Market insights
- Protocol recommendations
- Safety guidelines

**Portfolio Optimization:**
- Asset allocation advice
- Yield optimization
- Risk management
- Performance tracking

What specific area would you like help with?`;
    } else {
      response = `I understand you're asking about: "${userMessage}"

I'm here to help with DeFi operations, security, and portfolio management. Could you be more specific about what you'd like to do?

Some things I can help with:
- 💱 Swapping tokens
- 🔒 Security reviews
- 📊 Portfolio analysis
- 🌉 Cross-chain bridging
- 🚀 Staking and rewards

Try asking something like "Help me swap tokens" or "Check my portfolio security".`;
    }

    return {
      id: Date.now().toString(),
      text: response,
      sender: 'ai',
      timestamp: new Date(),
      actions,
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(text);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const filteredActions = selectedCategory
    ? suggestedActions.filter(action => action.category === selectedCategory)
    : suggestedActions;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
    <div role="tabpanel" hidden={value !== index} style={{ height: '100%' }}>
      {value === index && children}
    </div>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SmartToyIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            DeFi AI Assistant
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Your personal guide to DeFi operations and wallet management
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab
            icon={<SmartToyIcon sx={{ fontSize: 16 }} />}
            label="AI Chat"
            iconPosition="start"
            sx={{ minHeight: 48, textTransform: 'none' }}
          />
          <Tab
            icon={<BarChartIcon sx={{ fontSize: 16 }} />}
            label="Portfolio"
            iconPosition="start"
            sx={{ minHeight: 48, textTransform: 'none' }}
          />
          <Tab
            icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
            label="DeFi Actions"
            iconPosition="start"
            sx={{ minHeight: 48, textTransform: 'none' }}
          />
          <Tab
            icon={<SchoolIcon sx={{ fontSize: 16 }} />}
            label="Learn"
            iconPosition="start"
            sx={{ minHeight: 48, textTransform: 'none' }}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <TabPanel value={currentTab} index={0}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
            {/* AI Chat Content */}
            {/* Category Filter */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="All"
                  variant={selectedCategory === null ? 'filled' : 'outlined'}
                  onClick={() => setSelectedCategory(null)}
                  size="small"
                />
                <Chip
                  label="DeFi"
                  variant={selectedCategory === 'defi' ? 'filled' : 'outlined'}
                  onClick={() => setSelectedCategory('defi')}
                  size="small"
                />
                <Chip
                  label="Portfolio"
                  variant={selectedCategory === 'portfolio' ? 'filled' : 'outlined'}
                  onClick={() => setSelectedCategory('portfolio')}
                  size="small"
                />
                <Chip
                  label="Security"
                  variant={selectedCategory === 'security' ? 'filled' : 'outlined'}
                  onClick={() => setSelectedCategory('security')}
                  size="small"
                />
              </Box>
            </Box>

            {/* Suggested Actions */}
            {messages.length <= 1 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  {filteredActions.map((action) => (
                    <Card
                      key={action.id}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2,
                        },
                      }}
                      onClick={action.onClick}
                    >
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Box sx={{ mr: 1, color: 'primary.main' }}>{action.icon}</Box>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                          {action.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                          {action.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

            {/* Chat Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
              <List sx={{ p: 0 }}>
                {messages.map((message) => (
                  <ListItem
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      p: 0.5,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        maxWidth: '85%',
                        bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                        color: message.sender === 'user' ? 'white' : 'text.primary',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                        {message.text}
                      </Typography>
                      {message.actions && message.actions.length > 0 && (
                        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              size="small"
                              variant="outlined"
                              onClick={action.onClick}
                              sx={{
                                fontSize: '0.7rem',
                                py: 0.25,
                                px: 1,
                                minHeight: 'auto',
                                borderColor: message.sender === 'user' ? 'white' : 'primary.main',
                                color: message.sender === 'user' ? 'white' : 'primary.main',
                                '&:hover': {
                                  borderColor: message.sender === 'user' ? 'white' : 'primary.dark',
                                  bgcolor: message.sender === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(25,118,210,0.04)',
                                },
                              }}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </Box>
                      )}
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7, fontSize: '0.65rem' }}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Paper>
                  </ListItem>
                ))}
                {isLoading && (
                  <ListItem sx={{ display: 'flex', justifyContent: 'flex-start', p: 0.5 }}>
                    <Paper sx={{ p: 1.5, bgcolor: 'grey.100', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          AI is thinking...
                        </Typography>
                      </Box>
                    </Paper>
                  </ListItem>
                )}
                <div ref={messagesEndRef} />
              </List>
            </Box>

            {/* Input Area */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about DeFi, staking, swapping, or security..."
                variant="outlined"
                size="small"
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300',
                    color: 'grey.500',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>

            {/* Warning */}
            <Alert severity="info" sx={{ mt: 1, fontSize: '0.75rem' }}>
              🔒 This AI assistant is for educational purposes. Always verify transactions before confirming.
            </Alert>
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
            <PortfolioAnalysis />
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
            <DefiActions />
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
            <OnboardingTutorials />
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default AIAgent;
