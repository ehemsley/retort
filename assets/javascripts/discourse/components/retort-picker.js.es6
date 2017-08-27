import EmojiPicker from 'discourse/components/emoji-picker'
import { emojiUrlFor } from 'discourse/lib/text'

const siteSettings = Discourse.SiteSettings

export default EmojiPicker.extend({

  _scrollTo() {
    if (siteSettings.retort_limited_emoji_set) {
      return
    } else {
      this._super()
    }
  },

  _loadCategoriesEmojis() {
    if (siteSettings.retort_limited_emoji_set) {
      const $picker = $('.emoji-picker')
      $picker.html("")
      siteSettings.retort_allowed_emojis.split('|').map((code) => {
        $picker.append(`<button type="button" title="${code}" class="emoji" />`)
        $(`button.emoji[title="${code}"]`).css("background-image", `url("${emojiUrlFor(code)}")`)
      })
      this._bindEmojiClick($picker);
    } else {
      this._super()
    }
  },

  //override to fix bug where emoji picker is broken if reply window is not open
  _positionPicker() {
    if(!this.get("active")) { return; }

    let windowWidth = this.$(window).width();

    this._super();

    if(!this.site.isMobileDevice && !this._isReplyControlExpanded()) {
      if (windowWidth >= 485) {
        /*
        var previewInputOffset = Ember.$(".d-editor-input").offset() || { left: 0 };
        var _replyControlOffset = Ember.$("#reply-control").offset() || { left: 0 };
        var _left = previewInputOffset.left - _replyControlOffset.left;
        */
        var _left = "50%";
        desktopPositioning({ left: _left, bottom: Ember.$("#reply-control").height() - 48 });
      }
    }
  }
})
