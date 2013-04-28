
g_last_profile_time = 0
_.profile = function (name) {
    var now = _.time()
    if (name) {
        console.log(name + ' : ' + ((now - g_last_profile_time) / 1000).toFixed(3))
    }
    g_last_profile_time = now
}
