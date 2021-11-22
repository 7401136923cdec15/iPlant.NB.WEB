require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		LETTER,
        Info,
        AllItem,
        selected,
        SName,
        DATA,
		IsSubmit;
    selected = [];
    Info = {};
    IsSubmit = false;
    current = "Status_Sent";

    HTML = {
        LIST: ['<li>',
			'<label class="m-detail-title">{Name}</label>',
			'<div class="m-detail-content">{{Bool}}{{cause}}</div>',
			'</li>'].join(""),
        CAUSE: '<div class="m-detail-remark">{{Cause}}</div>',
        IMG: '<li class="upload-img"><img src="/upload/{{Src}}" data-id="{{Id}}"></li>',
        IPT: ['<label class="radio-item" id="radio-item" style="padding: 3vw 4vw 0 4vw;display:block;" for="zz{{Id}}">',
			'<div class="m-checkbox-box" >',
			'<input type="checkbox"  name="item2" {{Checked}} data-id="{{Id}}" data-cause="{{Name}}" id="zz{{Id}}">',
			'<label  for="zz{{Id}}"></label></div><span>{{Name}}</span></label>'].join("")
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
            $("body").delegate(".w-option-icon", "click", function (e) {
                var list = [];
                for (var i = 0; i < AllItem.length; i++) {
                    if (DATA.ItemID == AllItem[i].ID) {
                        for (var j = 1; j <= AllItem[i].UnqualifiedOptions.length; j++) {
                            list.push({ ID: j, name: AllItem[i].UnqualifiedOptions[j - 1],GroupID:1,GroupName:"原因不合格" });
                        }
                    }
                }
                
                var DataTempLate = {
                    list:list,
                    title: "选择列表",
                    PropertyID: "ID",  //数据源ID
                    PropertyName: "name",  //数据源名称
                    PropertyGroupName: "GroupName", //分组属性名称
                    PropertyGroupID: "GroupID",  //分组属性ID
                    mode: 2,
                    allowEmpty: true,
                }
                $com.choosePage.show(DataTempLate, selected, function (p1, p2) {
                    selected = [];
                    var data = [];
                    var str = "";
                    SName = p2;
                            for (var j = 1; j <= p2.length; j++) {
                                data.push(p2[j - 1]);
                                str += p2[j - 1] + " ;  ";
                            }
                            for (var j = 1; j <= p1.length; j++) {
                                selected.push(p1[j-1]);
                            }
                         $(".w-option-content").val(str);
                });
            });
            $("body").delegate("#confirm", "click", function (e) {

                if ($("#item1-true").is(':checked')) {
                    DATA.Result = true;
                    DATA.Comment = $("#desc").val();
                    var list = [];
                    $.each($('.upload-list').find('img'), function (index, img) {
                        var oldSrc = $(this).attr('data-id');
                        list.push(oldSrc);
                    });
                    DATA.ImageList = list;
                    model.com.add(
                    { data: Info,result:[DATA] }
                 , function (res) {
                     alert("提交成功");
                     window.location = "item.html?id=" + res.info.ID;
                 })
                }
                if ($("#item1-false").is(':checked')) {
                    if ($("#desc").val() == "") {
                        alert("请填写不合格原因描述！")
                        return;
                    }
                    DATA.Result = false;
                    DATA.Comment = $("#desc").val();
                    DATA.Reason = SName;
                   
                    var list = [];
                    $.each($('.upload-list').find('img'), function (index, img) {
                        var oldSrc = $(this).attr('data-id');
                        list.push(oldSrc);
                    });
                    DATA.ImageList = list;
                    model.com.add(
                     { data: Info, result: [DATA] }
                 , function (res) {
                     alert("提交成功");
                     window.location = "item.html?id=" + res.info.ID;
                 })
                }
            });

            $(".m-c-panel .upload-btn input").on("change", function () {
                var self = this,
					_data = self.files[0];

                if (_data) {
                    if (_data.size > (1024 * 1024 * 10)) {
                        alert("请上传小于10M的图片！");
                        clearFiles();
                        return;
                    }

                    if (!extLimit(['jpg', 'png', 'gif', 'bmp', 'jpeg']).has(_data.name)) {
                        alert("请上传正确的图片！");
                        clearFiles();
                        return;
                    }

                    var form = new FormData();
                    form.append("file", _data);

                    $.ajax({ //
                        url: "/api/Upload/Submit",
                        type: "POST",
                        data: form,
                        processData: false,
                        contentType: false,
                        dataType: "JSON"
                    }).done(function (data) {

                        if (data.resultCode === 1000) {
                            var $p = $(self).parent();
                            $p.before($com.util.template({
                                Src: data.returnObject.file_id,
                                Id: data.returnObject.file_id
                            }, HTML.IMG));
                        } else {
                            alert("上传失败，请重新再试");
                        }
                        clearFiles();
                    });
                }

                function clearFiles() {
                    self.value = "";
                }

                function extLimit(exts) {
                    return {
                        has: function (file) {
                            var arr = file.split("."),
								ext = arr[arr.length - 1].toLowerCase();

                            return exts.indexOf(ext) > -1 ? true : false;
                        }
                    };
                }
            });

            $("#item1 input").change(function () {
                var $this = $(this),
					state = $this.attr("data-value");

                if (state == "1") {
                    $("#item2").hide();
                } else {
                    $("#item2").show();
                }
            });
        },

        run: function () {
            var _data = {
                itemTex: "",
                ResonList: [{ Id: 0, Checked: "", Name: "",Reason:"" }],
                remark: "",
            };
            if (model.query.QRstring && model.query.QRstring.length != "") {
                model.com.getScan({
                    QRCode: model.query.QRstring
                }, function (data) {
                    var code = data.info.QRType;
                    model.com.getTask({
                        EventID: window._eventID, QRType: code, QRCode: model.query.QRstring
                    }, function (data) {
                        Info = data.info;
                        AllItem = data.list;
                        var list = data.Result;
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].ItemID == Number(model.query.sid))
                                DATA = list[i];
                        }
                        if (DATA.ID == 0) {
                            _data.itemText = "操作面板";
                            _data.remark = "";
                            model.com.render(_data);
                          
                        }
                        if (DATA.ID > 0) {
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
                                var item={}
                                for (var i = 1; i <= AllItem.length; i++) {
                                    if (AllItem[i - 1].ID == model.query.sid) {
                                        item = AllItem[i-1];
                                    }
                                }
                                selected = [];
                                var str = "";
                                for (var i = 1; i <= item.UnqualifiedOptions.length; i++) {
                                    for (var j = 1; j <= DATA.Reason.length; j++) {
                                        if (DATA.Reason[j-1] == item.UnqualifiedOptions[i-1]) {
                                            selected.push(i);
                                            //SName.push(DATA.Reason[j - 1]);
                                        }
                                    }
                                }
                                for (var j = 1; j <= DATA.Reason.length; j++) {
                                    str += DATA.Reason[j - 1] + " ;  ";
                                }
                                $(".w-option-content").val(str);
                            }
                            var list1 = [];
                            for (var i = 0; i < DATA.ImageList.length; i++) {
                                list1.push({ Src: DATA.ImageList[i], Id: DATA.ImageList[i] })
                            }
                            $(".upload-list").prepend($com.util.template(list1, HTML.IMG));
                        }
                    });
                });
            } else {
                model.com.getTask({
                    EventID: window._eventID, ID: model.query.id
                }, function (data) {
                    Info = data.info;
                    AllItem = data.list;
                    var list = data.Result;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].ItemID == Number(model.query.sid))
                            DATA = list[i];
                    }
                    if (DATA.ID == 0) {
                        _data.itemText = "操作面板";
                        _data.remark = "";
                        model.com.render(_data);
                        //$("#item2 .m-c-body").html("  ");
                    }
                    if (DATA.ID > 0) {
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
                            var item = {}
                            for (var i = 1; i <= AllItem.length; i++) {
                                if (AllItem[i - 1].ID == model.query.sid) {
                                    item = AllItem[i - 1];

                                }
                            }
                            selected = [];
                            var str = "";
                            for (var i = 1; i <= item.UnqualifiedOptions.length; i++) {
                                for (var j = 1; j <= DATA.Reason.length; j++) {
                                    if (DATA.Reason[j - 1] == item.UnqualifiedOptions[i - 1]) {
                                        selected.push(i);
                                       // SName.push(DATA.Reason[j - 1]);
                                    }
                                }
                            }
                            for (var j = 1; j <= DATA.Reason.length; j++) {
                                str += DATA.Reason[j - 1] + " ;  ";
                            }
                            $(".w-option-content").val(str);
                        }
                        var list = [];
                        for (var i = 0; i < DATA.ImageList.length; i++) {
                            list.push({ Src: DATA.ImageList[i], Id: DATA.ImageList[i] })
                        }
                        $(".upload-list").prepend($com.util.template(list, HTML.IMG));
                    }
                });
            }
        },

        com: {
            //扫描
            getScan: function (data, fn, context) {
                var d = {
                    $URI: "/TaskHandle/ScanQRCode",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
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
                    $URI: "/SFCTaskSpot/Update",
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

                var _data = [{
                    itemTex: "",
                    ResonList: [{ Id: 0, Checked: "", Name: "" }],
                    imgs: [{ Src: "", Id: "" }],
                    remark: "",
                }];




                $("#item1 .m-c-head").text(data.itemText);
                //$("#item2 .m-c-body").html($com.util.template(data.ResonList, HTML.IPT));

                if (data.remark)
                    $("#desc").html(data.remark);

                $(".upload-list").prepend($com.util.template(data.imgs, HTML.IMG));
            },

            addCheck: function () {
                if ($("item1-true").attr("checked")==true) {
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