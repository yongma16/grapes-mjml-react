CKEDITOR.dialog.add('csdn-yma16', function (editor) { //要和plugin.js 中的command 一致
    var escape = function (value) {
        return value;
    };
    return {
        title: 'yma16自定义插件', //对话框标题
        minWidth: 500, //对话框宽度
        minHeight: 500,//对话框高度
        contents: [{   //对话框内容
            id: 'choice',
            name: 'choice',
            label: 'radio 单项 选项',
            title: 'radio 单项 选项',
            elements: [{
                id: 'yma16_1',
                type: 'radio', //表单元素类型：单选按钮
                items: [['csdn','[博客]']
                    ,['huawei','[华为云]']
                    ,['aliyun','[阿里云]']
                    ,['juejin','[掘金]']]
            }]
        },{
            id: 'info',
            label: '输入框',
            title: '输入框',
            elements: [ {
                type: 'text',
                id: 'linkDisplayText',
                label: '链接跳转',
                setup: function() {
                    this.enable();

                    this.setValue( editor.getSelection().getSelectedText() );

                    // Keep inner text so that it can be compared in commit function. By obtaining value from getData()
                    // we get value stripped from new line chars which is important when comparing the value later on.
                    initialLinkText = this.getValue();
                },
                commit: function( data ) {
                    data.linkText = this.isEnabled() ? this.getValue() : '';
                }
            }]},
            {
                id: 'info2',
                label: '选择框',
                title: '选择框',
                elements: [ {
                    id: 'linkDisplayText',
                    type: 'select',
                    width:'500px',
                    label: '选择',
                    'default': 'url',
                    items: [
                        [ 'url', 'url' ],
                        [ 'anchor', 'anchor' ],
                        [ 'email', 'email' ],
                        [ 'tel', 'tel' ]
                    ],
                    onChange: function(val){
                        console.log('val',val)
                },
                    setup: function( data ) {
                        this.setValue( data.type || 'url' );
                    },
                    commit: function( data ) {
                        data.type = this.getValue();
                    }
                }]
            }
        ],
        onOk: function () { //点击确定按钮出发onOK事件。以下代码主要目的是构造一个select下拉框
            let a = this.getValueOf('choice', 'yma16_1');
            let rtn = "";

            if(a != null){
                rtn += a;
            }

            if (rtn !== "") {
                rtns = `$\{${rtn}\}$`;
                editor.insertHtml(rtns);
            }
            else {
                return false;
            }
        }
    };
});
function htmlEncode(str) {
    var temp = document.createElement("div");
    (temp.textContent != null) ? (temp.textContent = str) : (temp.innerText = str);
    var output = temp.innerHTML;
    temp = null;
    return output;
}
