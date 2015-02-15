var React = require('react');
var Radium = require('radium');
var _ = require('lodash');
var { StyleResolverMixin, BrowserStateMixin } = Radium;

var Select = React.createClass({
  mixins: [ StyleResolverMixin, BrowserStateMixin ],

  getInitialState: function () {
    if (this.props.multiple) {
      return { optionsState: [] };
    }
    return { optionsState: this.props.options[0].value };
  },

  getDefaultProps: function () {
    return {
      tagName: 'select',
      multiple: false
    };
  },

  getStyles: function () {
    var stateStyles = {
      borderColor: '#66afe9',
      boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)',
      outline: 0
    };

    return {
      standard: {
        color: 'inherit',
        font: 'inherit',
        lineHeight: 'inherit',
        margin: 0,
        textTransform: 'none'
      },
      modifiers: {
        formControl: {
          backgroundColor: '#fff',
          backgroundImage: 'none',
          borderColor: '#ccc',
          borderRadius: 4,
          borderStyle: 'solid',
          borderWidth: '1px',
          boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
          boxSizing: 'border-box',
          color: '#555',
          display: 'block',
          font: 'inherit',
          fontSize: 14,
          height: 34,
          lineHeight: '1.42857143',
          margin: 0,
          padding: '6px 12px',
          transition: 'border-color ease-in-out .15s, box-shadow ease-in-out .15s',
          width: '100%',

          states: {
            focus: stateStyles,
            active: stateStyles
          }
        },
        multiple: {
          height: 'auto'
        }
      }
    };
  },

  handleChange: function (ev) {
    var optionsStateClone = _.clone(this.state.optionsState);

    if (this.props.multiple) {
      this.setState({ optionsState: optionsStateClone.push(ev.target.value) });
    } else {
      this.setState({ optionsState: ev.target.value });
    }
  },

  buildChildren: function (options) {
    var optionsArray = [];

    _.each(options, function(option, index) {
      optionsArray.push(
        <option
          key={index}
          value={option.value}
        >
          {option.label}
        </option>
      );
    }, this);

    return optionsArray;
  },

  render: function () {
    var styles = this.buildStyles(this.getStyles());
    var TagName = this.props.tagName;

    return (
      <TagName
        {...this.getBrowserStateEvents()}
        style={styles}
        value={this.state.optionsState}
        multiple={this.props.multiple}
        onChange={this.handleChange}
      >
        {this.buildChildren(this.props.options)}
      </TagName>
    );
  }
});

module.exports = Select;
