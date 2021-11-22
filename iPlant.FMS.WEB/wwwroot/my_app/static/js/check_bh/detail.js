require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		LETTER,
        AllItem,
        DATA,
		IsSubmit;

    IsSubmit = false;
    current = "Status_Sent";

    HTML = {
        LIST: ['<li>',
			'<label class="m-detail-title">{Name}</label>',
			'<div class="m-detail-content">{{Bool}}{{cause}}</div>',
			'</li>'].join(""),
        CAUSE: '<div class="m-detail-remark">{{Cause}}</div>',
        IMG: '<li class="upload-img"><img src="/upload/{{Src}}" data-id="{{Id}}"></li>',
        IPT: ['<label class="radio-item" style="padding: 3vw 4vw 0 4vw;display:block;" for="zz{{Id}}">',
			'<div class="m-checkbox-box">',
			'<input type="checkbox" name="item2" {{Checked}} data-id="{{Id}}" data-cause="{{Name}}" id="zz{{Id}}">',
			'<label for="zz{{Id}}"></label></div><span>{{Name}}</span></label>'].join("")
    };
    model = $com.Model.create({
        name: '点检任务',
        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },
        events: function () {
            $("#back").click(function () {
                window.history.back();
            });

       
        },

        run: function () {
            var _data = {
                itemTex: "",
                ResonList: [{ Id: 0, Checked: "", Name: "", Reason: "" }],
                //imgs: [{ Src: null, Id: null }],
                remark: "",
            };

            model.com.getTask({
                EventID: window._eventID, ID: model.query.id
            }, function (data) {
                AllItem = data.list;
                var list = data.Result;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].ItemID == Number(model.query.sid))
                        DATA = list[i];
                }
             
                //for (var i = 0; i < AllItem.length; i++) {
                //    if (DATA.ItemID == AllItem[i].ID) {
                //        for (var j = 1; j <= AllItem[i].UnqualifiedOptions.length; j++) {
                //            _data.ResonList[j - 1] = { Id: j, Name: AllItem[i].UnqualifiedOptions[j - 1], Reason: DATA.Reason }
                //        }
                //    }
                //}
                _data.itemText = "操作面板";
                _data.remark = "";
                model.com.render(_data);
                if (DATA.Result == true) {
                    $("#item1-true").prop("checked", true);
                    $("#desc").val(DATA.Comment);
                } else {
                    $("#item1-false").prop("checked", true);
                    $("#item2").show();
                    $("#desc").val(DATA.Comment);
                }
                var str = "";
                for (var j = 1; j <= DATA.Reason.length; j++) {
                    str += DATA.Reason[j - 1] + " ;  ";
                }
                $(".w-option-content").val(str);
            
                //$("#item2 .m-c-body").html($com.util.template(_data.ResonList, HTML.IPT));
                var list = [];
                for (var i = 0; i < DATA.ImageList.length; i++) {
                    list.push({ Src: DATA.ImageList[i], Id: DATA.ImageList[i] })
                }
                $(".upload-list").prepend($com.util.template(list, HTML.IMG));
            });
        },

        com: {
            getTask: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskSpot/Info",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            get: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceItemResult/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getItem: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePointCheckItem/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            add: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceItemResult/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            upload: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/Submit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            filter: function (data) {
                var _data;
                $.each(data.itemList.dMSIPTItem, function (i, item) {
                    if (item.itemID == model.query.Sid) {

                        item.imgs = [];

                        if (item.pictureList && item.pictureList.trim().length > 3) {
                            $.each(item.pictureList.split("|"), function (p_i, p_item) {
                                item.imgs.push({
                                    Src: p_item,
                                    Id: p_item
                                });
                            });
                        }

                        $.each(item.unreadyList.dMSItem, function (d_i, d_item) {
                            d_item.Checked = d_item.result ? "checked" : "";
                        })
                        model._data = _data = item;
                    }
                });

                return _data;
            },

            render: function (data) {

            
                $("#item1 .m-c-head").text(data.itemText);
               // $("#item2 .m-c-body").html($com.util.template(data.ResonList, HTML.IPT));

                if (data.remark)
                    $("#desc").html(data.remark);

                $(".upload-list").prepend($com.util.template(data.imgs, HTML.IMG));
            },

            addCheck: function () {
                if ($("item1-true").attr("checked") == true) {
                    alert("合格");
                }
                if ($("item1-false").attr("checked") == true) {
                    alert("不合格");
                }
            }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/check-a434cc7332.js.map