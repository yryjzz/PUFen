import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, PhoneOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuthStore } from '@/store/auth';
import { authService } from '@/services/auth';
import { LoginRequest } from '@/types';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 32px;
    color: #333;
    margin: 0;
    font-weight: bold;
  }
  
  p {
    color: #666;
    margin: 8px 0 0;
    font-size: 14px;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 20px;
  }
  
  .ant-input-affix-wrapper {
    border-radius: 12px;
    padding: 12px;
    border: 1px solid #e0e0e0;
    
    &:hover, &:focus {
      border-color: #4facfe;
      box-shadow: 0 0 0 2px rgba(79, 172, 254, 0.1);
    }
  }
  
  .ant-btn {
    height: 48px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 16px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border: none;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
    }
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
  
  a {
    color: #4facfe;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const onFinish = async (values: LoginRequest) => {
    try {
      setLoading(true);
      const response = await authService.login(values);
      
      if (response.success && response.data) {
        // 先设置登录状态
        login(response.token, response.data);
        message.success('登录成功！');
        
        // 使用React Router导航，保持store状态
        navigate('/', { replace: true });
      } else {
        message.error(response.message || '登录失败');
      }
    } catch (error: any) {
      console.error('登录错误:', error);
      message.error(error?.message || '登录失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <h1>PU分</h1>
          <p>积分签到系统</p>
        </Logo>
        
                <StyledForm
          name="login"
          onFinish={onFinish as any}
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号!' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式!' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="手机号"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6位!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </StyledForm>
        
        <Footer>
          还没有账号？<Link to="/register">立即注册</Link>
        </Footer>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;