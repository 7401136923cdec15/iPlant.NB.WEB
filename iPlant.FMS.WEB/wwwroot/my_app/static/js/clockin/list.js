require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {

	//需要引用bootstrap的就添加一个url:'./static/utils/js/base/bootstrap' 参数 BS  然后先执行BS();
	//需要用动态表单的添加 './static/utils/js/base/entry' 参数	 iForm 


	var model,
		HTML,
		STATUS,
		COLOUR,
		ShiftText,
		ShiftCOLOUR;

	ShiftText = [ "上上班次", "上班次", "本班次", "下班次", "下下班次" ];

	ShiftCOLOUR = [ "text-grey", "text-red", "text-yellow", "text-blue", "text-grey" ];

	STATUS = [ "待开工", "已开工", "暂停中", "已完工", "异常中" ];

	COLOUR = [ "text-yellow", "text-green", "text-blue", "text-grey", "text-red" ];
	HTML = {
	    LIST: ['<div class="ms-group clearfix" data-id="{{ID}}"  data-shift="{{Login}}" >',
			'<div class="ms-col ms-col-f">',
			'<div class="ms-limit">',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt">',
            '<span class="ms-text">{{WorkShopName}}</span>',
			'</span>',
            '<span>{{StationName}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-text">{{ModuleName}}</span>',
			'</span> <span class="ms-field"> <span class="ms-label">人员:</span>',
			'<span class="ms-text">{{Operator}}</span>',
			'</span><span class="ms-field"> <span class="ms-label"></span>',
			'<span class="ms-text text-yellow">{{LoginTime}}</span>',
			'</span>',
			'</div>',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status text-blue">{{LoginText}}</span>',
			'</div>',
			'</div>',

		].join("")
	};

	model = $com.Model.create({
		name : '上岗打卡',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
		    
		    //$("body").delegate("#start", "click", function () {
		      
		    //    model.com.getStartTask({
		    //        WorkShopID: 1, StationID: 1, EventID: 1001
		    //    }, function (data) {
		    //        alert("打卡成功");
		    //        model.com.refresh();
		    //    });
		    //});
			//$("body").delegate(".ms-group", "click", function() {
			//	var $this = $(this),
			//		id = $this.attr("data-id"),
			//		shift = Number($this.attr("data-shift"));

			//	if (shift < -1 || shift > 1) {
			//		return;
			//	}
			//	window.location = "detail.html?id=" + id;
			//});
			$("body").delegate("#menu", "click", function () {
			    if ($(".frame").is(":hidden")) {
			        $(".frame").show();
			    } else {
			        $(".frame").hide();
			    }
			});
		    //上班打卡
			$("body").delegate("#screen", "click", function () {
			   
			    if (window._eventID == 1001) {
			        window.QRTEST = function (str) {
			            if (!str || str.length <= 0)
			                return false;
			            model.com.getScan({
			                QRCode: str
			            }, function (data) {

			                model.com.getStation({
			                    ID: data.info.ID
			                }, function (data1) {
			                    var WorkShopID = data1.info.WorkShopID;
			                    window.JSImpl.SetCustomMap("StationID", data.info.ID);
			                    model.com.getStartTask({
			                        WorkShopID: WorkShopID, StationID: data.info.ID, EventID: window._eventID
			                    }, function (data2) {
			                        alert("上班打卡成功");
			                        model.com.refresh();
			                    });
			                });
			            });
			        }
			        if (window.JSImpl)
			            window.JSImpl.readQRCode('QRTEST',"请扫工位编码");
			        else
			            return false;
			    }
			    if (window._eventID == 5008) {
			        model.com.getStartTask({
			            WorkShopID: 0, StationID: 0, EventID: window._eventID
			        }, function (data2) {
			            alert("上班打卡成功");
			            model.com.refresh();
			        });
			    }
			    if (window._eventID == 4006) {
			        model.com.getStartTask({
			            WorkShopID: 0, StationID: 0, EventID: window._eventID
			        }, function (data2) {
			            alert("上班打卡成功");
			            model.com.refresh();
			        });
			    }
			    if (window._eventID == 3006) {
			        model.com.getStartTask({
			            WorkShopID: 0, StationID: 0, EventID: window._eventID
			        }, function (data2) {
			            alert("上班打卡成功");
			            model.com.refresh();
			        });
			    }
			    if (window._eventID == 2010) {
			        model.com.getStartTask({
			            WorkShopID: 0, StationID: 0, EventID: window._eventID
			        }, function (data2) {
			            alert("上班打卡成功");
			            model.com.refresh();
			        });
			    }
			});
            //下班打卡
			$("body").delegate("#check", "click", function () {
			    if (window._eventID == 1017){
			        window.QRTEST = function (str) {
			            if (!str || str.length <= 0)
			                return false;
			            model.com.getScan({
			                QRCode: str
			            }, function (data) {
			                model.com.getStation({
			                    ID: data.info.ID
			                }, function (data1) {
			                    var WorkShopID = data1.info.WorkShopID;
			                    window.JSImpl.SetCustomMap("StationID", data.info.ID);
			                    model.com.getStartTask({
			                        WorkShopID: WorkShopID, StationID: data.info.ID, EventID: window._eventID
			                    }, function (data2) {
			                        alert("下班打卡成功");
			                        model.com.refresh();
			                    });
			                });
			            });
			        }
			        if (window.JSImpl)
			            window.JSImpl.readQRCode('QRTEST', "请扫工位编码");
			        else
			            return false;
			    }
			    if (window._eventID == 5009) {
			        model.com.getStartTask({
			            WorkShopID: 0, StationID: 0, EventID: window._eventID
			        }, function (data2) {
			            alert("下班打卡成功");
			            model.com.refresh();
			        });
			    }
			    if (window._eventID == 4007) {
			        model.com.getStartTask({
			            WorkShopID: 0, StationID: 0, EventID: window._eventID
			        }, function (data2) {
			            alert("下班打卡成功");
			            model.com.refresh();
			        });
			    }
			    if (window._eventID == 3007) {
			        model.com.getStartTask({
			            WorkShopID: 0, StationID: 0, EventID: window._eventID
			        }, function (data2) {
			            alert("下班打卡成功");
			            model.com.refresh();
			        });
			    }
			    if (window._eventID == 2013) {
			        model.com.getStartTask({
			            WorkShopID: 0, StationID: 0, EventID: window._eventID
			        }, function (data2) {
			            alert("下班打卡成功");
			            model.com.refresh();
			        });
			    }
			});
		
		},

		run : function() {
		    model.com.refresh();
		},

		com : {
			getTaskPartPoint : function(data, fn, context) {
				var d = {
				    $URI: "/TaskHandle/AttendanceLog",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
            //打卡
			getStartTask: function (data, fn, context) {
			    var d = {
			        $URI: "/TaskHandle/Attend",
			        $TYPE: "post"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
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
		    //工位
			getStation: function (data, fn, context) {
			    var d = {
			        $URI: "/FMCStation/Info",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
		    //工厂
			getFactory: function (data, fn, context) {
			    var d = {
			        $URI: "/FMCFactory/Info",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
            //事业部
			getBusinessUnit: function (data, fn, context) {
			    var d = {
			        $URI: "/BusinessUnit/Info",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
            //车间
			getWorkShop: function (data, fn, context) {
			    var d = {
			        $URI: "/FMCWorkShop/Info",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
            //产线
			getLine: function (data, fn, context) {
			    var d = {
			        $URI: "/FMCLine/Info",
			        $TYPE: "get"
			    };
			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
            //设备
			getDevice: function (data, fn, context) {
			    var d = {
			        $URI: "/DeviceLedger/Info",
			        $TYPE: "get"
			    };
			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }
			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
            //备件
			getSpare: function (data, fn, context) {
			    var d = {
			        $URI: "/SpareLedger/Info",
			        $TYPE: "get"
			    };
			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }
			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
            //仓库
			getStock: function (data, fn, context) {
			    var d = {
			        $URI: "/ERPInterface/ERPStockAll",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
            //仓位
			getLocation: function (data, fn, context) {
			    var d = {
			        $URI: "/ERPInterface/ERPLocationAll",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
			refresh:function(){
			    model.com.getTaskPartPoint({
			        StationID: 0, EventID: window._eventID,
			    }, function (data) {
			        var list = data.list;
			        for (var i = 0; i < list.length; i++) {
			            if (list[i].Type == 2) {
			                list[i].Login = "上班打卡";
			            }
			            if (list[i].Type == 1) {
			                list[i].Login = "下班打卡";
			            }
			        }
			        $(".m-table").html($com.util.template(list, HTML.LIST));
			    });
			},
			filter : function(data) {

				$.each(data, function(i, item) {

					item.StatusText = STATUS[item.Status];
					item.Color = COLOUR[this.Status];

					var _cur = new Date();

					var _shiftID = Number($com.util.format("yyyyMMdd01", _cur))
					this.ShiftStatus = 0;
					while (this.ShiftID > _shiftID) {
						_shiftID = Number($com.util.format("yyyyMMdd01", new Date(_cur.getTime() + 86400000)));
						this.ShiftStatus++;
					}
					while (this.ShiftID < _shiftID) {
						_shiftID = Number($com.util.format("yyyyMMdd01", new Date(_cur.getTime() - 86400000)));
						this.ShiftStatus--;
					}

					this.ShiftText = ShiftText[this.ShiftStatus + 2];

					this.Shiftcolor = ShiftCOLOUR[this.ShiftStatus + 2];

				});

				return data;
			},

			
		}
	});
	model.init();
});

//# sourceMappingURL=maps/list-e9563bc81f.js.map