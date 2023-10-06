(function() {
    CKEDITOR.plugins.add( 'yma16-blog', {
        init: function( editor ) {
            editor.addCommand( 'jumpToCsdn', {
                exec: function( editor ) {
                    if(editor.config.callbackEmail){
                        editor.config.callbackEmail(editor)
                    }
                    // console.log(editor.config.options,'email')
                    // // console.log(editor.config.options.callbackEmail,'email callbackEmail')
                    // console.log(CKEDITOR.config,'CKEDITOR config')
                    // console.log(CKEDITOR.config.options,'CKEDITOR config options')
                    // console.log(CKEDITOR.config.callbackEmail,'CKEDITOR.config.callbackEmail')
                    // if(CKEDITOR.config.callbackEmail){
                    //     CKEDITOR.config.callbackEmail(editor)
                    // }
                    // window.open('https://blog.csdn.net/qq_38870145','_blank')
                    // var now = new Date();
                    // editor.insertHtml( 'The current date and time is: <em>' + now.toString() + '</em>' );
                }
            });
            editor.ui.addButton( '跳转csdn', {
                label: '跳转csdn',
                title:'跳转csdn',
                command: 'jumpToCsdn',
                icon:'https://yongma16.xyz/staticFile/common/img/logo.png'
                // toolbar: 'insert'
            });
        }
    });

})();
