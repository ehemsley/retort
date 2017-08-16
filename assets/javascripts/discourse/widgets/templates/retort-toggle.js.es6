import { h } from 'virtual-dom'
import { emojiUrlFor } from 'discourse/lib/text'

export default Ember.Object.create({
  render(widget) {
    this.state = widget.state
    return [this.emoji(), this.count(), this.tooltip()]
  },

  emoji() {
    return h('img.emoji', { src: emojiUrlFor(this.state.emoji), alt: `:${this.state.emoji}:` })
  },

  count() {
    if (this.state.usernames.length < 2) { return }
    return h('span.post-retort__count', this.state.usernames.length.toString())
  },

  tooltip() {
    return h('span.post-retort__tooltip', this.sentence())
  },

  sentence() {
    let usernames = this.state.usernames
    let string = ""
    usernames.forEach(function(username) {
      string += username + " | "
    })
    return string.substring(0, string.length - 3)
  }

})
