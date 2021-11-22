define(["../jquery-3.1.1", "./appTools"], function ($yang) {

    'use strict';
    (function () {

        window._shift_id = 0;
        window._person_judge = 0;
        window._eventID = 0;

        if (window.JSImpl) {
            var _shift_id = window.JSImpl.getShift();

            var _person_judge = window.JSImpl.getPersonjudge();

            var _event_id = window.JSImpl.getModuleID()

            if (!isNaN(_shift_id))
                window._shift_id = Number(_shift_id);

            if (!isNaN(_person_judge))
                window._person_judge = Number(_person_judge);

            if (!isNaN(_event_id))
                window._eventID = Number(_event_id);
        }

        window.alert = function (msg, callback, _title) {
            app.loaded();

            if (msg && msg.length > 200) {
                msg = msg.substr(0, 197) + "...";
            }

            var div_old = document.getElementById("femi-alert-div");
            var div;
            if (div_old) {
                div = div_old;
            } else {
                div = document.createElement("div");
                div.innerHTML = "<style type='text/css'>"
					+ ".nbaMask { position: fixed; z-index: 9998; top: 0; right: 0; left: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); }                                                                                                                                                                       "
					+ ".nbaMaskTransparent { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; }                                                                                                                                                                                            "
					+ ".nbaDialog { position: fixed; z-index: 9999; width: 80%; max-width: 300px; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background-color: #fff; text-align: center; border-radius: 8px; overflow: hidden; opacity: 1; color: white; }"
					+ ".nbaDialog .nbaDialogHd { padding: 8px 15px  ; }                                                                                                                                                                                                                         "
					+ ".nbaDialog .nbaDialogHd .nbaDialogTitle { font-size: 17px; font-weight: 400; color:#CD853F}                                                                                                                                                                                                           "
					+ ".nbaDialog .nbaDialogBd { padding: 10px .27rem; font-size: 15px; line-height: 1.3; word-wrap: break-word; word-break: break-all; color:#808080;height:auto; }                                                                                                                                          "
					+ ".nbaDialog .nbaDialogFt { position: relative; line-height: 48px; font-size: 17px; display: -webkit-box; display: -webkit-flex; display: flex; }                                                                                                                                          "
					+ ".nbaDialog .nbaDialogFt:after { content: ' '; position: absolute; left: 0; top: 0; right: 0; height: 1px; border-top: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleY(0.5); transform: scaleY(0.5); }               "
					+ ".nbaDialog .nbaDialogBtn {font-weight: bold; display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1; color: #2F4F4F	; text-decoration: none; -webkit-tap-highlight-color: transparent; position: relative; margin-bottom: 0; }                                                                       "
					+ ".nbaDialog .nbaDialogBtn:after { content: ' '; " +
					"position: absolute; left: 0; top: 0; width: 1px; bottom: 0;" +
					"border-left: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0;" +
					" transform-origin: 0 0; -webkit-transform: scaleX(0.5);" +
					" transform: scaleX(0.5); }             "
					+ ".nbaDialog a { text-decoration: none; -webkit-tap-highlight-color: transparent; }"
					+ "</style>"
					+ "<div id='dialogs2' style='display: none'>"
					+ "<div class='nbaMask'></div>"
					+ "<div class='nbaDialog'>"
					+ " <div class='nbaDialogHd'>"
					+ "     <strong class='nbaDialogTitle'  >提示</strong>"
					+ " </div>"
					+ " <div class='nbaDialogBd' id='dialog_msg2'>弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div>"
					/*+ " <div class='nbaDialogHd'>"
					+ "     <strong class='nbaDialogTitle' style='color:#2F4F4F'></strong>"
					+ " </div>"*/
					+ " <div class='nbaDialogFt'>"
					+ "     <a href='javascript:;' class='nbaDialogBtn nbaDialogBtnPrimary' id='dialog_ok2'>确定</a>"
					+ " </div>"
					+ "</div>"
					+ "</div>";
                document.body.appendChild(div);
                div.setAttribute("id", "femi-alert-div");
            }

            var dialogs2 = document.getElementById("dialogs2");
            dialogs2.style.display = 'block';

            var dialog_msg2 = document.getElementById("dialog_msg2");
            dialog_msg2.innerHTML = msg;
            if (_title) {
                var nbaDialogTitle = document.getElementById("nbaDialogTitle");
                nbaDialogTitle.innerHTML = _title;
            }

            var dialog_ok2 = document.getElementById("dialog_ok2");
            dialog_ok2.onclick = function () {



                div.parentNode.removeChild(div);
                if (callback)
                    callback();
            };
        };


        window.confirm = function (msg, callback, _title) {
            app.loaded();

            if (msg && msg.length > 200) {
                msg = msg.substr(0, 197) + "...";
            }

            var div_old = document.getElementById("femi-alert-div");
            var div;
            if (div_old) {
                div = div_old;
            } else {
                div = document.createElement("div");
                div.innerHTML = "<style type='text/css'>"
					+ ".nbaMask { position: fixed; z-index: 9998; top: 0; right: 0; left: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); }                                                                                                                                                                       "
					+ ".nbaMaskTransparent { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; }                                                                                                                                                                                            "
					+ ".nbaDialog { position: fixed; z-index: 9999; width: 80%; max-width: 300px; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background-color: #fff; text-align: center; border-radius: 8px; overflow: hidden; opacity: 1; color: white; }"
					+ ".nbaDialog .nbaDialogHd { padding: 8px 15px  ; }                                                                                                                                                                                                                         "
					+ ".nbaDialog .nbaDialogHd .nbaDialogTitle { font-size: 17px; font-weight: 400; color:#CD853F}                                                                                                                                                                                                           "
					+ ".nbaDialog .nbaDialogBd { padding: 10px .27rem; font-size: 15px; line-height: 1.3; word-wrap: break-word; word-break: break-all; color:#808080;height:auto; }                                                                                                                                          "
					+ ".nbaDialog .nbaDialogFt { position: relative; line-height: 48px; font-size: 17px; display: -webkit-box; display: -webkit-flex; display: flex; }                                                                                                                                          "
					+ ".nbaDialog .nbaDialogFt:after { content: ' '; position: absolute; left: 0; top: 0; right: 0; height: 1px; border-top: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleY(0.5); transform: scaleY(0.5); }               "
					+ ".nbaDialog .nbaDialogBtn {font-weight: bold; display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1; color: #2F4F4F	; text-decoration: none; -webkit-tap-highlight-color: transparent; position: relative; margin-bottom: 0; }                                                                       "
					+ ".nbaDialog .nbaDialogBtn:after { content: ' '; " +
					"position: absolute; left: 0; top: 0; width: 1px; bottom: 0;" +
					"border-left: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0;" +
					" transform-origin: 0 0; -webkit-transform: scaleX(0.5);" +
					" transform: scaleX(0.5); }             "
					+ ".nbaDialog a { text-decoration: none; -webkit-tap-highlight-color: transparent; }"
					+ "</style>"
					+ "<div id='dialogs2' style='display: none'>"
					+ "<div class='nbaMask'></div>"
					+ "<div class='nbaDialog'>"
					+ " <div class='nbaDialogHd'>"
					+ "     <strong class='nbaDialogTitle'  >询问</strong>"
					+ " </div>"
					+ " <div class='nbaDialogBd' id='dialog_msg2'>弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div>"
					/*+ " <div class='nbaDialogHd'>"
					+ "     <strong class='nbaDialogTitle' style='color:#2F4F4F'></strong>"
					+ " </div>"*/
					+ " <div class='nbaDialogFt'>"
                    + "     <a href='javascript:;' class='nbaDialogBtn nbaDialogBtnPrimary' id='dialog_ok1'>取消</a>"
					+ "     <a href='javascript:;' class='nbaDialogBtn nbaDialogBtnPrimary' id='dialog_ok2'>确定</a>"
					+ " </div>"
					+ "</div>"
					+ "</div>";
                document.body.appendChild(div);
                div.setAttribute("id", "femi-alert-div");
            }

            var dialogs2 = document.getElementById("dialogs2");
            dialogs2.style.display = 'block';

            var dialog_msg2 = document.getElementById("dialog_msg2");
            dialog_msg2.innerHTML = msg;
            if (_title) {
                var nbaDialogTitle = document.getElementById("nbaDialogTitle");
                nbaDialogTitle.innerHTML = _title;
            }

            var dialog_ok2 = document.getElementById("dialog_ok2");
            dialog_ok2.onclick = function () {

                div.parentNode.removeChild(div);
                if (callback)
                    callback(true);
            };
            var dialog_ok1 = document.getElementById("dialog_ok1");
            dialog_ok1.onclick = function () {

                div.parentNode.removeChild(div);
                if (callback)
                    callback(false);
            };
        };


        window.femi_click = function () {
            location.reload(true);
        }

        $("body").delegate(".femi-full-screen-img", "click", function () {
            $(this).remove();
        });
        //模糊搜索框关闭
        $("body").delegate(".femi-search-fuzzy .femi-search-close", "click", function () {
            var $this = $(this),
                $fuzzy = $this.closest(".femi-search-fuzzy"),
                $fuzzyInput = $fuzzy.find("input.femi-search-content");

            $fuzzyInput.val("").trigger("input");

            if ($fuzzy[0])
                $fuzzy.hide();
        });
        //模糊搜索框显示
        $("body").delegate(".femi-search-fuzzy-toggle[target-toggle]", "click", function () {

            var $this = $(this),
                targetValue = $this.attr("target-toggle"),
                $target = $(".femi-search-fuzzy[target-toggle=" + targetValue + "]");

            if ($target[0])
                $target.show();

        });

        $("body").delegate(".femi-search-fuzzy[target-toggle] input.femi-search-content", "input", function () {
            var $this = $(this),
                $fuzzy = $this.closest(".femi-search-fuzzy"),
                value = $this.val();
            if (value && value.length > 0) {
                $fuzzy.find(".femi-search-right").show();
            } else {
                $fuzzy.find(".femi-search-right").hide();
            }

        });

        //普通模糊搜索框改变事件
        $("body").delegate(".com-collapse input.femi-select-input", "change", function () {
            var $this = $(this),
                value = $this.val();
            $this.parent().nextAll(".w-select").each(function (i, item) {
                var $item = $(item),
                    $uncheckedAll = $item.find("ul.w-select-list .m-checkbox-box input:not(input:checked)");

                $item.show();

                $uncheckedAll.each(function (s_i, s_item) {

                    var name = $(s_item).attr("data-name");

                    if (name.indexOf(value) < 0) {
                        $(s_item).closest("li").hide();
                    } else {
                        $(s_item).closest("li").show();
                    }

                });

                if (!$item.find("ul.w-select-list li:visible")[0]) {
                    $item.hide();
                }
            });
        });

        $("body").delegate(".femi-search-fuzzy[target-toggle] .femi-search-right", "click", function () {
            var $this = $(this),
                $fuzzy = $this.closest(".femi-search-fuzzy"),
                $input = $fuzzy.find("input.femi-search-content");

            $input.val("").trigger("input");

            $this.hide();
        });

        $("body").click(function (e) {
            var $contain = $(e.target).closest(".femi-dropdown-contain");
            if ($contain[0])
                return;

            $(".femi-dropdown-contain").hide();
        });

        $("body").delegate(".femi-dropdown-toggle", "click", function () {
            var $this = $(this),
                $contain = $this.next(".femi-dropdown-contain");
            if ($contain[0]) {
                if ($contain.is(':visible')) {
                    $contain.hide();
                } else {
                    $contain.show();

                }
                return false;
            }
        });
        $("body").delegate(".femi-dropdown-contain .femi-dropdown-ul li:not(.femi-separator)", "click", function () {
            $(".femi-dropdown-contain").hide();
        });

        var timeOutEvent = 0;
        $("body").delegate(".upload-list .upload-img img", "touchstart", function (e) {
            timeOutEvent = setTimeout("longPress('" + $(this).attr("data-id") + "')", 600);
            e.preventDefault();
        }).
            delegate(".upload-list .upload-img img", "touchmove", function (e) {
                clearTimeout(timeOutEvent);
                timeOutEvent = 0;
            }).
            delegate(".upload-list .upload-img img", "touchend", function (e) {
                clearTimeout(timeOutEvent);
                if (timeOutEvent != 0) {
                    imgUtil.fullImg($(this).attr("src"));
                }
                return false;
            });

        window.longPress = function (url) {
            timeOutEvent = 0;

            $(".upload-list .upload-img img").each(function () {

                if (url != $(this).attr("data-id"))
                    return true;
                var $img = $(this);
                if (confirm("是否要删除此图片？")) {
                    $img.parent().remove();
                }
                return false;
            });

        }

    })();

    var serviceCon = {
        url: '/api',
        loginUrl: '/api/HomePage/Index',
    };

    var global = {
        version: "v0.1.0",
        timeout: 20000
    };

    var cookie = {
        set: function (name, val, days) {
            var times = new Date(),
				expires = ";expires=";

            if (days) {
                times.setTime(times.getTime() + (60000 * 60 * 24 * days));
                expires += times.toGMTString();
            } else {
                expires += "";
            }

            document.cookie = name + "=" + val + expires;
        },

        //delete cookie
        del: function (name) {
            document.cookie = name + "=;expires=" + (new Date(0)).toGMTString() + "; path=/";
        },

        //get cookie
        get: function (name) {
            var arrCookie = document.cookie.split(";");
            for (var i = 0; i < arrCookie.length; i++) {
                var arr = arrCookie[i].replace(/(^\s+)|(\s+$)/g, "");
                arr = arr.split("=");
                if (arr[0] == name) {
                    return arr.slice(1).join("=");
                }
            }
            return "";
        }
    };

    var math = {
        round: function (num, pow) {
            var BASE = Math.pow(10, pow || 4);
            return Math.round(num * BASE) / BASE;
        }
    }
    var app = {
        timeRule: function (time, now) {
            var date = now || (new Date()).getTime(),
				dif = date - time,
				t = "";
            console.log(dif);
            if (dif < 60000) {
                t = "1分钟前";
            } else if (dif < 60000 * 60) {
                t = Math.floor(dif / 60000) + "分钟前";
            } else if (dif < 60000 * 60 * 24) {
                t = Math.floor(dif / (60000 * 60)) + "小时前";
            } else if (dif < 60000 * 60 * 24 * 2) {
                t = "昨天";
            } else {
                t = util.format("MM-dd hh:mm", time);
            }

            return t;
        },

        percentColor: function (num) {
            var color = "#000";
            if (num < 33.3) {
                color = "#ea0909";
            } else if (num < 66.6) {
                color = "#ea9809";
            } else {
                color = "#77ac19";
            }

            return "<em style='font-style:normal;color:" + color + "'>" + num + "%</em>";
        },



        // code process
        processCode: function (code, msg) {

            var codeSet = {
                9999: '服务器繁忙,请稍后再试',
                9998: "您还没登录",
                9997: "已有账号登录，请将已登录账号退出或关闭浏览器后再试！",
                9996: "添加失败",
                9995: "配置参数不合法",
                9994: "您没有权限！",
                1001: "请输入账号",
                1002: "请输入密码",
                1003: "当前权限等级不够，无法操作",
                1004: "密码不合法",
                1005: "账号或密码错误",
                1006: "密码修改失败",
                1007: "无效账号",
                1008: "账号删除失败",
                1009: "无法删除登录账号",
                1010: "账号信息更新失败",
                2001: "请输入账号",
                2002: "请输入密码",
                2003: "请选择管理权限",
                2004: "账号添加失败",
                2005: "该账号已经存在",
                2006: "账号信息更新失败",
                2007: "账号信息查询失败",
                5001: "请输入服务名称",
                5002: "请输入版本号",
                5003: "服务删除失败",
                6001: "请输入IP地址",
                6002: "请输入密码",
                6003: "Conserver删除失败",
                7001: "请给架构起个可爱的名字",
                7002: "请选择架构类型",
                7003: "架构删除失败，请重试",
                7004: "架构启用失败",
                7005: "架构停用失败",
                7006: "同时只能启用一个架构，如要启用该架构请先停止其他在用架构",
                7007: "请先停止再进行删除操作",
                8008: "请添加服务器",
                8010: "监控出错",
                9001: "组删除失败",
                4047: "该帐号已在别处登录，3秒后将自动退出"
            };

            switch (code) {
                case 9998:
                    app.removeInfo();

                    if (window.exit)
                        window.exit();
                    else
                        app.tip(msg || codeSet[code] || code + '未知错误类型，请补充！');
                    /*window.location.href = serviceCon.loginUrl;
                    if (parent.document.getElementsByName("iframeContain")[0])
                        parent.location.href = serviceCon.loginUrl;
                    else
                        location.href = serviceCon.loginUrl;
                    break;
        */
                default:
                    app.tip(msg || codeSet[code] || code + '未知错误类型，请补充！');
            }
        },

        tip: function (content, fn) {
            alert(content);
            fn && fn();
        },

        /**
		 * 高亮 就是字体变红色？？？
		 */
        highlight: function (val, temp) {

            temp = temp || '';
            if (val !== '' && val != null && val != undefined) {
                temp = temp.replace(new RegExp(val, 'g'), function () {
                    return "<span style='color:red;'>" + val + "</span>";
                });
            }

            return temp;
        },

        /**
		 * 得重写这个load等待函数 用动画
		 */
        loading: function (content) {

            var _html = [
				'<div  class="femi-modal femi-loading"  >',
				'<div></div>',
				'<p>{{content}}</p>',
				'</div>',
				'<div class="femi-modal-backdrop in femi-loading"  ></div>'
            ].join('');

            if ($('.femi-loading').length > 0) {
                $('.femi-loading').remove();
            }
            $('body').append(util.template({
                content: content || 'loading...'
            }, _html));

        },
        loaded: function () {
            if ($('.femi-loading').length > 0) {
                $('.femi-loading').remove();
            }
        },

        ajax: function (data, fn, err, context) {
            var suc,
				fail,
				__EMPTY = function () { },
				_ajax,
				URI,
				TYPE;
            if (arguments.length < 4) {
                context = err;
                err = __EMPTY;
            }
            if (util.isArray(fn)) {
                suc = fn[0];
                fail = fn[1] || __EMPTY;
            } else {
                suc = fn;
                fail = __EMPTY;
            }

            URI = data.$URI || "";
            TYPE = data.$TYPE || 'get';
            delete data.$URI;
            delete data.$TYPE;

            _ajax = $.ajax({
                url: serviceCon.url + URI,
                type: TYPE,
                contentType: 'application/json;charset=utf-8',
                data: TYPE.toLowerCase() === "get" ? data : util.stringify(data),
                dataType: 'JSON',
                timeout: global.timeout
            });

            _ajax.then(function (res) {
                if (res.resultCode === 1000) {
                    suc && suc.call(context || null, res.returnObject);
                } else {
                    app.processCode(res.resultCode, res.returnObject.msg || "");
                    fail && fail.call(context || null, res.returnObject);
                }
            }, err);

            return _ajax;
        },

        setImage: function (node, url) {
            var limitWidth = 225,
				limitHeight = 150;
            /* 2013-1-10 TD BUG 301 修改 */
            function getImgSize(config) {
                var lWidth = config.limitWidth || limitWidth,
					lHeight = config.limitHeight || limitHeight,
					rWidth = width = config.width,
					rHeight = height = config.height,
					scale;

                // lh 150 lw 225 h503 w333
                if ((height > width) || (height == width && lHeight > lWidth)) {
                    scale = lHeight / height;
                    if (scale < 1) {
                        rHeight = lHeight;
                        rWidth = scale * width;
                    }
                } else if ((height < width) || (height == width && lHeight <= lWidth)) {
                    scale = lWidth / width;
                    if (scale < 1) {
                        rHeight = scale * height;
                        rWidth = lWidth;
                    }
                }
                return {
                    width: rWidth,
                    height: rHeight
                };
            }

            (function (fileUrl) {
                var notIe = $.browser.msie,
					size,
					imgWidth,
					imgHeight,
					imgs = new Image();
                imgs.src = fileUrl + '?' + Math.random();
                imgs.onload = imgs.onreadystatechange = function () {
                    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                        var img = document.createElement("img");
                        $(img).attr("src", fileUrl);
                        node.html(img);
                        imgWidth = this.width;
                        imgHeight = this.height;
                        size = getImgSize({
                            width: imgWidth,
                            height: imgHeight
                        });
                        img.width = size.width;
                        img.height = size.height;
                    }
                };
            }(url));
        },

        removeInfo: function () {
            cookie.del('__k_user_id_');
            cookie.del('__k_company_id_');
            cookie.del('__k_user_name_');
        },

        /**
		 * 将滚动条移动到num处  只上移不下移 
		 */
        scrollTop: function (num) {
            var cTop = $(document).scrollTop();

            if (cTop > num) {
                $(document).scrollTop(num);
            }
        },
    };


    var util = (function () {
        var AP = Array.prototype,
			OP = Object.prototype,
			APS = Array.prototype.slice;

        //空方法
        function _EMPTY() {
        }

        //反柯理化
        Function.prototype.uncurring = function () {
            var __this = this;
            return function () {
                return Function.prototype.call.apply(__this, arguments);
            };
        };

        function each(data, fn) {
            var cb = fn || function () { };
            if (data.length) {
                for (var i = 0, len = data.length; i < len; i++) {
                    if (cb(data[i], i, data) === false) {
                        return false;
                    }
                }
            } else {

                var i = 0;
                for (var obj in data) {
                    var item = {
                        Key: obj,
                        Value: data[obj]
                    };
                    if (cb(item, i, data) === false) {
                        return false;
                    }
                    i++;
                }
            }

        }

        function assign(o1, o2) {
            for (var k in o2) {
                if (o2.hasOwnProperty(k)) {
                    o1[k] = o2[k];
                }
            }
            return o1;
        }

        var typeStr = OP.toString.uncurring(),
			util = {};

        each("Array,Object,String,Function,Date,RegExp,Boolean,Number".split(","), function (type) {
            util['is' + type] = function (s) {
                return typeStr(s) === '[object ' + type + ']';
            };
        });
        function GetExplorer() {
            var explorer = window.navigator.userAgent;
            //ie 
            if (explorer.indexOf("MSIE") >= 0) {
                return 'ie';
            }
                //firefox 
            else if (explorer.indexOf("Firefox") >= 0) {
                return 'Firefox';
            }
                //Chrome
            else if (explorer.indexOf("Chrome") >= 0) {
                return 'Chrome';
            }
                //Opera
            else if (explorer.indexOf("Opera") >= 0) {
                return 'Opera';
            }
                //Safari
            else if (explorer.indexOf("Safari") >= 0) {
                return 'Safari';
            }
        }

        // JSON
        function stringify(O) {
            if (window.JSON && JSON.stringify)
                return JSON.stringify(O);

            var S = [],
				J = "";
            if (util.isArray(O)) {
                for (var i = 0; i < O.length; i++)
                    S.push(stringify(O[i]));
                J = '[' + S.join(',') + ']';
            } else if (util.isDate(O)) {
                J = "new Date(" + O.getTime() + ")";
            } else if (util.isRegexp(O) || util.isFunction(O)) {
                J = O.toString();
            } else if (util.isObject(O)) {
                for (var i in O) {
                    O[i] = typeof (O[i]) == 'string' ? '"' + O[i] + '"' : (typeof (O[i]) === 'object' ? stringify(O[i]) : O[i]);
                    S.push(i + ':' + O[i]);
                }
                J = '{' + S.join(',') + '}';
            }
            return J;
        }
        function JSONparse(str) {
            try {
                if (str === "") {
                    return [];
                }
                if (window.JSON && JSON.parse) {
                    return JSON.parse(str);
                } else {
                    return eval("(" + str + ")");
                }
            } catch (e) {
                throw new Error('not valid string');
            }
        }

        return assign(util, {
            boolean: function (str) {
                if (str === "true" || str === true) {
                    return true;
                } else if (str === "false" || str === false) {
                    return false;
                } else {
                    return undefined;
                }
            },
            isEmpty: function (value) {
                if (value == null || value == "" || value == "undefined" || value == undefined || value == "null") {
                    return true;
                }
                else {
                    value = value.replace(/\s/g, "");
                    if (value == "") {
                        return true;
                    }
                    return false;
                }
            },
            each: each,

            trim: function (s) {
                return s.replace(/(^\s*)|(\s*$)/g, '');
            },

            indexOf: function (ret, val) {
                for (var i = 0, len = ret.length; i < len; i++) {
                    if (ret[i] == val) {
                        return i;
                    }
                }
                return -1;
            },

            find: function (array, fn) {
                for (var p = 0; p < array.length; p++) {
                    if (fn(array[p], p, array))
                        return array[p];
                }
                return undefined;
            },
            findIndex: function (array, fn) {
                for (var p = 0; p < array.length; p++) {
                    if (fn(array[p], p, array))
                        return p;
                }
                return -1;
            },
            findAll: function (array, fn) {
                var _array = [];
                for (var p = 0; p < array.length; p++) {
                    if (fn(array[p], p, array))
                        _array.push(array[p]);
                }
                return _array;
            },

            removeAll: function (array, fn) {

                for (var p = 0; p < _length; p++) {
                    if (fn(array[p], p, array)) {
                        _array.splice(p, 1);
                        _length--;
                        p--;
                    }
                }
            },

            //模版生成
            template: function (d, h) {

                var str = '';

                if (!util.isArray(d)) {
                    d = [d];
                }

                if (!h) {
                    throw new Error('cann\'t find template string!');
                }

                if (!d.length)
                    return str;
                each(d, function (l, i) {
                    if (!l)
                        return;
                    str += h.replace(/\{\{\s*([a-zA-Z0-9\_\.\-\|\s]+)\s*\}\}/igm, function ($1, $2) {
                        var ret,
							value,
							tv;

                        if ($2.indexOf('||') > -1) {
                            ret = $2.split('||');
                        } else {
                            ret = [$2];
                        }

                        // 命令检测
                        // 根据优先级执行相应命令
                        // 检测最终数据

                        for (var i = 0, len = ret.length; i < len; i++) {
                            tv = l[util.trim(ret[i])];
                            if (tv !== '' && tv != undefined && tv != null) {
                                return tv;
                            }
                        }
                        return '';
                    });
                });

                return str;
            },

            //JSON to string
            stringify: stringify,

            parse: JSONparse,

            Clone: function (_in_Data) {
                return util.parse(util.stringify(_in_Data));
            },

            format: function (format, time) {
                var o,
					now;
                if (time) {
                    if (time instanceof Date) {
                        now = time;
                    } else if (isNaN(time)) {
                        now = new Date(time);
                    } else {
                        now = new Date(Number(time));
                    }
                } else {
                    now = new Date();
                }

                o = {
                    "M+": now.getMonth() + 1, //month
                    "d+": now.getDate(), //day
                    "h+": now.getHours(), //hour
                    "m+": now.getMinutes(), //minute
                    "s+": now.getSeconds(), //second
                    "q+": Math.floor((now.getMonth() + 3) / 3), //quarter  季度
                    "S": now.getMilliseconds() //millisecond
                };

                /*if (now < new Date("2000-01-01"))
					o["h+"] -= 8;*/
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
                }

                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
							("00" + o[k]).substr(("" + o[k]).length));
                    }
                }
                return format;
            },


            /*
			 * 获取命名空间
			 * @method getNamespace 获取命名空间对象
			 * @param {object} ns 命名空间起点对象
			 * @param {string} sns 空间字符串
			 * @returns 返回命名空间内容
			 */
            getNamespace: function (ns, sns) {
                var root = ns,
					ret = util.isArray(sns) ? sns : sns.split('.');

                try {
                    //获取服务类型
                    for (var i = 0, len = ret.length; i < len; i++) {
                        root = root[ret[i]];
                    }
                } catch (e) {
                    root = ns;
                }

                return root;
            },

            reverse: function (obj) {
                var _obj = {};
                for (var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        _obj[obj[p]] = p;
                    }
                }

                return _obj;
            },
            getExplorer: GetExplorer,
            exportJsonExcel: function (JSONData, FileName, ShowFileds) {
                var arrData = typeof JSONData != 'object' ? JSONparse(JSONData) : JSONData;

                var excel = '<table>';

                if (!arrData || !arrData.length) {
                    alert("导出数据不能为空！");
                    return;
                }
                var _keys = Object.keys(arrData[0]);

                if (!ShowFileds || $.isEmptyObject(ShowFileds)) {
                    ShowFileds = {};
                    for (var i = 0; i < _keys.length; i++) {
                        ShowFileds[_keys[i]] = {
                            index: i,
                            name: _keys[i]
                        };
                    }
                }
                if (!ShowFileds || $.isEmptyObject(ShowFileds)) {
                    alert("导出数据字段不能为空！");
                    return;
                }
                //设置表头  
                var row = "<tr>";

                for (var p in ShowFileds) {
                    row += "<th>" + ShowFileds[p].name + '</th>';
                }

                //换行   
                excel += row + "</tr>";

                //设置数据  
                for (var i = 0; i < arrData.length; i++) {
                    var row = "<tr>";

                    for (var p in ShowFileds) {
                        var value = arrData[i][p] === "." ? "" : arrData[i][p];
                        row += '<td>' + value + '</td>';
                    }
                    excel += row + "</tr>";
                }
                excel += "</table>";

                var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
                excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
                excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
                excelFile += '; charset=UTF-8">';
                excelFile += "<head>";
                excelFile += "<!--[if gte mso 9]>";
                excelFile += "<xml>";
                excelFile += "<x:ExcelWorkbook>";
                excelFile += "<x:ExcelWorksheets>";
                excelFile += "<x:ExcelWorksheet>";
                excelFile += "<x:Name>";
                excelFile += "{worksheet}";
                excelFile += "</x:Name>";
                excelFile += "<x:WorksheetOptions>";
                excelFile += "<x:DisplayGridlines/>";
                excelFile += "</x:WorksheetOptions>";
                excelFile += "</x:ExcelWorksheet>";
                excelFile += "</x:ExcelWorksheets>";
                excelFile += "</x:ExcelWorkbook>";
                excelFile += "</xml>";
                excelFile += "<![endif]-->";
                excelFile += "</head>";
                excelFile += "<body>";
                excelFile += excel;
                excelFile += "</body>";
                excelFile += "</html>";
                var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

                var link = document.createElement("a");
                link.href = uri;

                link.style = "visibility:hidden";
                link.download = FileName + ".xls";

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);


            },
            exportTableExcel: function (TableID, FileName) {
                var idTmr;

                (function Start(tableid, tableName) { //整个表格拷贝到EXCEL中
                    if (GetExplorer() == 'ie') {
                        var curTbl = document.getElementById(tableid);
                        var oXL = new ActiveXObject("Excel.Application");

                        //创建AX对象excel 
                        var oWB = oXL.Workbooks.Add();

                        //获取workbook对象 
                        var xlsheet = oWB.Worksheets(1);

                        //激活当前sheet 
                        var sel = document.body.createTextRange();
                        sel.moveToElementText(curTbl.parentNode);
                        //把表格中的内容移到TextRange中 
                        sel.select();
                        //全选TextRange中内容 
                        sel.execCommand("Copy");
                        //复制TextRange中内容  
                        xlsheet.Paste();
                        //粘贴到活动的EXCEL中       
                        oXL.Visible = true;
                        //设置excel可见属性

                        try {
                            var fname = oXL.Application.GetSaveAsFilename(tableName + ".xls", "Excel Spreadsheets (*.xls), *.xls");
                        } catch (e) {
                            print("Nested catch caught " + e);
                        } finally {
                            oWB.SaveAs(fname);

                            oWB.Close(savechanges = false);
                            //xls.visible = false;
                            oXL.Quit();
                            oXL = null;
                            //结束excel进程，退出完成
                            //window.setInterval("Cleanup();",1);
                            idTmr = window.setInterval("Cleanup();", 1);

                        }

                    } else {
                        tableToExcel(tableid, tableName);
                    }
                })(TableID, FileName);
                function Cleanup() {
                    window.clearInterval(idTmr);
                    CollectGarbage();
                }
                var tableToExcel = (function () {
                    var uri = 'data:application/vnd.ms-excel;base64,',
						template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"'
							+ 'xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]>'
							+ '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name>'
							+ '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml>'
							+ '<![endif]--></head><body><table>{table}</table></body></html>',
						base64 = function (s) {
						    return window.btoa(unescape(encodeURIComponent(s)))
						},
						format = function (s, c) {
						    return s.replace(/{(\w+)}/g,
								function (m, p) {
								    return c[p];
								}
							);
						}
                    return function (table, name) {
                        if (!table.nodeType)
                            table = document.getElementById(table)
                        var ctx = {
                            worksheet: name || 'Worksheet',
                            table: table.innerHTML
                        }

                        var link = document.createElement("a");
                        link.href = uri + base64(format(template, ctx));

                        link.style = "visibility:hidden";
                        link.download = FileName + ".xls";

                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                })();
            },

            importExcel: function (filePath, ShowFileds) {
                var _rst = [];
                if (GetExplorer() != "ie") {
                    alert("此功能只能在IE浏览器下使用！");
                    return _rst;
                }

                var _Fileds = {};
                for (var _name in ShowFileds) {
                    _Fileds[ShowFileds[_name].name] = _name;
                }
                //创建操作EXCEL应用程序的实例  
                var oXL = new ActiveXObject("Excel.application");
                //打开指定路径的excel文件  
                var oWB = oXL.Workbooks.open(filePath);
                //操作第一个sheet(从一开始，而非零)  
                oWB.worksheets(1).select();
                var oSheet = oWB.ActiveSheet;
                //使用的行数  
                var rows = oSheet.usedrange.rows.count;
                var columns = oSheet.usedrange.columns.count;



                try {
                    var tempStr = '[';
                    for (var i = 0; i < rows; i++) {
                        tempStr += '[';
                        for (var j = 0; j < columns; j++) {
                            tempStr += '"';
                            if ((oSheet.Cells(i + 1, j + 1) + "") != "undefined") {
                                tempStr += (oSheet.Cells(i + 1, j + 1) + "");
                            } else {
                                tempStr += ("{-}");
                            }
                            tempStr += '"';
                            if (columns != (j + 1)) {
                                tempStr += ',';
                            }
                        }
                        if (rows != i + 1)
                            tempStr += '],';
                        else
                            tempStr += ']';
                    }
                    tempStr += ']';
                    let _excelData = JSONparse(tempStr)

                    if (_excelData && util.isArray(_excelData) && _excelData.length > 1) {
                        var _titles = _excelData[0].split(",");

                        for (var sj = 0; sj < _titles.length; sj++) {
                            _titles[sj] = _Fileds[_titles[sj]];
                        }

                        for (var m = 1; m < _excelData.length; m++) {
                            let _datail = _excelData[m].split(",");
                            let setItem = {};
                            for (var si = 0; si < _titles.length; si++) {
                                setItem[_titles[si]] = _datail[si];
                            }
                            _rst.push(setItem);
                        }
                    }


                } catch (e) {
                    console.log(e);
                } finally {
                    //退出操作excel的实例对象  
                    oXL.Application.Quit();
                    //手动调用垃圾收集器  
                    CollectGarbage();

                }
                return _rst;
            },
            importExcelBySql: function (filePath, ShowFileds, _SheetName) {
                var _rst = [];
                var _Fileds = {};
                for (var _name in ShowFileds) {
                    _Fileds[ShowFileds[_name].name] = _name;
                }
                var _data = (function importXLS(fileName, SheetName) {
                    var rsExcel = null;
                    var _rst = [];
                    var objCon = new ActiveXObject("ADODB.Connection");
                    objCon.Provider = "Microsoft.Jet.OLEDB.4.0";
                    objCon.ConnectionString = "Data Source=" + fileName + ";Extended Properties=Excel 8.0;";
                    objCon.CursorLocation = 1;
                    objCon.Open;
                    var strQuery;
                    //Get the SheetName
                    var strSheetName = SheetName ? SheetName : "Sheet1";
                    var rsTemp = new ActiveXObject("ADODB.Recordset");
                    rsTemp = objCon.OpenSchema(20);
                    if (!rsTemp.EOF)
                        strSheetName = rsTemp.Fields("Table_Name").Value;
                    rsTemp = null;
                    rsExcel = new ActiveXObject("ADODB.Recordset");
                    strQuery = "SELECT * FROM [" + strSheetName + "$]";
                    rsExcel.ActiveConnection = objCon;
                    rsExcel.Open(strQuery);
                    while (!rsExcel.EOF) {
                        let tempItem = [];
                        for (var i = 0; i < rsExcel.Fields.Count; ++i) {
                            tempItem[i] = rsExcel.Fields(i).value;
                            //alert(rsExcel.Fields(i).value);
                        }
                        _rst.push(tempItem);
                        rsExcel.MoveNext;
                    }
                    // Close the connection and dispose the file
                    objCon.Close;
                    objCon = null;
                    rsExcel = null;


                    return _rst;
                })(filePath, _SheetName);
                var _titles = _data[0];

                for (var sj = 0; sj < _titles.length; sj++) {
                    _titles[sj] = _Fileds[_titles[sj]];
                }

                for (var m = 1; m < _data.length; m++) {
                    let _datail = _data[m];
                    let setItem = {};
                    for (var si = 0; si < _titles.length; si++) {
                        setItem[_titles[si]] = _datail[si];
                    }
                    _rst.push(setItem);
                }
                return _rst;
            },


            ChangeSecondToString: function (val) {
                var ss = val % 60,
					mm = parseInt(val / 60),
					hh = parseInt(mm / 60),
					dd = parseInt(hh / 24),
					MM = parseInt(dd / 30),
					yy = parseInt(MM / 12),
					result = "";

                mm = mm % 60;
                hh = hh % 24;
                dd = dd % 30;
                MM = MM % 12;

                if (yy > 0)
                    result += yy + "年";
                if (MM > 0 || result.length > 0)
                    result += MM + "个月";
                if (dd > 0 || result.length > 0)
                    result += dd + "天";
                if (hh > 0 || result.length > 0)
                    result += hh + "小时";
                if (mm > 0 || result.length > 0)
                    result += mm + "分钟";


                result += ss + "秒";

                return result;
            },
            ChangeMillsecondToString: function (val) {

                return util.ChangeMillsecondToString(val / 1000);
            },

            formatter: (function () {
                return {
                    DateTime: function (value, row, index) {
                        var html = (util.format("yyyy-MM-dd hh:mm:ss", value));
                        return html;
                    },
                    Time: function (value, row, index) {
                        var html = (util.format("hh:mm:ss", value));
                        return html;
                    },
                    Date: function (value, row, index) {
                        var html = (util.format("yyyy-MM-dd", value));
                        return html;
                    },

                    Bool: function (value, row, index) {
                        var html = ((value == true || value == "true") ? "是" : "否");
                        return html;
                    },
                    LongText: function (value, row, index) {
                        var html = value;
                        return html;
                    },
                    IP: function (value, row, index) {
                        if (isNaN(value))
                            return value;
                        var html = ((value >> 24) & 0xFF) + "." + ((value >> 16) & 0xFF) + "." + ((value >> 8) & 0xFF) + "." + ((value) & 0xFF);
                        return html;
                    },
                }
            })(),
            getFormatter: function (TypeSource, prop, type) {

                var fn = util.formatter[type];
                if (fn)
                    return fn;

                return function (value, row, index) {
                    var d_array = [];
                    $.each(TypeSource[prop], function (d_i, d_item) {
                        if (value instanceof Array) {
                            if ($.inArray(d_item.value, value) < 0) {
                                return true;
                            }
                            d_array.push(d_item.name);
                        }

                        if (value == d_item.value) {
                            value = [value];
                            d_array = [d_item.name];
                            return false;
                        }
                    });

                    var html = (d_array.join(","));
                    return html;
                };
            },

            changeToEChart: function (list, titleName, heads) {
                var _data = {
                    title: [],
                    list: {}
                };
                if (!list || !util.isArray(list)) {
                    return _data;
                }
                if (heads && heads.length > 0)
                    for (var name in heads) {
                        if (name)
                            _data.list[name] = [];
                    }


                $.each(list, function (i, item) {

                    if (!item)
                        return true;

                    if (titleName)
                        _data.title.push(item[titleName] || "");


                    for (var name in _data.list) {
                        _data.list[name].push(item[name] || 0);
                    }

                });
            }
        });


    })();

    var uri = {
        /*
		 * 获取URL查询参数，组装成对象返回
		 * @method getUrlQuery 获取查询参数
		 * @returns {object} 返回组装后对象
		 */
        getUrlQuery: function (str) {

            var search = str || window.location.search;

            if (search === '') return {};

            var str = search.charAt(0) === '?' ? search.substring(1) : search,
				temp = str.split('&'),
				ret = {};

            //生成对象
            for (var i = 0, len = temp.length; i < len; i++) {

                var arg = temp[i].split('=');
                var key = arg[0];
                var value = arg.slice(1).join("=");
                ret[key] = decodeURIComponent(value);
            }

            return ret;
        },

        /*
		 * 组装url地址
		 * @method setUrlQuery 获取查询参数
		 * @param {object} o 需要转化的对象
		 * @returns {string} 返回组装后对象
		 */
        setUrlQuery: function (o) {
            var str = '';

            if (Object.prototype.toString(o) !== "[object Object]") {
                return '';
            }

            for (var x in o) {
                if (o.hasOwnProperty(x)) {
                    str = str + x + '=' + String(o[x] == null || o[x] == undefined ? '' : o[x]) + '&';
                }
            }

            str = str.substring(0, str.length - 1);

            return encodeURI(str);
        }
    };

    var module = (function () {
        var events,
			baseComponent,
			Model;

        /*
		 * initialization event
		 */
        events = {
            core: function () {
                var self = this;
                this.query = uri.getUrlQuery(window.location.hash.split('?')[1] || "");
                this.field = uri.getUrlQuery();
                this.parent = $(this.selector ? "." + this.selector : "body");
                this.$ = function (selector) {
                    return self.parent.find(selector);
                };
                this.configure();
                this.events();
                this.setTitle();
            }
        };

        /*
		 * base component
		 */
        baseComponent = {
            init: function (func) {
                var type = this.type ? this.type : "core",
					ev = type in events ? events[type] : event.core;

                ev.call(this);
                func && func();
                return this;
            },

            setTitle: function () {
                if (this.name && util.isString(this.name)) {
                    window.document.title = this.name;
                }

                return this;
            },

            configure: function () { }
        };

        /*
		 * model entity
		 */
        Model = {
            create: function (component) {
                function Klass() {
                }
                $.extend(Klass.prototype, baseComponent, component);
                return new Klass();
            },
            /*
			 * @typename name[:extendName]
			 */
            expand: function (typename, func) {
                var kernel = typename.split(":"),
					type = kernel[0],
					base = kernel[1] ? kernel[1] in events ? kernel[1] : "core" : "core";

                if (!func) {
                    throw new Error("func isn\'t function");
                }

                if (type === "core") {
                    throw new Error("core is reserve keyword");
                }

                if ((type in events) && console.error) {
                    console.error(type + " already exist and cover");
                }

                Model[type.toUpperCase()] = type.toLowerCase();

                events[type.toLowerCase()] = function () {
                    events[base].call(this);
                    func.call(this);
                };
            }
        };

        return Model;
    })();


    var SearchForm = {
        fn: undefined,
        $SEARCH: undefined,
        start: (function () {
            /*$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性 
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素 
					if ($(elem).attr("class") && $(elem).attr("class") == 'femi-search-contain') {

						return;
					}
					elem = elem.parentNode;
				}
				//点击的不是div或其子元素 
				$('.femi-search').html("");
				$('.femi-search').hide();

			 
			$('.femi-search').css('display', 'none');
			 
			});*/
            $("body").delegate(".femi-search-cancel", "click", function () {
                var $this = $(this),
					$closest = $this.closest(".femi-search"),
					$closest_contain = $this.closest(".femi-search-contain");
                $closest.html("");
                $closest_contain.hide();
            });

            $("body").delegate(".femi-search .femi-search-item select.femi-search-dropOneControl", "change", function (e) {
                var $this = $(this),
					name = $this.attr("data-name"),
					value = $this.val(),
					$Search = $this.closest(".femi-search"),
					$children = $Search.find(".femi-search-item select.femi-search-dropOneControl[data-control=" + name + "]");
                if (!$children[0]) {
                    return;
                }
                $children.children("option").hide();
                if (!value || value == "") {
                    DropOneHideOption($children, $Search); //后面的全部隐藏
                    return;
                }
                $children.children("option[data-far=" + value + "]").show();
                $children.val("");
                DropOneHideOption($children, $Search); //后面的全部隐藏
            });
            //隐藏所有控制项
            function DropOneHideOption($this, $Search) {
                var name = $this.attr("data-name"),
					$children = $Search.find(".femi-search-item select.femi-search-dropOneControl[data-control=" + name + "]");
                if (!$children[0]) {
                    return;
                }
                $children.children("option").hide();
                $children.val("");
                DropOneHideOption($children, $Search);
            }

        })(),
        HTML: (function () {

            return {
                ItemBool: ['<div class="femi-search-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<select class=" form-control" data-name="{{name}}" >',
					'<option value=false >false</option>',
					'<option value=true selected="{{value}}" >true</option>',
					'</select>',
					'</div>'
                ].join(""),

                ItemString: ['<div class="femi-search-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<input type="text" class="form-control" data-name="{{name}}" placeholder="{{title}}" value={{value}}>',
					'</div>'
                ].join(""),
                ItemLongText: ['<div class="femi-search-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<p contenteditable="true"  style="height: auto;" class="form-control" data-name="{{name}}"  >{{value}}</p>',
					'</div>'
                ].join(""),
                ItemDateTime: ['<div class="femi-search-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<input class="form-control femi-form-datetime"  data-type="datetime" size="16" type="text" data-name="{{name}}" value="{{value}}" placeholder="{{title}}" >',
					'</div>'
                ].join(""),
                ItemDate: ['<div class="femi-search-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<input class="form-control femi-form-date" size="16" data-type="date" type="text" data-name="{{name}}" value="{{value}}" placeholder="{{title}}" >',
					'</div>'
                ].join(""),
                ItemTime: ['<div class="femi-search-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<input class="form-control femi-form-time" size="16" data-type="time" type="text" data-name="{{name}}" value="{{value}}" placeholder="{{title}}" >',
					'</div>'
                ].join(""),

                ItemNumber: ['<div class="femi-search-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<input type="number"  class="form-control" format="yyyy-MM-dd hh:mm" data-name="{{name}}" placeholder="{{title}}" value={{value}}>',
					'</div>'
                ].join(""),
                ItemDropOne: ['<div class="femi-search-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<select class="form-control" data-name="{{name}}" >{{subItems}}</select>',
					'</div>'
                ].join(""),
                ItemDropEdit: ['<div class="femi-search-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<input class="form-control" type="text" data-type="editdrop"  data-name="{{name}}" value="{{value}}" list="list_{{name}}" />',
					'<datalist id="list_{{name}}">{{subItems}}</datalist>',
					'</div>'
                ].join(""),
                ItemDropOneControl: ['<div class="femi-search-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<select class="form-control femi-search-dropOneControl" data-name="{{name}}" data-control="{{control_name}}" >{{subItems}}</select>',
					'</div>'
                ].join(""),

                SubItem: ['<option value="{{value}}" {{selected}}   >{{name}}</option>', ].join(""),

                SubItemEdit: ['<option value="{{name}}"  >{{value}}</option>', ].join(""),

                SubItemControl: ['<option value="{{value}}" class="{{cla}}" {{selected}} data-far="{{far}}" >{{name}}</option>', ].join(""),

                Footer: [
					'<div class="femi-search-footer">  ',
					'<div class="femi-lf" style="width: 49%;"> ',
					'<button type="button" class="btn btn-default femi-search-cancel">取消</button>',
					'</div>',
					'<div class="femi-lf" style="width: 2%;"></div>',
					'<div class="femi-lf" style="width: 49%;">',
					'<button type="button"  class="btn btn-primary femi-search-confirm">搜索</button>',
					'</div>',
					'</div>',
                ].join(""),
            }
        })(),

        filterSourceItem: function (source_item) {
            if (!source_item || source_item.length <= 0)
                return;
            var _NameKey = {};
            $.each(source_item, function (i, item) {
                if (_NameKey[item.name])
                    item.name = item.name + "_" + item.value;

                _NameKey[item.name] = item.value;
            })

        },

        show: function ($search, data, KEYWORD, fn, source) {

            if ($search.find(".femi-search-item")[0])
                return;

            SearchForm.fn = fn;
            SearchForm.$SEARCH = $search;
            var filter = function (item) {
                var _data = [];
                _data.length
                for (var p in item) {
                    var o = KEYWORD[p];
                    if (o) {

                        _data[Number(o.index)] = {
                            name: p,
                            value: item[p],
                            title: o.name,
                            type: o.type,
                            control_name: o.control ? o.control : ""
                        };
                    }
                }

                return _data;
            }(data);





            var Items = function (filter_data) {
                var _data = [];
                $.each(filter_data, function (i, item) {
                    if (!item)
                        return true;
                    if (item.type) {

                        var _IsOK = true;
                        switch (item.type) {
                            case "LongText":
                                _data.push(util.template(item, SearchForm.HTML.ItemLongText));

                                break;

                            case "ArrayOne":
                                if (!source || !source[item.name])
                                    return true;

                                SearchForm.filterSourceItem(source[item.name]);

                                $.each(source[item.name], function (_s_i, _s_item) {
                                    _s_item.selected = (_s_item.value == item.value) ? 'selected="selected"' : "";

                                });
                                item.subItems = util.template(source[item.name], SearchForm.HTML.SubItem);
                                _data.push(util.template(item, SearchForm.HTML.ItemDropOne));

                                break;
                            case "ArrayOneEdit":
                                if (!source || !source[item.name])
                                    return true;
                                SearchForm.filterSourceItem(source[item.name]);

                                $.each(source[item.name], function (_s_i, _s_item) {

                                    if (_s_item.value != item.value)
                                        return true;

                                    item.value = _s_item.name;
                                    return false;
                                });
                                item.subItems = util.template(source[item.name], SearchForm.HTML.SubItemEdit);
                                _data.push(util.template(item, SearchForm.HTML.ItemDropEdit));

                                break;
                            case "ArrayOneControl":
                                if (!source || !source[item.name])
                                    return true;
                                SearchForm.filterSourceItem(source[item.name]);

                                var s_index = util.findIndex(source[item.name], function (element, index, array) {
                                    return element == item.value;
                                });
                                var _far = null;
                                if (s_index >= 0) {
                                    _far = source[item.name][s_index].far;
                                }
                                $.each(source[item.name], function (_s_i, _s_item) {

                                    _s_item.selected = "";
                                    _s_item.cla = "";
                                    if (_far != null && _far != _s_item.far) {

                                        _s_item.cla = "hidden";
                                    }
                                    if (_s_item.value == item.value) {
                                        _s_item.selected = "selected";
                                        _s_item.cla = "";
                                    }
                                });
                                item.subItems = util.template(source[item.name], SearchForm.HTML.SubItemControl);
                                _data.push(util.template(item, SearchForm.HTML.ItemDropOneControl));

                                break;
                            case "DateTime":
                                item.value = util.format("yyyy-MM-dd hh:mm", item.value);
                                _data.push(util.template(item, SearchForm.HTML.ItemDateTime));
                                break;
                            case "Date":
                                item.value = util.format("yyyy-MM-dd", item.value);
                                _data.push(util.template(item, SearchForm.HTML.ItemDate));
                                break;
                            case "Time":
                                item.value = util.format("hh:mm", item.value);
                                _data.push(util.template(item, SearchForm.HTML.ItemTime));
                                break;
                            default:

                                _IsOK = false;
                                break;
                        }
                        if (_IsOK)
                            return true;
                    }
                    if (item.value || item.value == false || item.value == "") {
                        if (item.value instanceof Array) {

                        } else if (util.isString(item.value)) {
                            _data.push(util.template(item, SearchForm.HTML.ItemString));
                        } else if (util.isBoolean(item.value)) {
                            _data.push(util.template(item, SearchForm.HTML.ItemBool));
                        } else if (util.isNumber(item.value)) {
                            _data.push(util.template(item, SearchForm.HTML.ItemNumber));
                        } else {
                            _data.push(util.template(item, SearchForm.HTML.ItemString));
                        }
                    } else {
                        _data.push(util.template(item, SearchForm.HTML.ItemString));
                    }
                });
                return _data.join("");

            }(filter);


            $search.append(Items);
            $search.append(SearchForm.HTML.Footer);
            $search.show();
            $search.closest(".femi-search-contain").show();
            SearchForm.active($search);
        },
        hide: function ($Search) {
            $Search.html("");
        },
        active: function ($search) {


            $search = $search ? $search : $(".femi-search");

            if (!$search.find(".femi-search-item")[0])
                return;


            if ($search.find(".femi-form-time")[0]) {
                $search.find(".femi-form-time").scroller('destroy').scroller(
					$.extend(
						{
						    preset: 'time',
						    stepMinute: 5
						},
						{
						    theme: "android-ics light",
						    mode: "scroller",
						    display: "bottom",
						    lang: "zh"
						})
				);
            }
            if ($search.find(".femi-form-date")[0]) {
                $search.find(".femi-form-date").scroller('destroy').scroller(
					$.extend(
						{
						    preset: 'date',
						},
						{
						    theme: "android-ics light",
						    mode: "scroller",
						    display: "bottom",
						    lang: "zh"
						})
				);
            }
            if ($search.find(".femi-form-datetime")[0]) {
                $search.find(".femi-form-datetime").scroller('destroy').scroller(
					$.extend(
						{
						    preset: 'datetime',
						    stepMinute: 5
						},
						{
						    theme: "android-ics light",
						    mode: "scroller",
						    display: "bottom",
						    lang: "zh"
						})
				);
            }

            $search.find(".femi-search-confirm").click(function () {

                var _data = [];
                $search.find(".femi-search-item").each(function (i, item) {
                    var title = $(item).find("label.m-detail-title").html(),
						$value = $(item).find("input.form-control,select.form-control"),
						name = $value.attr("data-name"),
						value,
						cur = new Date(),
						type = $value.attr("data-type");
                    if (type) {
                        switch (type) {
                            case "datetime":
                                value = new Date($value.val()).getTime();
                                break;
                            case "date":
                                value = new Date($value.val()).getTime();
                                break;
                            case "time":
                                var strTime = $value.val().split(":");
                                value = new Date(2000, 1, 1, strTime[0], strTime[1]).getTime();
                                break;
                            case "editdrop":
                                var valueName = $value.val(),
                                $Selected_Option = $value.next("datalist").children("option[value=" + valueName + "]");
                                if ($Selected_Option[0])
                                    value = $Selected_Option.html();
                                break;
                            default:
                                value = $value.val();
                                break;
                        }
                    } else {
                        value = $value.val();
                    }

                    _data[name] = value;
                });

                $search.html("");
                var $closest_contain = $search.closest(".femi-search-contain");
                $closest_contain.hide();

                if (SearchForm.fn)
                    SearchForm.fn(_data);
            });


        },
    };

    var ChoosePage = (function () {

        var HTML = {

            DIALOGS: {
                LIST: {
                    MAIN: '<div class="com-collapse mb-30" style="height:{{height}}px;overflow-x:hidden;overflow-y:auto">{{groups}}</div>',
                    GROUP: ['<div class="w-select">',
                        '<div class="w-select-view clearfix">',
                        '<div class="w-select-text">',
                        '<span class="w-select-main-text">{{name}}</span>',
                        '<span class="w-select-sub-text text-blue"></span>',
                        '<div class="w-select-icon"></div>',
                        '</div>',
                        '</div>',
                        '<ul class="w-select-list" id="GROUP_{{id}}">{{lists}}</ul>',
                        '</div>'].join(""),

                    FILTER: ['<div class="m-card" style=" padding:1vw">',
                        '<input type="text" class="form-control femi-select-input"   placeholder="请输入筛选文本"  />',
                        '</div>'].join(""),
                    LI_R: ['<li>',
                        '<label for="{{ID}}">',
                        '<div class="clearfix">',
                        '<div class="m-l-col">',
                        '<div class="m-checkbox-box">',
                        '<input type="radio" name="employee" id="LI_{{ID}}" data-value="{{ID}}"  data-name="{{name}}">',
                        '<label for="LI_{{ID}}"></label>',
                        '</div>',
                        '</div>',
                        '<div class="m-l-col">',
                        '<span>{{name}}</span>',
                        '</div>',
                        '</div>',
                        '</label>',
                        '</li>'].join(""),
                    LI_C: ['<li>',
                        '<label for={{ID}}>',
                        '<div class="clearfix">',
                        '<div class="m-l-col">',
                        '<div class="m-checkbox-box">',
                        '<input type="checkbox" name="employee" id="LI_{{ID}}" data-value="{{ID}}"  data-name="{{name}}">',
                        '<label for="LI_{{ID}}"></label>',
                        '</div>',
                        '</div>',
                        '<div class="m-l-col">',
                        '<span>{{name}}</span>',
                        '</div>',
                        '</div>',
                        '</label>',
                        '</li>'].join("")
                },

            },
            WRAP: {
                MAIN: ['<div class="view view-wrap" style="position:fixed;background:#fff;top:0;left:100%;z-index:999;">',
                    '<div class="m-menu m-blue-menu">',
                    '<div class="m-left-area">',
                    '<a class="m-btn" href="javascript:;"><svg width="19px" height="31px" viewBox="0 0 19 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
                    '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">',
                    '<g transform="translate(-914.000000, -1368.000000)">',
                    '<g transform="translate(916.000000, 1370.000000)" stroke="#FFFFFF" stroke-width="3" stroke-linecap="square">',
                    '<path d="M14.5833333,0.409090909 L0.416666667,12.6818182"></path>',
                    '<path d="M12.9166667,26.5909091 L0.416666667,12.6818182"></path>',
                    '</g>',
                    '</g>',
                    '</g>',
                    '</svg>{{cancel}}</a>',
                    '</div>',
                    '<div class="m-title">',
                    '<a href="javascript:;" class="m-select">',
                    '<span>{{title}}</span>',
                    '</a>',
                    '</div>',
                    '<div class="m-right-area">{{btn}}</div>',
                    '</div>{{content}}</div>'].join(""),
                BTN: '<a class="m-btn {{classname}}" href="javascript:;">{{name}}</a>'
            },

        };
        return {
            show: function (DATA, selected, fn) {

                //var DATA_Temp = {
                //    list: [], //数据源
                //    title: "",  //标题
                //    PropertyID: "",  //数据源ID
                //    PropertyName: "",  //数据源名称
                //    PropertyGroupName: "", //分组属性名称
                //    PropertyGroupID: "",  //分组属性ID
                //    mode:1,               //1 单选 2多选
                //    allowEmpty:false,     //是否允许不选
                //    SelectName:""         //筛选框默认数据  
                //};
                // selected  已选择的数据ID 或数据ID数组
                // fn function(p1,p2 )  //p1 选择的ID数组  p2 选择的Name数组
                var mode = 1,
                    wh = $(window).height(),
                    ww = $(window).width(),
                    h = wh - (ww / 100) * 15;

                if (!DATA || !DATA.list) {
                    alert("待选择数据不存在！");
                    return;
                }
                mode = DATA.mode;
                var $node = $(util.template({
                    cancel: "关闭",
                    title: DATA.title ? DATA.title : "选择",
                    btn: util.template({
                        classname: "confirm",
                        name: "确认"
                    }, HTML.WRAP.BTN),
                    // 生成分组
                    content: util.template({
                        groups: (function (list) {

                            var groupss = {};

                            $.each(list, function (i, item) {

                                var _item = {
                                    ID: item[DATA.PropertyID],
                                    name: item[DATA.PropertyName]
                                }

                                item.GroupName = item[DATA.PropertyGroupName];

                                if (!groupss[item[DATA.PropertyGroupID]])
                                    groupss[item[DATA.PropertyGroupID]] = {
                                        name: item[DATA.PropertyGroupName],
                                        id: item[DATA.PropertyGroupID],
                                        lists: [_item]
                                    };
                                else
                                    groupss[item[DATA.PropertyGroupID]].lists.push(_item);
                            })

                            var group_s = [];
                            for (var key in groupss) {

                                groupss[key].lists = util.template(groupss[key].lists, mode === 1 ? HTML.DIALOGS.LIST.LI_R : HTML.DIALOGS.LIST.LI_C);
                                group_s.push(groupss[key]);
                            }
                            var groups = util.template(group_s, HTML.DIALOGS.LIST.GROUP);

                            groups = HTML.DIALOGS.LIST.FILTER + groups;

                            return groups;
                        })(DATA.list),
                        height: h
                    }, HTML.DIALOGS.LIST.MAIN)
                }, HTML.WRAP.MAIN));

                $node.find(".m-left-area .m-btn").one("click", close);

                $node.find(".w-select ul.w-select-list li .m-checkbox-box label").on("click", function (e) {

                    var $this = $(this).closest(".m-checkbox-box").find("input:checked");
                    if ($this[0]) {
                        $this[0].checked = false;
                        return false;
                    }

                });

                $node.find(".m-right-area .confirm").on("click", function () {
                    var $Choose = $node.find(".com-collapse .m-checkbox-box input:checked"),
                        IDList = [],
                        nameList = [];

                    if ($Choose.length === 0 && !DATA.allowEmpty) {
                        alert("未选择！");
                        return;
                    } else {
                        $Choose.each(function (i, item) {
                            var $item = $(item);
                            IDList.push(Number($item.attr("data-value")));
                            nameList.push($item.attr("data-name"));
                        });

                        var _NameString = $node.find(".m-card input.form-control.femi-select-input").val();
                        if (IDList.length <= 0) {
                            if (util.isEmpty(_NameString)) {
                                alert("未选择,且搜索框未输入待加入的数据！");
                                return;
                            } else {
                                nameList.push(_NameString);
                            }
                        }
                        if (!util.isEmpty(_NameString) && $.inArray(_NameString, nameList) < 0 && mode == 2) {
                            confirm("是否加入搜索框中数据？", function (bool) {
                                if (bool) {
                                    nameList.push(_NameString);
                                    if (fn)
                                        fn(IDList, nameList);
                                    close();
                                } else {
                                    if (fn)
                                        fn(IDList, nameList);
                                    close();
                                }
                            });

                        } else {
                            if (fn)
                                fn(IDList, nameList);
                            close();
                        }

                    }
                });

                $('body').append($node);

                selected = util.isArray(selected) ? selected : [selected];
                util.each(selected, function (item, i) {
                    $node.find("input[id=LI_" + item + "]").prop("checked", true);
                });

                if (DATA.SelectName && DATA.SelectName.length > 0) {

                    $node.find(".m-card input.femi-select-input").val(DATA.SelectName);
                    $node.find(".m-card input.femi-select-input").change();

                }

                setTimeout(function () {
                    $node.css("left", 0);
                }, 100);

                function close() {
                    $node.css("left", "100%");
                    $node.find(".m-right-area .confirm").off("click");
                    setTimeout(function () {
                        $node.remove();
                    }, 1000);
                }
            }

        };
    })();


    var transProp = (function whichTransitionEvent() {
        var t,
			el = document.createElement('fakeelement'),
			transitions = {
			    'transition': 'transitionend',
			    'OTransition': 'oTransitionEnd',
			    'MozTransition': 'transitionend',
			    'WebkitTransition': 'webkitTransitionEnd'
			};

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }());


    var showDropdown = function (sltElement) {
        var event;

        event = document.createEvent('MouseEvents');

        event.initMouseEvent('mousedown', true, true, window);

        sltElement.dispatchEvent(event);

    }

    var carousel = function () {
        var HTML = {
            TAB: ['<li class="trans-banner" style="background-image:url({{image_url}})"',
				' title="{{title}}" data-index="{{index}}"><a href="{{link}}"></a></li>'].join(""),
            HOLDER: '<li class="holder" style="width:0"></li>',
            HOLDER_FULL: '<li class="holder" style="width:100vw"></li>',
            SPAN: '<span></span>',
            SPAN_S: '<span class="active"></span>'
        };

        var STATE = {
            READY: 1,
            ANIMATING: 2
        };

        var transProp = (function whichTransitionEvent() {
            var t,
				el = document.createElement('fakeelement'),
				transitions = {
				    'transition': 'transitionend',
				    'OTransition': 'oTransitionEnd',
				    'MozTransition': 'transitionend',
				    'WebkitTransition': 'webkitTransitionEnd'
				};

            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }());

        /*
		 data => [
			{image_url, title, news_link}, ...
		 ]
		 */
        function Carousel(option) {
            this._debug = option.debug || false;

            if (!this instanceof Carousel) {
                this.debug("instanceof fail, renew Carousel");
                return new Carousel(elem, option);
            }

            if (!option.element) {
                throw new Error("element was gone!");
            }

            this._element = $(option.element);
            if (!option.data || option.data.length === 0) {
                throw new Error("\'data\' is null");
            }

            this._width = option.width || $(window).width();
            this._length = option.data.length;
            this.debug("data parse");
            this._data = _parse(option.data);

            this._render();
            this._events();
        }

        Carousel.prototype._render = function () {
            var banner = "";
            this._element.find(".title").html(this._data[0].title); //init title
            this._element.find(".mark").html(renderMark(this._length));
            banner += util.template(this._data, HTML.TAB);
            this._element.find("ul").html(banner);
        };

        Carousel.prototype._events = function () {
            var self = this;
            this._element.swipe({
                swipe: function (event, direction, distance, duration, fingerCount) {
                    if (direction == "left" && self._status !== STATE.ANIMATING) {
                        self._status = STATE.ANIMATING;
                        self.turnRight(function () {
                            self.operation();
                        });
                    } else if (direction == "right" && self._status !== STATE.ANIMATING) {
                        self._status = STATE.ANIMATING;
                        self.turnLeft(function () {
                            self.operation();
                        });
                    }
                }
            });
        };

        // 右翻页
        Carousel.prototype.turnRight = function (fn) {
            var $ul = this._element.find("ul"),
				$holder = $(HTML.HOLDER_FULL),
				$li = $ul.find("li:first");
            $ul.find("li:first").replaceWith($holder);
            $ul.append($li);
            /*$holder.width(0);
			$holder.one(transProp, function() {
				$holder.remove();
				fn && fn();
			});*/

            $holder.animate({
                width: 0
            }, function () {
                $holder.remove();
                fn && fn();
            });
        };

        // 左翻页
        Carousel.prototype.turnLeft = function (fn) {
            var $ul = this._element.find("ul"),
				$holder = $(HTML.HOLDER);
            $holder.prependTo($ul);
            /*$holder.width("100vw");
			$holder.one(transProp, function() {
				$holder.replaceWith($ul.find("li:last"));
				fn && fn();
			});*/
            $holder.animate({
                width: "100vw"
            }, function () {
                $holder.replaceWith($ul.find("li:last"));
                fn && fn();
            });
        };

        // 其他操作， 标题切换、页数标记
        Carousel.prototype.operation = function () {
            var $node = this._element.find("ul li:eq(1)"),
				title = $node.attr("title"),
				index = $node.attr("data-index");
            this._element.find(".title").text(title);
            this._element.find(".mark span:eq(" + index + ")")
				.addClass("active")
				.siblings()
				.removeClass("active");
            this._status = STATE.READY;
        };

        Carousel.prototype.debug = function () {
            //this._debug && console.log && console.log.apply(null, arguments);
        };


        Carousel.prototype._test = function () {
            // 复制使用
        };

        function renderMark(len) {
            var str = HTML.SPAN_S,
				index = 0;

            while (++index < len) {
                str += HTML.SPAN;
            }

            return str;
        }

        function _parse(data) {
            var len = data.length,
				arr = [];

            if (len === 1) {
                arr = _copy(arr.concat(data, 0, 0), data);
            } else if (len === 2) {
                arr = _copy(arr.concat(data, 0, 1), data);
            } else {
                arr = arr.concat(data);
            }

            arr.unshift(arr.pop());

            return arr;
        }

        function _copy(arr, data) {
            arr = arr.map(function (a) {
                if ($.isNumeric(a)) {
                    return $.extend({}, data[a]);
                }
                return a;
            });

            return arr;
        }

        return Carousel;
    }


    var imgUtil = {
        fullImg: function (url) {
            var html = '<div class="femi-full-screen-img" style="background:black url(' + url + ') no-repeat center;background-size:100% auto; "></div>';
            $("body").append(html)
        }
    };
    return {
        version: global.version,
        cookie: cookie,
        math: math,
        app: app,
        util: util,
        uri: uri,
        Model: module, /*
		modal : dynamicModal,*/
        API: serviceCon.url,
        Carousel: carousel,
        prop: transProp,
        dispatch: showDropdown,
        searchForm: SearchForm,
        imgUtil: imgUtil,
        choosePage: ChoosePage
    };

});