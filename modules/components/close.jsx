var React = require('react');
var Radium = require('radium');
var settings = require('../settings.js');
var { StyleResolverMixin, BrowserStateMixin } = Radium;
var { absoluteDarken } = require('../util/color.js');

var CloseButton = React.createClass({
  mixins: [ StyleResolverMixin, BrowserStateMixin ],

  getDefaultProps: function () {
    return {
      tagName: 'button'
    }
  },

  getStyles: function () {
    var hoverAndFocus = {
          color: settings.closeColor,
          textDecoration: 'none',
          cursor: 'pointer',
          opacity: 0.5,
        };

    return {
      float: 'right',
      fontSize: settings.fontSizeBase * 1.5,
      fontHeight: settings.closeFontEeight,
      lineHeight: 1,
      color: settings.closeColor,
      textShadow: settings.closeTextShadow,
      opacity: 0.2,

      states: [
        { hover: hoverAndFocus},
        { focus: hoverAndFocus},
      ],
      modifiers: [
        {
          button: {
            padding: 0,
            cursor: 'pointer',
            background: 'transparent',
            border: 0
          }
        }
      ]
    }
  },

  render(){
    var TagName = this.props.tagName;

    var additionalModifiers = {
      button: TagName === 'button'
    };

    var styles = this.buildStyles(this.getStyles(), additionalModifiers);

    return (
      <TagName 
        {...this.props}
        {...this.getBrowserStateEvents()}
        style={styles}
      >
        {this.props.children}
      </TagName>
    )
  }
});


module.exports = CloseButton;