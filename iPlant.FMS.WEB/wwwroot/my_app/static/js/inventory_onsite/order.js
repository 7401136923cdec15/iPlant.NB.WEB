require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD,
		KEYWORD_LIST,
		IsSubmit,
		WORKSHOP;

	WORKSHOP = {};
	IsSubmit = false;

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),
	};

	KEYWORD_LIST = [

		"WorkShopName|车间",
		"LineName|产线",
		"DeviceNo|设备号",
		"MaterialNo|物料号",
		"MaterialName|物料名",
		"FQTYInStock|入库数",
		"FQTYOnSite|在线数",
		"FQTYOutStock|配料数",
		"PDTimeText|盘点时刻",
		"UpdateTimeText|更新时刻"

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

			$("body").delegate("#confirm", "click", function() {
				model.com.addCheck();
			});
			//保存提交

		},

		run : function() {

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
					id : model.query.id
				}, function(data) {
					
					$("count").val(data.info.FQTYPD>0?data.info.FQTYPD:data.info.FQTYOnSite);
					model.com.render(model.com.filter(data.info));
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
					$URI : "/Inventory/Info",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
 
			add : function(data, fn, context) {
				var d = {
					$URI : "/Inventory/Submit",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},


			filter : function(item) {
				var _data = [],
					_list = [],
					_status = "";


				item.WorkShopName=WORKSHOP[item.WorkShopID].name;
				item.LineName=WORKSHOP[item.WorkShopID].line[item.LineID];
				item.PDTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.PDTime);
				item.UpdateTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.UpdateTime);


				model._data = item;
				for (var p in item) {
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : item[p] === "" ? "&nbsp;" : item[p]
						};
					}
				} 

				return  _data; 
			},
		

			render : function(data) {
				$(".m-detail-list").html($com.util.template(data, HTML.LIST));
			},




			addCheck : function(e, close) {

				if (IsSubmit)
					return;

				var $node,
					val;

				$node = $("#count");


				if (isNaN($node.val())) {
					alert("请保持输入类型为合法数字");
					$node.focus();
					return;
				}

				val = Number($node.val());

				if (val < 0) {
					val=0;
				}
  

				if (confirm("物料数：" +val)) {
					IsSubmit = true;
				 
					model.com.add({
						FQTYPD : val ,
						MaterialNo : model._data.MaterialNo,
						DeviceID: model._data.DeviceID
					}, [ function(res) {
						IsSubmit = false;
						if (res.info.ID > 0) {
							alert("操作成功");
							window.location = "detail.html?id=" + model.query.id;
						} else {
							alert("操作失败");
						}
					}, function() {
						IsSubmit = false;
					} ]);
				}

			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-07ea1bf6f7.js.map