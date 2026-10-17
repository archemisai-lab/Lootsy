import React from 'react';
import { ParticipantStatus, ChallengeStatus, UserRole, GroupRole } from '../types';
import { CheckCircle2, Clock, XCircle, AlertCircle, Shield, Award } from 'lucide-react';

interface StatusBadgeProps {
  status: ParticipantStatus | ChallengeStatus | UserRole | GroupRole;
  language?: 'fr' | 'en';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, language = 'fr' }) => {
  switch (status) {
    case 'completed_verified':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D8E5B0]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#D8E5B0]" />
          <span>{language === 'fr' ? 'Validé' : 'Verified'}</span>
        </span>
      );
    case 'completed_unverified':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-[#B5AA9C]">
          <Award className="w-3.5 h-3.5 text-[#B5AA9C]" />
          <span>{language === 'fr' ? 'Déclaré (non vérifié)' : 'Claimed (Unverified)'}</span>
        </span>
      );
    case 'submitted':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-[#FF6538]">
          <Clock className="w-3.5 h-3.5 text-[#FF6538]" />
          <span>{language === 'fr' ? 'Preuve en attente' : 'Pending Review'}</span>
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-rose-400">
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>{language === 'fr' ? 'Refusé' : 'Rejected'}</span>
        </span>
      );
    case 'contested':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-amber-400">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'fr' ? 'Contesté' : 'Contested'}</span>
        </span>
      );
    case 'active':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D8E5B0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D8E5B0]" />
          <span>{language === 'fr' ? 'En cours' : 'Active'}</span>
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-[#B5AA9C]">
          <span>{language === 'fr' ? 'Terminé' : 'Completed'}</span>
        </span>
      );
    case 'expired':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-stone-400">
          <span>{language === 'fr' ? 'Expiré' : 'Expired'}</span>
        </span>
      );
    case 'owner':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D8E5B0]">
          <span>{language === 'fr' ? 'Propriétaire' : 'Owner'}</span>
        </span>
      );
    case 'admin':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF6538]">
          <Shield className="w-3 h-3 text-[#FF6538]" />
          <span>Admin</span>
        </span>
      );
    case 'not_started':
      return (
        <span className="text-xs text-[#B5AA9C]">
          {language === 'fr' ? 'Non commencé' : 'Not started'}
        </span>
      );
    case 'member':
      return (
        <span className="text-xs text-[#B5AA9C]">
          {language === 'fr' ? 'Membre' : 'Member'}
        </span>
      );
    case 'draft':
      return (
        <span className="text-xs text-[#B5AA9C]">
          {language === 'fr' ? 'Brouillon' : 'Draft'}
        </span>
      );
    case 'cancelled':
      return (
        <span className="text-xs text-rose-400">
          {language === 'fr' ? 'Annulé' : 'Cancelled'}
        </span>
      );
    default:
      return (
        <span className="text-xs text-[#B5AA9C]">
          {status}
        </span>
      );
  }
};
