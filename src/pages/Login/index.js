import { Card, Form, Input, Button, Checkbox, message } from 'antd'
import logo from '@/assets/logo.png'
import './index.scss'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'


export default function Login() {
  const { loginStore } = useStore()
  const navigate = useNavigate()

  //点击登录时
  const onFinish = async (values) => {
    // console.log('Success:', values);
    try {
      await loginStore.setToken({ mobile: values.phone, code: values.verificationCode })

      //跳转首页
      navigate('/', { replace: true }) //replace不可返回

      //提示登录成功
      message.success('登录成功')
    } catch (e) {
      message.error(e.response?.data?.message || '登录失败')
    }

  };


  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        <Form initialValues={{ remember: true, verificationCode: '246810', phone: '13811111111' }}
          onFinish={onFinish}
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号!' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确手机号' }
            ]}>
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="verificationCode"
            rules={[{ required: true, message: '请输入验证码!' }, { len: 6, message: '验证码应为6位' }]}>
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox className="login-checkbox-label">
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>

          <Form.Item>
            {/* <!-- 渲染Button组件为submit按钮 --> */}
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div >
  )
}