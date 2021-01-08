!(function () {
   'use strict';
   function e() {}
   function t(e) {
      return e();
   }
   function n() {
      return Object.create(null);
   }
   function o(e) {
      e.forEach(t);
   }
   function l(e) {
      return 'function' == typeof e;
   }
   function r(e, t) {
      return e != e ? t == t : e !== t || (e && 'object' == typeof e) || 'function' == typeof e;
   }
   function s(e) {
      return 0 === Object.keys(e).length;
   }
   function a(e) {
      e.parentNode.removeChild(e);
   }
   function c(e) {
      return document.createElement(e);
   }
   let i;
   function d(e) {
      i = e;
   }
   new Set(), new Set();
   const u = [],
      f = [],
      h = [],
      b = [],
      p = Promise.resolve();
   let $ = !1;
   function g(e) {
      h.push(e);
   }
   let m = !1;
   const y = new Set();
   function k() {
      if (!m) {
         m = !0;
         do {
            for (let e = 0; e < u.length; e += 1) {
               const t = u[e];
               d(t), v(t.$$);
            }
            for (d(null), u.length = 0; f.length; ) f.pop()();
            for (let e = 0; e < h.length; e += 1) {
               const t = h[e];
               y.has(t) || (y.add(t), t());
            }
            h.length = 0;
         } while (u.length);
         for (; b.length; ) b.pop()();
         ($ = !1), (m = !1), y.clear();
      }
   }
   function v(e) {
      if (null !== e.fragment) {
         e.update(), o(e.before_update);
         const t = e.dirty;
         (e.dirty = [-1]), e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(g);
      }
   }
   const _ = new Set();
   let w;
   function x(e, t) {
      e && e.i && (_.delete(e), e.i(t));
   }
   function E(e, n, r) {
      const { fragment: s, on_mount: a, on_destroy: c, after_update: i } = e.$$;
      s && s.m(n, r),
         g(() => {
            const n = a.map(t).filter(l);
            c ? c.push(...n) : o(n), (e.$$.on_mount = []);
         }),
         i.forEach(g);
   }
   function C(e, t) {
      const n = e.$$;
      null !== n.fragment && (o(n.on_destroy), n.fragment && n.fragment.d(t), (n.on_destroy = n.fragment = null), (n.ctx = []));
   }
   function S(t, l, r, s, c, f, h = [-1]) {
      const b = i;
      d(t);
      const g = l.props || {},
         m = (t.$$ = {
            fragment: null,
            ctx: null,
            props: f,
            update: e,
            not_equal: c,
            bound: n(),
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(b ? b.$$.context : []),
            callbacks: n(),
            dirty: h,
            skip_bound: !1,
         });
      let y = !1;
      if (
         ((m.ctx = r
            ? r(t, g, (e, n, ...o) => {
                 const l = o.length ? o[0] : n;
                 return (
                    m.ctx &&
                       c(m.ctx[e], (m.ctx[e] = l)) &&
                       (!m.skip_bound && m.bound[e] && m.bound[e](l),
                       y &&
                          (function (e, t) {
                             -1 === e.$$.dirty[0] && (u.push(e), $ || (($ = !0), p.then(k)), e.$$.dirty.fill(0)), (e.$$.dirty[(t / 31) | 0] |= 1 << t % 31);
                          })(t, e)),
                    n
                 );
              })
            : []),
         m.update(),
         (y = !0),
         o(m.before_update),
         (m.fragment = !!s && s(m.ctx)),
         l.target)
      ) {
         if (l.hydrate) {
            const e = ((v = l.target), Array.from(v.childNodes));
            m.fragment && m.fragment.l(e), e.forEach(a);
         } else m.fragment && m.fragment.c();
         l.intro && x(t.$$.fragment), E(t, l.target, l.anchor), k();
      }
      var v;
      d(b);
   }
   'undefined' != typeof window ? window : 'undefined' != typeof globalThis ? globalThis : global,
      new Set([
         'allowfullscreen',
         'allowpaymentrequest',
         'async',
         'autofocus',
         'autoplay',
         'checked',
         'controls',
         'default',
         'defer',
         'disabled',
         'formnovalidate',
         'hidden',
         'ismap',
         'loop',
         'multiple',
         'muted',
         'nomodule',
         'novalidate',
         'open',
         'playsinline',
         'readonly',
         'required',
         'reversed',
         'selected',
      ]),
      'function' == typeof HTMLElement &&
         (w = class extends (
            HTMLElement
         ) {
            constructor() {
               super(), this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
               for (const e in this.$$.slotted) this.appendChild(this.$$.slotted[e]);
            }
            attributeChangedCallback(e, t, n) {
               this[e] = n;
            }
            $destroy() {
               C(this, 1), (this.$destroy = e);
            }
            $on(e, t) {
               const n = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
               return (
                  n.push(t),
                  () => {
                     const e = n.indexOf(t);
                     -1 !== e && n.splice(e, 1);
                  }
               );
            }
            $set(e) {
               this.$$set && !s(e) && ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1));
            }
         });
   class T {
      $destroy() {
         C(this, 1), (this.$destroy = e);
      }
      $on(e, t) {
         const n = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
         return (
            n.push(t),
            () => {
               const e = n.indexOf(t);
               -1 !== e && n.splice(e, 1);
            }
         );
      }
      $set(e) {
         this.$$set && !s(e) && ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1));
      }
   }
   function A(t) {
      let n;
      return {
         c() {
            var e, t, o;
            (n = c('header')),
               (n.innerHTML = 'Hollister-Whitney Engineering Calculations\n  <div class="ding svelte-1e9bb7k">this is</div>'),
               (e = n),
               (t = 'class'),
               null == (o = 'svelte-1e9bb7k') ? e.removeAttribute(t) : e.getAttribute(t) !== o && e.setAttribute(t, o);
         },
         m(e, t) {
            !(function (e, t, n) {
               e.insertBefore(t, n || null);
            })(e, n, t);
         },
         p: e,
         i: e,
         o: e,
         d(e) {
            e && a(n);
         },
      };
   }
   var H = class extends T {
      constructor(e) {
         var t, n, o;
         super(),
            document.getElementById('svelte-1e9bb7k-style') ||
               (((t = c('style')).id = 'svelte-1e9bb7k-style'),
               (t.textContent =
                  'header.svelte-1e9bb7k.svelte-1e9bb7k{height:60px;background-color:blue;font-variant:small-caps}header.svelte-1e9bb7k .ding.svelte-1e9bb7k{color:red}header.svelte-1e9bb7k .svelte-1e9bb7k::-webkit-input-placeholder{color:gray}header.svelte-1e9bb7k .svelte-1e9bb7k::-moz-placeholder{color:gray}header.svelte-1e9bb7k .svelte-1e9bb7k:-ms-input-placeholder{color:gray}header.svelte-1e9bb7k .svelte-1e9bb7k::-ms-input-placeholder{color:gray}header.svelte-1e9bb7k .svelte-1e9bb7k::placeholder{color:gray}'),
               (n = document.head),
               (o = t),
               n.appendChild(o)),
            S(this, e, null, A, r, {});
      }
   };
   function M(t) {
      let n, o;
      return (
         (n = new H({})),
         {
            c() {
               var e;
               (e = n.$$.fragment) && e.c();
            },
            m(e, t) {
               E(n, e, t), (o = !0);
            },
            p: e,
            i(e) {
               o || (x(n.$$.fragment, e), (o = !0));
            },
            o(e) {
               (function (e, t, n, o) {
                  if (e && e.o) {
                     if (_.has(e)) return;
                     _.add(e),
                        (void 0).c.push(() => {
                           _.delete(e), o && (n && e.d(1), o());
                        }),
                        e.o(t);
                  }
               })(n.$$.fragment, e),
                  (o = !1);
            },
            d(e) {
               C(n, e);
            },
         }
      );
   }
   new (class extends T {
      constructor(e) {
         super(), S(this, e, null, M, r, {});
      }
   })({ target: document.body });
})();
