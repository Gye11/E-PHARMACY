import { Box, IconButton, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo/Logo';
import './Footer.css';

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/', Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/', Icon: InstagramIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/', Icon: YouTubeIcon },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__content">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Logo />
            <Typography variant="body2" className="site-footer__description">
              Your trusted partner for everyday healthcare.
            </Typography>
          </div>
          <nav className="site-footer__navigation" aria-label="Footer navigation">
            <Link to="/shop">Shop</Link>
            <Link to="/products">Medicine</Link>
            <Link to="/dashboard">Statistics</Link>
          </nav>
          <div className="site-footer__socials" aria-label="Social media">
            {socialLinks.map(({ label, href, Icon }) => (
              <IconButton
                key={label}
                component="a"
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="site-footer__social-link"
              >
                <Icon />
              </IconButton>
            ))}
          </div>
        </div>
        <Box className="site-footer__bottom">
          <Typography variant="caption">
            © {new Date().getFullYear()} E-Pharmacy. All rights reserved.
          </Typography>
          <div className="site-footer__legal">
            <a href="mailto:support@e-pharmacy.example?subject=Privacy%20Policy">Privacy Policy</a>
            <a href="mailto:support@e-pharmacy.example?subject=Terms%20and%20Conditions">
              Terms &amp; Conditions
            </a>
          </div>
        </Box>
      </div>
    </footer>
  );
}
