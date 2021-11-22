require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


var model, HTML, config, current, STATUS,COLOUR, LETTER,STATUS_O;

current = "Status_Sent";

//STATUS = ["送检中","已收检","已检验","待收库","已收库","已入库","已驳回","待验收","验收中"];
STATUS = ["创建", "已提交", "待入库", "待收库", "已收库", "已入库", "已驳回", "待验收", "验收中"];
STATUS_O = ["待收料","已收检","已检验","待收库","已收库","已收料","已驳回","待验收","验收中"];

COLOUR = ["text-yellow","text-blue","text-blue","text-grey","text-grey","text-grey","text-red","text-yellow","text-blue"];


HTML = {
	LIST : ['<div class="ms-group clearfix" data-id="{{Id}}" data-state="{{State}}"  data-bg="{{bg}}" >',
				'<div class="ms-col ms-col-f"><div class="ms-limit">',
					'<div class="ms-title"><span class="ms-field femi-rt">', 
					//'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
					'<span class="ms-text ms-margin">{{LineName}}</span>',
					'</span><span>{{Name}}</span></div>',
					'<div class="ms-sub-title">', 
						//'<span class="ms-field">',
						//	'<span class="ms-label">送检数:</span><span class="ms-text">{{c1}}</span>',
						//'</span>',
						'<span class="ms-field">',
							'<span class="ms-label">合格数:</span><span class="ms-text">{{c2}}</span>',
						'</span>',
						'<span class="ms-field">',
							'<span class="ms-label">不合格数:</span><span class="ms-text">{{c3}}</span>',
						'</span>',
					'</div>',
					'<div class="ms-sub-title">', 
						'<span class="ms-field">',
							'<span class="ms-label">规格:</span><span class="ms-text">{{c4}}</span>',
						'</span>', 
						'<span class="ms-field">',
							'<span class="ms-text">{{Time}}</span>',
						'</span>', 
					'</div>',
				'</div></div>',
				'<div class="ms-col ms-col-l">',
					'<span class="ms-status {{color}}">{{Status}}</span>',
				'</div>',
			'</div>'].join("")
};

model = $com.Model.create({

	name : '报告明细Li',

	type : $com.Model.MAIN,

	configure : function() {
		this.run();
	},

	events: function () {
	    $("body").delegate(".zace-line", "click", function () {
	        window.location = "listLine.html"
	    });
	    $("body").delegate(".zace-part", "click", function () {
	        window.location = "listPart.html"
	    });
	    $("body").delegate(".zace-partPoint", "click", function () {
	        window.location = "listPoint.html"
	    });

		$("body").delegate(".ms-group", "click", function() {
			var $this = $(this),
				id = Number($this.attr("data-id")),
                sta = Number($this.attr("data-state")),
				bg = Number($this.attr("data-bg")); 

			
			 if( sta == 6)
			     window.location = "reportLiDetailSS.html?id=" + id;
			else if (sta == 0)
			    window.location = "reportLiDetailSS.html?id=" + id;
			else 
			    window.location = "reportLiDetail.html?id=" + id;
		});
		$("body").delegate(".femi-search-fuzzy .femi-search-border input.femi-search-content", "input", function () {
		    //模糊查询
		    var $this = $(this),
                value = $this.val();
		    if (!value || value.length < 1) {
		        $(".ms-group").show();
		    } else {
		        $(".ms-group").each(function (i, item) {
		            if ($(item).text().indexOf(value) > 0)
		                $(item).show();
		            else
		                $(item).hide();
		        });
		    }
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
            EventID:1007,
		    Level:1,
			person_judge : _person_judge
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
				//var _Status=this.BGMode==1? STATUS_O:STATUS;
				_data.push({
					LineName : this.LineName,
					//WorkShopName : this.WorkShopName,
					Name: this.MaterialNo,
					bg : this.BGMode,
					c1 : this.FQTY,
					c2 : this.FQTYGood,
					c3 : this.FQTYBad,
					c4 : this.ProductNo,
					Id : this.ID,
					Time: $com.util.format("yyyy-MM-dd hh:mm:ss", this.SubmitTime), 
					State: this.Status,
					Status: STATUS[this.Status],
					color: COLOUR[this.Status]
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
