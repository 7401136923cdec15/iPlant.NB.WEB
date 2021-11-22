require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		KEYWORD,
		KEYWORD_LIST,
		STATUS_Item,
		COLOUR_Item;

	current = "Status_Sent";

	STATUS = [ "未完成", "已完成" ];
	STATUS_Item = ["待配料", "已配料", "已收料", "已领料", "驳回"];
	COLOUR_Item = ["text-yellow", "text-blue", "text-green", "text-yellow", "text-red"];

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),
		LIST2 : [ '<div class="ms-group clearfix" data-id="{{Id}}" data-check="{{Check}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text ms-margin">{{Time}}</span>',
			'</span> <span>{{Name}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"> <span class="ms-label"></span>',
			'<span class="ms-text">{{UserZ}}</span>',
			'</span> <span class="ms-field"> <span class="ms-label">配料数:</span>',
			'<span class="ms-text">{{FQTYPLZ}}</span>',
			'</span> <span class="ms-field"> <span class="ms-label">物料号:</span>',
			'<span class="ms-text">{{MaterialNoZ}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{ColorZ}}">{{StatusZ}}</span>',
			'</div>',
			'</div>' ].join("")
	};

	KEYWORD_LIST = [
		"OrderID|订单编号",
		//"WorkShopName|车间",
		"LineName|产线",
		"PartName|工序段",
		"PartPointName|工序",
		//"DeviceNo|设备",
		"MaterialNo|物料号",
		"MaterialName|物料名称",
		//"TaskName|圈别",
		"ProductNo|产品规格",
		"FQTYPlan|计划数",
		//"FQTYPlan|仓位计划数",
		"FQTYPL|已配料数",
		"FQTYMargin|剩余数",
		"FQTYOnsite|在线库存",
		//"PLOperatorName|配料员",
		//"LLOperatorName|领料员",
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

			$("#confirm").click(function() {
				if (model._data.FQTYMargin > 0)
					window.location = "order.html?id=" + model.query.id;
				else
					alert("配料任务已完成，无须再配料！");
			});

			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id");

				window.location = "detail.html?id=" + id;
			});
		},

		run : function() {
			this.com.get({
			    ID: model.query.id
			}, function (data) {
			   // data.info.FQTYMargin = 99;
				model.com.render(model.com.filter(data.info));

			});
			this.com.getItems({
				TaskID : model.query.id
			}, function (data) {
			    //dataZZ = [{

			    //    MaterialName: "虚拟",
			    //    MaterialNo: "qwe",
			    //    ID: 1,
			    //    PLOperatorName: "adzzz",
			    //    FQTYPL: 100,
			    //    PLTime: "2019 06-06",
			    //    Status: 1,
			    //}, {

			    //    MaterialName: "虚拟2",
			    //    MaterialNo: "qwes",
			    //    ID: 1,
			    //    PLOperatorName: "adzzz",
			    //    FQTYPL: 19,
			    //    PLTime: "2019 06-07",
			    //    Status: 1,
			    //}
                //    ]
			    //,
                
				model.com.renderItems(model.com.filterItems(data.list));

			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/MaterialTask/Info",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			getItems : function(data, fn, context) {
				var d = {
					$URI : "/MaterialTask/InfoItems",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
				model._data = data;
				var _data = [],
					_status = "";
				if (data.MaterialMode == 1 || data.MaterialMode == "1") {
					model._Type = 1;
				} else {
					model._Type = 0;
				}

				for (var p in data) {
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : data[p] === "" ? "&nbsp;" : data[p]
						};
					}
				}
				data.status = data.FQTYMargin > 0 ? 0 : 1;
				_status = STATUS[data.status];


				//if (data.status)
				//	$("#confirm").hide();

				return {
					data : _data,
					status : _status
				};
			},
			
			filterItems : function(data) {
				var _list = [];
				$.each(data, function() {
					_list.push({
					    Name: this.MaterialName,
						MaterialNoZ : this.MaterialNo,
						UserZ: this.PLOperatorName ? this.PLOperatorName : this.PLOperatorID,
						FQTYPLZ: this.FQTYPL,
						Time : $com.util.format("yyyy-MM-dd hh:mm:ss", this.PLTime),
						Id: this.ID,
						StatusZ: STATUS_Item[this.Status],
						ColorZ: COLOUR_Item[this.Status]
					});
				});


				return _list;
			},

			render : function(data) {
				$(".m-detail-list").html($com.util.template(data.data, HTML.LIST));
				$(".tip-content").html(data.status);
			},
			renderItems : function(data) {

				$(".m-table").html($com.util.template(data, HTML.LIST2));

			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/info-23f05f92e1.js.map