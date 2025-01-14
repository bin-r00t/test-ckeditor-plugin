import { Plugin } from "ckeditor5";
import AbbreviationUI from "./abbreviationUI";
import AbbreviationEditing from "./abbreviationEditing";

export default class Abbreviation extends Plugin {
    static get requires() {
        return [AbbreviationEditing, AbbreviationUI]
    }
}