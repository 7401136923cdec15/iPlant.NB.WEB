require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


    var model,
		HTML,
		KEYWORD,
		KEYWORD_LIST,
        ModelAll,
        mFQTY,
        mid,
        ModelData,
		IsSubmit;
	ModelAll = [];
	mFQTY = 0;
	IsSubmit = false;
	mid = 0;
	ModelData = [];


	Temp = {
    ID:0,
    EntryPartID:0,
    PartNo:"",
    PackgeNo:"",
    Result:true,
    Comment:"",
    EntryType:2,
    LabelNo:"cc",
    PartType:3

	};
	STATUS = ["合格", "合格", "不合格"];
	COLOUR_Item = ["text-yellow", "text-blue", "text-red"];

	//STATUS = ["合格", "合格", "不合格"];

	//COLOUR = ["text-yellow", "text-blue", "text-red"];

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),
		LIST3: ['<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{Check}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title">',
			'<span class="ms-field "> ',
			'<div class="ms-sub-title">',
			'</span> <span class="ms-field"> <span class="ms-label">模组号:</span>',
			'<span class="ms-text">{{PartNo}}</span>',
			'</span> <span class="ms-field"> <span class="ms-label">电容包号:</span>',
			'<span class="ms-text">{{PackgeNo}}</span>',
			'</span>',
			'</div>',
			'</div></div>',


            '<div class="ms-col ms-col-l">',
			'<span class="ms-status {{ColorZ}}">{{StatusZ}}</span>',
			'</div>',
			'</div>'].join(""),

		LIST2: ['<div class="ms-group clearfix" data-id="{{ID}}" data-wid="{{WID}}" data-check="{{Check}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',		
			'<div class="ms-sub-title">',
			'<span class="ms-field"> <span class="ms-label">模组编码:</span>',
			'<span class="ms-text">{{PartNo}}</span>',
			'</span>',
			'</div>',
            '<div class="ms-sub-title">',
			'<span class="ms-field"> <span class="ms-label">电容包码:</span>',
			'<span class="ms-text">{{PackgeNo}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{ColorZ}}">{{StatusZ}}</span>',
			'</div>',
			'</div>'].join("")
	
	};

	KEYWORD_LIST = [

		//"WorkShopName|车间",
		"LineName|产线",
		"OrderNo|订单号",
		//"PartName|工序段",
		//"PartPointName|工序",
		"MaterialNo|物料号",
		"MaterialName|物料名",
		"ProductNo|产品规格",
        "LableID|标签",
		"FQTY|计划数",
		"OperatorName|操作员",
		//"InspectorName|收料员",
		/*"receivingClerkName|入库员",*/
		"SubmitTime|报工时间",
		/*"inspectTimeText|收料时间",*/
		//"InspectTimeText|收料时间"

	];


	KEYWORD = {};



	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();

			KEYWORD_LIST.forEach(function(item, i) {
				var detail = item.split("|");
				KEYWORD[detail[0]] = {
					index : i,
					name : detail[1]
				};
			});


		},

		events: function () {

		    $("body").delegate(".ms-group .ms-col-l", "click", function () {
		        var $this = $(this);
					mid = Number($this.parent().attr("data-wid"));										

		        $("#resultList").show();
		    });

		    //$("#resultS").click(function () {
		    //    $("#resultList").show();
		    //});
		    $("body").delegate("#resultList #result_confirm", "click", function () {
		        var $result = $("#resultList ul li input:checked"),
                    status = Number($result.attr("data-value"));

		        if (status == 1) {

		            ModelData[mid-1].Result = true;
		        } else if (status == 2) {

		            ModelData[mid-1].Result = false;
		       
		        }
		        model.com.renderItems(model.com.filterItems(ModelData));
		        $("#resultList").hide();

		    });
		    $("body").delegate("#back", "click", function () {
		        window.location = "listLine.html"
			});
		    $("body").delegate("#countFQTYBad", "input", function () {
		        var $this = $(this),				
					max = mFQTY,
					val = Number($.trim($this.val()));
		        val = (val / 1);
		        if (val < 0) {
		            val = 0;
		            $this.val(0);
		        }
		        $this.val(val);
		        //if (val > max) {
		        //    val = max;
		        //    $this.val(max);
		        //}
		        //$("#countFQTYGood").val(max - val);

		    });

		    $("body").delegate("#countString", "input", function () {
		        var $this = $(this),
					val = $this.val();
                    //$.trim($this.val());		      
		        $this.val(val);
		    });

		    $("body").delegate("#countFQTYGood", "input", function () {
		        var $this = $(this),
					max = mFQTY,
					val = Number($.trim($this.val()));
		            val=(val/1);
		        if (val < 0) {
		            val = 0;
		            $this.val(0);
		        }
		        $this.val(val);
		        //if (val > max) {
		        //    val = max;
		        //    $this.val(max);
		        //}

		        //$("#countFQTYBad").val(max - val);
		    });

		    $("body").delegate("#saveZace", "click", function () {
		        confirm("确认保存吗？",function(bool){
		            if (bool) {
		                model.com.addCheck();
		            } else {
		                return false;
		            }
		        })
				
			});
			//提交
		    $("body").delegate("#submitZace", "click", function () {
		        confirm("确认提交吗？", function (bool) {
		            if (bool) {
		                model.com.addCheckSubmit();
		            } else {
		                return false;
		            }
		        })

		    });
		    $("body").delegate("#zace-scan", "click", function () {
		        if (window.JSImpl) {
		            window.QRTEST = function (val) {
		              var  partNo = val;
		                model.com.getScanData({
		                    PartNo:partNo,
		                    PartType:3
		                }, function (res) {
		                    var z = res.info;
		                    var _temp = $com.util.Clone(Temp);
		                    if (res.info.PackgeNo != "" || res.info.PackgeNo.length>0) {
		                        _temp.PackgeNo = res.info.PackgeNo;
		                        _temp.PartNo = res.info.PartNo;

		                        ModelData.push(_temp);
		                        for (var i = 0; i < ModelData.length; i++) {
		                            ModelData[i].WID = i + 1;
		                        }

		                        model.com.renderItems(model.com.filterItems(ModelData));
		                    }else 
		                    {
		                        return false;
		                    }
		                   
		                })


		            };
		            window.JSImpl.readQRCode('QRTEST');
		        } else {
		            //160V2019069924
		           
		            var _temp = $com.util.Clone(Temp);;
		            _temp.PackgeNo = "cc";
		            _temp.PartNo = "dd";

		            ModelData.push(_temp);

		            for (var i = 0; i < ModelData.length; i++) {
		                ModelData[i].WID = i + 1;
		            }

		            model.com.renderItems(model.com.filterItems(ModelData));

		        }

		    });
		    $("body").delegate("#zace-scanEle", "click", function () {
		        if (window.JSImpl) {
		            window.QRTEST = function (val) {
		                var partNo = val;
		                model.com.getScanData({
		                    PartNo: partNo,
		                    PartType: 2
		                }, function (res) {
		                    var z = res.info;
		                    var _temp = $com.util.Clone(Temp);
		                    if (res.info.PackgeNo != "" || res.info.PackgeNo.length > 0) {
		                        _temp.PackgeNo = res.info.PackgeNo;
		                        _temp.PartNo = res.info.PartNo;

		                        ModelData.push(_temp);
		                        for (var i = 0; i < ModelData.length; i++) {
		                            ModelData[i].WID = i + 1;
		                        }

		                        model.com.renderItems(model.com.filterItems(ModelData));
		                    } else {
		                        return false;
		                    }

		                })


		            };
		            window.JSImpl.readQRCode('QRTEST');
		        } else {
		            //160V2019069924

		            var _temp = $com.util.Clone(Temp);;
		            _temp.PackgeNo = "cc";
		            _temp.PartNo = "dd";

		            ModelData.push(_temp);

		            for (var i = 0; i < ModelData.length; i++) {
		                ModelData[i].WID = i + 1;
		            }

		            model.com.renderItems(model.com.filterItems(ModelData));

		        }

		    });
		   
		},

		run : function() {
		    mFQTY = model.query.mFQTY;
		    this.com.creatReport({
		        TaskID: model.query.id,
		        Level: 1
		    }, function (data) {

		        ModelAll = data.info;
		        data.info.FQTY = mFQTY;
		        data.info.Remark = "ccccP";
		        data.info.LableID = "wP";
		        model.com.render(model.com.filter(data.info));
		       
		        model.com.renderItems(model.com.filterItems(ModelData));
		    })
			//if (model.query.qr) {
			//	this.com.getNew({ 
			//		task_id : model.query.id
			//	}, function(data) {

			//		data.info.detail.FeedBoxID = model.query.qr;
			//		model.com.render(model.com.filter(data.info));
			//		$("#count").val(data.info.detail.FQTY);
				 
			//	});
			//} else {
			//	this.com.get({
			//		id : model.query.id
			//	}, function(data) {
			//		model.com.render(model.com.filter(data.info));
			//		$("#count").val(data.info.detail.FQTY);
				 
			//	});
			//}

		},
		com: {

		    creatReport: function (data, fn, context) {
		        var d = {
		            $URI: "/ReportTask/Create",
		            $TYPE: "get"
		        };

		        function err() {
		            $com.app.tip('获取失败，请检查网络');
		        }

		        $com.app.ajax($.extend(d, data), fn, err, context);
		    },


			get : function(data, fn, context) {
				var d = {
					$URI : "/ReportTask/ItemInfoDetail",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			getScanData: function (data, fn, context) {
			    var d = {
			        $URI: "/SFCTaskIPT/ScanPartNo",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},

			getNew : function(data, fn, context) {
				var d = {
					$URI : "/ReportTask/ItemInfoNew",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},



			add : function(data, fn, context) {
				var d = {
					$URI : "/ReportTask/Submit",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},


			filter : function(data) {
				var _data = [],
					_list = [];

				model._data = data;
				//data.BGTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.BGTime);
				

				for (var p in data) {
					var o = KEYWORD[p];
					if (o) {

						_data[Number(o.index)] = {
							name : o.name,
							value : data[p] === "" ? "&nbsp;" : data[p]
						};
					}
				}
				 
				return {
					data : _data,
					list : _list
				};
			},

			filterItems: function (data) {
			    var _list = [];
			    var good = 0;
			    var bad = 0;
			    $.each(data, function () {
			        var wStatus = this.Result == true ? 0 : 2;
			        _list.push({

			            PartNo: this.PartNo,
			            PackgeNo: this.PackgeNo,
			            ID: this.ID,
			            WID: this.WID,
			            StatusZ: STATUS[wStatus],
			            ColorZ: COLOUR_Item[wStatus]
			        });
			        if (wStatus==0) {
			            good += 1;
			        } else {
			            bad += 1;
			        }
			    });


			    return {
			        list: _list,
			        good: good,
                    bad:bad,
			    }
			},
			renderItems : function(data) {

			    $(".m-table").html($com.util.template(data.list, HTML.LIST2));
			    $("#countFQTYBad").val(data.bad);

			    $("#countFQTYGood").val(data.good);
			},
			render: function (data) {
			    //$("#countFQTYBad").val(ModelAll.FQTYBad);

			    //$("#countFQTYGood").val(ModelAll.FQTYGood);

			    //$("#countString").val(ModelAll.LableID);
				$(".m-c-body .m-detail-list").html($com.util.template(data.data, HTML.LIST)); 
				 
			},




			addCheck : function(e, close) {
				
			    var bad = Number($("#countFQTYBad").val());

			    var good = Number($("#countFQTYGood").val());

			    //var str = $("#countString").val();
			    var _list = [];
			    _list = ModelData;
			    ModelAll.FQTY = bad+good;
			    ModelAll.FQTYBad = bad;
			    ModelAll.FQTYGood = good;
			    //ModelAll.LableID = str;
			   // ModelAll.Status = 2;
			    model.com.add({
			        data: ModelAll,
			        list:_list
			    }, function (data) {

			        alert("保存成功");
			        window.location = "reportLiDetailSS.html?id=" + data.info.ID;


			    })

				
			},
			addCheckSubmit: function (e, close) {

			    var bad = Number($("#countFQTYBad").val());

			    var good = Number($("#countFQTYGood").val());

			   // var str = $("#countString").val();
			    var _list = [];
			    _list = ModelData;
			    ModelAll.FQTY = bad + good;
			    ModelAll.FQTYBad = bad;
			    ModelAll.FQTYGood = good;
			    //ModelAll.LableID = str;
			    // ModelAll.Status = 2;
			    model.com.add({
			        data: ModelAll,
			        list: _list
			    }, function (data) {

			        data.info.Status = 3;
			        model.com.add({
			            data: data.info,
			            list: []
			        }, function (data1) {

			            alert("提交成功");
			            window.location = "reportLiDetail.html?id=" + data1.info.ID;


			        })


			    })



			},
			 
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-07ea1bf6f7.js.map