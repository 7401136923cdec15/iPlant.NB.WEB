require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {

	var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		KEYWORD,
		KEYWORD_LIST;

	current = "Status_Sent";


	STATUS = [ "待送料", "待领料", "已领料" ];

	COLOUR = {
		"PointCheck_Unfinished" : "text-red",
		"PointCheck_Finished" : "",
		"PointCheck_Unchecked" : "text-red",
		"PointCheck_Checked" : ""
	};

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join("")
	};

	KEYWORD_LIST = [
		"WorkShopName|车间",
		"LineName|产线",
		"PartName|工序段",
		"PartPointName|工序",
		"DeviceNo|设备",
		"MaterialNo|物料号",
		"MaterialName|物料名称",
//		"feedBoxID|料盒号",
		"FQTYPL|配料数",
		"FQTYLL|领料数",
		"PLOperatorName|配料员", 
		"PLTimeText|配料时间",
		"SLTimeText|送料时间", 
		"LLOperatorName|领料员",
		"LLTimeText|领料时间"
	];

	KEYWORD = {};

	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();

			KEYWORD_LIST.forEach(function(item, i) {
				var detail = item.split("|");
				KEYWORD[detail[0]] = {
					index : i,
					name : detail[1]
				};
			});
		},

		events : function() {
		 
		},

		run : function() {
			this.com.get({
			  id: model.query.id
			}, function(data) {
				model.com.render(model.com.filter(data.info));
			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/MaterialTask/ItemInfo",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},


			filter : function(data) {
				var _data = [],
					_status = "";
				data.PLTimeText= $com.util.format("yyyy-MM-dd hh:mm:ss", data.PLTime);
				data.SLTimeText= $com.util.format("yyyy-MM-dd hh:mm:ss", data.SLTime);
				data.LLTimeText= $com.util.format("yyyy-MM-dd hh:mm:ss", data.LLTime);
				for (var p in data) {
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : data[p] === "" ? "&nbsp;" : data[p]
						};
					}
				}
				_status = STATUS[data.status];

				return {
					data : _data,
					status : _status
				};
			},

			render : function(data) {
				$(".m-detail-list").html($com.util.template(data.data, HTML.LIST));
				$(".tip-content").html(data.status);
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/detail-3c540b6a9b.js.map