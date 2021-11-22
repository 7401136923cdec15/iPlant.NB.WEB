require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		config,
		STATUS,
		COLOUR,
		LETTER,
		SHOWTEXTS,
		SHOWTYPES,
		DATALENGTH,
		ShiftName;

	DATALENGTH = {};
	SHOWTEXTS = [ "下班次", "本班次" ];
	SHOWTYPES = [ 2, 1 ];

	ShiftName = [ "上班次", "本班次", "下班次" ];

	STATUS = [ "待送料", "待领料", "已领料" ];

	COLOUR = [ "text-grey", "text-yellow", "text-blue" ];



	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{Id}}"  data-no="{{C3}}" data-check="{{Check}}" >',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title"><span class="ms-field femi-rt">',
			'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text ms-margin">{{LineName}}</span>',
			'</span> <span>{{Name}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">{{C1}}</span>',
			'<span class="ms-field">',
			'<span class="ms-label">领料数:</span><span class="ms-text">{{C2}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">设备:</span><span class="ms-text">{{C3}}</span>',
			'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"> ',
			'<span class="ms-label"></span><span class="ms-text">{{C4}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">时间:</span><span class="ms-text">{{Time}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{Status}}</span>',
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


			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id");
				 
					window.location = "detail.html?id=" + id; 
			});

			 
		},

		run : function() {

			var _shift_id = 0;
			var _person_judge = 0;
			if (window.JSImpl) { 
				 _shift_id = window._shift_id;
				 _person_judge =   window._person_judge; 
			 
				$("#ShiftName").html(ShiftName[_shift_id + 1]);
			}

			this.com.get({
				shift_id : _shift_id,
				person_judge : _person_judge,
				position:8001
			}, function(data) {
				model.com.render(model.com.filter(data.list));
			});

		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/MaterialTask/Items",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			add : function(data, fn, context) {
				var d = {
					$URI : "/MaterialTask/Submit",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
				model._data = data;
				var _data = [];
				$(data).each(function() {
					
					if(this.Status<=1)
						return true;
					_data.push({
						Name : this.PartName,
						LineName : this.LineName,
						WorkShopName : this.WorkShopName,
						C1 : this.MaterialName,
						C2 : this.FQTYPL,
						C3 : this.DeviceNo,
						C4 : this.MaterialNo,
						Id : this.ID,
						Pno : this.MaterialNo,
						Time : $com.util.format("yyyy-MM-dd hh:mm:ss", this.LLTime),
						Status : STATUS[this.Status],
						Color : COLOUR[this.Status],
						Check : this.Status
					});
				});

				return _data;
			},

			render : function(data) {
				$(".m-table").html($com.util.template(data, HTML.LIST));
			},
		

		}
	});

	model.init();

});