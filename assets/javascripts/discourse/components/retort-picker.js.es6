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

    let $picker = this.$('emoji-picker');

    this._super();

    const desktopModalePositioning = options => {
      let attributes = {
       width: Math.min(windowWidth, 400) - 12,
       marginLeft: -(Math.min(windowWidth, 400)/2) + 6,
       marginTop: -130,
       left: "50%",
       bottom: "",
       top: "50%",
       display: "flex"
      };

      this.$(".emoji-picker-modal").addClass("fadeIn");
      $picker.css(_.merge(attributes, options));
   };

    if(!this.site.isMobileDevice && !this._isReplyControlExpanded()) {
      desktopModalePositioning();
    }
  }
})
