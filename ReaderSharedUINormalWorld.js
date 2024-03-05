/* Copyright (c) 2023 Apple Inc. All rights reserved. */
function loadTwitterJavaScript() {
    window.twttr || (window.twttr = function(e, t, r) {
        var i, a, d = e.getElementsByTagName(t)[0];
        if (!e.getElementById(r)) return (a = e.createElement(t)).id = r, a.src = "https://platform.twitter.com/widgets.js", d.parentNode.insertBefore(a, d), window.twttr || (i = {
            _e: [],
            ready: function(e) {
                i._e.push(e)
            }
        })
    }(document, "script", "twitter-wjs"))
}

function richTweetWasCreatedFromSimpleTweet(e) {
    e.parentNode.querySelector(".simple-tweet").classList.add("hidden")
}

function replaceSimpleTweetsWithRichTweets(e) {
    let t = document.querySelectorAll("[data-reader-tweet-id]");
    t.length && (loadTwitterJavaScript(), twttr.ready((function(r) {
        for (let i of t) r.widgets.createTweet(i.getAttribute("data-reader-tweet-id"), i, e).then(richTweetWasCreatedFromSimpleTweet)
    })))
}