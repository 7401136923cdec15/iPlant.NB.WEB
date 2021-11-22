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

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),

	
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

		events : function() {
 
		    $("body").delegate("#back", "click", function () {
		        window.location = "reportLiDetail.html?id=" + model.query.id;
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

		    $("body").delegate("#confirm", "click", function () {
		        confirm("确认保存吗？",function(bool){
		            if (bool) {
		                model.com.addCheck();
		            } else {
		                return false;
		            }
		        })
				
			});
			//保存提交

		},

		run : function() {
		    //mFQTY = model.query.mFQTY;
		    this.com.getItem({
		        ID: model.query.id,

		    }, function (data) {
		        ModelAll = data.info;		        
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
			    $("#countFQTYBad").val(ModelAll.FQTYBad);

			    $("#countFQTYGood").val(ModelAll.FQTYGood);

			    $("#countString").val(ModelAll.LableID);
				$(".m-c-body .m-detail-list").html($com.util.template(data.data, HTML.LIST)); 
				 
			},




			addCheck : function(e, close) {
				
			    var bad = Number($("#countFQTYBad").val());

			    var good = Number($("#countFQTYGood").val());

			    var str = $("#countString").val();
				
			    ModelAll.FQTY = bad+good;
			    ModelAll.FQTYBad = bad;
			    ModelAll.FQTYGood = good;
			    //ModelAll.LableID = str;
			   //ModelAll.Status = 0;
			    model.com.add({
			        data: ModelAll
			    }, function (data) {

			       // alert("提交成功");
			        window.location = "reportLine.html"


			    })

				
			}
			 
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-07ea1bf6f7.js.map