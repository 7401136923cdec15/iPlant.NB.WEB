require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {

	var model,
		HTML,
		KEYWORD,

		KEYWORD_LIST,
		IsSubmit,
		STATUS,
		STATUS_O;
	IsSubmit = false;

	STATUS = [ "送检中", "已收检", "已检验", "待收库", "已收库", "已入库", "已驳回", "待验收", "验收中" ];

	STATUS_O = [ "待收料", "已收检", "已检验", "待收库", "已收库", "已收料", "已驳回", "待验收", "验收中" ];
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
			'<input type="number" min=0  class="badFQTY" readonly="readonly" value="{{c2}}" />',
			'</div>',
			'</div>',
			'</div>',
			'<div class="multil-btn">',
			'<div class="multi-flex" >',
			'<div class="multi-flex  m-detail-titlel"  style="width: 40%" >',
			'<label>上道报废:</label>',
			'</div>',
			'<div class="multi-flex m-detail-titler"  style="width: 60%" >',
			'<input type="number" min=0  class="returnFQTY" readonly="readonly" value="{{c3}}" />',
			'</div>',
			'</div>',
			'<div class="multi-flex" >',
			/*      '<div class="multi-flex  m-detail-titlel" style="width: 40%"  >',                                         
			      	'<label >报废数:</label>',                                                
							                '</div>',                                                             
							                '<div class="multi-flex m-detail-titler"  style="width: 60%" >',                                          
							                    '<input type="number" min=0  class="scrapFQTY" readonly="readonly" value="{{c4}}" />',               
							                '</div>',     */
			'</div>',
			'</div>',
			'{{lastCount}}<div class="multil-btn">',
			'<div class="multi-flex m-detail-titlel" style="width: 18%">',
			'<label class="m-detail-titlel">备注:</label>',
			'</div>',
			'<div class="multi-flex m-detail-titler" style="width: 82%"  >',
			'<input type="text"  class="m-detail-titles remarkFQTY" style="margin: 0" readonly="readonly" value="{{c5}}" />',
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
			'<input type="number" min="0" id="countR" readonly="readonly" class="FQTYInput" value="{{countr}}" />',
			'</div>',
			'</div>',
			'<div class="multi-flex ">',
			'<div class="multi-flex m-detail-titlel" style="width: 40%">',
			'<label>降级数:</label>',
			'</div>',
			'<div class="multi-flex  m-detail-titler" style="width: 60%">',
			'<input type="number" min="0" id="countD"  readonly="readonly" class="FQTYInput" value="{{countd}}" />',
			'</div>',
			'</div>',
			'</div>',
			'<div class="multil-btn">',
			'<div class="multi-flex ">',
			'<div class="multi-flex m-detail-titlel" style="width: 40%">',
			'<label>工序废数:</label>',
			'</div>',
			'<div class="multi-flex  m-detail-titler" style="width: 60%">',
			'<input type="number" min="0" id="countG"  readonly="readonly" class="FQTYInput" value="{{countg}}" />',
			'</div>',
			'</div>',
			'<div class="multi-flex "></div>',
			'</div>',

			'</div>', ].join("")
	};

	KEYWORD_LIST = [
		"workShopName|车间",
		"lineName|产线",
		"orderNo|订单号",
		"partName|工序段",
		"partPointName|工序",
		"materialNo|物料号",
		"materialName|物料名",
		"productNo|产品规格",
		"feedBoxID|料盒号",
		"locationList|仓位号",
		"operatorName|操作员",
		"inspectorName|检验员",
		"receivingClerkName|入库员",
		"bGTimeText|报工时间",
		"inspectTimeText|检验时间",
		"inStockTimeText|入库时间",
		"fQTY|报工数"
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
			
			function GetQRList(qrString) {
				var _list = qrString.split(';'),
					qrStringList = [];

				for (var i = 0; i < _list.length; i++) {
					var _temp = _list[i].split(':');
					if (_temp.length != 3)
						continue;

					qrStringList.push(_temp[0]);
				}
				return qrStringList;
			}
			$("#repair").click(function() {

				if ( model._data.detail.status != 0)  
					return;
				 
				if (window.JSImpl) {
					window.QRTEST = function(id) {
						if (!id || id.length < 5) {
							alert("此料盒不符合设置标准！请重新扫描再试！");
							return;
						} 
						var _qrList = GetQRList(model._data.detail.feedBoxID);

						if (_qrList.indexOf(id) >= 0) {
							window.location = "orderWriteDetail.html?femi_handle=1&id=" + model.query.id;
						} else {
							alert("扫描料盒错误！");
						} 
					};
					window.JSImpl.readQRCode('QRTEST');
				} else {

					window.location = "orderWriteDetail.html?femi_handle=1&id=" + model.query.id;

				}
				
			});
			 
			$(".m-table.content").delegate(".list-group-item:not(.stop-expand)", "click", function(e) {
				var $this = $(this),
					$expand = $this.find(".item-icon .icon");

				if ($expand.hasClass("icon-arrow-expand")) {
					$expand.removeClass("icon-arrow-expand");

					$this.siblings().hide(); //ul元素消失
				} else {
					$expand.addClass("icon-arrow-expand");
					$this.siblings().show(); //ul显示
				}

				e.stopPropagation(); //阻止事件冒泡
				e.preventDefault(); //preventDefault() 方法阻止元素发生默认的行为
			});
			
			$("#back").click(function() {
				window.history.back();
			});

			$("body").delegate("#confirm", "click", function() {
				model.com.addCheck(5);
			});
			$("body").delegate("#reject", "click", function() {
				model.com.addCheck(6);
			});

		},

		run : function() {

			this.com.get({
				id : model.query.id
			}, function(data) {
				
				if( model.query.femi_handle){
					$("#repair").hide();
					if (data.info.detail.status == 0) {
						$(".femi-handle-btn").show(); 
					}
				}else{
					if (data.info.detail.status != 0) {
						$("#repair").hide();
					}
				}
				 
				model.com.render(model.com.filter(data.info));
				$("#count").val(data.info.detail.fQTYGood);
				$("#noCount").val(data.info.detail.fQTYBad + data.info.detail.fQTYReturn + data.info.detail.fQTYDownGrade + data.info.detail.fQTYScrap);
 
			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/report_task/item_info_detail",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},


			add : function(data, fn, context) {
				var d = {
					$URI : "/report_task/submit",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			
			addCheck : function(val) {

				if (IsSubmit)
					return;

				if (!val || (val != 5 && val != 6))
					return;

				var statusText = "确认收料数量：" + model._data.detail.fQTY;
				if (val == 6)
					statusText = "是否确定要驳回?"

				model._data.detailSubmits = [];


				if (confirm(statusText)) {
					IsSubmit = true;
					model._data.detail.inspectTime = new Date().getTime();
					model._data.detail.inStockTime = new Date().getTime();
					model._data.detail.status = val;
					model.com.add({
						data : model._data.detail,
						list : model._data.detailSubmits
					}, [ function(res) {
						IsSubmit = false;
						if (res.info.iD > 0) {
							alert("操作成功");
							window.location = "detail.html?id=" + res.info.iD;
						} else {
							alert("操作失败");
						}
					}, function() {
						IsSubmit = false;
					} ]);
				}

			},

			filter : function(data) {
				var _data = [],
					_list = [];

				model._data = data;
				data.detail.bGTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.detail.bGTime);
				if (data.detail.inspectTime)
					data.detail.inspectTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.detail.inspectTime);

				if (data.detail.inStockTime)
					data.detail.inStockTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.detail.inStockTime);

				if (data.detail.bGMode == 1) {
					$(".tip-content").html(STATUS_O[data.detail.status]);
					KEYWORD.inspectorName.name = "收料员";
					KEYWORD.inspectTimeText.name = "收料时间";
					KEYWORD.receivingClerkName = undefined;
					KEYWORD.inStockTimeText = undefined;
				} else {
					$(".tip-content").html(STATUS[data.detail.status]);
				}


				for (var p in data.detail) {
					var o = KEYWORD[p];
					if (o) {

						_data[Number(o.index)] = {
							name : o.name,
							value : data.detail[p] === "" ? "&nbsp;" : data.detail[p]
						};
					}
				}
				$.each(data.detailItems, function(i, item) {
					_list.push({
						ppid : item.partPointID,
						ppName : item.partPointName,
						c1 : item.fQTYGood,
						c2 : item.fQTYBad,
						c3 : item.fQTYReturn,
						c4 : item.fQTYScrap,
						c5 : item.remarkText,
						lastCount : ""
					});
				});
				if (_list && _list.length) {
					_list[_list.length - 1].lastCount = $com.util.template([ {
						countr : data.detail.fQTYReturn,
						countd : data.detail.fQTYDownGrade,
						countg : data.detail.fQTYBad
					} ], HTML.Count_List);
				}
				return {
					data : _data,
					list : _list
				};
			},

			render : function(data) {
				$(".m-c-body .m-detail-list").append($com.util.template(data.data, HTML.LIST));
				//$(".m-table table tbody").html($com.util.template(data.list, HTML.LIST2));
				//$(".tip-content").html(data.status);
				$(".handle-info .list-group").html($com.util.template(data.list, HTML.SUB_LIST));
			},
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-07ea1bf6f7.js.map