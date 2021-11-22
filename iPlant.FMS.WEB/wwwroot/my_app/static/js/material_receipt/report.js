require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


var model, HTML, config, current, STATUS,COLOUR, LETTER;

current = "Status_Sent";

STATUS = ["待收料","已收检","已检验","待收库","已收库","已收料","已驳回","待验收","验收中"];

COLOUR = ["text-yellow","text-blue","text-blue","text-grey","text-grey","text-grey","text-red","text-yellow","text-blue"];


HTML = {
	LIST : [ '<div class="ms-group clearfix" data-id="{{Id}}" data-state="{{State}}"  data-bg="{{Bg}}" >',
				'<div class="ms-col ms-col-f"><div class="ms-limit">',
				'<div class="ms-title"><span class="ms-field femi-rt">',
				'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
				'<span class="ms-text ms-margin">{{LineName}}</span>',
				'</span><span>{{Name}}</span></div>',
				'<div class="ms-sub-title">',
				'<span class="ms-field">',
				'<span class="ms-label">报工数量:</span><span class="ms-text">{{C1}}</span>',
				'</span>',
				'<span class="ms-field">',
				'<span class="ms-label">报工时间:</span><span class="ms-text">{{Time}}</span>',
				'</span>',
				'</div>',
				'<div class="ms-sub-title">',
				'<span class="ms-field">',
				'<span class="ms-label">产品规格:</span><span class="ms-text">{{C4}}</span>',
				'</span>',

				'</div>',
				'</div></div>',
				'<div class="ms-col ms-col-l">',
				'<span class="ms-status {{Color}}">{{Status}}</span>',
				'</div>',
				'</div>'].join("")
};

model = $com.Model.create({

	name : '汇报明细',

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
			_person_judge = window._person_judge;
 
		}
		this.com.get({
			position :8001,
			shift_id : _shift_id,
			person_judge : _person_judge,
			bg_mode:1
		}, function(data) {
			model.com.render(model.com.filter(data.list));
		});
	},

	com : {
		get : function(data, fn, context) {
			var d = {
				$URI : "/ReportTask/Items",
				$TYPE : "get"
			};

			function err() {
				$com.app.tip('提交失败，请检查网络');
			}
			
			$com.app.ajax($.extend(d, data), fn, err, context);
		},

		filter : function(data) {
			var _data = [];
			$(data).each(function() {
				
				if(this.BGMode!=1)
					return true;
				
				if(this.Status==0||this.Status==6)
					return true;
				
				_data.push({
					LineName : this.LineName,
					WorkShopName : this.WorkShopName,
					Name :this.PartPointName, 
					Bg : this.BGMode,
					C1 : this.FQTY,
					C2 : this.FQTYGood,
					C3 : this.FQTYBad+this.FQTYReturn+this.FQTYDownGrade+this.FQTYScrap,
					C4 : this.ProductNo,
					Id : this.ID,
					Time: $com.util.format("yyyy-MM-dd hh:mm:ss", this.BGTime), 
					State:this.Status,
					Status : STATUS[this.Status],
					Color : COLOUR[this.Status] 
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
//# sourceMappingURL=maps/report-f2cef79afc.js.map
