require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {

	//需要引用bootstrap的就添加一个url:'./static/utils/js/base/bootstrap' 参数 BS  然后先执行BS();
	//需要用动态表单的添加 './static/utils/js/base/entry' 参数	 iForm 


	var model,
		HTML,
		STATUS,
		COLOUR,
		CHECKLIST,
		TypeSource_SEARCH,
		KEYWORD_SEARCH_LIST,
		KEYWORD_SEARCH,
		in_defult,
		WORKSHOPLIST,
		TASKTYPELIST;
	WORKSHOPLIST = {};

	STATUS = [ "已下达", "待保养", "已完成", "已关闭", "已超时", "待激活" ];

	COLOUR = [ "text-grey", "text-yellow", "text-blue", "text-grey", "text-red", "text-grey" ];



	KEYWORD_SEARCH_LIST = [
		"WorkShopID|车间|ArrayOneControl",
		"LineID|产线|ArrayOneControl|WorkShopID"
	];

	KEYWORD_SEARCH = {};
	in_defult = {
		WorkShopID : 0,
		LineID : 0,
	}


	TypeSource_SEARCH = {
		WorkShopID : [ {
			name : "全部",
			value : 0
		} ],
		LineID : [ {
			name : "全部",
			value : 0
		} ]
	};

	$.each(KEYWORD_SEARCH_LIST, function(i, item) {
		var detail = item.split("|");
		KEYWORD_SEARCH[detail[0]] = {
			index : i,
			name : detail[1],
			type : detail.length > 2 ? detail[2] : undefined,
			control : detail.length > 3 ? detail[3] : undefined
		};
	});


	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{ItemResult}}" data-no="{{DeviceNo}}">',
			'<div class="ms-col ms-col-f">',
			'<div class="ms-limit">',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text">{{ActiveTimeText}}</span>',
			'</span> ',
			'<span>{{ItemText}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field  femi-rt"> ',
			'<span class="ms-text">{{Operator}}</span>',
			'</span>   ',
			'<span class="ms-field"> ',
			'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text ms-margin">{{LineName}}</span> ',
			'<span class="ms-text">{{DeviceNo}}</span>',
			'</span>   ',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-text ms-label">方法/标准：</span> ',
			'<span class="ms-text">{{Standard}}</span> ',
			'</span>',
			'</div>',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{ItemResultText}}</span>',
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

			$(".m-title .m-switch").delegate(".m-switch-btn.active", "click", function(e) {
				//弹出搜索框
				var $this = $(this);
				if (!$(".femi-search-contain").is(":hidden")) {
					$(".femi-search").html("");
					$(".femi-search-contain").hide();
				} else {

					$com.searchForm.show($(".femi-search"), in_defult, KEYWORD_SEARCH, function(res) {
						var _shift_id = 0;
						var _person_judge = 0;
						if (window.JSImpl) { 
							 _shift_id = window._shift_id;
							 _person_judge =   window._person_judge; 
						}
						model.com.get({
							shift_id : _shift_id,
							person_judge : _person_judge,
							status : 0,
							workshop_id : Number(res.WorkShopID),
							line_id : Number(res.LineID),
							operator_id : 0
						}, function(data) {
							model._data = model.com.filter(data.list);

							if ($this.next("a.m-switch-btn")[0]) {
								model._showData = model._data.list1;
								$(".m-table").html($com.util.template(model._data.list1, HTML.LIST));
							} else {
								model._showData = model._data.list2;
								$(".m-table").html($com.util.template(model._data.list2, HTML.LIST));
							}
							if ($("#Filter").hasClass("Checking")) {
								$("#Filter").removeClass("Checking");
								$("#Filter").html("筛选");
							}
						});

					}, TypeSource_SEARCH);
				}
				e.stopPropagation();
			});

			$("#Filter").click(function() {
				if ($("#Filter").hasClass("Checking")) {
					$("#Filter").removeClass("Checking");
					$("#Filter").html("筛选");
					$(".m-table").html($com.util.template(model._showData, HTML.LIST));
				} else {

					window.QRTEST = function(str) {

						var _list = [],
							_dataList = [],
							_HtmlType = "";

						_list = model._showData;
						_HtmlType = HTML.LIST;

						_dataList = FilterNo(_list, str);
						if (!_dataList || _dataList.length < 1) {
							alert("该设备未找到当前条件的任务");
							return;
						}
						$("#Filter").addClass("Checking");
						$("#Filter").html("全部");
						$(".m-table").html($com.util.template(_dataList, _HtmlType));
					};
					window.JSImpl.readQRCode('QRTEST');
				}
			});
			$(".m-title .m-switch").delegate(".m-switch-btn:not(.active)", "click", function(e) {
				var $this = $(this);
				var $sib = $this.siblings();
				$this.addClass("active");
				$sib.removeClass("active");

				$("#Filter").removeClass("Checking");
				$("#Filter").html("筛选");

				if ($this.next("a.m-switch-btn")[0]) {
					model._showData = model._data.list1;
					$(".m-table").html($com.util.template(model._data.list1, HTML.LIST));
				} else {
					model._showData = model._data.list2;
					$(".m-table").html($com.util.template(model._data.list2, HTML.LIST));
				}
				
				if (!$(".femi-search").is(":hidden")) {
					$(".femi-search").html("");
					$(".femi-search").hide();
				} 
				e.stopPropagation();

			});
			function FilterNo(array, par) {
				var _list = [];
				$.each(array, function(i, item) {

					if (item.DeviceNo == par)
						_list.push(item);
				});
				return _list;
			}
			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id"),
					device = $this.attr("data-no"),
					check = $this.attr("data-check");

				if (check == 1) {
					window.QRTEST = function(val) {
						if (val == device) {
							window.location = "check.html?id=" + id;
						} else {
							alert("任务与设备不符请核对设备");
						}
					};

					window.JSImpl.readQRCode('QRTEST');
				} else if (check == 2) {
					window.location = "detail.html?id=" + id;
				}
			});
		},

		run : function() {

			$(".femi-search-contain").hide();
			
			var _shift_id = 0;
			var _person_judge = 0;
			if (window.JSImpl) { 
				 _shift_id = window._shift_id;
				 _person_judge =   window._person_judge; 
			}

			model.com.getWorkShop({}, function(data) {
				/*TypeSource_SEARCH.workShopID.splice(0, TypeSource_SEARCH.workShopID.length);*/
				TypeSource_SEARCH.LineID.splice(0, TypeSource_SEARCH.LineID.length);

				$.each(data.list, function(i, item) {
					var Temp = {
						name : item.WorkShopName,
						line : {}
					};

					TypeSource_SEARCH.WorkShopID.push({
						name : item.WorkShopName,
						value : item.ID,
						far : null
					})
					$.each(item.lineList.aPSItem, function(l_i, l_item) {
						Temp.line[l_item.ID] = l_item.ItemName;
						TypeSource_SEARCH.LineID.push({
							name : l_item.ItemName,
							value : l_item.ID,
							far : item.ID
						})
					});
					WORKSHOPLIST[item.ID] = Temp;
				});
			});

			model.com.get({
				shift_id : _shift_id,
				person_judge : _person_judge,
				status : 0,
				workshop_id : 0,
				line_id : 0,
				operator_id : 0
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
			get : function(data, fn, context) {
				var d = {
					$URI : "/MaintenceDevice/Tasks",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
				var _data = {
					list1 : [],
					list2 : []
				};
				$.each(data, function(i, item) {
					
					
					
					item.ActiveTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.ActiveTime);
					item.ItemResultText = STATUS[item.ItemResult];
					item.Color = COLOUR[item.ItemResult];
					item.Check = item.ItemResult;

					if (item.ItemResult == 2) {
						_data.list2.push(item);
					} else if (item.ItemResult == 1 || item.ItemResult == 4 || item.ItemResult == 5) {
						 
						_data.list1.push(item);
					}
				});

				return _data;
			},

			render : function(data) {
				model._data = data;
				model._showData = model._data.list1;
				$(".m-table").html($com.util.template(model._showData, HTML.LIST));
			}
		}
	});
	model.init();
});

//# sourceMappingURL=maps/list-e9563bc81f.js.map