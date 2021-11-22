require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,

		KEYWORD,
		KEYWORD_LIST,
		IsSubmit,
		STATUS;

	IsSubmit = false;
	STATUS = [ "送检中", "已收检", "已检验", "待收库", "已收库", "已入库", "已驳回", "待验收", "验收中" ];

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
		"WorkShopName|车间",
		"LineName|产线",
		"OrderNo|订单号",
		"PartName|工序段",
		"PartPointName|工序",
		"MaterialNo|物料号",
		"MaterialName|物料名",
		"ProductNo|产品规格",
		"FeedBoxID|料盒号",
		"LocationList|仓位号",
		"OperatorName|操作员",
		"InspectorName|检验员",
		"ReceivingClerkName|入库员",
		"BGTimeText|报工时间",
		"InspectTimeText|检验时间",
		"InStockTimeText|入库时间",
		"FQTY|报工数"
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

			$(".Reject").click(function() {
				if (IsSubmit)
					return;
				if (model._data.detail.status == 1) {
					IsSubmit = true;
					model.com.submit(model._data.detail, 6, function(res) {
						IsSubmit = false;
						alert("驳回成功");
						window.location = "report.html";
					});
				}
				else
					alert("单据未处于收检状态，不能进行驳回！");
			});
			$(".RepairB").click(function() {
				if ((model._data.detail.status >= 1 && model._data.detail.status <= 3) || model._data.detail.status == 6) {
					window.location = "orderWrite.html?id=" + model.query.id;
				}
				else
					alert("单据已被处理，不能进行修改！");
			});
			$(".SearchStorage").click(function() {
				if (model._data.detail.status >= 2) {
					if(model._data.detail.BGMode==4){
						if ( model._data.detail.fQTYScrap_I > 0) {
							window.location = "applyDetail.html?id=" + model.query.id;
						} else { 
							alert("无报废入库单信息");
							if (model._data.detail.status == 2) {
								IsSubmit = true;
								model.com.submit(model._data.detail, 7, function(res) {
									IsSubmit = false; 
								});
							} 
						}
					}else{
						window.location = "applyDetail.html?id=" + model.query.id;
					} 

				} else {
					alert("报工明细填写不正确，请修改！");
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

		},

		run : function() {

			this.com.get({
				id : model.query.id
			}, function(data) {
				
				if(data.info.detail.bGMode==4)
				{
					$(".SearchStorage").each(function(i,item){
						if($(item).text()=="检验入库单")
							if($(item).text("流转入库单"));
						if($(item).text()=="检验入库")
							if($(item).text("流转入库"));
					}); 
				}
					
				
				$("#HandleControl").hide();
				$("#DetailControl").hide();
				$("#DetailControlED").hide();
				switch (data.info.detail.status) {
				case 0:
					break;
				case 1:
					$("#HandleControl").show();
					break;
				case 2:
					$("#DetailControl").show();
					break;
				case 3:
					$("#DetailControl").show();
					break;
				case 6:

					break;
				default:
					$("#DetailControlED").show();
					break;
				}

				model.com.render(model.com.filter(data.info));
				$("#countIPT").val(data.info.detail.FQTYIPTGood);
				$("#noCountIPT").val(data.info.detail.FQTYIPTBad);
				$("#FQTYIPT").html(data.info.detail.FQTYIPT);
				$("#remarkIPT").val(data.info.detail.Remark);

				$("#countIPTGood").val(data.info.detail.fQTYGood_I);
				$("#noCountIPTSc").val(data.info.detail.fQTYScrap_I);
				$("#countIPTD").val(data.info.detail.fQTYDownGrade_I);
				$("#noCountIPTR").val(data.info.detail.fQTYReturn_I);
				$("#countIPTG").val(data.info.detail.fQTYBad_I);

				$("#count").val(data.info.detail.FQTYGood);
				$("#noCount").val(data.info.detail.FQTYBad + data.info.detail.FQTYReturn + data.info.detail.FQTYDownGrade + data.info.detail.FQTYScrap);
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


			add : function(data, fn, context) {
				var d = {
					$URI : "/ReportTask/Submit",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			submit : function(data, status, fn) {
				data.status = status;
				model.com.add({
					data : data
				}, [ fn, function(err) {
					IsSubmit = false;
				} ])
			},

			filter : function(data) {
				var _data = [],
					_list = [];

				model._data = data;

				$(".tip-content").html(STATUS[data.detail.status]);

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
				$.each(data.detailItems, function(i, item) {
					_list.push({
						ppid : item.PartPointID,
						ppName : item.PartPointName,
						c1 : item.FQTYGood,
						c2 : item.FQTYBad,
						c3 : item.FQTYReturn,
						c4 : item.FQTYScrap,
						c5 : item.RemarkText,
						lastCount : ""
					});
				});
				if (_list && _list.length) {
					_list[_list.length - 1].lastCount = $com.util.template([ {
						countr : data.detail.FQTYReturn,
						countd : data.detail.FQTYDownGrade,
						countg : data.detail.FQTYBad
					} ], HTML.Count_List);
				}
				return {
					data : _data,
					list : _list
				};
			},


			render : function(data) {
				$(".m-c-body .m-detail-list").append($com.util.template(data.data, HTML.LIST));
				$(".handle-info ul.list-group:not(.ipt-group)").html($com.util.template(data.list, HTML.SUB_LIST));
			},
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-07ea1bf6f7.js.map