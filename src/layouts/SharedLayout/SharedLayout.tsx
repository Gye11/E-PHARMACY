import { Outlet } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import './SharedLayout.css';

export function SharedLayout() {
  return (
    <div className="shared-layout">
      <Header />
      <div className="shared-layout__body">
        <main className="shared-layout__main">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
