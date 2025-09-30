export interface Role {
  _id: string;
  name: string;
  permissions: string[];
  __v: number;
}

// API Response interfaces
export interface RoleApiResponse {
  success: boolean;
  role: Role;
}

// Permission categories based on the backend structure
export const PERMISSION_CATEGORIES = {
  AUTH_USER: {
    name: 'Auth & User Management',
    permissions: [
      'VIEW_USERS',
      'VIEW_SINGLE_USER',
      'CREATE_USER',
      'DELETE_USER',
      'ADMIN_UPDATE_USER'
    ]
  },
  ROLE_MANAGEMENT: {
    name: 'Role Management',
    permissions: [
      'VIEW_ROLE',
      'VIEW_SINGLE_ROLE',
      'CREATE_ROLE',
      'UPDATE_ROLE',
      'DELETE_ROLE'
    ]
  },
  CAMPAIGN_MANAGEMENT: {
    name: 'Campaign Management',
    permissions: [
      'VIEW_CAMPAIGNS_ALL',
      'VIEW_CAMPAIGNS_SELF',
      'VIEW_SINGLE_CAMPAIGN',
      'CREATE_CAMPAIGN',
      'UPDATE_CAMPAIGN',
      'DELETE_CAMPAIGN',
      'MANAGE_CAMPAIGN_LEADS',
      'VIEW_CAMPAIGN_LEADS',
      'VIEW_CAMPAIGN_OPPORTUNITIES'
    ]
  },
  LEAD_MANAGEMENT: {
    name: 'Lead Management',
    permissions: [
      'VIEW_LEADS_ALL',
      'VIEW_LEADS_SELF',
      'VIEW_SINGLE_LEAD',
      'CREATE_LEAD',
      'UPDATE_LEAD',
      'DELETE_LEAD',
      'VIEW_LEAD_REMINDERS',
    ]
  },
  OPPORTUNITY_MANAGEMENT: {
    name: 'Opportunity Management',
    permissions: [
      'VIEW_OPPORTUNITIES_ALL',
      'VIEW_OPPORTUNITIES_SELF',
      'VIEW_SINGLE_OPPORTUNITY',
      'CREATE_OPPORTUNITY',
      'UPDATE_OPPORTUNITY',
      'DELETE_OPPORTUNITY',
      'VIEW_LEAD_OPPORTUNITIES'
    ]
  },
  INTERACTION_MANAGEMENT: {
    name: 'Interaction Management',
    permissions: [
      'VIEW_INTERACTIONS',
      'VIEW_SINGLE_INTERACTION',
      'CREATE_INTERACTION',
      'UPDATE_INTERACTION',
      'DELETE_INTERACTION',
      'VIEW_LEAD_INTERACTIONS'
    ]
  },
  TASK_MANAGEMENT: {
    name: 'Task Management',
    permissions: [
      'VIEW_TASKS',
      'VIEW_SINGLE_TASK',
      'CREATE_TASK',
      'UPDATE_TASK',
      'DELETE_TASK'
    ]
  },
  REMINDER_MANAGEMENT: {
    name: 'Reminder Management',
    permissions: [
      'VIEW_REMINDERS_ALL',
      'VIEW_REMINDERS_SELF',
      'VIEW_SINGLE_REMINDER',
      'CREATE_REMINDER',
      'UPDATE_REMINDER',
      'DELETE_REMINDER'
    ]
  },
  OPTIN_FORM_MANAGEMENT: {
    name: 'Optin Form Management',
    permissions: [
      'VIEW_OPTIN_FORMS_ALL',
      'VIEW_OPTIN_FORMS_SELF',
      'CREATE_OPTIN_FORM',
      'UPDATE_OPTIN_FORM',
      'DELETE_OPTIN_FORM'
    ]
  }
} as const;

// All permissions list
export const ALL_PERMISSIONS = Object.values(PERMISSION_CATEGORIES)
  .flatMap(category => category.permissions);

// Permission descriptions
export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  // Auth & User Management
  'VIEW_USERS': 'Xem danh sách người dùng',
  'VIEW_SINGLE_USER': 'Xem thông tin một người dùng cụ thể',
  'CREATE_USER': 'Tạo người dùng mới',
  'DELETE_USER': 'Xóa người dùng',
  'ADMIN_UPDATE_USER': 'Cập nhật người dùng với quyền admin',

  // Role Management
  'VIEW_ROLE': 'Xem danh sách vai trò',
  'VIEW_SINGLE_ROLE': 'Xem thông tin một vai trò cụ thể',
  'CREATE_ROLE': 'Tạo vai trò mới',
  'UPDATE_ROLE': 'Cập nhật vai trò',
  'DELETE_ROLE': 'Xóa vai trò',

  // Campaign Management
  'VIEW_CAMPAIGNS_ALL': 'Xem danh sách chiến dịch của tất cả người dùng',
  'VIEW_CAMPAIGNS_SELF': 'Xem danh sách chiến dịch của chính mình',
  'VIEW_SINGLE_CAMPAIGN': 'Xem thông tin một chiến dịch cụ thể',
  'CREATE_CAMPAIGN': 'Tạo chiến dịch mới',
  'UPDATE_CAMPAIGN': 'Cập nhật chiến dịch',
  'DELETE_CAMPAIGN': 'Xóa chiến dịch',
  'MANAGE_CAMPAIGN_LEADS': 'Quản lý leads trong chiến dịch',
  'VIEW_CAMPAIGN_LEADS': 'Xem leads của chiến dịch',
  'VIEW_CAMPAIGN_OPPORTUNITIES': 'Xem opportunities của chiến dịch',

  // Lead Management
  'VIEW_LEADS_ALL': 'Xem danh sách leads của tất cả người dùng',
  'VIEW_LEADS_SELF': 'Xem danh sách leads của chính mình',
  'VIEW_SINGLE_LEAD': 'Xem thông tin một lead cụ thể',
  'CREATE_LEAD': 'Tạo lead mới',
  'UPDATE_LEAD': 'Cập nhật lead',
  'DELETE_LEAD': 'Xóa lead',
  'VIEW_LEAD_REMINDERS': 'Xem reminders của lead',

  // Opportunity Management
  'VIEW_OPPORTUNITIES_ALL': 'Xem danh sách opportunities của tất cả người dùng',
  'VIEW_OPPORTUNITIES_SELF': 'Xem danh sách opportunities của chính mình',
  'VIEW_SINGLE_OPPORTUNITY': 'Xem thông tin một opportunity cụ thể',
  'CREATE_OPPORTUNITY': 'Tạo opportunity mới',
  'UPDATE_OPPORTUNITY': 'Cập nhật opportunity',
  'DELETE_OPPORTUNITY': 'Xóa opportunity',
  'VIEW_LEAD_OPPORTUNITIES': 'Xem opportunities của lead',

  // Interaction Management
  'VIEW_INTERACTIONS': 'Xem danh sách tương tác',
  'VIEW_SINGLE_INTERACTION': 'Xem thông tin một tương tác cụ thể',
  'CREATE_INTERACTION': 'Tạo tương tác mới',
  'UPDATE_INTERACTION': 'Cập nhật tương tác',
  'DELETE_INTERACTION': 'Xóa tương tác',
  'VIEW_LEAD_INTERACTIONS': 'Xem tương tác của lead',

  // Task Management
  'VIEW_TASKS': 'Xem danh sách công việc',
  'VIEW_SINGLE_TASK': 'Xem thông tin một công việc cụ thể',
  'CREATE_TASK': 'Tạo công việc mới',
  'UPDATE_TASK': 'Cập nhật công việc',
  'DELETE_TASK': 'Xóa công việc',

  // Reminder Management
  'VIEW_REMINDERS_ALL': 'Xem danh sách nhắc nhở của tất cả người dùng',
  'VIEW_REMINDERS_SELF': 'Xem danh sách nhắc nhở của chính mình',
  'VIEW_SINGLE_REMINDER': 'Xem thông tin một nhắc nhở cụ thể',
  'CREATE_REMINDER': 'Tạo nhắc nhở mới',
  'UPDATE_REMINDER': 'Cập nhật nhắc nhở',
  'DELETE_REMINDER': 'Xóa nhắc nhở',

  // Optin Form Management
//   'VIEW_OPTIN_FORMS': 'Xem danh sách form đăng ký',
  'VIEW_OPTIN_FORMS_ALL': 'Xem danh sách form đăng ký của tất cả người dùng',
  'VIEW_OPTIN_FORMS_SELF': 'Xem danh sách form đăng ký của chính mình',
  'CREATE_OPTIN_FORM': 'Tạo form đăng ký mới',
  'UPDATE_OPTIN_FORM': 'Cập nhật form đăng ký',
  'DELETE_OPTIN_FORM': 'Xóa form đăng ký'
};

// Role creation/update form data
export interface RoleFormData {
  name: string;
  permissions: string[];
}

// Role list filters
export interface RoleFilters {
  search?: string;
  category?: string;
}
