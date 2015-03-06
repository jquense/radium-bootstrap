'use strict';
var React = require('react')
var ReactElement = require('react/lib/ReactElement')
var transitions = require('../util/transitions');

var Radium = require('radium');
var { StyleResolverMixin } = Radium;
var settings = require('../settings.js');
var assign = require('lodash/object/assign');

var FadeAnimation = React.createClass({

  mixins: [ StyleResolverMixin ],

  getDefaultProps: function() {
    return {
      'in':     false, 
      onShow:   function(){},
      onShown:  function(){},
      onHide:   function(){},
      onHidden: function(){},
    };
  },

  getStyles: function() {

    return {

      opacity: 0,

      modifiers: [
        {
          in: {
            opacity: 1
          }
        }
      ],

      computed: {
        transition: function(styles) {
          var override = styles.transition && styles.transition.indexOf('opacity') !== -1

          return override
            ? styles.transition
            : styles.transition + ', opacity .15s linear'
        }
      }
    }
  },

  getInitialState: function() {
    return {
      styles: {},
      action: 'enter',
      child: (this.props.in && this.props.children) 
        ? React.Children.only(this.props.children)
        : null
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var state        = {}
      , child        = this.state.child
      , nextChild    = nextProps.children
      , childChanged = this._childChanged(this.props.children, nextChild)
      , updated      = (nextProps.in !== this.props.in)
      , animating;

    if(nextChild) 
      child = nextChild
    
    animating  = child && this.currentlyTransitioningKeys[child.key]

    if( (updated || childChanged) && !animating){
      child = this.current = child || nextChild
      state.action = (nextProps.in === true) ? 'enter' : 'leave'
    }

    if( nextProps.in && child && child !== this.state.child)
      state.child = child

    if ( !!Object.keys(state).length )
      this.setState(state);
  },

  _childChanged: function(oldChild, newChild){

    if( (oldChild == null && newChild != null) || (oldChild != null && newChild == null))
      return true

    return !(oldChild === newChild || oldChild.key === newChild.key)
  },

  componentWillMount: function() {
    this.currentlyTransitioningKeys = {};
  },

  componentDidUpdate: function() {
    var current = this.current
      , action = this.state.action;

    if (current) {
      this.current = null;

      if (action === 'enter') this.performEnter(current.key)
      if (action === 'leave') this.performLeave(current.key)
    }
  },

  componentDidMount: function() {
    var current = this.state.child
      , action  = this.state.action;

    if (current) {
      if (action === 'enter') this.performEnter(current.key)
      if (action === 'leave') this.performLeave(current.key)
    }
  },

  performEnter: function(key) {
    var node  = this.getDOMNode()
      , done = this._handleDoneEntering.bind(this, key);

    this.props.onShow() 
    this.currentlyTransitioningKeys[key] = true;

    node.offsetWidth
    this.setState({ in: true })

    transitions.on(node, done, 300)
  },

  _handleDoneEntering: function(key) {
    this.currentlyTransitioningKeys[key] = false

    if (!this.props.children || this.props.children.key !== key) 
      return this.performLeave(key)
    
    this.props.onShown() 
  },

  performLeave: function(key) {
    var node = this.getDOMNode()
      , done = this._handleDoneLeaving.bind(this, key);

    this.props.onHide()
    this.currentlyTransitioningKeys[key] = true

    node.offsetWidth
    this.setState({ in: false })
    
    transitions.on(node, done, 300)
  },

  _handleDoneLeaving: function(key) {    
    this.currentlyTransitioningKeys[key] = false

    this.setState({ child: null })
    this.props.onHidden() 
  },

  render: function() {
    var child = this.state.child;

    if ( !child )
      return null;

    var modifiers = { in: this.state.in || false };

    var style = assign({}, child.props.style, this.buildStyles(this.getStyles(), modifiers));

    return new ReactElement(child.type,
        child.key,
        child.ref,
        child._owner,
        child._context,
        assign({}, child.props, { style })
      );
  }

})

module.exports = FadeAnimation;