// from: http://ajaxian.com/archives/handling-tabs-in-textareas
//
// use: <textarea onkeypress="checkTab(event)">hello world</textarea>


// Set desired tab- defaults to four space softtab
var tab = "    ";

function checkTab(evt) {
    var t = evt.target;
    var ss = t.selectionStart;
    var se = t.selectionEnd;
    
    var scrollTop = t.scrollTop
	
    // Tab key - insert tab expansion
    if (evt.keyCode == 9) {
        if (!evt.shiftKey) {
            evt.preventDefault();
        
            // Special case of multi line selection
            if (ss != se && t.value.slice(ss,se).indexOf("\n") != -1) {
                // In case selection was not of entire lines (e.g. selection begins in the middle of a line)
                // we ought to tab at the beginning as well as at the start of every following line.
                var pre = t.value.slice(0,ss);
                var sel = t.value.slice(ss,se).replace(/\n/g,"\n"+tab);
                var post = t.value.slice(se,t.value.length);
                t.value = pre.concat(tab).concat(sel).concat(post);
                t.selectionStart = ss;
                t.selectionEnd = ss + sel.length;
            }
        
            // "Normal" case (no selection or selection on one line only)
            else {
                t.value = t.value.slice(0,ss).concat(tab).concat(t.value.slice(ss,t.value.length));
                if (ss == se) {
                    t.selectionStart = t.selectionEnd = ss + tab.length;
                } else {
                    t.selectionStart = ss + tab.length;
                    t.selectionEnd = se + tab.length;
                }
            }
        } else {
            evt.preventDefault();
        
            // Special case of multi line selection
            if (ss != se && t.value.slice(ss,se).indexOf("\n") != -1) {
                // In case selection was not of entire lines (e.g. selection begins in the middle of a line)
                // we ought to tab at the beginning as well as at the start of every following line.
                var pre = t.value.slice(0,ss);
                var re = new RegExp("\n" + tab, "g")
                var sel = t.value.slice(ss,se).replace(re, "\n");
                var post = t.value.slice(se,t.value.length);
                t.value = pre.concat(sel).concat(post);
                t.selectionStart = ss;
                t.selectionEnd = ss + sel.length;
            }
        
            // "Normal" case (no selection or selection on one line only)
            else {
                t.value = t.value.slice(0,ss).concat(tab).concat(t.value.slice(ss,t.value.length));
                if (ss == se) {
                    t.selectionStart = t.selectionEnd = ss + tab.length;
                } else {
                    t.selectionStart = ss + tab.length;
                    t.selectionEnd = se + tab.length;
                }
            }
        }
    }
	
    // Backspace key - delete preceding tab expansion, if exists
    else if (evt.keyCode == 8 && (ss == se) && t.value.slice(ss - tab.length, ss) == tab) {
        evt.preventDefault();
        t.value = t.value.slice(0, ss - tab.length).concat(t.value.slice(ss, t.value.length));
        t.selectionStart = t.selectionEnd = ss - tab.length;
    }         

    // Delete key - delete following tab expansion, if exists
    else if (evt.keyCode == 46 && (ss == se) && t.value.slice(se,se + tab.length) == tab) {
        evt.preventDefault();
        t.value = t.value.slice(0,ss).concat(t.value.slice(ss + tab.length,t.value.length));
        t.selectionStart = t.selectionEnd = ss;
    }

    // Left/right arrow keys - move across the tab in one go
    else if (evt.keyCode == 37 && t.value.slice(ss - tab.length,ss) == tab) {
        evt.preventDefault();
        t.selectionStart = t.selectionEnd = ss - tab.length;
    } else if (evt.keyCode == 39 && t.value.slice(ss,ss + tab.length) == tab) {
        evt.preventDefault();
        t.selectionStart = t.selectionEnd = ss + tab.length;
    }
    
    if (scrollTop != t.scrollTop) {
        t.scrollTop = scrollTop
    }
}

