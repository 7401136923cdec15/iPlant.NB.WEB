require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD_LIST,
		KEYWORD,
		STATUS;


	STATUS = [ "已下达", "待保养", "已完成", "已关闭", "已超时", "待激活" ];
	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),
		CAUSE : '<div class="m-detail-remark" style="margin-top:0;">{{Cause}}</div>',
		IMG : '<li class="upload-img"><img src="/upload/{{Src}}" alt="" data-id="{{Id}}"></li>'
	};

	KEYWORD_LIST = [
		"ItemText|保养项",
		"WorkShopName|车间",
		"LineName|产线",
		"DeviceNo|设备号",
		"Method|方法",
		"Standard|标准",
		"Operator|人员",
		"ActiveTimeText|激活时间",
		"Remark|保养描述"
	];

	KEYWORD = {};

	$.each(KEYWORD_LIST, function(i, item) {
		var detail = item.split("|");
		KEYWORD[detail[0]] = {
			index : i,
			name : detail[1]
		};
	});


	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			 
			$("#Repair").click(function() {
				window.location = "check.html?id=" + model.query.id;
			});
		},

		run : function() {
			this.com.get({
				task_id : model.query.id
			}, function(data) {
				model.com.render(model.com.filter(data.info));
			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/MaintenceDevice/TaskInfo",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
				 
				var _data = [],
				_img=[],
				_status = ""; 
			 
				data.ActiveTimeText = $com.util.format("yyyy-MM-dd hh:mm", data.ActiveTime);
				
				for (var p in data) { 
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : data[p] === "" ? "&nbsp;" : data[p]
						};
					}
				}  
				
				if(data.pictureList&&data.pictureList.trim().length>3){ 
					$.each(data.pictureList.split("|"), function(p_i, p_item) {
						_img.push({
							Src : p_item,
							Id : p_item
						});
					});
				}   
				_status=STATUS[data.ItemResult];
			 
				return {
					data : _data,
					status:_status,
					imgList : _img
				};
			},

			render : function(data) {
				$(".m-detail-list").html($com.util.template(data.data, HTML.LIST));
				$(".upload-list").html($com.util.template(data.imgList, HTML.IMG)); 
				$(".tip-content").html(data.status);
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/detail-13ca772d08.js.map