require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		LETTER,
		CHECKLIST,
		Shiftzz,
		STATUS_M,
		STATUS_P,
		COLOUR_P,
		MdouleName;
 
	STATUS = [ "未检", "合格", "不合格", "超时" ];

	COLOUR = [ "text-yellow", "text-blue", "text-red", "text-red" ];

	STATUS_M = [ "未完成", "已完成" ];

	STATUS_P = [ "未知", "待拆", "待还", "待领", "待装", "待调试", "就绪", "历史工装" ];

	COLOUR_P = [ "text-grey", "text-yellow", "text-yellow", "text-yellow", "text-yellow", "text-yellow", "text-blue", "text-grey" ];

	CHECKLIST = [ "0", "1", "2", "3", "4", "5", "6", "7" ];

	MdouleName=["未知消息","排班消息","生产计划消息","生产通知消息"];
	
	
	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{iD}}" data-mid="{{moduleID}}">',
			'<div class="ms-col ms-col-f" style="width:100%;max-width: 100%">',
			'<div class="ms-limit"  style="width:100%;max-width: 100%">',
			'<div class="ms-title">{{message}}</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-text"><span>{{submitTimeText}}</span></span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-text">发起：<span>{{sponsor}}</span></span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-text">接收：<span>{{operator}}</span></span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-text">{{moudle}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'</div>' ].join("")
	};

	
	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {

			$(".m-blue-menu .m-right-area").click(function() {
				model.com.get({
				}, function(data) {
					model.com.render(model.com.filter(data.list));
				});
			});

		},

		run : function() {
			this.com.get({
			}, function(data) {
				model.com.render(model.com.filter(data.list));
			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/aps_message/system",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
 
				$.each(data, function(i, item) { 
					item.submitTimeText = $com.util.format("yyyy-MM-dd hh:mm", this.submitTime);
					item.moudle = MdouleName[this.moduleID]; 
				});
				return data;
			},

			render : function(data) {
				$(".m-table").html($com.util.template(data.list, HTML.LIST));
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/list-e9563bc81f.js.map