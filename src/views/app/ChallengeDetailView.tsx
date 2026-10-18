import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Trophy,
  Clock,
  Users,
  Paperclip,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Upload,
  Eye,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface ChallengeDetailViewProps {
  challengeId: string;
  navigate: (route: string) => void;
}

export const ChallengeDetailView: React.FC<ChallengeDetailViewProps> = ({ challengeId, navigate }) => {
  const {
    currentUser,
    challenges,
    groups,
    participants,
    users,
    submitChallengeClaim,
    reviewProof,
    contestRejection,
    t,
    language,
  } = useApp();

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimHasProof, setClaimHasProof] = useState(true);
  const [claimNotes, setClaimNotes] = useState('');
  const [claimError, setClaimError] = useState<string | null>(null);

  const [reviewingParticipantUid, setReviewingParticipantUid] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);

  const [showContestModal, setShowContestModal] = useState(false);
  const [contestReason, setContestReason] = useState('');
  const [contestError, setContestError] = useState<string | null>(null);

  const challenge = challenges.find((c) => c.id === challengeId);

  if (!currentUser || !challenge) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F6F0E7]">Défi introuvable</h2>
        <button
          onClick={() => navigate('/app/challenges')}
          className="text-xs font-semibold text-[#FF6538] hover:underline"
        >
          Retour aux défis
        </button>
      </div>
    );
  }

  const group = groups.find((g) => g.id === challenge.groupId);
  const creator = users.find((u) => u.uid === challenge.createdBy);
  const myParticipation = participants.find(
    (p) => p.challengeId === challenge.id && p.uid === currentUser.uid
  );
  const challengeParticipants = participants.filter((p) => p.challengeId === challenge.id);

  const isCreatorOrAdmin = challenge.createdBy === currentUser.uid || currentUser.role === 'admin';

  // Handle claim submission
  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimError(null);

    const res = await submitChallengeClaim(challenge.id, {
      hasProof: claimHasProof,
      notes: claimNotes,
      proofUrl: '/src/assets/images/fn_victory_crown_1792263047262.jpg',
    });

    if (res.success) {
      setShowClaimModal(false);
      setClaimNotes('');
    } else {
      setClaimError(res.error || 'Erreur lors de la déclaration.');
    }
  };

  // Handle review
  const handleReviewAccept = async (targetUid: string) => {
    setReviewError(null);
    const res = await reviewProof(challenge.id, targetUid, 'accept');
    if (res.success) {
      setReviewingParticipantUid(null);
    } else {
      setReviewError(res.error || 'Erreur de validation.');
    }
  };

  const handleReviewReject = async (targetUid: string) => {
    setReviewError(null);
    if (!rejectReason.trim()) {
      setReviewError('Un motif de refus est obligatoire.');
      return;
    }
    const res = await reviewProof(challenge.id, targetUid, 'reject', rejectReason);
    if (res.success) {
      setReviewingParticipantUid(null);
      setRejectReason('');
    } else {
      setReviewError(res.error || 'Erreur lors du refus.');
    }
  };

  // Handle contest
  const handleContestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContestError(null);
    const res = await contestRejection(challenge.id, contestReason);
    if (res.success) {
      setShowContestModal(false);
      setContestReason('');
    } else {
      setContestError(res.error || 'Erreur lors de la contestation.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(group ? `/app/groups/${group.id}` : '/app/challenges')}
        className="text-xs text-[#B5AA9C] hover:text-[#F6F0E7] inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#FF6538]" />
        <span>Retour au groupe ({group?.name || 'Groupe'})</span>
      </button>

      {/* Main Challenge Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#B5AA9C]">
              <span className="font-semibold text-[#F6F0E7]">{group?.name}</span>
              <span>·</span>
              <span>Créé par {creator?.displayName || 'Joueur'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7] tracking-tight leading-snug">
              {challenge.title}
            </h1>
          </div>

          <div className="text-right sm:shrink-0">
            <span className="font-display text-2xl sm:text-3xl text-[#FF6538] tracking-wide block">
              +{challenge.xpReward} XP
            </span>
            <span className="text-[11px] text-[#B5AA9C]">Récompense auditable</span>
          </div>
        </div>

        {/* Description & Rules */}
        <div className="p-4 rounded-xl bg-[#171513] border border-[#302923] space-y-1.5">
          <span className="text-[11px] font-semibold text-[#B5AA9C] uppercase tracking-wider block">
            {t('challenges', 'descLabel')}
          </span>
          <p className="text-xs sm:text-sm text-[#F6F0E7] leading-relaxed whitespace-pre-line">
            {challenge.description}
          </p>
        </div>

        {/* Challenge Attributes Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#241f1c] border border-[#302923] space-y-1">
            <span className="text-[#B5AA9C] block text-[11px]">Exigence de preuve</span>
            <span className="font-semibold text-[#F6F0E7]">
              {challenge.proofPolicy === 'required'
                ? 'Preuve obligatoire'
                : challenge.proofPolicy === 'optional'
                ? 'Preuve facultative'
                : 'Sans preuve'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#241f1c] border border-[#302923] space-y-1">
            <span className="text-[#B5AA9C] block text-[11px]">Date limite</span>
            <span className="font-semibold text-[#F6F0E7]">
              {challenge.dueAt ? new Date(challenge.dueAt).toLocaleDateString() : 'Aucune'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#241f1c] border border-[#302923] space-y-1">
            <span className="text-[#B5AA9C] block text-[11px]">Arbitrage</span>
            <span className="font-semibold text-[#F6F0E7]">Par les pairs</span>
          </div>

          <div className="p-3 rounded-lg bg-[#241f1c] border border-[#302923] space-y-1">
            <span className="text-[#B5AA9C] block text-[11px]">Mon statut actuel</span>
            <StatusBadge
              status={myParticipation?.status || 'not_started'}
              language={language}
            />
          </div>
        </div>

        {/* User Interaction Strip */}
        <div className="pt-4 border-t border-[#302923] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#B5AA9C]">
            {myParticipation?.status === 'not_started' && 'Vous n’avez pas encore déclaré votre réussite pour ce défi.'}
            {myParticipation?.status === 'submitted' && 'Votre capture est soumise. En attente de validation par un membre autorisé.'}
            {myParticipation?.status === 'completed_verified' && 'Félicitations ! Votre réussite a été vérifiée et vos XP ont été crédités.'}
            {myParticipation?.status === 'completed_unverified' && 'Déclaration sur l’honneur enregistrée (réussite non vérifiée).'}
            {myParticipation?.status === 'rejected' && `Preuve refusée. Motif : "${myParticipation.rejectionReason}".`}
            {myParticipation?.status === 'contested' && `Contestation en cours d’examen : "${myParticipation.contestReason}".`}
          </div>

          <div className="flex items-center gap-3">
            {myParticipation?.status === 'not_started' && (
              <button
                onClick={() => setShowClaimModal(true)}
                className="px-5 py-2.5 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold transition-colors shadow-sm"
              >
                {t('challenges', 'declareSuccess')}
              </button>
            )}

            {myParticipation?.status === 'rejected' && (
              <button
                onClick={() => setShowContestModal(true)}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
              >
                {t('challenges', 'contestAction')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Participants & Proofs Review Table */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-6">
        <h2 className="text-lg font-bold text-[#F6F0E7] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#FF6538]" />
          <span>Suivi des participants de l’escouade</span>
        </h2>

        <div className="divide-y divide-[#302923] border border-[#302923] rounded-xl overflow-hidden bg-[#171513]">
          {challengeParticipants.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#B5AA9C]">
              Aucun participant enregistré.
            </div>
          ) : (
            challengeParticipants.map((part) => {
              const userObj = users.find((u) => u.uid === part.uid);
              const isMe = part.uid === currentUser.uid;

              return (
                <div key={part.uid} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-[#302923] flex items-center justify-center font-bold text-xs text-[#F6F0E7]">
                        {userObj?.displayName.charAt(0).toUpperCase() || 'P'}
                      </div>
                      <span className="text-xs font-bold text-[#F6F0E7]">
                        {userObj?.displayName} {isMe ? '(Vous)' : ''}
                      </span>
                      <StatusBadge status={part.status} language={language} />
                    </div>

                    {part.proof?.notes && (
                      <p className="text-xs text-[#B5AA9C] italic pl-9">
                        « {part.proof.notes} »
                      </p>
                    )}
                  </div>

                  {/* Proof and Action controls */}
                  <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
                    {part.proof && (
                      <button
                        onClick={() => setReviewingParticipantUid(part.uid)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#25201c] hover:bg-[#302923] border border-[#302923] text-xs font-semibold text-[#F6F0E7] inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#FF6538]" />
                        <span>Voir la preuve</span>
                      </button>
                    )}

                    {part.status === 'submitted' && (
                      <button
                        onClick={() => setReviewingParticipantUid(part.uid)}
                        className="px-3 py-1.5 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white font-bold transition-colors"
                      >
                        Examiner
                      </button>
                    )}

                    {part.xpAwarded > 0 && (
                      <span className="font-mono font-bold text-[#D8E5B0]">
                        +{part.xpAwarded} XP
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Claim Achievement Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#1e1a17] border border-[#302923] max-w-md w-full space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#F6F0E7]">
                {t('challenges', 'submitProofTitle')}
              </h3>
              <p className="text-xs text-[#B5AA9C]">
                {t('challenges', 'submitProofDesc')}
              </p>
            </div>

            {claimError && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{claimError}</span>
              </div>
            )}

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              {/* Proof option toggle if optional */}
              {challenge.proofPolicy === 'optional' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#F6F0E7]">
                    Mode de déclaration
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setClaimHasProof(true)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-colors ${
                        claimHasProof
                          ? 'bg-[#302923] border-[#FF6538] text-[#F6F0E7]'
                          : 'bg-[#171513] border-[#302923] text-[#B5AA9C]'
                      }`}
                    >
                      Avec capture d’écran
                    </button>
                    <button
                      type="button"
                      onClick={() => setClaimHasProof(false)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-colors ${
                        !claimHasProof
                          ? 'bg-[#302923] border-[#FF6538] text-[#F6F0E7]'
                          : 'bg-[#171513] border-[#302923] text-[#B5AA9C]'
                      }`}
                    >
                      Sur l’honneur (sans preuve)
                    </button>
                  </div>
                </div>
              )}

              {/* File upload simulation */}
              {claimHasProof && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#F6F0E7]">
                    Capture ou enregistrement du défi
                  </label>
                  <div className="p-4 rounded-xl border-2 border-dashed border-[#302923] bg-[#171513] text-center space-y-2">
                    <Upload className="w-6 h-6 text-[#FF6538] mx-auto" />
                    <p className="text-xs text-[#F6F0E7] font-semibold">
                      Capture sélectionnée : screenshot_victory.png
                    </p>
                    <p className="text-[11px] text-[#B5AA9C]">
                      Formats autorisés : JPEG, PNG, WebP (max 15 Mo).
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#F6F0E7]">
                  {t('challenges', 'proofNotesLabel')}
                </label>
                <textarea
                  rows={2}
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  placeholder={t('challenges', 'proofNotesPlaceholder')}
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg p-3 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#B5AA9C] hover:text-[#F6F0E7]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold transition-colors"
                >
                  {t('challenges', 'submitDeclaration')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Proof Modal */}
      {reviewingParticipantUid && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#1e1a17] border border-[#302923] max-w-lg w-full space-y-5">
            {(() => {
              const part = participants.find(
                (p) => p.challengeId === challenge.id && p.uid === reviewingParticipantUid
              );
              const partUser = users.find((u) => u.uid === reviewingParticipantUid);
              const isSelf = reviewingParticipantUid === currentUser.uid;

              return (
                <>
                  <div className="flex items-center justify-between border-b border-[#302923] pb-3">
                    <div>
                      <h3 className="text-base font-bold text-[#F6F0E7]">
                        {t('challenges', 'reviewTitle')}
                      </h3>
                      <p className="text-xs text-[#B5AA9C]">
                        Soumis par {partUser?.displayName}
                      </p>
                    </div>
                    <button
                      onClick={() => setReviewingParticipantUid(null)}
                      className="text-xs text-[#B5AA9C] hover:text-[#F6F0E7]"
                    >
                      Fermer
                    </button>
                  </div>

                  {reviewError && (
                    <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  {/* Proof visual */}
                  {part?.proof?.mediaUrl && (
                    <div className="rounded-xl overflow-hidden border border-[#302923] bg-[#12100E] max-h-56">
                      <img
                        src={part.proof.mediaUrl}
                        alt="Preuve"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {part?.proof?.notes && (
                    <p className="text-xs text-[#B5AA9C] italic bg-[#171513] p-3 rounded-lg border border-[#302923]">
                      Commentaire du joueur : « {part.proof.notes} »
                    </p>
                  )}

                  {/* Self-Validation Protection (Spec 16.7) */}
                  {isSelf ? (
                    <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>{t('challenges', 'selfValidationForbidden')}</span>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-[#F6F0E7]">
                          {t('challenges', 'rejectReasonLabel')}
                        </label>
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder={t('challenges', 'rejectReasonPlaceholder')}
                          className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleReviewReject(part!.uid)}
                          className="px-4 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-bold transition-colors"
                        >
                          {t('challenges', 'rejectProof')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReviewAccept(part!.uid)}
                          className="px-5 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold transition-colors"
                        >
                          Valider (+{challenge.xpReward} XP)
                        </button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Contest Rejection Modal */}
      {showContestModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#1e1a17] border border-[#302923] max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-[#F6F0E7]">
              {t('challenges', 'contestTitle')}
            </h3>

            {contestError && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{contestError}</span>
              </div>
            )}

            <form onSubmit={handleContestSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#F6F0E7]">
                  {t('challenges', 'contestReasonLabel')}
                </label>
                <textarea
                  required
                  rows={3}
                  value={contestReason}
                  onChange={(e) => setContestReason(e.target.value)}
                  placeholder={t('challenges', 'contestReasonPlaceholder')}
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg p-3 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContestModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#B5AA9C] hover:text-[#F6F0E7]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
                >
                  {t('challenges', 'submitContest')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
