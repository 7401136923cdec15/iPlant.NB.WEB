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
			'<input type="number" min=0  class="goodFQTY" readonly="readonly" value="{{c1}}"  />',
			'</div>',
			'</div>',
			'<div class="multi-flex " >',
			'<div class="multi-flex m-detail-titlel" style="width: 40%"  >',
			'<label >本道报废:</label>',
			'</div>',
			'<div class="multi-flex m-detail-titler"  style="width: 60%" >',
			'<input type="number" min=0  class="badFQTY" value="{{c2}}"  readonly="readonly"/>',
			'</div>',
			'</div>',
			'</div>',
			'<div class="multil-btn">',
			'<div class="multi-flex" >',
			'<div class="multi-flex  m-detail-titlel"  style="width: 40%" >',
			'<label>上道报废:</label>',
			'</div>',
			'<div class="multi-flex m-detail-titler"  style="width: 60%" >',
			'<input type="number" min=0  class="returnFQTY" value="{{c3}}"  readonly="readonly"/>',
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
			'<input type="text"  class="m-detail-titles remarkFQTY" style="margin: 0" value="{{c5}}"  readonly="readonly"/>',
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
			'<input type="number" min="0" id="countR" class="FQTYInput" value="{{countr}}"  readonly="readonly"/>',
			'</div>',
			'</div>',
			'<div class="multi-flex ">',
			'<div class="multi-flex m-detail-titlel" style="width: 40%">',
			'<label>降级数:</label>',
			'</div>',
			'<div class="multi-flex  m-detail-titler" style="width: 60%">',
			'<input type="number" min="0" id="countD"  class="FQTYInput" value="{{countd}}"  readonly="readonly"/>',
			'</div>',
			'</div>',
			'</div>',
			'<div class="multil-btn">',
			'<div class="multi-flex ">',
			'<div class="multi-flex m-detail-titlel" style="width: 40%">',
			'<label>工序废数:</label>',
			'</div>',
			'<div class="multi-flex  m-detail-titler" style="width: 60%">',
			'<input type="number" min="0" id="countG"  class="FQTYInput" value="{{countg}}"   readonly="readonly"/>',
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
		"InStockTimeText|入库时间"
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


			$("body").delegate("#noCountIPT", "input", function(e) {
				var $nodeIPT = $("#countIPT"),
					$nodenoIPT = $("#noCountIPT"),
					$nodeCIPT = $("#FQTYIPT"),
					valIPT = Number($nodeIPT.val()),
					valnoIPT = Number($nodenoIPT.val()),
					valCIPT = Number($nodeCIPT.html());
				if (valnoIPT > Number($("#noCountIPT").val())) {
					alert("抽检不合格数不能大于单据不合格数");
					valnoIPT = valCIPT - valIPT;
					$nodenoIPT.val(valnoIPT);

				} else {
					$nodeCIPT.html(valIPT + valnoIPT);
				}
			});
			$("body").delegate("#countIPT", "input", function(e) {
				var $nodeIPT = $("#countIPT"),
					$nodenoIPT = $("#noCountIPT"),
					$nodeCIPT = $("#FQTYIPT"),
					valIPT = Number($nodeIPT.val()),
					valnoIPT = Number($nodenoIPT.val()),
					valCIPT = Number($nodeCIPT.html());
				if (valIPT > Number($("#count").val())) {
					alert("抽检合格数不能大于单据合格数");
					valIPT = valCIPT - valnoIPT;
					$nodeIPT.val(valIPT);

				} else {
					$nodeCIPT.html(valIPT + valnoIPT);
				}
			});

			/*$("body").delegate("#FQTYcount", "input", function(e) {
				FullElement();//没用
			});
			$(".m-table.content").delegate(".list-li .list-group input", "input", function(e) {
				FullElement(); //没用
			});*/


			$("#back").click(function() {
				window.location = "orderWriteDetail.html?id=" + model.query.id;
			});

			$("body").delegate(".ipt-input", "input", function(e) {
				var $this = $(this),
					$FQTYcount = $("#FQTYcount"),
					$countIPTGood = $("#countIPTGood"),
					$noCountIPTSc = $("#noCountIPTSc"),
					$countIPTD = $("#countIPTD"),
					$noCountIPTR = $("#noCountIPTR"),
					$countIPTG = $("#countIPTG"),
					valcount = Number($FQTYcount.val()),
					valGood = Number($countIPTGood.val()),
					valSc = Number($noCountIPTSc.val()),
					valD = Number($countIPTD.val()),
					valR = Number($noCountIPTR.val()),
					valG = Number($countIPTG.val());

				if (valSc + valD + valR + valG > valcount) {
					valGood = 0;
					if ($this.hasClass("ipt-sc")) {
						valSc = valcount - valD - valR - valG;
					} else if ($this.hasClass("ipt-d")) {
						valD = valcount - valSc - valR - valG;
					} else if ($this.hasClass("ipt-r")) {
						valR = valcount - valD - valSc - valG;
					} else if ($this.hasClass("ipt-g")) {
						valG = valcount - valD - valR - valSc;
					}
				} else {
					valGood = valcount - valD - valR - valG - valSc;
				}
				model._data.detail.fQTYGood_I = valGood;
				model._data.detail.fQTYScrap_I = valSc;
				model._data.detail.fQTYDownGrade_I = valD;
				model._data.detail.fQTYReturn_I = valR;
				model._data.detail.fQTYBad_I = valG;


				$countIPTGood.val(valGood);
				$noCountIPTSc.val(valSc);
				$countIPTD.val(valD);
				$noCountIPTR.val(valR);
				$countIPTG.val(valG);

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
			
			/*function FullElement() {
				var valCount = Number($("#FQTYcount").val()),
					$nodes = $(".m-table.content .list-li .list-group:not(.ipt-group)");
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
				$("#noCount").val(Number($("#FQTYcount").val()) - valCount);
			}
			*/
			
			
			$("body").delegate("#confirm", "click", function(e) {
				 model.com.addCheck(e);
			});

 
		},

		run : function() {
			this.com.get({
				id : model.query.id, 
			}, function(data) {
				model.com.render(model.com.filter(data.info));
				$("#FQTYIPT").html(data.info.detail.FQTYIPT);
				$("#countIPT").val(data.info.detail.FQTYIPTGood);
				$("#remarkIPT").val(data.info.detail.Remark);
				$("#noCountIPT").val(data.info.detail.FQTYIPTBad);

				$("#countIPTGood").val(data.info.detail.fQTYGood_I);
				$("#noCountIPTSc").val(data.info.detail.fQTYScrap_I);
				$("#countIPTD").val(data.info.detail.fQTYDownGrade_I);
				$("#noCountIPTR").val(data.info.detail.fQTYReturn_I);
				$("#countIPTG").val(data.info.detail.fQTYBad_I);

				$("#FQTYcount").val(data.info.detail.FQTY);
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

			remove : function(data, fn, context) {
				var d = {
					$URI : "/ReportStore/Remove",
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

				data.detail.BGTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.detail.BGTime);
				if (data.detail.InspectTime)
					data.detail.InspectTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.detail.InspectTime);
 
				
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
				$(".m-c-body .m-detail-list").html($com.util.template(data.data, HTML.LIST));
				$(".handle-info ul.list-group:not(.ipt-group)").html($com.util.template(data.list, HTML.SUB_LIST));
			},



			addCheck : function(e, close) {

				if (IsSubmit)
					return;

				var $node = $("#count"),
					$nodes = $("#noCount"),
//					list = model.com.getDetails(),
					$nodeC = $("#FQTYcount"),
					$nodeIPT = $("#countIPT"),
					$nodesIPT = $("#noCountIPT"),
					$nodeCIPT = $("#FQTYIPT"),
					val = Number($node.val()),
					valno = Number($nodes.val()),
					valnoC = Number($nodeC.val()),
					valIPT = Number($nodeIPT.val()),
					valnoIPT = Number($nodesIPT.val()),
					valnoCIPT = Number($nodeCIPT.html());

			/*	if (list.state)
					return;
			 */
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

				if (val + valno <= 0) {
					alert("填写总数不能为0");
					return;
				}
				if (val + valno != valnoC) {
					alert("填写总数不等于报工数！！");
					return;
				}
				if (valnoCIPT <= 0) {
					alert("抽检数不能为0！");
					return;
				}
				/*model._data.detail.fQTY = valnoC;
				model._data.detail.fQTYGood = val;
				model._data.detail.fQTYScrap = list.count;
				*/
				model._data.detail.FQTYIPT = valnoCIPT;
				model._data.detail.FQTYIPTGood = valIPT;
				model._data.detail.FQTYIPTBad = valnoIPT;
				
				model._data.detail.remark =  ($("#remarkIPT").val()&&$("#remarkIPT").val() != "") ? $("#remarkIPT").val(): " ";
				
		/*		model._data.detailSubmits = [];
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
						model._data.detailSubmits.push(model._data.detailItems[i]);

						return false;
					});

				}*/

				if (confirm("合格数：" + valIPT+ "\n不合格数：" + valnoIPT)) {
					IsSubmit = true;
					
					model._data.detail.status = 2;
					
					if(model._data.detail.BGMode==4&& model._data.detail.fQTYScrap_I == 0)
					{
						model._data.detail.status = 7;
					}
					
					model.com.add({data: model._data.detail,list:model._data.detailItems}, [function(res) {
						IsSubmit = false;
						if (res.info.ID > 0) {
							model.com.remove({
								rid : res.info.ID
							}, function(res2) {
								alert("操作成功");
								window.location = "orderWriteDetail.html?id=" + model.query.id;
							});
						} else {
							alert("操作失败");
						}
					},function(){
						IsSubmit = false;
					}]);
				}  
			},
			/*getDetails : function() {
				var result = {
					state : 0,
					list : [],
					count : 0
				};

				var $ItemList = $(".handle-info .list-group .list-li:not(.ipt-li)");


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
					 if(isNaN(scrapFQTY)){
                          	alert("报废数为非法数字");
                          	$scrapFQTY.focus();
                        	result.state=1;
                          	return false;
                          }	
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
			}
		*/
		},
	});

	model.init();

});
//# sourceMappingURL=maps/order-07ea1bf6f7.js.map