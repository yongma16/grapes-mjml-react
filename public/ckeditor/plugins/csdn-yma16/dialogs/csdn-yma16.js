CKEDITOR.dialog.add('csdn-yma16', function (editor) { //要和plugin.js 中的command 一致
    var escape = function (value) {
        return value;
    };
    return {
        title: '选择一个选项插入文本', //对话框标题
        minWidth: 500, //对话框宽度
        minHeight: 500,//对话框高度
        contents: [{   //对话框内容
            id: 'choice',
            name: 'choice',
            label: '插入选择题答案',
            title: '插入选择题答案',
            elements: [{
                id: 'yma16_1',
                type: 'radio', //表单元素类型：单选按钮
                items: [['csdn','[博客]'],['juejin','[博客]']]
            },
                {
                    id: 'yma16_2',
                    type: 'radio', //表单元素类型：单选按钮
                    items: [['huawei','[芯片]'],['apple','[美国芯片]']]
                },
                {
                    id: 'yma16_3',
                    type: 'radio', //表单元素类型：单选按钮
                    items: [['name','[姓名]']]
                }]
        }],
        onOk: function () { //点击确定按钮出发onOK事件。以下代码主要目的是构造一个select下拉框
            let a = this.getValueOf('choice', 'yma16_1');
            let b = this.getValueOf('choice', 'yma16_2');
            let c = this.getValueOf('choice', 'yma16_3');
            let rtn = "";

            if(a != null){
                rtn += a;
            }

            if(b != null){
                rtn += b;
            }

            if(c != null){
                rtn += c;
            }

            if (rtn != "") {
                rtns = "{{"+rtn+"}}";
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
