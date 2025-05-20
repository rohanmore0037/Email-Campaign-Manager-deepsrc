import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

import ProtectedRoute from '../components/ProtectedRoute';
import SMTPConfigList from '../components/SMTPConfigList';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import CSVUpload from '../pages/CSVUpload';
import TemplateUpload from '../pages/TemplateUpload';
import CampaignManager from '../pages/CampaignManager';
import CampaignsList from '../pages/CampaignsList';
import SubscriberList from '../pages/SubscriberList';
import CampaignDetails from '../pages/CampaignDetails';
import TemplatePreview from '../pages/TemplatePreview';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [{
      index: true,
      element: <Home />,
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: 'forgot-password',
      element: <ForgotPassword />,
    },
    {
      path: 'reset-password/:token',
      element: <ResetPassword />,
    },
    {
      path: 'dashboard',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: 'smtp-config',
      element: (
        <ProtectedRoute>
          <SMTPConfigList />
        </ProtectedRoute>
      ),
    },
    {
      path: 'csv-upload',
      element: (
        <ProtectedRoute>
          <CSVUpload />
        </ProtectedRoute>
      ),
    },
    {
      path: 'templates',
      element: (
        <ProtectedRoute>
          <TemplateUpload />
        </ProtectedRoute>
      ),
    },
    {
      path: 'templates/:id',
      element: (
        <ProtectedRoute>
          <TemplatePreview />
        </ProtectedRoute>
      ),
    },
    {
      path: 'campaigns',
      element: (
        <ProtectedRoute>
          <CampaignsList />
        </ProtectedRoute>
      ),
    },
    {
      path: 'campaigns/create',
      element: (
        <ProtectedRoute>
          <CampaignManager />
        </ProtectedRoute>
      ),
    }, {
      path: 'campaigns/edit/:id',
      element: (
        <ProtectedRoute>
          <CampaignManager />
        </ProtectedRoute>
      ),
    },
    {
      path: 'campaigns/details/:id',
      element: (
        <ProtectedRoute>
          <CampaignDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: 'subscribers/:id',
      element: (
        <ProtectedRoute>
          <SubscriberList />
        </ProtectedRoute>
      ),
    },
    {
      path: '*',
      element: <NotFound />,
    },
    ],
  },
]);
