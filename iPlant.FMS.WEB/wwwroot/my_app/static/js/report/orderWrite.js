require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD,
		KEYWORD_LIST,
		IsSubmit;
	IsSubmit = false;

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
		//"feedBoxID|料盒号",
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
			
			$("#repair").click(function() {
				window.location = "bind.html?id=" +  model.query.id;
			});
			$(".m-table.content").delegate(".list-li .list-group input", "input", function(e) {
				model.com.FullElement();
			});
			$("#back").click(function() {
				window.history.back();
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

			
			$("body").delegate("#confirm", "click", function() {
				model.com.addCheck();
			});
			//保存提交

		},

		run : function() {

			if (model.query.qr) {
				this.com.getNew({ 
					task_id : model.query.id
				}, function(data) {

					data.info.detail.FeedBoxID = model.query.qr;
					model.com.render(model.com.filter(data.info)); 
					$("#count").val(data.info.detail.FQTYGood);
					$("#noCount").val(data.info.detail.FQTYBad + data.info.detail.FQTYReturn + data.info.detail.FQTYDownGrade + data.info.detail.FQTYScrap);
				});
			} else {
				this.com.get({
					id : model.query.id
				}, function(data) {
					model.com.render(model.com.filter(data.info)); 
					$("#count").val(data.info.detail.FQTYGood);
					$("#noCount").val(data.info.detail.FQTYBad + data.info.detail.FQTYReturn + data.info.detail.FQTYDownGrade + data.info.detail.FQTYScrap);
					
					model.com.FullElement()
				});
			}

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

			getNew : function(data, fn, context) {
				var d = {
					$URI : "/ReportTask/ItemInfoNew",
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


			filter : function(data) {
				var _data = [],
					_list = [];

				model._data = data;


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
				$(".handle-info .list-group").html($com.util.template(data.list, HTML.SUB_LIST));
				
				
				$($(".handle-info .list-group .list-group .multil-btn input.returnFQTY")[0]).closest(".multil-btn").hide();
			},




			addCheck : function(e, close) {

				if (IsSubmit)
					return;

				var $node,
					val,
					$nodes,
					valno,
					list,
					$nodeR,
					$nodeD,
					valR,
					valD, 
					valnoC;
				list = model.com.getDetails();
				if (list.state)
					return;
				$node = $("#count");
				$nodes = $("#noCount"); 

				if (isNaN($node.val())) {
					alert("请保持输入类型为合法数字");
					$node.focus();
					return;
				}
				if (isNaN($nodes.val())) {
					alert("请保持输入类型为合法数字");
					$nodes.focus();
					return;
				}
				val = Number($node.val());
				valno = Number($nodes.val()); 
				if (val + valno <= 0) {
					alert("填写总数不能为0");
					return;
				}
				if (val + valno != model._data.detail.fQTY) {
					alert("填写总数不等于报工数！！");
					return;
				}

 
				model._data.detail.fQTYGood = val;
				model._data.detail.fQTYScrap = list.count;

				model._data.detail.fQTYGood_I = val;
				model._data.detail.fQTYScrap_I = list.count;
				model._data.detail.fQTYDownGrade_I = model._data.detail.FQTYDownGrade;
				model._data.detail.fQTYReturn_I = model._data.detail.FQTYReturn;
				model._data.detail.fQTYBad_I = model._data.detail.FQTYBad;
				model._data.detail.status = 0;
				model._data.detail.Remark = " ";
				model._data.detailSubmits = [];
				for (var i = 0; i < model._data.detailItems.length; i++) {

					var FQTYScrapTemp = 0;
					$.each(list.list, function() {
						if (model._data.detailItems[i].partPointID != this.ppid)
							return true;
						model._data.detailItems[i].fQTYGood = this.goodFQTY || 0;
						model._data.detailItems[i].fQTYReturn = this.returnFQTY || 0;
						model._data.detailItems[i].fQTYBad = this.badFQTY || 0;
						model._data.detailItems[i].fQTYScrap = this.scrapFQTY || 0;
						model._data.detailItems[i].remarkText = this.remarkFQTY || " ";
						model._data.detailItems[i].fQTYTotal = model._data.detail.FQTY || 0;
						model._data.detailItems[i].deviceID=model.query.DeviceID;
						model._data.detailSubmits.push(model._data.detailItems[i]);

						return false;
					});

				}

				if (confirm("合格数：" + model._data.detail.fQTYGood + "\n不合格数：" + valno)) {
					IsSubmit = true;
					model._data.detail.status = 0;
					model.com.add({
						data : model._data.detail,
						list : model._data.detailSubmits
					}, [ function(res) {
						IsSubmit = false;
						if (res.info.ID > 0) {
							alert("操作成功");
							window.location = "orderWriteDetail.html?id=" + res.info.ID;
						} else {
							alert("操作失败");
						}
					}, function() {
						close();
					} ]);
				} else {
					close();
				}
			},
			getDetails : function() {
				var result = {
					state : 0,
					list : [],
					count : 0
				};

				var $ItemList = $(".handle-info .list-group .list-li");


				$($ItemList).each(function() {

					var $this = $(this),
						ppid = $this.attr("data-id"),
						$goodFQTY = $this.find(".goodFQTY"),
						$badFQTY = $this.find(".badFQTY"),
						$returnFQTY = $this.find(".returnFQTY"),
						//$scrapFQTY=$this.find(".scrapFQTY"),
						$remarkFQTY = $this.find(".remarkFQTY"),
						goodFQTY = $goodFQTY.val() || 0,
						badFQTY = $badFQTY.val() || 0,
						returnFQTY = $returnFQTY.val() || 0,
						//scrapFQTY=$scrapFQTY.val()||0,
						remarkFQTY = $remarkFQTY.val() || " ";



					if (isNaN(goodFQTY)) {
						alert("合格数为非法数字");
						$goodFQTY.focus();
						result.state = 1;
						return false;
					}
					if (isNaN(badFQTY)) {
						alert("工序废数为非法数字");
						$badFQTY.focus();
						result.state = 1;
						return false;
					}
					if (isNaN(returnFQTY)) {
						alert("回用数为非法数字");
						$returnFQTY.focus();
						result.state = 1;
						return false;
					}
					/* if(isNaN(scrapFQTY)){
                          	alert("报废数为非法数字");
                          	$scrapFQTY.focus();
                        	result.state=1;
                          	return false;
                          }	*/
					result.list.push({
						ppid : ppid,
						goodFQTY : Number(goodFQTY),
						badFQTY : Number(badFQTY),
						returnFQTY : Number(returnFQTY),
						scrapFQTY : Number(badFQTY),
						remarkFQTY : remarkFQTY
					});
				});


				var wBadTemp = 0;
				for (var i = result.list.length - 1; i >= 0; i--) {
					result.list[i].scrapFQTY += wBadTemp;
					wBadTemp = result.list[i].returnFQTY;
					result.count += result.list[i].scrapFQTY;
				}

				return result;
			},
	
			FullElement :function () {
				var valCount = model._data.detail.fQTY,
					$nodes = $(".m-table.content .list-li .list-group");
				if ($nodes && $nodes.length) {
					for (var i = 0; i < $nodes.length; i++) {
						var $ts = $($nodes[i]),
							$good = $ts.find("input.goodFQTY"),
							$bad = $ts.find("input.badFQTY"),
							$return = $ts.find("input.returnFQTY"),
							gval = Number($good.val()),
							bval = Number($bad.val()),
							rval = Number($return.val());

						if (i == $nodes.length - 1) {
							var $Rcount = $ts.find("#countR"),
								$Dcount = $ts.find("#countD"),
								$Gcount = $ts.find("#countG"),
								Rcount = Number($Rcount.val()),
								Dcount = Number($Dcount.val()),
								Gcount = Number($Gcount.val());

							if (valCount == 0) {
								gval = 0;
								bval = 0;
								rval = 0;
								Rcount = 0;
								Dcount = 0;
								Gcount = 0;
							}
							if (bval + rval + Rcount + Dcount + Gcount > valCount) {
								bval = 0;
								rval = 0;
								Rcount = 0;
								Dcount = 0;
								Gcount = 0;
								gval = valCount;
							}

							gval = valCount - (bval + rval + Rcount + Dcount + Gcount);

							$Rcount.val(Rcount);
							$Dcount.val(Dcount);
							$Gcount.val(Gcount);
							model._data.detail.fQTYDownGrade = Dcount;
							model._data.detail.fQTYReturn = Rcount;
							model._data.detail.fQTYBad = Gcount;

						} else {
							if (valCount == 0) {
								gval = 0;
								bval = 0;
								rval = 0;
							}
							if (bval + rval > valCount) {
								bval = 0;
								rval = 0;
								gval = valCount;
							}

							gval = valCount - (rval + bval);

						}
						$bad.val(bval);
						$return.val(rval);
						$good.val(gval);
						valCount = gval;
					}


				}
				$("#count").val(valCount);
				$("#noCount").val(model._data.detail.FQTY - valCount);
			}

		
		},
	});

	model.init();

});
//# sourceMappingURL=maps/order-07ea1bf6f7.js.map