
// adapted from: http://ajaxian.com/archives/handling-tabs-in-textareas

$(function () {
    var tab = "    "
    var re1 = new RegExp("^" + tab, "mg")
    
    $(document).delegate("textarea", "keydown", function (e) {
        if (e.keyCode == 9) {
            e.preventDefault();
            var target = e.target
            var text = target.value 
            var ss = target.selectionStart
            var se = target.selectionEnd
            var shift = e.shiftKey
            
            // complete multiline selection
            if (shift || (ss != se)) {
                for (var i = ss - 1; i >= 0; i--) {
                    if (text[i] != '\n') {
                        ss--
                    } else {
                        break
                    }
                }
                if (text[se - 1] == '\n') se--
                for (var i = se; i < text.length; i++) {
                    if (text[i] != '\n') {
                        se++
                    } else {
                        break
                    }
                }
            }
            
            var pre = text.slice(0, ss)
            var sel = text.slice(ss, se)
            var post = text.slice(se, text.length)
            
            if (shift) {
                sel = sel.replace(re1, "")
            } else if (ss != se) {
                sel = sel.replace(/^/mg, tab)
            } else {
                sel = tab
            }
            
            target.value = pre + sel + post
            if (shift || (ss != se)) {
                target.selectionStart = ss
                target.selectionEnd = ss + sel.length
            } else {
                target.selectionStart = ss + sel.length
                target.selectionEnd = ss + sel.length
            }
        }
    })
})

