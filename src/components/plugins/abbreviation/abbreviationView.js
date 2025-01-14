import {
  View,
  LabeledFieldView,
  createLabeledInputText,
  ButtonView,
  icons,
  submitHandler,
} from "ckeditor5";

/** Form View */
export default class FormView extends View {
  constructor(locale) {
    super(locale);

    /** create inputs */
    this.abbrInputView = this._createInput("Add abbreviation");
    this.titleInputView = this._createInput("Add title");
    /** create buttons */
    this.saveButtonView = this._createButton(
      "Save",
      icons.check,
      "ck-button-save"
    );
    // set type to 'submit', which will trigger the submit event on entire form when clicked
    this.saveButtonView.type = "submit";

    this.cancelButtonView = this._createButton(
      "Cancel",
      icons.cancel,
      "ck-button-cancel"
    );
    // delegate ButtonView#execute event to FormView#cancel event.
    this.cancelButtonView.delegate("execute").to(this, "cancel");

    // create a collection
    this.childViews = this.createCollection([
      this.abbrInputView,
      this.titleInputView,
      this.saveButtonView,
      this.cancelButtonView,
    ]);

    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-abbr-form"],
        tabindex: "-1",
      },
      children: this.childViews,
    });
  }

  /** public */
  render() {
    super.render();
    // Submit the form when the user clicked the save button
    // or pressed enter in the input.
    submitHandler({
      view: this,
    });
  }

  /** public */
  focus() {
    this.childViews.first.focus();
  }

  /** private */
  _createInput(label) {
    const labeledInput = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    );
    labeledInput.label = label;
    return labeledInput;
  }

  /** private */
  _createButton(label, icon, className) {
    const button = new ButtonView();

    button.set({
      label,
      icon,
      tooltip: true,
      class: className,
    });

    return button;
  }
}
