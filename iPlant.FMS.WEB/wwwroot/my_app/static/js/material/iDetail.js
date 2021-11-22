require(['../static/utils/js/jquery/jquery-3.1.1', '../static/utils/js/src/common-light'], function ($yang, $com) {


    var model, HTML, config, current, STATUS, COLOUR, KEYWORD, KEYWORD_LIST;

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
                    '<label class="m-detail-title">{{name}}</label>',
                    '<div class="m-detail-content">{{value}}</div>',
                '</li>'].join("")
    };

    KEYWORD_LIST = [
        "LineID|产线",
        "PartName|任务",
        "PartPointName|工序",
        "DeviceNo|设备",
        "MaterialNo|物料号",
        "MaterialName|物料名称",
        "FQTY|配料数",
        "FQTY_LL|领料数",
        "CompounderName|配料员",
        "CompoundTimelong|配料时间",
        "OperatorName|领料员",
        "ReceiveTimelong|领料时间"
    ];

    KEYWORD = {};

    model = $com.Model.create({

        name: 'iPlantApp',

        type: $com.Model.MAIN,

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
            $("#confirm").click(function () {
                window.location = "list.html?OperateType=" + model.query.OperateType;
            });
        },

        run: function () {
            this.com.get({ OperateType: model.query.OperateType }, function (data) {
                model.com.render(model.com.filter(data.list));
            });
        },

        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/GetMaterial/GetMaterialTasks",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            filter: function (data) {
                var _data = [],
                    _status = "";
                $(data).each(function (i, item) {
                    if (this.ID == model.query.id) {
                        _status = this.Status;
                        for (var p in item) {
                            var o = KEYWORD[p];
                            if (o) {
                                _data[Number(o.index)] = {
                                    name: o.name,
                                    value: p.indexOf("Timelong") >= 0 ? $com.util.format("yyyy-MM-dd hh:mm:ss", item[p]) : item[p]
                                };
                            }
                        }
                    }
                });

                return {
                    data: _data,
                    status: _status
                };
            },

            render: function (data) {
                $(".m-detail-list").html($com.util.template(data.data, HTML.LIST));
                $(".tip-content").html(data.status);
            }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/iDetail-27ad1f59f2.js.map
