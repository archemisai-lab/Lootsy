import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrapAdmin() {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (!fs.existsSync(configPath)) {
    console.error('Erreur : fichier firebase-applet-config.json introuvable.');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const app = initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  });

  const auth = getAuth(app);
  const db = getFirestore(app, config.firestoreDatabaseId);

  const adminEmail = process.env.ADMIN_EMAIL || 'archemis.ai@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || '@Yassine2026#Lootsy';
  const adminDisplayName = process.env.ADMIN_NAME || 'LootsyCreator';

  console.log(`[Lootsy] Initialisation sécurisée du compte administrateur : ${adminEmail}...`);

  let uid: string | null = null;

  try {
    const cred = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    uid = cred.user.uid;
    console.log(`[Lootsy] Compte Firebase Auth existant détecté (UID: ${uid}).`);
  } catch (err: any) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        console.log(`[Lootsy] Création du compte dans Firebase Authentication...`);
        const newCred = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        uid = newCred.user.uid;
        await updateProfile(newCred.user, { displayName: adminDisplayName });
        console.log(`[Lootsy] Compte Firebase Auth créé avec succès (UID: ${uid}).`);
      } catch (createErr: any) {
        if (createErr.code === 'auth/operation-not-allowed') {
          console.error('\n============================================================');
          console.error('[ATTENTION CONFIGURATION FIREBASE REQUISE]');
          console.error('Le fournisseur d’authentification "E-mail/Mot de passe" n’est pas encore activé');
          console.error('dans la console Firebase de votre projet.');
          console.error(`Projet : ${config.projectId}`);
          console.error('Procédure à suivre (1 minute) :');
          console.error(`1. Rendez-vous sur : https://console.firebase.google.com/project/${config.projectId}/authentication/providers`);
          console.error('2. Cliquez sur "Ajouter un fournisseur" puis sélectionnez "Adresse e-mail/Mot de passe".');
          console.error('3. Activez le premier interrupteur "Activer" et enregistrez.');
          console.error('4. Relancez ce script : npm run init:admin');
          console.error('============================================================\n');
          process.exit(1);
        } else {
          console.error('[Erreur de création Auth]:', createErr.code, createErr.message);
          process.exit(1);
        }
      }
    } else if (err.code === 'auth/operation-not-allowed') {
      console.error('\n============================================================');
      console.error('[ATTENTION CONFIGURATION FIREBASE REQUISE]');
      console.error('Le fournisseur d’authentification "E-mail/Mot de passe" doit être activé dans');
      console.error(`la console Firebase : https://console.firebase.google.com/project/${config.projectId}/authentication/providers`);
      console.error('============================================================\n');
      process.exit(1);
    } else {
      console.error('[Erreur inattendue]:', err.code, err.message);
      process.exit(1);
    }
  }

  if (uid) {
    console.log(`[Lootsy] Attribution sécurisée des privilèges administrateur dans Firestore...`);

    // 1. Profil utilisateur officiel
    await setDoc(doc(db, 'users', uid), {
      uid,
      email: adminEmail,
      displayName: adminDisplayName,
      epicGamesId: 'LootsyCreator',
      bio: 'Créateur & Administrateur officiel de Lootsy. Suivi des défis et actualités de la communauté.',
      role: 'admin',
      isVerified: true,
      accountStatus: 'active',
      totalXp: 1200,
      level: 5,
      avatarColor: 'ember',
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // 2. Table d'autorité /admins (utilisée par les firestore.rules pour valider isAdmin())
    await setDoc(doc(db, 'admins', uid), {
      uid,
      email: adminEmail,
      role: 'admin',
      promotedAt: new Date().toISOString(),
    }, { merge: true });

    console.log(`\n✅ SUCCÈS : Le compte administrateur ${adminDisplayName} (${adminEmail}) est configuré.`);
    console.log(`Vous pouvez désormais vous connecter sur la page /login de Lootsy.`);
  }
}

bootstrapAdmin().catch(console.error);
