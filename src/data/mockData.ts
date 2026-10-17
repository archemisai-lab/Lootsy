import {
  UserProfile,
  GameUpdate,
  Group,
  GroupMember,
  GroupInvite,
  Challenge,
  ChallengeParticipant,
  AppNotification,
  XpLedgerEntry,
  NewsCategory,
  AuditLog,
  Report,
} from '../types';

export const initialCategories: NewsCategory[] = [
  {
    id: 'seasons',
    name: { fr: 'Saison & Mises à jour', en: 'Seasons & Updates' },
  },
  {
    id: 'weapons',
    name: { fr: 'Armes & Objets', en: 'Weapons & Items' },
  },
  {
    id: 'map',
    name: { fr: 'Carte & Lieux', en: 'Map & POIs' },
  },
  {
    id: 'events',
    name: { fr: 'Événements temporaires', en: 'Limited-Time Events' },
  },
  {
    id: 'modes',
    name: { fr: 'Modes de jeu', en: 'Game Modes' },
  },
  {
    id: 'challenges',
    name: { fr: 'Défis & Nouveautés', en: 'Challenges & Quests' },
  },
  {
    id: 'esports',
    name: { fr: 'Compétition & Esport', en: 'Competitive & Esports' },
  },
];

export const initialUsers: UserProfile[] = [
  {
    uid: 'user-1',
    email: 'alex@lootsy.gg',
    displayName: 'Alex_Valkyrie',
    preferredLanguage: 'fr',
    interests: ['seasons', 'weapons', 'map'],
    role: 'admin',
    accountStatus: 'active',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-10-15T14:30:00.000Z',
    onboardingCompleted: true,
    xp: 680,
    privacySettings: {
      profileVisibility: 'public_in_groups',
      activityVisibility: 'friends_in_groups',
    },
    notificationPreferences: {
      pushEnabled: true,
      newChallenges: true,
      challengeUpdates: true,
      friendCompletion: true,
      dueReminders: true,
      newsCategories: true,
      adminAnnouncements: true,
    },
  },
  {
    uid: 'user-2',
    email: 'sarah@lootsy.gg',
    displayName: 'Sarah_Shadow',
    preferredLanguage: 'fr',
    interests: ['weapons', 'challenges'],
    role: 'user',
    accountStatus: 'active',
    createdAt: '2026-03-05T12:00:00.000Z',
    updatedAt: '2026-10-16T18:00:00.000Z',
    onboardingCompleted: true,
    xp: 320,
    privacySettings: {
      profileVisibility: 'public_in_groups',
      activityVisibility: 'friends_in_groups',
    },
    notificationPreferences: {
      pushEnabled: false,
      newChallenges: true,
      challengeUpdates: true,
      friendCompletion: true,
      dueReminders: true,
      newsCategories: true,
      adminAnnouncements: true,
    },
  },
  {
    uid: 'user-3',
    email: 'lucas@lootsy.gg',
    displayName: 'Lucas_Sniper',
    preferredLanguage: 'en',
    interests: ['seasons', 'esports'],
    role: 'user',
    accountStatus: 'active',
    createdAt: '2026-03-10T16:00:00.000Z',
    updatedAt: '2026-10-17T09:00:00.000Z',
    onboardingCompleted: true,
    xp: 150,
    privacySettings: {
      profileVisibility: 'public_in_groups',
      activityVisibility: 'friends_in_groups',
    },
    notificationPreferences: {
      pushEnabled: true,
      newChallenges: true,
      challengeUpdates: true,
      friendCompletion: false,
      dueReminders: true,
      newsCategories: false,
      adminAnnouncements: true,
    },
  },
];

export const initialNews: GameUpdate[] = [
  {
    id: 'news-1',
    gameId: 'fortnite',
    slug: 'patch-mythes-mortels-equilibrage-olympe',
    categoryId: 'seasons',
    title: {
      fr: 'Mise à jour v29.20 : Équilibrage des pouvoirs mythiques et portails de l’Olympe',
      en: 'Update v29.20: Mythic Powers Balancing & Mount Olympus Portals',
    },
    summary: {
      fr: 'Ajustement de la cadence de l’Éclair de Zeus, réduction du recul du Fusil d’assaut guerrier et nouveaux sanctuaires souterrains découverts.',
      en: 'Cadence adjustment for Zeus’ Lightning, recoil tuning for the Warforged AR, and new underworld shrines uncovered across the island.',
    },
    body: {
      fr: `Le déploiement de la mise à jour v29.20 apporte une série d’ajustements majeurs pour la compétition et le jeu en groupe :

1. Éclair de Zeus : Le temps de recharge entre les trois frappes passe de 1.2s à 1.45s pour offrir une fenêtre de riposte aux joueurs sous abri.
2. Fusil à pompe gardien : Légère augmentation des dégâts à bout portant (+4 dégâts sur les raretés Rare et Épique).
3. Sanctuaires de l’Enfer : Deux nouveaux portails souterrains s’ouvrent près de Grim Gate, contenant des coffres mythiques et des autels de sacrifice pour recharger votre bouclier.
4. Chaînes d’Hadès : Ajustement de la portée de traction pour une meilleure fluidité en combat rapproché.

Consultez le blog officiel d’Epic Games pour les notes techniques complètes.`,
      en: `The v29.20 balance patch brings a series of tactical improvements for squad encounters:

1. Thunderbolt of Zeus: Cooldown between strikes increased from 1.2s to 1.45s, granting clearer counterplay windows.
2. Gatekeeper Shotgun: Moderate damage buff in point-blank range (+4 damage on Rare and Epic tiers).
3. Underworld Rifts: Two subterranean gates opened near Grim Gate featuring mythic loot containers and shield altars.
4. Chains of Hades: Pull trajectory smoothed for competitive consistency.

Refer to the official Epic Games release notes for full telemetry data.`,
    },
    sourceUrl: 'https://www.fortnite.com/news',
    sourceName: 'Epic Games Newsroom',
    imagePath: '/src/assets/images/fn_underworld_fortress_1792263045549.jpg',
    status: 'published',
    createdBy: 'user-1',
    updatedBy: 'user-1',
    createdAt: '2026-10-12T10:00:00.000Z',
    updatedAt: '2026-10-12T10:00:00.000Z',
    publishedAt: '2026-10-12T10:30:00.000Z',
    languageAvailability: ['fr', 'en'],
  },
  {
    id: 'news-2',
    gameId: 'fortnite',
    slug: 'arsenal-mythique-ailes-icare-chaines-hades',
    categoryId: 'weapons',
    title: {
      fr: 'Pleins feux sur l’arsenal : Maîtriser les Ailes d’Icare et les Chaînes d’Hadès',
      en: 'Arsenal Spotlight: Mastering the Wings of Icarus & Chains of Hades',
    },
    summary: {
      fr: 'Guide tactique officiel sur la gestion de l’endurance en vol et l’utilisation des enchaînements au corps à corps.',
      en: 'Official tactical briefing on aerial stamina management and lethal close-quarters combat combos.',
    },
    body: {
      fr: `Les Ailes d’Icare permettent désormais des manœuvres d’esquive en l’air avec un coût d’endurance réduit de 15 %. Toutefois, subir des dégâts soutenus en plein vol provoque toujours une perte temporaire de contrôle.

Conseil d’escouade : Associez les Chaînes d’Hadès à un coéquipier équipé d’un Fusil à pompe automatique pour punir les adversaires attirés hors de leur couverture.`,
      en: `Wings of Icarus now grant aerial dodge maneuvers with a 15% stamina reduction. However, sustained damage during flight still causes temporary control loss.

Squad Tactic: Pair Chains of Hades with a shotgun-wielding teammate to decisively ambush pulled opponents.`,
    },
    sourceUrl: 'https://www.fortnite.com/news',
    sourceName: 'Epic Games Tactical Hub',
    imagePath: '/src/assets/images/fn_mythic_weapons_1792263045780.jpg',
    status: 'published',
    createdBy: 'user-1',
    updatedBy: 'user-1',
    createdAt: '2026-10-08T09:15:00.000Z',
    updatedAt: '2026-10-08T09:15:00.000Z',
    publishedAt: '2026-10-08T09:30:00.000Z',
    languageAvailability: ['fr', 'en'],
  },
  {
    id: 'news-3',
    gameId: 'fortnite',
    slug: 'carte-chapitre-5-rotation-pois-grim-gate',
    categoryId: 'map',
    title: {
      fr: 'Rotation de l’île : Nouveau tracé de tempête et sanctuaires de Grim Gate',
      en: 'Island Rotation: Revised Storm Circles & Grim Gate Shrines',
    },
    summary: {
      fr: 'Les 3 premières zones de tempête s’accélèrent de 20 secondes. Grim Gate devient le point chaud le plus disputé.',
      en: 'Early storm phases accelerate by 20 seconds. Grim Gate emerges as the most contested drop zone.',
    },
    body: {
      fr: `La cadence des parties s’accélère pour intensifier les affrontements en milieu de partie. Grim Gate et le Mont Olympe concentrent désormais 45 % des combats en début de partie. Prévoyez vos itinéraires de rotation à l’aide des tyroliennes et des cours d’eau du Styx.`,
      en: `Mid-game match pacing has been accelerated to drive squad skirmishes. Grim Gate and Mount Olympus now host over 45% of initial drop fights. Map out your rotations using the Styx waterways.`,
    },
    sourceUrl: 'https://www.fortnite.com/news',
    sourceName: 'Fortnite Island Map Service',
    imagePath: '/src/assets/images/fn_island_landscape_1792263047007.jpg',
    status: 'published',
    createdBy: 'user-1',
    updatedBy: 'user-1',
    createdAt: '2026-10-02T14:00:00.000Z',
    updatedAt: '2026-10-02T14:00:00.000Z',
    publishedAt: '2026-10-02T14:30:00.000Z',
    languageAvailability: ['fr', 'en'],
  },
  {
    id: 'news-4',
    gameId: 'fortnite',
    slug: 'coupe-couronne-de-victoire-section',
    categoryId: 'esports',
    title: {
      fr: 'Coupe Couronne de Victoire : Calendrier officiel des tournois de section',
      en: 'Victory Crown Cup: Official Squad Tournament Schedule',
    },
    summary: {
      fr: 'Les tournois du week-end mettent en jeu des émotes commémoratives et des points de classement pour les escouades atteignant le Top 10.',
      en: 'Weekend tournaments offer commemorative cosmetics and bracket points for squads finishing in the top 10.',
    },
    body: {
      fr: `Rassemblez votre escouade de 4 joueurs chaque samedi de 19h à 22h. Format 10 parties maximum en Battle Royale Section avec éliminations valorisées à 2 points et Top 1 valorisé à 25 points.`,
      en: `Assemble your 4-player squad every Saturday from 7 PM to 10 PM. Max 10 matches in Battle Royale Squad format with eliminations at 2 points and Victory Royale at 25 points.`,
    },
    sourceUrl: 'https://www.fortnite.com/competitive',
    sourceName: 'Fortnite Competitive Hub',
    imagePath: '/src/assets/images/fn_victory_crown_1792263047262.jpg',
    status: 'published',
    createdBy: 'user-1',
    updatedBy: 'user-1',
    createdAt: '2026-09-28T16:00:00.000Z',
    updatedAt: '2026-09-28T16:00:00.000Z',
    publishedAt: '2026-09-28T17:00:00.000Z',
    languageAvailability: ['fr', 'en'],
  },
];

export const initialGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Squad Royale Valkyrie',
    description: 'Notre escouade principale pour les sessions du week-end et la chasse aux couronnes.',
    ownerUid: 'user-1',
    memberUids: ['user-1', 'user-2', 'user-3'],
    memberCount: 3,
    createdAt: '2026-03-01T10:15:00.000Z',
    updatedAt: '2026-10-15T12:00:00.000Z',
    status: 'active',
  },
  {
    id: 'group-2',
    name: 'Gladiateurs de l’Olympe',
    description: 'Groupe d’entraînement tactique centré sur les éliminations de boss et armes mythiques.',
    ownerUid: 'user-2',
    memberUids: ['user-2', 'user-1'],
    memberCount: 2,
    createdAt: '2026-04-12T18:00:00.000Z',
    updatedAt: '2026-10-10T09:30:00.000Z',
    status: 'active',
  },
];

export const initialMembers: GroupMember[] = [
  {
    uid: 'user-1',
    role: 'owner',
    joinedAt: '2026-03-01T10:15:00.000Z',
    status: 'active',
    displayName: 'Alex_Valkyrie',
  },
  {
    uid: 'user-2',
    role: 'member',
    joinedAt: '2026-03-05T12:30:00.000Z',
    status: 'active',
    displayName: 'Sarah_Shadow',
  },
  {
    uid: 'user-3',
    role: 'member',
    joinedAt: '2026-03-10T16:15:00.000Z',
    status: 'active',
    displayName: 'Lucas_Sniper',
  },
];

export const initialInvites: GroupInvite[] = [
  {
    id: 'inv-1',
    code: 'LOOT-VALK-2026',
    groupId: 'group-1',
    createdBy: 'user-1',
    createdAt: '2026-03-01T10:20:00.000Z',
    expiresAt: null,
    revokedAt: null,
    maxUses: 10,
    usesCount: 2,
    status: 'active',
  },
];

export const initialChallenges: Challenge[] = [
  {
    id: 'chal-1',
    groupId: 'group-1',
    title: 'Top 1 Victoire Royale en section complète',
    description: 'Décrochez une Victoire Royale avec l’ensemble des membres de l’escouade encore en vie lors du cercle final.',
    createdBy: 'user-1',
    status: 'active',
    createdAt: '2026-10-14T11:00:00.000Z',
    updatedAt: '2026-10-14T11:00:00.000Z',
    dueAt: '2026-10-28T23:59:59.000Z',
    proofPolicy: 'optional',
    validationPolicy: 'creator_or_admin',
    xpReward: 150,
    participantUids: ['user-1', 'user-2', 'user-3'],
    gameId: 'fortnite',
  },
  {
    id: 'chal-2',
    groupId: 'group-1',
    title: 'Élimination du Boss Hadès au Monde des Enfers',
    description: 'Vaincre le boss Hadès à Grim Gate et récupérer son médaillon et ses chaînes mythiques.',
    createdBy: 'user-1',
    status: 'active',
    createdAt: '2026-10-15T09:00:00.000Z',
    updatedAt: '2026-10-15T09:00:00.000Z',
    dueAt: '2026-10-25T20:00:00.000Z',
    proofPolicy: 'required',
    validationPolicy: 'creator_or_admin',
    xpReward: 200,
    participantUids: ['user-1', 'user-2', 'user-3'],
    gameId: 'fortnite',
  },
  {
    id: 'chal-3',
    groupId: 'group-1',
    title: 'Maîtrise du fusil à pompe gardien : 5 éliminations',
    description: 'Infliger des éliminations décisives au corps à corps lors d’une seule et même partie.',
    createdBy: 'user-2',
    status: 'completed',
    createdAt: '2026-10-05T14:00:00.000Z',
    updatedAt: '2026-10-09T18:00:00.000Z',
    dueAt: '2026-10-10T23:59:00.000Z',
    proofPolicy: 'optional',
    validationPolicy: 'creator_or_admin',
    xpReward: 100,
    participantUids: ['user-1', 'user-2'],
    gameId: 'fortnite',
  },
];

export const initialParticipants: ChallengeParticipant[] = [
  {
    uid: 'user-2',
    challengeId: 'chal-1',
    status: 'submitted',
    submittedAt: '2026-10-16T19:30:00.000Z',
    xpAwarded: 0,
    proof: {
      id: 'proof-1',
      mediaType: 'image',
      mediaUrl: '/src/assets/images/fn_victory_crown_1792263047262.jpg',
      uploadedAt: '2026-10-16T19:30:00.000Z',
      uploadedBy: 'user-2',
      status: 'pending',
      notes: 'Victoire Royale enregistrée à Grim Gate avec 14 éliminations d’équipe !',
    },
    updatedAt: '2026-10-16T19:30:00.000Z',
  },
  {
    uid: 'user-3',
    challengeId: 'chal-1',
    status: 'completed_unverified',
    submittedAt: '2026-10-16T21:00:00.000Z',
    completedAt: '2026-10-16T21:00:00.000Z',
    xpAwarded: 75,
    xpAwardedAt: '2026-10-16T21:00:00.000Z',
    updatedAt: '2026-10-16T21:00:00.000Z',
  },
  {
    uid: 'user-1',
    challengeId: 'chal-1',
    status: 'not_started',
    xpAwarded: 0,
    updatedAt: '2026-10-14T11:00:00.000Z',
  },
  {
    uid: 'user-1',
    challengeId: 'chal-3',
    status: 'completed_verified',
    submittedAt: '2026-10-08T15:00:00.000Z',
    completedAt: '2026-10-08T15:15:00.000Z',
    verifiedAt: '2026-10-08T15:15:00.000Z',
    verifiedBy: 'user-2',
    xpAwarded: 100,
    xpAwardedAt: '2026-10-08T15:15:00.000Z',
    updatedAt: '2026-10-08T15:15:00.000Z',
  },
  {
    uid: 'user-2',
    challengeId: 'chal-3',
    status: 'completed_verified',
    submittedAt: '2026-10-07T18:00:00.000Z',
    completedAt: '2026-10-07T18:10:00.000Z',
    verifiedAt: '2026-10-07T18:10:00.000Z',
    verifiedBy: 'user-1',
    xpAwarded: 100,
    xpAwardedAt: '2026-10-07T18:10:00.000Z',
    updatedAt: '2026-10-07T18:10:00.000Z',
  },
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    uid: 'user-1',
    type: 'proof_submitted',
    title: {
      fr: 'Nouvelle preuve en attente de vérification',
      en: 'New proof awaiting verification',
    },
    body: {
      fr: 'Sarah_Shadow a soumis une preuve pour le défi "Top 1 Victoire Royale en section complète".',
      en: 'Sarah_Shadow submitted proof for "Squad Victory Royale with 0 revives".',
    },
    targetPath: '/app/challenges/chal-1',
    eventId: 'evt-chal-1-submit-sarah',
    createdAt: '2026-10-16T19:30:00.000Z',
    readAt: null,
    status: 'unread',
  },
  {
    id: 'notif-2',
    uid: 'user-1',
    type: 'news_published',
    title: {
      fr: 'Radar : Mise à jour v29.20 disponible',
      en: 'Radar: Update v29.20 is live',
    },
    body: {
      fr: 'Consultez les nouveaux équilibrages sur l’Éclair de Zeus et les portails souterrains.',
      en: 'Check the new weapon balance for Zeus’ Lightning and underworld shrines.',
    },
    targetPath: '/app/news/news-1',
    eventId: 'evt-news-1-pub',
    createdAt: '2026-10-12T10:30:00.000Z',
    readAt: '2026-10-12T11:00:00.000Z',
    status: 'read',
  },
];

export const initialLedger: XpLedgerEntry[] = [
  {
    id: 'ledger-1',
    uid: 'user-1',
    challengeId: 'chal-3',
    groupId: 'group-1',
    reason: 'Réussite validée par Sarah_Shadow',
    amount: 100,
    createdAt: '2026-10-08T15:15:00.000Z',
    idempotencyKey: 'chal-3-user-1-reward',
  },
  {
    id: 'ledger-2',
    uid: 'user-2',
    challengeId: 'chal-3',
    groupId: 'group-1',
    reason: 'Réussite validée par Alex_Valkyrie',
    amount: 100,
    createdAt: '2026-10-07T18:10:00.000Z',
    idempotencyKey: 'chal-3-user-2-reward',
  },
  {
    id: 'ledger-3',
    uid: 'user-3',
    challengeId: 'chal-1',
    groupId: 'group-1',
    reason: 'Déclaration sur l’honneur (sans preuve)',
    amount: 75,
    createdAt: '2026-10-16T21:00:00.000Z',
    idempotencyKey: 'chal-1-user-3-reward',
  },
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    actorUid: 'user-1',
    actorName: 'Alex_Valkyrie',
    action: 'NEWS_PUBLISHED',
    targetType: 'gameUpdate',
    targetId: 'news-1',
    createdAt: '2026-10-12T10:30:00.000Z',
    details: { slug: 'patch-mythes-mortels-equilibrage-olympe' },
  },
  {
    id: 'log-2',
    actorUid: 'user-1',
    actorName: 'Alex_Valkyrie',
    action: 'CHALLENGE_CREATED',
    targetType: 'challenge',
    targetId: 'chal-1',
    createdAt: '2026-10-14T11:00:00.000Z',
    details: { groupId: 'group-1', xpReward: 150 },
  },
];

export const initialReports: Report[] = [
  {
    id: 'rep-1',
    reportedBy: 'user-3',
    targetType: 'challenge',
    targetId: 'chal-2',
    groupId: 'group-1',
    reason: 'Conditions d’échéance ambiguës',
    description: 'La date limite tombe en plein milieu de la maintenance des serveurs Epic.',
    status: 'new',
    createdAt: '2026-10-16T08:00:00.000Z',
  },
];
