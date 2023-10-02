CKEDITOR.plugins.add('yma16-select', {
    init: function (editor) {
        editor.ui.addRichCombo('yma16-select-cmd', { // 按钮名称,启用按钮时的名称
            label: 'yma16社区', // 下拉菜单的名称
            title: 'yma16社区',
            // toolbar: 'insert',
            panel: {
                css: ['/ckeditor/plugins/yma16-select/css/index.css'], // 插件的样式
                multiSelect: false,
                attributes: { 'aria-label': 'yma16社区' }
            },
            init: function () {
                // 点击插件按钮时会触发回调
                this.startGroup('选择我的社区'); // 下拉分组
                // this.add('https://blog.csdn.net/qq_38870145', 'csdn社区') // 下拉的选项
                // this.add('https://developer.aliyun.com/profile/pgpnenmmcxnvi/null', '阿里云社区')
                // this.add('https://bbs.huaweicloud.com/community/usersnew/id_1653152855674612', '华为云社区')
            },
            onClick: function (value) {
                // 点击下拉选项时会触发回调
                editor.insertHtml(value)
            }
        })
    }
});
