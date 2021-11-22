require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		KEYWORD,
		KEYWORD_LIST,
		DEVICETYPE;

	DEVICETYPE={};
	
	current = "Status_Sent";

	STATUS = [ "未知", "就绪", "保养", "故障", "报废" ];


	COLOUR = [ "text-yellow", "text-green", "text-blue", "text-red", "text-grey" ];


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
	    "WorkShopName|车间",            
		"LineName|产线",
		"PartName|工序段", 
		"DeviceNo|设备号",
		"DeviceName|设备名",
		"TypeText|设备类型", 
		"StatusTimes|状态持续时长",
		"ShiftStartTimeText|开机时刻",
		"ShiftRunTimes|开机时长",
		"ShiftWorkTimes|工作时长",
		"ShiftAlarms|报警次数",
		"ShiftAlarmTimes|报警时长",
		"ShiftIdleTimes|闲置时长",
		"StartTimeText|设备上线时刻",
		"RunTimes|累计开机时长",
		"WorkTimes|累计工作时长",
		"Alarms|累计报警次数",
		"AlarmTimes|累计报警时长",
		"IdleTimes|累计闲置时长"
	];

	KEYWORD = {};
	
	$.each(KEYWORD_LIST,function(i, item) {
		var detail = item.split("|");
		KEYWORD[detail[0]] = {
			index : i,
			name : detail[1]
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
			
			model.com.getDeviceProperty({type:5}, function(data) {

				DEVICETYPE = model.com.filterType(data.list);

				model.com.get({
					id : model.query.Id
				}, function(data) {
					model.com.render(model.com.filter(data.info));
				});
			});
 
			this.com.getItem({
				 
				id : model.query.id
			}, function(data) {
				model.com.renderItem(model.com.filterItem(data.list));
			});
		},

		com : {
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
				$.each(data, function(i, item) { 
					_data[item.ID] = item.Name;
				});
				return _data;
			},

			get : function(data, fn, context) {
				var d = {
					$URI : "/RealDevice/Info",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			getItem : function(data, fn, context) {
				var d = {
					$URI : "/RealDevice/EventAll",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
				var _data = [],
					_status = ""; 
				
				data.TypeText==DEVICETYPE[data.Type];
				data.ShiftStartTimeText= $com.util.format("yyyy-MM-dd hh:mm:ss",data.ShiftStartTime);
				data.StartTimeText=$com.util.format("yyyy-MM-dd hh:mm:ss",data.StartTime);
				_status = STATUS[data.Status];
				
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
				var _data = [] ; 
 
				 $.each(data,function(i,item){
					 item.EventTimeText=$com.util.format("yyyy-MM-dd hh:mm:ss",item.EventTime);
					 
				 }); 

				return _data;
			},
			render : function(data) {
				$(".m-detail-list").html($com.util.template(data.data, HTML.LIST)); 
				$(".tip-content").html(data.Status);
			},
			renderItem : function(data) { 
				$(".m-table").html($com.util.template(data, HTML.ITEM)); 
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/info-23f05f92e1.js.map