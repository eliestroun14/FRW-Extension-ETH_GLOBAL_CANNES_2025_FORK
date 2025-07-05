import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SchoolIcon from '@mui/icons-material/School';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Typography
} from '@mui/material';
import React, { useState } from 'react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  steps: string[];
  completed: boolean;
}

const OnboardingTutorials = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [expandedTutorial, setExpandedTutorial] = useState<string | false>(false);

  const tutorials: Tutorial[] = [
    {
      id: 'defi-basics',
      title: 'DeFi Basics',
      description: 'Learn the fundamentals of Decentralized Finance',
      difficulty: 'beginner',
      duration: '10 min',
      steps: [
        'What is DeFi and how it works',
        'Understanding liquidity pools',
        'Learning about yield farming',
        'Risk management in DeFi',
      ],
      completed: false,
    },
    {
      id: 'flow-staking',
      title: 'Flow Staking Guide',
      description: 'Step-by-step guide to staking FLOW tokens',
      difficulty: 'beginner',
      duration: '15 min',
      steps: [
        'Choose a reliable validator',
        'Delegate your FLOW tokens',
        'Monitor staking rewards',
        'Understand unbonding periods',
      ],
      completed: false,
    },
    {
      id: 'advanced-defi',
      title: 'Advanced DeFi Strategies',
      description: 'Complex strategies for experienced users',
      difficulty: 'advanced',
      duration: '25 min',
      steps: [
        'Multi-protocol yield optimization',
        'Impermanent loss mitigation',
        'Leveraged farming strategies',
        'Risk-adjusted portfolio construction',
      ],
      completed: false,
    },
    {
      id: 'security-best-practices',
      title: 'Security Best Practices',
      description: 'Keep your funds safe in DeFi',
      difficulty: 'intermediate',
      duration: '20 min',
      steps: [
        'Hardware wallet setup',
        'Smart contract risk assessment',
        'Transaction verification',
        'Emergency procedures',
      ],
      completed: false,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const handleAccordionChange = (panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedTutorial(isExpanded ? panel : false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        🎓 Learning Center
      </Typography>

      <Alert severity="info" sx={{ mb: 2, fontSize: '0.8rem' }}>
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
          Complete these tutorials to become a DeFi expert and unlock advanced features!
        </Typography>
      </Alert>

      {/* Quick Start Guide */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <SchoolIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Quick Start: Your First DeFi Action
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>Fund Your Wallet</StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Make sure you have some FLOW tokens in your wallet to start with DeFi.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                  size="small"
                >
                  I have FLOW tokens
                </Button>
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Choose Your First Strategy</StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  For beginners, we recommend starting with FLOW staking (low risk, steady returns).
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                  size="small"
                >
                  Start Staking
                </Button>
                <Button
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                  size="small"
                >
                  Back
                </Button>
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Monitor and Learn</StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Track your rewards and explore more advanced strategies as you learn.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                  size="small"
                >
                  Finish
                </Button>
                <Button
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                  size="small"
                >
                  Back
                </Button>
              </StepContent>
            </Step>
          </Stepper>

          {activeStep === 3 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                🎉 Congratulations! You're ready to start your DeFi journey.
              </Typography>
              <Button onClick={handleReset} size="small">
                Reset Guide
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Detailed Tutorials */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Detailed Tutorials
      </Typography>

      {tutorials.map((tutorial) => (
        <Accordion
          key={tutorial.id}
          expanded={expandedTutorial === tutorial.id}
          onChange={handleAccordionChange(tutorial.id)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {tutorial.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  {tutorial.description}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <Chip
                  label={tutorial.difficulty}
                  color={getDifficultyColor(tutorial.difficulty) as any}
                  size="small"
                  variant="outlined"
                />
                <Typography variant="caption" color="text.secondary">
                  {tutorial.duration}
                </Typography>
                {tutorial.completed && (
                  <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                )}
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                What you'll learn:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {tutorial.steps.map((step, index) => (
                  <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5, fontSize: '0.8rem' }}>
                    {step}
                  </Typography>
                ))}
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              size="small"
              onClick={() => console.log(`Starting tutorial: ${tutorial.id}`)}
            >
              Start Tutorial
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default OnboardingTutorials;
