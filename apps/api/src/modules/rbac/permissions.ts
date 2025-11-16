export const Role = {
  OWNER: "owner",
  MAINTAINER: "maintainer",
  VIEWER: "viewer",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface RoleHierarchy {
  [Role.OWNER]: 3;
  [Role.MAINTAINER]: 2;
  [Role.VIEWER]: 1;
}

const roleHierarchy: RoleHierarchy = {
  [Role.OWNER]: 3,
  [Role.MAINTAINER]: 2,
  [Role.VIEWER]: 1,
};

/**
 * Get role priority (higher number = more permissions)
 */
export function getRolePriority(role: Role): number {
  return roleHierarchy[role] || 0;
}

/**
 * Check if a role can manage projects
 */
export function canManageProject(userRole: Role): boolean {
  return getRolePriority(userRole) >= getRolePriority(Role.MAINTAINER);
}

/**
 * Check if a role can manage members
 */
export function canManageMembers(userRole: Role): boolean {
  return getRolePriority(userRole) >= getRolePriority(Role.OWNER);
}

/**
 * Check if a role can delete projects
 */
export function canDeleteProject(userRole: Role): boolean {
  return getRolePriority(userRole) >= getRolePriority(Role.OWNER);
}

/**
 * Check if userRole can assign targetRole
 */
export function canAssignRole(userRole: Role, targetRole: Role): boolean {
  const userPriority = getRolePriority(userRole);
  const targetPriority = getRolePriority(targetRole);
  
  // Users can only assign roles equal to or lower than their own
  // Owners can assign any role
  if (userRole === Role.OWNER) {
    return true;
  }
  
  // Maintainers cannot assign owner role
  if (targetRole === Role.OWNER) {
    return false;
  }
  
  // Users can assign roles lower than their own
  return userPriority > targetPriority;
}

/**
 * Check if userRole has permission to perform action on targetRole
 */
export function hasPermission(userRole: Role, targetRole: Role): boolean {
  return getRolePriority(userRole) >= getRolePriority(targetRole);
}

