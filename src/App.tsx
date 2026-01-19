import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, { CatchAllNavigate, DocumentTitleHandler, UnsavedChangesNotifier, } from "@refinedev/react-router";
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import Layout from "./components/layout";
import { resources } from "./config/resources";
import { AnalyticsPage, Home, LeadDetailPage, LeadList, Login } from "./pages";
import { CreateCampaign } from "./pages/campaign/create";
import { EditCampaign } from "./pages/campaign/edit";
import { CampaignShow } from "./pages/campaign/show";
import { CampaignList } from "./pages/campaign/list";
import { CreateOpportunity } from "./pages/opportunity/create";
import { OpportunityList } from "./pages/opportunity/list";
import { OpportunityPreview } from "./pages/opportunity/preview";
import { CreateOptinForm } from "./pages/optinForm/create";
import { EditOptinForm } from "./pages/optinForm/edit";
import { OptinFormList } from "./pages/optinForm/list";
import { OptinFormPreview } from "./pages/optinForm/preview";
import { ReminderList } from "./pages/reminder/list";
import { ReminderShow } from "./pages/reminder/show";
import TasksCreatePage from "./pages/task/create";
import TasksEditPage from "./pages/task/edit";
import List from "./pages/task/list";
import { UserEdit, UserList, UserShow } from "./pages/user";
import { RoleList, RoleShow } from "./pages/role";
import { authProvider, dataProvider } from "./providers";
import { NotificationProvider } from "./providers/notification";
function App() {
    return (<BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider theme={{
            token: {
                colorPrimary: "#3b82f6",
                colorText: "#475569",
                colorTextHeading: "#1e293b",
                colorBgContainer: "rgba(255, 255, 255, 0.9)",
                colorBgElevated: "rgba(255, 255, 255, 0.95)",
                colorBorder: "rgba(0, 0, 0, 0.1)",
            },
        }}>
        <AntdApp>
          <DevtoolsProvider>
            <Refine dataProvider={dataProvider} notificationProvider={useNotificationProvider} routerProvider={routerBindings} authProvider={authProvider} resources={resources} options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            useNewQueryKeys: true,
            projectId: "x4iKeM-nwRLZS-66PHoT",
            liveMode: "auto",
        }}>
              <NotificationProvider>
              <Routes>
                <Route path="/login" element={<Login />}/>
                <Route path="/optin-forms/preview/:id" element={<OptinFormPreview />}/>
                <Route element={<Authenticated key="authenticated-layout" fallback={<CatchAllNavigate to="/login"/>}>
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>}>
                  <Route index element={<Home />}/>
                  <Route path="/analytics" element={<AnalyticsPage />}/>
                  <Route path="/leads">
                    <Route index element={<LeadList />}/>
                    <Route path="edit/:id" element={<LeadDetailPage />}/>
                  </Route>
                
                  <Route path="/reminders">
                    <Route index element={<ReminderList />}/>

                    <Route path="show/:id" element={<ReminderShow />}/>
                  </Route>
                  <Route path="/campaigns">
                    <Route index element={<CampaignList />}/>
                    <Route path="new" element={<CreateCampaign />}/>
                    <Route path="edit/:id" element={<EditCampaign />}/>
                    <Route path="show/:id" element={<CampaignShow />}/>
                  </Route>
                  <Route path="/opportunities">
                    <Route index element={<OpportunityList />}/>
                    <Route path="new" element={<CreateOpportunity />}/>
                    <Route path="preview/:id" element={<OpportunityPreview />}/>
                  </Route>
                  <Route path="/optin-forms">
                    <Route index element={<OptinFormList />}/>
                    <Route path="new" element={<CreateOptinForm />}/>
                    <Route path="edit/:id" element={<EditOptinForm />}/>
                  </Route>
                  <Route path="/tasks" element={<List>
                      <Outlet />
                    </List>}>
                    <Route path="new" element={<TasksCreatePage />}/>
                    <Route path="edit/:id" element={<TasksEditPage />}/>
                  </Route>
                  <Route path="/users">
                    <Route index element={<UserList />}/>
                    
                    <Route path="edit/:id" element={<UserEdit />}/>
                    <Route path="show/:id" element={<UserShow />}/>
                  </Route>
                  <Route path="/roles">
                    <Route index element={<RoleList />}/>
                    <Route path="show/:id" element={<RoleShow />}/>
                  </Route>
                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler handler={({ autoGeneratedTitle }) => `My CRM App`}/>
              </NotificationProvider>
            </Refine>
          </DevtoolsProvider>
        </AntdApp>
        </ConfigProvider>
      </RefineKbarProvider>
    </BrowserRouter>);
}
export default App;