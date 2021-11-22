require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		ShiftName,
		STATUS,
		COLOUR;

	ShiftName = [ "上班次", "本班次", "下班次" ];
	STATUS = [ "未完成", "已完成" ];

	COLOUR = [ "text-yellow", "text-blue" ];



	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{Id}}" data-check="{{Check}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text ms-margin">{{LineName}}</span>',
			'</span><span>{{Name}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">计划数:</span><span class="ms-text">{{C1}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">配料数:</span><span class="ms-text">{{C2}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">剩余数:</span><span class="ms-text">{{C3}}</span>',
			'</span>',

			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">物料号:</span><span class="ms-text">{{C4}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">配料员:</span><span class="ms-text">{{User}}</span>',
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
					id = $this.attr("data-id"),
					check = $this.attr("data-check");
				if(check==1)
					window.location = "info.html?id=" + id;

			});


		},

		run : function() {
			var _shift_id = 0;
			var _person_judge = 0; 
			if (window.JSImpl&&window._shift_id) { 
				 
				 _shift_id = window._shift_id;
				 _person_judge =   window._person_judge;
				$("#ShiftName").html(ShiftName[_shift_id + 1]); 
			}
			this.com.get({
				shift_id : _shift_id,
				person_judge : _person_judge,
				position :7004
			}, function(data) {
				model.com.render(model.com.filter(data.list));
			});


		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/MaterialTask/All",
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
					if (this.MaterialMode == 1 && this.MaterialMode == "1")
						return true; //countiue;

					this.Status = this.FQTYMargin > 0 ? 0 : 1;
					_data.push({
						Name : this.PartName ? this.PartName : this.PartPointName,
						User : this.OperatorName,
						LineName : this.LineName,
						WorkShopName : this.WorkShopName,
						C1 : this.FQTYBase,
						C2 : this.FQTYPL,
						C3 : this.FQTYMargin,
						C4 : this.MaterialNo,
						Id : this.ID,
						Check:this.Active,
						Status :this.Active? STATUS[this.Status]:"未激活",
						Color : this.Active? COLOUR[this.Status] : "text-grey",
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