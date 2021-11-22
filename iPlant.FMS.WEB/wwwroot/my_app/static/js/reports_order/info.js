require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/echarts.min' ], function($yang, $com, $echart) {


	var model,
		HTML ,
		EchartOption,
		WORKSHOP={},
		LINE={},
		STATUS=[ "未知", "保存", "下达", "开工", "完工", "终止", "暂停" ],
		COLOUR=[ "text-grey", "text-grey", "text-yellow", "text-blue", "text-green", "text-grey", "text-red" ];

 
	EchartOption = {
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    legend: {
		        data: ['计划数', '排班数','完成数','合格数','不合格数'] //确定的数量
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis:  {
		        type: 'value'
		    },
		    yAxis: {
		        type: 'category',
		        data: ['周一','周二','周三','周四','周五','周六','周日'] //不确定 动态添加
		    },
		    series: [
		        {
		            name: '计划数',
		            type: 'bar',
		            stack: '总量',
		            label: {
		                normal: {
		                    show: true,
		                    position: 'insideRight'
		                }
		            },
		            itemStyle:{
		            	color:"#2f4554"
		            },
		            data: [320, 302, 301, 334, 390, 330, 320]
		            
		        },
		        {
		            name: '排班数',
		            type: 'bar',
		            stack: '总量',
		            label: {
		                normal: {
		                    show: true,
		                    position: 'insideRight'
		                }
		            },
		            itemStyle:{
		            	color:"#d48265"
		            },
		            data: [120, 132, 101, 134, 90, 230, 210]
		        },
		        {
		            name: '完成数',
		            type: 'bar',
		            stack: '总量',
		            label: {
		                normal: {
		                    show: true,
		                    position: 'insideRight'
		                }
		            },
		            itemStyle:{
		            	color:"#61a0a8"
		            },
		            data: [220, 182, 191, 234, 290, 330, 310]
		        },
		        {
		            name: '合格数',
		            type: 'bar',
		            stack: '总量',
		            label: {
		                normal: {
		                    show: true,
		                    position: 'insideRight'
		                }
		            },
		            itemStyle:{
		            	color:"#91c7ae"
		            },
		            data: [150, 212, 201, 154, 190, 330, 410]
		        },
		        {
		            name: '不合格数',
		            type: 'bar',
		            stack: '总量',
		            label: {
		                normal: {
		                    show: true,
		                    position: 'insideRight'
		                }
		            },
		            itemStyle:{
		            	color:"#c23531"
		            },
		            data: [820, 832, 901, 934, 1290, 1330, 1320]
		        }
		    ]
		};

	HTML = {
	
		LIST : [ '<div class="ms-group clearfix" data-id="{{ID}}" data-state="{{Status}}">',
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
						LINE[l_item.ID]=l_item.itemName; 
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
					this.Color=COLOUR[this.Status]||"text-grey";
					this.StatusText=STATUS[this.Status]||this.Status;
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