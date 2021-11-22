require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/echarts.min' ], function($yang, $com, $echart) {


	var model,
		HTML ,
		EchartOption,
		WORKSHOP={},
		LINE={},
		STATUS=[ "未知", "保存", "下达", "开工", "完工", "终止", "暂停" ],
		COLOUR=[ "text-grey", "text-grey", "text-yellow", "text-blue", "text-green", "text-grey", "text-red" ];

	var colors = ['#5793f3', '#d14a61', '#675bba'];
	EchartOption = {
		    color: colors,

		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'cross'
		        }
		    },
		    grid: {
		        right: '20%'
		    },
		    toolbox: {
		        feature: {
		            dataView: {show: true, readOnly: false},
		            restore: {show: true},
		            saveAsImage: {show: true}
		        }
		    },
		    legend: {
		        data:['报警时长','报警次数']
		    },
		    xAxis: [
		        {
		            type: 'category',
		            axisTick: {
		                alignWithLabel: true
		            },
		            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value',
		            name: '报警时长', 
		            position: 'left',
		            axisLine: {
		                lineStyle: {
		                    color: colors[0]
		                }
		            },
		            axisLabel: {
		                formatter: '{value} ml'
		            }
		        },
		        {
		            type: 'value',
		            name: '报警次数', 
		            position: 'right', 
		            axisLine: {
		                lineStyle: {
		                    color: colors[1]
		                }
		            },
		            axisLabel: {
		                formatter: '{value}'
		            }
		        },
		       
		    ],
		    series: [
		        {
		            name:'报警时长',
		            type:'bar',
		            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
		        },
		        {
		            name:'报警次数',
		            type:'bar',
		            yAxisIndex: 1,
		            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
		        },
		      
		    ]
		};

	HTML = {
	
		LIST : [ '<div class="ms-group clearfix" data-id="{{ID}}" data-state="{{status}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title"><span class="ms-field femi-rt">',
			'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text">{{LineName}}</span>',
			'</span><span>{{OrderNo}}{{PartName}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">计划数:</span><span class="ms-text">{{FQTY}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">排班数:</span><span class="ms-text">{{FQTYShift}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">完成数:</span><span class="ms-text">{{FQTYDone}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">合格数:</span><span class="ms-text">{{FQTYGood}}</span>',
			'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">产品规格:</span><span class="ms-text">{{ProductNo}}</span>',
			'</span>', 
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{StatusText}}</span>',
			'</div>',
			'</div>' ].join(""),
	};



	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			$("body").delegate("#href_oee", "click", function() {
				 
				window.location = "history.html?id=" + model.query.id;

			});
			
			
			$("body .m-table").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id");
				window.location = "iDetail.html?id=" + id ;

			});
			
			
		},

		run : function() {
			/*var myChart = $echart.init(document.getElementById('canvasDiv'));
			myChart.setOption(EchartOption);*/
			var _shift_id = 0; 
			if (window.JSImpl) {
				_shift_id = window._shift_id; 
			}
			
			model.com.getWorkShop({}, function(data) { 
				$.each(data.list, function(i, item) {
					WORKSHOP[item.ID]=item.WorkShopName; 
					$.each(item.lineList.aPSItem, function(l_i, l_item) {
						LINE[l_item.ID]=l_item.ItemName; 
					});

				});

			});
			
			this.com.get({
				WorkShopID:0,
				LineID:0,
				shift_id : _shift_id
			}, function(data) { 
				model.com.render(model.com.filter(data.list));
			});

		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/APSOrder/All",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			getWorkShop : function(data, fn, context) {
				var d = {
					$URI : "/WorkShop/All",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(list) {
			 
				
				var _list=[], cur=new Date().getTime();
				var i=0;
				$.each(list,function(){
					this.Color=COLOUR[this.status]||"text-grey";
					this.StatusText=STATUS[this.status]||this.status;
					this.WorkShopName=WORKSHOP[this.WorkShopID];
					this.LineName=LINE[this.LineID];
					
					if(cur>this.StartTime&&cur<this.FinishedTime||cur>this.StartTime&&this.StartTime>this.FinishedTime ){
						EchartOption.yAxis.data[i]=this.OrderNo+this.PartName;
						
						EchartOption.series[0].data[i]=this.FQTY;
						EchartOption.series[1].data[i]=this.FQTYShift;
						EchartOption.series[2].data[i]=this.FQTYDone;
						EchartOption.series[3].data[i]=this.FQTYGood ;
						EchartOption.series[4].data[i]=this.FQTYDone-this.FQTYGood;
						
						_list.push(this);
						
						i++;
					} 
					
				}); 
				return _list;
			},


			render : function(data) {
				var myChart = $echart.init(document.getElementById('canvasDiv'));
				myChart.setOption(EchartOption);
				 
				$(".m-table").html($com.util.template(data, HTML.LIST));
			}
		 
		}
	});

	model.init();

});
//# sourceMappingURL=maps/info-99f3e89c3d.js.map