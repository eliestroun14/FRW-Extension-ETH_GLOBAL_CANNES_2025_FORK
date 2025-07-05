import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

interface DefiActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  apy?: string;
  onClick: () => void;
}

const DefiActionCard: React.FC<DefiActionProps> = ({
  icon,
  title,
  description,
  riskLevel,
  apy,
  onClick,
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ color: 'primary.main', mt: 0.5 }}>
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8rem' }}>
              {description}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor: getRiskColor(riskLevel),
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {riskLevel} risk
              </Box>
              {apy && (
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {apy} APY
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const DefiActions = () => {
  const defiActions = [
    {
      icon: <TrendingUpIcon />,
      title: 'Stake FLOW',
      description: 'Secure the network and earn passive rewards',
      riskLevel: 'low' as const,
      apy: '4-8%',
      onClick: () => console.log('Stake FLOW'),
    },
    {
      icon: <SwapHorizIcon />,
      title: 'Provide Liquidity',
      description: 'Add liquidity to DEX pools for trading fees',
      riskLevel: 'medium' as const,
      apy: '10-25%',
      onClick: () => console.log('Provide Liquidity'),
    },
    {
      icon: <AccountBalanceWalletIcon />,
      title: 'Yield Farming',
      description: 'Farm high-yield opportunities on Flow',
      riskLevel: 'high' as const,
      apy: '20-100%',
      onClick: () => console.log('Yield Farming'),
    },
    {
      icon: <SecurityIcon />,
      title: 'Insurance Pools',
      description: 'Provide insurance coverage for DeFi protocols',
      riskLevel: 'low' as const,
      apy: '5-12%',
      onClick: () => console.log('Insurance Pools'),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        🚀 DeFi Opportunities
      </Typography>
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {defiActions.map((action, index) => (
          <DefiActionCard key={index} {...action} />
        ))}
      </Box>
    </Box>
  );
};

export default DefiActions;
