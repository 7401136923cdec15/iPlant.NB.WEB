require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/entry'], function ($yang, $com, iForm) {

    var model,
		HTML,
		formModel,
        KEYWORD,
		KEYWORD_LIST,
        list,
        Tid,
        wstatus,

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
           '<svg width="15px" height="26px" viewBox="0 0 15 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
           '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
           '<g transform="translate(-510.000000, -341.000000)" stroke="#BDBDBD" stroke-width="2">',
           '<g transform="translate(517.500000, 354.000000) rotate(-360.000000) translate(-517.500000, -354.000000) translate(510.000000, 341.000000)">',
           '<path d="M13.6388889,13.7272727 L1.36111111,24.6363636"></path>',
           '<path d="M2.80555556,1.54545455 L13.6388889,13.9090909"></path></g></g></g>',
           '</svg></div> </div></div></div>',

             '<div class="m-c-panel" mode="n-select-radio">',
			'<div class="m-c-head">任务类型</div>',
			'<div class="m-c-body m-c-ring clearfix" value-list="1]=[]=[保养],[2]=[]=[维修],[3]=[]=[点检">',
			'<div class="w-option">',
			'<span class="w-option-content actual-tasktype" data-value="{{TaskType}}">{{TaskTypeText}}</span>',
			'<div class="w-option-icon">',
			'<svg width="15px" height="26px" viewBox="0 0 15 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
			'<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
			'<g transform="translate(-510.000000, -341.000000)" stroke="#BDBDBD" stroke-width="2">',
			'<g transform="translate(517.500000, 354.000000) rotate(-360.000000) translate(-517.500000, -354.000000) translate(510.000000, 341.000000)">',
			'<path d="M13.6388889,13.7272727 L1.36111111,24.6363636"></path>',
			'<path d="M2.80555556,1.54545455 L13.6388889,13.9090909"></path></g></g></g>',
			'</svg></div> </div></div></div>',

            '<div class="m-c-panel" mode="n-select-radio">',
			'<div class="m-c-head">任务来源</div>',
			'<div class="m-c-body m-c-ring clearfix" value-list="1]=[]=[DMS],[2]=[]=[MES">',
			'<div class="w-option">',
			'<span class="w-option-content actual-resource" data-value="{{Resource}}">{{ResourceText}}</span>',
			'<div class="w-option-icon">',
			'<svg width="15px" height="26px" viewBox="0 0 15 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
			'<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
			'<g transform="translate(-510.000000, -341.000000)" stroke="#BDBDBD" stroke-width="2">',
			'<g transform="translate(517.500000, 354.000000) rotate(-360.000000) translate(-517.500000, -354.000000) translate(510.000000, 341.000000)">',
			'<path d="M13.6388889,13.7272727 L1.36111111,24.6363636"></path>',
			'<path d="M2.80555556,1.54545455 L13.6388889,13.9090909"></path></g></g></g>',
			'</svg></div> </div></div></div>',

           '{{ITEMControl}}',
           '<div class="m-c-panel">',
           '<div class="m-c-head">备注</div>',
           '<div class="m-c-body m-c-input clearfix ">',
           '<textarea rows="2" placeholder="请填写巡检项备注" class="actual-remark">{{JgComment}}</textarea>',
           '</div></div>',
           '</div>', //填表单
           '</li>'].join(""),
    };

    KEYWORD_LIST = [
          "LineName|产线",
          "WorkShopName|车间",
         "ApplyNo|申请编号",
         "ModelNo|设备型号",
         "LedgerCode|设备编码",
         "TypeName|保养类型",
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
            $("#back").click(function () {
                //if (window.history.length > 0) {
                //    window.history.back();
                //}
                //else {
                //    window.location = "list_fq.html";
                //}
                switch (Tid) {
                    case 1:
                        window.location = "list_cl.html";
                        break;
                    case 2:
                        window.location = "list_fq.html";
                        break;
                    case 3:
                        window.location = "list_qr.html";
                        break;
                    default:
                        break;
                }
            });
            $("body").delegate("#bystart", "click", function () {
                confirm("开始保养！", function (bool) {
                    if (bool == true) {
                        if (list.Status == 1) {
                            list.Status = 2;
                        }
                        model.com.save({ data: list }, function (res) {
                            switch (Tid) {
                                case 1:
                                    window.location = "list_cl.html";
                                    break;
                                case 2:
                                    window.location = "list_fq.html";
                                    break;
                                case 3:
                                    window.location = "list_qr.html";
                                    break;
                                default:
                                    break;
                            }

                        });
                    } else {
                        return false;
                    }
                })
            });
            $("body").delegate("#byfinish", "click", function () {
                confirm("保养完成！", function (bool) {
                    if (bool == true) {
                        if (list.Status ==2) {
                            list.Status = 3;
                        }

                        model.com.save({ data: list }, function (res) {
                            switch (Tid) {
                                case 1:
                                    window.location = "list_cl.html";
                                    break;
                                case 2:
                                    window.location = "list_fq.html";
                                    break;
                                case 3:
                                    window.location = "list_qr.html";
                                    break;
                                default:
                                    break;
                            }
                        });
                    } else {
                        return false;
                    }
                })
            });
            $("body").delegate("#reject", "click", function () {
                confirm("驳回成功！", function (bool) {
                    if (bool == true) {
                        if (list.Status == 3) {
                            list.Status = 4;
                        }
                        var Value = $("#count").val();
                        if (Value == "") {
                            alert("请填写理由！");
                            return false;
                        } else {
                            list.Reason = Value;
                        }
                        model.com.save({ data: list }, function (res) {
                            switch (Tid) {
                                case 1:
                                    window.location = "list_cl.html";
                                    break;
                                case 2:
                                    window.location = "list_fq.html";
                                    break;
                                case 3:
                                    window.location = "list_qr.html";
                                    break;
                                default:
                                    break;
                            }
                        });
                    } else {
                        return false;
                    }
                })
            });

            $("body").delegate("#confirm", "click", function () {
                confirm("确认成功！", function (bool) {
                    if (bool == true) {
                        if (list.Status == 3) {
                            list.Status = 5;
                        }
                        var Value = $("#count").val();
                        if (Value == "") {
                            alert("请填写理由！");
                            return false;
                        } else {
                            list.Reason = Value;
                        }
                        model.com.save({ data: list }, function (res) {
                            switch (Tid) {
                                case 1:
                                    window.location = "list_cl.html";
                                    break;
                                case 2:
                                    window.location = "list_fq.html";
                                    break;
                                case 3:
                                    window.location = "list_qr.html";
                                    break;
                                default:
                                    break;
                            }
                        })
                    } else {
                        return false;
                    }
                })
            })
            $("body").delegate("#cancel", "click", function () {
                confirm("取消！", function (bool) {
                    if (bool == true) {
                        switch (Tid) {
                            case 1:
                                window.location = "list_cl.html";
                                break;
                            case 2:
                                window.location = "list_fq.html";
                                break;
                            case 3:
                                window.location = "list_qr.html";
                                break;
                            default:
                                break;
                        }
                    } else {
                        return false;
                    }
                })
            })
        },

        run: function () {
            Tid=Number(model.query.TagID);
            var Wstatustext = model.query.statustext;
            wstatus = Number(model.query.status);
           $(".tip-content").html(Wstatustext);
           switch (wstatus) {
               case 0:
                   break;
               case 1:
                   $(".zace-dks").show();
                   break;
               case 2:
                   $(".zace-zxz").show();
                   break;
               case 3:
                   $(".zace-dqr").show();
                   break;
               case 4:
                   $(".zace-bhqr").show();                 
                   break;
               case 5:
                   $(".zace-bhqr").show();
                   break;
               default:
                   break;

           }



            model.com.get({
                ID: model.query.id,
                ApplyID: model.query.aID,
                HasName:1,
            }, function (data) {
             list = data.info;          
             model.com.render(list);
             model.com.rederItemList(data);
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

                $.each(data.list, function (i, item) {
                    _item = {
                        ID: item.ID,
                        Name: item.Name,
                        Comment: item.Comment,
                        resultText: STATUS[0],
                        resultColor: COLOUR[0],
                    }
                })

                $(".handle-info .list-group").html($com.util.template(_item, HTML.SUB_LIST));
                var iptValue = {
                    ID: 0,
                    ItemID: 0,
                    TaskID: wID,
                    TaskType: 1,
                    Comment: "",
                    Reason: [],
                    EditTime: $com.util.format("yyyy-MM-dd hh:mm:ss", new Date()),
                    ImageList: [],
                    Resource: 1,
                    Result: true,
                };
                model._list = data.result && data.result.length > 0 ? data.result : [];
                model._list.push(iptValue);
                //if (data.result.length == 0) {
                //    model._list.push(iptValue);
                //} else {
                //    model._list.push(data.result);
                //}

            },
        }
    });

    model.init();

}); //# sourceMappingURL=maps/detail-0d4b39aba7.js.map