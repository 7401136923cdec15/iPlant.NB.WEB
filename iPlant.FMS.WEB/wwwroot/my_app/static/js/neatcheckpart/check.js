require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		config,
		current,
		STATUS,
        DATA,
		COLOUR,
        PartList,
		LETTER;

    current = "Status_Sent";

    HTML = {
        TITLE: [  '<div class="m-c-panel" id="item1">',
            '<div class="m-table">',
                '<div class="ms-group clearfix">',
                    '<div class="ms-col ms-col-f" style="width: 100%" ;>',
                        '<div class="ms-title">',
                           ' <span class="ms-text">{{PartName}}</span>',
                            '<div class="ms-sub-title">',
                                '<span class="ms-field">',
                                    '<span class="ms-label">产品型号:</span>',
                                    '<span class="ms-text">{{ProductNo}}</span>',
                                '</span>',
                            '</div>',
                            '<div class="ms-sub-title">',
                                '<span class="ms-field">',
                                    '<span class="ms-label">产线:</span>',
                                    '<span class="ms-text">{{LineName}}</span>',
                                    '<span class="ms-label">物料名称:</span>',
                                    '<span class="ms-text">{{MaterialName}}</span>',
                               ' </span>',
                            '</div>',
                        '</div>',
                   ' </div>',
                '</div>',
            '</div>',
        '</div>'].join(""),
        LIST: ['<div class="m-c-panel">',
                 ' <div class="m-c-head">{{MaterialName}}',
                      '<div class="tzj-btn" style="width:100%; margin-right:10vw;text-align:right;">',
                           '<svg t="1561903942703" class="icon" style="width:6%;height:3%;margin-bottom: -0.5vw;margin-top:-5vw" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8503" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3 0.1-12.7-6.4-12.7z" p-id="8504" fill="#8a8a8a"></path></svg>',
                      '</div>',
                  '</div>',
                  '<div class="m-c-body m-c-input clearfix tzj-body" style="margin:0vw;padding:0vw;">',
                      '<div style="width:80vw;height:10vw; margin-left:10vw; margin-top:2vw;float:left; ">',
                          '<div style="width:20%;height:100%;float:left;text-align:right;margin-top:1vw;float:left;"><span style="font-size:3.5vw;color:grey">需求量:</span></div>',
                          '<div style="width:30%;height:100%;padding-left: 3vw;margin-top:1vw;float:left;"><span style="font-size:3.6vw;">{{FQTYDemand}}</span></div>',
                          '<div style="width:20%;height:100%;float:left;text-align:right;float:left;margin-top:1vw;"><span class="ms-label"><span style="font-size:3.5vw;color:grey">在线库存:</span></span></div>',
                          '<div style="width:30%;height:100%;padding-left: 2vw;float:left;"><input type="text" style="height:7vw; border:1px solid #a1a1a1;border-radius:3px;" value={{FQTYOnSite}} /></div>',
                      '</div>',
                  '</div>',
                   '<hr class="tzj-line" style="margin:0px;height:1px;border:0px;background-color:#D5D5D5;color:#D5D5D5;opacity: 0.35;" />',
              '</div>'].join(""),
        LISTYJ: ['<div class="m-c-panel">',
                ' <div class="m-c-head">{{MaterialName}}',
                     '<div class="tzj-btn" style="width:100%; margin-right:10vw;text-align:right;">',
                           '<svg t="1561903592109" class="icon" style="width:6%;height:3%;margin-bottom: -0.5vw;margin-top:-5vw" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7969" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M765.7 486.8L314.9 134.7c-5.3-4.1-12.9-0.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1c16.4-12.8 16.4-37.6 0-50.4z" p-id="7970" fill="#8a8a8a"></path></svg>',
                     '</div>',
                 '</div>',
                 '<div class="m-c-body m-c-input clearfix tzj-body" style="margin:0vw;padding:0vw;display:none">',
                     '<div style="width:80vw;height:10vw; margin-left:10vw; margin-top:2vw;float:left; ">',
                         '<div style="width:20%;height:100%;float:left;text-align:right;margin-top:1vw;float:left;"><span style="font-size:3.5vw;color:grey">需求量:</span></div>',
                         '<div style="width:30%;height:100%;padding-left: 3vw;margin-top:1vw;float:left;"><span style="font-size:3.6vw;">{{FQTYDemand}}</span></div>',

                         '<div style="width:20%;height:100%;float:left;text-align:right;float:left;margin-top:1vw;"><span class="ms-label"><span style="font-size:3.5vw;color:grey">在线库存:</span></span></div>',
                         '<div style="width:30%;height:100%;padding-left: 3vw;margin-top:1vw;float:left;"><span style="font-size:3.6vw;">{{FQTYOnSite}}</span></div>',
                     '</div>',
                 '</div>',
                  '<hr class="tzj-line" style="margin:0px;height:1px;border:0px;background-color:#D5D5D5;color:#D5D5D5;opacity: 0.35;" />',
             '</div>'].join(""),
    };

    model = $com.Model.create({
        name: '工序齐套检查',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {

            $("#back").click(function () {
                window.location = "partlist.html";
            });

            $("#confirm").click(function () {
                var list = [];
                $("input[type='text']").each(function () {
                    list.push($(this).val());
                });
                for (var i = 0; i < PartList.length; i++) {
                    PartList[i].FQTYOnSite = list[i];
                }
                DATA.MaterialList=PartList;
                model.com.save({
                    data: DATA
                }, function (data) {
                    alert("提交成功！");
                    window.location = "partlistYJ.html";
                });
            });
            $("body").delegate(".tzj-btn", "click", function () {
                if ($(this).parent().next().is(":hidden")) {
                    $(this).parent().next().show();
                    $(this).html('<svg t="1561903942703" class="icon" style="width:6%;height:3%;margin-bottom: -0.5vw;margin-top:-5vw" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8503" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3 0.1-12.7-6.4-12.7z" p-id="8504" fill="#8a8a8a"></path></svg>');
                } else {
                    $(this).parent().next().hide();
                    $(this).html('<svg t="1561903592109" class="icon" style="width:6%;height:3%;margin-bottom: -0.5vw;margin-top:-5vw" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7969" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M765.7 486.8L314.9 134.7c-5.3-4.1-12.9-0.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1c16.4-12.8 16.4-37.6 0-50.4z" p-id="7970" fill="#8a8a8a"></path></svg>');
                }
            });
        },

        run: function () {
            if (window._eventID == 0) {
                window._eventID = 1008;
            }
            if (model.query.sid && model.query.sid != 0) {
                model.com.get({
                    ID: model.query.id, CheckID: model.query.sid, EventID: window._eventID,
                }, function (data) {
                    DATA = data.info;
                    PartList = data.info.MaterialList;
                    $("#m-card").html($com.util.template(data.info, HTML.TITLE));
                    $("#tzj-table").html($com.util.template(data.info.MaterialList, HTML.LISTYJ));
                    $("#confirm").hide();
                });
            } else {
                model.com.get({
                    ID: model.query.id, EventID: window._eventID, CheckID: 0
                }, function (data) {
                    DATA = data.info;
                    PartList = data.info.MaterialList;
                    $("#m-card").html($com.util.template(data.info, HTML.TITLE));
                    $("#tzj-table").html($com.util.template(data.info.MaterialList, HTML.LIST));
                });
            }
        },

        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/TaskHandle/Info",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            save: function (data, fn, context) {
                var d = {
                    $URI: "/SFCMaterialCheck/TaskStepSave",
                    $TYPE: "post"
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