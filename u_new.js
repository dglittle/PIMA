
g_last_profile_time = 0
_.profile = function (name) {
    var now = _.time()
    if (name) {
        console.log(name + ' : ' + ((now - g_last_profile_time) / 1000).toFixed(3))
    }
    g_last_profile_time = now
}

// from http://snipplr.com/view.php?codeview&id=5945
function number_format( number, decimals, dec_point, thousands_sep ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +     bugfix by: Michael White (http://crestidg.com)
    // +     bugfix by: Benjamin Lupton
    // +     bugfix by: Allan Jensen (http://www.winternet.no)
    // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)    
    // *     example 1: number_format(1234.5678, 2, '.', '');
    // *     returns 1: 1234.57     
 
    var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
    var d = dec_point == undefined ? "," : dec_point;
    var t = thousands_sep == undefined ? "." : thousands_sep, s = n < 0 ? "-" : "";
    var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

// adapted from http://snipplr.com/view.php?codeview&id=5949
function size_format (filesize) {
    if (filesize >= 1073741824) {
         filesize = number_format(filesize / 1073741824, 2, '.', '') + 'gb';
    } else { 
        if (filesize >= 1048576) {
            filesize = number_format(filesize / 1048576, 2, '.', '') + 'mb';
    } else { 
            if (filesize >= 1024) {
            filesize = number_format(filesize / 1024, 0) + 'kb';
        } else {
            filesize = number_format(filesize, 0) + ' bytes';
            };
        };
    };
  return filesize;
};
