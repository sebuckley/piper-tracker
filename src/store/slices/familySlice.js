// src/store/slices/createFamilySlice.js

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc
} from "firebase/firestore";

import { nanoid } from "nanoid";
import { db } from "../../hooks/firebaseConfig";

async function generateEncryptionKey() {
  const key = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...key));
}

export const createFamilySlice = (set, get) => ({

  // ---------------------------------------------------------
  // STATE
  // ---------------------------------------------------------
  familyGroupId: null,
  familyMembers: [],     // [{ uid, email, role, name, avatarUrl }]
  encryptionKey: null,
  invites: [],
  children: [],
  // ---------------------------------------------------------
  // LOAD INVITES
  // ---------------------------------------------------------
  loadInvites: async (uid) => {
    if (!uid) return [];

    const inviteQuery = query(
      collection(db, "invites"),
      where("email", "==", get().userProfile?.email?.toLowerCase() || "")
    );

    const snap = await getDocs(inviteQuery);

    const invites = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    set({ invites });

    return invites;
  },

  // ---------------------------------------------------------
  // LOAD FAMILY GROUP
  // ---------------------------------------------------------
  loadFamilyGroup: async (uid) => {
    if (!uid) return;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : {};

    const userEmail = userData.email || "";
    const userRole = userData.role || "owner";
    const familyGroupId = userData.familyGroupId;

    // -------------------------------------------------------
    // CREATE NEW FAMILY GROUP
    // -------------------------------------------------------
    if (!familyGroupId) {
      const newGroupRef = doc(collection(db, "familyGroups"));

      const ownerMember = {
        uid,
        email: userEmail,
        role: "owner",
        name: userData.name || userEmail.split("@")[0],
        avatarUrl: userData.avatarUrl || null
      };

      const encryptionKey = await generateEncryptionKey();

      await setDoc(newGroupRef, {
        members: [ownerMember],
        encryptionKey
      });

      await updateDoc(userRef, {
        familyGroupId: newGroupRef.id,
        role: "owner"
      });

      set({
        familyGroupId: newGroupRef.id,
        familyMembers: [ownerMember],
        encryptionKey
      });

      return;
    }

    // -------------------------------------------------------
    // LOAD EXISTING FAMILY GROUP
    // -------------------------------------------------------
    const groupRef = doc(db, "familyGroups", familyGroupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      console.warn("Family group missing, recreating:", familyGroupId);

      const ownerMember = {
        uid,
        email: userEmail,
        role: userRole,
        name: userData.name || userEmail.split("@")[0],
        avatarUrl: userData.avatarUrl || null
      };

      const encryptionKey = await generateEncryptionKey();

      await setDoc(groupRef, {
        members: [ownerMember],
        encryptionKey
      });

      set({
        familyGroupId,
        familyMembers: [ownerMember],
        encryptionKey
      });

      return;
    }

    const groupData = groupSnap.data();

    // Ensure encryptionKey exists
    let encryptionKey = groupData.encryptionKey;
    if (!encryptionKey) {
      encryptionKey = await generateEncryptionKey();
      await updateDoc(groupRef, { encryptionKey });
    }

    // -------------------------------------------------------
    // ENRICH MEMBERS
    // -------------------------------------------------------
    const rawMembers = groupData.members || [];
    const enrichedMembers = [];

    for (const m of rawMembers) {
      const memberRef = doc(db, "users", m.uid);
      const memberSnap = await getDoc(memberRef);
      const profile = memberSnap.exists() ? memberSnap.data() : {};

      enrichedMembers.push({
        uid: m.uid,
        email: m.email || profile.email || "",
        role: m.role || "viewer",
        name: profile.name || profile.preferredName || m.email.split("@")[0],
        avatarUrl: profile.avatarUrl || null
      });
    }

    // Ensure current user is included
    if (!enrichedMembers.some(m => m.uid === uid)) {
      enrichedMembers.push({
        uid,
        email: userEmail,
        role: userRole,
        name: userData.name || userEmail.split("@")[0],
        avatarUrl: userData.avatarUrl || null
      });

      await updateDoc(groupRef, { members: enrichedMembers });
    }

    set({
      familyGroupId,
      familyMembers: enrichedMembers,
      encryptionKey
    });
  },

  // ---------------------------------------------------------
  // UPDATE MEMBER NAME
  // ---------------------------------------------------------
  updateFamilyMemberName: async (memberUid, newName) => {
    const { familyGroupId, familyMembers } = get();
    if (!familyGroupId) return;

    const userRef = doc(db, "users", memberUid);
    await updateDoc(userRef, { name: newName });

    const updatedMembers = familyMembers.map(m =>
      m.uid === memberUid ? { ...m, name: newName } : m
    );

    const groupRef = doc(db, "familyGroups", familyGroupId);
    await updateDoc(groupRef, { members: updatedMembers });

    set({ familyMembers: updatedMembers });
  },

  // ---------------------------------------------------------
  // INVITES
  // ---------------------------------------------------------
  inviteFamilyMember: async (email) => {
    const { familyGroupId } = get();
    if (!familyGroupId) return;

    const inviteRef = doc(collection(db, "invites"));
    await setDoc(inviteRef, {
      email: email.toLowerCase(),
      familyGroupId,
      role: "editor",
      createdAt: Date.now()
    });

    return inviteRef.id;
  },

  acceptInvite: async (uid, email) => {
    const inviteQuery = query(
      collection(db, "invites"),
      where("email", "==", email.toLowerCase())
    );

    const inviteSnap = await getDocs(inviteQuery);
    if (inviteSnap.empty) return false;

    const inviteDoc = inviteSnap.docs[0];
    const inviteData = inviteDoc.data();

    const { familyGroupId, role } = inviteData;

    const groupRef = doc(db, "familyGroups", familyGroupId);
    const groupSnap = await getDoc(groupRef);
    const groupData = groupSnap.exists()
      ? groupSnap.data()
      : { members: [] };

    const updatedMembers = [
      ...groupData.members,
      { uid, email: email.toLowerCase(), role }
    ];

    await updateDoc(groupRef, { members: updatedMembers });

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      familyGroupId,
      role
    });

    await deleteDoc(inviteDoc.ref);

    set({
      familyGroupId,
      familyMembers: updatedMembers
    });

    return true;
  },

  // ---------------------------------------------------------
  // UPDATE MEMBER ROLE
  // ---------------------------------------------------------
  updateFamilyMemberRole: async (memberUid, newRole) => {
    const { familyGroupId, familyMembers } = get();
    if (!familyGroupId) return;

    const updatedMembers = familyMembers.map(m =>
      m.uid === memberUid ? { ...m, role: newRole } : m
    );

    const groupRef = doc(db, "familyGroups", familyGroupId);
    await updateDoc(groupRef, { members: updatedMembers });

    const userRef = doc(db, "users", memberUid);
    await updateDoc(userRef, { role: newRole });

    set({ familyMembers: updatedMembers });
  },
  


});
