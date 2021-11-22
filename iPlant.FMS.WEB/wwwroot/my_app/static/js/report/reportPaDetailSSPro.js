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

	//Temp = {
    //ID:0,
    //EntryPartID:0,
    //PartNo:"MCE0005C8-0160R0TBZ",
    //PackgeNo:"MCE0005C8-0160R0TBM",
    //Result:false,
    //Comment:"",
    //EntryType:2,
    //LabelNo:"cc",
    //PartType:3

    //};
	STATUS_Pro = ["创建", "已提交", "待入库", "待收库", "已收库", "已入库", "已驳回", "待验收", "验收中"];
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

		LIST2: ['<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{Check}}">',
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
		"PartName|工序段",
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

		    //$("body").delegate(".ms-group .ms-col-l", "click", function () {
		    //    var $this = $(this);
			//		mid = $this.parent().attr("data-id");										

		    //    $("#resultList").show();
		    //});

		    ////$("#resultS").click(function () {
		    ////    $("#resultList").show();
		    ////});
		    //$("body").delegate("#resultList #result_confirm", "click", function () {
		    //    var $result = $("#resultList ul li input:checked"),
            //        status = Number($result.attr("data-value"));

		       
		    //    $("#resultList").hide();

		    //});
		    $("body").delegate("#back", "click", function () {
		        window.location = "listPart.html"
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
		    //
		    $("body").delegate("#submitZace", "click", function () {
		        confirm("确认提交吗？", function (bool) {
		            if (bool) {
		                model.com.addCheckSubmit();
		            } else {
		                return false;
		            }
		        })

		    });
		},

		run : function() {
		    this.com.getItem({
		        ID: model.query.id,

		    }, function (data) {
		        ModelAll = data.info;
		        if (ModelAll.Status == 6) {
		            $(".zace-confirm").hide();
		            $(".zace-result").hide();
		            $(".zace-refresh").show();
		        } else {
		            if (ModelAll.Status > 0) {
		                $(".zace-refresh").hide();
		                $(".zace-confirm").hide();
		                $(".zace-result").css('bottom', '0vw');
		            } else {
		                $(".zace-refresh").hide();
		                $(".zace-confirm").show();
		                $(".zace-result").css('bottom', '11.67vw');
		            }
		        }
		        //$(".zace-confirm").hide();
		        model.com.render(model.com.filter(data.info));
		        ModelData = data.list;
		        model.com.renderItems(model.com.filterItems(data.list));
		        model.com.addCheckSubmit();
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

		    getItem: function (data, fn, context) {
		        var d = {
		            $URI: "/ReportTask/ItemInfo",
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
			        if (wStatus == 0) {
			            good += 1;
			        } else {
			            bad += 1;
			        }
			    });


			    return {
			        list: _list,
			        good: good,
			        bad: bad,
			    }
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

			
			renderItems : function(data) {


			    $(".m-table").html($com.util.template(data.list, HTML.LIST2));
			    $("#countFQTYBad").val(data.bad);

			    $("#countFQTYGood").val(data.good);

			},
			render: function (data) {
			    $("#countFQTYBad").val(ModelAll.FQTYBad);

			    $("#countFQTYGood").val(ModelAll.FQTYGood);

			   
			    $(".tip-content").html(STATUS_Pro[ModelAll.Status]);
				$(".m-c-body .m-detail-list").html($com.util.template(data.data, HTML.LIST)); 
				 
			},




			addCheck : function(e, close) {
				
			    var bad = Number($("#countFQTYBad").val());

			    var good = Number($("#countFQTYGood").val());

			    var str = $("#countString").val();
			    var _list = [];
			    _list.push(Temp);
			    ModelAll.FQTY = bad+good;
			    ModelAll.FQTYBad = bad;
			    ModelAll.FQTYGood = good;
			    //ModelAll.LableID = str;
			   // ModelAll.Status = 2;
			    model.com.add({
			        data: ModelAll,
			        list:_list
			    }, function (data) {

			        window.location = "reportPaDetailSS.html?id=" + model.query.id;


			    })

				
			},
			addCheckSubmit: function (e, close) {

			    var bad = Number($("#countFQTYBad").val());

			    var good = Number($("#countFQTYGood").val());

			    var str = $("#countString").val();
			    var _list = [];
			    _list = ModelData;
			    //_list.push(Temp);
			    ModelAll.FQTY = bad + good;
			    ModelAll.FQTYBad = bad;
			    ModelAll.FQTYGood = good;
			    //ModelAll.LableID = str;
			    //ModelAll.Status = 3;
			    model.com.add({
			        data: ModelAll,
			        list: []
			    }, function (data) {

			        model.com.getReportStoreInfo({
			            ReportType: 2,
			            ReportID: model.query.id,
			            ID: 0
			        }, function (LiStock) {
			            //LiStock.info.Status = 3;
			            var wLiStock = LiStock.info;

			            //model.com.postStore({
			            //    data: wLiStock
			            //}, function (res) {
			            //    //alert("生成入库单成功！");

			            window.location = "reportInfoPro.html?id=" + wLiStock.ID + "&reportID=" + model.query.id;
			            //});

			        })


			    })


			}, postStore: function (data, fn, context) {
			    var d = {
			        $URI: "/ReportStore/SubmitAll",
			        $TYPE: "post"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
			getReportStoreInfo: function (data, fn, context) {
			    var d = {
			        $URI: "/ReportStore/Info",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
			 
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-07ea1bf6f7.js.map