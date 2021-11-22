require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		KEYWORD,
		KEYWORD2,
		KEYWORD_LIST,
		KEYWORD_LIST2,
		STOCKSTATUS,
        zinfo,
        zItem,
        zlist,
		IsSubmit;

    IsSubmit = false;

    STOCKSTATUS = ["合格", "报废", "回用", "工序废", "降级"];
    STOCKSTATUS[10006] = "报废";
    STOCKSTATUS[225492] = "回用";
    STOCKSTATUS[225493] = "工序废";
    STOCKSTATUS[225494] = "降级";
    STOCKSTATUS[226962] = "合格";
    STOCKSTATUS[10000] = "合格料";
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
			'</li>'].join(""),
        LIST2: ['<tr data-stockID="{{StockID}}"   data-qr="{{qr}}" data-stockLocID="{{StockLocID}}" >',
			'<td>{{D1}}</td>',
			'<td>{{D2}}</td>',
			'<td>{{D4}}</td>',
			'<td><input type="number"  data-stockID="{{StockID}}"  data-stockLocID="{{StockLocID}}" max="{{D3}}" min="0"   data-min="0"  data-max="{{D3}}"  placeholder="0" /></td>',
			'</tr>'].join(""),
        LIST3: ['<tr>',
			'<td>其他</td>',
			'<td></td>',
			'<td class="FQTYTd"></td>',
			'<td><input type="number"  placeholder="无法扫描" class="FQTYInput" min="0" /></td>',
			'</tr>'].join(""),

        LIST4: ['<tr data-state="{{StateID}}" data-id="{{Id}}" class="tr-control">',
			'<td>{{D1}}</td>',
			'<td>{{D2}}</td>',
			'<td>{{D3}}</td>',
			'<td>{{D4}}</td>',
			'<td style="padding:3.5vw 2vw"><i class="icon icon-arrow-right icon-arrow-expand"></i></td>',
			'</tr>',
			'<tr data-state="{{StateID}}" data-id="{{Id}}" class="tr-sub">',
			'<td colspan="4" style="padding: 0vw 3vw ">',
			'<table>',
			'<thead>',
			'<tr>',
			'<th style="width: 29%;padding: 2vw 0vw;">料盒/批号</th>',
			'<th style="width: 23%;padding: 2vw 0vw;">剩余数</th>',
			'<th style="width: 23%;padding: 2vw 0vw;">库存数</th>',
			'<th style="width: 25%;padding: 2vw 0vw;">取料总数</th>',
			'</tr>',
			'</thead>',
			'<tbody class="BoxTb">{{BoxList}}</tbody>',
			'</table>',
			'</td>',
			'</tr>'].join(""),
        LIST5: ['<tr data-id="{{Id}}" data-bid="{{D1}}" >',
			'<td class="BoxID"  data-state="{{State}}" data-remark="{{Remark}}">{{D1}}</td>',
			'<td class="BoxPlant">{{C1}}</td>',
			'<td class="BoxCount">{{D2}}</td>',
			'<td class="TakeNum">{{D3}}</td>',
			'</tr>'].join(""),
        //jion 将数组用什么连接在一起
    };

    KEYWORD_LIST = [
		"OrderID|订单编号",
		//"WorkShopName|车间",
		"LineName|产线",
		"PartName|工序段",
		"PartPointName|工序",
		"DeviceNo|设备",
		"MaterialNo|物料号",
		"MaterialName|物料名称",
		//"TaskName|圈别",		
		"FQTYPlan|计划数",
        "FQTYMargin|剩余数",
		//"FQTYPlan|仓位计划数",
		"FQTYDone|已配料数",
		"PLOperatorName|配料员",
		"LLOperatorName|领料员"
    ];

    KEYWORD_LIST2 = [
		"OrderID|订单编号",
		"WorkShopName|车间",
		"LineName|产线",
		"PartName|工序段",
		"PartPointName|工序",
		//"DeviceNo|设备",
		"MaterialNo|物料号",
		"MaterialName|物料名称",
		/*"feedBoxID|料盒号",*/
		"FQTYPL|配料数",
		"PLOperatorName|配料员",
		"LLOperatorName|领料员"
    ];

    KEYWORD = {};
    KEYWORD2 = {};

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

            KEYWORD_LIST2.forEach(function (item, i) {
                var detail = item.split("|");
                KEYWORD2[detail[0]] = {
                    index: i,
                    name: detail[1]
                };
            });

            $("#qr").text(model.query.qr);
        },

        events: function () {

            //$(function() {
            //	$(".m-fixedBox").hide();
            //});

            //$("#back").click(function () {
            //    window.location = "info.html?id=" + model.query.id;
            //});

            $("body").delegate(".returnBack", "click", function () {
                window.location = "info.html?id=" + model.query.id;

            });

            $("body").delegate("#confirm", "click", function () {
                confirm("确定配料吗?", function (bool) {
                    if (bool) {
                        model.com.addCheck();
                    } else {
                        return false;
                    }

                })
               
            });

            $("body .view-order").delegate(".m-table-storage tr input", "input", function () {
                var $this = $(this),
					$node = $("#count"),
					total = 0,
					max = Number($this.attr("data-max")),
					val = Number($.trim($this.val()));

                if (val < 0) {
                    $this.val(0);
                }
                if (val > max) {
                    $this.val(max);
                }

                $(".m-table-storage input").each(function (i,item) {

                    total += Number($(this).val());
                });

                if (total > model._data.FQTYMargin) {
                    //input 的值
                    val = model._data.FQTYMargin - (total - $this.val());
                    $this.val(val);
                    total = model._data.FQTYMargin;
                }
                $node.val(total);
                if ($this.attr("class") == "FQTYInput")
                    return;
                //LIST3 
                //$(".view-order .m-table-storage table tbody .FQTYTd").html(model._data.fQTYMargin - total);
                //$(".view-order .m-table-storage table tbody .FQTYInput").attr("max", model._data.fQTYMargin - total);
                //$(".view-order .m-table-storage table tbody .FQTYInput").attr("data-max", model._data.fQTYMargin - total);



            });

        },

        run: function () {
            this.com.get({
                TaskID: model.query.id,
                ID: 0
            }, function (data) {

                data.info.eRPMaterialLocationList = data.list;
                //data.info.locationPlanList = data.info.locationPlanList.wMSMaterialLocation;
                model.com.render(model.com.filter(data.info));
                zinfo = data.info;
                zlist = data.list;
                zItem = data.item;
                //$(".view-order .m-table-storage table tbody .FQTYTd").html(model._data.FQTYMargin);
                //$(".view-order .m-table-storage table tbody .FQTYInput").attr("max", model._data.FQTYMargin);
                //$(".view-order .m-table-storage table tbody .FQTYInput").attr("data-max", model._data.FQTYMargin);


            });

        },

        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/MaterialTask/InfoDetail",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            add: function (data, fn, context) {
                var d = {
                    $URI: "/MaterialTask/Submit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //
            filter: function (data) {
                var _data = [],
					_list = [],

					_status = "";
                //全局变量
                model._data = data;
                for (var p in data) {
                    var o = KEYWORD[p];
                    if (o) {
                        _data[Number(o.index)] = {
                            name: o.name,
                            value: data[p] === "" ? "&nbsp;" : data[p]
                        };
                    }
                }

                $.each(data.LocationPlanList, function (i, itemM) {
                    var _index = -1,
						_Itemlist = [];

                    //_index = _list.findIndex(function (p) {
                    //    if (itemM.locationText == p.qr)
                    //        return true;
                    //});

                    if (_index < 0) {
                        _Itemlist[0] = itemM;
                        _list.push({
                            D1: itemM.StockName,
                            D2: itemM.BatchNo,
                            D3: itemM.FQTYKC,
                            //D3: itemM.FQTYMargin,
                            D4: itemM.FQTYMargin,
                            StockID: itemM.StockID,
                            StockLocID: itemM.LocationID,
                           // qr: itemM.LocationText,
                            Itemlist: _Itemlist,
                        });
                    } else {
                        _list[_index].D4 += itemM.FQTYMargin;
                        _list[_index].D3 += itemM.FQTYKC;
                        _list[_index].Itemlist.push(itemM);
                    }

                });

                _list = model.com.filterStorage(_list);
                return {
                    data: _data,
                    list: _list,
                };
            },

            filter2: function (item) {
                var _data = [],
					_list = [] /*,
				_status = item.StatusText*/ ;

                for (var p in item) {
                    var o = KEYWORD2[p];
                    if (o) {
                        _data[Number(o.index)] = {
                            name: o.name,
                            value: item[p] === "" ? "&nbsp;" : item[p]
                        };
                    }
                }


                return {
                    data: _data,
                    list: _list,
                };
            },
            //
            filterStorage: function (data) {
                var _list = [],
					_data = [];


                $.each(data, function (i, item) {
                    var _storageList = [];
                    item.ItemShowList = [];
                    item.LocationList = [];
                    if (!item.Itemlist || !item.Itemlist.length) {
                        return true;
                    }

                    _list = item.Itemlist;

                    $.each(_list, function (u_i, u_item) {
                        var _index = -1;
                        $.each(item.LocationList, function (j, items) {
                            if (u_item.StockStatus == items.StockStatus)
                                _index = j;
                        })

                        if (_index < 0) {
                            u_item.BoxList = [{
                                ERPFlot_Text: u_item.BatchNo,
                                Id: u_item.ID,
                                State: u_item.StockStatus,
                                D1: u_item.BatchNo,
                                D2: u_item.FQTYKC,
                                C1: u_item.FQTYMargin,
                                D3: 0,
                                Remark: u_item.StockStatusText,
                                FlotText: u_item.BatchNo,
                                ItemID: u_item.ID
                            }];
                            item.LocationList.push(u_item);
                        } else {
                            item.LocationList[_index].BoxList.push({
                                ERPFlot_Text: u_item.BatchNo,
                                Id: u_item.ID,
                                State: u_item.StockStatus,
                                D1: u_item.BatchNo,
                                D2: u_item.FQTYKC,
                                C1: u_item.FQTYMargin,
                                D3: 0,
                                Remark: u_item.StockStatusText,
                                FlotText: u_item.BatchNo,
                                ItemID: u_item.ID
                            });
                            item.LocationList[_index].FQTYMargin += u_item.FQTYMargin;
                            item.LocationList[_index].FQTYKC += u_item.FQTYKC;
                        }
                    })


                    /*	$.each(model._data.eRPMaterialLocationList, function(m, itemM) {
							var _index = -1;
							$.each(_list, function(j, items) {
								if (itemM.itemID == items.iD)
									_index = j;
							})
							if (_index < 0)
								return true;

							if (item.d3)
								item.d3 += itemM.fQTYStock;
							else
								item.d3 = itemM.fQTYStock;

							if (!_list[_index].BoxList)
								_list[_index].BoxList = [];


							_list[_index].BoxList.push({
								ERPFlot_Text : itemM.eRPFlot_Text,
								id : itemM.eRPFlot,
								state : itemM.stockStatus,
								d1 : itemM.feedBoxText,
								d2 : itemM.fQTYStock,
								c1 : 0,
								d3 : 0,
								FlotText : itemM.eRPFlot_Text,
								ItemID : itemM.itemID
							});
						});
*/
                    $.each(item.LocationList, function (si, itemT) {


                        item.ItemShowList.push({
                            Id: itemT.ID,
                            StateID: itemT.StockStatus,
                            D1: STOCKSTATUS[itemT.StockStatus],
                            D2: itemT.FQTYMargin,
                            D3: itemT.FQTYKC,
                            D4: 0,
                            _boxList: itemT.BoxList,
                            boxList: $com.util.template(itemT.BoxList, HTML.LIST5)
                        });
                    })
                    item.ItemList = _list;
                });

                return data;

            },

            render: function (data) {
                //keyword 列表显示
                $(".view-order .m-detail-list").append($com.util.template(data.data, HTML.LIST));
                model._list = data.list;
                //dataMM = [

                //    {
                //        d1: 1,
                //        d2: 2,
                //        d3: 3,
                //        d4: 4

                //    }
                //,
                //    {
                //        d1: 2,
                //        d2: 2,
                //        d3: 3,
                //        d4: 4
                //    }
                //]

                $(".view-order .m-table-storage table tbody").html($com.util.template(data.list, HTML.LIST2));
                $(".m-table-storage input").each(function (i, item) {

                    $(this).val(0);
                });
                $("#count").val(0);
                //$(".tip-content").html(data.status);
            },

            render2: function (data) {
                $(".view-detail .m-detail-list").append($com.util.template(data.data, HTML.LIST));
                //$(".view-detail .tip-content").html(data.status);
            },
            renderStorage: function (data) {
                $(".view-storage .m-table-storageDetail table .tbody-L").html($com.util.template(data, HTML.LIST4));
                //$(".view-detail .tip-content").html(data.status);
            },

            Clone: function (obj) {
                var o;
                if (typeof obj == "object") {
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (var i = 0, len = obj.length; i < len; i++) {
                                o.push(model.com.Clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (var j in obj) {
                                o[j] = model.com.Clone(obj[j]);
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },

            addCheck: function () {
              
                if (IsSubmit)
                    return;
                var d = model._data,
					list = d.eRPMaterialLocationList,
					data = {
					    FeedBoxID :"",
					    ID: 0,
					    FQTYLL: 0,
					    FQTYPL: 0,
					    LineName: d.LineName,					   
					    LocationList: [],
					    MaterialID: d.MaterialID,
					    MaterialMode: 0,
					    MaterialName: d.MaterialName,
					    MaterialNo: d.MaterialNo,
					    PartName: d.PartName,
					    PartPointName: d.PartPointName,
					    Status: 0,
					    TaskMaterialID: model.query.id,
					    WorkShopName :"",
					   
					},
					$node,
					val;

                $node = $("#count");
                val = Number($node.val());

                data.FQTYPL = val;

                $(".m-table-storage input").each(function (i, item) {
                   // zlist[0].FQTYPL = val;
                    zlist[i].FQTY = Number($(this).val());
                    //zlist[i].FQTYPL = Number($(this).val());
                });

                if (!val) {
                    alert("配料数不能为0");
                    return;
                }
                
                model.com.add({
                    data: data,
                    status: 1,
                    list: zlist

                }, function (res) {
                    var wwid = res.info.ID;
                    window.location = "detail.html?id=" + wwid;
                    //alert("新增成功");

                   
                })
                //$.each(list, function (i, item) {

                //    var _$node = $(".view-order .m-table-storage table tr[data-stockID=" + item.stockID + "][data-stockLocID=" + item.locationID + "]"),
				//		_val,
				//		_max,
				//		_$ipt;

                //    if (!_$node[0]) {
                //        alert("无仓位信息数据失效");
                //        close();
                //        return;
                //    }

                //    if (!model._list)
                //        return true;
                //    $.each(model._list, function (mi, itemM) {
                //        if (!itemM.ItemShowList)
                //            return true;
                //        $.each(itemM.ItemShowList, function (mj, itemMS) {
                //            if (!itemMS._boxList)
                //                return true;
                //            $.each(itemMS._boxList, function (si, itemS) {
                //                if (itemS.ItemID != item.itemID)
                //                    return true;
                //                if (itemS.d3 <= 0)
                //                    return true;
                //                var Datas = model.com.Clone(item);

                //                Datas.fQTY = itemS.d3;

                //                data.list.push(Datas);
                //            });
                //        });
                //    });
                //});

               
              

            }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/order-4c841ff73a.js.map