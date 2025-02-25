import { Plugin } from "ckeditor5";

export default class AbbreviationEditing extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();
  }

  _defineSchema() {
    const schema = this.editor.model.schema;
    // Extend the text node's schema to accept the abbreviation attribute
    schema.extend("$text", {
      allowAttributes: ["abbreviation"],
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;
    // conversion from a model attribute to a view element.
    conversion.for("downcast").attributeToElement({
      model: "abbreviation",
      view: (modelAttributeValue, conversionApi) => {
        const { writer } = conversionApi;
        return writer.createAttributeElement("abbr", {
          title: modelAttributeValue,
        });
      },
    });

    // conversion from a view element to a model attribute
    conversion.for("upcast").elementToAttribute({
      view: {
        name: "abbr",
        attributes: ["title"],
      },
      model: {
        key: 'abbreviation',
        // Callback function provides access to the view element.
        value: viewElement => {
            const title = viewElement.getAttribute('title');
            return title;
        }
      }
    });
  }
}
