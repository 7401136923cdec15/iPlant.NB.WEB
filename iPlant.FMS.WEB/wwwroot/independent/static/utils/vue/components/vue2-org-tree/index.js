
define([],function(){
    return function(e, n){
        return  n().default;
    }(this, function(){
        return function(e){
            function n(o){
                if( t[o] ) return t[o].exports;
                var r = t[o] = { i: o, l: !1, exports: {} };
                return e[o].call(r.exports, r, r.exports, n), r.l = !0, r.exports;
            }

            var t = {};
            return n.m = e, n.c = t, n.d = function(e, t, o){
                n.o(e, t) || Object.defineProperty(e, t, { configurable: !1, enumerable: !0, get: o });
            }, n.n = function(e){
                var t = e && e.__esModule ? function(){
                    return e.default;
                } : function(){
                    return e;
                };
                return n.d(t, 'a', t), t;
            }, n.o = function(e, n){
                return Object.prototype.hasOwnProperty.call(e, n);
            }, n.p = 'dist', n(n.s = 0);
        }([ function(e, n, t){
            'use strict';
            Object.defineProperty(n, '__esModule', { value: !0 });
            var o = t(1);
            n.default = o.a;
        }, function(e, n, t){
            'use strict';

            function o(e){
                o.installed || ( o.installed = !0, e.component(r.a.name, r.a) );
            }

            var r = t(2);
            r.a.install = o, 'undefined' != typeof window && window.Vue && window.Vue.use(r.a), n.a = r.a;
        }, function(e, n, t){
            'use strict';

            function o(e){
                t(3);
            }

            var r = t(5), a = t(7), s = t(4), i = o, l = s(r.a, a.a, !1, i, null, null);
            n.a = l.exports;
        }, function(e, n){
        }, function(e, n){
            e.exports = function(e, n, t, o, r, a){
                var s, i = e = e || {}, l = typeof e.default;
                'object' !== l && 'function' !== l || ( s = e, i = e.default );
                var u = 'function' == typeof i ? i.options : i;
                n && ( u.render = n.render, u.staticRenderFns = n.staticRenderFns, u._compiled = !0 ), t && ( u.functional = !0 ), r && ( u._scopeId = r );
                var c;
                if( a ? ( c = function(e){
                    e = e || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext, e || 'undefined' == typeof __VUE_SSR_CONTEXT__ || ( e = __VUE_SSR_CONTEXT__ ), o && o.call(this, e), e && e._registeredComponents && e._registeredComponents.add(a);
                }, u._ssrRegister = c ) : o && ( c = o ), c ){
                    var d = u.functional, p = d ? u.render : u.beforeCreate;
                    d ? ( u._injectStyles = c, u.render = function(e, n){
                        return c.call(n), p(e, n);
                    } ) : u.beforeCreate = p ? [].concat(p, c) : [ c ];
                }
                return { esModule: s, exports: i, options: u };
            };
        }, function(e, n, t){
            'use strict';
            var o = t(6);
            n.a = {
                name: 'Vue2OrgTree',
                components: { OrgTreeNode: { render: o.a, functional: !0 } },
                props: {
                    data: { type: Object, required: !0 },
                    props: {
                        type: Object, default: function(){
                            return { label: 'label', expand: 'expand', children: 'children' };
                        },
                    },
                    horizontal: Boolean,
                    selectedKey: String,
                    collapsable: Boolean,
                    renderContent: Function,
                    labelWidth: [ String, Number ],
                    labelClassName: [ Function, String ],
                    selectedClassName: [ Function, String ],
                },
            };
        }, function(e, n, t){
            'use strict';

            function o(e, n){
                var t = function(e, n){
                    for( var t = arguments.length, o = Array(t > 2 ? t - 2 : 0), r = 2; r < t; r++ ) o[r - 2] = arguments[r];
                    if( 'function' == typeof e ){
                        var a = n.target && n.target.className;
                        if( 'string' == typeof a && a.indexOf('org-tree-node-btn') > -1 ) return;
                        e.apply(null, [ n ].concat(o));
                    }
                };
                return function(o){
                    if( Array.isArray(e) ){
                        var r = !0, a = !1, s = void 0;
                        try{
                            for( var i, l = e[Symbol.iterator](); !( r = ( i = l.next() ).done ); r = !0 ){
                                var u = i.value;
                                t(u, o, n);
                            }
                        } catch( e ){
                            a = !0, s = e;
                        } finally{
                            try{
                                !r && l.return && l.return();
                            } finally{
                                if( a ) throw s;
                            }
                        }
                    } else t(e, o, n);
                };
            }

            function r(e, n, t){
                var o = t.props, r = [ 'org-tree-node' ], a = [], l = n[o.props.children];
                return c(n, o.props.children) ? r.push('is-leaf') : o.collapsable && !n[o.props.expand] && r.push('collapsed'), a.push(s(e, n, t)), o.collapsable && !n[o.props.expand] || a.push(i(e, l, t)), e('div', { domProps: { className: r.join(' ') } }, a);
            }

            function a(e, n, t){
                var o = t.props, r = t.listeners, a = r['on-expand'], s = [ 'org-tree-node-btn' ];
                return n[o.props.expand] && s.push('expanded'), e('span', {
                    domProps: { className: s.join(' ') },
                    on: {
                        click: function(e){
                            return a && a(e, n);
                        },
                    },
                });
            }

            function s(e, n, t){
                var r = t.props, s = t.listeners, i = n[r.props.label], l = r.renderContent, d = s[u.CLICK],
                    p = s[u.MOUSEOUT], f = s[u.MOUSEOVER], m = [];
                if( 'function' == typeof l ){
                    var v = l(e, n);
                    v && m.push(v);
                } else m.push(i);
                r.collapsable && !c(n, r.props.children) && m.push(a(e, n, t));
                var h = [ 'org-tree-node-label-inner' ], b = r.labelWidth, y = r.labelClassName, g = r.selectedClassName,
                    x = r.selectedKey;
                return 'number' == typeof b && ( b += 'px' ), 'function' == typeof y && ( y = y(n) ), y && h.push(y), 'function' == typeof g && ( g = g(n) ), g && x && n[x] && h.push(g), e('div', { domProps: { className: 'org-tree-node-label' } }, [ e('div', {
                    domProps: { className: h.join(' ') },
                    style: { width: b },
                    on: { click: o(d, n), mouseout: o(p, n), mouseover: o(f, n) },
                }, m) ]);
            }

            function i(e, n, t){
                if( Array.isArray(n) && n.length ){
                    var o = n.map(function(n){
                        return r(e, n, t);
                    });
                    return e('div', { domProps: { className: 'org-tree-node-children' } }, o);
                }
                return '';
            }

            function l(e, n){
                return r(e, n.props.data, n);
            }

            var u = { CLICK: 'on-node-click', MOUSEOUT: 'on-node-mouseout', MOUSEOVER: 'on-node-mouseover' },
                c = function(e, n){
                    return !( Array.isArray(e[n]) && e[n].length > 0 );
                };
            n.a = l;
        }, function(e, n, t){
            'use strict';
            var o = function(){
                var e = this, n = e.$createElement, t = e._self._c || n;
                return t('div', { staticClass: 'org-tree-container' }, [ t('div', {
                    staticClass: 'org-tree',
                    class: { horizontal: e.horizontal, collapsable: e.collapsable },
                }, [ t('org-tree-node', {
                    attrs: {
                        data: e.data,
                        props: e.props,
                        horizontal: e.horizontal,
                        'label-width': e.labelWidth,
                        collapsable: e.collapsable,
                        'render-content': e.renderContent,
                        'label-class-name': e.labelClassName,
                        'selected-class-name': e.selectedClassName,
                        'selected-key': e.selectedKey,
                    }, on: {
                        'on-expand': function(n, t){
                            return e.$emit('on-expand', n, t);
                        }, 'on-node-focus': function(n, t){
                            return e.$emit('on-node-focus', n, t);
                        }, 'on-node-click': function(n, t){
                            return e.$emit('on-node-click', n, t);
                        }, 'on-node-mouseover': function(n, t){
                            return e.$emit('on-node-mouseover', n, t);
                        }, 'on-node-mouseout': function(n, t){
                            return e.$emit('on-node-mouseout', n, t);
                        },
                    },
                }) ], 1) ]);
            }, r = [], a = { render: o, staticRenderFns: r };
            n.a = a;
        } ]);
    });
});
