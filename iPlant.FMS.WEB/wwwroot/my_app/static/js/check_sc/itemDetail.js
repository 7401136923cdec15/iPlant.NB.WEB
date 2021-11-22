require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		STATUS,
		COLOUR;

	//STATUS = [ "未检", "合格", "不合格"]
	STATUS = ["无","待开始", "执行中", "待确认", "已驳回","已确认"];
	COLOUR = [ "text-yellow", "text-blue", "text-red" ];

	HTML = {
		LIST : [ '<tr data-id="{{ItemID}}" data-status="{{ItemResult}}">',
			'<td>{{ItemText}}</td>',
			'<td>{{Standard}}</td>',
			'<td class="{{Color}}">{{ItemResultText}}</td>',
			'<td>',
			'<svg width="11px" height="17px" viewBox="0 0 11 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
			'<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">',
			'<g transform="translate(-1675.000000, -680.000000)" fill="#C8C8C8">',
			'<g transform="translate(1668.000000, 680.000000)">',
			'<path d="M12.3333333,5.66666667 L3,5.66666667 L3,3 L13.6666667,3 L15,3 L15,15 L12.3333333,15 L12.3333333,5.66666667 Z" transform="translate(9.000000, 9.000000) scale(-1, 1) rotate(-135.000000) translate(-9.000000, -9.000000) "></path>',
			'</g></g></g></svg>',
			'</td>',
			'</tr>' ].join("")
	};

	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			$("body").delegate("table tr", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id"),
					status = $this.attr("data-status");

				if (status === "0") {

				} else if (status === "-1") {

				} else if (status === "-2") {

				} else {
				    window.location = "detail.html?id=" + model.query.id + "&ApplyID=" + model.query.applyID;
				}
			});

			$("#Repair").click(function() {
				window.QRTEST = function(val) {
					if (val == model.DeviceNo) {
						window.location = "item.html?id=" + model.query.id;
					} else {
						alert("任务与设备不符请核对设备");
					}
				};

				window.JSImpl.readQRCode('QRTEST');

			});
		},

		run: function () {		  
			this.com.get({
			    ID:model.query.id,
			    ApplyID:model.query.applyID,

			}, function(data) {
				model._data = data.info;
				model.com.render(model.com.filter(data.info));
			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
				    $URI: "/DevicePointCheckTask/Info",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			}, 
			filter : function(data) {
				var _data = [],
					status;
			 
				model.DeviceNo = data.ApplyNo;
				
				status = STATUS[data.Status];
				data.ItemID = data.ID;
				data.ItemText = "弹头";
				data.Standard = "wewe";
				data.ItemResult = 2;
				data.ItemResultText = "合格";
				data.Color = COLOUR[1];
				//$.each(data.itemList.dMSIPTItem,function(i,item) {
				//	var _status = model.com.getStatus(item.ID, item.ItemResult);
				//	item.ItemResultText=_status.tip;
				//	item.Color=_status.color;
				//});
				_data=data;
				return {
					data : _data,
					status : status
				};
			},

			render : function(data) {
				$(".m-table tbody").html($com.util.template(data.data, HTML.LIST));
				$(".tip-content").html(data.status);
			},

			getStatus : function(id, result) {
				var text,
					color,
					num;
				if (id < 0) {
					text = "存储错误";
					color = "text-red";
					num = -2;
				} else if (id > 0) {
					if (result == 1) {
						text = "合格";
						color = "text-blue";
						num = id; //合格不能看详情      num = id;
					} else {
						text = "不合格";
						color = "text-red";
						num = id;
					}
				} else {
					text = "合格";
					color = "text-yellow";
					num = 0;
				}
				return {
					tip : text,
					color : color,
					status : num
				};
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/item-d31ded63c7.js.map