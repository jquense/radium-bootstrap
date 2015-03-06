// React
var React = require('react');
var Radium = require('radium');
var { StyleResolverMixin, MatchMediaBase } = Radium;

var ReactStyleGuide = require('react-style-guide');
require('react-style-guide/react-style-guide.css');

var RadiumBootstrap = require('../modules/index.js');

var Container = RadiumBootstrap.Container;
var Row = RadiumBootstrap.Row;
var Col = RadiumBootstrap.Col;

var Button = RadiumBootstrap.Button;
var Close = RadiumBootstrap.Close;
var Form = RadiumBootstrap.Form;
var Input = RadiumBootstrap.Input;
var HelpText = RadiumBootstrap.HelpText;
var InputGroup = RadiumBootstrap.InputGroup;
var InputGroupAddon = RadiumBootstrap.InputGroupAddon;
var Textarea = RadiumBootstrap.Textarea;
var StaticControl = RadiumBootstrap.StaticControl;

var Modal = RadiumBootstrap.Modal;

// Temporary Style Guide hack
var reactTools = require('react-tools');

var convertExample = function (component) {
  return eval(reactTools.transform(component));
};

var gridMarkup = require('raw!./markup/grid.txt');
var offsetColumnsMarkup = require('raw!./markup/offset-columns.txt');
var pulledColumnsMarkup = require('raw!./markup/pulled-columns.txt');
var nestedGridMarkup = require('raw!./markup/nested-grid.txt');
var modalMarkup = require('raw!./markup/modal.txt');

var MEDIA_QUERIES = {
  sm: '(min-width: 768px)',
  md: '(min-width: 992px)',
  lg: '(min-width: 1200px)',
  xsMax: '(max-width: 768px)',
  smMax: '(max-width: 992px)',
  mdMax: '(max-width: 1200px)'
};

MatchMediaBase.init(MEDIA_QUERIES);

var colDemoStyles = {
  background: 'rgba(117,190,255,0.5)',
  border: '1px solid #0074D9',
  color: '#0074D9',
  minHeight: 80,
  textAlign: 'center',
  paddingTop: '1em',
  paddingBottom: '1em'
};

var App = React.createClass({
  mixins: [ StyleResolverMixin, MatchMediaBase ],

  getInitialState() {
      return {
          show: false 
      };
  },
  
  render: function () {
    var closeModal = () => this.setState({ show: false })

    return (
      <main>
        <Container fluid={true}>

          <ReactStyleGuide
            title="Modal"
            staticMarkup={modalMarkup}
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            <Button onClick={() => this.setState({ show: true })}>
              Show
            </Button>
            <Modal size='lg' show={this.state.show} fade onHide={closeModal}>
              <Modal.Header close onClose={closeModal}>
                Hello
              </Modal.Header>
              
              <Modal.Body>
                <p>One fine body&hellip;</p>
              </Modal.Body>
              <Modal.Footer>
                <Button>
                  Hi
                </Button>
              </Modal.Footer>
            </Modal>
          </ReactStyleGuide>

          

          <ReactStyleGuide
            title="Button"
            markupExpandedByDefault={true}
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            <Button>
              Default
            </Button>

            <Close 
              style={{float: 'none'}}
            >
              <span>&times;</span>
            </Close>

            <Button
              style={{marginLeft: '0.5em'}}
              kind='primary'
            >
              Primary
            </Button>

            <Button
              style={{marginLeft: '0.5em'}}
              kind='success'
            >
              Success
            </Button>

            <Button
              style={{marginLeft: '0.5em'}}
              kind='info'
            >
              Info
            </Button>

            <Button
              style={{marginLeft: '0.5em'}}
              kind='warning'
            >
              Warning
            </Button>

            <Button
              style={{marginLeft: '0.5em'}}
              kind='danger'
            >
              Danger
            </Button>

            <Button
              style={{marginLeft: '0.5em'}}
              kind='link'
            >
              Link
            </Button>
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Button Sizes"
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            <Button
              size='large'
              >
              Large
            </Button>

            <Button
              style={{marginLeft: '0.5em'}}
            >
              Normal
            </Button>

            <Button
              size='small'
              style={{marginLeft: '0.5em'}}
              >
              Small
            </Button>

            <Button
              size='extraSmall'
              style={{marginLeft: '0.5em'}}
              >
              Extra Small
            </Button>
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Block Level Buttons"
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            <Button
              kind='primary'
              size='large'
              block={true}
            >
              Block Level
            </Button>
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Disabled Buttons"
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            <Button
              kind='primary'
              disabled={true}
            >
              Disabled
            </Button>
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Active Buttons"
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            <Button
              kind='primary'
              active={true}
              >
              Active
            </Button>

            <Button
              kind='link'
              active={true}
              style={{marginLeft: '0.5em'}}
              >
              Active
            </Button>
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Basic form"
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            <Form>
              <Input
                label='Email'
                type='text'
                formControl={true}
                placeholder='Email'
              />
              <Input
                label='Password'
                type='password'
                formControl={true}
                placeholder='Password'
              />
              <Input
                label='File input'
                type='file'
              />
              <HelpText value='Example block-level help text here.' />
              <Button
                type='submit'
              >
                Submit
              </Button>
            </Form>
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Inline form"
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            <Form
              inline={true}
            >
              <Input
                label='Name'
                type='text'
                formControl={true}
                placeholder='Jane Doe'
              />
              <Input
                label='Email'
                type='email'
                formControl={true}
                placeholder='jane.doe@example.com'
              />
              <Button
                type='submit'
              >
                Send invitation
              </Button>
            </Form>
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Hidden labels"
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            <Form
              inline={true}
            >
              <Input
                label='Email'
                type='email'
                formControl={true}
                placeholder='Enter email'
                labelHidden={true}
              />
              <Input
                label='Password'
                type='password'
                formControl={true}
                placeholder='Password'
                labelHidden={true}
              />
              <Button
                type='submit'
              >
                Sign in
              </Button>
            </Form>
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Input groups"
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            <Form
              inline={true}
            >
              <InputGroup>
                <InputGroupAddon>$</InputGroupAddon>
                <Input
                  label='Amount (in dollars)'
                  type='text'
                  formControl={true}
                  placeholder='Amount'
                  labelHidden={true}
                />
                <InputGroupAddon>.00</InputGroupAddon>
              </InputGroup>
              <Button
                type='submit'
                kind='primary'
              >
                Transfer cash
              </Button>
            </Form>
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Textarea"
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            <Textarea
              rows='3'
              placeholder='Textarea'
            />
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Static controls"
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            <Form
              inline={true}
            >
              <StaticControl>email@example.com</StaticControl>
              <Input
                label='Password'
                type='password'
                formControl={true}
                placeholder='Password'
                labelHidden={true}
              />
              <Button>Confirm identity</Button>
            </Form>
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Grid"
            staticMarkup={gridMarkup}
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            {convertExample(gridMarkup)}
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Offset Columns"
            staticMarkup={offsetColumnsMarkup}
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            {convertExample(offsetColumnsMarkup)}
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Pushed and Pulled Columns"
            staticMarkup={pulledColumnsMarkup}
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            {convertExample(pulledColumnsMarkup)}
          </ReactStyleGuide>

          <ReactStyleGuide
            title="Nested Grids"
            staticMarkup={nestedGridMarkup}
            expanderActiveText="Hide Code"
            expanderInactiveText="Show Code"
          >
            {convertExample(nestedGridMarkup)}
          </ReactStyleGuide>
        </Container>
      </main>
    );
  }
});

module.exports = App;
