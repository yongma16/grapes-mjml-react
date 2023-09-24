(function() {
    CKEDITOR.plugins.add( 'yma16-blog', {
        init: function( editor ) {
            editor.addCommand( 'jumpToCsdn', {
                exec: function( editor ) {
                    window.open('https://blog.csdn.net/qq_38870145','_blank')
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
