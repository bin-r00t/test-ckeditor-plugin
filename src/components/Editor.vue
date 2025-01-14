<template>
  <ckeditor
    v-model="value"
    :editor="ClassicEditor"
    :config="config"
    ref="editor"
  />
  <button style="margin-top: 20px" @click="handleAttach">attach</button>
</template>

<script setup>
import { ref, computed } from "vue";
import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from "ckeditor5";
import { Ckeditor } from "@ckeditor/ckeditor5-vue";
import CKEditorInspector from "@ckeditor/ckeditor5-inspector";
import ZLinkPlugin from "./plugins/zlink/ZLink";
import "ckeditor5/ckeditor5.css";

const value = defineModel("value");
const editor = ref();
const config = computed(() => {
  return {
    licenseKey: "GPL",
    plugins: [Essentials, Paragraph, Bold, Italic, ZLinkPlugin],
    toolbar: ["undo", "redo", "|", "bold", "italic", "|", "zlink"],
  };
});
const handleAttach = () => {
  CKEditorInspector.attach(editor.value);
};
</script>
