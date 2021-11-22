require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		WORKSHOP;
	
	WORKSHOP={};
	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{ID}}"  >',
			'<div class="ms-col ms-col-f" style="width:100%;max-width: 100%">',
			'<div class="ms-limit"  style="width:100%;max-width: 100%">',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt">',
			'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text">{{LineName}}</span></span>', 
			'<span>{{DeviceNo}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">物料号:</span><span class="ms-text">{{MaterialNo}}</span>',
			'</span>', 
			'<span class="ms-field">',
			'<span class="ms-label">盘点数:</span><span class="ms-text">{{FQTYPD}}</span>',
			'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">配料数:</span><span class="ms-text">{{FQTYOutStock}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">在线数:</span><span class="ms-text">{{FQTYOnSite}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">入库数:</span><span class="ms-text">{{FQTYInStock}}</span>',
			'</span>', 
			'</div>',
			'</div></div>',
			'</div>' ].join("")
	};

	model = $com.Model.create({
		name : '在线库存',

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
			
			$("body").delegate("#Filter", "click", function() {
				if (window.JSImpl) {
					window.QRTEST = function(val) {
						if (val && val.length > 5) {
							window.location = "list_2.html?id=" + id; 
						} else {
							alert("无此设备，请重新扫描！");
						}
					};

					window.JSImpl.readQRCode('QRTEST');
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
			
			model.com.getWorkShop({}, function(data) {
				$.each(data.list, function(i, item) {

					WORKSHOP[item.ID] = {
						'name' : item.WorkShopName,
						'line' : {}
					};
					$.each(item.lineList.aPSItem, function(l_i, l_item) {
						WORKSHOP[item.ID].line[l_item.ID] = l_item.ItemName;
					});

				});
				model.com.get({
					person_judge : _person_judge,
				}, function(data) {
					model.com.render(model.com.filter(data.list));
				});
			});
		
		},

		com : {
			getWorkShop : function(data, fn, context) {
				var d = {
					$URI : "/WorkShop/All",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			get : function(data, fn, context) {
				var d = {
					$URI : "/Inventory/All",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
				var _data = [];
				$(data).each(function(i, item) {

					if (item.materialMode == 1)
					{
						item.WorkShopName=WORKSHOP[item.WorkShopID].name;
						item.LineName=WORKSHOP[item.WorkShopID].line[item.LineID];
						_data.push(item);
					} 	
					
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
//# sourceMappingURL=maps/list-847d2ef23f.js.map