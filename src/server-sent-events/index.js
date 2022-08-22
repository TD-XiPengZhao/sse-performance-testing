const MAX_RETRY = 3

export default class SSESdk {
  constructor(url) {
    this.url = url
    this.evtSource = null
  }

  subscribe(distributeMessages, retry = MAX_RETRY) {
    this.evtSource = new EventSource(this.url)

    this.evtSource.addEventListener('open', () => {
      console.log('server sent events channel created ')
    })

    this.evtSource.addEventListener('message', e => {
      retry = MAX_RETRY
      let message
      try {
        message = JSON.parse(e.data)?.payload
      } catch (e) {
        console.error('parse messages from server failed')
      }

      console.log('Receiving data...', message)

      if (typeof distributeMessages === 'function' && message) {
        distributeMessages(message)
      }
    })

    this.evtSource.addEventListener('error', () => {
      console.error(`EventSource connection failed for subscribe. Retry.`)

      if (retry > 0) {
        this.unsubscribe()
        this.subscribe(distributeMessages, --retry)
      } else {
        this.evtSource && this.evtSource.close()
      }
    })
  }

  unsubscribe() {
    if (this.evtSource) {
      this.evtSource.close()
    }
  }
}
