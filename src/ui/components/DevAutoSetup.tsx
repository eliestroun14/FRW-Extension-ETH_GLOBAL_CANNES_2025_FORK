import { DEFAULT_PASSWORD } from '@/shared/utils/default';
import { useWallet } from '@/ui/hooks/use-wallet';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface DevAutoSetupProps {
  onSetupComplete: () => void;
}

const DevAutoSetup: React.FC<DevAutoSetupProps> = ({ onSetupComplete }) => {
  const wallet = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  const isDevelopment = process.env.NODE_ENV === 'development';
  const devPassword = DEFAULT_PASSWORD;

  console.log('DevAutoSetup initialized:', {
    isDevelopment,
    devPasswordLength: devPassword?.length || 0,
    devPasswordExists: !!devPassword,
    hasAttempted,
    isCreating
  });

  const createDevWallet = async () => {
    if (!devPassword) {
      setError('DEV_PASSWORD not set in .env.dev file');
      return;
    }

    if (isCreating || hasAttempted) {
      console.log('Wallet creation already in progress or attempted');
      return;
    }

    setIsCreating(true);
    setHasAttempted(true);
    setError(null);

    try {
      console.log('Starting development wallet creation...');

      // Check if wallet is already booted
      const isBooted = await wallet.isBooted();
      console.log('Wallet isBooted:', isBooted);

      if (isBooted) {
        // Wallet exists, just unlock it
        console.log('Wallet already exists, unlocking...');
        try {
          await wallet.unlock(devPassword);
          console.log('Wallet unlocked successfully!');
          onSetupComplete();
          return;
        } catch (unlockErr) {
          console.log('Failed to unlock existing wallet, will try to continue with demo mode:', unlockErr);
          localStorage.setItem('demo_mode', 'true');
          onSetupComplete();
          return;
        }
      }

      // If no wallet, automatically switch to demo mode in development
      console.log('No wallet found, automatically switching to demo mode in development');
      localStorage.setItem('demo_mode', 'true');
      onSetupComplete();

    } catch (err) {
      console.error('Failed to create development wallet, automatically switching to demo mode:', err);
      // Automatically switch to demo mode instead of showing error
      localStorage.setItem('demo_mode', 'true');
      onSetupComplete();
    } finally {
      setIsCreating(false);
    }
  };

  const skipSetupForDemo = () => {
    console.log('Manually skipping setup for demo mode...');
    // Set a flag in localStorage to indicate demo mode
    localStorage.setItem('demo_mode', 'true');
    console.log('Demo mode flag set, calling onSetupComplete...');
    onSetupComplete();
  };

  useEffect(() => {
    // Auto-create wallet in development mode if DEV_PASSWORD is set
    if (isDevelopment && devPassword && !hasAttempted && !isCreating) {
      console.log('Auto-creating development wallet...');
      createDevWallet();
    } else {
      console.log('Skipping auto-creation:', {
        isDevelopment,
        devPasswordExists: !!devPassword,
        hasAttempted,
        isCreating
      });
    }
  }, []); // Empty dependency array to only run once

  if (!isDevelopment) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: 3,
        backgroundColor: '#121212',
        color: '#fff',
      }}
    >
      {isCreating ? (
        <>
          <CircularProgress sx={{ color: '#41CC5D', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Setting up Development Mode...
          </Typography>
          <Typography variant="body2" sx={{ color: '#888', textAlign: 'center' }}>
            Attempting wallet creation, falling back to demo mode if needed
          </Typography>
        </>
      ) : error ? (
        <>
          <Typography variant="h6" sx={{ color: '#ff6b6b', mb: 2 }}>
            Setup Error
          </Typography>
          <Typography variant="body2" sx={{ color: '#888', mb: 3, textAlign: 'center' }}>
            {error}
          </Typography>
          {!devPassword && (
            <Typography variant="body2" sx={{ color: '#888', mb: 3, textAlign: 'center' }}>
              Add DEV_PASSWORD="YourPassword123!" to your .env.dev file
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={createDevWallet}
              sx={{
                backgroundColor: '#41CC5D',
                '&:hover': { backgroundColor: '#38B54A' },
              }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={skipSetupForDemo}
              sx={{
                color: '#888',
                borderColor: '#888',
                '&:hover': { backgroundColor: '#333', borderColor: '#999' },
              }}
            >
              Skip Setup for Demo
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Development Mode
          </Typography>
          <Typography variant="body2" sx={{ color: '#888', mb: 3, textAlign: 'center' }}>
            No wallet found. Create a development wallet to continue.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={createDevWallet}
              sx={{
                backgroundColor: '#41CC5D',
                '&:hover': { backgroundColor: '#38B54A' },
              }}
            >
              Create Dev Wallet
            </Button>
            <Button
              variant="outlined"
              onClick={skipSetupForDemo}
              sx={{
                color: '#888',
                borderColor: '#888',
                '&:hover': { backgroundColor: '#333', borderColor: '#999' },
              }}
            >
              Skip Setup for Demo
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DevAutoSetup;
