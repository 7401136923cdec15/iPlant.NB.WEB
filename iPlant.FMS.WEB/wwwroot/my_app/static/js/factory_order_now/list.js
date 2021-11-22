require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	//需要引用bootstrap的就添加一个url:'../static/utils/js/base/bootstrap' 参数 BS  然后先执行BS();
	//需要用动态表单的添加 '../static/utils/js/base/entry' 参数	 iForm 

	var model,
		HTML,
		STATUS ,
		PRODUCT,
		COLOUR,
		KEYWORD_SEARCH,
		KEYWORD_SEARCH_LIST,
		TypeSource_SEARCH,
		in_defult,
		LETTER;
	STATUS = [ "未知", "保存", "下达", "开工", "完工", "终止", "暂停" ];
	PRODUCT = [ "未知", "内圈", "外圈", "装配", "钢球", "保持架", "密封圈" ];
	COLOUR = [ "text-grey","text-grey", "text-yellow", "text-blue", "text-green", "text-grey" , "text-red"];
 
	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{ID}}">',
			'<div class="ms-col ms-col-f">',
			'<div class="ms-limit">',
			'<div class="ms-title">', 
			'<span class="ms-field femi-rt"> <span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text">{{LineName}}</span>',
			'</span> <span>{{Name}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"> <span class="ms-label">计划数:</span>',
			'<span class="ms-text">{{FQTYTotal}}</span>',
			'</span>', 
			'<span class="ms-field"> <span class="ms-label">开始时间:</span>',
			'<span class="ms-text">{{StartTimeText}}</span>',
			'</span>', 
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"> <span class="ms-label">完成数:</span>',
			'<span class="ms-text">{{FQTYDone}}</span>',
			'</span> <span class="ms-field"> <span class="ms-label">产品编号:</span>',
			'<span class="ms-text">{{ProductNo}}</span>',
			'</span>', 
			'</div>',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{StatusText}}</span>',
			'</div>',
			'</div>',

		].join(""),
	};


	KEYWORD_SEARCH_LIST = [
		"WorkShopID|车间|ArrayOneControl",
		"LineID|产线|ArrayOneControl|WorkShopID",
		"ProductType|产品类型|ArrayOne",
		"StartTime|开始时间|DateTime",
		"EndTime|结束时间|DateTime",
	];

	KEYWORD_SEARCH = {};
	in_defult = {
		WorkShopID : 0,
		LineID : 0,
		ProductType : 0,
		StartTime:new Date(new Date().getTime()-86400000*3),
		EndTime:new Date()
	}


	TypeSource_SEARCH = {
		WorkShopID : [ {
			name : "全部",
			value : 0
		} ],
		LineID : [ {
			name : "全部",
			value : 0,
			far :0
		} ],
		ProductType : [ {
			name : "全部",
			value : 0
		}, {
			name : "内圈",
			value : 1
		}, {
			name : "外圈",
			value : 2
		}, {
			name : "装配",
			value : 3
		}, {
			name : "钢球",
			value : 4
		}, {
			name : "保持架",
			value : 5
		}, {
			name : "密封圈",
			value : 6
		} ],
	};

	$.each(KEYWORD_SEARCH_LIST, function(i, item) {
		var detail = item.split("|");
		KEYWORD_SEARCH[detail[0]] = {
			index : i,
			name : detail[1],
			type : detail.length > 2 ? detail[2] : undefined,
					control:	detail.length > 3? detail[3] : undefined
		};
	});



	model = $com.Model.create({
		name : 'iPlantApp',

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
					id = $this.attr("data-id");
				window.location = "info.html?id=" + id;

			});




		},

		run : function() {
			$(".femi-search-contain").hide();

			model.com.getWorkShop({}, function(data) { 
				$.each(data.list, function(i, item) {
					TypeSource_SEARCH.WorkShopID.push({
						name : item.WorkShopName,
						value : item.ID,
						far : null
					})
					$.each(item.lineList.aPSItem, function(l_i, l_item) {
						TypeSource_SEARCH.LineID.push({
							name : l_item.ItemName,
							value : l_item.ID,
							far : item.ID
						})
					});

				});

			});


			this.com.get({
			}, function(data) {
				if (data.list != null) {
					model.com.render(model.com.filter(data.list));
				}
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
					$URI : "/RealOrder/All",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {

				$.each(data, function(i, item) {
					item.Name=this.OrderNo+" "+this.PartName,
					item.StartTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", this.StartTime),
					item.EndTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", this.EndTime),
					item.StatusText = STATUS[item.Status]; 
					item.Color = COLOUR[this.Status];
				});

				return data;
			},

			render : function(data) {
				$(".m-list .m-table").html($com.util.template(data, HTML.LIST));
			}
		}
	});

	model.init();
});
//# sourceMappingURL=maps/list-565942f460.js.map