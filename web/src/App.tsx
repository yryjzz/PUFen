import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useAuthStore } from '@/store/auth';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Points from '@/pages/Points';
import Records from '@/pages/Records';
import Rules from '@/pages/Rules';
import Profile from '@/pages/Profile';
import Coupons from '@/pages/Coupons';
import MobileDemo from '@/pages/MobileDemo';
import InviteFriend from '@/pages/InviteFriend';
import ProtectedRoute from '@/components/ProtectedRoute';

const App: React.FC = () => {
  const { isAuthenticated, loading, initialize } = useAuthStore();
  
  console.log('App组件状态:', { isAuthenticated, loading });

  // 在应用启动时初始化认证状态
  React.useEffect(() => {
    console.log('App初始化认证状态');
    initialize();
  }, []); // 移除initialize依赖，避免循环

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>加载中...</div>
      </div>
    );
  }

  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          {/* 公开路由 */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} 
          />
          
          {/* 移动端演示页面（公开） */}
          <Route path="/demo" element={<MobileDemo />} />
          
          {/* 受保护的路由 */}
          <Route path="/" element={
            <ProtectedRoute>
              <Points />
            </ProtectedRoute>
          } />
          
          <Route path="/records" element={
            <ProtectedRoute>
              <Records />
            </ProtectedRoute>
          } />
          
          <Route path="/rules" element={
            <ProtectedRoute>
              <Rules />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/coupons" element={
            <ProtectedRoute>
              <Coupons />
            </ProtectedRoute>
          } />
          
          <Route path="/invite" element={
            <ProtectedRoute>
              <InviteFriend />
            </ProtectedRoute>
          } />
          
          {/* 默认重定向 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;