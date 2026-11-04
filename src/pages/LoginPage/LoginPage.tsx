import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { Logo } from '../../components/Logo/Logo';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import { RegisterForm } from '../../components/LoginForm/RegisterForm';
import pillImg from '../../assets/login-pill.svg';
import './LoginPage.css';

export function LoginPage({ mode = 'login' }: { mode?: 'login' | 'register' }) {
  const isRegister = mode === 'register';

  return (
    <div className="login-page">
      <div className="login-page__top">
        <Logo />
      </div>
      <div className="login-page__grid">
        <section className="login-page__hero">
          <img
            src={pillImg}
            alt=""
            className="login-page__pill"
            width={280}
            height={160}
            loading="eager"
            decoding="async"
          />
          <Typography variant="h3" component="h1" className="login-page__headline">
            Your medication, delivered Say goodbye to all{' '}
            <span className="login-page__accent">your healthcare</span> worries with us
          </Typography>
        </section>
        <section className="login-page__form-wrap">
          {isRegister ? <RegisterForm /> : <LoginForm />}
          {isRegister && (
            <Typography variant="caption" className="login-page__footer-link">
              This demo saves your account in this browser.
            </Typography>
          )}
          <Typography variant="body2" className="login-page__footer-link">
            {isRegister ? (
              <>
                Already have an account? <Link to="/login">Log in</Link>
              </>
            ) : (
              <>
                Don&apos;t have an account? <Link to="/register">Register</Link>
              </>
            )}
          </Typography>
        </section>
      </div>
      <div className="login-page__decor" aria-hidden />
    </div>
  );
}
