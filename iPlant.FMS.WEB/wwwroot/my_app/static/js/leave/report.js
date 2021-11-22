require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {



	var model,
		HTML,
		STATUS,
		COLOUR,
		LeaveModeI,
		LeaveModeN,
		PEROID_DAYS;

	STATUS = [ "待审批", "已批准", "已驳回", "已销假", "已撤销" ];

	COLOUR = [ "text-blue", "text-green", "text-red", "text-grey", "text-grey" ];


	LeaveModeI = {
		4001 : "year_leave",
		4002 : "business_leave",
		4003 : "sick_leave",
		4004 : "funeral_leave",
		4005 : "lactation_leave",
		4006 : "maternity_leave",
		4007 : "marriage_leave",
		4008 : "paternity_leave"
	};
	LeaveModeN = {
		year_leave : "年假",
		business_leave : "事假",
		sick_leave : "病假",
		funeral_leave : "丧假",
		lactation_leave : "哺乳假",
		maternity_leave : "产假",
		marriage_leave : "婚假",
		paternity_leave : "陪产假"
	};

	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{ID}}"  data-status="{{State}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title"><span class="ms-field femi-rt">',
			'<span class="ms-text">{{SubmitTimeText}}</span>',
			'</span><span>{{Name}}</span></div>',
	 
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">请假类型:</span><span class="ms-text">{{C1}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">天数:</span><span class="ms-text">{{C2}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">开始：</span><span class="ms-text">{{C3}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{Status}}</span>',
			'</div>',
			'</div>' ].join("")
	};

	model = $com.Model.create({
		name : '任务',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					ID = $this.attr("data-id");

				window.location = "info.html?id=" + ID;

			});

		},

		run : function() {
			this.com.get({peroid_days:30}, function(data) {
				model.com.render(model.com.filter(data.list));
			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/Leave/All",
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
						ID : this.ID,
						Name : this.Employee,
						SubmitTimeText:$com.util.format("yyyy-MM-dd hh:mm:ss", this.SubmitTime),
						C1 : LeaveModeN[LeaveModeI[this.ReasonMode]],
						C2 : this.LeaveDays, //
						C3 : $com.util.format("yyyy-MM-dd hh:mm", this.StartDate),
						Color : COLOUR[this.Status],
						State : this.Status,
						Status : STATUS[this.Status]
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
//# sourceMappingURL=maps/list-d3eb3dabef.js.map