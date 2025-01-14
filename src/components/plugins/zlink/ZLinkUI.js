import {
  Plugin,
  ButtonView,
  icons,
  ContextualBalloon,
  clickOutsideHandler,
} from "ckeditor5";
import { FormView } from "./ZLinkView";
import "./style.css";
import getRangeText from "./helpers";

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
        icon: icons.bookmarkInline,
        // withText: true,
        tooltip: true,
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

      // this.editor.model.change((writer) => {
      //   this.editor.model.insertContent(
      //     writer.createText(title, { linkHref: url })
      //   );
      // });

      const commandPayload = {
        title,
        link: url,
      };
      this.editor.execute("insertLink", commandPayload);
      this._hideUI();
    });

    this.listenTo(fv, "cancel", () => {
      this._hideUI();
    });

    clickOutsideHandler({
      emitter: fv,
      activator: () => this._balloon.visibleView === fv,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI(),
    });

    fv.keystrokeHandler.set("Esc", (data, cancel) => {
      this._hideUI();
      cancel();
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
    const selection = this.editor.model.document.selection;

    // Check the value of the command.
    const commandValue = this.editor.commands.get("insertLink").value;

    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData(),
    });

    // disabled the input when the selection is not collapsed
    this.formView.titleInputView.isEnabled =
      selection.getFirstRange().isCollapsed;

    // Fill the form using the state (value) of the command.
    if (commandValue) {
      this.formView.linkInputView.fieldView.value = commandValue.url;
      this.formView.titleInputView.fieldView.value = commandValue.title;
    } else {
      const selectedText = getRangeText(selection.getFirstRange());
      this.formView.titleInputView.fieldView.value = selectedText;
      this.formView.linkInputView.fieldView.value = "";
    }

    this.formView.focus();
  }

  _hideUI() {
    this.formView.titleInputView.fieldView.value = "";
    this.formView.linkInputView.fieldView.value = "";
    this.formView.element.reset();

    this._balloon.remove(this.formView);

    this.editor.editing.view.focus();
  }
}
