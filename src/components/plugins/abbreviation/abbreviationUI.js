import {
  Plugin,
  ButtonView,
  ContextualBalloon,
  clickOutsideHandler,
} from "ckeditor5";
import FormView from "./abbreviationView";
import "./style.css";

export default class AbbreviationUI extends Plugin {
  static get requires() {
    return [ContextualBalloon];
  }

  init() {
    console.log("[Plugin UI] init...");
    const editor = this.editor;

    // create ballon view and form view
    this._balloon = this.editor.plugins.get(ContextualBalloon);
    this.formView = this._createFormView();

    // add ui button
    editor.ui.componentFactory.add("abbreviation", () => {
      /** button config */
      const button = new ButtonView();
      button.label = "Abbreviation";
      button.tooltip = true;
      button.withText = true;

      /** listener config */
      /** or button.on('execute', () => {}) */
      this.listenTo(button, "execute", () => {
        this._showUI();
        // const selection = editor.model.document.selection;
        // const title = "What you see is waht you got";
        // const abbr = "WYSIWYG";

        // editor.model.change((writer) => {
        //   editor.model.insertContent(
        //     // create a text node with the abbreviation attribute;
        //     writer.createText(abbr, { abbreviation: title })
        //   );
        // });
      });
      return button;
    });
  }

  /** private */
  _createFormView() {
    const editor = this.editor;
    const formView = new FormView(editor.locale);

    /** listeners... */
    this.listenTo(formView, "submit", () => {
      const title = formView.titleInputView.fieldView.element.value;
      const abbr = formView.abbrInputView.fieldView.element.value;
      editor.model.change((writer) => {
        editor.model.insertContent(
          writer.createText(abbr, { abbreviation: title })
        );
      });

      /// hide
      this._hideUI();
    });

    this.listenTo(formView, "cancel", () => {
      this._hideUI();
    });

    clickOutsideHandler({
      emitter: formView,
      activator: () => this._balloon.visibleView === formView,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI(),
    });
    return formView;
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;

    console.log("viewDocument.selection", viewDocument.selection);

    target = () =>
      view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());
    return {
      target,
    };
  }

  _showUI() {
    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData(),
    });
    this.formView.focus();
  }

  _hideUI() {
    this.formView.abbrInputView.fieldView.value = "";
    this.formView.titleInputView.fieldView.value = "";
    this.formView.element.reset();
    this._balloon.remove(this.formView);
    this.editor.editing.view.focus();
  }
}
