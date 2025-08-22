import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Pinterest, 
  MailOutline,
  Flag 
} from '@mui/icons-material';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  TextField, 
  Button,
  Divider,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const StyledFooter = styled(Box)(({ theme }) => ({
    backgroundColor: '#006644',
    color: theme.palette.common.white,
    padding: theme.spacing(3, 2),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2, 1),
    },
  }));

  const SocialIcon = styled(IconButton)(({ theme }) => ({
    color: theme.palette.common.white,
    marginRight: theme.spacing(1),
    fontSize: '1.5rem',
    '&:hover': {
      color: '#FFC72C',
      backgroundColor: 'transparent',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem',
      marginRight: theme.spacing(0.5),
    },
  }));

  return (
    <StyledFooter component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <Flag sx={{ color: '#FFC72C', mr: 1, fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                SphereStay Kenya
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              fontStyle="italic" 
              mb={2}
              sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
            >
              Discover, Explore, Experience.
            </Typography>
            
            {/* Social Media */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <SocialIcon aria-label="Facebook" href="https://facebook.com">
                <Facebook fontSize="inherit" />
              </SocialIcon>
              <SocialIcon aria-label="Twitter" href="https://twitter.com">
                <Twitter fontSize="inherit" />
              </SocialIcon>
              <SocialIcon aria-label="Instagram" href="https://instagram.com">
                <Instagram fontSize="inherit" />
              </SocialIcon>
              <SocialIcon aria-label="Pinterest" href="https://pinterest.com">
                <Pinterest fontSize="inherit" />
              </SocialIcon>
            </Box>
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              sx={{ 
                borderBottom: '2px solid #FFC72C', 
                pb: 1,
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              Quick Links
            </Typography>
            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                href="/about" 
                color="inherit" 
                underline="hover"
                sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                color="inherit" 
                underline="hover"
                sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
              >
                Contact
              </Link>
              <Link 
                href="/terms" 
                color="inherit" 
                underline="hover"
                sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
              >
                Terms of Service
              </Link>
              <Link 
                href="/policy" 
                color="inherit" 
                underline="hover"
                sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
              >
                Privacy Policy
              </Link>
            </Box>
          </Grid>

          {/* Newsletter Column */}
          <Grid item xs={12} sm={6} md={5}>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              sx={{ 
                borderBottom: '2px solid #FFC72C', 
                pb: 1,
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              Stay Updated
            </Typography>
            <Typography 
              variant="body2" 
              mb={2}
              sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
            >
              Subscribe to our newsletter for the latest deals and travel tips in Kenya.
            </Typography>
            
            <Box 
              component="form" 
              display="flex" 
              flexDirection={{ xs: 'column', sm: 'row' }} 
              gap={{ xs: 1, sm: 2 }} 
              mb={2}
            >
              <TextField
                variant="outlined"
                placeholder="Your email address"
                size="small"
                fullWidth
                sx={{ 
                  backgroundColor: theme => theme.palette.common.white,
                  borderRadius: 1,
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.85rem', md: '0.875rem' },
                    padding: { xs: '8px', md: '10px' },
                  }
                }}
              />
              <Button 
                variant="contained" 
                startIcon={<MailOutline />}
                sx={{ 
                  backgroundColor: '#E83A17',
                  '&:hover': { backgroundColor: '#FFC72C' },
                  padding: { xs: '8px 16px', md: '10px 20px' },
                  fontSize: { xs: '0.85rem', md: '0.875rem' },
                  whiteSpace: 'nowrap',
                }}
              >
                Subscribe
              </Button>
            </Box>
            <Typography 
              variant="body2"
              sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
            >
              Email: spherestaykenya@gmail.com
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 2, md: 3 }, backgroundColor: '#FFC72C' }} />

        {/* Copyright Section */}
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems="center"
          gap={{ xs: 2, sm: 0 }}
        >
          <Box display="flex" alignItems="center">
            <Flag sx={{ color: '#FFC72C', mr: 1, fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
            <Typography 
              variant="body2"
              sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
            >
              © {currentYear} SphereStay Kenya. All rights reserved.
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: { xs: '0.85rem', md: '0.875rem' }
            }}
          >
            Proudly Kenyan <span style={{ marginLeft: 4 }}>🇰🇪</span>
          </Typography>
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;