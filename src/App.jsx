import React, { useEffect, useState } from "react";
import { Button, Form, Tag, Table, Input, Row, Col } from "antd";
import SSESdk from "./server-sent-events";
import generateUrl from "./common/generateUrl";
import SSEconfigFrom from "./commpents/SSEConfig";
import sendMessage from "./common/sendMessage";
import "./App.css";

const { TextArea } = Input;

function App() {
  const [sseSdks, setSseSdks] = useState([]);
  const [sseConfig, setSseConfig] = useState({
    env: "",
    interactionCount: 10,
    splitCount: 1,
  });
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState(false);
  const [userIds, setUserIds] = useState([]);
  const [interactions, setInteractions] = useState([]);
  // const [data, setData] = useState([]);

  const startConnections = () => {
    let sseSdks = [];
    const { urls, user_ids, interactions } = generateUrl(sseConfig);
    setUserIds(user_ids);
    setInteractions(interactions);
    urls.forEach((url) => {
      const sseSdk = new SSESdk(url, token);
      sseSdks.push(sseSdk);
      sseSdk.subscribe(
        ({ evtSource }) => {
          setSseSdks((pre) => {
            const newDate = pre.map((item) => {
              if (item.evtSource.url === evtSource.url) {
                return item;
              }
              return item;
            });
            return newDate;
          });
        },
        (message) => {
          setSseSdks((pre) => {
            const newDate = pre.map((item) => {
              if (item.evtSource.url === message.evtSource.url) {
                item.evtSource = message.evtSource;
                return item;
              }
              return item;
            });
            return newDate;
          });
        }
      );
    });
    setStatus(true);
    setSseSdks(sseSdks);
  };
  const closeConnections = () => {
    sseSdks.forEach((sseSdk) => {
      sseSdk?.unsubscribe();
    });
    setStatus(false);
  };
  const clearConnections = () => {
    setUserIds([]);
  };

  const statusDic = { 0: "connecting", 1: "open", 2: "closed" };

  const columns = [
    {
      title: "userId",
      dataIndex: "userId",
      key: "userId",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "messagesCount",
      dataIndex: "messagesCount",
      key: "messagesCount",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "retryCount",
      dataIndex: "retryCount",
      key: "retryCount",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status != 2 ? "green" : "red"}>{statusDic[status]}</Tag>
      ),
    },
  ];

  const dataSource = userIds.map((userId, index) => {
    return {
      key: userId,
      userId,
      messagesCount: sseSdks[index].messagesCount,
      retryCount: sseSdks[index].retryCount,
      status: sseSdks[index].evtSource.readyState,
    };
  });

  const [formInstance] = Form.useForm();
  const submit = () => {
    // 点击 验证表单信息
    formInstance.validateFields().then((vals) => {
      console.log(vals);
      let index = 0;
      var timerInteraction = setInterval(() => {
        const interactionId = interactions[index];
        if (!interactionId) {
          clearInterval(timerInteraction);
        } else {
          sendMessage({
            ...vals,
            ...{ interactionId, env: sseConfig.env },
          });
        }
        index++;
      }, 600);
    });
  };
  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
  }, [setToken]);

  return (
    <div className="App">
      <Row>
        <Col span={12}>
          <SSEconfigFrom
            sseConfig={sseConfig}
            setSseConfig={setSseConfig}
          ></SSEconfigFrom>
        </Col>

        <Col span={12}>
          <Form
            labelCol={{ span: 4 }}
            form={formInstance}
            wrapperCol={{ span: 16 }}
            initialValues={{ token: sessionStorage.getItem("token"), message }}
          >
            <Form.Item
              label="Token"
              name="token"
              rules={[{ required: true, message: "Please input token" }]}
            >
              <TextArea
                style={{ width: "100%" }}
                rows={3}
                placeholder="请输入Token"
                onChange={(event) => {
                  setToken(event.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              label="消息"
              name="message"
              rules={[{ required: true, message: "Please input message" }]}
            >
              <Input
                style={{ width: "100%" }}
                placeholder="请输入消息"
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>

      <Button
        style={{ margin: "0px 5px" }}
        disabled={status}
        type="primary"
        onClick={startConnections}
      >
        开始连接
      </Button>
      <Button
        style={{ margin: "0px 5px" }}
        disabled={!status}
        type="primary"
        danger
        onClick={closeConnections}
      >
        关闭连接
      </Button>
      <Button
        style={{ margin: "0px 5px" }}
        disabled={status}
        onClick={clearConnections}
      >
        清理连接数据
      </Button>

      <Button
        style={{ margin: "0px 5px" }}
        disabled={!status}
        onClick={() => {
          submit();
        }}
      >
        发送消息
      </Button>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: 100,
        }}
      />

      <p>interactionId</p>
      <TextArea
        style={{ width: "100%" }}
        rows={3}
        value={JSON.stringify(interactions)}
      />
    </div>
  );
}

export default App;
