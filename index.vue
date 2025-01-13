<script setup>
import { ref, computed, unref, watchPostEffect } from 'vue'
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Link } from 'ckeditor5';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import 'ckeditor5/ckeditor5.css';
import ZLink from './plugins/ZLink';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

const editor = ref(null)
const editorRef = ref(null)
const data = ref('<p>Hello world!</p>');
const initialized = ref(false);
const config = {
    licenseKey: 'GPL',
    plugins: [Essentials, Paragraph, Bold, Italic, Link, ZLink],
    toolbar: ['undo', 'redo', '|', 'bold', 'italic', '|', 'zlink']
};

watchPostEffect(() => {
    if (!initialized.value && editorRef.value.instance) {
        CKEditorInspector.attach(unref(editorRef));
        initialized.value = true;
    }
}) 
</script>

<template>
    <div class="editor" style="border: 1px solid #c0c0c0; padding: 10px;">
        <h1 class="my-2 text-center" style="margin-bottom: 10px; font-size: 20px; font-weight: bold;">Custom Editor with
            plugin : MsgLink</h1>
        <ckeditor v-model="data" :editor="ClassicEditor" :config="config" ref="editorRef" />
    </div>
</template>

<style scoped>
.editor {
    min-height: 500px;
    background: #f0f0f0;
}
</style>