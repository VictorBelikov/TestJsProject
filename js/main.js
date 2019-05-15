!function() {
  var a, b, c;
  !function(d) {
    function e(a, b) {
      return u.call(a, b)
    }
    function f(a, b) {
      var c, d, e, f, g, h, i, j, k, l, m, n = b && b.split("/"), o = s.map, p = o && o["*"] || {};
      if (a && "." === a.charAt(0))
        if (b) {
          for (n = n.slice(0, n.length - 1),
          a = a.split("/"),
          g = a.length - 1,
          s.nodeIdCompat && w.test(a[g]) && (a[g] = a[g].replace(w, "")),
          a = n.concat(a),
          k = 0; k < a.length; k += 1)
            if (m = a[k],
            "." === m)
              a.splice(k, 1),
              k -= 1;
            else if (".." === m) {
              if (1 === k && (".." === a[2] || ".." === a[0]))
                break;
              k > 0 && (a.splice(k - 1, 2),
              k -= 2)
            }
          a = a.join("/")
        } else
          0 === a.indexOf("./") && (a = a.substring(2));
      if ((n || p) && o) {
        for (c = a.split("/"),
        k = c.length; k > 0; k -= 1) {
          if (d = c.slice(0, k).join("/"),
          n)
            for (l = n.length; l > 0; l -= 1)
              if (e = o[n.slice(0, l).join("/")],
              e && (e = e[d])) {
                f = e,
                h = k;
                break
              }
          if (f)
            break;
          !i && p && p[d] && (i = p[d],
          j = k)
        }
        !f && i && (f = i,
        h = j),
        f && (c.splice(0, h, f),
        a = c.join("/"))
      }
      return a
    }
    function g(a, b) {
      return function() {
        return n.apply(d, v.call(arguments, 0).concat([a, b]))
      }
    }
    function h(a) {
      return function(b) {
        return f(b, a)
      }
    }
    function i(a) {
      return function(b) {
        q[a] = b
      }
    }
    function j(a) {
      if (e(r, a)) {
        var b = r[a];
        delete r[a],
        t[a] = !0,
        m.apply(d, b)
      }
      if (!e(q, a) && !e(t, a))
        throw new Error("No " + a);
      return q[a]
    }
    function k(a) {
      var b, c = a ? a.indexOf("!") : -1;
      return c > -1 && (b = a.substring(0, c),
      a = a.substring(c + 1, a.length)),
      [b, a]
    }
    function l(a) {
      return function() {
        return s && s.config && s.config[a] || {}
      }
    }
    var m, n, o, p, q = {}, r = {}, s = {}, t = {}, u = Object.prototype.hasOwnProperty, v = [].slice, w = /\.js$/;
    o = function(a, b) {
      var c, d = k(a), e = d[0];
      return a = d[1],
      e && (e = f(e, b),
      c = j(e)),
      e ? a = c && c.normalize ? c.normalize(a, h(b)) : f(a, b) : (a = f(a, b),
      d = k(a),
      e = d[0],
      a = d[1],
      e && (c = j(e))),
      {
        f: e ? e + "!" + a : a,
        n: a,
        pr: e,
        p: c
      }
    }
    ,
    p = {
      require: function(a) {
        return g(a)
      },
      exports: function(a) {
        var b = q[a];
        return "undefined" != typeof b ? b : q[a] = {}
      },
      module: function(a) {
        return {
          id: a,
          uri: "",
          exports: q[a],
          config: l(a)
        }
      }
    },
    m = function(a, b, c, f) {
      var h, k, l, m, n, s, u = [], v = typeof c;
      if (f = f || a,
      "undefined" === v || "function" === v) {
        for (b = !b.length && c.length ? ["require", "exports", "module"] : b,
        n = 0; n < b.length; n += 1)
          if (m = o(b[n], f),
          k = m.f,
          "require" === k)
            u[n] = p.require(a);
          else if ("exports" === k)
            u[n] = p.exports(a),
            s = !0;
          else if ("module" === k)
            h = u[n] = p.module(a);
          else if (e(q, k) || e(r, k) || e(t, k))
            u[n] = j(k);
          else {
            if (!m.p)
              throw new Error(a + " missing " + k);
            m.p.load(m.n, g(f, !0), i(k), {}),
            u[n] = q[k]
          }
        l = c ? c.apply(q[a], u) : void 0,
        a && (h && h.exports !== d && h.exports !== q[a] ? q[a] = h.exports : l === d && s || (q[a] = l))
      } else
        a && (q[a] = c)
    }
    ,
    a = b = n = function(a, b, c, e, f) {
      if ("string" == typeof a)
        return p[a] ? p[a](b) : j(o(a, b).f);
      if (!a.splice) {
        if (s = a,
        s.deps && n(s.deps, s.callback),
        !b)
          return;
        b.splice ? (a = b,
        b = c,
        c = null) : a = d
      }
      return b = b || function() {}
      ,
      "function" == typeof c && (c = e,
      e = f),
      e ? m(d, a, b, c) : setTimeout(function() {
        m(d, a, b, c)
      }, 4),
      n
    }
    ,
    n.config = function(a) {
      return n(a)
    }
    ,
    a._defined = q,
    c = function(a, b, c) {
      b.splice || (c = b,
      b = []),
      e(q, a) || e(r, a) || (r[a] = [a, b, c])
    }
    ,
    c.amd = {
      jQuery: !0
    }
  }(),
  c("almond", ["almond/almond"], function(a) {
    return a
  }),
  c("almond/almond", function() {}),
  function(a) {
    function b() {
      return g.promiscuous.deferred()
    }
    var d = "__postMessageChannel_callback"
      , e = "__postMessageChannel_ready"
      , f = "debug=1"
      , g = {
      eventOn: function(a, b, c) {
        if (a && "function" == typeof b) {
          var d = c || window;
          d.addEventListener ? d.addEventListener(a, b, !1) : d.attachEvent && d.attachEvent("on" + a, b)
        }
      },
      eventOff: function(a, b, c) {
        if (a && "function" == typeof b) {
          var d = c || window;
          d.removeEventListener ? d.removeEventListener(a, b, !1) : d.detachEvent && d.detachEvent("on" + a, b)
        }
      }
    };
    !function() {
      !function a() {
        function b() {
          var g = function(i, j, k) {
            if (i !== a) {
              var l = b();
              return g.c.push({
                d: l,
                resolve: i,
                reject: j
              }),
              l.promise
            }
            var m;
            if (null !== k && (typeof k === f || typeof k === e))
              try {
                m = k.then
              } catch (n) {
                j = !1,
                k = n
              }
            if (typeof m === e) {
              i = g;
              try {
                m.call(this, function(b) {
                  m && (m = null,
                  i(a, !0, b))
                }, function(b) {
                  m && (m = null,
                  i(a, !1, b))
                })
              } catch (n) {
                m && (m = null,
                i(a, !1, n))
              }
            } else {
              for (var o = j ? "resolve" : "reject", p = g.c, q = 0, r = p.length; r > q; q++) {
                var s = p[q]
                  , t = s.d
                  , u = s[o];
                typeof u !== e ? t[o](k) : d(u, k, t)
              }
              g = c(h, k, j)
            }
          }
            , h = {
            then: function(a, b) {
              return g(a, b)
            }
          };
          return g.c = [],
          {
            promise: h,
            resolve: function(b) {
              g.c && g(a, !0, b)
            },
            reject: function(b) {
              g.c && g(a, !1, b)
            }
          }
        }
        function c(a, c, f) {
          return function(g, h) {
            var i, j = f ? g : h;
            return typeof j !== e ? a : (d(j, c, i = b()),
            i.promise)
          }
        }
        function d(a, b, c) {
          setTimeout(function() {
            try {
              var d = a(b)
                , g = null !== d && (typeof d === f || typeof d === e) && d.then;
              typeof g !== e ? c.resolve(d) : d === c.promise ? c.reject(new TypeError) : g.call(d, c.resolve, c.reject)
            } catch (h) {
              c.reject(h)
            }
          })
        }
        var e = "function"
          , f = "object";
        g.promiscuous = {
          resolve: function(a) {
            var b = {};
            return b.then = c(b, a, !0),
            b
          },
          reject: function(a) {
            var b = {};
            return b.then = c(b, a, !1),
            b
          },
          deferred: b
        }
      }()
    }();
    var h = function(a) {
      function c() {
        if (l.targetId)
          var a = (document.getElementById(l.targetId) || {}).contentWindow;
        return a || l.target || (l.targetFrame || {}).contentWindow || {
          postMessage: function(a, b) {
            window.console && window.console.warn && (window.location.search || "").toLowerCase().indexOf(f) > 0 && console.warn("Warn: Did not send message to target.", a, b, l)
          }
        }
      }
      function i(a, b, d, e) {
        var f = {
          scope: p,
          dfdId: d,
          data: b,
          method: a,
          state: e
        };
        c().postMessage(JSON.stringify(f), q)
      }
      function j(a) {
        var c = {};
        try {
          c = JSON.parse(a.data)
        } catch (e) {
          c = a.data || {}
        }
        if (a.origin === q && c.scope === p && c.method)
          if (r[c.method])
            r[c.method](c);
          else if (void 0 !== c.dfdId && n[c.method]) {
            var f, g = function(a, b) {
              i(d, a, c.dfdId, b)
            }, h = {
              async: function() {
                return f = b()
              }
            }, j = n[c.method].call(h, c.data);
            f ? f.promise.then(g, function(a) {
              g(a, "reject")
            }) : g(j === h ? void 0 : j)
          }
      }
      if (!(this instanceof h))
        return new h(a);
      var k, l = a || {}, m = [], n = l.methods || {}, o = !1;
      if (!l.id || !l.origin)
        throw new Error("id and origin are required");
      if (!(l.targetId || l.target || l.targetFrame))
        throw new Error("one of target, targetFrame, or targetId is required");
      var p = l.id
        , q = l.origin
        , r = {};
      r[e] = function(a) {
        var b = a.data || {};
        o && b.forceReply && i(e),
        k.resolve()
      }
      ,
      r[d] = function(a) {
        a && m[a.dfdId] && (m[a.dfdId][a.state || "resolve"](a.data),
        delete m[a.dfdId])
      }
      ,
      g.eventOn("message", j),
      this.reset = function() {
        k = b(),
        o = !1,
        k.promise.then(function() {
          o = !0,
          i(e)
        })
      }
      ,
      this.addMethod = function(a, b) {
        n[a] = b
      }
      ,
      this.removeMethod = function(a) {
        delete n[a]
      }
      ,
      this.destroy = function() {
        g.eventOff("message", j),
        o = !1,
        this.run = function() {
          var a = b();
          return a.reject(),
          a.promise
        }
      }
      ,
      this.ready = function() {
        return o
      }
      ,
      this.run = function(a, c, d) {
        var e = m.length
          , f = b();
        return m.push(f),
        k.promise.then(function() {
          i(a, c, e)
        }),
        d && window.setTimeout(f.reject, d),
        f.promise
      }
      ,
      this.reset(),
      window.self !== window.top && c().postMessage(JSON.stringify({
        scope: p,
        method: e,
        data: {
          forceReply: !0
        }
      }), "*")
    };
    h.utils = g,
    "function" == typeof c && c.amd ? c("lib/postmessagechannel", [], function() {
      return h
    }) : a.postMessageChannel = h
  }(this),
  c("lib/utils", ["lib/postmessagechannel"], function(a) {
    function b(a, b, c) {
      if (null != a)
        if (d && a.forEach === d)
          a.forEach(b, c);
        else if (a.length === +a.length) {
          for (var f = 0, g = a.length; g > f; f++)
            if (b.call(c, a[f], f, a) === e)
              return
        } else
          for (var h in a)
            if (Object.prototype.hasOwnProperty.call(a, h) && b.call(c, a[h], h, a) === e)
              return
    }
    var c = a.utils.promiscuous.deferred
      , d = Array.prototype.forEach
      , e = {};
    return {
      isMobileSafari: /(iPod|iPhone|iPad)/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent),
      checksum: function(a, b, c, d, e) {
        for (b = c = d = 0; e = a.charCodeAt(d++); c = (c + b) % 255)
          b = (b + e) % 255;
        return c << 8 | b
      },
      isArray: function(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
      },
      each: b,
      noop: function() {},
      Deferred: c,
      when: function(a) {
        var d = c()
          , e = a.length;
        return 0 === e ? d.resolve() : b(a, function(a) {
          a.then(function() {
            e--,
            0 === e && d.resolve()
          }, function() {
            d.reject()
          })
        }),
        d.promise
      },
      canonicalUrl: function() {
        var a = (document.querySelectorAll('link[rel="canonical"]')[0] || {}).href;
        return a = a || (document.querySelectorAll('meta[property="og:url"]')[0] || {}).content,
        a || window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search
      },
      anchorize: function(a) {
        var b = document.createElement("a");
        return b.href = a,
        b
      },
      importantStyles: function(a, c) {
        var d = [];
        return b(a || {}, function(a, b) {
          d.push(b + ": " + a + (c ? ";" : " !important;"))
        }),
        d.join(" ")
      },
      getProductUrls: function() {
        var a = []
          , b = function(b) {
          b && -1 === a.indexOf(b) && a.push(b)
        };
        return b(this.canonicalUrl()),
        b(window.location.href),
        b((document.querySelectorAll('meta[property="og:url"]')[0] || {}).content),
        b((document.querySelectorAll('meta[name="twitter:url"]')[0] || {}).content),
        a
      },
      eventOn: a.utils.eventOn,
      eventOff: a.utils.eventOff,
      debounce: function(a, b, c) {
        var d, e, f, g, h, i = function() {
          var j = (new Date).getTime() - g;
          b > j && j > 0 ? d = setTimeout(i, b - j) : (d = null,
          c || (h = a.apply(f, e),
          d || (f = e = null)))
        };
        return function() {
          f = this,
          e = arguments,
          g = (new Date).getTime();
          var j = c && !d;
          return d || (d = setTimeout(i, b)),
          j && (h = a.apply(f, e),
          f = e = null),
          h
        }
      }
    }
  }),
  c("dom", [], function() {
    var a = {}
      , b = /[\t\r\n\f]/g;
    return a.find = function() {
      var a = Array.prototype.slice.call(arguments)
        , b = a.pop()
        , c = a.pop() || document;
      return c.querySelectorAll ? c.querySelectorAll(b) : []
    }
    ,
    a.attr = function() {
      var a = Array.prototype.slice.call(arguments)
        , b = a.shift()
        , c = a.shift();
      return a.length ? void b.setAttribute(c, a.shift()) : b.getAttribute(c)
    }
    ,
    a.remove = function(a) {
      return a && a.parentNode ? (a.parentNode.removeChild(a),
      !0) : !1
    }
    ,
    a.html = function(a, b) {
      return a.innerHTML = b,
      a
    }
    ,
    a.hasClass = function(a, c) {
      var d = (a || {}).className || !1;
      return d && (" " + d + " ").replace(b, " ").indexOf(" " + c + " ") >= 0
    }
    ,
    a
  }),
  c("lib/jsonp", ["lib/utils"], function(a) {
    function b(a) {
      var b = document.getElementsByTagName("script")[0]
        , c = document.createElement("script");
      c.src = a,
      b.parentNode.insertBefore(c, b)
    }
    function c(a) {
      return a ? a + (a.indexOf("?") > 0 ? "&" : "?") : null
    }
    var d = {};
    return function(e) {
      if (d[e])
        return d[e].promise;
      var f = d[e] = a.Deferred()
        , g = "callback" + a.checksum(e);
      return massrel.ui._internal[g] = function(a) {
        f.resolve(a)
      }
      ,
      b(c(e) + "callback=massrel.ui._internal." + g),
      f.promise
    }
  }),
  c("channels", {}),
  c("lib/microevent", ["require"], function(a) {
    var b = function() {};
    return b.prototype = {
      bind: function(a, b) {
        this._events = this._events || {},
        this._events[a] = this._events[a] || [],
        this._events[a].push(b)
      },
      unbind: function(a, b) {
        this._events = this._events || {},
        a in this._events != !1 && this._events[a].splice(this._events[a].indexOf(b), 1)
      },
      trigger: function(a) {
        if (this._events = this._events || {},
        a in this._events != !1)
          for (var b = 0; b < this._events[a].length; b++)
            this._events[a][b].apply(this, Array.prototype.slice.call(arguments, 1))
      }
    },
    b
  }),
  c("events", ["require", "channels", "lib/utils", "lib/microevent"], function(a) {
    var b = a("channels")
      , c = a("lib/utils")
      , d = a("lib/microevent")
      , e = new d;
    return {
      on: function() {
        return e.bind.apply(e, arguments)
      },
      off: function() {
        return e.unbind.apply(e, arguments)
      },
      trigger: function(a, d, f) {
        var g = (a || "").toLowerCase();
        return "self" !== g && g ? (b[g] && b[g].run("spaceEvent", {
          eventName: d,
          data: f
        }),
        void ("*" === g && c.each(b, function(a) {
          a.run("spaceEvent", {
            eventName: d,
            data: f
          })
        }))) : e.trigger(d, f)
      }
    }
  }),
  c("modal", ["require", "dom", "lib/utils", "lib/postmessagechannel", "events"], function(a) {
    function b() {
      c(),
      p = document.createElement("div"),
      p.innerHTML = "loading...",
      h.attr(p, "style", s),
      document.body.appendChild(p)
    }
    function c() {
      h.remove(p) && (p = null)
    }
    function d(a, d) {
      if (d.url) {
        e(),
        b();
        var n = "{}";
        try {
          n = JSON.stringify(d.data || {})
        } catch (p) {}
        var s = i.anchorize(d.url)
          , t = "mr-modal/" + a.slug
          , u = ["parent=" + encodeURIComponent(window.location.host), "space-id=" + encodeURIComponent(t), "frame=" + encodeURIComponent(a.frame), "data=" + encodeURIComponent(n)].concat(a.passThroughData || []);
        a.includeProductUrls && i.each(i.getProductUrls(), function(a) {
          u.push("product-url=" + encodeURIComponent(a))
        });
        var v = encodeURI(d.url) + (s.hash ? s.hash + "&cfg=" : "#cfg=") + encodeURIComponent(u.join("&"));
        f = document.createElement("iframe");
        var w = "mr-modal_" + (new Date).getTime();
        i.each({
          id: w,
          src: 'javascript:""',
          style: o,
          allowtransparency: !0,
          allowFullScreen: !0,
          scrolling: "auto",
          "class": "mr-modal-iframe"
        }, function(a, b) {
          h.attr(f, b, a)
        });
        var x = function() {
          try {
            -1 === f.src.indexOf("javascript:") && (c(),
            f.setAttribute("style", q),
            f.focus(),
            i.eventOff("load", x, f))
          } catch (a) {}
        };
        i.eventOn("load", x, f),
        document.body.appendChild(f),
        r || (m = h.attr(document.body, "style") || " ",
        h.attr(document.body, "style", m + "; overflow: hidden !important;")),
        g = j({
          targetId: w,
          origin: l + "//" + s.host.replace(/(:80|:443)$/, ""),
          id: t,
          methods: {
            "modal:close": e,
            analyticsEventAll: function(a) {
              k.trigger("self", "analytics", a || {})
            }
          }
        }),
        f.src = v
      }
    }
    function e() {
      c(),
      f && (r || h.attr(document.body, "style", m),
      h.remove(f),
      g.destroy(),
      f = g = null)
    }
    var f, g, h = a("dom"), i = a("lib/utils"), j = a("lib/postmessagechannel"), k = a("events"), l = "https:" === window.location.protocol ? "https:" : "http:", m = " ", n = {
      border: 0,
      padding: 0,
      margin: 0,
      position: "fixed",
      "z-index": 9999999999,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      background: "transparent",
      "float": "none",
      outline: 0,
      visibility: "hidden",
      "border-style": "solid",
      "border-bottom-width": "1px",
      "border-color": "rgba(0,0,0,0)"
    }, o = i.importantStyles(n);
    delete n.visibility;
    var p, q = i.importantStyles(n), r = i.isMobileSafari, s = i.importantStyles({
      position: "fixed",
      top: "3px",
      width: "70px",
      left: "50%",
      margin: "0 0 0 -35px",
      padding: "5px",
      color: "#fff",
      border: 0,
      "float": "none",
      "z-index": 9999999,
      background: "rgba(0,0,0,0.8)",
      "border-radius": "5px",
      "font-family": "sans-serif",
      "font-size": "13px",
      "text-align": "center"
    }, !0);
    return {
      open: d,
      close: e
    }
  }),
  c("loader", ["require", "lib/utils", "lib/postmessagechannel", "dom", "lib/jsonp", "channels", "modal", "events"], function(a) {
    function b(a) {
      m[a] && m[a].destroy(),
      delete m[a],
      j.eventOff("scroll", t[a]),
      delete t[a],
      j.eventOff("resize", u[a]),
      delete u[a]
    }
    function c() {
      return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
    }
    function d(a) {
      var b, d = document.body, e = document.documentElement, f = window.pageYOffset || d.scrollTop || e.scrollTop;
      return b = a ? a.clientTop + (a.offsetHeight || a.clientHeight || 0) : Math.max(d.scrollHeight, e.scrollHeight, d.offsetHeight, e.offsetHeight, d.clientHeight, e.clientHeight),
      f + c() >= b
    }
    function e(a) {
      var e = a || {}
        , f = e.identifier || e.id
        , u = e.slug || e.id
        , w = e.el
        , x = e.attributes || {};
      if (x["class"] = (x["class"] || "") + " mr-iframe",
      f && w) {
        var y = "mr-iframe-" + u.replace(/\W/g, "_") + "__" + (new Date).getTime();
        i = i || c();
        var z = ["curl=" + encodeURIComponent(j.canonicalUrl()), "parent=" + encodeURIComponent(window.location.host), "vph=" + i]
          , A = []
          , B = w.attributes["include-product-urls"] && "true" === w.attributes["include-product-urls"].value;
        B && (w.attributes["data-product-url"] && w.attributes["data-product-url"].value || j.each(j.getProductUrls(), function(a) {
          z.push("product-url=" + encodeURIComponent(a))
        })),
        j.each(w.attributes, function(a) {
          var b = a.name;
          if (/^data-/.test(b)) {
            var c = a.value || "";
            if (/"/.test(c))
              throw new Error("element data attribute must not contain quotes.");
            p.test(b) ? x[b.replace(p, "").toLowerCase()] = c : (z.push(b.replace(/^data-/, "") + "=" + encodeURIComponent(c)),
            "space-id" !== b.replace(/^data-/, "") && A.push(b.replace(/^data-/, "") + "=" + encodeURIComponent(c)))
          }
        });
        var C = x.src;
        x.src = "javascript:''",
        x.id = x.name = y,
        b(u);
        var D = [];
        for (var E in x)
          D.push(E + '="' + x[E] + '"');
        l.html(w, "<iframe " + D.join(" ") + "></iframe>");
        var F = l.find(w, ".mr-iframe")[0]
          , G = j.anchorize(C);
        return m[u] = m[u] || k({
          targetId: y,
          origin: q + "//" + G.host.replace(/(:80|:443)$/, ""),
          id: u,
          methods: {
            "modal:open": function(a) {
              n.open({
                slug: u,
                frame: y + (a.frame ? "," + a.frame : ""),
                includeProductUrls: B,
                passThroughData: A
              }, a || {})
            },
            "modal:close": function() {
              n.close()
            },
            "scroll:listen": function(a) {
              return a = a || {},
              a.belowFrame ? (t[u] && j.eventOff("scroll", t[u]),
              t[u] = j.debounce(function() {
                d(F) && o.trigger(u, "scroll:end", {
                  belowFrame: !0
                })
              }, 200),
              void j.eventOn("scroll", t[u])) : (s || (s = !0,
              j.eventOn("scroll", j.debounce(function() {
                d() && j.each(t, function(a, b) {
                  a && b && o.trigger(b, "scroll:end")
                })
              }, 200))),
              void (t[u] = !0))
            },
            event: function(a) {
              a = a || {},
              a.name && o.trigger("self", a.name, a.data || {})
            },
            resize: function(a) {
              if (!a.auto_size) {
                var b = l.find("#" + y)[0];
                if (b)
                  try {
                    var c = b.parentNode
                      , d = l.attr(c, "style") || ""
                      , e = v.style(a);
                    "boolean" == typeof a.scrolling && l.attr(b, "scrolling", a.scrolling ? "auto" : "no"),
                    e !== d && l.attr(c, "style", e),
                    r && l.attr(b, "style", v.initFrame(c))
                  } catch (f) {}
              }
            },
            analyticsEvent: g,
            analyticsEventAll: h
          }
        }),
        F.src = C + "#cfg=" + encodeURIComponent(z.join("&")),
        F
      }
    }
    function f(a, b) {
      var c = {}
        , d = function(a, f) {
        var g = a.getAttribute("data-space-id").toLowerCase()
          , h = g.split("/")
          , i = h.pop()
          , k = h.pop() + ".massrel.io";
        if (f = void 0 === f ? 60 : f,
        b && u[g])
          return void u[g]();
        if (r && f > 0 && a.offsetWidth < 1)
          return void setTimeout(function() {
            d(a, f - 1)
          }, 150);
        if (c[g])
          return void (window.console && window.console.error && console.error("Error: a specific space may only exist on a page once. " + g + " found multiple times."));
        c[g] = !0;
        var m = l.attr(a, "style") || "";
        -1 === m.indexOf(v.initDiv) && (l.attr(a, "style", m + v.initDiv),
        r && l.attr(a, "style", m + v.style({
          height: a.offsetHeight
        })));
        var n = e({
          slug: g,
          identifier: i,
          el: a,
          attributes: {
            src: q + "//" + k + "/" + i + "/index.html",
            style: v.initFrame(a),
            allowtransparency: "true",
            allowFullScreen: "true",
            onmousewheel: "",
            frameborder: 0
          }
        });
        r && (j.eventOff("resize", u[g]),
        u[g] = j.debounce(function() {
          try {
            l.attr(n, "style", v.initFrame(a, 150)),
            setTimeout(function() {
              l.attr(n, "style", v.initFrame(a))
            }, 1e3)
          } catch (b) {}
        }, 200),
        j.eventOn("resize", u[g]))
      };
      l.hasClass(a, "mr-space") ? d(a) : j.each(l.find(a, ".mr-space"), function(a) {
        d(a)
      })
    }
    function g(a) {}
    function h(a) {
      o.trigger("self", "analytics", a || {})
    }
    var i, j = a("lib/utils"), k = a("lib/postmessagechannel"), l = a("dom"), m = (a("lib/jsonp"),
    a("channels")), n = a("modal"), o = a("events"), p = /^data-iframe-/, q = "https:" === window.location.protocol ? "https:" : "http:", r = j.isMobileSafari, s = !1, t = {}, u = {}, v = {
      style: function(a) {
        var b = {
          margin: "0 auto",
          padding: 0,
          border: 0,
          overflow: "hidden",
          height: "100%",
          width: "100%"
        };
        return a = a || {},
        "number" == typeof a.height && (b.height = a.height + "px",
        b["min-height"] = 0),
        "number" == typeof a.width && (b.width = a.width + "px"),
        a.scrolling === !1 && r ? a.ios_scrolling !== !1 && (b.height = "auto",
        b["min-height"] = 0) : (b["-webkit-overflow-scrolling"] = "touch",
        b["overflow-y"] = "auto"),
        j.importantStyles(b)
      },
      initFrame: function(a, b) {
        var c = b ? b + "px" : "";
        return j.importantStyles({
          display: "block",
          width: r ? a.offsetWidth + "px" : "100%",
          height: r ? "auto" : "100%",
          "min-height": c || (r ? a.offsetHeight + "px" : "inherit"),
          "float": "none",
          margin: 0,
          padding: 0,
          background: "transparent",
          overflow: "hidden",
          border: 0,
          outline: 0
        })
      },
      initDiv: "; " + j.importantStyles({
        margin: "0 auto",
        padding: 0,
        border: 0,
        overflow: "hidden"
      })
    };
    return function(a) {
      var b = a || {}
        , c = b.done || j.noop;
      f(b.el, b.resizeOnly),
      c()
    }
  }),
  c("main", ["lib/utils", "loader", "events", "modal"], function(a, b, c, d) {
    function e(a, b) {
      for (var c = b.split("."); a && c.length; )
        a = a[c.shift()];
      return a
    }
    if (window.massrel = window.massrel || {},
    !massrel.ui || a.isArray(massrel.ui)) {
      var f = massrel.ui || []
        , g = massrel.ui = {
        init: b,
        load: b,
        events: c,
        push: function(b) {
          if (!a.isArray(b))
            throw new Error("Invalid massrel API call");
          var c = e(g, b.shift());
          c.apply(g, b)
        },
        _internal: {}
      };
      a.each(f, g.push)
    }
  }),
  b("main")
}();
