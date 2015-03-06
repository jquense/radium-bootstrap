var React = require('react');
var { canUseDOM } = require('react/lib/ExecutionEnvironment');

var Radium = require('radium');
var settings = require('../settings.js');
var { StyleResolverMixin, BrowserStateMixin, MatchMediaItem } = Radium;

var Close = require('./close.jsx');
var assign = require('lodash/object/assign');
var Fade = require('./fade.jsx');

var scrollbarWidth = 0;

if ( canUseDOM ){
  scrollbarWidth = function(){
    var scrollDiv = document.createElement("div"), width;  

    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.width = '50px';
    scrollDiv.style.height = '50px';
    scrollDiv.style.overflow = 'scroll';

    document.body.appendChild(scrollDiv);
    width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return width
  }()
}


function _getStyle(el, prop) {
  if ( 'getComputedStyle' in window ) {
    return window.getComputedStyle(el, null).getPropertyValue(prop)
  }
  //not a great polyfil :/
  return el.style[prop];
}

var SlideFade = React.createClass({

  mixins: [ StyleResolverMixin ],

  render: function(){
      var modifiers = { in: this.state && this.state.in }

      var style = this.buildStyles({
        transform: 'translate(0, -25%)',
        transition: 'transform 0.3s ease-out',

        modifiers:  [
          {
            in: { transform: 'translate(0, 0)' }
          }
        ]
      }, modifiers);

      return (
        <Fade {...this.props} 
          style={style} 
          onShow={()=> this.setState({ in: true })}
          onHide={()=> this.setState({ in: false })}
        >
          {this.props.children}
        </Fade>
      );
  }

});

var BackdropFade = React.createClass({

  mixins: [ StyleResolverMixin ],

  render: function(){
      var style = {};

      if ( this.state && this.state.in)
        style = { opacity: settings.modalBackdropOpacity }

      return (
        <Fade {...this.props} 
          style={style} 
          onShow={()=> this.setState({ in: true })}
          onHide={()=> this.setState({ in: false })}
        >
          {this.props.children}
        </Fade>
      );
  }
});

var Modal = React.createClass({

  mixins: [ StyleResolverMixin, MatchMediaItem ],

  getInitialState: function () {
    return {
      in: this.props.show
    }
  },

  getDefaultProps: function () {
    return {
      size: 'standard',
      show: false,
      backdrop: true,
      onHide: ()=>{}
    }
  },

  getModalStyles: function () {
    var self = this;
    var zIndex = 1050;

    return {
      display: 'none',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: zIndex,
      outline: 0,

      computed: {

        paddingLeft: function (styles) {
          if ( self.isMounted() && self.getDOMNode() != null ) {
            var modalIsOverflowing = self.getDOMNode().scrollHeight > document.documentElement.clientHeight

            return !self._bodyIsOverflowing && modalIsOverflowing ? scrollbarWidth : null
          }

          return null
        },

        paddingRight: function (styles) {

          if ( self.isMounted() && self.getDOMNode() != null) {
            var modalIsOverflowing = self.getDOMNode().scrollHeight > document.documentElement.clientHeight

            return self._bodyIsOverflowing && !modalIsOverflowing ? scrollbarWidth : null
          }

          return null
        }
      },

      modifiers: [
        {
          in: {
            display: 'block'
          }
        }
      ]
    }
  },

  getBackdropStyles: function () {
    var self = this;

    return {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      backgroundColor: settings.modalBackdropBg,

      computed: {
        height: function (styles) {
          if ( self.isMounted() && self.getDOMNode() ) {
            return self.getDOMNode().scrollHeight
          }

          return 'auto'
        }
      }
    }
  },

  getDialogStyles: function () {
    var margin = '30px auto';

    return {
      position: 'relative',
      width: 'auto',
      margin: 10,
      
      modifiers: [
        {
          size: {
            standard: {
              mediaQueries: [
                {
                  sm: {
                    width: settings.modalMd,
                    margin: margin
                  }
                }
              ],
            },
            sm: {
              mediaQueries: [
                {
                  sm: {
                    width: settings.modalSm,
                    margin: margin
                  }
                }
              ]
            },
            lg: {
              mediaQueries: [
                {
                  md: {
                    width: settings.modalLg,
                    margin: margin
                  }
                }
              ]
            }
          },
        } 
      ]
    }
  },

  getContentStyles: function () {

    return {
      position: 'relative',
      backgroundColor: settings.modalContentBg,
      border: `1px solid ${settings.modalContentBorderColor}`,
      borderRadius: settings.borderRadiusLarge,
      boxShadow: "0 3px 9px rgba(0,0,0,.5)",
      backgroundClip: 'padding-box',
      outline: 0,

      mediaQueries: [
        {
          sm: {
            boxShadow: "0 5px 15px rgba(0,0,0,.5)"
          }
        }
      ],
    }
  },

  buildBackdrop: function () {
    var styles = this.buildStyles(this.getBackdropStyles());

    return (
      <BackdropFade in={this.props.show}>
        <div
          ref='backdrop'
          style={styles}
          onClick={this.handleBackdropClick}
        />
      </BackdropFade>
    );
  },

  render: function () {
    var modifiers = { in: this.state.in };

    var modalStyles = this.buildStyles(this.getModalStyles(), modifiers);

    var dialogStyles = this.buildStyles(this.getDialogStyles(), modifiers);

    var contentStyles = this.buildStyles(this.getContentStyles());

    var clickHandler = this.props.backdrop ? this.handleBackdropClick : null

    return (
        <div 
          style={modalStyles}
          ref='modal'
          tabIndex='-1'
          role='dialog'
        >

          { this.props.backdrop && this.buildBackdrop() }
          <SlideFade in={this.props.show} onHidden={()=> this.setState({ in: false })}>
            <div 
              style={dialogStyles}
            >
              <div style={contentStyles}>
                { this.props.children }
              </div>
            </div>
          </SlideFade>
        </div> 
    )
  },

  componentDidMount: function () {

    this._bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight

    this._bodyStyles = _getStyle(document.body, 'overflow');
    document.body.style.overflow = 'hidden';

    this.forceUpdate(); // to check new styles

    document.addEventListener('keyup', this.handleDocumentKeyUp, false);
    window.addEventListener('resize', () => this.forceUpdate(), false);
  },

  componentDidUpdate: function (prevProps) {
    if ( this._opening ) {
      this._opening = false;
      this.forceUpdate() //fix backdrop Height
    }
  },

  componentWillReceiveProps: function (nextProps) {
      this._bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight;
      this._opening = nextProps.show && !this.props.show  

      if ( this._opening) {
        this.setState({ in: true })
      }
  },

  componentWillUnmount: function () {
    document.removeEventListener('keyup', this.handleDocumentKeyUp);
    window.removeEventListener('resize', this.handleUpdate);

    document.body.style.overflow = this._bodyStyles;
  },

  handleBackdropClick: function (e) {
    console.log('click!')
    if (e.target !== e.currentTarget) return;

    if (this.props.backdrop === 'static')
      return

    this.props.onHide();
  },

  handleDocumentKeyUp: function (e) {
    if ( this.props.keyboard && e.keyCode === 27 ){
      if ( this.props.backdrop === 'static')
        return

      this.props.onHide();
    }
  }

})




/* Public Modules */

var Header = React.createClass({

  mixins: [ StyleResolverMixin, BrowserStateMixin ],

  getDefaultProps: function () {
    return {
      tagName: 'h4',
      closeLabel: 'Close Modal',
      onClose: () => {}
    }
  },

  getHeaderStyles: function () {

    return {
      padding: settings.modalTitlePadding,
      borderBottom: `1px solid ${settings.modalHeaderBorderColor}`,
      minHeight: settings.modalTitlePadding + settings.lineHeightBase,
    }
  },

  getTitleStyles: function () {

    return {
      margin: 0,
      lineHeight: settings.lineHeightBase
    }
  },

  render(){
    var headerStyles = this.buildStyles(this.getHeaderStyles());
    var titleStyles = this.buildStyles(this.getTitleStyles());
    var TagName = this.props.tagName;

    return (
      <div style={headerStyles}>
        { this.props.close && 
          <Close 
            aria-label={this.props.closeLabel} 
            style={{ marginTop: -2 }} 
            onClick={this.props.onClose}
          >
            <span aria-hidden="true">
              &times;
            </span>
          </Close>
        }
        <TagName style={titleStyles}>
          {this.props.children}
        </TagName>
      </div>
    )
  }
})

var Body = React.createClass({

  mixins: [ StyleResolverMixin, MatchMediaItem ],

  getStyles: function(){
    return {
      position: 'relative',
      padding: settings.modalInnerPadding
    }
  },

  render: function(){
    return (
      <div 
        style={this.buildStyles(this.getStyles())}
      >
        {this.props.children}
      </div>
    )
  }
})

var Footer = React.createClass({

  mixins: [ StyleResolverMixin, BrowserStateMixin ],

  getStyles: function () {
    return {
      padding: settings.modalInnerPadding,
      textAlign: 'right',
      borderTop: `1px solid ${settings.modalFooterBorderColor}`

      //TODO: btn adjustments no idea how to do .btn + .btn
    }
  },

  render: function (){
    return (
      <div 
        style={this.buildStyles(this.getStyles())}
      >
        {this.props.children}
      </div>
    );
  }
})



Modal.Header = Header;
Modal.Body   = Body;
Modal.Footer = Footer;

module.exports = Modal;

