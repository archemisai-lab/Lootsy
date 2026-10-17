import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactViewProps {
  navigate: (route: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ navigate }) => {
  const { t } = useApp();
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMessage('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorMessage('Veuillez fournir une adresse e-mail valide.');
      return;
    }

    setStatus('submitting');

    setTimeout(() => {
      setStatus('success');
      setSubject('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#F6F0E7]">
          Contacter l’équipe Lootsy
        </h1>
        <p className="text-xs sm:text-sm text-[#B5AA9C]">
          Une question sur votre compte, une suggestion de défi ou un signalement de contenu ?
        </p>
      </div>

      {status === 'success' ? (
        <div className="p-8 rounded-xl bg-[#1e1a17] border border-[#D8E5B0]/30 text-center space-y-4">
          <CheckCircle2 className="w-10 h-10 text-[#D8E5B0] mx-auto" />
          <h3 className="text-lg font-bold text-[#F6F0E7]">Message bien transmis</h3>
          <p className="text-xs sm:text-sm text-[#B5AA9C] leading-relaxed max-w-md mx-auto">
            Nous avons bien reçu votre demande. Une réponse vous parviendra dans les meilleurs délais à l’adresse électronique indiquée.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="px-4 py-2 text-xs font-semibold text-[#F6F0E7] bg-[#302923] hover:bg-[#3d342c] rounded-lg transition-colors border border-[#302923]"
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-5"
        >
          {status === 'error' && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#F6F0E7]">
              Sujet de la demande <span className="text-[#FF6538]">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Question sur la validation d’un défi ou problème technique"
              className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3.5 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#F6F0E7]">
              Votre adresse e-mail de réponse <span className="text-[#FF6538]">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gamer@exemple.com"
              className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3.5 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#F6F0E7]">
              Message <span className="text-[#FF6538]">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Détaillez votre demande…"
              className="w-full bg-[#171513] border border-[#302923] rounded-lg p-3.5 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
            />
          </div>

          <p className="text-[11px] text-[#B5AA9C]">
            En transmettant ce formulaire, vous consentez au traitement de votre e-mail pour le suivi de votre demande, conformément à notre{' '}
            <button
              type="button"
              onClick={() => navigate('/legal/privacy')}
              className="text-[#FF6538] hover:underline"
            >
              Politique de confidentialité
            </button>.
          </p>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-2.5 px-4 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            {status === 'submitting' ? (
              <span>Envoi en cours…</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer le message</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
