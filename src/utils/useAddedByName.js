import { useAppStore } from "../store/useAppStore";

// Resolves an "addedBy" email to the name shown in the UI for the active child:
// the member's "known as" name, else their relationship role (e.g. Dad),
// else the original value.
export function useAddedByName() {
  const familyMembers = useAppStore(s => s.familyMembers);
  const activeChild = useAppStore(s => s.activeChild);
  const children = useAppStore(s => s.children);

  const relationships = children.find(c => c.id === activeChild)?.relationships || {};

  return addedBy => {
    if (!addedBy) return addedBy;

    const member = (familyMembers || []).find(
      m => m.email && m.email.toLowerCase() === String(addedBy).toLowerCase()
    );
    if (!member) return addedBy;

    const rel = relationships[member.uid] || {};
    return rel.knownAs?.trim() || rel.role || addedBy;
  };
}
