require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/entry'], function ($yang, $com, iForm) {

    var model,
		HTML,
		formModel,
        KEYWORD,
		KEYWORD_LIST,
        list,
        wstatus,
        wID,
         wFactory,
        wSpare,
        wFactory = [];
       wSpare = [];
         Resource = ["默认", "DMS", "MES"];
    TaskType = ["默认", "保养", "维修", "点检"];
    STATUS = ["合格", "合格", "不合格"];

    COLOUR = ["text-yellow", "text-blue", "text-red"];
    HTML = {
        LIST: ['<li>',
             '<label class="m-detail-title">{{name}}</label>',
             '<div class="m-detail-content">{{value}}</div>',
             '</li>'].join(""),
        SUB_LIST: ['<li class="list-li">',
           '<div class="list-group-item"  data-id="{{ID}}">',
           '<div class="list-group-item-cell item-static item-title"  style="width:30%">',
           '<span>{{Name}}</span>',
           '</div>',
           '<div class="list-group-item-cell item-static item-time" style="width:50%">',
           '<span>{{Comment}}</span>',
           '</div>',
           '<div class="list-group-item-cell item-static item-state" style="width:15%">',
           '<span class="item-state {{resultColor}}">{{resultText}}</span>',
           '</div>',
           '<div class="list-group-item-cell item-icon" style="width:5%">',
           '<i class="icon icon-arrow-right"></i>',
           '</div>',
           '</div>',
           '<div class="list-group-sub">',
           '<div class="m-c-panel" mode="n-select-radio">',
           '<div class="m-c-head">保养项结果</div>',
           '<div class="m-c-body m-c-ring clearfix" value-list="1]=[]=[合格],[2]=[]=[不合格">',
           '<div class="w-option">',
           '<span class="w-option-content actual-result" data-value="{{Result}}">{{resultText}}</span>',
           '<div class="w-option-icon">',
          '</div> </div></div></div>',

             '<div class="m-c-panel" mode="n-select-radio">',
			'<div class="m-c-head">任务类型</div>',
			'<div class="m-c-body m-c-ring clearfix" value-list="1]=[]=[保养],[2]=[]=[维修],[3]=[]=[点检">',
			'<div class="w-option">',
			'<span class="w-option-content actual-tasktype" data-value="{{TaskType}}">{{TaskTypeText}}</span>',
			'<div class="w-option-icon">',
			'</div> </div></div></div>',

            '<div class="m-c-panel" mode="n-select-radio">',
			'<div class="m-c-head">任务来源</div>',
			'<div class="m-c-body m-c-ring clearfix" value-list="1]=[]=[DMS],[2]=[]=[MES">',
			'<div class="w-option">',
			'<span class="w-option-content actual-resource" data-value="{{Resource}}">{{ResourceText}}</span>',
			'<div class="w-option-icon">',
			'</div> </div></div></div>',

           '{{ITEMControl}}',
           '<div class="m-c-panel">',
           '<div class="m-c-head">备注</div>',
           '<div class="m-c-body m-c-input clearfix ">',
           '<textarea rows="2" placeholder="" class="actual-remark">{{JgComment}}</textarea>',
           '</div></div>',
           '</div>', //填表单
           '</li>'].join(""),
    };

    KEYWORD_LIST = [
          "LineName|产线",
          "WorkShopName|车间",
         "BusinessUnitName|事业部",
         "FactoryName|工厂",
         "TypeName|保养类型",
         "ApplyNo|申请编号",
         "ModelNo|备件型号",
         "LedgerCode|备件编码",
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
        name: '保养任务详情',

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

        },

        run: function () {
            wID = Number(model.query.id);
            var Wstatustext = model.query.statustext;
            wstatus = Number(model.query.status);
           $(".tip-content").html(Wstatustext);
           if (wstatus == 1 || wstatus == 2) {
               $("#start").hide();
           }
           model.com.Factory({
               OAGetType: 0
           }, function (data) {
               wFactory = data.list;
               model.com.getSpareModel({
                   SpareWorkType: 0, SupplierID: 0, ModelPropertyID: 0,
                   Active: -1, SupplierModelNo: "",
                   StartTime: "2019-02-10 15:38:29", EndTime: "2029-05-10 15:38:29"
               }, function (data_spare) {
                   wSpare = data_spare.list;
                   model.com.get({
                       ID: model.query.id,
                       ApplyID: model.query.aID,
                       HasName: 1,
                   }, function (data) {
                       list = data.info;
                       model.com.render(list);
                       model.com.rederItemList(data);
                   });
               });
           });

        },

        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainTask/Info",
                    $TYPE: "get",
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
            //获取所有备件型号（台账）
            getSpareModel: function (data, fn, context) {
                var d = {
                    $URI: "/SpareModel/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            save: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainTask/Update",
                    $TYPE: "post",
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
                var spareData = [];
                for (var i = 0; i < wSpare.length; i++) {
                    if (list.ModelID == wSpare[i].ID) {
                        spareData.push(wSpare[i]);
                    }
                }
                list.ModelNo = spareData[0].ModelNo;
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
            rederItemList: function (data) {
                var wlist = [];
                var wValue = [];
                model._list = data.result && data.result.length > 0 ? data.result : [];
                $.each(data.list, function (i, item) {
                    if (data.result[i].Result == true) {
                        data.result[i].Result = 1;
                    } else {
                        data.result[i].Result = 2;
                    }
                    var iptValue = {
                        ID: 0,
                        ItemID: item.ID,
                        TaskID: wID,
                        TaskType: 0,
                        Comment: "",
                        Reason: [],
                        EditTime: $com.util.format("yyyy-MM-dd hh:mm:ss", new Date()),
                        ImageList: [],
                        Resource: 0,
                        Result: true,
                    };
                    wValue.push(iptValue);

                    _item = {
                        ID: item.ID,
                        Name: item.Name,
                        Comment: item.Comment,
                        resultText: STATUS[data.result[i].Result],
                        resultColor: COLOUR[data.result[i].Result],
                        TaskTypeText: TaskType[data.result[i].TaskType],
                        ResourceText: Resource[data.result[i].Resource],
                        JgComment: data.result[i].Comment,
                    }
                    wlist.push(_item);

                })

                if (model._list <= 0) {
                    model._list = wValue;
                };

                $(".handle-info .list-group").html($com.util.template(wlist, HTML.SUB_LIST));

            },
        }
    });

    model.init();

}); //# sourceMappingURL=maps/detail-0d4b39aba7.js.map