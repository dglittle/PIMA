// unless otherwise stated (above a function definition)
// these functions were written by myself, Greg Little,
// and I release them into the public domain.

function strcmp(a, b) {
    return (b < a) - (a < b)
}

function englishTimeSpan(t) {
    var second = 1000
    var minute = second * 60
    var hour = minute * 60
    var day = hour * 24
    var week = day * 7
    var month = day * 30
    var year = day * 365
    // years
    if (t == Infinity)
        return "never"
    if (t / year >= 1)
        return sprintf("%0.1f years", t / year)
    if (t / month >= 1)
        return sprintf("%0.1f months", t / month)
    if (t / week >= 1)
        return sprintf("%0.1f weeks", t / week)
    if (t / day >= 1)
        return sprintf("%0.1f days", t / day)
    if (t / hour >= 1)
        return sprintf("%0.1f hours", t / hour)
    if (t / minute >= 1)
        return sprintf("%0.1f minutes", t / minute)
    if (t / second >= 1)
        return sprintf("%0.0f seconds", t / second)
    return "now"
}

function pairs(a) {
    var b = []
    foreach(a, function (v, k) {
        b.push([k, v])
    })
    return b
}

function sortedPairs(a, func) {
    a = pairs(a)
    if (!func) func = function (a, b) {return a - b}
    a.sort(function (a, b) {return func(a[0], b[0])})
    return a
}

function hist(x, y) {
    if (!y) {
        if (x instanceof Array) {
            return hist(map(x, function (e) {return e[0]}), map(x, function (e) {return e[1]}))
        } else {
            return hist(keys(x), values(x))
        }
    }
    var yMax = getMax(y)
    return "http://chart.apis.google.com/chart?cht=bvs&chs=170x125&chd=t:" + y + "&chco=4d89f9&chds=0," + yMax + "&chxt=x,y&chxr=1,0," + yMax + "&chxl=0:|" + x.join('|') + "|&chbh=a"
}

function group(a, func) {
    var m = {}
    foreach(a, function (e) {
        var key = func(e)
        var arr = m[key]
        if (!arr) {
            arr = []
            m[key] = arr
        }
        arr.push(e)
    })
    return m
}

function prune(o, depth) {
    if (depth === undefined) depth = 1
    if (o instanceof Array) {
        var newO = []
    } else {
        var newO = {}
    }
    if (depth > 0) {
        foreach(o, function (v, k) {
            if ((typeof v) == "object") {
                v = prune(v, depth - 1)
            }
            newO[k] = v
        })
    }
    return newO
}

// adapted from: http://www.tecgraf.puc-rio.br/~mgattass/color/HSVtoRGB.htm
// inputs are between 0 and 1,
// output are between 0 and 1
function HSVtoRGB(h, s, v, color) {
    if (!color) {
        color = {}
    }
    if (s == 0) {
        color.r = v
        color.g = v
        color.b = v
    } else {
        var_h = h * 6
        var_i = Math.floor(var_h)
        var_1 = v * (1 - s)
        var_2 = v * (1 - s * (var_h - var_i))
        var_3 = v * (1 - s * (1 - (var_h - var_i)))
        
        if (var_i == 0) {color.r = v; color.g = var_3; color.b = var_1}
        else if (var_i == 1) {color.r = var_2; color.g = v; color.b = var_1}
        else if (var_i == 2) {color.r = var_1; color.g = v; color.b = var_3}
        else if (var_i == 3) {color.r = var_1; color.g = var_2; color.b = v}
        else if (var_i == 4) {color.r = var_3; color.g = var_1; color.b = v}
        else {color.r = v; color.g = var_1; color.b = var_2}
    }
    return color
}

function assert(yes) {
    if (!yes) {
        throw "assertion failure"
    }
}

// example: randomId(5, /[0-9a-z]/) --> 7hy9s
function randomId(length, regex) {
    if (typeof regex == "string") {
        var s = ""
        while (s.length < length) {
            s += pickRandom(regex)
        }
        return s
    }
    var s = ""
    while (s.length < length) {
        var c = String.fromCharCode(randomIndex(256))
        if (regex.exec(c)) {
            s += c
        }
    }
    return s
}

// adapted from: http://www.webreference.com/js/column8/functions.html
/*
   name - name of the cookie
   value - value of the cookie
   [days] - expiration date of the cookie (measured in days from now)
     (defaults to end of current session)
   [path] - path for which the cookie is valid
     (defaults to path of calling document)
   [domain] - domain for which the cookie is valid
     (defaults to domain of calling document)
   [secure] - Boolean value indicating if the cookie transmission requires
     a secure transmission
   * an argument defaults when it is assigned null as a placeholder
   * a null placeholder is not required for trailing omitted arguments
*/
function setCookie(name, value, days, path, domain, secure) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = date
	}
  var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  document.cookie = curCookie;
}
/*
  name - name of the desired cookie
  return string containing value of specified cookie or null
  if cookie does not exist
*/
function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else
    begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
    end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}
/*
   name - name of the cookie
   [path] - path of the cookie (must be same as path used to create cookie)
   [domain] - domain of the cookie (must be same as domain used to
     create cookie)
   path and domain default if assigned null or omitted if no explicit
     argument proceeds
*/
function deleteCookie(name, path, domain) {
  if (getCookie(name)) {
    document.cookie = name + "=" +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
}




function lines(s) {
    return s.split(/\r?\n/)
}

// set functions

/**
	Creates a set from an array of values;
	all the values become keys in an object,
	and the corresponding value is "true"
 */
function Set(a) {
	if (a) {
    	this.add(a)
    }
}

/**
	Returns a clone of the Set.
 */
Set.prototype.clone = function () {
    return new Set(keys(this))
}

/**
	Removes all the elements in array <code>k</code>,
	or keys in the set <code>k</code>,
	or the element <code>k</code>.
	
	Returns this Set, after the removal.
	If removing a single element, returns <code>true</code> iff the element existed before.
 */
Set.prototype.remove = function (k) {
    if ((typeof k) == "object") {
        if (k instanceof Array) {
            var me = this
            foreach(k, function (kk) {
                delete me[kk]
            })
        } else {
            var me = this
            foreach(k, function (v, kk) {
                delete me[kk]
            })
        }
    } else {
        if (!this[k]) return false
        delete this[k]
        return true
    }
    return this
}

/**
	Adds all the elements in array <code>k</code>,
	or keys in the set <code>k</code>,
	or the element <code>k</code>.
	
	Returns this Set, after the addition.
	If adding a single element, returns <code>true</code> iff the element didn't exist before.
 */
Set.prototype.add = function (k) {
    if ((typeof k) == "object") {
        if (k instanceof Array) {
            var me = this
            foreach(k, function (kk) {
                me[kk] = true
            })
        } else {
            var me = this
            foreach(k, function (v, kk) {
                me[kk] = true
            })
        }
    } else {
        if (this[k]) return false
        this[k] = true
        return true
    }
}

/**
	Returns a new Set representing the intersection of this Set with
	all the elements in array <code>k</code>,
	or keys in the set <code>k</code>,
	or the element <code>k</code>.
 */
Set.prototype.intersect = function (b) {
    var i = new Set()
    if ((typeof b) == "object") {
        if (b instanceof Array) {
            var me = this
            foreach(b, function (k) {
                if (me[k]) i[k] = true
            })
        } else {
            var me = this
            foreach(b, function (v, k) {
                if (me[k]) i[k] = true
            })
        }
    } else {
        return this.intersect([b])
    }
    return i
}


function makeSet(a) {
    var s = {}
    foreach(a, function (v) { s[v] = 1 })
    return s
}
function setClone(a) {
    var s = {}
    foreach(a, function (v, k) { s[k] = 1 })
    return s
}
function setRemove(a, b) {
    foreach(b, function (v, k) {
        delete a[k]
    })
    return a
}
setSub = setRemove
function setAdd(a, b) {
    if ((typeof b) == "object") {
        foreach(b, function (v, k) {
            a[k] = 1
        })
        return a
    } else {
        if (a[b]) return false
        a[b] = 1
        return true
    }
}
function setIntersect(a, b) {
    var counts = setClone(a)
    foreach(b, function (v, k) { bagAdd(counts, k) })
    return map(filter(counts, function (v, k) { return v == 2 }), function () { return 1 })
}

function bagGet(bag, key) {
    if (bag[key] == null) {
        return 0
    }
    return bag[key]
}

function bagAdd(bag, key, amount) {
    if (!amount) amount = 1
    if ((typeof key) == "object") {
        foreach(key, function (v, k) {
            bagAdd(bag, k, v * amount)
        })
    } else {
        bag[key] = bagGet(bag, key) + amount
    }
    return bag
}

function bag(values) {
    var b = {}
    foreach(values, function (value) {
        bagAdd(b, value)
    })
    return b
}
makeBag = bag


/**
	Returns a new Bag data structure,
	which is an unordered collection of objects,
	where objects can appear multiple times.
	The bag is really a map of keys,
	where the value associated with each key
	represents the number of times that key appears in the bag.
	
	If <code>a</code> is a bag, add it's elements to this bag.
	If <code>a</code> is an object, add it's values to this bag.
	If <code>a</code> is an element, add it to this bag.
 */
function Bag(a) {
	if (a) {
		this.add(a)
	}
}

/**
	Returns a clone of the bag.
 */
Bag.prototype.clone = function () {
    return new Bag(this)
}

/**
	If <code>a</code> is a bag, add it's elements to this bag, and returns the new bag.
	If <code>a</code> is an object, add it's values to this bag, and returns the new bag.
	If <code>a</code> is an element, add it to this bag, and return the new number of times it appears.
	
	The parameter <code>count</code> defaults to 1,
	but can be changed to add multiple copies of <code>a</code> to the bag.
 */
Bag.prototype.add = function (a, count) {
	if (count === undefined) count = 1
	if ((typeof a) == "object") {
		var me = this
		if (a instanceof Bag) {
			foreach(a, function (v, a) {
				me.add(a, v * count)
			})
		} else {
			foreach(a, function (a) {
				me.add(a, count)
			})
		}
	} else {
		var v = this[a]
		if (!v) v = 0
		v += count
		this[a] = v
		return v
	}
	return this
}

Bag.prototype.get = function (a) {
    var v = this[a]
    if (!v) v = 0
    return v
}

Bag.prototype.pairs = function () {
    var a = []
    foreach(this, function (count, key) {
        a.push([key, count])
    })
    return a
}

Bag.prototype.sortedPairs = function () {
    var a = this.pairs()
    a.sort(function (a, b) {return b[1] - a[1]})
    return a
}

// adapted from http://jsfromhell.com/en/number/base-conversor
function toBase(n, b, c) {
    var s = ""
    if (b > (c = (c || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").split("")).length || b < 2) return "";
    while(n)
        s = c[n % b] + s, n = Math.floor(n / b);
    return s;
}

var __profile_block_stack = [{}]
var __profile_name_stack = ["__root__"]
function profile(name) {
    if (!name) {
        function convert(block) {
            return map(filter(block, function (prop, key) {
                if (key == "total") return true
                if (typeof prop == "object") return true
                return false
            }), function (prop, key) {
                if (key == "total") return prop / 1000
                return convert(prop)
            })
        }
        output(json(convert(__profile_block_stack)))
        __profile_block_stack = [{}]
        __profile_name_stack = ["__root__"]
        return
    }
    
    var topBlock = last(__profile_block_stack)
    var topName = last(__profile_name_stack)
    if (name != topName) {
        if (!topBlock[name]) {
            topBlock[name] = {total : 0}
        }
        topBlock[name].begin = time()
        __profile_block_stack.push(topBlock[name])
        __profile_name_stack.push(name)
    } else {
        topBlock.total += time() - topBlock.begin
        __profile_block_stack.pop()
        __profile_name_stack.pop()
    }
}

function stringCompare(a, b) {
    if (a < b) return -1
    if (b < a) return 1
    return 0
}

function chickenfoot_jQuery() {
    if ((typeof $) != undefined) return
    var body = document.wrappedJSObject.getElementsByTagName('body').item(0)
    var div = document.createElement('div')
    div.innerHTML = '<script src="http://localhost/js/jquery.js"></script>'
    body.appendChild(div)
    $ = window.wrappedJSObject.$
}

// adapted from: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_levenshtein/
function editDistance( str1, str2 ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // +   bugfixed by: Onno Marsman
    // *     example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
    // *     returns 1: 3
 
    var s, l = (s = (str1+'').split("")).length, t = (str2 = (str2+'').split("")).length, i, j, m, n;
    if(!(l || t)) return Math.max(l, t);
    for(var a = [], i = l + 1; i; a[--i] = [i]);
    for(i = t + 1; a[0][--i] = i;);
    for(i = -1, m = s.length; ++i < m;){
        for(j = -1, n = str2.length; ++j < n;){
            a[(i *= 1) + 1][(j *= 1) + 1] = Math.min(a[i][j + 1] + 1, a[i + 1][j] + 1, a[i][j] + (s[i] != str2[j]));
        }
    }
    return a[l][t];
}
editDist = editDistance

function nameDist(a, b) {
    var a = a.split(/\s+/)
    var b = b.split(/\s+/)
    b.push('')
    var dist = 0
    foreach(a, function (aName) {
        var o = getMinObj(b, function (bName) {
            var dist = editDist(aName, bName)
            if (aName.substring(0, 1) != bName.substring(0, 1)) {
                dist += 4
            }
            if (dist >= 4) dist += 20
            return dist
        })
        dist += o.s
    })
    return dist
}

// got this idea from somewhere (including the name "klass"),
// but I forget where
function klass(o) {
    var self = function () {
        if (self.prototype.__init__) {
            self.prototype.__init__()
        }
    }
    foreach(o, function (func, key) {
        self.prototype[key] = func
    })
    return self
}

function mySplit(s, sep) {
    if (emptyString(s)) return []
    return s.split(sep)
}

function emptyString(s) {
    return !s || s.match(/^\s*$/)
}

function my_output(s) {
    try {
        console.log(s)
        return
    } catch (e) {
    }
    try {
        Packages.java.lang.System.out.print(s)
        return
    } catch (e) {
    }
    try {
        alert(s)
        return
    } catch (e) {
    }
    throw "trying to output: " + s
}
if ((typeof output) == "undefined") {
    output = my_output
}
function outputln(s) {
    output(s + '\n')
}

function globalMatch(re, s, num) {
    if (s instanceof RegExp) {
        return globalMatch(s, re, num)
    }

    if (num) {
        var ret = []
        var m
        while (m = re.exec(s)) {
            ret.push(m[num])
            if (!re.global) break
        }
        return ret
    }

    var ret = []
    var m
    var leftAccum = ''
    while (m = re.exec(s)) {
        m.left = leftAccum + RegExp.leftContext
        m.right = RegExp.rightContext    
        ret.push(m)
        
        if (m[0] == '') {
            leftAccum += s.substring(0, 1)
            s = s.substring(1)
        }
        
        if (!re.global) break
    }
    return ret
}
matchGlobal = globalMatch

// add objB to objA
function merge(objA, objB) {
    foreach(objB, function (v, k) {
        objA[k] = v
    })
    return objA
}

function pickRandom(obj) {
    if (obj instanceof Array) {
        return obj[randomIndex(obj.length)]
    } else {
        return obj[pickRandom(keys(obj))]
    }
}
pick = pickRandom

function link(name, url) {
    return '<a href="' + escapeXml(url) + '">' + escapeXml(name) + '</a>'
}

function foreachRandom(a, test) {
    if (typeof test == "string") {
        var testString = test
        test = function (v, k) {
            var i = k
            var e = v
            return eval(testString)
        }
    }
    if (a instanceof Array) {
        foreach(shuffle(range(0, a.length - 1)), function (i) {
            if (test(a[i], i) == false) return false
        })
    } else {
        foreach(shuffle(keys(a)), function (k) {
            if (test(a[k], k) == false) return false
        })
    }
}
forEachRandom = foreachRandom

function range(min, max) {
    var a = []
    for (var i = min; i <= max; i++) {
        a.push(i)
    }
    return a
}

function jaxer_jsdb(q) {
    var s = new Jaxer.Socket()
    s.open('localhost', 52666)
    s.writeString(q.length + "\n" + q);
    s.flush()
    
    var ret = []
    var chunk = null
    while (chunk = s.readString(256)) {
        ret.push(chunk)
    }
    
    return ret.join('')
}

function time() {
    return new Date().getTime()
}

function addUrlParam(url, key, value) {
    if (!url.match(/\?/)) { url += "?" } else { url += "&" }
    return url + escapeURL(key) + "=" + escapeURL(value)
}

function csv(val, comma) {
    if (!comma) comma = ','
    if (typeof val == "object") {
        outterObject = false
        for (k in val) {
            var first = val[k]
            if (typeof first == "object") {
                if (!(first instanceof Array)) {
                    var headers = {}
                    foreach(val, function (row) {
                        foreach(keys(row), function (header) {
                            headers[header] = 1
                        })
                    })
                    headers = keys(headers)
                    return csv(headers, comma) + "\n" + csv(map(val, function (row) {
                        return map(headers, function (header) {
                            return row[header]
                        })
                    }), comma)
                }
                outterObject = true
            }
            break
        }
        if (outterObject) {
            return map(val, function (v) { return csv(v, comma) }).join('\n')
        } else {        
            return map(val, function (v) { return csv(v, comma) }).join(comma)
        }
    } else if (typeof val == "string") {
        return '"' + val.replace(/"/g, '""') + '"'
    } else {
        if (val === null || val === undefined) {
            return ''
        }
        return '' + val
    }
}

function globalEval(___hguydnvuyyiiwtsmjhg___) {
    return eval(___hguydnvuyyiiwtsmjhg___)
}

// ensure("db.pima.cards", {})
// ensure(null, "db.pima.cards", {})
// ensure(db, "pima.cards", {})
// ensure(db, ".pima.cards", {})
// ensure(db, ["pima", "cards"], {})
function ensure(obj, path, defaultValue) {
    if (typeof obj == "string") {
        return ensure(null, obj, path)
    }
    if (obj && (typeof path == "string") && path.match(/^[^\[\.]/)) {
        return ensure(obj, '.' + path, defaultValue)
    }
    
    if (defaultValue == undefined) {
        defaultValue = {}
    }
    
    var so_far = obj ? "obj" : ""
    if (typeof path == "string") {
        var parts = path.match(/(^|\.)\w+|\[('(\\'|[^'])*'|"(\\"|[^"])*"|[^\]]+)\]/g)
    } else {
        var parts = map(path, function (part, i) { return (i == 0 && so_far == "") ? part : '[' + json(part) + ']' })
    }
    foreach(parts, function (part, i) {
        so_far += part
        if (eval("typeof " + so_far) == "undefined") {
            if (i < parts.length - 1) {
                if (parts[i + 1].match(/\[\d+\]/)) {
                    eval(so_far + " = []")
                } else {
                    eval(so_far + " = {}")
                }
            } else {
                eval(so_far + " = defaultValue")
            }
        }
    })
    return eval(so_far)
}

// adapted from "parse" function at http://json.org/json.js
function safeJson(s) {
    var safeJson_re =/(\s+|[\(\)\{\}\[\]=:,]|'(\\\'|[^'])*'|"(\\\"|[^"])*"|[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?|function|var|data|return|true|false|undefined|null|\/\*(\*+[^\*\/]|[^\*])*\*+\/)+/
    var m = s.match(safeJson_re)
    return m && (m[0] == s)
}

function repeat(s, count) {
    if (typeof s == "number") {
        return repeat(count, s)
    } else if (typeof s == "string") {
        var list = []
        for (var i = 0; i < count; i++) {
            list.push(s)
        }
        return list.join('')
    } else if (typeof s == "function") {
        for (var i = 0; i < count; i++) {
            s(i)
        }
    }
}

function deepClone(o) {
    return eval(json(o))
}

function clone(o) {
    if (typeof o == "object") {
        if (o instanceof Array) {
            return o.slice(0)
        }
    }
    throw "clone error: unsupported type"
}

function gaussian(x, mean, stdDev) {
    if (mean == null) mean = 0
    if (stdDev == null) stdDev = 1
    return Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2)))
}

// adapted from http://us.php.net/rand
function randomGaussian(mean, stdDev) {
    if (mean == null) mean = 0
    if (stdDev == null) stdDev = 1
    
    var v = 2
    while (v > 1) {
        var u1 = Math.random()
        var u2 = Math.random()
        v = (2*u1 - 1) * (2*u1 - 1) +
        (2*u2 - 1) * (2*u2 - 1)
    }
    ret = (2*u1 - 1) * Math.sqrt(-2*Math.log(v) / v)
    return ret
}

function getMean(a) {
    return getSum(a) / a.length
}

function getVariance(a, mean) {
    if (mean == null) {
        mean = getMean(a)
    }
    var s = 0
    foreach(a, function (e) {s += Math.pow(e - mean, 2)})
    return s / (a.length - 1)
}

function getStdDev(a, mean) {
    return Math.sqrt(getVariance(a, mean))
}

function getStats(a) {
    var mean = getMean(a)
    var stdDev = getStdDev(a, mean)
    return {mean : mean, stdDev: stdDev}
}

function swap(o, i1, i2) {
    var temp = o[i1]
    o[i1] = o[i2]
    o[i2] = temp
}

function shuffle(a) {
    for (var i = 0; i < a.length; i++) {
        swap(a, i, randomIndex(a.length))
    }
    return a
}

function random(x, y) {
    if (y == undefined) {
        if (x == undefined) {
            return Math.random()
        }
        return Math.floor(Math.random() * x)
    }
    return x + Math.floor(Math.random() * (y - x + 1))    
}

function randomIndex(n) {
    return Math.floor(Math.random() * n)
}

function last(a, i) {
    if (a.length == 0) return null
    if (i == null) i = -1
    i = i % a.length
    if (i < 0) i += a.length
    return a[i]
}

function setProp(obj, prop, otherObj) {
    if (obj[prop] && (typeof obj[prop] == "object")) {
        foreach(otherObj, function (v, k) {
            obj[prop][k] = v
        })
    } else {
        obj[prop] = otherObj
    }
}

function values(obj) {
    var a = []
    foreach(obj, function (e) {a.push(e)})
    return a
}

function keys(obj) {
    var a = []
    foreach(obj, function (v, k) {a.push(k)})
    return a
}

function getSum(a, test) {
    if (test == null) {
        test = function (v, k) {
            return v
        }
    } else if (typeof test == "string") {
        var testString = test
        test = function (v, k) {
            var i = k
            var e = v
            return eval(testString)
        }
    }
    if (a instanceof Array) {
        var s = 0
        for (var i = 0; i < a.length; i++) {
            var v = a[i]
            s += test(v, i)
        }
        return s
    } else {
        var s = 0
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                var v = a[k]
                s += test(v, k)
            }
        }
        return s
    }
}

function find(a, test) {
    if (test == null) {
        test = function (v, k) {
            return v
        }
    } else if (typeof test != "function") {
        var testVal = test
        test = function (v, k) {
            return testVal == v
        }
    }
    
    if (a instanceof Array) {
        for (var i = 0; i < a.length; i++) {
            var v = a[i]
            if (test(v, i)) {
                return i
            }
        }
        return -1
    } else {
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                var v = a[k]
                if (test(v, k)) {
                    return k
                }
            }
        }
        return null
    }
}

function getMinObj(a, test) {
    if (test == null) {
        test = function (v, k) {
            return v
        }
    } else if (typeof test == "string") {
        var testString = test
        test = function (v, k) {
            var i = k
            var e = v
            return eval(testString)
        }
    }
    if (a instanceof Array) {
        var bestScore = null
        var bestElement = null
        var bestIndex = null
        for (var i = 0; i < a.length; i++) {
            var v = a[i]
            var score = test(v, i)
            if (bestElement == null || score < bestScore) {
                bestScore = score
                bestElement = v
                bestIndex = i
            }
        }
        return {e: bestElement, v: bestElement, i: bestIndex, k: bestIndex, s: bestScore}
    } else {
        var bestScore = null
        var bestElement = null
        var bestIndex = null
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                var v = a[k]
                var score = test(v, k)
                if (bestElement == null || score < bestScore) {
                    bestScore = score
                    bestElement = v
                    bestIndex = k
                }
            }
        }
        return {e: bestElement, v: bestElement, i: bestIndex, k: bestIndex, s: bestScore}
    }
}

function getMin(a, test) {
    return getMinObj(a, test).e
}

function getMaxObj(a, test) {
    if (test == null) {
        test = function (v, k) {
            return v
        }
    } else if (typeof test == "string") {
        var testString = test
        test = function (v, k) {
            var i = k
            var e = v
            return eval(testString)
        }
    }
    if (a instanceof Array) {
        var bestScore = null
        var bestElement = null
        var bestIndex = null
        for (var i = 0; i < a.length; i++) {
            var v = a[i]
            var score = test(v, i)
            if (bestElement == null || score > bestScore) {
                bestScore = score
                bestElement = v
                bestIndex = i
            }
        }
        return {e: bestElement, v: bestElement, i: bestIndex, k: bestIndex, s: bestScore}
    } else {
        var bestScore = null
        var bestElement = null
        var bestIndex = null
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                var v = a[k]
                var score = test(v, k)
                if (bestElement == null || score > bestScore) {
                    bestScore = score
                    bestElement = v
                    bestIndex = k
                }
            }
        }
        return {e: bestElement, v: bestElement, i: bestIndex, k: bestIndex, s: bestScore}
    }
}

function getMax(a, test) {
    return getMaxObj(a, test).e
}

function filter(a, test) {
    if (typeof test == "string") {
        var testString = test
        test = function (v, k) {
            var i = k
            var e = v
            return eval(testString)
        }
    }
    if (a instanceof Array) {
        var b = []
        for (var i = 0; i < a.length; i++) {
            var v = a[i]
            if (test(v, i)) {
                b.push(v)
            }
        }
        return b
    } else {
        var b = {}
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                var v = a[k]
                if (test(v, k)) {
                    b[k] = v
                }
            }
        }
        return b
    }
}

function forEach(a, test) {
    if (typeof test == "string") {
        var testString = test
        test = function (v, k) {
            var i = k
            var e = v
            return eval(testString)
        }
    }
    if (a instanceof Array) {
        for (var i = 0; i < a.length; i++) {
            if (test(a[i], i) == false) break
        }
    } else {
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                if (test(a[k], k) == false) break
            }
        }
    }
    return a
}
foreach = forEach

function map(a, test) {
    if (typeof test == "string") {
        var testString = test
        test = function (v, k) {
            var i = k
            var e = v
            return eval(testString)
        }
    }
    if (a instanceof Array) {
        var b = []
        for (var i = 0; i < a.length; i++) {
            b.push(test(a[i], i))
        }
        return b
    } else {
        var b = {}
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                b[k] = test(a[k], k)
            }
        }
        return b
    }
}

function mapToSelf(a, test) {
    if (typeof test == "string") {
        var testString = test
        test = function (v, k) {
            var i = k
            var e = v
            return eval(testString)
        }
    }
    if (a instanceof Array) {
        for (var i = 0; i < a.length; i++) {
            a[i] = test(a[i], i)
        }
        return a
    } else {
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                a[k] = test(a[k], k)
            }
        }
        return a
    }
}

function escapeUnicodeChar(c) {
    var code = c.charCodeAt(0)
    var hex = code.toString(16)
    if (code < 16) return '\\u000' + hex
    if (code < 256) return '\\u00' + hex
    if (code < 4096) return '\\u0' + hex
    return '\\u' + hex
}

function escapeString(s) {
    return s.
        replace(/\\/g, '\\\\').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\\"').
        replace(/[\u0000-\u001F]|[\u0080-\uFFFF]/g, escapeUnicodeChar)
}

function escapeRegex(s) {
    return escapeString(s).replace(/([\{\}\(\)\|\[\]\^\$\.\*\+\?])/g, "\\$1")
}

function my_json(o) {
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
json = my_json
try {
    if (Packages.MyUtil.Json.json('\t') == '"\\t"') {
        json = function (o) {
            return "" + Packages.MyUtil.Json.json(o)
        }
    }
} catch (e) {
}

// adapted: http://snippets.dzone.com/posts/show/4349
function getXPath(node) {
    return "/" + getXPathHelper(node, []).join("/")
}
function getXPathHelper(node, path) {
        path = path || [];
        if(node.parentNode) {
          path = getXPathHelper(node.parentNode, path);
        }

        if(node.previousSibling) {
          var count = 1;
          var sibling = node.previousSibling
          do {
            if(sibling.nodeType == 1 && sibling.nodeName == node.nodeName) {count++;}
            sibling = sibling.previousSibling;
          } while(sibling);
          if(count == 1) {count = null;}
        } else if(node.nextSibling) {
          var sibling = node.nextSibling;
          do {
            if(sibling.nodeType == 1 && sibling.nodeName == node.nodeName) {
              var count = 1;
              sibling = null;
            } else {
              var count = null;
              sibling = sibling.previousSibling;
            }
          } while(sibling);
        }

        if(node.nodeType == 1) {
          path.push(node.nodeName.toLowerCase() + (count > 0 ? "["+count+"]" : ''));
        }
        return path;
      };


function escapeURL(s) {
    return encodeURIComponent(s)
}
escapeUrl = escapeURL
encodeUrl = escapeURL

function unescapeURL(s) {
    return decodeURIComponent(s.replace(/\+/g, "%20"))
}
unescapeUrl = unescapeURL
decodeUrl = unescapeURL

// from MonetDB JavaScript XRPC API
function serializeXML(xml) {
    try {
        var xmlSerializer = new window.XMLSerializer();
        return xmlSerializer.serializeToString(xml);
    } catch(e){
        try {
            return xml.xml;
        } catch(e){
            alert("Failed to create xmlSerializer or to serialize XML document:\n" + e);
        }
    }
}
    //xmlToString = serializeXML
    //~ XMLToString = serializeXML

// creates functions:
//      escapeXml
//      unescapeXml
(function () {
    escapeBraces = function (s) {
        return s.replace(/{/g, '{{').replace(/}/g, '}}')
    }
    escapeXml = function (s, _escapeBraces) {
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
        if (_escapeBraces) {
            s = escapeBraces(s)
        }
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
    escapeXML = escapeXml
    escapeXPath = escapeXml
    escapeXQuery = escapeXml
    unescapeXML = unescapeXml
})()

function xpath(s, n) {
    if (!n) n = document
    if (n.nodeType == 9) {
        var doc = n
    } else {
        var doc = n.ownerDocument
    }
    var x = doc.evaluate(s, n, null, 0, null)
    var a = []
    while (true) {
    var b = x.iterateNext()
    if (!b) break
    a.push(b)
    }
    return a
}

function getXMLHttpRequest() {
    if (window.XMLHttpRequest) { 
        return new XMLHttpRequest()
    } else if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP")
    }
    return null
}

function my_ajax(url, postParams, callback) {
    var async = (callback != null)
    var x = getXMLHttpRequest()
    
    function getReturnValue() {
        return x.responseText
        //return x.responseXML ? x.responseXML : x.responseText
    }
    x.onreadystatechange = function() {
        if (x.readyState == 4 && x.status == 200) {
            if (async)
                callback(getReturnValue())
        }
    }
    if (postParams) {
        var paramString = ""
        if ((typeof postParams) == "string") {
            paramString = postParams
        } else {
            paramString = []
            for (var k in postParams) {
                paramString.push(escapeURL(k) + "=" + escapeURL(postParams[k]))
            }
            paramString = paramString.join("&")        
        }
        
        x.open("POST", url, async)
        x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        x.setRequestHeader("Content-length", paramString.length);
        x.setRequestHeader("Connection", "close");
        x.send(paramString)
    } else {
        x.open("GET", url, async)
        x.send("")
    }
    if (!async) {
        return getReturnValue()
    }
}

function getURLParams(url) {
    if (url === undefined) {
        url = window.location.href
    }
    var params = {}
    foreach(url.match(/[\\?&]([^=]+)=([^&#]*)/g), function (m) {
        var a = m.match(/.([^=]+)=(.*)/)
        params[decodeUrl(a[1])] = decodeUrl(a[2])
    })
    return params
}
getUrlParams = getURLParams

// from: http://www.netlobo.com/url_query_string_javascript.html
function getURLParam(name) {
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

parseXml_DOMParser = null
function parseXml(s) {
    if (!parseXml_DOMParser) {
        parseXml_DOMParser = new DOMParser()
    }
    return parseXml_DOMParser.parseFromString(s, "text/xml")
}
parseXML = parseXml

// these position function I got from somewhere, can't remember (found when looking for drag-n-drop stuff
function getPosition(e){
	var left = 0;
	var top  = 0;

	while (e.offsetParent){
		left += e.offsetLeft;
		top  += e.offsetTop;
		e     = e.offsetParent;
	}

	left += e.offsetLeft;
	top  += e.offsetTop;

	return {x:left, y:top};
}
function getPositionWithRespectTo(e, p){
    var ePos = getPosition(e)
    var pPos = getPosition(p)
    return {x: (ePos.x - pPos.x), y: (ePos.y - pPos.y)}
}

function distSq(a, b) {
    var dx = a.x - b.x
    var dy = a.y - b.y
    return (dx * dx) + (dy * dy)
}

function dist(a, b) {
    return Math.sqrt(distSq(a, b))
}

function lerp(t0, v0, t1, v1, t) {
    return (t - t0) * (v1 - v0) / (t1 - t0) + v0
}

function indexOf(array, element) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == element) return i;
    }
    return -1
}

function trim(s) {
    return s.replace(/^\s+|\s+$/g,"");
}
String.prototype.trim = function() {
    return trim(this)
}

function scrollToHorzCenterIn(thing, scrollParent) {
    var offsetParent = scrollParent.firstChild
    var pos = getPositionWithRespectTo(thing, offsetParent)
    var x = pos.x
    var w = thing.offsetWidth
    var mw = offsetParent.offsetWidth
    var v = scrollParent.offsetWidth
    
    scrollParent.scrollLeft = (x + (w / 2)) - (v / 2)
}

// from: http://lists.evolt.org/pipermail/javascript/2004-June/007409.html
function addCommas(someNum){
    while (someNum.match(/^\d\d{3}/)){
        someNum = someNum.replace(/(\d)(\d{3}(\.|,|$))/, '$1,$2');
    }
    return someNum;
}
         
/**
*
*  Javascript sprintf
*  http://www.webtoolkit.info/
*
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
function jsonPath(obj, expr, arg) {
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

/**
	<p>Takes two strings <code>a</code> and <code>b</code>, and calculates their differences.
	The differences are highlighted in each result using HTML span tags with yellow backgrounds.
	There are two resulting strings of HTML, returned in an object with two properties, <code>a</code> and <code>b</code>.</p>
    
    <p>Uses some "diffing" code from the internet, but I'm not sure where I got it.</p>
 */
function highlightDiff(a, b) {
    a = a.match(/\w+|\S+|\s+/g)
    if (!a) a = []
    b = b.match(/\w+|\S+|\s+/g)
    if (!b) b = []
    mapToSelf(a, function (e) { return ":" + e })
    mapToSelf(b, function (e) { return ":" + e })
    diff(a, b)
    function toHTML(tokens) {
        var yellow = false
        var s = []
        foreach(tokens, function (token) {
            if (typeof token == "string") {
                if (!yellow) {
                    yellow = true
                    s.push('<span style="background-color:yellow">')
                }
                s.push(escapeXml(token.substring(1)))
            } else {
                if (yellow) {
                    yellow = false
                    s.push('</span>')
                }
                s.push(escapeXml(token.text.substring(1)))
            }        
        })
        if (yellow) {
            yellow = false
            s.push('</span>')
        }
        return s.join('')
    }
    return {
        a : toHTML(a),
        b : toHTML(b)
    }
    
	// much of the "diff" function below comes from the web, but I forget where,
	// please let me know if you know the source
    function diff( o, n ) {
      var ns = new Object();
      var os = new Object();
      
      for ( var i = 0; i < n.length; i++ ) {
        if ( ns[ n[i] ] == null )
          ns[ n[i] ] = { rows: new Array(), o: null };
        ns[ n[i] ].rows.push( i );
      }
      
      for ( var i = 0; i < o.length; i++ ) {
        if ( os[ o[i] ] == null )
          os[ o[i] ] = { rows: new Array(), n: null };
        os[ o[i] ].rows.push( i );
      }
      
      for ( var i in ns ) {
        if ( ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1 ) {
          n[ ns[i].rows[0] ] = { text: n[ ns[i].rows[0] ], row: os[i].rows[0] };
          o[ os[i].rows[0] ] = { text: o[ os[i].rows[0] ], row: ns[i].rows[0] };
        }
      }
      
      for ( var i = 0; i < n.length - 1; i++ ) {
        if ( n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null && 
             n[i+1] == o[ n[i].row + 1 ] ) {
          n[i+1] = { text: n[i+1], row: n[i].row + 1 };
          o[n[i].row+1] = { text: o[n[i].row+1], row: i + 1 };
        }
      }
      
      for ( var i = n.length - 1; i > 0; i-- ) {
        if ( n[i].text != null && n[i-1].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null && 
             n[i-1] == o[ n[i].row - 1 ] ) {
          n[i-1] = { text: n[i-1], row: n[i].row - 1 };
          o[n[i].row-1] = { text: o[n[i].row-1], row: i - 1 };
        }
      }
      
      return { o: o, n: n };
    }
}

/**
	<p>Here is an example of <code>fold</code>:<br>
	<code>fold([1, 1, 1, 1], function (x, y) { return x + y }, 0)</code><br>
	returns <code>4</code>.</p>
	
	<p>The value of <code>x</code> in the function will always come from
	an element of <code>a</code>.</p>
	
	<p>If the parameter <code>def</code> is used,
	then the value of <code>y</code> in the function
	will always come from <code>def</code>,
	or from a return value of <code>func</code>.
	If <code>a</code> has no elements, then <code>def</code> will be returned.</p>
	
	<p>If <code>def</code> is not supplied,
	then both <code>x</code> and <code>y</code> will come from <code>a</code>.
	If <code>a</code> has only 1 element,
	then <code>func</code> will not be called,
	and that one element will be returned.
	If <code>a</code> has no elements, then <code>null</code> will be returned.</p> 
*/
function fold(a, func, def) {
	if (def === undefined) {
		var ret = null
		var first = true
		foreach(a, function (e) {
			if (first) {
				ret = e
				first = false
			} else {
				ret = func(e, ret)
			}
		})
		return ret	
	} else {
		var ret = def
		foreach(a, function (e) {
			ret = func(e, ret)
		})	
		return ret
	}
}


/**
 * Utility methods for doing statistics. More to come here in the future.
 */
function Stats() {
}

/**
 * Calculate the sum of an array
 */
Stats.sum = function (a) {
	return fold(a, function (x, y) { return x + y }, 0)
}

/**
	Calculate the mean of an array.
	<code>sum</code> is optional -- it will be calculated if not supplied. 
 */
Stats.mean = function (a, sum) {
	if (!(a instanceof Array)) a = values(a)
	if (sum === undefined) {
		sum = Stats.sum(a)
	}
	return sum / a.length
}

/**
	Calculate the variance of an array.
	<code>mean</code> is optional -- it will be calculated if not supplied. 
 */
Stats.variance = function (a, mean) {
	if (!(a instanceof Array)) a = values(a)
	if (!mean) {
		mean = Stats.mean(a)
	}
	return fold(a, function (x, y) {
		return Math.pow(x - mean, 2) + y
	}, 0) / (a.length - 1)
}

/**
	Calculate the standard deviation of an array.
	<code>mean</code> is optional -- it will be calculated if not supplied. 
 */
Stats.sd = function (a, mean) {
	return Math.sqrt(Stats.variance(a, mean))
}

/**
	Calculate the sum, mean, variance and standard deviation of <code>a</code>.
 */
Stats.all = function (a) {
	if (!(a instanceof Array)) a = values(a)
	var ret = {}
	ret.sum = Stats.sum(a)
	ret.mean = Stats.mean(a, ret.sum)
	ret.variance = Stats.variance(a, ret.mean)
	ret.sd = Math.sqrt(ret.variance)
	return ret
}

