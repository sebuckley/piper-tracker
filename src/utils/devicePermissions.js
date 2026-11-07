export function getEffectiveRole(userRole, deviceRoleOverride, isChildDevice) {
  if (isChildDevice || userRole === "viewer" || deviceRoleOverride === "viewer") return "viewer";
  if (userRole === "editor" || deviceRoleOverride === "editor") return "editor";
  return userRole === "owner" ? "owner" : "viewer";
}
