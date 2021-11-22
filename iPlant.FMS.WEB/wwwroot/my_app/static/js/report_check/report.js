require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		LETTER;

	current = "Status_Sent";

	STATUS = [ "送检中", "已收检", "已检验", "待收库", "已收库", "已入库", "已驳回", "待验收", "验收中" ];

	COLOUR = [ "text-yellow", "text-blue", "text-blue", "text-yellow", "text-grey", "text-grey", "text-red", "text-yellow", "text-blue" ];


	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{id}}" data-check="{{check}}" data-box="{{boxID}}" data-status="{{state}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title"><span class="ms-field femi-rt">',
			'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text ms-margin">{{LineName}}</span>',
			'</span><span>{{name}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">送检数:</span><span class="ms-text">{{c1}}</span>',
			'</span>',
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
			'<span class="ms-text">{{time}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{color}}">{{status}}</span>',
			'</div>',
			'</div>' ].join("")
	};

	model = $com.Model.create({
		name : '检验明细',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id"),
					state = Number($this.attr("data-status"));
				switch (state) {
				case 0:
					window.location = "iDetail.html?id=" + id;
					break;
				case 1:
					window.location = "orderWrite.html?id=" + id;
					break;
				default:
					window.location = "orderWriteDetail.html?id=" + id;
					break;
				}

			});
			$("body").delegate(".m-right-area", "click", function() {
				window.QRTEST = function(id) {
					var TID = 0,
						state = 0;
					$.each(model._data, function() {
						if (GetQRList(this.boxID).indexOf(id) >= 0) {
							TID = this.id;
							state = this.state;
						}
					});
					if (TID == 0) {
						alert("此料盒没有任务");
					} else {
						
						switch (state) {
						case 0:
							window.location = "iDetail.html?id=" + TID;
							break;
						default:
							window.location = "orderWriteDetail.html?id=" + TID;
							break;
						}
					}
				};
				window.JSImpl.readQRCode('QRTEST');
			});

			function GetQRList(qrString) {
				var _list = qrString.split(';'),
					qrStringList = [];

				for (var i = 0; i < _list.length; i++) {
					var _temp = _list[i].split(':');
					if (_temp.length != 2)
						continue;

					qrStringList.push(_temp[0]);
				}
				return qrStringList;
			}
		},

		run : function() {
			var _shift_id = 0;
			var _person_judge = 0;
			if (window.JSImpl) {
				_shift_id = window._shift_id;
				_person_judge = window._person_judge;
	 
			}
			this.com.get({
				position :5002,
				shift_id : _shift_id,
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
			check : function(data, fn, context) {

				var d = {
					$URI : "/ShrisQuality/QualityDetailByBoxID",
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
					if(this.BGMode==1)
						return true;
					
					_data.push({
						LineName : this.LineName,
						WorkShopName : this.WorkShopName,
						name :this.PartPointName, 
						c1 : this.FQTY,
						c2 : this.FQTYGood,
						c3 : this.FQTYBad+this.FQTYReturn+this.FQTYDownGrade+this.FQTYScrap,
						c4 : this.ProductNo,
						id : this.ID,
						time:   $com.util.format("yyyy-MM-dd hh:mm:ss", this.BGTime), 
						state:this.status,
						status : STATUS[this.status],
						color : COLOUR[this.status],
						boxID : this.FeedBoxID,
						 
					});
				});
				model._data = _data;
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