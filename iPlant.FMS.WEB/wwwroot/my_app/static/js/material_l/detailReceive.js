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


	STATUS = ["待配料", "已配料", "已收料", "已领料", "驳回"];

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
			'</li>'].join(""),
		LIST2: ['<tr>',
		    '<td>{{StockName}}</td>',
			'<td>{{BatchNo}}</td>',
			'<td>{{FQTYPL}}</td>',
			'<td>{{RemarkText}}</td>',
			//'<td>{{d4}}</td>',
			'</tr>'].join(""),
	};

	KEYWORD_LIST = [
		//"WorkShopName|车间",
		"LineName|产线",
		"PartName|工段",
		"PartPointName|工序",
		//"DeviceNo|设备",
		"MaterialNo|物料号",
		"MaterialName|物料名称",
//		"feedBoxID|料盒号",
		"FQTYPL|收料数",
		//"FQTYLL|领料数",
		//"PLOperatorName|配料员", 
		//"PLTimeText|配料时间",
		//"SLTimeText|送料时间", 
		//"LLOperatorName|领料员",
		//"LLTimeText|领料时间"
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
		    $("body").delegate("#confirm", "click", function () {

		        confirm("确认领料数量：" + model._data.FQTYPL, function (bool) {
		            if (bool) {
		                model.com.addCheck(5);
		            } else {
		                return false;
		            }

		        }
                )
		       // model.com.addCheck(5);
		        
		    });
		    $("body").delegate("#reject", "click", function () {
		    
		        confirm("是否确定要驳回?", function (bool) {
		            if (bool) {
		                model.com.addCheck(6);
		            } else {
		                return false;
		            }

		        }
		        )
		        
		    });
		    $("body").delegate("#confirmReceive", "click", function () {

		        confirm("是否确定要收料吗?", function (bool) {
		            if (bool) {
		                model.com.refresh(model.query.id);
		            } else {
		                return false;
		            }

		        }
		        )

		    });

		},

		run : function() {
		    this.com.get({
		        ID: model.query.id
		    }, function (data) {
		        //data.info = {
		        //    WorkShopName: "模组",
		        //    LineName: "160V",
		        //    PartName: "产品包装",
		        //    PartPointName: "模组组装",
		        //    PLOperatorName: "zx",
		        //    LLOperatorName:"cc",


		        //}
		        modelInfo = data.info;
		        if (modelInfo.Status==1) {
		            model.com.render(model.com.filter(data.info));
		        } else if (modelInfo.Status == 3 || modelInfo.Status == 4 || modelInfo.Status == 2) {

			        model.com.renderCon(model.com.filter(data.info));
			    }

			    model.com.getInfoDetail({
			        TaskID: 0,
			        ID: model.query.id
			    }, function (data1) {

			        modelInfoDetail = data1;
			     


			    });
				
			});
		},

		com: {
		    refresh: function (id) {
		        //得到Item明细
		        model.com.getInfo({
		            ID: id
		        }, function (data) {

		            modelInfo = data.info;
		            //根据任务ID拿到Item 仓位详情
		            model.com.getInfoDetail({
		                TaskID: modelInfo.TaskMaterialID,
		                ID: id
		            }, function (data1) {

		                modelInfoDetail = data1;

		                //提交

		                model.com.add({
		                    data: modelInfo,
		                    status: 2,
		                    list: modelInfoDetail.list

		                }, function (res) {
		                    alert("领料成功");

                            //刷新
		                    model.com.get({
		                        ID: model.query.id
		                    }, function (data) {

		                        modelInfo = data.info;
		                        if (modelInfo.Status == 1) {
		                            model.com.render(model.com.filter(data.info));
		                        } else if ( modelInfo.Status == 4) {

		                            model.com.renderCon(model.com.filter(data.info));
		                        } else if (modelInfo.Status == 2 || modelInfo.Status == 3) {

		                            window.location = "detail.html?id=" + id;
		                        }

		                        model.com.getInfoDetail({
		                            TaskID: 0,
		                            ID: model.query.id
		                        }, function (data1) {

		                            modelInfoDetail = data1;



		                        });

		                    });
		                  
		                });

		            });

		        });
		    },
		    getItems: function (data, fn, context) {
		        var d = {
		            $URI: "/MaterialTask/Items",
		            $TYPE: "get"
		        };

		        function err() {
		            $com.app.tip('获取失败，请检查网络');
		        }

		        $com.app.ajax($.extend(d, data), fn, err, context);
		    },
		    getInfo: function (data, fn, context) {
		        var d = {
		            $URI: "/MaterialTask/ItemInfo",
		            $TYPE: "get"
		        };

		        function err() {
		            $com.app.tip('获取失败，请检查网络');
		        }

		        $com.app.ajax($.extend(d, data), fn, err, context);
		    },
		    getInfoDetail: function (data, fn, context) {
		        var d = {
		            $URI: "/MaterialTask/InfoDetail",
		            $TYPE: "get"
		        };

		        function err() {
		            $com.app.tip('获取失败，请检查网络');
		        }

		        $com.app.ajax($.extend(d, data), fn, err, context);
		    },

		    add: function (data, fn, context) {
		        var d = {
		            $URI: "/MaterialTask/Submit",
		            $TYPE: "post"
		        };

		        function err() {
		            $com.app.tip('提交失败，请检查网络');
		        }

		        $com.app.ajax($.extend(d, data), fn, err, context);
		    },
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


			filter: function (data) {
			    model._data = data;
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
				_status = STATUS[data.Status];

				return {
					data : _data,
					status : _status
				};
			},

			render: function (data) {
			    $(".zace-show").show();
			    $(".zace-confirm").show();
				$(".m-detail-list").html($com.util.template(data.data, HTML.LIST));
				$(".tip-content").html(data.status);
				$(".m-table table tbody").html($com.util.template(modelInfo.LocationList, HTML.LIST2));
			},
			renderCon: function (data) {
			    $(".zace-show").show();
			    $(".zace-confirm").hide();
			    $(".m-detail-list").html($com.util.template(data.data, HTML.LIST));
			    $(".tip-content").html(data.status);
			    $(".m-table table tbody").html($com.util.template(modelInfo.LocationList, HTML.LIST2));
			},
			addCheck: function (val) {
			
			    if (!val || (val != 5 && val != 6))
			        return ;
                //确定
			    if (val == 5) {
			        model._data.FQTYLL = model._data.FQTYPL;
			        model.com.add({
			            data: model._data,
			            status: 3,
			            list: modelInfoDetail.list

			        }, function (res) {
			            alert("领料成功");
			            model.com.get({
			                ID: model.query.id
			            }, function (data) {
			                
			                modelInfo = data.info;
			                if (modelInfo.Status == 2) {
			                    model.com.render(model.com.filter(data.info));
			                }
			                else if (modelInfo.Status == 3)
			                {

			                    model.com.renderCon(model.com.filter(data.info));
			                }

			                model.com.getInfoDetail({
			                    TaskID: 0,
			                    ID: model.query.id
			                }, function (data1) {

			                    modelInfoDetail = data1;



			                });

			            });
			        })
                    
			    }//驳回
			    else if (val == 6) {
			        model._data.FQTYLL = 0;
			        model.com.add({
			            data: model._data,
			            status: 4,
			            list: modelInfoDetail.list

			        }, function (res) {
			            alert("驳回成功");
			            model.com.get({
			                ID: model.query.id
			            }, function (data) {

			                modelInfo = data.info;
			                if (modelInfo.Status == 2) {
			                    model.com.render(model.com.filter(data.info));
			                }
			                else if (modelInfo.Status == 4) {

			                    model.com.renderCon(model.com.filter(data.info));
			                }

			                model.com.getInfoDetail({
			                    TaskID: modelInfo.TaskMaterialID,
			                    ID: model.query.id
			                }, function (data1) {

			                    modelInfoDetail = data1;



			                });

			            });
			        })


			    } else {

			    }
			   

			   


			  

			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/detail-3c540b6a9b.js.map