require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML, 
		STATUS,
		COLOUR, 
		KEYWORD,
		KEYWORD_LIST,
		KEYWORD_LIST2,
		KEYWORD2,
		IsSubmit;
 

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
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),
		LIST2 : [ '<tr data-id="{{Id}}">',
			'<td>{{D1}}</td>',
			'<td>{{D2}}</td>',
			'<td>{{D3}}</td>',
			'<td><input type="number" data-max="{{D3}}" value="0"/></td>',
			'</tr>' ].join("")
	};

	KEYWORD_LIST = [
		"WorkShopName|车间",
		"LineName|产线",
		"PartName|工序段",
		"PartPointName|工序",
		"DeviceNo|设备",
		"MaterialNo|物料号",
		"MaterialName|物料名称",
		//"feedBoxID|料盒号",
		"FQTYPL|配料数",
		/*"fQTYLL|领料数",*/
		"PLOperatorName|配料员",
		"PLTimeText|配料时间",
		"LLOperatorName|领料员", 
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
			$("#back").click(function() {
				window.history.back();
			});

			$("body").delegate("#confirm","click",function(){
				if (IsSubmit)
					return;
				var data = model._data;
				if (!confirm("领料数：" + data.FQTYPL + "，是否领料？\n提示：当面点清，确定后不可回退！"))
					return;
				IsSubmit = true;
				data.status = 2;
				 
				data.FQTYLL = data.FQTYPL; 
				model.com.add({
					status : 2,
					data:data
				}, function(res) { 
					window.location = "detail.html?id=" + model.query.id; 
				});
			});
			//保存提交
		 
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
				var _data = [],
					_status = "";
				data.PLTimeText= $com.util.format("yyyy-MM-dd hh:mm:ss", data.PLTime);
				data.LLTimeText= $com.util.format("yyyy-MM-dd hh:mm:ss", data.LLTime);
				$("#count").val(data.FQTYPL);
				
				model._data=data;
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
				$(".view-order .m-detail-list").html($com.util.template(data.data, HTML.LIST));
			//$(".m-table table tbody").html($com.util.template(data.list, HTML.LIST2));
			//$(".tip-content").html(data.status);
			},
 

			addCheck : function(e, close) {
				
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-193c524c88.js.map