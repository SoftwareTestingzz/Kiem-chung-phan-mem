tinymce.init({
    selector: 'textarea',
    plugins: 'lists link image table',
    toolbar: 'undo redo | bold italic | bullist numlist | link image table',
    menubar: true,

    setup: function (editor) {
        editor.on('change', () => editor.save());
    }
});

