require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD,
		KEYWORD_LIST,
		IsSubmit,STATUS;
	IsSubmit = false;
	//STATUS = [ "送检中", "已收检", "已检验", "待收库", "已收库", "已入库", "已驳回", "待验收", "验收中" ];
	STATUS = ["创建", "已提交", "待入库", "待收库", "已收库", "已入库", "已驳回", "待验收", "验收中"];
	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),

		SUB_LIST : [ '<li class="list-li"  data-id="{{ppid}}">',
			'<div class="list-group-item">',
			'<div class="list-group-item-cell item-static item-title" style="width:90%">',
			'<span>{{ppName}}</span>',
			'</div>',
			'<div class="list-group-item-cell item-icon" style="width:10%">',
			'<i class="icon icon-arrow-right icon-arrow-expand"></i>',
			'</div>',
			'</div>',
			'<div class="list-group">',
			'<div class="multil-btn">',
			'<div class="multi-flex" >',
			'<div class="multi-flex m-detail-titlel"  style="width: 40%" >',
			'<label >合格数:</label>',
			'</div>',
			'<div class="multi-flex m-detail-titler"  style="width: 60%" >',
			'<input type="number" min=0  class="goodFQTY" readonly="readonly" value="{{c1}}" />',
			'</div>',
			'</div>',
			'<div class="multi-flex " >',
			'<div class="multi-flex m-detail-titlel" style="width: 40%"  >',
			'<label >本道报废:</label>',
			'</div>',
			'<div class="multi-flex m-detail-titler"  style="width: 60%" >',
			'<input type="number" min=0  class="badFQTY FQTYInput" value="{{c2}}" />',
			'</div>',
			'</div>',
			'</div>',
			'<div class="multil-btn">',
			'<div class="multi-flex" >',
			'<div class="multi-flex  m-detail-titlel"  style="width: 40%" >',
			'<label>上道报废:</label>',
			'</div>',
			'<div class="multi-flex m-detail-titler"  style="width: 60%" >',
			'<input type="number" min=0  class="returnFQTY FQTYInput" value="{{c3}}" />',
			'</div>',
			'</div>',
			'<div class="multi-flex" >',
			/*'<div class="multi-flex  m-detail-titlel" style="width: 40%"  >',                                         
				'<label >报废数:</label>',                                                
							                '</div>',                                                             
							                '<div class="multi-flex m-detail-titler"  style="width: 60%" >',                                          
							                    '<input type="number" min=0  class="scrapFQTY" value="{{c4}}" />',               
							                '</div>',     */
			'</div>',
			'</div>',
			'{{lastCount}}<div class="multil-btn">',
			'<div class="multi-flex m-detail-titlel" style="width: 18%">',
			'<label class="m-detail-titlel">备注:</label>',
			'</div>',
			'<div class="multi-flex m-detail-titler" style="width: 82%"  >',
			'<input type="text"  class="m-detail-titles remarkFQTY" style="margin: 0" value="{{c5}}" />',
			'</div>',
			'</div>',
			'</div>',
			'</li>' ].join(""),


		Count_List : [ '<div class="m-card">',
			'<div class="multil-btn">',
			'<div class="multi-flex ">',
			'<div class="multi-flex m-detail-titlel" style="width: 40%">',
			'<label>回用数:</label>',
			'</div>',
			'<div class="multi-flex  m-detail-titler" style="width: 60%">',
			'<input type="number" min="0" id="countR" class="FQTYInput" value="{{countr}}" />',
			'</div>',
			'</div>',
			'<div class="multi-flex ">',
			'<div class="multi-flex m-detail-titlel" style="width: 40%">',
			'<label>降级数:</label>',
			'</div>',
			'<div class="multi-flex  m-detail-titler" style="width: 60%">',
			'<input type="number" min="0" id="countD"  class="FQTYInput" value="{{countd}}" />',
			'</div>',
			'</div>',
			'</div>',
			'<div class="multil-btn">',
			'<div class="multi-flex ">',
			'<div class="multi-flex m-detail-titlel" style="width: 40%">',
			'<label>工序废数:</label>',
			'</div>',
			'<div class="multi-flex  m-detail-titler" style="width: 60%">',
			'<input type="number" min="0" id="countG"  class="FQTYInput" value="{{countg}}" />',
			'</div>',
			'</div>',
			'<div class="multi-flex "></div>',
			'</div>',

			'</div>', ].join("")
	};

	KEYWORD_LIST = [

		"WorkShopName|车间",
		"LineName|产线",
		"OrderNo|订单号",
		"PartName|工序段",
		"PartPointName|工序",
		"MaterialNo|物料号",
		"MaterialName|物料名",
		"ProductNo|产品规格",
		"FeedBoxID|料盒号", 
		"FQTY|报工数", 
		"OperatorName|操作员",
		"InspectorName|收料员",
		/*"receivingClerkName|入库员",*/
		"BGTimeText|报工时间", 
		"InspectTimeText|收料时间"

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
 
			 
			$("body").delegate("#repair", "click", function() {
				window.location="order.html?id="+model.query.id;
			});
			//保存提交

		},

		run : function() {

		 
		    this.com.getInfo({
					ID : model.query.id
				}, function(data) {
					model.com.render(model.com.filter(data.info));
					$(".tip-content").html(STATUS[data.info.detail.Status]);
				});
			

		},
		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/ReportTask/ItemInfoDetail",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			getInfo: function (data, fn, context) {
			    var d = {
			        $URI: "/ReportTask/ItemInfo",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},

			 

			filter : function(data) {
				var _data = [],
					_list = [];

				model._data = data;
				data.detail.BGTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.detail.BGTime);
				if (data.detail.InspectTime)
					data.detail.InspectTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.detail.InspectTime);

				if (data.detail.InStockTime)
					data.detail.InStockTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.detail.InStockTime);

				for (var p in data.detail) {
					var o = KEYWORD[p];
					if (o) {

						_data[Number(o.index)] = {
							name : o.name,
							value : data.detail[p] === "" ? "&nbsp;" : data.detail[p]
						};
					}
				}
				 
				return {
					data : _data,
					list : _list
				};
			},

			render : function(data) {
				$(".m-c-body .m-detail-list").html($com.util.template(data.data, HTML.LIST)); 
				 
			},



 
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-07ea1bf6f7.js.map