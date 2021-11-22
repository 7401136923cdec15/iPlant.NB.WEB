require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD_SEARCH_LIST,
		KEYWORD_SEARCH,
		in_defult,
		STATUS,
		TypeSource_SEARCH,
		WORKSHOP = {},
		LINE = {};

	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{ID}}"  data-pid="{{Position}}"  data-sid="{{ShiftID}}" >',
			'<div class="ms-col ms-col-f" style="width:100%;max-width: 100%">',
			'<div class="ms-limit" style="width:100%;max-width: 100%">',
			'<div class="ms-title"><span class="ms-field femi-rt">',
			'<span class="ms-text ms-margin">{{ShiftID}}</span>',
			'<span class="ms-text">{{WorkShopName}}</span>',
			'<span class="ms-text">{{LineName}}</span>',
			'</span> <span>{{EmployeeName}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">工序段：</span><span class="ms-text">{{PartName}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">产品型号:</span><span class="ms-text">{{ProductNo}}</span>',
			'</span>', 
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">计划：</span><span class="ms-text">{{OrderNo}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">采集:</span><span class="ms-text">{{FQTYParts}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">完成:</span><span class="ms-text">{{FQTYDone}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">合格：</span><span class="ms-text">{{FQTYGood}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">良品率：</span><span class="ms-text">{{GoodBFB}}</span>',
			'</span>',
			'</div>',
			'</div></div>',

			'</div>' ].join(""),
	};

	KEYWORD_SEARCH_LIST = [
		"Employee_id|员工|ArrayOneEdit",
		"StartTime|开始时间|Date",
		"EndTime|结束时间|Date"
	];

	KEYWORD_SEARCH = {};
	in_defult = {
		Employee_id : 0,
		StartTime : new Date(new Date().getTime() - 86400000 * 3),
		EndTime : new Date()
	}

	$.each(KEYWORD_SEARCH_LIST, function(i, item) {
		var detail = item.split("|");
		KEYWORD_SEARCH[detail[0]] = {
			index : i,
			name : detail[1],
			type : detail.length > 2 ? detail[2] : undefined,
			control : detail.length > 3 ? detail[3] : undefined
		};
	});


	TypeSource_SEARCH = {
		Employee_id : [ {
			name : "本人",
			value : 0
		} ]
	};


	model = $com.Model.create({
		name : '报工任务',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			$("body").delegate(".femi-svg-serach", "click", function(e) {
				//弹出搜索框
				if (!$(".femi-search-contain").is(":hidden")) {
					$(".femi-search").html("");
					$(".femi-search-contain").hide();
				} else {

					$com.searchForm.show($(".femi-search"), in_defult, KEYWORD_SEARCH, function(rst) {

						if (rst.StartTime >= rst.EndTime) {
							alert("查询的开始时间必须小于结束时间");
							return;
						}
						model.com.get(rst, function(data) {
							if (data.list != null) {
								model.com.render(model.com.filter(data.list));
							}
						});

					}, TypeSource_SEARCH);

				}
				e.stopPropagation();
			});

		 
		},

		run : function() {
			$(".femi-search-contain").hide();

			model.com.getWorkShop({}, function(data) {
				$.each(data.list, function(i, item) {
					WORKSHOP[item.ID] = item.WorkShopName;
					$.each(item.lineList.aPSItem, function(l_i, l_item) {
						LINE[l_item.ID] = l_item.itemName;
					});

				});

			});
			model.com.getEmployee({active:1}, function(data) {

				$.each(data.list, function(i, item) {
					TypeSource_SEARCH.employee_id.push({
						name : item.name,
						value : item.ID
					});
				});

			});



			var _shift_id = 0;
			if (window.JSImpl) {
				_shift_id = window._shift_id;
			}
			this.com.get({
				shift_id : _shift_id
			}, function(data) {
				model.com.render(model.com.filter(data.list));
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
			getEmployee : function(data, fn, context) {
				var d = {
					$URI : "/User/All",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			get : function(data, fn, context) {
				var d = {
				    $URI: "/KpiEmployee/TaskAll",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},


			filter : function(data) {

				$.each(data, function(i, item) {
					item.WorkShopName = WORKSHOP[item.WorkShopID];
					item.LineName = LINE[item.LineID];
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
//# sourceMappingURL=maps/list-847d2ef23f.js.map