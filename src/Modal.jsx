/** @jsx React.DOM */

var React = require('react');
var classSet = require('./utils/classSet');
var BootstrapMixin = require('./BootstrapMixin');
var FadeMixin = require('./FadeMixin');
var EventListener = require('./utils/EventListener');


// TODO:
// - aria-labelledby
// - Add `modal-body` div if only one child passed in that doesn't already have it
// - Tests

var Modal = React.createClass({
  mixins: [BootstrapMixin, FadeMixin],

  propTypes: {
    title: React.PropTypes.renderable,
    backdrop: React.PropTypes.oneOf(['static', true, false]),
    keyboard: React.PropTypes.bool,
    closeButton: React.PropTypes.bool,
    animation: React.PropTypes.bool,
    onRequestHide: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      bsClass: 'modal',
      backdrop: true,
      keyboard: true,
      animation: true,
      closeButton: true
    };
  },

  render: function () {
    var modalStyle = {display: 'block'};
    var dialogClasses = this.getBsClassSet();
    delete dialogClasses.modal;
    dialogClasses['modal-dialog'] = true;

    var classes = {
      modal: true,
      fade: this.props.animation,
      'in': !this.props.animation || !document.querySelectorAll
    };

    var modal = this.transferPropsTo(
      <div
        title={null}
        tabIndex="-1"
        role="dialog"
        style={modalStyle}
        className={classSet(classes)}
        onClick={this.props.backdrop === true ? this.handleBackdropClick : null}
        ref="modal">
        <div className={classSet(dialogClasses)}>
          <div className="modal-content">
            {this.props.title ? this.renderHeader() : null}
            {this.props.children}
          </div>
        </div>
      </div>
    );

    return this.props.backdrop ?
      this.renderBackdrop(modal) : modal;
  },

  renderBackdrop: function (modal) {
    var classes = {
      'modal-backdrop': true,
      'fade': this.props.animation
    };

    classes['in'] = !this.props.animation || !document.querySelectorAll;

    var onClick = this.props.backdrop === true ?
      this.handleBackdropClick : null;

    return (
      <div>
        <div className={classSet(classes)} ref="backdrop" onClick={onClick} />
        {modal}
      </div>
    );
  },

  renderHeader: function () {
    var closeButton;
    if (this.props.closeButton) {
      closeButton = (
          <button type="button" className="close" aria-hidden="true" onClick={this.props.onRequestHide}>&times;</button>
        );
    }

    return (
      <div className="modal-header">
        {closeButton}
        {this.renderTitle()}
      </div>
    );
  },

  renderTitle: function () {
    return (
      React.isValidComponent(this.props.title) ?
        this.props.title : <h4 className="modal-title">{this.props.title}</h4>
    );
  },

  componentDidMount: function () {
    this._onDocumentKeyupListener =
      EventListener.listen(document, 'keyup', this.handleDocumentKeyUp);
  },

  componentWillUnmount: function () {
    this._onDocumentKeyupListener.remove();
  },

  handleBackdropClick: function (e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    this.props.onRequestHide();
  },

  handleDocumentKeyUp: function (e) {
    if (this.props.keyboard && e.keyCode === 27) {
      this.props.onRequestHide();
    }
  }
});

module.exports = Modal;
