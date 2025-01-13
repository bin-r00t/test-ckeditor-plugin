import { Plugin } from "ckeditor5";

export default class ZLinkCore extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();
  }

  _defineSchema() {
    const schema = this.editor.model.schema;
    schema.extend("$text", {
      allowAttributes: ["linkHref"],
    });
  }

  _defineConverters() {
    const { conversion } = this.editor;

    conversion.for("downcast").attributeToElement({
      model: "linkHref",
      view: (modelAttributeValue, conversionApi) => {
        const { writer } = conversionApi;
        return writer.createAttributeElement("a", {
          href: modelAttributeValue,
        });
      },
    });

    conversion.for("upcast").elementToAttribute({
      view: {
        name: "a",
        attributes: ["href"],
      },
      model: {
        key: "linkHref",
        value: (viewElement) => {
          console.log("viewElement", viewElement);
          return viewElement.getAttribute("href");
        },
      },
    });
  }
}
