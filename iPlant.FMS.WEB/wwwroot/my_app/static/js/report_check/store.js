require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		LETTER;

	current = "Status_Sent";


	STATUS = [ "未完成", "待收库", "收库中", "已收库", "入库中", "已入库", "已驳回", "待验收", "验收中" ];

	COLOUR = [ "text-red", "text-yellow", "text-yellow", "text-blue", "text-blue", "text-grey" , "text-red"  , "text-yellow" , "text-yellow"];

	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{id}}" data-status="{{state}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title">{{name}}</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">总数:</span><span class="ms-text">{{c1}}</span>',
			'</span>',

			'<span class="ms-field">',
			'<span class="ms-label"></span><span class="ms-text">{{c3}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{color}}">{{status}}</span>',
			'</div>',
			'</div>' ].join("")
	};

	model = $com.Model.create({
		name : '入库列表',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			$("body").delegate(".ms-group", "click", function(e) {
				var $this = $(this),
					id = $this.attr("data-id");
 
				window.location = "applyDetail.html?id_I=" + id; 
			});
 
		},

		run : function() {
			var _shift_id = 0;
			var _person_judge = 0;
			if (window.JSImpl) {
				_shift_id = window._shift_id;
				_person_judge = window._person_judge;
			}
			this.com.get({
				position : 5002,
				shift_id : _shift_id,
				person_judge : _person_judge,
			}, function(data) {
				model.com.render(model.com.filter(data.list));
			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/ReportStore/All",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
				var _data = [];
				$(data).each(function() {

					_data.push({
						name : this.PartName + " " + this.MaterialNo,
						c1 : this.FQTYTotal,
						c3 : $com.util.format("yyyy-MM-dd hh:mm:ss", this.SubmitTime),
						id : this.ID,
						state : this.status,
						status : STATUS[this.status],
						color : COLOUR[this.status]
					});


				});


				return _data;
			},

			render : function(data) {
				$(".m-table").html($com.util.template(data, HTML.LIST));
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/report-139bd9cd7f.js.map