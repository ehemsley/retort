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

    var desktopModalePositioning = function desktopModalePositioning(options) {
      var attributes = {
        width: Math.min(windowWidth, 400) - 12,
        marginLeft: -(Math.min(windowWidth, 400) / 2) + 6,
        marginTop: -130,
        left: "50%",
        bottom: "",
        top: "50%",
        display: "flex"
      };

      _this16.$(".emoji-picker-modal").addClass("fadeIn");
      $picker.css(_.merge(attributes, options));
    };

    var mobilePositioning = function mobilePositioning(options) {
      var attributes = {
        width: windowWidth - 12,
        marginLeft: 5,
        marginTop: -130,
        left: 0,
        bottom: "",
        top: "50%",
        display: "flex"
      };

      _this16.$(".emoji-picker-modal").addClass("fadeIn");
      $picker.css(_.merge(attributes, options));
    };

    var desktopPositioning = function desktopPositioning(options) {
      var attributes = {
        width: windowWidth < 485 ? windowWidth - 12 : 400,
        marginLeft: "",
        marginTop: "",
        right: "",
        left: "",
        bottom: 32,
        top: "",
        display: "flex"
      };

      _this16.$(".emoji-picker-modal").removeClass("fadeIn");
      $picker.css(_.merge(attributes, options));
    };

    if (Ember.testing) {
      desktopPositioning();
      return;
    }

    if (this.site.isMobileDevice) {
      mobilePositioning();
    } else {
      if (this._isReplyControlExpanded()) {
        var $editorWrapper = Ember.$(".d-editor-preview-wrapper");
        if ($editorWrapper.is(":visible") && $editorWrapper.width() < 400 || windowWidth < 485) {
          desktopModalePositioning();
        } else {
          if ($editorWrapper.is(":visible")) {
            var previewOffset = Ember.$(".d-editor-preview-wrapper").offset();
            var replyControlOffset = Ember.$("#reply-control").offset();
            var left = previewOffset.left - replyControlOffset.left;
            desktopPositioning({ left: left });
          } else {
            desktopPositioning({
              right: (Ember.$("#reply-control").width() - Ember.$(".d-editor-container").width()) / 2
            });
          }
        }
      } else {
        if (windowWidth < 485) {
          desktopModalePositioning();
        } else {
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

    var infoMaxWidth = $picker.width() - $picker.find(".categories-column").width() - $picker.find(".diversity-picker").width() - 32;
    $picker.find(".info").css("max-width", infoMaxWidth);
  }
})
