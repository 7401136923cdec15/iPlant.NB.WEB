require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {

    var model,
		HTML,
		STATUS,
		COLOUR,
        AllItem,
        DataAll,
		IsSubmit,
        dataTask;
    dataTask = {};

	IsSubmit = false;

	STATUS = [ "未检", "合格", "不合格" ];

	COLOUR = [ "text-yellow", "text-blue", "text-red" ];

	HTML = {
	    LIST: ['<tr data-id="{{ID}}" data-status="{{ResultName}}">',
			'<td>{{Name}}</td>',
			'<td>{{Comment}}</td>',
			'<td class="{{Color}}">{{ResultName}}</td>',
			'<td>',
			'<svg width="11px" height="17px" viewBox="0 0 11 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
			'<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">',
			'<g transform="translate(-1675.000000, -680.000000)" fill="#C8C8C8">',
			'<g transform="translate(1668.000000, 680.000000)">',
			'<path d="M12.3333333,5.66666667 L3,5.66666667 L3,3 L13.6666667,3 L15,3 L15,15 L12.3333333,15 L12.3333333,5.66666667 Z" transform="translate(9.000000, 9.000000) scale(-1, 1) rotate(-135.000000) translate(-9.000000, -9.000000) "></path>',
			'</g></g></g></svg>',
			'</td>',
			'</tr>'].join("")
	};

	model = $com.Model.create({
		name : '点检任务',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
		    $("body").delegate("table tbody tr", "click", function () {
		        var $this = $(this),
                      id = $this.attr("data-id"),
                      status = $this.attr("data-status");
		        if (model.query.QRstring && model.query.QRstring.length != "") {
		            window.location = "check.html?QRstring=" + model.query.QRstring + "&sid=" + id;
		        } else {
		            window.location = "check.html?id=" + model.query.id + "&sid=" + id;
		        }
			});
			$("body").delegate("#SubmitAll", "click", function () {
			    model.com.getTask({
			        EventID: window._eventID, ID: model.query.id
			    }, function (data) {
			        var _data = data.info;
			        var _result = data.Result;
			        var trueNumber = 0;
			        var ratio = 0.00;
			        for (var i = 0; i < _result.length; i++) {
			            if (_result[i].Result == true)
			                trueNumber++;
			        }
			        ratio=trueNumber / _result.length;
			    if (IsSubmit) {
			        alert("提交中，请稍后!");
			        return;
			    }
			        model.com.getCheckType({
			            ID: _data.ModuleVersionID,
			        }, function (data) {
			            if (ratio >= data.info.ResultRatio)
			                _data.Result = true;
			            else
			                _data.Result = false;
			            confirm("确认提交吗？", function (bool) {
			                if (bool == true) {
			                    IsSubmit = true;
			                    _data.Status = 5;
			                    model.com.add({
			                        data: _data,
			                        result: _result,
			                    }, function (res) {
			                        alert("提交成功");
			                        window.location = "itemDetail.html?id=" + model.query.id;
			                    });
			                } else {
			                    return false;
			                }
			            });
			         });
			    });
			});
		},
		run: function () {
        //$(".tip-content").text("未检");
        //扫描情况
        if (model.query.QRstring && model.query.QRstring.length !="") {
            model.com.getScan({
                QRCode: model.query.QRstring
            }, function (data) {
                var code = data.info.QRType;
            model.com.getTask({
                EventID: window._eventID, QRType: code, QRCode: model.query.QRstring
            }, function (data) {
                if (data.list.length == 0 || !data.list.length) {
                    // window.location = "list.html";
                    //confirm("此二维码暂无点检任务!", function (bool) {
                    alert("此二维码暂无点检任务！", function () {
                        window.location = "list.html";
                        });
                    return false;
                }
                var info = data.info;
                var list = data.list;
                var result = data.Result;
                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < result.length; j++) {
                        if (result[j].ItemID == list[i].ID) {
                            if (result[j].Result == true) {
                                list[i].ResultName = "合格";
                                list[i].Color = "text-green";
                            } else {
                                list[i].ResultName = "不合格";
                                list[i].Color = "text-red";
                            }
                        }
                    }
                }
                if (info.Status != 5) {
                    $(".tip-content").text("未检");
                } else {
                    $(".tip-content").text("已检");
                }
                    $(".m-table tbody").html($com.util.template(list, HTML.LIST));
            });
            });
            //点击点检任务情况
        }else {
            model.com.getTask({
                EventID: window._eventID, ID: model.query.id
            }, function (data) {
                var info = data.info;
                var list = data.list;
                var result = data.Result;
                            for (var i = 0; i < list.length; i++) {
                                for (var j = 0; j < result.length; j++) {
                                    if (list[i].ID == result[j].ItemID) {
                                        if (result[j].Result == false) {
                                            list[i].ResultName = "不合格";
                                            list[i].Color = "text-red";
                                        } else {
                                            list[i].ResultName = "合格";
                                            list[i].Color = "text-green";
                                        }
                                    }
                                }
                            }
                            if (info.Status != 5) {
                                $(".tip-content").text("未检");
                            } else {
                                $(".tip-content").text("已检");
                            }
                $(".m-table tbody").html($com.util.template(list, HTML.LIST));
                });
        }
		},

		com: {
		    //扫描
		    getScan: function (data, fn, context) {
		        var d = {
		            $URI: "/TaskHandle/ScanQRCode",
		            $TYPE: "get"
		        };
		        function err() {
		            $com.app.tip('获取失败，请检查网络');
		        }
		        $com.app.ajax($.extend(d, data), fn, err, context);
		    },
			    getTask : function(data, fn, context) {
			        var d = {
			            $URI: "/SFCTaskSpot/Info",
			            $TYPE : "get"
			        };
			        function err() {
			            $com.app.tip('获取失败，请检查网络');
			        }
			        $com.app.ajax($.extend(d, data), fn, err, context);
			    },
			        getTaskAll : function(data, fn, context) {
			            var d = {
			                $URI: "/SFCTaskSpot/All",
			                $TYPE : "get"
			            };
			            function err() {
			                $com.app.tip('获取失败，请检查网络');
			            }
			            $com.app.ajax($.extend(d, data), fn, err, context);
			        },
			        getCheckType: function (data, fn, context) {
			            var d = {
			                $URI: "/DevicePointCheckType/Info",
			                $TYPE: "get"
			            };
			            function err() {
			                $com.app.tip('获取失败，请检查网络');
			            }
			            $com.app.ajax($.extend(d, data), fn, err, context);
			        },
			        getCheckItem: function (data, fn, context) {
			            var d = {
			                $URI: "/DevicePointCheckItem/All",
			                $TYPE: "get"
			            };
			            function err() {
			                $com.app.tip('获取失败，请检查网络');
			            }
			            $com.app.ajax($.extend(d, data), fn, err, context);
			        },
			        getCheckResult: function (data, fn, context) {
			            var d = {
			                $URI: "/DeviceItemResult/All",
			                $TYPE: "get"
			            };
			            function err() {
			                $com.app.tip('获取失败，请检查网络');
			            }
			            $com.app.ajax($.extend(d, data), fn, err, context);
			        },
			filter : function(data) {
				var _data = [],
					status;
			 
				model.DeviceNo = data.DeviceNo;
				
				status = STATUS[data.Result];
				
				$.each(data.itemList.dMSIPTItem,function(i,item) {
					var _status = model.com.getStatus(item.ID, item.ItemResult);
					 
					item.ItemResultText=_status.tip;
					item.Color=_status.color;
				});
				_data=data.itemList.dMSIPTItem;
				return {
					data : _data,
					status : status
				};
			},

			add : function(data, fn, context) {
				var d = {
				    $URI: "/SFCTaskSpot/Update",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			}, 
			render : function(data) {
				$(".m-table tbody").html($com.util.template(data.data, HTML.LIST));
				$(".tip-content").html(data.status);
			},

			getStatus : function(id, result) {
				var text,
					color,
					num;
				if (id < 0) {
					text = "存储错误";
					color = "text-red";
					num = -2;
				} else if (id > 0) {
					if (result == 1) {
						text = "合格";
						color = "text-blue";
						num = id; //合格不能看详情      num = id;
					} else {
						text = "不合格";
						color = "text-red";
						num = id;
					}
				} else {
					text = "合格";
					color = "text-yellow";
					num = 0;
				}
				return {
					tip : text,
					color : color,
					status : num
				};
			}
		}
	});

	model.init();

});
