import {
  View,
  LabeledFieldView,
  createLabeledInputText,
  ButtonView,
  icons,
  submitHandler,
  KeystrokeHandler,
  FocusTracker,
  FocusCycler
} from "ckeditor5";

export class FormView extends View {
  constructor(locale) {
    super(locale);

    /** accessibility - helpers */
    this.keystrokeHandler = new KeystrokeHandler();
    this.focusTracker = new FocusTracker();

    /** input views */
    this.titleInputView = this._createInput("Label");
    this.linkInputView = this._createInput("URL");

    /** button view */
    this.okButtonView = new ButtonView(this.locale);
    this.okButtonView.set({
      label: "Save",
      tooltip: true,
      icon: icons.check,
    });
    this.okButtonView.type = "submit";
    this.cancelButtonView = new ButtonView(this.locale);
    this.cancelButtonView.set({
      label: "Cancel",
      icon: icons.cancel,
      tooltip: true,
    });
    this.cancelButtonView.delegate("execute").to(this, "cancel");

    /** wrap all to children */
    this.childViews = this.createCollection([
      this.titleInputView,
      this.linkInputView,
      this.okButtonView,
      this.cancelButtonView,
    ]);

    /** focus cycler */
    this._focusCycler = new FocusCycler({
      focusables: this.childViews,
      keystrokeHandler: this.keystrokeHandler,
      focusTracker: this.focusTracker,
      actions: {
        focusPrevious: 'shift+tab',
        focusNext: 'tab'
      }
    })

    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-zlink-form"],
        tabindex: -1,
      },
      children: this.childViews,
    });
  }

  _createInput(label) {
    const labeledInputView = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    );
    labeledInputView.label = label;
    return labeledInputView;
  }

  render() {
    super.render();

    submitHandler({
      view: this,
    });

    /** some accessibility skills */
    this.childViews.forEach((view) => {
      /** add each view to the focusTracker */
      this.focusTracker.add(view.element);
    });

    /** start listening for the keystrokes coming from #element */
    this.keystrokeHandler.listenTo(this.element);
  }

  focus() {
    // this.childViews.first.focus();
    if (this.titleInputView.isEnabled) {
      this.titleInputView.focus()
    } else {
      this.linkInputView.focus()
    }
  }

  destroy() {
    super.destroy();

    this.focusTracker.destroy();
    this.keystrokeHandler.destroy();
  }
}
