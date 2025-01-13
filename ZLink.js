import { Plugin } from "ckeditor5";
import ZLinkCore from "./ZLinkCore";
import ZLinkUI from "./ZLinkUI";

export default class ZLink extends Plugin {
  static get requires() {
    return [ZLinkCore, ZLinkUI];
  }
}
