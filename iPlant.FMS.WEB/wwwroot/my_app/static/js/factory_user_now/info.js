require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		STATUS,
		COLOUR,
		KEYWORD,
		KEYWORD_LIST;



	STATUS = [ "离线", "在线",  "离岗", "在岗"];

	COLOUR = [ "text-grey", "text-yellow", "text-green", "text-red", "text-blue", "text-grey", "text-grey" ];


	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),
		ITEM : [ '<div class="ms-group clearfix" data-id="{{iD}}">',
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
		"Name|姓名",
		"Department|部门",
		"Position|岗位",
		"PositionGrade|等级", 
		"StatusTimesText|状态持续时长",
		"ShiftLoginTimeText|上班时刻",
		"ShiftOnlineTimesText|在线时长",
		"ShiftWorkTimesText|工作时长", 
		"ShiftOfflineTimeText|最后离线时刻",
		"ShiftOfflineTimesText|离线时长" 
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
			/*$("#back").click(function() {
				history.back();
			});*/
		},

		run : function() {



			model.com.get({
				id : model.query.id
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
			get : function(data, fn, context) {
				var d = {
					$URI : "/RealWorker/Info",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

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

			filter : function(data) {
				var _data = [],
					_status = "";

				data.ShiftLoginTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.ShiftLoginTime); 
				data.ShiftOfflineTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.ShiftOfflineTime); 
				
				data.StatusTimesText=$com.util.ChangeSecondToString(data.StatusTimes);
				data.ShiftOnlineTimesText=$com.util.ChangeSecondToString(data.ShiftOnlineTimes);
				data.ShiftWorkTimesText=$com.util.ChangeSecondToString(data.ShiftWorkTimes);
				data.ShiftOfflineTimesText=$com.util.ChangeSecondToString(data.ShiftOfflineTimes );
				
				data.Status=  data.online+ data.onShift?2:0 ;
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
					Status : _status
				};
			},

			filterItem : function(data) {
				var _data = [];

				$.each(data, function(i, item) {
					item.EventTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.EventTime);

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