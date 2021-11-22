require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		LETTER;

	current = "Status_Sent";

	STATUS = {
		"PointCheck_Unfinished" : "未完成",
		"PointCheck_Finished" : "已完成",
		"PointCheck_Unchecked" : "未检",
		"PointCheck_Checked" : "已检"
	};

	COLOUR = {
		"PointCheck_Unfinished" : "text-red",
		"PointCheck_Finished" : "",
		"PointCheck_Unchecked" : "text-red",
		"PointCheck_Checked" : ""
	};

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{Name}}</label>',
			'<div class="m-detail-content">{{Content}}</div>',
			'</li>' ].join(""),
		CAUSE : '<div class="m-detail-remark" style="margin-top:0;">{{Cause}}</div>',
		IMG : '<li class="upload-img"><img src="/upload/{{Url}}" alt="" data-id="{{Url}}"></li>'
	};

	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			$("#back").click(function() {
				window.location = "itemDetail.html?id=" + model.query.id;
			});

			$("#backR").click(function() {
				window.location = "item.html?id=" + model.query.id;
			});

			$("#Repair").click(function() {
				window.location = "check.html?id=" + model.query.id + "&sid=" + model.query.sid;
			});
		},

		run : function() {
			this.com.get({
			    ID: model.query.id,
			    ApplyID:model.query.applyID,
			}, function(data) {
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
					_img = [];
				$.each(data.itemList.dMSIPTItem, function(i, item) {
					if (item.ItemID != model.query.sid) {
						return true;
					}
					_data.push({
						name : item.ItemText,
						content : item.ItemResult == 1 ? "合格" : "不合格",
					});
					if (item.unreadyList.dMSItem && item.unreadyList.dMSItem.length) {
						var _reason = "";
						$.each(item.unreadyList.dMSItem, function(d_i, d_item) {
							if (d_item.result) {
								if (_reason.length)
									_reason += "<br/>" + d_item.name;
								else
									_reason += d_item.name;
							}
						});
						if (_reason.length) {
							_data.push({
								name : "不合格原因",
								content : $com.util.template({
									Cause : _reason
								}, HTML.CAUSE),
							});
						}
					}
					if (item.method) {
						_data.push({
							name : "检查方式",
							content : item.method,
						});
					}
					if (item.standard) {
						_data.push({
							name : "检查标准",
							content : item.standard,
						});
					}
					if (item.remark) {
						_data.push({
							name : "结果描述",
							content : $com.util.template({
								Cause : item.remark
							}, HTML.CAUSE),
						});
					}
					if (item.PictureList && item.PictureList.trim().length>3) {
						item.PictureListArray = item.PictureList.split("|");
						$.each(item.PictureListArray, function(p_i, p_item) {
							_img.push({
								url : p_item
							});
						});
					}
					return false;
				});

				return {
					data : _data,
					imgList : _img
				};
			},

			render : function(data) {
				$(".m-detail-list").html($com.util.template(data.data, HTML.LIST));
				$(".upload-list").html($com.util.template(data.imgList, HTML.IMG));
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/detail-13ca772d08.js.map