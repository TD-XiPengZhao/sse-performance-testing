import { nanoid } from 'nanoid';

export default function sendMessage({ interactionId, message, token, env }) {
  const params = {
    interaction_id: interactionId,
    message_id: nanoid(32),
    content: message,
    status: null,
    tags: null,
    channel_metadata: {},
    from_metadata: null,
    to_metadata: null,
    interaction_metadata: null,
    contact_id: 'test_for_sse@talkdesk.com',
    occur_at: null,
    channel: 'DIGITAL_CONNECT',
    direction: 'INBOUND',
    from: 'test_for_sse@talkdesk.com',
    to: ['test'],
    account_id: null,
    is_virtual_agent: false,
  };

  const url =
    env === 'stg'
      ? `https://api.talkdeskstg.com/cds/messages`
      : `https://api.talkdeskqa.com/cds/messages`;

  let requestInstance = new Request(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  fetch(requestInstance).then((response) => {
    let result = response.json();
    result.then((res) => {
      console.log(res);
    });
  });
}
