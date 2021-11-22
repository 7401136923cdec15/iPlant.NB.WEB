require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	//需要引用bootstrap的就添加一个url:'../static/utils/js/base/bootstrap' 参数 BS  然后先执行BS();
	//需要用动态表单的添加 '../static/utils/js/base/entry' 参数	 iForm 

	var model,
		HTML,
		STATUS,
		COLOUR,
		KEYWORD,
		KEYWORD_LIST, 
		TASK_STATUS;

	STATUS = [ "未知", "保存", "下达", "开工", "完工", "终止", "暂停" ]; 
	COLOUR = [ "text-grey", "text-grey", "text-yellow", "text-blue", "text-green", "text-grey", "text-red" ]; 
	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),
		ITEM : [ '<div class="ms-group clearfix" data-id="{{ID}}">',
			'<div class="ms-col ms-col-f" style="width:100%;max-width: 100%;padding-right: 4vw">',
			'<div class="ms-limit" style="width:100%;max-width: 100%">',
			'<div class="ms-title">',
			'<span>{{EventName}}</span>',
			'<div class="femi-rt ms-field">{{EventTimeText}}</div>',
			'<div class="femi-rt ms-field">{{Operator}}</div>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-text">{{EventText}}</span>',
			'</span>',
			'</div>',
			'</div>',
			'</div>',
			'</div>' ].join("")
	};

	KEYWORD_LIST = [
		"Department|部门",
		"PositionName|岗位",
		"Name|姓名",
		"OrderNo|订单号", 
		"ZoneShifts|开工班次",
		"OnShifts|上班次数",
		"MaterialNo|物料编号",
		"APPHours|在线时长",
		"APPStartTimeText|上班打卡时刻", 
		"APPEndTimeText|下班打卡时刻",
		"OnShiftText|是否排岗",
		"APPReadyText|手机就绪",
		"ShiftID|班次",
		"TypeText|作业类型",
		"SFCText|作业名称",
		"SFCTotal|作业总数",
		"SFCDone|已执行作业",
		"SFCIdle|未执行作业",
		"SFCBFB|作业执行率" 
	];

	KEYWORD = {};
	$.each(KEYWORD_LIST, function(i, item) {
		var detail = item.split("|");
		KEYWORD[detail[0]] = {
			index : i,
			name : detail[1],
			type : detail.length > 2 ? detail[2] : undefined
		};
	});


	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
		 
		},

		run : function() {
			this.com.get({ 
				employee_id: model.query.id,
				position : model.query.position, 
				shift_id : model.query.shift_id
			}, function(data) {
				model.com.render(model.com.filter(data.info));
			});

			this.com.getItem({
				id : model.query.id
			}, function(data) {
				model.com.renderItem(model.com.filterItem(data.list));
			});
		},

		com : {
			getItem : function(data, fn, context) {
				var d = {
					$URI : "/RealWorker/EventAll",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			get : function(data, fn, context) {
				var d = {
				    $URI: "/KpiEmployee/Info",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},


			filter : function(data) {
				var _data = [],
					_status = "";
 
				_status = STATUS[data.status];
				data.APPStartTimeText = $com.util.format("yyyy-MM-dd hh:mm", data.APPStartTime);
				data.APPEndTimeText = $com.util.format("yyyy-MM-dd hh:mm", data.APPEndTime);
				
				data.APPReadyText=data.APPReady?"就绪":"未分配";
				data.OnShiftText = data.OnShift ? "已排岗" : "未排岗";
				for (var p in data) {
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : data[p] === "" ? "&nbsp;" : data[p]
						};
					}
				}


				return {
					data : _data,
					status : _status
				};
			},


			filterItem : function(data) {
			 

				$.each(data, function(i, item) {
					item.EventTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.EvenTime); 
				});

				return data;
			},

			render : function(data) {
				$(".m-detail-list").html($com.util.template(data.data, HTML.LIST));
				/*$(".tip-content").html(data.status);*/
			},
			renderItem : function(data) {
				$(".m-table").html($com.util.template(data, HTML.ITEM));
			}
		}
	});

	model.init();
});
//# sourceMappingURL=maps/list-565942f460.js.map