require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		config,
		current,
		STATUS,
        DATA,
		COLOUR,
		LETTER;

    current = "Status_Sent";

    STATUS = {
        "PointCheck_Unfinished": "未完成",
        "PointCheck_Finished": "已完成",
        "PointCheck_Unchecked": "未检",
        "PointCheck_Checked": "已检"
    };

    COLOUR = {
        "PointCheck_Unfinished": "text-red",
        "PointCheck_Finished": "",
        "PointCheck_Unchecked": "text-red",
        "PointCheck_Checked": ""
    };

    HTML = {
        LIST: ['<li>',
			'<label class="m-detail-title">{{Name}}</label>',
			'<div class="m-detail-content">{{Content}}</div>',
			'</li>'].join(""),
        CAUSE: '<div class="m-detail-remark" style="margin-top:0;">{{Cause}}</div>',
        IMG: '<li class="upload-img"><img src="/upload/{{Url}}" alt="" data-id="{{Url}}"></li>'
    };

    model = $com.Model.create({
        name: 'iPlantApp',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            $("#back").click(function () {
                window.location = "itemDetail.html?id=" + model.query.id;
            });

            $("#backR").click(function () {
                window.location = "item.html?id=" + model.query.id;
            });

            $("#Repair").click(function () {
                window.location = "partcheck.html?id=" + model.query.id + "&sid=" + model.query.Sid;
            });
        },

        run: function () {
            var _data = {
                data: { Name: "", Content: "" },
                imgs: [{ Src: "", Id: "" }],
            }
            //model.com.getItem({
            //    ModelID: -1, Name: "",
            //    Active: -1, StartTime: "2000-01-01", EndTime: "2000-01-01",
            //    BusinessUnitID: 0, BaseID: 0, FactoryID: 0,
            //    WorkShopID: 0, LineID: 0, ConfigType: 0
            //}, function (data) {
            //    AllItem = data.list;
                model.com.get({
                    TaskID: Number(model.query.id), TaskType: 0, Resource: 0, StartTime: "2000-01-01", EndTime: "2000-01-01",
                }, function (data) {
                    var list = data.list;
                    //var DATA = {};
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].ID == Number(model.query.sid))
                            DATA = list[i];
                    }
                    //for (var i = 0; i < AllItem.length; i++) {
                    //    if (DATA.ItemID == AllItem[i].ID) {
                    //        for (var j = 1; j <= AllItem[i].UnqualifiedOptions.length; j++) {
                    //            _data.ResonList[j - 1] = { Id: j, Checked: "checked", Name: AllItem[i].UnqualifiedOptions[j - 1], Reason: DATA.Reason }
                    //        }
                    //    }
                    //}
                    _data.data.Name = "备注：";
                    _data.data.Content = DATA.Comment;
                    //_data.remark = "";
                    //DATA.Comment= _data.remark;
                   

            
          
            model.com.render(_data);
                });
            
        },

        com: {
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

            filter: function (data) {
                var _data = [],
					_img = [];
                $.each(data.itemList.dMSIPTItem, function (i, item) {
                    if (item.ItemID != model.query.Sid) {
                        return true;
                    }
                    _data.push({
                        Name: item.ItemText,
                        Content: item.ItemResult == 1 ? "合格" : "不合格",
                    });
                    if (item.unreadyList.dMSItem && item.unreadyList.dMSItem.length) {
                        var _reason = "";
                        $.each(item.unreadyList.dMSItem, function (d_i, d_item) {
                            if (d_item.result) {
                                if (_reason.length)
                                    _reason += "<br/>" + d_item.Name;
                                else
                                    _reason += d_item.Name;
                            }
                        });
                        if (_reason.length) {
                            _data.push({
                                Name: "不合格原因",
                                Content: $com.util.template({
                                    Cause: _reason
                                }, HTML.CAUSE),
                            });
                        }
                    }
                    if (item.method) {
                        _data.push({
                            Name: "检查方式",
                            Content: item.method,
                        });
                    }
                    if (item.standard) {
                        _data.push({
                            Name: "检查标准",
                            Content: item.standard,
                        });
                    }
                    if (item.remark) {
                        _data.push({
                            Name: "结果描述",
                            Content: $com.util.template({
                                Cause: item.remark
                            }, HTML.CAUSE),
                        });
                    }
                    if (item.PictureList && item.PictureList.trim().length > 3) {
                        item.PictureListArray = item.PictureList.split("|");
                        $.each(item.pictureListArray, function (p_i, p_item) {
                            _img.push({
                                url: p_item
                            });
                        });
                    }
                    return false;
                });

                return {
                    data: _data,
                    imgList: _img
                };
            },

            render: function (data) {
              
                $(".m-detail-list").html($com.util.template(data.data, HTML.LIST));
                $(".upload-list").html($com.util.template(data.imgList, HTML.IMG));
            }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/detail-13ca772d08.js.map