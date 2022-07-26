import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { http } from '@/utils';


const { Option } = Select



const Publish = () => {
  const form = useRef(null)

  const navigate = useNavigate()

  const [params] = useSearchParams()

  const channelId = params.get('id')
  const { channelStore } = useStore()

  //图片暂存仓库
  const cacheImgList = useRef()

  //上传图片列表
  const [fileList, setFileList] = useState([])

  //上传图片数量
  const [imgCount, setImgCount] = useState(1)

  //发表文章按钮
  const onFinish = async (values) => {
    console.log(values);
    const { type, title, channel_id, content } = values
    const Params = {
      type,
      title,
      channel_id,
      content,
      cover: {
        type,
        images: fileList.map(item => {
          // console.log(item.response);
          if (item.response) {
            return item.response.data.url
          }
          return item.url
        })
      }
    }

    //编辑
    if (channelId) {
      await http.put(`/mp/articles/${channelId}?draft=false`, Params)
      navigate('/article')
      return message.success('编辑成功')
    }
    await http.post('/mp/articles?draft=false', Params)
    message.success('发布成功')
  }

  // 上传图片变化
  const onUploadChange = ({ fileList }) => {
    console.log(fileList);

    setFileList(fileList)

    cacheImgList.current = fileList
  }

  //图片数量选择变化
  const radioChange = (e) => {
    setImgCount(e.target.value)
    if (cacheImgList.current[0]) {
      if (e.target.value === 1) {
        setFileList([cacheImgList.current[0]])
      } else if (e.target.value === 3) {
        setFileList(cacheImgList.current)
      }
    }

  }

  useEffect(() => {
    channelStore.getChannelList()
  }, [])

  //获取文章详情
  useEffect(() => {
    async function getArticle() {
      const res = await http.get(`/mp/articles/${channelId}`)
      const { cover, ...formValues } = res.data
      form.current.setFieldsValue({
        ...formValues,
        type: cover.type,
      })

      const imgsList = cover.images.map(url => {
        return {
          url
        }
      })

      setFileList(imgsList)
      cacheImgList.current = imgsList
      setImgCount(cover.type)
    }
    if (channelId) {
      // 拉取数据回显
      getArticle()
    }

  }, [channelId])
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{channelId ? '编辑文章' : '发布文章'}</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: '' }}
          onFinish={onFinish}
          ref={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelStore.ChannelList.map((item) => {
                return <Option value={item.id} key={item.id}>{item.name}</Option>
              })}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {
              imgCount > 0
              && (<Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                onChange={onUploadChange}
                multiple={imgCount > 1}
                maxCount={imgCount}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>)

            }

          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill theme="snow" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {channelId ? '编辑文章' : '发布文章'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)