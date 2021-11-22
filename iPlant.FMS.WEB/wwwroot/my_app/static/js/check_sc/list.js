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
        FORMATTRT_SEARCH,
		in_defult,
		WORKSHOPLIST,
		TASKTYPELIST;
	WORKSHOPLIST = {};

	STATUS = [ "未检", "合格", "不合格" ];

	COLOUR = [ "text-yellow", "text-blue", "text-red" ];

	CHECKLIST = [ "0", "1", "1" ];

	KEYWORD_SEARCH_LIST = [
		"WorkShopID|车间|ArrayOne",
		"LineID|产线|ArrayOne",
		"TaskType|点检类型|ArrayOne",
        "ModelID|设备号|ArrayOne",
        "TypeID|类型|ArrayOne"
	];

	KEYWORD_SEARCH = {};
	in_defult = {
		WorkShopID : 0,
		LineID : 0,
		TaskType : 0
	}
	TASKTYPELIST = [ "未知类型", "操作点检", "电气点检", "机械点检", "维护保养" ];
	FORMATTRT_SEARCH = {};

	TypeSource_SEARCH = {
		WorkShopID : [ {
			name : "无",
			value : 0
		}],
		ModelID: [{
		    name: "无",
		    value: 0
		}],
		TypeID: [{
		    name: "无",
		    value: 0
		}],
		LineID : [ {
			name : "无",
			value : 0
		} ],
		TaskType : [ {
			name : "未知类型",
			value : 0
		}, {
			name : "操作点检",
			value : 1
		}, {
			name : "电气点检",
			value : 2
		}, {
			name : "机械点检",
			value : 3
		}, {
			name : "维护保养",
			value : 4
		} ]
	};

	$.each(KEYWORD_SEARCH_LIST, function(i, item) {
		var detail = item.split("|");
		KEYWORD_SEARCH[detail[0]] = {
			index : i,
			name : detail[1],
			type : detail.length > 2 ? detail[2] : undefined
		};
		if (detail.length > 2) {
		    FORMATTRT_SEARCH[detail[0]] = $com.util.getFormatter(TypeSource_SEARCH, detail[0], detail[2]);
		}
	});


	HTML = {
	    LIST: ['<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{Result}}" data-no="{{DeviceNo}}">',
			'<div class="ms-col ms-col-f">',
			'<div class="ms-limit">',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text ms-margin">{{LineName}}</span>',
			'</span> <span>{{DeviceNo}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-margin">{{TaskTypeText}}</span>',
			'<span class="ms-label">人员:</span>',
			'<span class="ms-text">{{Operator}}</span>',
			'</span> ',
			'<span class="ms-field">',
			'<span class="ms-label">激活:</span>',
			'<span class="ms-text">{{ActiveTimeText}}</span>',
			'</span>',
			'</div>',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{ResultText}}</span>',
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

			/*	$("body").delegate(".m-select", "click", function(e) {
					//弹出搜索框
					if (!$(".femi-search").is(":hidden")) {
						$(".femi-search").html("");
						$(".femi-search").hide();
					} else {
						$com.searchForm.show($(".femi-search"), in_defult, KEYWORD_SEARCH, function(rst) {
							


						}, TypeSource_SEARCH);
					}
					e.stopPropagation();
				});
				*/
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
			
			
			$(".m-title .m-switch").delegate(".m-switch-btn:not(.active)", "click", function() {
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

				if (check == 0) {
					window.QRTEST = function(val) {
						if (val == device) {
						    window.location = "item.html?id=" + id + "&applyID=" + check;
						} else {
							alert("任务与设备不符请核对设备");
						}
					};

					window.JSImpl.readQRCode('QRTEST');
				} else {
				    window.location = "itemDetail.html?id=" + id+"?applyID=" + check;
				}
			});
		},

		run : function() {

			var _shift_id=0;
			var _person_judge=0;
			if (window.JSImpl) { 
				 _shift_id = window._shift_id;
				 _person_judge =   window._person_judge; 
			}
			 
			model.com.getDeviceModel({ DeviceWorkType: -1, Active: -1, StartTime: "2000-01-01", EndTime: "2000-01-01", }, function (resW) {
			    if (resW && resW.list) {
			        $.each(resW.list, function (i, item) {
			            TypeSource_SEARCH.ModelID.push({
			                name: item.ModelNo,
			                value: item.ID,
			                //  far:item.WorkShopID
			            });
			        });

			    }
			    model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resW) {
			        if (resW && resW.list) {
			            $.each(resW.list, function (i, item) {
			                TypeSource_SEARCH.LineID.push({
			                    name: item.Name,
			                    value: item.ID,
			                    //  far:item.WorkShopID
			                });
			            });

			        }
			        model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
			            if (resW && resW.list) {
			                $.each(resW.list, function (i, item) {
			                    TypeSource_SEARCH.WorkShopID.push({
			                        name: item.Name,
			                        value: item.ID,
			                        far: 0
			                    });
			                });

			            }
			        });
			        model.com.getType({
			            ModelID: -1, Name: "",
			            Active: -1, StartTime: "2000-01-01", EndTime: "2000-01-01",
			            BusinessUnitID: 0, BaseID: 0, FactoryID: 0,
			            WorkShopID: 0, LineID: 0, ConfigType: 0
			        }, function (resq) {
			            if (resq && resq.resq) {
			                $.each(resq.list, function (i, item) {
			                    TypeSource_SEARCH.TypeID.push({
			                        name: item.Name,
			                        value: item.ID,
			                        far: 0
			                    });
			                });

			            }


			            model.com.get({
			                ModelID: -1, Status: 0, StartTime: "2000-01-01", EndTime: "2000-01-01"
			            }, function (data) {
			                model.com.render(model.com.filter(data.list));
			            });


			        });
			      
			        //	model.com.get({
			        //	shift_id : _shift_id,
			        //	operator_id : 0,
			        //	person_judge:_person_judge
			        //}, function(data) {
			        //	model.com.render(model.com.filter(data.list));
			        //});
			    });
			});
			
		},

		com: {

		    //类型
		    getType: function (data, fn, context) {
		        var d = {
		            $URI: "/DevicePointCheckType/All",
		            $TYPE: "get"
		        };

		        function err() {
		            $com.app.tip('获取失败，请检查网络');
		        }

		        $com.app.ajax($.extend(d, data), fn, err, context);
		    },

		    //查询车间
		    getFMCWorkShop: function (data, fn, context) {
		        var d = {
		            $URI: "/FMCWorkShop/All",
		            $TYPE: "get"
		        };

		        function err() {
		            $com.app.tip('获取失败，请检查网络');
		        }

		        $com.app.ajax($.extend(d, data), fn, err, context);
		    },
		    //查询设备
		    getDeviceModel: function (data, fn, context) {
		        var d = {
		            $URI: "/DeviceModel/All",
		            $TYPE: "get"
		        };

		        function err() {
		            $com.app.tip('获取失败，请检查网络');
		        }

		        $com.app.ajax($.extend(d, data), fn, err, context);
		    },
		    //查询产线
		    getFMCLine: function (data, fn, context) {
		        var d = {
		            $URI: "/FMCLine/All",
		            $TYPE: "get"
		        };

		        function err() {
		            $com.app.tip('获取失败，请检查网络');
		        }

		        $com.app.ajax($.extend(d, data), fn, err, context);
		    },
			get : function(data, fn, context) {
				var d = {
				    $URI: "/DevicePointCheckTask/All",
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
					//if(item.Status<1||item.Status>4)
					//	return true;
					
				    item.WorkShopName = "模组";
                        //FORMATTRT_SEARCH["WorkShopID"](item.WorkShopID);
				    item.LineName = "160V";
                        //FORMATTRT_SEARCH["LineID"](item.LineID);
				    item.TaskTypeText = FORMATTRT_SEARCH["TypeID"](item.TypeID);
				    item.DeviceNo = FORMATTRT_SEARCH["ModelID"](item.ModelID);
				    
                        //TASKTYPELIST[item.TaskType]; 
				    item.ActiveTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.StartTime);
				    item.Operator = "admin";
                        //STATUS[item.Result];
					item.Color = COLOUR[1];
					item.Check = CHECKLIST[1];
					item.ResultText = "合格";
					item.Result = item.ApplyID;

					_data.list1.push(item);
					//if (item.Result > 0) {
					//	_data.list2.push(item);
					//} else {
					//	_data.list1.push(item);
					//}
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