class EventBus {
  constructor () {
    this.topics = {}
  }

  createTopic (topic) {
    if (!this.topicIsCreated(topic)) {
      this.topics[topic] = []
    }
  }

  publish (topic, payload, message) {
    if (!this.topicIsCreated(topic)) {
      throw new Error(`[${this.constructor.name}]  Cannot publish a message in non-existent topic '${topic}'`)
    }

    const topicSubscribers = this.topics[topic]

    topicSubscribers.forEach(function (handler) {
      handler.call(this, payload, message)
    })
  }

  subscribe (topic, handler) {
    let handlers = this.topics[topic]

    if (!this.topicIsCreated(topic)) {
      handlers = this.topics[topic] = []
      throw new Error(`[${this.constructor.name}] Cannot subscribe to non-existent topic '${topic}'`)
    }

    handlers.push(handler)
  }

  topicIsCreated (topic) {
    return {}.propertyIsEnumerable.call(this.topics, topic)
  }

  async unsubscribe (topic, handler) {
    const handlers = this.topics[topic]
    if (!!handlers === false) return

    const handlerId = handler.indexOf(handler)
    handlers.splice(handlerId)
  }
}

module.exports = new EventBus()
