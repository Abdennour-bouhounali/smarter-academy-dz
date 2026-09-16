import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { login as loginRequest } from '../services/authService';
import GoogleButton from '../components/auth/GoogleButton';

/**
 * Où va un utilisateur qui vient de s'authentifier.
 *
 * L'élève dont l'adresse n'est pas prouvée part vers l'écran de vérification :
 * le serveur ferme l'espace d'apprentissage tant qu'elle ne l'est pas, et
 * l'envoyer à /espace lui montrerait une suite de refus sans explication.
 * La décision reste au serveur — ceci ne fait que conduire l'élève là où il
 * peut agir.
 */
function postLoginPath(user) {
  if (user.role === 'admin') return '/admin';
  if (user.role === 'student') {
    return user.emailVerified === false ? '/verification-email' : '/espace';
  }
  return '/';
}

export default function Login() {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(postLoginPath(user));
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await loginRequest(email, password);
      login(data.user, data.token);
      navigate(postLoginPath(data.user));
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 pt-24 pb-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations — purely decorative blurs, not RTL-sensitive
          (a diagonal glow reads the same regardless of reading direction),
          left as physical left/right on purpose. */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 font-display">
          {t('loginTitle')}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {t('loginSubtitle')}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="bg-white/70 backdrop-blur-xl py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-white/50">
          <GoogleButton label={t('continueWithGoogle')} />

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{t('common:or')}</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {errorMsg}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                {t('emailLabel')}
              </label>
              <div className="mt-1">
                {/* dir="ltr": email addresses are Latin-script/punctuation
                    content ('@', '.') that reads better LTR even inside an
                    RTL form — the label above stays RTL, only the input's
                    own text direction is pinned. */}
                <input
                  id="email"
                  name="email"
                  type="email"
                  dir="ltr"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm bg-white/50 backdrop-blur-sm text-start"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                {t('passwordLabel')}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 pr-12 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm bg-white/50 backdrop-blur-sm text-start"
                />
                {/* Reveal-password toggle sits at the FIELD's own end. The field
                    is dir="ltr" (a password is Latin-script data), so that end
                    is the physical right in both page directions — hence a
                    deliberate physical `right-0`, not a logical `end-0`. */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl border border-transparent bg-blue-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
              >
                {loading ? t('loginButtonLoading') : t('loginButton')}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {t('noAccountYet')}{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              {t('registerLink')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
