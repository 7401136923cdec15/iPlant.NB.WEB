require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/entry'], function ($yang, $com, iForm) {

    var model,
		HTML,
		formModel,
        KEYWORD,
		KEYWORD_LIST,
        list,
        Tid,
        wstatus,
         wFactory,
        wFactory = [];
         STATUS = ["合格", "合格", "不合格"];

         COLOUR = ["text-yellow", "text-blue", "text-red"];
    HTML = {
        LIST: ['<li>',
             '<label class="m-detail-title">{{name}}</label>',
             '<div class="m-detail-content">{{value}}</div>',
             '</li>'].join(""),
       
    };

    KEYWORD_LIST = [
          "LineName|产线",
          "WorkShopName|车间",
          "BusinessUnitName|事业部",
         "FactoryName|工厂",
         "TypeName|维修类型",
         "ApplyNo|申请编号",
         "ModelNo|设备型号",
         "LedgerCode|设备编码",
         
         //"OperatorName|保养人",
         //"ConfirmName|确认人",
         //"Comment|备注",
         //"Reason|理由",
         //"LifeWastage|寿命损耗",
         //"ValueWastage|价值损耗",
         //"LimitWastage|加工数损耗",
         //"PDNumCur|加工数",
         //"PDTimeCur |加工时长",
         //"CurrentTimes|保养次数",
         //"ConfirmTime|确认时间|DateTime",
         //"StartTime|开始时间|DateTime",
         //"EndTime|结束时间|DateTime",
    ];
    KEYWORD = {};

    model = $com.Model.create({
        name: '维修申请详情',

        type: $com.Model.MAIN,

        data: {},

        configure: function () {
            this.run();
            KEYWORD_LIST.forEach(function (item, i) {
                var detail = item.split("|");
                KEYWORD[detail[0]] = {
                    index: i,
                    name: detail[1]
                };
            });
        },

        events: function () {
            $(".m-card").delegate(".list-group-item:not(.stop-expand)", "click", function (e) {
                var $this = $(this),
					$expand = $this.find(".item-icon .icon"),
					//里面是否已经有表单
					IDs = $this.attr("data-id");
                if ($expand.hasClass("icon-arrow-expand")) {
                    $expand.removeClass("icon-arrow-expand");

                    $this.siblings().hide(); //ul元素消失
                } else {

                    $expand.addClass("icon-arrow-expand");
                    $this.siblings().show(); //ul显示 
                }

                e.stopPropagation(); //阻止事件冒泡
                e.preventDefault(); //preventDefault() 方法阻止元素发生默认的行为
            });

            $("body").delegate("#byrevoke", "click", function () {
                confirm("撤销成功！", function (bool) {
                    if (bool == true) {
                        if (list.Status == 1) {
                            list.Status = 2;
                        }
                     
                        model.com.save({ data: list }, function (res) {
           
                         window.location = "apply.html";

                        });
                    } else {
                        return false;
                    }
                })
            });
         
        },

        run: function () {
            var Wstatustext = model.query.statustext;
            wstatus = Number(model.query.status);
           $(".tip-content").html(Wstatustext);
           if (wstatus==1) {
               $(".zace-cx").show();
           }
           model.com.Factory({
               OAGetType: 0
           }, function (data) {
               wFactory = data.list;
               model.com.get({
                   ID: model.query.id,
                   ApplyNo: model.query.aID,
                   HasName: 1,
               }, function (data) {
                   list = data.info;
                   model.com.render(list);
               });
           });  
        },

        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceRepairApply/Info",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
           
            save: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceRepairApply/Update",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            Factory: function (data, fn, context) {
                var d = {
                    $URI: "/FMCFactory/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            render: function (list) {
                var DeviceData = [];
                if (list.FactoryID == 0) {
                    list.FactoryName = "新能源";
                } else {
                    for (var i = 0; i < wFactory.length; i++) {
                        if (list.FactoryID == wFactory[i].ID) {
                            DeviceData.push(wFactory[i]);
                        }
                    }
                    list.FactoryName = DeviceData[0].Name;
                }
                var _data = [];
                for (var p in list) {
                    var o = KEYWORD[p];
                    if (o) {
                        _data[Number(o.index)] = {
                            name: o.name,
                            value: list[p] === "" ? "&nbsp;" : list[p]
                        };
                    }
                }

                $(".m-detail-list").html($com.util.template(_data, HTML.LIST));

            },
         
        }
    });

    model.init();

}); //# sourceMappingURL=maps/detail-0d4b39aba7.js.map