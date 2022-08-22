import React, { useEffect, useState } from "react";
import { InputNumber, Form, Select } from "antd";

const { Option } = Select;

function SSEconfigFrom({ sseConfig, setSseConfig }) {
  const [env, setEnv] = useState(sseConfig.env);
  const [interactionCount, setInteractionCount] = useState(
    sseConfig.interactionCount
  );
  const [splitCount, setSplitCount] = useState(sseConfig.splitCount);

  useEffect(() => {
    setSseConfig({ env, interactionCount, splitCount });
  }, [env, interactionCount, splitCount]);
  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ interactionCount, env, splitCount }}
    >
      <Form.Item label="interaction数量" name="interactionCount">
        <InputNumber
          style={{ width: "100%" }}
          onChange={setInteractionCount}
          placeholder="请输入要创建的interaction数量"
        />
      </Form.Item>

      <Form.Item label="选择stg/qa环境" name="env" defaultValue={env}>
        <Select onChange={setEnv} placeholder="请选择stg环境或者qa环境">
          <Option value="stg">stg</Option>
          <Option value="qa">qa</Option>
        </Select>
      </Form.Item>

      <Form.Item label="每个SSE包含的最大interaction数" name="splitCount">
        <InputNumber
          max={50}
          style={{ width: "100%" }}
          onChange={setSplitCount}
          placeholder="请输入每个SSE包含的最大interaction数"
        />
      </Form.Item>
    </Form>
  );
}

export default SSEconfigFrom;
