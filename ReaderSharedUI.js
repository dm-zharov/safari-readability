/* Copyright (c) 2023 Apple Inc. All rights reserved. */
//  Copyright (c) 2013 Apple Inc. All rights reserved.
function articleHeight() {
    return document.getElementById("article").offsetHeight + 2 * parseFloat(getComputedStyle(document.getElementById("article")).marginTop)
}

function smoothScroll(e, t, n, i) {
    function o(t, n) {
        scrollEventIsSmoothScroll = !0, e.scrollTop = n, setTimeout((function() {
            scrollEventIsSmoothScroll = !1
        }), 0)
    }
    const r = 1e3 / 60;
    let a = e.scrollTop,
        l = a + t,
        s = 0,
        d = articleHeight() - window.innerHeight;
    if (l < s && (l = s), l > d && (l = d), a == l) return;
    let c = Math.abs(l - a);
    if (c < Math.abs(t) && (n = n * c / Math.abs(t)), smoothScrollingAnimator) {
        let e = smoothScrollingAnimator.animations[0].progress,
            t = e > .5 ? 1 - e : e,
            s = n / (1 - t),
            d = -t * s,
            c = Math.sin(Math.PI / 2 * t),
            m = c * c,
            u = (a - l * m) / (1 - m);
        return abortSmoothScroll(), smoothScrollingAnimator = new AppleAnimator(s, r, i), smoothScrollingAnimation = new AppleAnimation(u, l, o), smoothScrollingAnimator.addAnimation(smoothScrollingAnimation), void smoothScrollingAnimator.start(d)
    }
    smoothScrollingAnimator = new AppleAnimator(n, r, i), smoothScrollingAnimation = new AppleAnimation(a, l, o), smoothScrollingAnimator.addAnimation(smoothScrollingAnimation), smoothScrollingAnimator.start()
}

function abortSmoothScroll() {
    smoothScrollingAnimator.stop(AnimationTerminationCondition.Interrupted), smoothScrollingAnimator = null, smoothScrollingAnimation = null
}

function articleScrolled() {
    !scrollEventIsSmoothScroll && smoothScrollingAnimator && abortSmoothScroll(), ReaderJSController.articleScrolled()
}

function traverseReaderContent(e, t) {
    if (!e) return;
    let n = e.offsetTop,
        i = document.createTreeWalker(document.getElementById("article"), NodeFilter.SHOW_ELEMENT, {
            acceptNode: function(e) {
                let t = e.classList;
                return t.contains("page-number") || t.contains("float") || t.contains("page") || t.contains("scrollable") || "HR" === e.tagName || 0 === e.offsetHeight || "inline" === getComputedStyle(e).display || n === e.offsetTop ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
            }
        });
    return i.currentNode = e, i[t]()
}

function nextReaderContentElement(e) {
    return traverseReaderContent(e, "nextNode")
}

function previousReaderContentElement(e) {
    return traverseReaderContent(e, "previousNode")
}

function articleTitleElement() {
    return document.querySelector("#article .page .title")
}

function mediaElementIsPlaying(e) {
    return !!(e.currentTime > 0 && !e.paused && !e.ended && e.readyState > 2)
}

function keyDown(e) {
    let t = !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey),
        n = !e.metaKey && !e.altKey && !e.ctrlKey && e.shiftKey;
    switch (e.keyCode) {
        case 8:
            n ? ReaderJSController.goForward() : t && ReaderJSController.goBack(), e.preventDefault();
            break;
        case 74:
            ContentAwareScrollerJS.scroll(ContentAwareNavigationDirection.Down);
            break;
        case 75:
            ContentAwareScrollerJS.scroll(ContentAwareNavigationDirection.Up);
            break;
        case 82:
            t && ReaderJS.reloadArticlePreservingScrollPosition()
    }
}

function getArticleScrollPosition() {
    scrollInfo = {}, scrollInfo.version = 1;
    let e = document.getElementsByClassName("page"),
        t = e.length;
    if (!t) return scrollInfo.pageIndex = 0, scrollInfo;
    scrollInfo.pageIndex = e.length - 1;
    let n = window.scrollY;
    for (let i = 0; i < t; i++) {
        let t = e[i];
        if (t.offsetTop + t.offsetHeight >= n) {
            scrollInfo.pageIndex = i;
            break
        }
    }
    return scrollInfo
}

function restoreInitialArticleScrollPosition() {
    let e = document.getElementsByClassName("page")[initialScrollPosition.pageIndex];
    e && (document.scrollingElement.scrollTop = e.offsetTop)
}

function restoreInitialArticleScrollPositionIfPossible() {
    if (didRestoreInitialScrollPosition) return;
    if (!initialScrollPosition && (initialScrollPosition = ReaderJSController.initialArticleScrollPosition(), !initialScrollPosition || !initialScrollPosition.pageIndex)) return void(didRestoreInitialScrollPosition = !0);
    let e = document.getElementsByClassName("page-number").length;
    initialScrollPosition.pageIndex >= e || (setTimeout(restoreInitialArticleScrollPosition, DelayBeforeRestoringScrollPositionInMs), didRestoreInitialScrollPosition = !0)
}

function makeWideElementsScrollable() {
    let e = document.querySelectorAll("table, pre");
    for (let t of e) {
        if (t.classList.contains("float")) continue;
        if (t.parentElement.classList.contains("scrollable")) continue;
        let e = document.createElement("div");
        t.parentElement.insertBefore(e, t), t.remove(), e.appendChild(t), e.classList.add("scrollable")
    }
}

function fontSettings(e) {
    function t(e) {
        return e.replace(/\W/g, "").toLowerCase()
    }
    const n = [15, 16, 17, 18, 19, 20, 21, 23, 26, 28, 37, 46],
        i = ["25px", "26px", "27px", "28px", "29px", "30px", "31px", "33px", "37px", "39px", "51px", "62px"];
    let o = {
        System: {
            lineHeights: ["25px", "26px", "27px", "29px", "30px", "31px", "32px", "33px", "38px", "39px", "51px", "62px"],
            usesSystemFont: !0
        },
        Charter: {
            lineHeights: ["25px", "26px", "27px", "28px", "29px", "30px", "32px", "34px", "38px", "39px", "51px", "62px"]
        },
        Georgia: {
            lineHeights: ["25px", "26px", "27px", "28px", "29px", "30px", "32px", "34px", "38px", "41px", "51px", "62px"]
        },
        "Iowan Old Style": {
            lineHeights: ["25px", "26px", "27px", "28px", "29px", "30px", "32px", "34px", "38px", "39px", "51px", "62px"]
        },
        Palatino: {
            lineHeights: ["25px", "26px", "27px", "28px", "29px", "30px", "31px", "34px", "37px", "40px", "51px", "62px"]
        },
        Seravek: {
            lineHeights: ["25px", "26px", "27px", "28px", "28px", "30px", "31px", "34px", "37px", "39px", "51px", "62px"]
        },
        "Hiragino Sans W3": {
            lineHeights: ["1.85em", "1.78em", "1.74em", "1.71em", "1.72em", "1.73em", "1.75em", "1.76em", "1.78em", "1.9em", "1.92em", "2em"]
        },
        "Hiragino Kaku Gothic ProN": {
            lineHeights: ["1.85em", "1.78em", "1.74em", "1.7em", "1.69em", "1.68em", "1.69em", "1.7em", "1.74em", "1.85em", "1.9em", "2em"]
        },
        "Hiragino Mincho ProN": {
            lineHeights: ["1.75em", "1.72em", "1.69em", "1.66em", "1.64em", "1.56em", "1.53em", "1.56em", "1.6em", "1.65em", "1.69em", "1.72em"]
        },
        "Hiragino Maru Gothic ProN": {
            lineHeights: ["1.85em", "1.78em", "1.74em", "1.7em", "1.69em", "1.68em", "1.69em", "1.7em", "1.74em", "1.85em", "1.9em", "2em"]
        },
        "PingFang SC": {
            lineHeights: ["1.85em", "1.78em", "1.74em", "1.7em", "1.69em", "1.68em", "1.69em", "1.7em", "1.74em", "1.85em", "1.9em", "2em"],
            usesSystemFont: !0
        },
        "Heiti SC": {
            lineHeights: ["1.85em", "1.78em", "1.74em", "1.7em", "1.7em", "1.71em", "1.72em", "1.75em", "1.8em", "1.9em", "1.95em", "2em"]
        },
        "Songti SC": {
            lineHeights: ["1.8em", "1.78em", "1.74em", "1.72em", "1.71em", "1.72em", "1.73em", "1.75em", "1.8em", "1.9em", "1.95em", "1.96em"]
        },
        "Kaiti SC": {
            lineHeights: ["1.75em", "1.72em", "1.69em", "1.66em", "1.64em", "1.56em", "1.53em", "1.56em", "1.6em", "1.65em", "1.69em", "1.72em"]
        },
        "Yuanti SC": {
            lineHeights: ["1.95em", "1.93em", "1.9em", "1.87em", "1.85em", "1.8em", "1.83em", "1.85em", "1.88em", "1.9em", "1.91em", "1.92em"]
        },
        "Libian SC": {
            fontSizes: [27, 28, 29, 30, 31, 32, 33, 35, 37, 40, 42, 46],
            lineHeights: ["1.65em", "1.63em", "1.62em", "1.61em", "1.6em", "1.6em", "1.61em", "1.62em", "1.63em", "1.64em", "1.64em", "1.65em"]
        },
        "Weibei SC": {
            fontSizes: [21, 22, 23, 24, 25, 26, 27, 29, 32, 34, 39, 43],
            lineHeights: ["1.65em", "1.63em", "1.62em", "1.61em", "1.6em", "1.6em", "1.61em", "1.62em", "1.63em", "1.64em", "1.64em", "1.65em"]
        },
        "Yuppy SC": {
            lineHeights: ["1.75em", "1.73em", "1.7em", "1.67em", "1.65em", "1.6em", "1.63em", "1.65em", "1.68em", "1.7em", "1.71em", "1.72em"]
        },
        "PingFang TC": {
            lineHeights: ["1.85em", "1.78em", "1.75em", "1.72em", "1.7em", "1.7em", "1.7em", "1.72em", "1.75em", "1.82em", "1.85em", "1.9em"],
            usesSystemFont: !0
        },
        "Heiti TC": {
            lineHeights: ["1.85em", "1.78em", "1.75em", "1.72em", "1.71em", "1.71em", "1.72em", "1.75em", "1.78em", "1.82em", "1.86em", "1.9em"]
        },
        "Songti TC": {
            lineHeights: ["1.8em", "1.78em", "1.74em", "1.73em", "1.72em", "1.72em", "1.73em", "1.75em", "1.8em", "1.9em", "1.95em", "1.96em"]
        },
        "Kaiti TC": {
            fontSizes: [20, 21, 22, 23, 24, 25, 26, 28, 31, 33, 38, 43],
            lineHeights: ["1.63em", "1.62em", "1.62em", "1.6em", "1.56em", "1.53em", "1.5em", "1.53em", "1.56em", "1.6em", "1.62em", "1.63em"]
        },
        "Yuanti TC": {
            lineHeights: ["1.95em", "1.93em", "1.9em", "1.87em", "1.85em", "1.8em", "1.83em", "1.85em", "1.88em", "1.9em", "1.91em", "1.92em"]
        },
        "Libian TC": {
            fontSizes: [27, 28, 29, 30, 31, 32, 33, 35, 37, 40, 42, 46],
            lineHeights: ["1.65em", "1.63em", "1.62em", "1.61em", "1.6em", "1.6em", "1.61em", "1.62em", "1.63em", "1.64em", "1.64em", "1.65em"]
        },
        "Weibei TC": {
            fontSizes: [21, 22, 23, 24, 25, 26, 27, 29, 32, 34, 39, 43],
            lineHeights: ["1.65em", "1.63em", "1.62em", "1.61em", "1.6em", "1.6em", "1.61em", "1.62em", "1.63em", "1.64em", "1.64em", "1.65em"]
        },
        "Yuppy TC": {
            lineHeights: ["1.75em", "1.73em", "1.7em", "1.67em", "1.65em", "1.6em", "1.63em", "1.65em", "1.68em", "1.7em", "1.71em", "1.72em"]
        },
        "Noto Nastaliq Urdu": {
            lineHeights: ["2.6em", "2.7em", "2.8em", "2.8em", "2.8em", "2.8em", "2.8em", "2.6em", "2.5em", "2.5em", "2.5em", "2.6em"]
        }
    } [e];
    return o || (o = {}), o.cssClassName = t(e), o.usesSystemFont || (o.fontFamilyName = e), o.fontSizes || (o.fontSizes = n), o.lineHeights || (o.lineHeights = i), o
}

function prepareTweetsInPrintingMailingFrame(e) {
    let t = e.querySelectorAll(".tweet-wrapper");
    for (let e of t) {
        let t = e.querySelector("iframe");
        t && t.remove();
        let n = e.querySelector(".simple-tweet");
        n && n.classList.remove("hidden")
    }
}

function urlFromString(e) {
    try {
        return new URL(e)
    } catch (e) {
        return null
    }
}

function stopExtendingElementBeyondTextColumn(e) {
    e.classList.remove("extendsBeyondTextColumn"), e.style && (e.style.removeProperty("width"), e.style.removeProperty("-webkit-margin-start"))
}

function leadingMarginAndPaddingAppliedToElementFromAncestors(e) {
    let t = 0,
        n = e.parentElement;
    for (; n && !n.classList.contains("page");) {
        let e = getComputedStyle(n);
        t += parseFloat(e["-webkit-padding-start"]) + parseFloat(e["-webkit-margin-start"]), n = n.parentElement
    }
    return t
}

function extendElementBeyondTextColumn(e, t, n) {
    e.classList.add("extendsBeyondTextColumn"), e.style && (e.style.setProperty("width", t + "px"), e.style.setProperty("-webkit-margin-start", (n - t) / 2 - leadingMarginAndPaddingAppliedToElementFromAncestors(e) + "px"))
}

function monitorMouseDownForPotentialDeactivation(e) {
    lastMouseDownWasOutsideOfPaper = e && ReaderAppearanceJS.usesPaperAppearance() && !document.getElementById("article").contains(e.target)
}

function deactivateIfEventIsOutsideOfPaperContainer(e) {
    lastMouseDownWasOutsideOfPaper && e && ReaderAppearanceJS.usesPaperAppearance() && !document.getElementById("article").contains(e.target) && ReaderJSController.requestDeactivationFromUserAction()
}

function updatePageNumbers() {
    let e = document.getElementsByClassName("page-number"),
        t = e.length,
        n = ReaderJS.isLoadingNextPage();
    for (let i = 0; i < t; ++i) e[i].textContent = n ? getLocalizedString("Page %@").format(i + 1) : getLocalizedString("Page %@ of %@").format(i + 1, t)
}

function incomingPagePlaceholder() {
    return document.getElementById("incoming-page-placeholder")
}

function addIncomingPagePlaceholder(e) {
    let t = document.createElement("div");
    t.className = "page", t.id = "incoming-page-placeholder";
    let n = document.createElement("div");
    n.id = "incoming-page-corner";
    let i = document.createElement("div");
    i.id = "incoming-page-text", i.innerText = getLocalizedString(e ? "Loading Next Page\u2026" : "Connect to the internet to view remaining pages."), n.appendChild(i), t.appendChild(n), document.getElementById("article").appendChild(t)
}

function removeIncomingPagePlaceholder() {
    let e = incomingPagePlaceholder();
    e.parentNode.removeChild(e)
}

function nextPageContainer() {
    return document.getElementById("next-page-container")
}

function getLocalizedString(e) {
    let t = localizedStrings[e];
    return t || e
}

function nextPageLoadComplete() {
    if (nextPageContainer().removeEventListener("load", nextPageLoadComplete, !1), ReaderJS.pageNumber++, ReaderJS.readerOperationMode == ReaderOperationMode.OffscreenFetching) {
        let e = ReaderJS.pageURLs[ReaderJS.pageURLs.length - 1];
        ReaderJSController.nextPageLoadComplete(ReaderJS.pageNumber, e, "next-page-container")
    }
    ReaderJSController.prepareNextPageFrame("next-page-container");
    let e = ReaderJSController.nextPageArticleFinder();
    e.pageNumber = ReaderJS.pageNumber, e.suggestedRouteToArticle = ReaderJS.routeToArticle, e.previouslyDiscoveredPageURLStrings = ReaderJS.pageURLs;
    let t = e.adoptableArticle();
    t && (ReaderJS.createPageFromNode(t), ReaderJS.routeToArticle = e.routeToArticleNode()), nextPageContainer().removeAttribute("src"), ReaderJSController.clearNextPageArticleFinder(), ReaderJS.canLoadNextPage() ? ReaderJS.setNextPageURL(e.nextPageURL()) : ReaderJS.setCachedNextPageURL(e.nextPageURL()), updatePageNumbers(), restoreInitialArticleScrollPositionIfPossible(), ReaderJS.isLoadingNextPage() || ReaderJS.doneLoadingAllPages()
}

function firstContentElementAfterTopOfViewport() {
    let e, t = Number.MAX_VALUE;
    const n = window.innerWidth / 2;
    for (let i = 0; i <= 10; ++i) {
        const o = document.elementFromPoint(n, 4 * i).closest("[data-reader-unique-id]");
        if (!o) continue;
        const r = o.offsetHeight;
        r < t && (e = o, t = r)
    }
    if (e) return e;
    let i = articleTitleElement();
    if (!i) return null;
    do {
        if (i.getBoundingClientRect().bottom >= 0) return i
    } while (i = nextReaderContentElement(i));
    return null
}

function setConfiguration(e) {
    ReaderAppearanceJS.applyConfiguration(e)
}

function setReaderIsActive(e) {
    ReaderJS.setReaderIsActive(e)
}

function setArticleLocale(e) {
    document.getElementById("article").style.webkitLocale = `'${e}'`, ReaderAppearanceJS.applyConfiguration(ReaderAppearanceJS.configuration)
}

function handleVisibilityChange() {
    ReaderJS.setDocumentIsVisible(!document.hidden)
}
const LoadNextPageDelay = 250,
    MaxNumberOfNextPagesToLoad = 80,
    ReaderOperationMode = {
        Normal: 0,
        OffscreenFetching: 1,
        ArchiveViewing: 2
    },
    LoadingMode = {
        Normal: 0,
        Reload: 1
    },
    DelayBeforeRestoringScrollPositionInMs = 1e3;
String.prototype.format = function() {
    let e = this.split("%@");
    for (let t = 0, n = arguments.length; t < n; ++t) e.splice(2 * t + 1, 0, arguments[t].toString());
    return e.join("")
};
const debounceTimeoutSymbol = Symbol("debounce-timeout"),
    debounceSoonProxySymbol = Symbol("debounce-soon-proxy");
Object.defineProperty(Object.prototype, "debounce", {
    value(e) {
        return new Proxy(this, {
            get: (t, n) => (...i) => {
                let o = t[n];
                o[debounceTimeoutSymbol] && clearTimeout(o[debounceTimeoutSymbol]);
                let r = () => {
                    o[debounceTimeoutSymbol] = void 0, o.apply(t, i)
                };
                o[debounceTimeoutSymbol] = setTimeout(r, e)
            }
        })
    }
}), Object.defineProperty(Function.prototype, "cancelDebounce", {
    value() {
        this[debounceTimeoutSymbol] && (clearTimeout(this[debounceTimeoutSymbol]), this[debounceTimeoutSymbol] = void 0)
    }
});
const AnimationTerminationCondition = {
    Interrupted: 0,
    CompletedSuccessfully: 1
};
AppleAnimator = function(e, t, n) {
    this.startTime = 0, this.duration = e, this.interval = t, this.animations = [], this.animationFinishedCallback = n, this.currentFrameRequestID = null, this._firstTime = !0;
    let i = this;
    this.animate = function() {
        function e(e, t, n) {
            return e < t ? t : e > n ? n : e
        }
        let t, n, o, r = (new Date).getTime(),
            a = i.duration;
        t = e(r - i.startTime, 0, a), r = t / a, n = .5 - .5 * Math.cos(Math.PI * r), o = t >= a;
        let l = i.animations,
            s = l.length,
            d = i._firstTime;
        for (let e = 0; e < s; ++e) l[e].doFrame(i, n, d, o, r);
        o ? i.stop(AnimationTerminationCondition.CompletedSuccessfully) : (i._firstTime = !1, this.currentFrameRequestID = requestAnimationFrame(i.animate))
    }
}, AppleAnimator.prototype = {
    start: function(e) {
        let t = (new Date).getTime(),
            n = this.interval;
        this.startTime = t - n, e && (this.startTime += e), this.currentFrameRequestID = requestAnimationFrame(this.animate)
    },
    stop: function(e) {
        this.animationFinishedCallback && this.animationFinishedCallback(e), this.currentFrameRequestID && cancelAnimationFrame(this.currentFrameRequestID)
    },
    addAnimation: function(e) {
        this.animations[this.animations.length] = e
    }
}, AppleAnimation = function(e, t, n) {
    this.from = e, this.to = t, this.callback = n, this.now = e, this.ease = 0, this.progress = 0
}, AppleAnimation.prototype = {
    doFrame: function(e, t, n, i, o) {
        let r;
        r = i ? this.to : this.from + (this.to - this.from) * t, this.now = r, this.ease = t, this.progress = o, this.callback(e, r, n, i)
    }
};
let smoothScrollingAnimator, smoothScrollingAnimation, scrollEventIsSmoothScroll = !1;
window.addEventListener("scroll", articleScrolled, {
    capture: !1,
    passive: !0
});
const ContentAwareNavigationMarker = "reader-content-aware-navigation-marker",
    ContentAwareNavigationAnimationDuration = 200,
    ContentAwareNavigationElementOffset = 8,
    ContentAwareNavigationDirection = {
        Up: 0,
        Down: 1
    };
ContentAwareScroller = function() {
    this._numberOfContentAwareScrollAnimationsInProgress = 0
}, ContentAwareScroller.prototype = {
    _contentElementAtTopOfViewport: function() {
        let e = articleTitleElement();
        do {
            if (!(e.getBoundingClientRect().top < ContentAwareNavigationElementOffset)) return e
        } while (e = nextReaderContentElement(e));
        return null
    },
    _clearTargetOfContentAwareScrolling: function() {
        let e = document.getElementById(ContentAwareNavigationMarker);
        e && e.removeAttribute("id")
    },
    _contentAwareScrollFinished: function(e) {
        e === AnimationTerminationCondition.CompletedSuccessfully && (--this._numberOfContentAwareScrollAnimationsInProgress, this._numberOfContentAwareScrollAnimationsInProgress || (smoothScrollingAnimator = null, smoothScrollingAnimation = null, this._clearTargetOfContentAwareScrolling()))
    },
    scroll: function(e) {
        let t, n, i = document.getElementById(ContentAwareNavigationMarker),
            o = i || this._contentElementAtTopOfViewport();
        if (e === ContentAwareNavigationDirection.Down) {
            let e = Math.abs(o.getBoundingClientRect().top - ContentAwareNavigationElementOffset) < 1;
            t = i || e ? nextReaderContentElement(o) : o
        } else if (e === ContentAwareNavigationDirection.Up)
            if (o === articleTitleElement()) {
                if (0 === document.scrollingElement.scrollTop) return;
                n = -1 * document.scrollingElement.scrollTop
            } else t = previousReaderContentElement(o);
        t && (n = t.getBoundingClientRect().top - ContentAwareNavigationElementOffset), ++this._numberOfContentAwareScrollAnimationsInProgress, smoothScroll(document.scrollingElement, n, ContentAwareNavigationAnimationDuration, this._contentAwareScrollFinished.bind(this)), this._clearTargetOfContentAwareScrolling(), t && (t.id = ContentAwareNavigationMarker)
    }
}, window.addEventListener("keydown", keyDown, !1);
let initialScrollPosition, didRestoreInitialScrollPosition = !1;
const ThemeSettings = {
        White: {
            cssClassName: "white"
        },
        Gray: {
            cssClassName: "gray",
            tweetTheme: "dark"
        },
        Sepia: {
            cssClassName: "sepia"
        },
        Night: {
            cssClassName: "night",
            tweetTheme: "dark"
        }
    },
    ShouldRestoreReadingPosition = {
        No: !1,
        Yes: !0
    },
    MinTextZoomIndex = 0,
    MaxTextZoomIndex = 11,
    MaximumWidthOfImageOrVideoExtendingBeyondTextContainer = 1050,
    ReaderConfigurationJavaScriptEnabledKey = "javaScriptEnabled";
ReaderAppearanceController = function() {
    this._shouldUsePaperAppearance = function() {
        const e = 70;
        return this.articleWidth() + 2 * e < this.documentElementWidth()
    }, this._isOLEDDisplay = function() {
        return !1
    }, this._tryApplyStaticConfiguration = function() {
        return !1
    }, this._defaultFontFamilyName = "System", this._defaultThemeName = "White", this.configuration = {}, this._textSizeIndex = null, this._fontFamilyName = this._defaultFontFamilyName, this._themeName = this._defaultThemeName
}, ReaderAppearanceController.prototype = {
    initialize: function() {
        this.applyConfiguration(ReaderJSController.initialConfiguration()), this._isOLEDDisplay() && document.body.classList.add("oled")
    },
    applyConfiguration: function(e) {
        if (this._tryApplyStaticConfiguration()) return void this.layOutContent();
        let t = this._locale();
        this.setLocale(t);
        for (let n of [e.fontFamilyNameForLanguageTag[t], e.defaultFontFamilyNameForLanguage[t], "System"])
            if (n && this.setFontFamily(n)) break;
        for (let t of [e.themeName, "White"])
            if (t && this.setTheme(t)) break;
        this.setCurrentTextSizeIndex(e.fontSizeIndex), this.configuration = e, this.layOutContent()
    },
    articleWidth: function() {
        return document.getElementById("article").getBoundingClientRect().width
    },
    _textColumnWidthInPoints: function() {
        return parseFloat(getComputedStyle(document.querySelector("#article .page")).width)
    },
    documentElementWidth: function() {
        return document.documentElement.clientWidth
    },
    setCurrentTextSizeIndex: function(e) {
        this._textSizeIndex = e, this._rebuildDynamicStyleSheet()
    },
    currentFontCSSClassName: function() {
        return this._currentFontSettings().cssClassName
    },
    currentFontCSSFontFamilyName: function() {
        return this._currentFontSettings().fontFamilyName
    },
    currentFontUsesSystemFont: function() {
        return this._currentFontSettings().usesSystemFont
    },
    _currentFontSettings: function() {
        return fontSettings(this._fontFamilyName)
    },
    setLocale: function(e) {
        if (e === this._lastSetLocale) return;
        let t = document.body.classList;
        const n = "locale-";
        t.remove(n + this._lastSetLocale), t.add(n + e), this._lastSetLocale = e
    },
    setFontFamily: function(e) {
        let t = document.body,
            n = fontSettings(e);
        if (!n) return !1;
        if (this._fontFamilyName) {
            let e = fontSettings(this._fontFamilyName);
            t.classList.remove(e.cssClassName), t.style.fontFamily = null, e.usesSystemFont && t.classList.remove("system")
        }
        return "function" == typeof ReaderJSController.makeFontAvailableIfNecessary && ReaderJSController.makeFontAvailableIfNecessary(e), t.classList.add(n.cssClassName), n.fontFamilyName && (t.style.fontFamily = n.fontFamilyName), n.usesSystemFont && t.classList.add("system"), this._fontFamilyName = e, !0
    },
    _theme: function() {
        return ThemeSettings[this._themeName]
    },
    setTheme: function(e) {
        let t = document.body,
            n = ThemeSettings[e];
        return !!n && (t.classList.contains(n.cssClassName) || (this._theme() && t.classList.remove(this._theme().cssClassName), t.classList.add(n.cssClassName), this._themeName = e), !0)
    },
    usesPaperAppearance: function() {
        return document.documentElement.classList.contains("paper")
    },
    layOutContent: function(e = ShouldRestoreReadingPosition.Yes) {
        document.querySelector("#article .page") && (this._shouldUsePaperAppearance() ? document.documentElement.classList.add("paper") : document.documentElement.classList.remove("paper"), makeWideElementsScrollable(), this._layOutImagesAndVideoElementsBeyondTextColumn(), this._layOutElementsContainingTextBeyondTextColumn(), this._layOutVideos(), this._layOutMetadataBlock(), e === ShouldRestoreReadingPosition.Yes && ReadingPositionStabilizerJS.restorePosition())
    },
    _layOutMetadataBlock: function() {
        let e = document.querySelector(".metadata");
        if (!e) return;
        let t = e.querySelector(".byline"),
            n = e.querySelector(".date");
        if (!t || !n) return void e.classList.add("singleline");
        let i = 0;
        for (let e of t.getClientRects()) i += e.width;
        for (let e of n.getClientRects()) i += e.width;
        i + 25 > this._textColumnWidthInPoints() ? e.classList.remove("singleline") : e.classList.add("singleline")
    },
    _layOutImagesAndVideoElementsBeyondTextColumn: function() {
        let e = this.canLayOutContentMaintainingAspectRatioBeyondTextColumn(),
            t = document.getElementById("article").querySelectorAll("img, video");
        for (let n of t) this.setImageOrVideoShouldLayOutBeyondTextColumnIfAppropriate(n, e)
    },
    _layOutElementsContainingTextBeyondTextColumn: function() {
        const e = {
                PRE: !0,
                TABLE: !1
            },
            t = 22;
        let n = document.querySelectorAll(".scrollable pre, .scrollable table");
        for (let i of n) {
            let n = i.parentElement;
            for (let e = n; e; e = e.parentElement) "BLOCKQUOTE" === e.tagName && e.classList.add("simple");
            stopExtendingElementBeyondTextColumn(n);
            let o = i.scrollWidth,
                r = this._textColumnWidthInPoints();
            if (o <= r) continue;
            let a = getComputedStyle(document.querySelector(".page")),
                l = 0;
            if (e[i.tagName]) {
                let e = parseFloat(a["-webkit-padding-start"]) + parseFloat(a["-webkit-margin-start"]);
                l = Math.min(e, t)
            }
            extendElementBeyondTextColumn(n, Math.min(o, this._widthAvailableForLayout() - 2 * l), r)
        }
    },
    _layOutVideos: function() {
        function e(e) {
            return e.src && /^(.+\.)?(youtube(-nocookie)?|vimeo)\.com\.?$/.test(urlFromString(e.src).hostname)
        }
        const t = 16 / 9;
        let n, i, o = ReaderAppearanceJS.canLayOutContentMaintainingAspectRatioBeyondTextColumn();
        for (let r of document.getElementById("article").querySelectorAll("iframe")) {
            const a = r.parentElement.classList.contains("iframe-wrapper");
            if (!a && !e(r)) continue;
            let l;
            if (a ? l = r.parentElement : (l = document.createElement("div"), l.className = "iframe-wrapper", r.nextSibling ? r.parentNode.insertBefore(l, r.nextSibling) : r.parentNode.appendChild(l), l.appendChild(r)), n || (n = Math.min(MaximumWidthOfImageOrVideoExtendingBeyondTextContainer, this._widthAvailableForLayout())), i || (i = this._textColumnWidthInPoints()), o && n > i) {
                l.style.height = n / t + "px", extendElementBeyondTextColumn(l, n, i), r.style.height = "100%";
                let e = this.usesPaperAppearance() ? 2 : 0;
                r.style.width = n - e + "px"
            } else stopExtendingElementBeyondTextColumn(l), l.style.width = "100%", l.style.height = i / t + "px"
        }
    },
    canLayOutContentMaintainingAspectRatioBeyondTextColumn: function() {
        const e = 700;
        if (window.innerHeight >= e) return !0;
        const t = 1.25;
        return window.innerWidth / window.innerHeight <= t
    },
    setImageOrVideoShouldLayOutBeyondTextColumnIfAppropriate: function(e, t) {
        if (t && !e.closest("blockquote, table, .float")) {
            let t, n = this._textColumnWidthInPoints(),
                i = parseFloat(e.getAttribute("width"));
            t = isNaN(i) ? e.naturalWidth : i;
            let o = Math.min(t, Math.min(MaximumWidthOfImageOrVideoExtendingBeyondTextContainer, this._widthAvailableForLayout()));
            if (o > n) return void extendElementBeyondTextColumn(e, o, n)
        }
        stopExtendingElementBeyondTextColumn(e)
    },
    _widthAvailableForLayout: function() {
        return this.usesPaperAppearance() ? this.articleWidth() : this.documentElementWidth()
    },
    _rebuildDynamicStyleSheet: function() {
        let e = document.getElementById("dynamic-article-content").sheet;
        for (; e.cssRules.length;) e.removeRule(0);
        let t = this._currentFontSettings().fontSizes[this._textSizeIndex] + "px",
            n = this._currentFontSettings().lineHeights[this._textSizeIndex];
        e.insertRule("#article { font-size: " + t + "; line-height: " + n + "; }")
    },
    _locale: function() {
        let e = document.getElementById("article").style.webkitLocale;
        return e && e.length ? '"' != e[0] ? e : e.substr(1, e.length - 2) : ""
    }
};
let lastMouseDownWasOutsideOfPaper = !1;
ReaderController = function() {
    this.pageNumber = 1, this.pageURLs = [], this.articleIsLTR = !0, this.loadingNextPage = !1, this.loadingNextPageManuallyStopped = !1, this.cachedNextPageURL = null, this.lastKnownDocumentElementWidth = 0, this._readerWillBecomeVisible = function() {}, this._readerWillEnterBackground = function() {}, this._distanceFromBottomOfArticleToStartLoadingNextPage = function() {
        return NaN
    }, this._clickingOutsideOfPaperRectangleDismissesReader = !1, this._shouldSkipActivationWhenPageLoads = function() {
        return !1
    }, this._shouldConvertRelativeURLsToAbsoluteURLsWhenPrintingOrMailing = !1, this._deferSendingContentIsReadyForDisplay = !1, this._isJavaScriptEnabled = function() {
        return !0
    }, this._readerIsActive = !0, this._documentIsVisible = !document.hidden
}, ReaderController.prototype = {
    setOriginalURL: function(e) {
        this.originalURL = e, this.pageURLs.push(e), document.head.getElementsByTagName("base")[0].href = this.originalURL, ReaderJSController.setArticleBaseURLString(e)
    },
    setNextPageURL: function(e) {
        if (!e || -1 !== this.pageURLs.indexOf(e) || this.pageNumber + 1 === MaxNumberOfNextPagesToLoad) return void this.setLoadingNextPage(!1);
        this.setLoadingNextPage(!0), this.pageURLs.push(e);
        let t = function() {
            nextPageContainer().addEventListener("load", nextPageLoadComplete, !1), nextPageContainer().src = e
        };
        this.readerOperationMode == ReaderOperationMode.OffscreenFetching ? t() : this.nextPageLoadTimer = setTimeout(t, LoadNextPageDelay)
    },
    pauseLoadingNextPage: function() {
        this.readerOperationMode == ReaderOperationMode.Normal && (nextPageContainer().removeEventListener("load", nextPageLoadComplete, !1), this.cachedNextPageURL || (this.cachedNextPageURL = this.pageURLs.pop()), nextPageContainer().src = null, this.nextPageLoadTimer && clearTimeout(this.nextPageLoadTimer), ReaderJSController.didChangeNextPageLoadingState(!1))
    },
    stopLoadingNextPage: function() {
        nextPageContainer().removeEventListener("load", nextPageLoadComplete, !1), nextPageContainer().src = null, this.nextPageLoadTimer && clearTimeout(this.nextPageLoadTimer), this.isLoadingNextPage() && (this.setLoadingNextPage(!1), this.loadingNextPageManuallyStopped = !0)
    },
    isLoadingNextPage: function() {
        return this.loadingNextPage
    },
    setLoadingNextPage: function(e) {
        this.loadingNextPage != e && (e ? addIncomingPagePlaceholder(window.navigator.onLine) : removeIncomingPagePlaceholder(), this.loadingNextPage = e, ReaderJSController.didChangeNextPageLoadingState(this.loadingNextPage))
    },
    doneLoadingAllPages: function() {
        ReaderJSController.doneLoadingReaderPage()
    },
    loaded: function() {
        this.readerOperationMode = ReaderJSController.readerOperationMode();
        const e = ReaderJSController.originalArticleFinder();
        if (!e || this._shouldSkipActivationWhenPageLoads()) return void ReaderJSController.deactivateNow();
        this.loadArticle();
        let t = ReaderJSController.cachedTopScrollOffset();
        t > 0 ? document.scrollingElement.scrollTop = t : requestAnimationFrame((function() {
            ReadingPositionStabilizerJS.applyScrollPositionFromOriginalPage()
        })), ReadingPositionStabilizerJS.initialize(), this._clickingOutsideOfPaperRectangleDismissesReader && (document.documentElement.addEventListener("mousedown", monitorMouseDownForPotentialDeactivation), document.documentElement.addEventListener("click", deactivateIfEventIsOutsideOfPaperContainer)), window.addEventListener("resize", this.windowDidResize.bind(this), !1);
        var n = "",
            i = e.articleTitle();
        i && (n += i + " \n");
        var o = e.articleSubhead();
        o && (n += o + " \n");
        let r = n + e.adoptableArticle().textContent;
        r = r.toString().replace(/(<([^>]+)>)/gi, "");
        let a = function() {
            ReaderJSController.contentIsReadyForDisplay(r)
        };
        this._deferSendingContentIsReadyForDisplay ? setTimeout(a, 0) : a()
    },
    windowDidResize: function() {
        let e = ReaderAppearanceJS.documentElementWidth();
        e !== this.lastKnownDocumentElementWidth && (this.lastKnownDocumentElementWidth = e, ReaderAppearanceJS.layOutContent(), ReadingPositionStabilizerJS.windowDidResize())
    },
    loadArticle: function(e = LoadingMode.Normal) {
        const t = ReaderJSController.originalArticleFinder();
        if (t.article || t.articleNode(!0), !t.article) return this.setOriginalURL(t.contentDocument.baseURI), void this.doneLoadingAllPages();
        this.routeToArticle = t.routeToArticleNode(), this.displayTitleInformation = t.articleTitleInformation(), this._snapshotOfArticleTitle = t.articleTitle(), this.displaySubhead = t.articleSubhead(), this.metadataElement = t.adoptableMetadataBlock(), this.articleIsLTR = t.articleIsLTR();
        const n = t.articleNode();
        this._heightOfArticleNodeOnOriginalPage = n.getBoundingClientRect().height;
        let i = t.adoptableArticle();
        this._snapshotOfAdoptableArticle = i.cloneNode(!0);
        let o, r = i.ownerDocument;
        if (document.title = r.title, this.setOriginalURL(r.baseURI), this.readerOperationMode != ReaderOperationMode.ArchiveViewing) {
            if (this._isJavaScriptEnabled()) o = t.nextPageURL(), this.setNextPageURL(o);
            else {
                for (let e of i.querySelectorAll("iframe")) e.remove();
                this.stopLoadingNextPage()
            }
            e !== LoadingMode.Reload && ReaderAppearanceJS.initialize(), this.createPageFromNode(i), o || (t.adoptableMultiPageContentElements().forEach(this.createPageFromNode, this), updatePageNumbers()), this.isLoadingNextPage() || this.doneLoadingAllPages(), e === LoadingMode.Reload && setTimeout((function() {
                ReadingPositionStabilizerJS.contentWasReloaded()
            }), 0)
        } else ReaderAppearanceJS.layOutContent()
    },
    reloadArticlePreservingScrollPositionIfArticleNodeContentHasChanged: function() {
        const e = ReaderJSController.originalArticleFinder();
        if (!e) return;
        const t = e.documentURLString(),
            n = 30;
        for (const e of document.querySelectorAll("audio, video"))
            if (mediaElementIsPlaying(e)) return;
        const i = e.articleNode();
        if (!i) return;
        if (i.getBoundingClientRect().height < this._heightOfArticleNodeOnOriginalPage - n) return;
        if (this.originalURL !== t) return;
        e.reset();
        const o = e.articleNode();
        if (i !== o && !o.contains(i)) return;
        const r = e.adoptableArticle();
        if (this._adoptableArticlesAreUserVisiblyEquivalent(this._snapshotOfAdoptableArticle, r)) return;
        const a = e.articleTitle();
        this._snapshotOfArticleTitle === a && this.reloadArticlePreservingScrollPosition()
    },
    _adoptableArticlesAreUserVisiblyEquivalent: function(e, t) {
        function n(e, t) {
            let o = e.nodeType;
            if (o !== t.nodeType) return !1;
            switch (o) {
                case Node.ELEMENT_NODE:
                    if (e.tagName !== t.tagName) return !1;
                    let n = e.attributes;
                    if (n.length !== t.attributes.length) return !1;
                    let o = t.attributes;
                    for (let e of n)
                        if (e.name !== i && e.value !== o[e.name].value) return !1;
                    break;
                case Node.TEXT_NODE:
                case Node.COMMENT_NODE:
                    if (e.data !== t.data) return !1;
                    break;
                default:
                    return !1
            }
            let r = e.firstChild,
                a = t.firstChild;
            for (; r;) {
                if (!n(r, a)) return !1;
                r = r.nextSibling, a = a.nextSibling
            }
            return !a
        }
        const i = ReaderJSController.originalArticleFinder().elementReaderUniqueIDAttributeKey();
        return n(e, t)
    },
    reloadArticlePreservingScrollPosition: function() {
        this._reloadArticleAndPreserveScrollPosition(!0)
    },
    loadNewArticle: function() {
        this._reloadArticleAndPreserveScrollPosition(!1)
    },
    _reloadArticleAndPreserveScrollPosition: function(e) {
        if (!ReaderJSController.originalArticleFinder()) return void ReaderJSController.deactivateNow();
        ReadingPositionStabilizerJS.setTrackPosition(!1);
        const [t, n] = [scrollX, scrollY], [i, o] = ReadingPositionStabilizerJS.uniqueIDAndScrollRatioOfElementPinnedToTop();
        let r = document.getElementById("article");
        for (r.style.minHeight = r.getBoundingClientRect().height + "px"; r.childNodes.length >= 1;) r.removeChild(r.firstChild);
        if (this.reinitialize(), e || (document.scrollingElement.scrollTop = 0), this.loadArticle(LoadingMode.Reload), e) {
            let e;
            i && (e = ReadingPositionStabilizerJS.tryToScrollToUniqueIDAndRatio(i, o)), e || scrollTo(t, n)
        }
        ReadingPositionStabilizerJS.setTrackPosition(!0), setTimeout((function() {
            r.style.minHeight = null
        }), 0)
    },
    reinitialize: function() {
        this.pageNumber = 1, this.pageURLs = [], this.articleIsLTR = !0, this.loadingNextPage = !1, this.loadingNextPageManuallyStopped = !1, this.routeToArticle = void 0, this.displayTitleInformation = void 0, this.displaySubhead = void 0, this.originalURL = void 0, this.nextPageLoadTimer = void 0, this.readerOperationMode = ReaderJSController.readerOperationMode(), this.cachedNextPageURL = null
    },
    createPageFromNode: function(e) {
        const t = ReaderJSController.originalArticleFinder();
        let n = document.createElement("div");
        n.className = "page", this.articleIsLTR || n.classList.add("rtl");
        let i = document.createElement("div");
        i.className = "page-number", n.appendChild(i);
        let o = this.displayTitleInformation,
            r = document.createElement("h1");
        if (r.className = "title", r.textContent = o.titleText, o.linkURL && o.linkIsForExternalPage) {
            let e = document.createElement("a");
            e.href = o.linkURL, o.linkIsTargetBlank && e.setAttribute("target", "_blank"), e.appendChild(r), r = e
        }
        const a = t.elementReaderUniqueIDAttributeKey();
        if (r.setAttribute(a, t.titleUniqueID()), n.appendChild(r), this.displaySubhead) {
            let e = document.createElement("h2");
            e.className = "subhead", e.textContent = this.displaySubhead, e.setAttribute(a, t.subheadUniqueID()), n.appendChild(e)
        }
        if (this.metadataElement && this.metadataElement.innerText) {
            let e = document.createElement("div");
            for (e.className = "metadata"; this.metadataElement.firstChild;) e.appendChild(this.metadataElement.firstChild);
            n.appendChild(e)
        }
        let l = e.tagName;
        if ("PRE" === l || "CODE" === l) n.appendChild(e);
        else
            for (; e.firstChild;) n.appendChild(e.firstChild);
        document.getElementById("article").insertBefore(n, incomingPagePlaceholder()), ReaderJS._isJavaScriptEnabled() && ReaderJSController.replaceSimpleTweetsWithRichTweets(this.optionsForTweetCreation()), ReaderAppearanceJS.layOutContent(ShouldRestoreReadingPosition.No), updatePageNumbers(), restoreInitialArticleScrollPositionIfPossible();
        for (let e of n.querySelectorAll("img")) e.onload = function(e) {
            let t = e.target;
            ReaderAppearanceJS.setImageOrVideoShouldLayOutBeyondTextColumnIfAppropriate(t, ReaderAppearanceJS.canLayOutContentMaintainingAspectRatioBeyondTextColumn()), t.onload = null
        };
        this._fixImageElementsWithinPictureElements()
    },
    optionsForTweetCreation: function() {
        let e = {
                dnt: !0
            },
            t = ReaderAppearanceJS._theme();
        return t && t.tweetTheme && (e.theme = t.tweetTheme), e
    },
    removeAttribute: function(e, t) {
        let n = e.querySelectorAll("[" + t + "]");
        for (let e of n) e.removeAttribute(t)
    },
    preparePrintingMailingFrame: function() {
        let e = this.printingMailingFrameElementId(),
            t = document.getElementById(e);
        t && document.body.removeChild(t), t = this.sanitizedFullArticleFrame(), t.id = e
    },
    sanitizedFullArticleFrame: function() {
        let e = document.createElement("iframe");
        e.style.display = "none", e.style.position = "absolute", document.body.appendChild(e);
        let t = e.contentDocument,
            n = document.createElement("base");
        n.href = this.originalURL, t.head.appendChild(n);
        let i = document.createElement("div");
        i.className = "original-url";
        let o = document.createElement("a");
        o.href = this.originalURL, o.textContent = this.originalURL, i.appendChild(document.createElement("br")), i.appendChild(o), i.appendChild(document.createElement("br")), i.appendChild(document.createElement("br")), t.body.appendChild(i), t.body.appendChild(this.sanitizedFullArticle()), t.head.appendChild(document.getElementById("print").cloneNode(!0));
        let r = t.createElement("title");
        return r.innerText = document.title, t.head.appendChild(r), e
    },
    sanitizedFullArticle: function() {
        let e = document.getElementById("article").cloneNode(!0);
        e.removeAttribute("tabindex");
        const t = e.querySelectorAll(".title");
        for (let e = 1, n = t.length; e < n; ++e) t[e].remove();
        for (let t of e.querySelectorAll(".page-number, #incoming-page-placeholder")) t.remove();
        if (prepareTweetsInPrintingMailingFrame(e), this._shouldConvertRelativeURLsToAbsoluteURLsWhenPrintingOrMailing) {
            const t = /^http:\/\/|^https:\/\/|^data:/i;
            let n = e.querySelectorAll("img, video, audio, source");
            for (let e of n) {
                let n = e.getAttribute("src");
                t.test(n) || e.setAttribute("src", e.src)
            }
        }
        for (let t of e.querySelectorAll(".extendsBeyondTextColumn")) stopExtendingElementBeyondTextColumn(t);
        for (let t of e.querySelectorAll(".delimeter")) t.innerText = "\u2022";
        e.classList.add(ReaderAppearanceJS.currentFontCSSClassName());
        let n = ReaderAppearanceJS.currentFontCSSFontFamilyName();
        n && (e.style.fontFamily = n), ReaderAppearanceJS.currentFontUsesSystemFont() && e.classList.add("system"), e.classList.add("exported");
        const i = ReaderJSController.originalArticleFinder().elementReaderUniqueIDAttributeKey();
        for (let t of e.getElementsByTagName("*")) t.removeAttribute(i);
        let o = document.getElementById("article-content").sheet.cssRules,
            r = o.length;
        for (let t = 0; t < r; ++t) {
            let n = o[t].selectorText,
                i = o[t].style;
            if (!i) continue;
            let r = i.cssText;
            e.matches(n) && e.style && (e.style.cssText += r);
            for (let t of e.querySelectorAll(n)) t.style && (t.style.cssText += r)
        }
        return e
    },
    printingMailingFrameElementId: function() {
        return "printing-mailing-frame"
    },
    canLoadNextPage: function() {
        if (this.readerOperationMode != ReaderOperationMode.Normal) return !0;
        let e = document.querySelectorAll(".page"),
            t = e[e.length - 1].getBoundingClientRect(),
            n = this._distanceFromBottomOfArticleToStartLoadingNextPage();
        return !!isNaN(n) || !(t.bottom - window.scrollY > n)
    },
    setCachedNextPageURL: function(e) {
        e ? (this.cachedNextPageURL = e, ReaderJSController.didChangeNextPageLoadingState(!1)) : this.setNextPageURL(e)
    },
    loadNextPage: function() {
        null != this.cachedNextPageURL && (this.setNextPageURL(this.cachedNextPageURL), this.cachedNextPageURL = null, ReaderJSController.didChangeNextPageLoadingState(!0))
    },
    resumeCachedNextPageLoadIfNecessary: function() {
        ReaderJS.cachedNextPageURL && ReaderJS.canLoadNextPage() && ReaderJS.loadNextPage()
    },
    setDocumentIsVisible: function(e) {
        this._documentIsVisible = e, this._readerForegroundednessMayHaveChanged(), e && ReaderAppearanceJS.layOutContent()
    },
    setReaderIsActive: function(e) {
        this._readerIsActive = e, this._readerForegroundednessMayHaveChanged()
    },
    readerIsForeground: function() {
        return this._documentIsVisible && this._readerIsActive
    },
    _readerForegroundednessMayHaveChanged: function() {
        let e = this.readerIsForeground();
        this._readerIsForeground !== e && (e ? this.readerWillBecomeVisible() : this.readerWillEnterBackground(), ReadingPositionStabilizerJS.setTrackPosition(e), this._readerIsForeground = e)
    },
    readerWillBecomeVisible: function() {
        document.body.classList.remove("cached"), this.resumeCachedNextPageLoadIfNecessary(), this._readerWillBecomeVisible(), this._readerIsActive && requestAnimationFrame((function() {
            ReadingPositionStabilizerJS.applyScrollPositionFromOriginalPage()
        }))
    },
    readerWillEnterBackground: function() {
        (ReaderJS.isLoadingNextPage() || ReaderJS.loadingNextPageManuallyStopped) && this.pauseLoadingNextPage();
        for (let e of document.querySelectorAll("audio")) e.pause();
        for (let e of document.querySelectorAll("video")) e.hasAttribute("data-reader-silent-looped-animation") || e.pause();
        this._readerWillEnterBackground()
    },
    _fixImageElementsWithinPictureElements: function() {
        requestAnimationFrame((function() {
            let e = !1,
                t = document.querySelectorAll("#article picture img");
            for (let n of t) {
                let t = n.previousElementSibling;
                if (t) n.remove(), t.after(n), e = !0;
                else {
                    let t = n.parentElement;
                    n.remove(), t.appendChild(n), e = !0
                }
            }
            e && ReaderAppearanceJS.layOutContent()
        }))
    }
}, ReadingPositionStabilizer = function() {
    this.elementTouchingTopOfViewport = null, this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio = 0, this._trackingScrolling = !1, this._hasEverScrolled = !1
}, ReadingPositionStabilizer.prototype = {
    initialize: function() {
        this.setTrackPosition(!0);
        const e = 250;
        this._checkForUpdatedContentSoon = this.debounce(e)._checkForUpdatedContentNow, this.windowDidResize = this.debounce(e)._windowDidResize
    },
    setTrackPosition: function(e) {
        if (e === this._trackingScrolling) return;
        this._trackingScrolling = e;
        const t = 250;
        this._debouncedDidScroll || (this._debouncedDidScroll = this.debounce(t)._didScroll), e ? window.addEventListener("scroll", this._debouncedDidScroll, {
            capture: !1,
            passive: !0
        }) : window.removeEventListener("scroll", this._debouncedDidScroll, {
            capture: !1,
            passive: !0
        })
    },
    _windowDidResize: function() {
        this._hasEverScrolled && this._updatePosition(!1)
    },
    contentWasReloaded: function() {
        this._updatePosition(!1)
    },
    _didScroll: function() {
        this._trackingScrolling && (this._hasEverScrolled = !0, this._updatePosition(!1))
    },
    _updatePosition: function(e = !0) {
        let t = firstContentElementAfterTopOfViewport();
        if (!t) return void(this.elementTouchingTopOfViewport = null);
        this.elementTouchingTopOfViewport = t;
        let n = this.elementTouchingTopOfViewport.getBoundingClientRect();
        this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio = n.height > 0 ? n.top / n.height : 0, this._originalPageScrollSyncAndContentRefreshIsAllowed() && ReaderJS.readerIsForeground() && (this._pushScrollPositionToOriginalPage(), e && this._checkForUpdatedContentSoon())
    },
    _pushScrollPositionToOriginalPage: function() {
        const e = ReaderJSController.originalArticleFinder(),
            [t, n] = this.uniqueIDAndScrollRatioOfElementPinnedToTop(),
            i = e.rectOfElementWithReaderUniqueID(t);
        if (!i || !i.top || isNaN(i.top) || !i.height || isNaN(i.height)) return;
        const o = -n * i.height;
        e.scrollToOffset(i.top + o)
    },
    applyScrollPositionFromOriginalPage: function() {
        const e = ReaderJSController.originalArticleFinder(),
            t = e.readerUniqueIDOfElementPinnedToTopOfViewport();
        if (!t) return;
        const n = e.rectOfElementWithReaderUniqueID(t);
        if (!n || !n.top || isNaN(n.top) || !n.height || isNaN(n.height)) return;
        const i = (n.top - e.scrollY()) / n.height;
        this.tryToScrollToUniqueIDAndRatio(t, i)
    },
    _checkForUpdatedContentNow: function() {
        ReaderJS.reloadArticlePreservingScrollPositionIfArticleNodeContentHasChanged()
    },
    restorePosition: function() {
        if (!this.elementTouchingTopOfViewport) return;
        let e = this.elementTouchingTopOfViewport.getBoundingClientRect(),
            t = document.scrollingElement.scrollTop + e.top - e.height * this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio;
        t > 0 && (document.scrollingElement.scrollTop = t), this._updatePosition()
    },
    uniqueIDAndScrollRatioOfElementPinnedToTop: function() {
        if (!this.elementTouchingTopOfViewport) return [null, null];
        const e = ReaderJSController.originalArticleFinder();
        return [this.elementTouchingTopOfViewport.getAttribute(e.elementReaderUniqueIDAttributeKey()), this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio]
    },
    tryToScrollToUniqueIDAndRatio: function(e, t) {
        const n = ReaderJSController.originalArticleFinder(),
            i = document.querySelector("[" + n.elementReaderUniqueIDAttributeKey() + "='" + e + "']");
        if (!i) return !1;
        const o = i.getBoundingClientRect();
        return !!o.height && (document.scrollingElement.scrollTop = o.top - t * o.height + window.scrollY, this._updatePosition(!1), !0)
    },
    _originalPageScrollSyncAndContentRefreshIsAllowed: function() {
        return !document.body.classList.contains("watch")
    }
}, document.addEventListener("visibilitychange", handleVisibilityChange, !1);
var ContentAwareScrollerJS = new ContentAwareScroller,
    ReaderAppearanceJS = new ReaderAppearanceController,
    ReadingPositionStabilizerJS = new ReadingPositionStabilizer,
    ReaderJS = new ReaderController;
window.addEventListener("load", (function() {
    ReaderJS.loaded()
}), !1);