import type { IResourceItem } from "@refinedev/core";
import { ApartmentOutlined, BellOutlined, CheckSquareOutlined, CustomerServiceOutlined, DashboardOutlined, FlagOutlined, FormOutlined, IdcardOutlined, NotificationOutlined, ShopOutlined, TeamOutlined, UserOutlined, } from "@ant-design/icons";
export const resources: IResourceItem[] = [
    {
        name: "dashboard",
        list: "/",
        meta: {
            label: "Dashboard",
            icon: <DashboardOutlined />,
        },
    },
    {
        name: "auth",
        list: "/users",
        create: "/users/create",
        edit: "/users/edit/:id",
        show: "/users/show/:id",
        options: { route: 'users' },
        meta: {
            label: "Quản lý User",
            icon: <UserOutlined />,
        },
    },
    {
        name: "roles",
        list: "/roles",
        create: "/roles/new",
        edit: "/roles/edit/:id",
        show: "/roles/show/:id",
        options: { route: "roles" },
        meta: {
            label: "Quản lý Vai trò",
            icon: <TeamOutlined />,
        },
    },
    {
        name: "leads",
        list: "/leads",
        show: "/leads/:id",
        create: "/leads/new",
        edit: "/leads/edit/:id",
        options: { route: 'leads' },
        meta: {
            label: "Leads",
            icon: <ShopOutlined />,
        },
    },
    {
        name: "tasks",
        list: "/tasks",
        create: "/tasks/new",
        edit: "/tasks/edit/:id",
        meta: {
            label: "Tasks",
            icon: <CheckSquareOutlined />,
        },
    },
    {
        name: "opportunities",
        list: "/opportunities",
        show: "/opportunities/:id",
        create: "/opportunities/new",
        edit: "/opportunities/edit/:id",
        meta: {
            label: "Opportunities",
            icon: <FlagOutlined />,
        },
    },
    {
        name: "campaigns",
        list: "/campaigns",
        show: "/campaigns/:id",
        create: "/campaigns/new",
        edit: "/campaigns/edit/:id",
        meta: {
            label: "Campaigns",
            parent: "marketing",
            icon: <NotificationOutlined />,
        },
    },
    {
        name: "optin-forms",
        list: "/optin-forms",
        show: "/optin-forms/:id",
        create: "/optin-forms/new",
        edit: "/optin-forms/edit/:id",
        meta: {
            label: "Opt-in Forms",
            parent: "marketing",
            icon: <FormOutlined />,
        },
    },
    {
        name: "reminders",
        list: "/reminders",
        show: "/reminders/:id",
        create: "/reminders/new",
        edit: "/reminders/edit/:id",
        meta: {
            label: "Reminders",
            icon: <BellOutlined />,
        },
    },
];
