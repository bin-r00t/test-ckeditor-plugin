import { Command, findAttributeRange, toMap } from "ckeditor5";
import getRangeText from "./helpers";

export default class ZLinkCommand extends Command {
  execute({ title, link }) {
    const model = this.editor.model;
    const { selection } = model.document;

    model.change((writer) => {
      console.log("---", selection.isCollapsed, this.value, title, link === "");
      if (selection.isCollapsed) {
        // When a collapsed selection is inside text with the "linkHref" attribute,
        // update its text and title.
        if (this.value) {
          const { end: positionAfter } = model.insertContent(
            writer.createText(title, { linkHref: link }),
            this.value.range
          );
          writer.setSelection(positionAfter);
        } else if (link !== "") {
          const firstPosition = selection.getFirstPosition();
          const attributes = toMap(selection.getAttributes());
          attributes.set("linkHref", link);

          const { end: positionAfter } = model.insertContent(
            writer.createText(title, attributes),
            firstPosition
          );
          writer.setSelection(positionAfter);
        }
        // model.insertContent(writer.createText(title, { linkHref: link }));
        writer.removeSelectionAttribute("linkHref");
      } else {
        const ranges = model.schema.getValidRanges(
          selection.getRanges(),
          "linkHref"
        );

        for (const range of ranges) {
          writer.setAttribute("linkHref", link, range);
        }
      }
    });
  }

  refresh() {
    const { model } = this.editor;
    const { selection } = model.document;
    const firstRange = selection.getFirstRange();

    // when the selection is collapsed, the command has a value if the caret is in an link
    if (firstRange.isCollapsed) {
      if (selection.hasAttribute("linkHref")) {
        const link = selection.getAttribute("linkHref");

        const linkRange = findAttributeRange(
          selection.getFirstPosition(),
          "linkHref",
          link,
          model
        );

        /** this value is command's value */
        this.value = {
          range: linkRange,
          title: getRangeText(linkRange),
          url: link, // ?
        };
      } else {
        if (selection.hasAttribute("linkHref")) {
          const linkValue = selection.getAttribute("linkHref");
          const linkRange = findAttributeRange(
            selection.getFirstPosition(),
            "linkHref",
            linkValue,
            model
          );

          /** 如果所选的文字和linkRange有重合了，loose: true 不管是完全重合、只重合头部还是只重合部分尾部 */
          if (linkRange.containsRange(firstRange, true)) {
            this.value = {
              url: linkValue,
              title: getRangeText(firstRange),
              range: firstRange,
            };
          } else {
            this.value = null;
          }
        } else {
          this.value = null;
        }
      }
    }

    // check whether this command is enabled
    this.isEnabled = model.schema.checkAttributeInSelection(
      selection,
      "linkHref"
    );
  }
}
