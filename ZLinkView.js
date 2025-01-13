import {
  View,
  LabeledFieldView,
  createLabeledInputText,
  ButtonView,
  icons,
  submitHandler,
} from "ckeditor5";

export class FormView extends View {
  constructor(locale) {
    super(locale);

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
  }

  focus() {
    this.childViews.first.focus();
  }
}
