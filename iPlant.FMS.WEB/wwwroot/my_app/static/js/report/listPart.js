require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		BGModeText,
		ShiftText,
		ShiftCOLOUR;

	ShiftText = [ "上上班次", "上班次", "本班次", "下班次", "下下班次" ];

	STATUS = ["创建", "创建", "下达"];
	ShiftCOLOUR = ["text-grey", "text-blue", "text-green", "text-yellow", "text-blue", "text-green", "text-red"];

	BGModeText = ["未知", "流转报工", "自动流转", "入库报工", "流转检验", "中转报工"];
	HTML = {
	    LIST: ['<div class="ms-group clearfix" data-id="{{ID}}"  data-mode="{{BGMode}}"  data-shift="{{FQTYShift}}">',
			'<div class="ms-col ms-col-f" >',
			'<div class="ms-limit"  style="width:100%;max-width: 100%">',
			'<div class="ms-title"><span class="ms-field femi-rt">',
			//'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text ms-margin">{{LineName}}</span>',
			'</span><span>{{PartName}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">计划数:</span><span class="ms-text">{{FQTYShift}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">完成数:</span><span class="ms-text">{{FQTYDone}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">采集数:</span><span class="ms-text">{{FQTYParts}}</span>',
			'</span>',
			//'<span class="ms-field">',
			//'<span class="ms-text ms-margin">{{OperatorName}}</span>',
			//'<span class="ms-text {{Shiftcolor}}">{{ShiftText}}</span>',
			//'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">模式:</span><span class="ms-text">{{BGModeText}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">产品规格:</span><span class="ms-text">{{ProductNo}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
             '<div class="ms-col ms-col-l zace-ll">',
			'<span class="ms-status {{ColorText}}">{{StatusText}}</span>',
			'</div>',
			'</div>' ].join("")
	};

	model = $com.Model.create({
		name : '工段任务',

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
					id = $this.attr("data-id"),
					mode = $this.attr("data-mode"),
					mFQTYShift = Number($this.attr("data-shift"));

				
				
				window.location = "orderPart.html?id=" + id + "&mFQTY=" + mFQTYShift;
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
		    var _person_judge = 0;
		    if (window.JSImpl) {
		        //_shift_id = window._shift_id;
		        _person_judge = window._person_judge;

		    }
			this.com.get({
				EventID:1007,
				person_judge: _person_judge,
			}, function(data) {
				model.com.render(model.com.filter(data.list));
			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
				    $URI: "/TaskHandle/PartAll",
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
					this.BGModeText = BGModeText[3];
					//var _cur = new Date();

					//var _shiftID = Number($com.util.format("yyyyMMdd01", _cur))
					//this.ShiftStatus = 0;
					//while (this.ShiftID > _shiftID) {
					//	_shiftID = Number($com.util.format("yyyyMMdd01", new Date(_cur.getTime() + 86400000)));
					//	this.ShiftStatus++;
					//}
					//while (this.ShiftID < _shiftID) {
					//	_shiftID = Number($com.util.format("yyyyMMdd01", new Date(_cur.getTime() - 86400000)));
					//	this.ShiftStatus--;
					//}

					this.ColorText = ShiftCOLOUR[this.Status];
					this.StatusText = STATUS[this.Status];
					this.Shiftcolor = ShiftCOLOUR[this.Status];
				});
				_data = data;
				return _data;
			},

			render : function(data) {
				$(".m-table").html($com.util.template(data, HTML.LIST));
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/list-847d2ef23f.js.map