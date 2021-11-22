require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD_SEARCH_LIST,
		KEYWORD_SEARCH,
		in_defult,
		STATUS,
		TypeSource_SEARCH,
		WORKSHOP = {},
		LINE = {},
		STATUS = [ "未知", "保存", "下达", "开工", "完工", "终止", "暂停" ],
		COLOUR = [ "text-grey", "text-grey", "text-yellow", "text-blue", "text-green", "text-grey", "text-red" ];

	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{ID}}" data-gid="{{GroupID}}" data-lid="{{LineID}}" data-wid="{{WorkShopID}}" data-sid="{{ShiftID}}" >',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title"><span class="ms-field femi-rt">',
			'<span class="ms-text ms-margin">{{StartTimeText}}</span>',
			'<span class="ms-text">{{WorkShopName}}</span>',
			'<span class="ms-text">{{LineName}}</span>',
			'</span> <span>{{PartName}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">计划数:</span><span class="ms-text">{{FQTYShift}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">完成数:</span><span class="ms-text">{{FQTYDone}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">操作员：</span><span class="ms-text">{{OperatorName}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{StatusText}}</span>',
			'</div>',
			'</div>' ].join(""),
	};


	KEYWORD_SEARCH_LIST = [
		"WorkShopID|车间|ArrayOneControl",
		"LineID|产线|ArrayOneControl|WorkShopID",
		/*	"orderMode|订单类型|ArrayOne",*/
		"Status|订单状态|ArrayOne",
		"Time|日期|Date",
	];


	KEYWORD_SEARCH = {};
	in_defult = {
		WorkShopID : 0,
		LineID : 0,
		/*orderMode : 0,*/
		Status : 0,
		Time : new Date()
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
		WorkShopID : [ {
			name : "全部",
			value : 0
		} ],
		LineID : [ {
			name : "全部",
			value : 0,
			far : 0
		} ],
		/*orderMode : [ {
			name : "全部",
			value : 0
		}, {
			name : "APS订单",
			value : 1
		}, {
			name : "关闭订单",
			value : 2
		}, {
			name : "ERP订单",
			value : 3
		}, {
			name : "完成订单",
			value : 4
		}, {
			name : "MES订单",
			value : 5
		}, {
			name : "在制订单",
			value : 6
		}, {
			name : "待制订单",
			value : 7
		} ],*/
		Status : [ {
			name : "全部",
			value : 0,
		}, {
			name : "保存",
			value : 1,
		}, {
			name : "下达",
			value : 2,
		}, {
			name : "开工",
			value : 3,
		}, {
			name : "完工",
			value : 4,
		}, {
			name : "终止",
			value : 5,
		}, {
			name : "暂停",
			value : 6,
		} ]
	};


	model = $com.Model.create({
		name : '报工任务',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			$("body").delegate(".m-select", "click", function(e) {
				//弹出搜索框
				if (!$(".femi-search-contain").is(":hidden")) {
					$(".femi-search").html("");
					$(".femi-search-contain").hide();
				} else {

					$com.searchForm.show($(".femi-search"), in_defult, KEYWORD_SEARCH, function(rst) {
						model.com.get(rst, function(data) {
							if (data.list != null) {
								model.com.render(model.com.filter(data.list));
							}
						});

					}, TypeSource_SEARCH);

				}
				e.stopPropagation();
			});

			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id"),
					gid = $this.attr("data-gid"),
					lid = $this.attr("data-lid"),
					wid = $this.attr("data-wid"),
					sid = $this.attr("data-sid");

				window.location = "detail.html?id=" + id + "&workShopID=" + wid+ "&lineID=" + lid+ "&gid=" + gid+ "&sid=" + sid;
			
			});
		},

		run : function() {
			$(".femi-search-contain").hide();

			model.com.getWorkShop({}, function(data) {
				$.each(data.list, function(i, item) {
					WORKSHOP[item.ID] = item.WorkShopName;
					TypeSource_SEARCH.WorkShopID.push({
						name : item.WorkShopName,
						value : item.ID,
						far : null
					})
					$.each(item.lineList.aPSItem, function(l_i, l_item) {
						LINE[l_item.ID] = l_item.itemName;
						TypeSource_SEARCH.LineID.push({
							name : l_item.itemName,
							value : l_item.ID,
							far : item.ID
						})
					});

				});

			});



			var _shift_id = 0;
			if (window.JSImpl) {
				_shift_id = window._shift_id;
			}
			this.com.get({
				WorkShopID : 0,
				LineID : 0,
				shift_id : _shift_id
			}, function(data) {
				model._employees = data.info;
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
			get : function(data, fn, context) {
				var d = {
					$URI : "/RealOrder/TaskAll",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},


			filter : function(data) {

				$.each(data, function(i, item) {
					item.StartTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.StartTime);
					item.EndTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.EndTime);
					item.StatusText = STATUS[item.Status];
					item.Color = COLOUR[item.Status];
					item.OperatorName = model._employees[item.OperatorID];
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