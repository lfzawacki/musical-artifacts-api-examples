(function (w) {
"use strict"

var i = (new Image()).src = "images/loading.gif";

var presets_url = "https://musical-artifacts.com/artifacts.json?apps=guitarix";
//var presets_url = "http://localhost:8080/presets.json";
var separator = "&";

var had_error = false;
var filters = { "tags" : [], "queries" : [] };

var add_tag_filter = function (tag) { add_filter(tag, "tags", "tag_filter"); }
var remove_tag_filter = function (span) { remove_filter(span, tag_filters); }
var add_query_filter = function(q) { add_filter(q, "queries", "query_filter"); }
var remove_query_filter = function (span) { remove_filter(span, query_filters); }

var add_filter = function (f, list, cls) {
    if (!f || filters[list].indexOf(f) >= 0)
        return;
    filters[list].push(f);
    var t = document.createElement("SPAN");
    t.textContent = f;
    t.setAttribute("class", cls + " filter");
    t.onclick = function () { remove_filter(this, list); };
    document.getElementById("filters").appendChild(t);
    document.body.classList.add("has_filters");
    run_filters();
}
var remove_filter = function (span, list) {
    if (!span) return;
    var str = span.textContent;
    var pos = filters[list].indexOf(str);
    if (!str || pos < 0) return;
    filters[list].splice(pos, 1);
    span.parentElement.removeChild(span);
    run_filters();
    for (var l in filters)
        if (filters[l].length)
            return;
    document.body.classList.remove("has_filters");
}

var run_filters = function () {
    var qstr = separator;
    if (filters["tags"].length)
        qstr += "tags=" + escape(filters["tags"].join(","));
    if (qstr !== separator)
        qstr +="&";
    if (filters["queries"].length)
        qstr += "q=" + escape(filters["queries"].join(" "));
    clear();
    ajax(append, qstr);
}
var reset = function () {
    for (var l in filters)
        filters[l] = [];
    clear();
}
var clear = function () {
    var c;
    var p = document.getElementById("presets");
    while (p.firstChild)
        p.removeChild(p.firstChild);
    had_error = false;
}

var ajax = function (onsuccess, query) {
    document.body.classList.add("loading");
    query = query || "";
    var request = new XMLHttpRequest();
    request.timeout = 10000;
    request.ontimeout = function () {
        error("The connection timed out. Please try reloading the page.");
    };
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200 && onsuccess) {
            onsuccess(JSON.parse(request.response));
            document.body.classList.remove("loading");
        } else if (request.readyState == 4) {
            if (request.status)
                error(request.statusText + "(" + request.status + ")");
            else
                error("An error occured. More information in the terminal.");
            document.body.classList.remove("loading");
        }
    }
    request.open("GET", presets_url + query, true);
    request.send();
}
var error = function (message) {
    if (had_error) return;
    had_error = true;
    var alert = document.createElement("DIV");
    alert.setAttribute("class", "alert");
    alert.textContent = message;
    var s = document.createElement("SMALL");
    s.textContent = "Click to reload.";
    alert.appendChild(s);
    alert.onclick = function () { location.reload(); };
    document.getElementById("presets").appendChild(alert);
}
var append = function (items) {
    var c = document.getElementById("presets");
    if (!items || !items.length) {
        error("No results. Please edit your filters or reload the page.");
        return;
    }
    for (var i_ = 0; i_ < items.length; i_++) {
        var i = items[i_];
        //console.log(i);
        // container
        var con = document.createElement("DIV");
        con.setAttribute("class", "preset");
        // header
        var header = document.createElement("H2");
        header.textContent = i.name;
        // author
        var author = document.createElement("DIV");
        author.setAttribute("class", "author");
        author.textContent = i.author;
        author.onclick = (function (a) {
            return function () { add_query_filter(a); };
        })(i.author);
        author.setAttribute("title", "Add filter '" + i.author + "'");
        // description
        var desc = document.createElement("DIV");
        desc.setAttribute("class", "description");
        desc.textContent = i.description;
        desc.onclick = function () { this.classList.toggle("more"); };
        // download
        var download = document.createElement("A");
        download.setAttribute("class", "download");
        download.setAttribute("href", i.file);
        // tags
        var tags = document.createElement("DIV");
        tags.setAttribute("class", "tags");
        for (var j = 0; j < i.tags.length; j++) {
            var tag = document.createElement("SPAN");
            tag.setAttribute("class", "tag");
            tag.textContent = i.tags[j];
            tag.onclick = (function (t) {
                return function () { add_tag_filter(t); };
            })(i.tags[j]);
            tag.setAttribute("title", "Add filter '" + i.tags[j] + "'");
            tags.appendChild(tag);
        }
        // downloads
        var dlcount = document.createElement("SPAN");
        dlcount.setAttribute("class", "downloads info");
        dlcount.textContent = "" + i.download_count;
        // likes
        var likes = document.createElement("SPAN");
        likes.setAttribute("class", "likes info");
        likes.textContent = "" + i.favorite_count;
        
        con.appendChild(header);
        con.appendChild(dlcount);
        con.appendChild(likes);
        con.appendChild(author);
        con.appendChild(desc);
        con.appendChild(download);
        con.appendChild(tags);
        
        c.appendChild(con);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    reset();
    ajax(append);
});

})(this);
