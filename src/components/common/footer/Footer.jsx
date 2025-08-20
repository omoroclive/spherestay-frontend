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
  padding: theme.spacing(4, 0),
  width: '100%',
}));

  const SocialIcon = styled(IconButton)(({ theme }) => ({
    color: theme.palette.common.white,
    '&:hover': {
      color: '#FFC72C',
      backgroundColor: 'transparent',
    },
  }));

  return (
    <StyledFooter component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <Flag sx={{ color: '#FFC72C', mr: 1 }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                SphereStay Kenya
              </Typography>
            </Box>
            <Typography variant="body2" fontStyle="italic" mb={2}>
              Discover, Explore, Experience.
            </Typography>
            
            {/* Social Media */}
            <Box>
              <SocialIcon aria-label="Facebook" href="https://facebook.com">
                <Facebook />
              </SocialIcon>
              <SocialIcon aria-label="Twitter" href="https://twitter.com">
                <Twitter />
              </SocialIcon>
              <SocialIcon aria-label="Instagram" href="https://instagram.com">
                <Instagram />
              </SocialIcon>
              <SocialIcon aria-label="Pinterest" href="https://pinterest.com">
                <Pinterest />
              </SocialIcon>
            </Box>
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ borderBottom: '2px solid #FFC72C', pb: 1 }}>
              Quick Links
            </Typography>
            <Box component="nav">
              <Link href="/about" color="inherit" display="block" mb={1} underline="hover">About Us</Link>
              <Link href="/contact" color="inherit" display="block" mb={1} underline="hover">Contact</Link>
              <Link href="/terms" color="inherit" display="block" mb={1} underline="hover">Terms of Service</Link>
              <Link href="/policy" color="inherit" display="block" underline="hover">Privacy Policy</Link>
            </Box>
          </Grid>

          {/* Newsletter Column */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom sx={{ borderBottom: '2px solid #FFC72C', pb: 1 }}>
              Stay Updated
            </Typography>
            <Typography variant="body2" mb={2}>
              Subscribe to our newsletter for the latest deals and travel tips in Kenya.
            </Typography>
            
            <Box component="form" display="flex" gap={2} mb={2}>
              <TextField
                variant="outlined"
                placeholder="Your email address"
                size="small"
                fullWidth
                sx={{ 
                  backgroundColor: theme => theme.palette.common.white,
                  borderRadius: 1,
                }}
              />
              <Button 
                variant="contained" 
                startIcon={<MailOutline />}
                sx={{ 
                  backgroundColor: '#E83A17',
                  '&:hover': { backgroundColor: '#FFC72C' },
                  padding: '10px 20px',
                }}
              >
                Subscribe
              </Button>
            </Box>
            <Typography variant="body2">
              Email: spherestaykenya@gmail.com
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: '#FFC72C' }} />

        {/* Copyright Section */}
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" mb={{ xs: 2, sm: 0 }}>
            <Flag sx={{ color: '#FFC72C', mr: 1 }} />
            <Typography variant="body2">
              © {currentYear} SphereStay Kenya. All rights reserved.
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            Proudly Kenyan <span style={{ marginLeft: 4 }}>🇰🇪</span>
          </Typography>
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;