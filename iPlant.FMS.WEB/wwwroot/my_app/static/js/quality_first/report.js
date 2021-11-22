require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		BGModeText,
		ShiftText,
        STATUS,
        wID,
		ShiftCOLOUR;

	STATUS = ["未知", "保存", "下达", "开工", "完工", "暂停", "终止"];

	COLOUR = ["text-grey", "text-blue", "text-green", "text-yellow", "text-green", "text-grey", "text-grey"];
	HTML = {
	    LIST: ['<div class="ms-group clearfix" data-id="{{ID}}" data-mode="{{bGMode}}" data-shift="{{PartID}}" data-status="{{Status}}">',
			'<div class="ms-col ms-col-f" >',
			'<div class="ms-limit" >',
            '<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text">{{LineName}}</span>',
			'</span> <span>{{PartPointName}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">订单号:</span>',
			'<span class="ms-text">{{OrderNo}}</span></span>',
			'</span>',
			'</div>',
            //'<div class="ms-sub-title">',
			//'<span class="ms-field">',
			//'<span class="ms-label">激活:</span> <span class="ms-text">{{ActiveTime}}</span>',
            // '<span class="ms-field"><span class="ms-label">人员:</span>',
			//'<span class="ms-text">{{OperatorName}}</span> </span>',
			//'</span>',
			//'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">工序:</span>',
			'<span class="ms-text">{{PartName}}</span></span>',
			'<span class="ms-field"><span class="ms-label">规格:</span>',
			'<span class="ms-text">{{ProductNo}}</span> </span>',
			'</div>',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{StatusText}}</span>',
			'</div>',
			'</div>'].join(""),
	};

	model = $com.Model.create({
		name : '质量首检',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
		    $("body").delegate(".femi-search-fuzzy .femi-search-border input.femi-search-content", "input", function () {
		        //模糊查询
		        var $this = $(this),
                    value = $this.val();
		        if (!value || value.length < 1) {
		            $(".ms-group").show();
		        } else {
		            $(".ms-group").each(function (i, item) {
		                if ($(item).text().indexOf(value) > 0)
		                    $(item).show();
		                else
		                    $(item).hide();
		            });
		        }
		    });
	
			

			$("body").delegate(".ms-group", "click", function() {
			    var $this = $(this),
			     id = $this.attr("data-id");
			    ID = parseInt(id);
			    if (!window.JSImpl) {
			        window.location = "check.html?id=" + id;
			      
			    } else {
			        window.QRTEST = function (str) {
			            if (!str || str.length <= 0)
			                return false;
			            model.com.getScan({ QRCode: str }, function (res) {
			                wID = res.info.ID;
			                if (!res.info || !res.info.QRType || !res.info.ID) {
			                    alert("二维码识别失败，请检查是否扫描错误！");
			                } else {
			                    model.com.getCheck({ TaskStepID: ID, StationID: wID }, function (data) {
			                        if (data.info == true) {
			                            window.location = "check.html?id=" + id + "&GwID=" + wID;
			                        } else {
			                            alert("该工位不在此工序范围内，请重新扫码！")
			                        }

			                    })
			                }
			            });
			        }
			        window.JSImpl.readQRCode('QRTEST', "请扫工位码！");
			    }
			
			});
		},

		run : function() {
		    model.com.get({
		        StationID:0,
		        EventID: window._eventID ? window._eventID : 2002,
		    }, function (data) {
		        model.com.render(data.list);
		    });
		},

		com: {
		    get: function (data, fn, context) {
		        var d = {
		            $URI: "/TaskHandle/All",
		            $TYPE: "get"
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
		    //检查此工位是否在此工序任务范围
		    getCheck: function (data, fn, context) {
		        var d = {
		            $URI: "/SFCTaskIPT/CheckStation",
		            $TYPE: "get"
		        };
		        function err() {
		            $com.app.tip('获取失败，请检查网络');
		        }
		        $com.app.ajax($.extend(d, data), fn, err, context);
		    },
		    render: function (data) {
		        var wlist = [];
		        for (i = 0; i < data.length; i++) {
		            switch (data[i].Status) {
		                case 0:
		                    data[i].StatusText = "未知";
		                    data[i].Color = "text-grey";
		                    break;
		                case 1:
		                    data[i].StatusText = "保存";
		                    data[i].Color = "text-blue";
		                    break;
		                case 2:
		                    data[i].StatusText = "下达";
		                    data[i].Color = "text-green";
		                    break;
		                case 3:
		                    data[i].StatusText = "开工";
		                    data[i].Color = "text-yellow";
		                    break;
		                case 4:
		                    data[i].StatusText = "完工";
		                    data[i].Color = "text-green";
		                    break;
		                case 5:
		                    data[i].StatusText = "暂停";
		                    data[i].Color = "text-grey";
		                    break;
		                case 6:
		                    data[i].StatusText = "终止";
		                    data[i].Color = "text-grey";
		                    break;
		                default:
		                    break;
		            }
		            wlist.push(data[i]);
		        };
		        $(".m-table").html($com.util.template(wlist, HTML.LIST));
		    }
		}
	});

	model.init();

});
//# sourceMappingURL=maps/list-847d2ef23f.js.map