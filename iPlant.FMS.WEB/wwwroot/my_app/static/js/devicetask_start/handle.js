require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		IsSubmit,
		KEYWORD_LIST,
		KEYWORD,
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
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();

		},

		events : function() {

			$("body").delegate("#confirmS", "click", function(e) {

				model.com.add({
					task_id :  model.query.id,
					status : 0
				}, function(res) {
					alert("已开工！");
					window.location = "detail.html?id=" +  model.query.id;

				});

			});
			
			$("#scanQR").click(function() {
				window.QRTEST = function(str) {
					
					if(model._data.DeviceNo==str){ 
						window.location = "handle.html?id=" +  model.query.id;
					}else{
						alert("此设备与任务不符，请核对！");
					}
				};
				window.JSImpl.readQRCode('QRTEST');

			});
			
			$("body").delegate("#confirmE", "click", function(e) {
				if (!confirm("确定已完成任务？\n此操作会导致未做完任务不能继续进行！"))
					return;

				model.com.add({
					task_id : model.query.id,
					status : 1
				}, function(res) {
					alert("已完工！");
					window.location = "detail.html?id=" +  model.query.id;

				});
				;
			});

		},

		run : function() {
			this.com.get({
				task_id : model.query.id
			}, function(data) {
				switch (data.info.status) {
				case 0:

					break;
				case 1:
					$("confirmS").hide();
					$("confirmE").css("width", "100%");
					break;
				case 2:

					break;
				case 3:
					$("confirmE").hide();
					$("confirmS").css("width", "100%");
					break;
				case 4:
					break;
				default:
					break;
				}
				model._data = data.info;
				model.com.render(model.com.filter(data.info));
			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/TaskHandle/Info",
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

				var _data = [],
					_status = ""; 
				data.sessionTimeText=$com.util.format("yyyy-MM-dd hh:mm:ss",data.shiftStartTime);
				for (var p in data) {
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : data[p] === "" ? "&nbsp;" : data[p]
						};
					}
				}
				_status = STATUS[data.status];

				return {
					list : _data,
					status : _status
				};
			},

			render : function(data) {


				$(".m-detail-list").html($com.util.template(data.list, HTML.LIST));

				$(".tip-content").html(data.status);
			},
		}
	});

	model.init();

});
//# sourceMappingURL=maps/check-a434cc7332.js.map