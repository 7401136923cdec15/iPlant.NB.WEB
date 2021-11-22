require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	//需要引用bootstrap的就添加一个url:'../static/utils/js/base/bootstrap' 参数 BS  然后先执行BS();
	//需要用动态表单的添加 '../static/utils/js/base/entry' 参数	 iForm 

	var model,
		HTML,
		STATUS,
		COLOUR,
		SEARCHDATA,
		KEYWORD,
		KEYWORD_LIST,
		TypeSource,
		in_defult,
		DEVICETYPE;

	STATUS = [ "生产中", "就绪", "保养", "故障", "报废" ];

	COLOUR = [ "text-blue", "text-green", "text-blue", "text-red", "text-grey" ];

	DEVICETYPE = {};

	TypeSource = {
		WorkShopID : [ {
			name : "全部",
			value : 0
		} ],
		LineID : [ {
			name : "全部",
			value : 0,
			far : 0
		} ],
		DeviceTypeID : [ {
			name : "无",
			value : 0
		} ],
	};

	KEYWORD_LIST = [
		"WorkShopID|车间|ArrayOneControl",
		"LineID|产线|ArrayOneControl|WorkShopID",
		"DeviceTypeID|设备类型|ArrayOne",


	];
	KEYWORD = {};

	$.each(KEYWORD_LIST, function(i, item) {
		var detail = item.split("|");
		KEYWORD[detail[0]] = {
			index : i,
			name : detail[1],
			type : detail.length > 2 ? detail[2] : undefined,
			control : detail.length > 3 ? detail[3] : undefined
		};
	});

	in_defult = {
		WorkShopID : 0,
		LineID : 0,
		DeviceTypeID : 0
	}

	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{ID}}" >',
			'<div class="ms-col ms-col-f">',
			'<div class="ms-limit">',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> <span class="ms-text">{{WorkShopName}}</span>',
			'<span class="ms-text">{{LineName}}</span>',
			'</span> <span>{{DeviceNo}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">类型：</span><span class="ms-text">{{Type}}</span></span>',
			'<span class="ms-field"> <span class="ms-label">开机时刻：</span>',
			'<span class="ms-text">{{ShiftStartTimeText}}</span></span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">报警数：</span><span class="ms-text">{{ShiftAlarms}}</span></span> ',
			'<span class="ms-field"> <span class="ms-label">报警时长：</span><span class="ms-text">{{ShiftAlarmTimes}}</span></span>',
			'<span class="ms-field"><span class="ms-label">开机时长：</span><span class="ms-text">{{ShiftRunTimes}}</span></span>',
			'</div>',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status  {{Color}}">{{StatusText}}</span>',
			'</div>',
			'</div>' ].join("")
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
					id = $this.attr("data-id");

				window.location = "info.html?id=" + id;

			});
			$("body").delegate("a.m-select", "click", function(e) {
				if (!$(".femi-search-contain").is(":hidden")) {
					$(".femi-search").html("");
					$(".femi-search-contain").hide();
				} else {

					$com.SearchForm.show($(".femi-search"), in_default, KEYWORD, function(res) {

						model.com.get(res, function(data) {
							model.com.render(model.com.filter(data.list));
						});

					}, TypeSource);


				}

				e.stopPropagation();
			});

		},

		run : function() {

			$(".femi-search-contain").hide();

			model.com.getWorkShop({}, function(data) {
				$.each(data.list, function(i, item) {
					TypeSource.WorkShopID.push({
						name : item.WorkShopName,
						value : item.ID,
						far : null
					})
					$.each(item.lineList.aPSItem, function(l_i, l_item) {
						TypeSource.LineID.push({
							name : l_item.ItemName,
							value : l_item.ID,
							far : item.ID
						})
					});

				});

			});


			model.com.getDeviceProperty({type:5}, function(data) {

				DEVICETYPE = model.com.filterType(data.list);

				model.com.get({
				}, function(data) {
					model.com.render(model.com.filter(data.list));
				});
			});


		},

		com : {
			getWorkShop : function(data, fn, context) {
				var d = {
					$URI : "/WorkShop/All",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			getDeviceProperty : function(data, fn, context) {
				var d = {
					$URI : "/Device/Property",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			filterType : function(data) {
				var _data = {};
				TypeSource.DeviceTypeID.splice(0, TypeSource.DeviceTypeID.length);
				$.each(data, function(i, item) {
					TypeSource.DeviceTypeID.push({
						name : item.Name,
						value : item.ID
					});
					_data[item.ID] = item.Name;
				});
				return _data;
			},

			get : function(data, fn, context) {
				var d = {
					$URI : "/RealDevice/All",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {

				$.each(data, function(i, item) {

					item.Type = DEVICETYPE[item.DeviceTypeID];
					item.StatusText = STATUS[item.Status];
					item.ShiftStartTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.ShiftStartTime);
					item.Color = COLOUR[this.Status];
				});

				return data;

			},

			render : function(data) {
				$(".m-table").html($com.util.template(data, HTML.LIST));
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/list-565942f460.js.map