require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD_SEARCH_LIST,
		KEYWORD_SEARCH,
		in_defult,
		STATUS,
		TypeSource_SEARCH;

	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{ID}}"  data-pid="{{Position}}"  data-sid="{{ShiftID}}" >',
			'<div class="ms-col ms-col-f" style="width:100%;max-width: 100%">',
			'<div class="ms-limit" style="width:100%;max-width: 100%">',
			'<div class="ms-title"><span class="ms-field femi-rt">',
			'<span class="ms-text ms-margin">{{ShiftID}}</span>',
			'<span class="ms-text">{{Department}}</span>',
			'<span class="ms-text">{{PositionName}}</span>',
			'</span> <span>{{Name}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label"></span><span class="ms-text">{{SFCText}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">总数:</span><span class="ms-text">{{SFCTotal}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">执行数:</span><span class="ms-text">{{SFCDone}}</span>',
			'</span>', 
			'<span class="ms-field">',
			'<span class="ms-label">执行率：</span><span class="ms-text">{{SFCBFB}}</span>',
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
		StartTime : new Date(new Date().getTime()-86400000*3),
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
		name : '人员KPI',

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
						
						if(rst.StartTime>=rst.EndTime)
						{
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
		 

			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id"),
					pid = $this.attr("data-pid"), 
					sid = $this.attr("data-sid");

				window.location = "detail.html?id=" + id + "&position=" + pid+ "&shift_id=" + sid;
			
			});
		},

		run : function() {
			$(".femi-search-contain").hide();

			model.com.getEmployee({active:1}, function(data) {
				
				$.each(data.list,function(i,item){
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
				    $URI: "/KpiEmployee/All",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},


			filter : function(data) {
 

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