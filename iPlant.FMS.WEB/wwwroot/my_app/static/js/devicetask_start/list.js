require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {

	//需要引用bootstrap的就添加一个url:'./static/utils/js/base/bootstrap' 参数 BS  然后先执行BS();
	//需要用动态表单的添加 './static/utils/js/base/entry' 参数	 iForm 


	var model,
		HTML,
		STATUS,
		COLOUR,
		ShiftText,
		ShiftCOLOUR;

	ShiftText = [ "上上班次", "上班次", "本班次", "下班次", "下下班次" ];

	ShiftCOLOUR = [ "text-grey", "text-red", "text-yellow", "text-blue", "text-grey" ];

	STATUS = [ "待开工", "已开工", "暂停中", "已完工", "异常中" ];

	COLOUR = [ "text-yellow", "text-green", "text-blue", "text-grey", "text-red" ];
	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{ID}}"  data-shift="{{ShiftStatus}}" >',
			'<div class="ms-col ms-col-f">',
			'<div class="ms-limit">',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> <span class="ms-text">{{WorkShopName}}</span>',
			'<span class="ms-text">{{LineName}}</span>',
			'</span> <span>{{PartPointName}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-margin">{{TaskName}}</span>',
			'<span class="ms-label">设备:</span>',
			'<span class="ms-text">{{DeviceNo}}</span>',
			'</span> <span class="ms-field"> <span class="ms-label">人员:</span>',
			'<span class="ms-text">{{OperatorName}}</span>',
			'</span><span class="ms-field"> <span class="ms-label"></span>',
			'<span class="ms-text {{Shiftcolor}}">{{ShiftText}}</span>',
			'</span>',
			'</div>',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{StatusText}}</span>',
			'</div>',
			'</div>',

		].join("")
	};

	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			


			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id"),
					shift = Number($this.attr("data-shift"));

				if (shift < -1 || shift > 1) {
					return;
				}
				window.location = "detail.html?id=" + id;

			});
		},

		run : function() {

			var _shift_id = 0;
			var _person_judge = 0;
			if (window.JSImpl) {
				_shift_id = window._shift_id;
				_person_judge = window._person_judge;



			}
			model.com.getTaskPartPoint({
				workshop_id : 0,
				line_id : 0,
				device_no : "",
				operator_id : 0,
				shift_id : _shift_id,
				person_judge : _person_judge
			}, function(data) {

				model.com.render(model.com.filter(data.list));
			});

		},

		com : {
			getTaskPartPoint : function(data, fn, context) {
				var d = {
					$URI : "/TaskHandle/All",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {

				$.each(data, function(i, item) {

					item.StatusText = STATUS[item.Status];
					item.Color = COLOUR[this.Status];

					var _cur = new Date();

					var _shiftID = Number($com.util.format("yyyyMMdd01", _cur))
					this.ShiftStatus = 0;
					while (this.ShiftID > _shiftID) {
						_shiftID = Number($com.util.format("yyyyMMdd01", new Date(_cur.getTime() + 86400000)));
						this.ShiftStatus++;
					}
					while (this.ShiftID < _shiftID) {
						_shiftID = Number($com.util.format("yyyyMMdd01", new Date(_cur.getTime() - 86400000)));
						this.ShiftStatus--;
					}

					this.ShiftText = ShiftText[this.ShiftStatus + 2];

					this.Shiftcolor = ShiftCOLOUR[this.ShiftStatus + 2];

				});

				return data;
			},

			render : function(data) {
				model._data = data;
				$(".m-table").html($com.util.template(data, HTML.LIST));
			}
		}
	});
	model.init();
});

//# sourceMappingURL=maps/list-e9563bc81f.js.map