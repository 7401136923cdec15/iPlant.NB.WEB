require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD,
		KEYWORD_LIST,
        ModelAll,
        mFQTY,
		IsSubmit;
	ModelAll = [];
	mFQTY = 0;
	IsSubmit = false;
    //STATUS = ["送检中", "已收检", "已检验", "待收库", "已收库", "已入库", "已驳回", "待验收", "验收中"];
	STATUS = ["创建", "已提交", "待入库", "待收库", "已收库", "已入库", "已驳回", "待验收", "验收中"];
	COLOUR = ["text-yellow", "text-blue", "text-blue", "text-grey", "text-grey", "text-grey", "text-red", "text-yellow", "text-blue"];
	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),

	
	};

	KEYWORD_LIST = [

		//"WorkShopName|车间",
		"LineName|产线",
        "PartName|工段",
		"OrderNo|订单号",
		
		//"PartPointName|工序",
		"MaterialNo|物料号",
		"MaterialName|物料名",
		"ProductNo|产品规格",
        "LableID|标签",
		"FQTY|数量",
        "FQTYBad|不合格数",
        "FQTYGood|合格数",
		"OperatorName|操作员",
        "SubmitTime|报工时间",
		"InspectorName|入库员",
        "InspectTime|入库时间",
		/*"receivingClerkName|入库员",*/
		
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

		events : function() {
 
		    $("body").delegate("#back", "click", function () {
		        window.location = "reportPart.html"
			});
		    $("body").delegate("#confirmStock", "click", function () {

		        confirm("确认提交入库单", function (bool) {
		            if (bool) {
		                ModelAll.Status = 2;
		                model.com.add({
		                    data: ModelAll
		                }, function (data) {

		                    model.com.getItem({
		                        ID: model.query.id,

		                    }, function (data) {
		                        ModelAll = data.info;
		                        model.com.render(model.com.filter(data.info));
		                        if (ModelAll.Status == 2) {

		                            $(".zace-confirm").hide();
		                        }
		                    })



		                })
		                model.com.getReportStoreInfo({
		                    ReportID: model.query.id,
		                    ID: 0
		                }, function (LiStock) {
		                    // LiStock.info.Status = 2;
		                    var wLiStock = LiStock.info;

		                    model.com.postStore({
		                        data: wLiStock
		                    }, function (res) {
		                        alert("生成入库单成功！");
		                    });

		                })
		            } else {
		                return false;
		            }

		        }
                )
		        // model.com.addCheck(5);

		    });
		    $("body").delegate("#rejectStock", "click", function () {

		        confirm("是否要驳回?", function (bool) {
		            if (bool) {
		                ModelAll.Status = 6;
		                model.com.add({
		                    data: ModelAll
		                }, function (data) {

		                    model.com.getItem({
		                        ID: model.query.id,

		                    }, function (data) {
		                        ModelAll = data.info;
		                        model.com.render(model.com.filter(data.info));
		                        if (ModelAll.Status == 6) {

		                            $(".zace-confirm").hide();
		                        }
		                    })



		                })
		            } else {
		                return false;
		            }

		        }
		        )

		    });
			//保存提交

		},

		run : function() {
		   
		    this.com.getItem({
		        ID: model.query.id,
		       
		    }, function (data) {
		        ModelAll = data.info;
		        if (ModelAll.Status != 1) {
		            $(".zace-confirm").hide();
		        }
		        model.com.render(model.com.filter(data.info));

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

			render: function (data) {
			    //$("#countFQTYBad").val(ModelAll.FQTYBad);

			    //$("#countFQTYGood").val(ModelAll.FQTYGood);

			    //$("#countString").val(ModelAll.LableID);
			    $(".tip-content").html(STATUS[ModelAll.Status]);
				$(".m-c-body .m-detail-list").html($com.util.template(data.data, HTML.LIST)); 
				 
			},




			addCheck : function(e, close) {
				
			    var bad = Number($("#countFQTYBad").val());

			    var good = Number($("#countFQTYGood").val());

			    var str = $("#countString").val();
				
			    ModelAll.FQTY = mFQTY;
			    ModelAll.FQTYBad = bad;
			    ModelAll.FQTYGood = good;
			    ModelAll.LableID = str;
			    model.com.add({
			        data: ModelAll
			    }, function (data) {




			    })

				
			}
			 
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-07ea1bf6f7.js.map