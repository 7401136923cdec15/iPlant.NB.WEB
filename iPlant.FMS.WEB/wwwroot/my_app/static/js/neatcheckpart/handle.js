require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


    var model,
		HTML,
		IsSubmit,
		KEYWORD_LIST,
		KEYWORD,
        checkID,
		STATUS;

	STATUS = [ "待开工", "已开工", "暂停中", "已完工", "异常中" ];
	IsSubmit = false;

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),
	};
	KEYWORD_LIST = [
		"TaskName|任务名称",
		"OrderNo|订单号",
		"WorkShopName|车间",
		"LineName|产线",
		"DeviceNo|设备号",
		"PartPointName|工序名称",
		"MaterialNo|物料号",
		"MaterialName|物料名称",
		"ProductNo|产品规格",
		"FQTYParts|加工计数",
		"FQTYDone|完成数",
		"FQTYShift|计划数",
		"SessionTimeText|更新时刻",
		"OperatorName|操作员",

	];

	KEYWORD = {};

	$.each(KEYWORD_LIST, function(i, item) {
		var detail = item.split("|");
		KEYWORD[detail[0]] = {
			index : i,
			name : detail[1]
		};
	});

	model = $com.Model.create({
	    name: '工序齐套检查',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();

		},

		events: function () {
		    $("#back").click(function () {
		        window.location = "partlist.html";
		    });

			$("#check").click(function () {
			    var checkid = checkID+"";
			    if ($(".tip-content").text() == "已检") {
			        window.location = "partcheck.html?id=" + model.query.id + "&sid=" + checkid;
			    } else {
			        model.com.get({
			            ID: model.query.id, EventID: window._eventID,CheckID:0
			        }, function (data) {
			            var list = data.info;
			            if (list.MaterialList && list.MaterialList.length > 0) {
			                window.location = "partcheck.html?id=" + model.query.id;
			            } else {
			                alert("当前工序无齐套检查!");
			            }
			        });
			    }
			});
		},
		run: function () {
		    if (window._eventID==0) {
		        window._eventID = 1008;
		    }
		    this.com.get({
		        ID: model.query.id, EventID: window._eventID, CheckID: 0
		    }, function (data) {
		        var object = data.info;

		        model.com.filter(object);
		    });
		},

		com : {
			get : function(data, fn, context) {
				var d = {
				    $URI: "/TaskHandle/Info",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			add : function(data, fn, context) {
				var d = {
					$URI : "/TaskHandle/Handle",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
			    var list = [];
			    if(data.TaskName){
			        var item = { name: "任务名称", value: data.TaskName };
			        list.push(item);
			    }
			    if (data.OrderNo) {
			        var item = { name: "订单号", value: data.OrderNo };
			        list.push(item);
			    }
			    if (data.WorkShopName) {
			        var item = { name: "车间", value: data.WorkShopName };
			        list.push(item);
			    }
			    if (data.LineName) {
			        var item = { name: "产线", value: data.LineName };
			        list.push(item);
			    }
			   
			    if (data.PartName) {
			        var item = { name: "工序名称", value: data.PartName };
			        list.push(item);
			    }
			    if (data.MaterialNo) {
			        var item = { name: "物料号", value: data.MaterialNo };
			        list.push(item);
			    }
			    if (data.MaterialName) {
			        var item = { name: "物料名称", value: data.MaterialName };
			        list.push(item);
			    }
			    if (data.MaterialNo) {
			        var item = { name: "物料型号", value: data.MaterialNo };
			        list.push(item);
			    }
			    if (data.ProductNo) {
			        var item = { name: "产品规格", value: data.ProductNo };
			        list.push(item);
			    }
			    if (data.FQTYParts || data.FQTYParts==0) {
			        var item = { name: "加工计数", value: data.FQTYParts };
			        list.push(item);
			    }
			    if (data.FQTYDone || data.FQTYDone == 0) {
			        var item = { name: "完成数", value: data.FQTYDone };
			        list.push(item);
			    }
			    if (data.FQTYShift || data.FQTYShift == 0) {
			        var item = { name: "计划数", value: data.FQTYShift };
			        list.push(item);
			    }
			    if (data.StartTime) {
			        var item = { name: "开始时刻", value: data.StartTime };
			        list.push(item);
			    }
			    if (data.EndTime) {
			        var item = { name: "结束时刻", value: data.EndTime };
			        list.push(item);
			    }
			    if (data.OperatorName) {
			        var item = { name: "操作员", value: data.OperatorName };
			        list.push(item);
			    }
			    if (data.MaterialCheckList.length >0) {
			        checkID=data.MaterialCheckList[data.MaterialCheckList.length-1].ID;
			        $(".tip-content").html("已检");
			    } else {
			        $(".tip-content").html("未检");
			    }
			    $(".m-detail-list").html($com.util.template(list, HTML.LIST));
			},

			render : function(data) {
			    $(".m-detail-list").html($com.util.template(data.list, HTML.LIST));
			    
			       // $(".tip-content").html(data.status); 1
			    
			 
			},
		}
	});

	model.init();

});
//# sourceMappingURL=maps/check-a434cc7332.js.map