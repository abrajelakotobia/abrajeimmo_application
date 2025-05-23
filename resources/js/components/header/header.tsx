import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Headphones, PlusSquare, X, Menu } from 'lucide-react';
import Modal from '@/components/Modal';
import LoginForm from '@/pages/auth/LoginForm';
import RegisterForm from '@/pages/auth/RegisterForm';
import { PageProps } from '@/types';

type NavItem = {
  title: string;
  href: string;
  icon?: React.ReactNode;
  className?: string;
};

const mainNavItems: NavItem[] = [
  { title: 'Immo Next', href: '/' },
  { title: 'Crédit Immobilier', href: '/credit-immobilier' },
  { title: 'Crédit Conso', href: '/credit-conso' },
  { title: 'Boutiques', href: '/boutiques' },
  { title: 'Magazine', href: '/magazine' },
];


export default function Header() {
  const { auth } = usePage<PageProps>().props;
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const openLogin = () => { setShowLogin(true); setMobileMenuOpen(false); };
  const closeLogin = () => setShowLogin(false);
  const openRegister = () => { setShowRegister(true); setMobileMenuOpen(false); };
  const closeRegister = () => setShowRegister(false);

  const handleAuthSuccess = () => {
    window.location.reload();
  };

  const renderDesktopNavItem = (item: NavItem) => (
    <Link
      key={item.title}
      href={item.href}
      className="px-1 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
    >
      {item.title}
    </Link>
  );

  const renderMobileNavItem = (item: NavItem, index: number) => (
    <Link
      key={index}
      href={item.href}
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
      onClick={() => setMobileMenuOpen(false)}
    >
      {item.title}
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et navigation principale */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              >
                <img
                  src="/images/logo.png"
                  alt="Logo AbrajeImmo"
                  className="h-8 w-auto"
                  width={32}
                  height={32}
                />
                <span className="ml-2 text-xl font-bold text-blue-600 hidden sm:block">
                  AbrajeImmo
                </span>
              </Link>

              <nav className="hidden md:flex ml-10 space-x-6">
                {mainNavItems.map(renderDesktopNavItem)}
              </nav>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {auth.user ? (
                <>
                  <Link
                    href="/posts/create"
                    className="hidden sm:flex items-center bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  >
                    <PlusSquare className="w-4 h-4 mr-2" />
                    Publier une annonce
                  </Link>

                  <Link
                    href="/support"
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Support"
                  >
                    <Headphones className="w-5 h-5 text-gray-700" />
                  </Link>

                  <Link
                    href="/lang/ar"
                    className="hidden sm:block border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    العربية
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={openLogin}
                    className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                  >
                    Se Connecter
                  </button>

                  <button
                    onClick={openRegister}
                    className="hidden sm:flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Créer un compte
                  </button>
                </>
              )}

              {/* Bouton menu mobile */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
            <div className="px-2 pt-2 pb-4 space-y-1">
              {mainNavItems.map(renderMobileNavItem)}

              {auth.user ? (
                <>
                  <Link
                    href="/posts/create"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-rose-500 hover:bg-rose-600"
                  >
                    <PlusSquare className="w-4 h-4 mr-2" />
                    Publier une annonce
                  </Link>
                  <Link
                    href="/lang/ar"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 border border-gray-200 hover:bg-gray-50"
                  >
                    العربية
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={openLogin}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  >
                    Se Connecter
                  </button>
                  <button
                    onClick={openRegister}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Créer un compte
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modale de connexion */}
      <Modal show={showLogin} onClose={closeLogin}>
        <div className="bg-white p-6 sm:p-8 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
            <button
              onClick={closeLogin}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Fermer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <LoginForm
            onSuccess={handleAuthSuccess}
            onRegisterClick={() => {
              closeLogin();
              openRegister();
            }}
            canResetPassword={true}
          />
        </div>
      </Modal>

      {/* Modale d'inscription */}
      <Modal show={showRegister} onClose={closeRegister}>
        <div className="bg-white p-6 sm:p-8 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Inscription</h2>
            <button
              onClick={closeRegister}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Fermer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onLoginClick={() => {
              closeRegister();
              openLogin();
            }}
          />
        </div>
      </Modal>
    </>
  );
}
