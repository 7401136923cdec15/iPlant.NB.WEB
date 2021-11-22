﻿require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    var model,
		HTML,
		STATUS,
		COLOUR,
        wModel,
        wModelID,
        wLedger;

   STATUS = ["默认", "待审核", "已撤销", "已审核", "已驳回", "已确认"];
    COLOUR = ["text-grey", "text-yellow", "text-red", "text-blue", "text-red", "text-green"];
    HTML = {
        LIST: ['<div class="ms-group clearfix" data-id="{{ID}}" data-apply="{{ApplyID}}" data-statustext="{{StatusText}}"  data-status="{{Status}}">',
          '<div class="ms-col ms-col-f" >',
			'<div class="ms-limit" >',
            '<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'</span> <span>{{LedgerCode}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			//'<span class="ms-field"><span class="ms-label">型号:</span>',
			//'<span class="ms-text">{{ModelNo}}</span></span>',
            '<span class="ms-field"><span class="ms-label">产线:</span>',
			'<span class="ms-text">{{LineName}}</span></span>',
            '<span class="ms-field"><span class="ms-label">车间:</span>',
			'<span class="ms-text">{{WorkShopName}}</span></span>',
			'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">[备件]</span><span class="ms-label">类型:</span>',
			'<span class="ms-text">{{TypeName}}</span></span>',
			'<span class="ms-field"><span class="ms-label">审批人:</span>',
			'<span class="ms-text">{{ApproverName}}</span> </span>',
			'</div>',
             '<div class="ms-sub-title">',
               '<span class="ms-field"><span class="ms-label">任务时刻:</span>',
               '<span class="ms-text">{{TaskTime}}</span></span>',
               '</span>',
             '</div>',
              '{{ITEMControl}}',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{StatusText}}</span>',
			'</div>',
			'</div>'].join(""),
        ITEM: {
            Applicant: [
           '<div class="ms-sub-title">',
           '<span class="ms-field"><span class="ms-label">申请时刻:</span>',
           '<span class="ms-text">{{ApplicantTime}}</span></span>',
           '</span>',
           '</div>',
            ].join(""),
            Approver: [
          '<div class="ms-sub-title">',
          '<span class="ms-field"><span class="ms-label">审批时刻:</span>',
          '<span class="ms-text">{{ApproverTime}}</span></span>',
          '</span>',
          '</div>',
            ].join(""),
            Confirm: [
                '<div class="ms-sub-title">',
                '<span class="ms-field"><span class="ms-label">确认时刻:</span>',
               '<span class="ms-text">{{ConfirmTime}}</span></span>',
               '</span>',
                '</div>',
            ].join(""),
        }
    };

    model = $com.Model.create({
        name: '保养申请',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            $("body").delegate(".femi-search-fuzzy .femi-search-border input.femi-search-content", "input", function () {
                //模糊查询
                var $this = $(this),
                    value = $this.val();
                if (!value || value.length < 1) {
                    $(".ms-group").show();
                } else {
                    $(".ms-group").each(function (i, item) {
                        if ($(item).text().indexOf(value) > 0)
                            $(item).show();
                        else
                            $(item).hide();
                    });
                }
            });
 

            $("body").delegate("#checksq", "click", function () {
                if (!window.JSImpl) {
                    window.location = "create_bj.html";
                } else {
                    window.QRTEST = function (str) {
                        if (!str || str.length < 1)
                            return;
                        model.com.getScan({ QRCode: str }, function (res) {
                            wledger = str;
                            //台账ID
                            wledgerID = res.info.ID;
                            if (!res.info || !res.info.QRType || !res.info.ID) {
                                alert("二维码识别失败，请检查是否扫描错误！");
                            } else {
                              
                                model.com.getSpareLedger({
                                    ID: wledgerID, AssetID: 0, SpareNo: ""
                                }, function (data) {
                                    if (data.info.ID == 0) {
                                        alert("设备二维码识别失败！");
                                    } else {
                                        alert("设备二维码扫描成功！");
                                        wModel = data.info.ModelID;
                                        window.location = "create_bj.html?sledgerID=" + wledgerID + "&wstr=" + wledger + "&smodelID=" + wModel;
                                    }
                                })

                            }
                        })
                    }
                    window.JSImpl.readQRCode('QRTEST', "请扫备件型号码！");
                }
            });
            $("body").delegate("#checkby", "click", function () {
                window.location = "list_cl_bj.html";
            });
            $("body").delegate("#checkxq", "click", function () {
                window.location = "apply_bj.html";
            });
            $("body").delegate(".ms-group", "click", function () {
                var $this = $(this),
                    id = $this.attr("data-id"),
                    applyno = $this.attr("data-apply"),
                    status = $this.attr("data-status");
                statustext = $this.attr("data-statustext");
                window.location = "detail_ys_bj.html?id=" + id + "&aID=" + applyno + "&status=" + status + "&statustext=" + statustext;
            });
            $("body").delegate("#checkdevice", "click", function () {
                window.location = "list_cl.html";
            });
        },

        run: function () {
          
            model.com.getApply({
                EventID: window._eventID ? window._eventID : 4002,
                person_judge: window._person_judge ? window._person_judge : 0,
                TagValue: 4,
            }, function (data) {
                var wData = [];
                for (var i = 0; i < data.list.length; i++) {
                    if (data.list[i].DSType == 2) {
                        wData.push(data.list[i]);
                    }
                };
                model.com.render(wData);
            });
        },

        com: {

            getApply: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainApply/EmployeeAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

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
            //获取备件台账
            getSpareLedger: function (data, fn, context) {
                var d = {
                    $URI: "/SpareLedger/Info",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);

            },
            render: function (wData) {
                var wlist = [];
                for (i = 0; i < wData.length; i++) {
                    switch (wData[i].Status) {
                        case 0:
                            wData[i].StatusText = "默认";
                            wData[i].Color = "text-grey";
                            break;
                        case 1:
                            wData[i].StatusText = "待审核";
                            wData[i].Color = "text-yellow";
                            htmlTemp = HTML.ITEM.Applicant;
                            var list = [];
                            list.push(wData[i]);
                            wData[i].ITEMControl = $com.util.template(list, htmlTemp);
                            break;
                        case 2:
                            wData[i].StatusText = "已撤销";
                            wData[i].Color = "text-red";
                            htmlTemp = HTML.ITEM.Approver;
                            var list = [];
                            list.push(wData[i]);
                            wData[i].ITEMControl = $com.util.template(list, htmlTemp);
                            break;
                        case 3:
                            wData[i].StatusText = "已审核";
                            wData[i].Color = "text-blue";
                            htmlTemp = HTML.ITEM.Approver;
                            var list = [];
                            list.push(wData[i]);
                            wData[i].ITEMControl = $com.util.template(list, htmlTemp);
                            break;
                        case 4:
                            wData[i].StatusText = "已驳回";
                            wData[i].Color = "text-red";
                            htmlTemp = HTML.ITEM.Confirm;
                            var list = [];
                            list.push(wData[i]);
                            wData[i].ITEMControl = $com.util.template(list, htmlTemp);
                            break;
                        case 5:
                            wData[i].StatusText = "已确认";
                            wData[i].Color = "text-green";
                            htmlTemp = HTML.ITEM.Confirm;
                            var list = [];
                            list.push(wData[i]);
                            wData[i].ITEMControl = $com.util.template(list, htmlTemp);
                            break;
                        default:
                            break;
                    }
                    wlist.push(wData[i]);
                };
                $(".m-table").html($com.util.template(wlist, HTML.LIST));
            }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/list-935a949efd.js.map