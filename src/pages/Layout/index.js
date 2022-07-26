import AuthComponent from "@/component/AuthComponent"
import { observer } from "mobx-react-lite"
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { useStore } from '@/store'
import { useEffect } from "react"
// import { Navigate } from "react-router-dom"
const { Header, Sider } = Layout


function GeekLayout() {

  const [params] = useSearchParams()
  const channelId = params.get('id')
  const { userStore, loginStore } = useStore()
  const navigate = useNavigate()
  useEffect(() => {
    userStore.getUserInfo()
  }, [userStore])

  const logout = () => {
    loginStore.logout()
    navigate('/login')
  }
  return (
    <AuthComponent>
      <Layout>
        <Header className="header">
          <div className="logo" />
          <div className="user-info">
            <span className="user-name">{userStore.userInfo.name}</span>
            <span className="user-logout">
              <Popconfirm
                onConfirm={logout}
                title="是否确认退出？" okText="退出" cancelText="取消">
                <LogoutOutlined /> 退出
              </Popconfirm>
            </span>
          </div>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              theme="dark"
              // defaultSelectedKeys={[location.pathname]}
              selectedKeys={[window.location.pathname]}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item icon={<HomeOutlined />} key="/">
                <Link to='/'>数据概览</Link>
              </Menu.Item>
              <Menu.Item icon={<DiffOutlined />} key="/article">
                <Link to='/article'>内容管理</Link>
              </Menu.Item>
              <Menu.Item icon={<EditOutlined />} key="/publish">
                <Link to='/publish'>{channelId ? '编辑文章' : '发布文章'}</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="layout-content" style={{ padding: 20 }}>
            <Outlet></Outlet>
          </Layout>
        </Layout>
      </Layout>
    </AuthComponent>
  )
}

export default observer(GeekLayout)