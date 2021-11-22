require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		LETTER;

	current = "Status_Sent";
	STATUS = {
		"QualityCheck_Sending" : "送检中",
		"QualityCheck_Sent" : "已收检",
		"QualityCheck_Checked" : "已检验",
		"QualityCheck_Backing" : "返修中",
		"QualityCheck_Storage" : "已入库"
	};

	COLOUR = {
		"QualityCheck_Sending" : "text-red",
		"QualityCheck_Sent" : "text-red",
		"QualityCheck_Checked" : "text-red",
		"QualityCheck_Backing" : "text-red",
		"QualityCheck_Storage" : ""
	};

	CHECKLIST = {
		"QualityCheck_Sending" : "0",
		"QualityCheck_Sent" : "1",
		"QualityCheck_Checked" : "2",
		"QualityCheck_Backing" : "4",
		"QualityCheck_Storage" : "3"
	};

	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-device="{{DeviceId}}" data-check="{{Check}}" data-status="{{State}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title">{{Name}}</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">产线:</span><span class="ms-text">{{C1}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">工序:</span><span class="ms-text">{{C2}}</span>',
			'</span>',

			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{Status}}</span>',
			'</div>',
			'</div>' ].join("")
	};

	model = $com.Model.create({
		name : '检验明细',

		type : $com.Model.MAIN,

		configure : function() {

			this.run();
		},

		events : function() {
			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-device");

				/*if (check == 1) {
					window.QRTEST = function(val) {
						if (val == id) {
							window.location = "item.html?id=" + id;
						} else {
							alert("任务与设备不符请核对设备");
						}
					};

					window.JSImpl.readQRCode('QRTEST');
				} else {*/
				window.location = "reportDetail.html?kind=0&device=" + id;
			//}
			});

			$("#confirm").click(function() {


				window.QRTEST = function(id) {

					model.com.check({
						DeviceNo : id
					}, function(data) {
						if (data.list.length <= 0) {
							alert("此设备没有获取到工装任务");
						} else if (data.list[0].ID == 0) {
							alert("此设备没有工装任务");
						} else {
							window.location = "reportDetail.html?kind=1&device=" + id;
						}
					});
				};
				window.JSImpl.readQRCode('QRTEST');
			});
		},

		run : function() {
			this.com.get({}, function(data) {
				model.com.render(model.com.filter(data.list));
			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/shrisdevicepart/GetTaskDevicePartList",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			check : function(data, fn, context) {

				var d = {
					$URI : "/shrisdevicepart/GetTaskDevicePartItemListByDeviceID",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);

			},
			filter : function(data) {
				var _data = [];
				$(data).each(function() {
					_data.push({
						Name : "设备编号：" + this.DeviceNo,
						C1 : this.LineID,
						//c2 : $com.util.format("yyyy-MM-dd", this.CompoundTimelong),
						C2 : this.PartPointName,
						C3 : this.DeviceID,
						DeviceId : this.DeviceNo,

						State : this.Status,
						/*status : STATUS[this.Status],
						color : COLOUR[this.Status],
						check : CHECKLIST[this.Status],*/
						Status : this.StatusText,
						Color : "",
						Check : ""
					});
				});

				return _data;
			},

			render : function(data) {
				$(".m-table").html($com.util.template(data, HTML.LIST));
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/report-139bd9cd7f.js.map