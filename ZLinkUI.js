import { Plugin, ButtonView, icons, ContextualBalloon } from "ckeditor5";
import { FormView } from "./ZLinkView";
import "./style.css";

export default class ZLinkUI extends Plugin {
  static get requires() {
    return [ContextualBalloon];
  }

  init() {
    const editor = this.editor;

    /** balloon */
    this._balloon = this.editor.plugins.get(ContextualBalloon);
    this.formView = this._createFormView();

    editor.ui.componentFactory.add("zlink", (locale) => {
      const buttonView = new ButtonView(locale);
      buttonView.set({
        label: "ZLink",
        icon: icons.check,
        withText: true,
      });

      buttonView.on("execute", () => {
        this._showUI();
        // editor.model.change((writer) => {
        //   const selection = editor.model.document.selection;
        //   editor.model.insertContent(
        //     writer.createText("test", { linkHref: "baidu.com" })
        //   );
        // });
      });
      return buttonView;
    });
  }

  _createFormView() {
    const fv = new FormView(this.editor.locale);

    this.listenTo(fv, "submit", () => {
      const title = fv.titleInputView.fieldView.element.value;
      const url = fv.linkInputView.fieldView.element.value;
      this.editor.model.change((writer) => {
        this.editor.model.insertContent(
          writer.createText(title, { linkHref: url })
        );
      });
    });
    return fv;
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;

    // Set a target position by converting view selection range to DOM.
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
}
