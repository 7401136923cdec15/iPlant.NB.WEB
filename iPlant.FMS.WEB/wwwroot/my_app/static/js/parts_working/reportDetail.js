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
		LIST : [ '<div class="ms-group clearfix" data-material="{{MaterialName}}" data-id="{{Id}}" data-check="{{Check}}" data-box="{{BoxID}}" data-status="{{State}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title">{{Name}}</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">设备号:</span><span class="ms-text">{{C1}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">计划时间:</span><span class="ms-text">{{C2}}</span>',
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
				if (model.query.kind == "1") {
					var _data,
						$this = $(this),
						id = $this.attr("data-id"),
						state = $this.attr("data-status"),
						materialName = $this.attr("data-material"),
						isSubmit = false;
					switch (state) {
					case "1":
						isSubmit = confirm("工装名：" + materialName + "\n此工装确定已拆除？");
						break;
					case "2":
						isSubmit = confirm("工装名：" + materialName + "\n此工装确定已入库？");
						break;
					case "3":
						isSubmit = confirm("工装名：" + materialName + "\n此工装确定已领？");
						break;
					case "4":
						isSubmit = confirm("工装名：" + materialName + "\n此工装确定已装配？");
						break;
					case "5":
						isSubmit = confirm("工装名：" + materialName + "\n此工装确定已调试？");
						break;
					case "6":
						break;
					case "7":
						break;
					default:
						break;
					}
					if (isSubmit) {
						model.com.addcheck(id);
					}
				}
			});

		},

		run : function() {
			$("#stateContent").html(model.query.device);
			this.com.get({
				DeviceNo : model.query.device
			}, function(data) {
				model.com.render(model.com.filter(data.list));
			});
		},

		com : {
			get : function(data, fn, context) {

				var d = {
					$URI : "/shrisdevicepart/GetTaskDevicePartItemListByDeviceID",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			check : function(data, fn, context) {

				var d = {
					$URI : "/shrisdevicepart/DevicePartItemSubmit",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);

			},
			addcheck : function(id) {

				model.com.get({
					DeviceNo : model.query.device
				}, function(data) {


					if (data.list[0].ID != 0) {
						$(data.list).each(function(i, item) {
							if (item.ID == id) {
								model._data = item;
							}
						});

						model.com.check(model._data, function(data) {
							if (data.info.ID != 0) {
								model.com.get({
									DeviceNo : model.query.device
								}, function(data) {
									model.com.render(model.com.filter(data.list));
									alert("操作成功");
								});
							} else {
								alert("操作失败");
							}
						});
					} else {
						alert("操作失败");
					}

				});
			},
			filter : function(data) {
				var _data = [];
				$(data).each(function() {
					_data.push({
						Name : this.MaterialName + " " + this.MaterialNO,
						C1 : model.query.device,
						//c2 : $com.util.format("yyyy-MM-dd", this.CompoundTimelong),
						C2 : $com.util.format("yyyy-MM-dd", this.Timelong),

						Id : this.ID,
						MaterialName : this.MaterialName,
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