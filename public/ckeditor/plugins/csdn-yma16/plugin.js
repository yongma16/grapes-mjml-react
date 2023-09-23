(function() {
    CKEDITOR.plugins.add("csdn-yma16", {
        requires: ["dialog"],
        init: function(a) {
            a.addCommand("csdn-yma16", new CKEDITOR.dialogCommand("csdn-yma16"));
            a.ui.addButton("csdn-yma16", {
                label: "csdn-yma16",//调用dialog时显示的名称
                command: "csdn-yma16",
                icon: this.path + "icons/yma16.jpg"//在toolbar中的图标
            });
            console.log('this.path',this.path)
            CKEDITOR.dialog.add("csdn-yma16", this.path + "dialogs/csdn-yma16.js")

        }

    })

})();
