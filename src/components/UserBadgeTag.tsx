import React from 'react';
import { UserBadge } from '../types';
import { Check, Shield, Sparkles, Award, Heart, Clock } from 'lucide-react';

interface UserBadgeTagProps {
  badge: UserBadge;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const UserBadgeTag: React.FC<UserBadgeTagProps> = ({ badge, size = 'sm', showLabel = true }) => {
  if (badge === 'creator') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-bold rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}
        title="Badge Officiel : Créateur Certifié Lootsy"
      >
        <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-extrabold shrink-0 shadow-sm shadow-blue-500/50">
          ✓
        </span>
        {showLabel && <span>Créateur</span>}
      </span>
    );
  }

  if (badge === 'staff') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-bold rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}
        title="Badge Officiel : Staff Lootsy"
      >
        <Shield className="w-3 h-3 text-purple-400" />
        {showLabel && <span>Staff</span>}
      </span>
    );
  }

  if (badge === 'founder') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-bold rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}
        title="Badge : Membre Fondateur"
      >
        <Sparkles className="w-3 h-3 text-amber-400" />
        {showLabel && <span>Fondateur</span>}
      </span>
    );
  }

  if (badge === 'official_group') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-bold rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}
        title="Badge : Groupe Officiel"
      >
        <Award className="w-3 h-3 text-emerald-400" />
        {showLabel && <span>Officiel</span>}
      </span>
    );
  }

  if (badge === 'helpful') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-bold rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}
        title="Badge : Joueur Bienveillant"
      >
        <Heart className="w-3 h-3 text-rose-400" />
        {showLabel && <span>Pilier</span>}
      </span>
    );
  }

  if (badge === 'veteran') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-bold rounded-full bg-neutral-500/15 text-neutral-300 border border-neutral-500/30 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}
        title="Badge : Vétéran"
      >
        <Clock className="w-3 h-3 text-neutral-400" />
        {showLabel && <span>Vétéran</span>}
      </span>
    );
  }

  return null;
};
