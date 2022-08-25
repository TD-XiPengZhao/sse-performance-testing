import { EventSourcePolyfill } from "event-source-polyfill";

const MAX_RETRY = 3;

export default class SSESdk {
  constructor(url, token) {
    this.url = url;
    this.evtSource = null;
    this.retryCount = 0;
    this.messagesCount = 0;
    this.token = token;
  }

  subscribe(distributeMessages, distributeMessagesState, retry = MAX_RETRY) {
    const eventSourceInitDict = {
      headers: { Authorization: `Bearer ${this.token}` },
    };

    this.evtSource = new EventSourcePolyfill(this.url, eventSourceInitDict);

    this.evtSource.addEventListener("open", () => {
      console.log("server sent events channel created ");
      distributeMessagesState({ evtSource: this.evtSource });
    });

    this.evtSource.addEventListener("message", (e) => {
      console.log(e.data);
      retry = MAX_RETRY;
      let message;
      try {
        message = JSON.parse(e.data)?.payload;
      } catch (e) {
        console.error("parse messages from server failed");
      }

      console.log("Receiving data...", message);

      if (typeof distributeMessages === "function" && message) {
        this.messagesCount++;
        distributeMessages({ message, evtSource: this.evtSource });
      }
    });

    this.evtSource.addEventListener("error", () => {
      console.error(`EventSource connection failed for subscribe. Retry.`);
      if (retry > 0) {
        this.unsubscribe();
        this.retryCount++;
        this.subscribe(distributeMessages, distributeMessagesState, --retry);
      } else {
        this.evtSource && this.evtSource.close();
        distributeMessagesState({ evtSource: this.evtSource });
      }
    });
  }

  unsubscribe() {
    if (this.evtSource) {
      this.evtSource.close();
    }
  }
}
