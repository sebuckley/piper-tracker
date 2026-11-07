import { collection, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../hooks/firebaseConfig";

export const createChildrenSlice = (set, get) => ({

  children: [],
  activeChild: null,

  // ---------------------------------------------------------
  // LOAD CHILDREN FROM FAMILY GROUP (Firestore)
  // ---------------------------------------------------------
  loadChildrenFromFamilyGroup: async () => {
    const familyGroupId = get().familyGroupId;
    if (!familyGroupId) return [];

    const ref = collection(db, "familyGroups", familyGroupId, "children");
    const snap = await getDocs(ref);

    const children = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    set({ children });
    return children;
  },

  // ---------------------------------------------------------
  // LOAD ACTIVE CHILD ON LOGIN
  // ---------------------------------------------------------
  loadActiveChildOnLogin: async () => {
    const children = await get().loadChildrenFromFamilyGroup();
    const current = get().activeChild;

    if (!current && children.length > 0) {
      const first = children[0].id;
      set({ activeChild: first });
      return first;
    }

    return current;
  },

  // ---------------------------------------------------------
  // SET ACTIVE CHILD
  // ---------------------------------------------------------
  setActiveChild: (childId) => {
    set({ activeChild: childId });
  },

  // ---------------------------------------------------------
  // UPDATE CHILD (Firestore + KV + local)
  // ---------------------------------------------------------
  updateChild: async (childId, updates) => {
    const familyGroupId = get().familyGroupId;
    if (!familyGroupId) return;

    // 1️⃣ Update Firestore
    const childRef = doc(db, "familyGroups", familyGroupId, "children", childId);
    await updateDoc(childRef, updates);

    // 2️⃣ Update local Zustand state
    set(state => ({
      children: state.children.map(c =>
        c.id === childId ? { ...c, ...updates } : c
      )
    }));

    // 3️⃣ Save to KV (only if active child)
    const activeChild = get().activeChild;
    if (activeChild === childId) {
      await get().saveToKV(childId);
    }

    // 4️⃣ If relationships changed → update familyMembers
    if (updates.relationships) {
      const familyMembers = get().familyMembers;
      const updatedMembers = familyMembers.map(m => ({
        ...m,
        relationship: updates.relationships[m.uid] || m.relationship || ""
      }));

      set({ familyMembers: updatedMembers });
    }
  },

  // ---------------------------------------------------------
  // DELETE CHILD (Firestore + local)
  // ---------------------------------------------------------
  deleteChild: async (childId) => {
    const familyGroupId = get().familyGroupId;
    if (!familyGroupId) return;

    const childRef = doc(db, "familyGroups", familyGroupId, "children", childId);
    await setDoc(childRef, null); // or deleteDoc(childRef)

    // Update local state
    set(state => ({
      children: state.children.filter(c => c.id !== childId)
    }));

    // Reset active child if needed
    if (get().activeChild === childId) {
      const remaining = get().children;
      set({ activeChild: remaining[0]?.id || null });
    }
  }

});
