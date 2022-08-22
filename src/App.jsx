import React,{ useState } from 'react'
import reactLogo from './assets/react.svg'
import { Button,InputNumber,Form,Select,Tag,Table} from 'antd';
import  SSESdk from "./server-sent-events";
import generateUrl from './common/generateUrl'
import './App.css'

const { Option } = Select;

function App() {
  const [sseSdks, setSseSdks] = useState([])
  const [env, setEnv] = useState('stg')
  const [interactionCount, setInteractionCount] = useState(10)
  const [splitCount, setSplitCount] = useState(3)
  const [status, setStatus] = useState(false)
  const [userIds,setUserIds]=useState([])
  
  const startConnections=()=>{
    let sseSdks=[]
    const {urls,user_ids}=generateUrl({interactionCount,env,splitCount})
    setUserIds(user_ids)
    urls.forEach((url)=>{
      const sseSdk=new SSESdk(url)
      sseSdks.push(sseSdk)
      sseSdk.subscribe((mes)=>{console.log(mes)})
    })
    setStatus(true) 
    setSseSdks(sseSdks)
    
  }
  const closeConnections=()=>{
    sseSdks.forEach((sseSdk)=>{
      sseSdk?.unsubscribe()
    })
    setStatus(false) 
  }
  const clearConnections=()=>{
    setUserIds([])
  }

  const columns = [
    {
      title: 'userId',
      dataIndex: 'userId',
      key: 'userId',
      render: (text) => <span>{text}</span>,
    },{
      title: 'status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status?"green":"red"}>{status?'connection':'close'} </Tag>,
    }]

    const data =userIds.map((userId)=>{
      return {
        userId,
        status
      }
    })

  return (
    <div className="App">
      <Form
      labelCol={{ span:4 }}
      wrapperCol={{ span: 16 }}
      initialValues={{interactionCount,env,splitCount}}>
        <Form.Item
         label="interaction数量"
         name="interactionCount"
        >
          <InputNumber style={{ width: '100%' }} onChange={setInteractionCount} placeholder="请输入要创建的interaction数量" />
        </Form.Item>

        <Form.Item
         label="选择stg/qa环境"
         name="env"
         defaultValue={env}
        >
           <Select   onChange={setEnv}  placeholder="请选择stg环境或者qa环境">
            <Option value="stg">stg</Option>
            <Option value="qa">qa</Option>
          </Select>
        </Form.Item>

        <Form.Item
         label="每个SSE包含的最大interaction数"
         name="splitCount"
        >
          <InputNumber max={50} style={{ width: '100%' }} onChange={setSplitCount} placeholder="请输入每个SSE包含的最大interaction数"/>
        </Form.Item>
      </Form>
      <Button style={{margin:'0px 5px'}} type="primary"  onClick={startConnections} >
        开始连接
      </Button>
      <Button style={{margin:'0px 5px'}} type="primary"  danger onClick={closeConnections}>
        关闭连接
      </Button>
      <Button style={{margin:'0px 5px'}} disabled={status} onClick={clearConnections}>
        清理连接数据
      </Button>
      <Table columns={columns} dataSource={data} />
      
    </div>
  )
}

export default App
