import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select } from 'antd'
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import img404 from '@/assets/error.png'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import { useEffect, useState } from 'react'
import { http } from '@/utils'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '@/store'
import { observer } from 'mobx-react-lite'


const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const { channelStore } = useStore()

  //表格数据管理
  const [articles, setArticleList] = useState([])

  //表格参数管理
  const [params, setParams] = useState({
    page: 1, per_page: 2
  })

  //总条数
  const [total, setTotal] = useState(0)



  //删除文章
  const deleteArt = async (data) => {
    await http.delete(`/mp/articles/${data.id}`)
    // 更新列表
    setParams({
      ...params
    })
  }


  //获取表格数据
  useEffect(() => {
    const loadArticles = async () => {
      const res = await http.get('/mp/articles', { params })
      setArticleList(res.data.results)
      setTotal(res.data.total_count)
    }
    loadArticles()
  }, [params])


  useEffect(() => {
    channelStore.getChannelList()
  }, [])


  const onFinish = (values) => {
    const { status, channel_id, date } = values
    // 格式化表单数据
    const _params = {}
    // 格式化status
    _params.status = status
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    // 修改params参数 触发接口再次发起
    setParams({
      ...params,
      ..._params,
      page: 1
    })
  }

  const pageChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
  }

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() =>
              goPublish(data)
            } />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => deleteArt(data)}
            />
          </Space>
        )
      }
    }
  ]

  const data = articles

  return (
    <div>
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              首页
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: null }} onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={null}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              {
                channelStore.ChannelList.map((item) => {
                  return <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                })
              }
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" >
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title={`根据筛选条件共查询到 ${total} 条结果：`}>
        <Table rowKey="id" columns={columns} dataSource={data}
          pagination={{
            total,
            current: params.page,
            pageSize: params.per_page,
            onChange: pageChange
          }}
        />
      </Card>
    </div>
  )
}

export default observer(Article)