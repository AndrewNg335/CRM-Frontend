import type { User } from '@/interfaces/user';


export const hasAdminAccess = (user: User | undefined | null): boolean => {
  if (!user || !user.role) {
    return false;
  }

  if (user.role.name === 'Admin' || user.role.name === 'Inspect admin') {
    return true;
  }

  return false;
};


export const hasPermission = (user: User | undefined | null, permission: string): boolean => {
  if (!user || !user.role || !user.role.permissions) {
    return false;
  }

  if (user.role.name === 'Admin' || user.role.name === 'Inspect admin') {
    return true;
  }


  return false;
};


export const isAdmin = (user: User | undefined | null): boolean => {
  return user?.role?.name === 'Admin' || user?.role?.name === 'Inspect admin';
};
