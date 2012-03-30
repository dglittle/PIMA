//
// license:
// 
// sprintf function:
//      - http://creativecommons.org/licenses/by/2.0/uk/
//
// jsonPath function
//      - MIT License (Stefan Goessner)
//
// json2 stuff
//      - public domain
//
// stuff that says it's from some web url has whatever license that url says
//
// everything else:
//      - public domain

////////////////////////////
// misc

pairs = function (a) {
    var p = []
    foreach(a, function (v, k) {
        p.push([k, v])
    })
    return p
}

// from http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
unCsv = function ( strData, strDelimiter ){
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );

    var arrData = [[]];
    var arrMatches = null;

    while (arrMatches = objPattern.exec( strData )){
        var strMatchedDelimiter = arrMatches[ 1 ];
        if (strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)) {
            arrData.push( [] );
        }
        if (arrMatches[ 2 ]){
            var strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
            );
        } else {
            var strMatchedValue = arrMatches[ 3 ];
        }
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    return( arrData );
}

gaussian = function (x, mean, stdDev) {
    if (mean == null) mean = 0
    if (stdDev == null) stdDev = 1
    
    var d = x - mean
    var v = stdDev * stdDev
    return (1/Math.sqrt(2 * Math.PI * v)) * Math.exp(-(d * d) / (2 * v))
}

ensure = function () {
    if (arguments.length <= 3) {
        if (!(arguments[1] in arguments[0])) {
            arguments[0][arguments[1]] = arguments[2]
        }
        return arguments[0][arguments[1]]
    }
    var args = Array.prototype.slice.call(arguments)
    var prev = ensure.apply(null, args.slice(0, 2).concat([typeof(args[2]) == "string" ? {} : []]))
    return ensure.apply(null, [prev].concat(args.slice(2)))
}

makeSet = function (o) {
    var s = {}
    foreach(o, function (e) { s[e] = true })
    return s
}

setTimeoutRepeat = function (func, interval) {
    setTimeout(function () {
        func()
        setTimeoutRepeat(func, interval)
    }, interval)
}

cap = function (t, t0, t1) {
    if (t < t0)
        return t0
    if (t > t1)
        return t1
    return t
}

lerpCap = function (t0, v0, t1, v1, t) {
    var t = cap(t, t0, t1)
    return (t - t0) * (v1 - v0) / (t1 - t0) + v0
}

lerp = function (t0, v0, t1, v1, t) {
    return (t - t0) * (v1 - v0) / (t1 - t0) + v0
}

trim = function (s) {
    return s.replace(/^\s+|\s+$/g,"");
}

values = function (obj) {
    var a = []
    foreach(obj, function (e) {a.push(e)})
    return a
}

keys = function (obj) {
    var a = []
    foreach(obj, function (v, k) {a.push(k)})
    return a
}

compare = function (a, b) {
    if (a < b) return -1
    if (a > b) return 1
    return 0
}

lines = function (s) {
    return s.split(/\r?\n/)
}

merge = function (objA, objB) {
    foreach(objB, function (v, k) {
        objA[k] = v
    })
    return objA
}

time = function () {
    return new Date().getTime()
}

getFragment = function (url) {
    if (url === undefined) {
        url = window.location.href
    }
    var m = url.match(/#(.*)/)
    return m ? m[1] : ""
}

setFragment = function (frag) {
    url = window.location.href
    url = url.replace(/(#[^#]*)?$/, '#' + frag)
    window.location.href = url
}

getUrlParams = function (url) {
    if (url === undefined) {
        url = window.location.href
    }
    var params = {}
    var m = url.match(/\?([^#]+)/)
    if (m) {
        foreach(m[1].split(/&/), function (m) {
            if (m.length > 0) {
                var a = m.split(/=/)
                params[unescapeUrl(a[0])] = a.length > 1 ? unescapeUrl(a[1]) : true
            }
        })
    }
    return params
}

////////////////////////////
// random

var digitChars = "0123456789"
var lowerChars = "abcdefghijklmnopqrstuvwxyz"
var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

randomIdentifier = function (size) {
    var firstChars = '_' + lowerChars + upperChars
    var nextChars = firstChars + digitChars
    
    var s = []
    for (var i = 0; i < size; i++) {
        var chars = i == 0 ? firstChars : nextChars
        s.push(chars[randomIndex(chars.length)])
    }
    return s.join('')
}

randomIndex = function (n) {
    return Math.floor(Math.random() * n)
}

pick = function (a) {
    if (a instanceof Array) {
        return a[randomIndex(a.length)]
    } else {
        return a[pick(keys(a))]
    }
    return a
}

shuffle = function (a) {
    for (var i = 0; i < a.length; i++) {
        var ri = randomIndex(a.length)
        var temp = a[i]
        a[i] = a[ri]
        a[ri] = temp
    }
    return a
}

////////////////////////////
// escapeing

escapeUnicodeChar = function (c) {
    var code = c.charCodeAt(0)
    var hex = code.toString(16)
    if (code < 16) return '\\u000' + hex
    if (code < 256) return '\\u00' + hex
    if (code < 4096) return '\\u0' + hex
    return '\\u' + hex
}

escapeString = function (s) {
    return s.
        replace(/\\/g, '\\\\').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\\"').
        replace(/[\u0000-\u001F]|[\u0080-\uFFFF]/g, escapeUnicodeChar)
}

escapeRegex = function (s) {
    return escapeString(s).replace(/([\{\}\(\)\|\[\]\^\$\.\*\+\?])/g, "\\$1")
}

escapeUrl = function (s) {
    return encodeURIComponent(s)
}

unescapeUrl = function (s) {
    return decodeURIComponent(s.replace(/\+/g, "%20"))
}

escapeXml = function (s) {
    s = s.replace(/&/g, "&amp;")
    s = s.replace(/</g, "&lt;").
        replace(/>/g, "&gt;").
        replace(/'/g, "&apos;").
        replace(/"/g, "&quot;").
//            replace(/[\u0000-\u001F]|[\u0080-\uFFFF]/g, function (c) {
        replace(/[\u0080-\uFFFF]/g, function (c) {
            var code = c.charCodeAt(0)
            return '&#' + code + ';'
            // if we want hex:
            var hex = code.toString(16)
            return '&#x' + hex + ';'
        })
    return s;
}
unescapeXml = function (s) {
    return s.replace(/&[^;]+;/g, function (s) {
        switch(s.substring(1, s.length - 1)) {
            case "amp":  return "&";
            case "lt":   return "<";
            case "gt":   return ">";
            case "apos": return "'";
            case "quot": return '"';
            default:
                if (s.charAt(1) == "#") {
                    if (s.charAt(2) == "x") {
                        return String.fromCharCode(parseInt(s.substring(3, s.length - 1), 16));
                    } else {
                        return String.fromCharCode(parseInt(s.substring(2, s.length - 1)));
                    }
                } else {
                    throw "unknown XML escape sequence: " + s
                }
        }
    })
}

////////////////////////////
// list processing

foreach = function (a, func) {
    if (a instanceof Array) {
        for (var i = 0; i < a.length; i++) {
            if (func(a[i], i) == false) break
        }
    } else {
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                if (func(a[k], k) == false) break
            }
        }
    }
    return a
}

filter = function (a, func) {
    if (a instanceof Array) {
        var b = []
        for (var i = 0; i < a.length; i++) {
            var v = a[i]
            if (func(v, i)) {
                b.push(v)
            }
        }
        return b
    } else {
        var b = {}
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                var v = a[k]
                if (func(v, k)) {
                    b[k] = v
                }
            }
        }
        return b
    }
}

map = function (a, func) {
    if (a instanceof Array) {
        var b = []
        for (var i = 0; i < a.length; i++) {
            b.push(func(a[i], i))
        }
        return b
    } else {
        var b = {}
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                b[k] = func(a[k], k)
            }
        }
        return b
    }
}

mapToSelf = function (a, func) {
    if (a instanceof Array) {
        for (var i = 0; i < a.length; i++) {
            a[i] = func(a[i], i)
        }
        return a
    } else {
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                a[k] = func(a[k], k)
            }
        }
        return a
    }
}

group = function (a, func) {
    var b = {}
    foreach(a, function (e) {
        var k = func(e)
        if (k) {
            if (!b[k]) b[k] = []
            b[k].push(e)
        }
    })
    return b
}

max = function (a, func) {
    var bestScore = null
    var best = null
    foreach(a, function (e, k) {
        var score = e
        if (func)
            score = func(e, k)
        if (score > 0 || score <= 0) {
            if (bestScore == null || score > bestScore) {
                bestScore = score
                best = e
            }
        }
    })
    return best
}

find = function (a, func) {
    var ret = null
    foreach(a, function (e, k) {
        if (func(e, k)) {
            ret = e
            return false
        }
    })
    return ret
}

//////////////////////////////////////////////
// json that handles circular references

myJson = function (o) {
    var touched = []
    var result = []
    var appendAtEnd = []
    function my_json_helper(result, o, indent, path) {
        switch (typeof o) {
            case 'object':
                // special case for Java strings
                try {
                    if (o instanceof Packages.java.lang.String) {
                        result.push('"')
                        result.push(escapeString('' + o));
                        result.push('" /* was a Java String */')
                        break
                    }
                } catch (e) {
                }
                
                // special case for null
                if (o == null) {
                    result.push('null')
                    break
                }
            
                if (o.__temp_json_path) {
                    result.push("/* ")
                    result.push(o.__temp_json_path)
                    result.push(" */0")
                    
                    appendAtEnd.push("\t" + path + " = " + o.__temp_json_path + "\n")
                    break
                }
                o.__temp_json_path = path       
                touched.push(o)
                if (o instanceof Array) {
                    result.push("[\n")
                    var indentMore = indent + "\t"
                    for (var i = 0; i < o.length; i++) {
                        result.push(indentMore)
                        my_json_helper(result, o[i], indentMore, path + "[" + i + "]")
                        if (i + 1 < o.length) {
                        	result.push(",\n")
                        } else {
                        	result.push("\n")
                        }
                    }
                    result.push(indent)
                    result.push("]")
                } else if (o instanceof Date) {
                    result.push("(function () {var d = new Date(); d.setTime(")
                    result.push(o.getTime())
                    result.push("); return d})()")
                } else {
                    result.push("{\n")
                    var indentMore = indent + "\t"
                    var first = true
                    for (var k in o) {
                        if (o.hasOwnProperty(k)) {
                            if (k == "__temp_json_path") continue;
                            
                        	if (first) {
                        		first = false                        		
                        	} else {
                        		result.push(",\n")
                        	}
                            result.push(indentMore)
                            result.push('"')
                            var escapedK = escapeString(k)
                            result.push(escapedK)
                            result.push('" : ')
                            my_json_helper(result, o[k], indentMore, path + "[\"" + escapedK + "\"]")
                        }
                    }
                    if (!first) {
                    	result.push("\n")
                    }
                    result.push(indent)
                    result.push("}")
                }
                break
            case 'string':
                result.push('"')
                result.push(escapeString(o));    
                result.push('"')
                break
            case 'function':
                result.push(o)
                break
            case 'null':
                result.push('null')
                break
            case 'number':
                result.push(o)
                break
            case 'boolean':
                result.push(o)
                break
            case 'undefined':
                result.push('undefined')
                break
            default:
                throw "error: type not supported: " + (typeof o)
        }
    }
    my_json_helper(result, o, "\t", "data")
    
    if (appendAtEnd.length > 0) {
        result.unshift("(function () {\n\tvar data = ")
        result.push("\n")    
        result = result.concat(appendAtEnd)
        result.push("\treturn data\n})()")
    } else if (touched.length > 0) {
        result.unshift("(")
        result.push(")")
    }
    
    for (var i = 0; i < touched.length; i++) {
        delete touched[i].__temp_json_path
    }
    
    return result.join("")
}

/**
*
*  Javascript sprintf
*  http://www.webtoolkit.info/
*
*  licensed under creative commons attribute:
*  http://creativecommons.org/licenses/by/2.0/uk/
*
**/
sprintfWrapper = {

    init : function () {

        if (typeof arguments == "undefined") { return null; }
        if (arguments.length < 1) { return null; }
        if (typeof arguments[0] != "string") { return null; }
        if (typeof RegExp == "undefined") { return null; }

        var string = arguments[0];
        var exp = new RegExp(/(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d)?)?([bcdfosxX])))/g);
        var matches = new Array();
        var strings = new Array();
        var convCount = 0;
        var stringPosStart = 0;
        var stringPosEnd = 0;
        var matchPosEnd = 0;
        var newString = '';
        var match = null;

        while (match = exp.exec(string)) {
            if (match[9]) { convCount += 1; }

            stringPosStart = matchPosEnd;
            stringPosEnd = exp.lastIndex - match[0].length;
            strings[strings.length] = string.substring(stringPosStart, stringPosEnd);

            matchPosEnd = exp.lastIndex;
            matches[matches.length] = {
                match: match[0],
                left: match[3] ? true : false,
                sign: match[4] || '',
                pad: match[5] || ' ',
                min: match[6] || 0,
                precision: match[8],
                code: match[9] || '%',
                negative: parseInt(arguments[convCount]) < 0 ? true : false,
                argument: String(arguments[convCount])
            };
        }
        strings[strings.length] = string.substring(matchPosEnd);

        if (matches.length == 0) { return string; }
        if ((arguments.length - 1) < convCount) { return null; }

        var code = null;
        var match = null;
        var i = null;

        for (i=0; i<matches.length; i++) {

            if (matches[i].code == '%') { substitution = '%' }
            else if (matches[i].code == 'b') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(2));
                substitution = sprintfWrapper.convert(matches[i], true);
            }
            else if (matches[i].code == 'c') {
                matches[i].argument = String(String.fromCharCode(parseInt(Math.abs(parseInt(matches[i].argument)))));
                substitution = sprintfWrapper.convert(matches[i], true);
            }
            else if (matches[i].code == 'd') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)));
                substitution = sprintfWrapper.convert(matches[i]);
            }
            else if (matches[i].code == 'f') {
                matches[i].argument = String(Math.abs(parseFloat(matches[i].argument)).toFixed(matches[i].precision ? matches[i].precision : 6));
                substitution = sprintfWrapper.convert(matches[i]);
            }
            else if (matches[i].code == 'o') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(8));
                substitution = sprintfWrapper.convert(matches[i]);
            }
            else if (matches[i].code == 's') {
                matches[i].argument = matches[i].argument.substring(0, matches[i].precision ? matches[i].precision : matches[i].argument.length)
                substitution = sprintfWrapper.convert(matches[i], true);
            }
            else if (matches[i].code == 'x') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                substitution = sprintfWrapper.convert(matches[i]);
            }
            else if (matches[i].code == 'X') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                substitution = sprintfWrapper.convert(matches[i]).toUpperCase();
            }
            else {
                substitution = matches[i].match;
            }

            newString += strings[i];
            newString += substitution;

        }
        newString += strings[i];

        return newString;

    },

    convert : function(match, nosign){
        if (nosign) {
            match.sign = '';
        } else {
            match.sign = match.negative ? '-' : match.sign;
        }
        var l = match.min - match.argument.length + 1 - match.sign.length;
        var pad = new Array(l < 0 ? 0 : l).join(match.pad);
        if (!match.left) {
            if (match.pad == "0" || nosign) {
                return match.sign + pad + match.argument;
            } else {
                return pad + match.sign + match.argument;
            }
        } else {
            if (match.pad == "0" || nosign) {
                return match.sign + match.argument + pad.replace(/0/g, ' ');
            } else {
                return match.sign + match.argument + pad;
            }
        }
    }
}
sprintf = sprintfWrapper.init;

/* JSONPath 0.8.0 - XPath for JSON
 *
 * Copyright (c) 2007 Stefan Goessner (goessner.net)
 * Licensed under the MIT (MIT-LICENSE.txt) licence.
 */
jsonPath = function (obj, expr, arg) {
   var P = {
      resultType: arg && arg.resultType || "VALUE",
      result: [],
      normalize: function(expr) {
         var subx = [];
         return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0,$1){return "[#"+(subx.push($1)-1)+"]";})
                    .replace(/'?\.'?|\['?/g, ";")
                    .replace(/;;;|;;/g, ";..;")
                    .replace(/;$|'?\]|'$/g, "")
                    .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
      },
      asPath: function(path) {
         var x = path.split(";"), p = "$";
         for (var i=1,n=x.length; i<n; i++)
            p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
         return p;
      },
      store: function(p, v) {
         if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
         return !!p;
      },
      trace: function(expr, val, path) {
         if (expr) {
            var x = expr.split(";"), loc = x.shift();
            x = x.join(";");
            if (val && val.hasOwnProperty(loc))
               P.trace(x, val[loc], path + ";" + loc);
            else if (loc === "*")
               P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
            else if (loc === "..") {
               P.trace(x, val, path);
               P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
            }
            else if (/,/.test(loc)) { // [name1,name2,...]
               for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
                  P.trace(s[i]+";"+x, val, path);
            }
            else if (/^\(.*?\)$/.test(loc)) // [(expr)]
               P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
            else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
               P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) P.trace(m+";"+x,v,p); });
            else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
               P.slice(loc, x, val, path);
         }
         else
            P.store(path, val);
      },
      walk: function(loc, expr, val, path, f) {
         if (val instanceof Array) {
            for (var i=0,n=val.length; i<n; i++)
               if (i in val)
                  f(i,loc,expr,val,path);
         }
         else if (typeof val === "object") {
            for (var m in val)
               if (val.hasOwnProperty(m))
                  f(m,loc,expr,val,path);
         }
      },
      slice: function(loc, expr, val, path) {
         if (val instanceof Array) {
            var len=val.length, start=0, end=len, step=1;
            loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
            start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
            end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
            for (var i=start; i<end; i+=step)
               P.trace(i+";"+expr, val, path);
         }
      },
      eval: function(x, _v, _vname) {
         try { return $ && _v && eval(x.replace(/@/g, "_v")); }
         catch(e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
      }
   };

   var $ = obj;
   if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
      P.trace(P.normalize(expr).replace(/^\$;/,""), obj, "$");
      return P.result.length ? P.result : false;
   }
}

/*
    http://www.JSON.org/json2.js
    2011-01-18

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

decycle = function(o) {
    var rootKey = "root_" + Math.round(Math.random() * 1000)
    var uniqueObj = {}
    while (true) {
        try {
            var objs = []
            function helper(o, path) {
                if (typeof(o) == "string" && o.slice(0, rootKey.length) == rootKey)
                    throw "bad root key"
                if (typeof(o) == "object" && o) {
                    if (typeof(o[rootKey]) == "object" && o[rootKey].uniqueObj == uniqueObj) {
                        return o[rootKey].path
                    } else {
                        if (rootKey in o)
                            throw "bad root key"
                        var oo = (o instanceof Array) ? [] : {}
                        o[rootKey] = {
                            uniqueObj : uniqueObj,
                            path : path,
                            newObj : oo
                        }
                        objs.push(o)
                        return oo
                    }
                }
                return o
            }
            function helper2(o) {
                var oo = o[rootKey].newObj
                var path = o[rootKey].path
                if (o instanceof Array) {
                    for (var i = 0; i < o.length; i++) {
                        oo[i] = helper(o[i], path + '[' + i + ']')
                    }
                } else {
                    for (k in o) {
                        if (k != rootKey) {
                            oo[k] = helper(o[k], path + '[' + JSON.stringify(k) + ']')
                        }
                    }
                }
            }
            function cleanup() {
                for (var i = 0; i < objs.length; i++) {
                    delete objs[i][rootKey]
                }
            }
            
            var ret = {}
            ret.cycle_root = rootKey
            ret[rootKey] = helper(o, rootKey)
            for (var i = 0; i < objs.length; i++) {
                helper2(objs[i])
            }
            cleanup()
            return ret
        } catch (e) {
            cleanup()
            if (e == "bad root key") {
                rootKey += Math.round(Math.random() * 1000)
            } else {
                throw e
            }
        }
    }
}

recycle = function (obj) {
    // regex adapted from https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
    var r = /^root(?:_\d+)?(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/
    
    if (!obj.cycle_root || !(obj.cycle_root in obj))
        throw "doesn't look recycle-able"
    
    var rootKey = obj.cycle_root
    function helper(o) {
        if (typeof(o) == "string" && o.slice(0, rootKey.length) == rootKey) {
            if (!o.match(r)) throw "I'm afraid to eval: " + o
            with (obj) {
                return eval(o)
            }
        }
        if (typeof(o) == "object" && o) {
            if (o instanceof Array) {
                for (var i = 0; i < o.length; i++) {
                    o[i] = helper(o[i])
                }
            } else {
                for (var k in o) {
                    o[k] = helper(o[k])
                }
            }
        }
        return o
    }
    return helper(obj[rootKey])
}

if (typeof(json) == "undefined") {
    json = function (o, indent) {
        return JSON.stringify(o, null, indent)
    }
}

unJson = function (s) {
    var o = JSON.parse(s)
    try {
        return recycle(o)
    } catch (e) {
        return o
    }
}

