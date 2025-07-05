import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import React from 'react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PortfolioData {
  name: string;
  value: number;
  color: string;
}

interface PerformanceData {
  name: string;
  value: number;
  change: number;
}

const PortfolioAnalysis = () => {
  // Mock data - in a real implementation, this would come from the wallet
  const portfolioData: PortfolioData[] = [
    { name: 'FLOW', value: 65, color: '#00ef8b' },
    { name: 'USDC', value: 20, color: '#2775ca' },
    { name: 'FUSD', value: 10, color: '#ff6b6b' },
    { name: 'Other', value: 5, color: '#ffd93d' },
  ];

  const performanceData: PerformanceData[] = [
    { name: 'FLOW', value: 1250, change: 5.2 },
    { name: 'USDC', value: 500, change: 0.1 },
    { name: 'FUSD', value: 200, change: -0.3 },
    { name: 'BLT', value: 100, change: 12.8 },
  ];

  const totalValue = 2050; // Mock total portfolio value
  const dayChange = 2.8; // Mock 24h change

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        📊 Portfolio Overview
      </Typography>

      {/* Total Value Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            ${totalValue.toLocaleString()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Total Portfolio Value
            </Typography>
            <Chip
              label={`${dayChange > 0 ? '+' : ''}${dayChange}%`}
              size="small"
              sx={{
                bgcolor: dayChange > 0 ? 'success.light' : 'error.light',
                color: dayChange > 0 ? 'success.dark' : 'error.dark',
                fontWeight: 600,
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Asset Allocation */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Asset Allocation
          </Typography>
          <Box sx={{ height: 200, mb: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            {portfolioData.map((item) => (
              <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: item.color,
                  }}
                />
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                  {item.name} ({item.value}%)
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Token Performance */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Token Performance (24h)
          </Typography>
          <Box sx={{ height: 150, mb: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#00ef8b" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ display: 'grid', gap: 1 }}>
            {performanceData.map((token) => (
              <Box
                key={token.name}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'grey.50',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {token.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">
                    ${token.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: token.change > 0 ? 'success.main' : 'error.main',
                      fontWeight: 600,
                    }}
                  >
                    {token.change > 0 ? '+' : ''}{token.change}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PortfolioAnalysis;
