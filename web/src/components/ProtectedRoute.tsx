import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token, loading, user, checkAuth } = useAuthStore();
  
  console.log('ProtectedRoute 状态检查:', { 
    isAuthenticated, 
    hasToken: !!token, 
    hasUser: !!user,
    userName: user?.username,
    loading,
    tokenValue: token ? `${token.substring(0, 10)}...` : 'null'
  });
  
  // 如果有token但没有用户信息，获取用户信息
  useEffect(() => {
    if (token && isAuthenticated && !user && !loading) {
      console.log('ProtectedRoute: 有token但没有用户信息，开始获取用户信息');
      checkAuth().catch((error) => {
        console.error('ProtectedRoute: 获取用户信息失败', error);
      });
    }
  }, [token, isAuthenticated, user, loading, checkAuth]);
  
  // 如果还在加载认证状态，显示加载界面
  if (loading) {
    console.log('ProtectedRoute: 显示加载界面');
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>加载中...</div>
      </div>
    );
  }
  
  // 如果没有token或未认证，重定向到登录页
  if (!token || !isAuthenticated) {
    console.log('ProtectedRoute: 重定向到登录页');
    return <Navigate to="/login" replace />;
  }

  // 如果有token和认证状态但没有用户信息，继续显示加载
  if (!user) {
    console.log('ProtectedRoute: 等待用户信息加载');
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>获取用户信息中...</div>
      </div>
    );
  }

  console.log('ProtectedRoute: 渲染受保护的内容');
  return <>{children}</>;
};

export default ProtectedRoute;