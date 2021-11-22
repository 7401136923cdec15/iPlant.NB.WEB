require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	//需要引用bootstrap的就添加一个url:'../static/utils/js/base/bootstrap' 参数 BS  然后先执行BS();
	//需要用动态表单的添加 '../static/utils/js/base/entry' 参数	 iForm 

	var model,
		HTML,
		STATUS,
		COLOUR;

	STATUS = [ "在线", "在岗"];
	

	COLOUR = [ "text-blue", "text-green"];
 

	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{ID}}" >',
			'<div class="ms-col ms-col-f">',
			'<div class="ms-limit">',
			'<div class="ms-title">',
			'<span>{{Name}}</span>',
			'<span class="ms-field femi-rt" >{{ShiftOfflineTimeText}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"> <span class="ms-label">部门:</span>',
			'<span class="ms-text">{{Department}}</span>',
			'</span> <span class="ms-field"> <span class="ms-label">岗位:</span>',
			'<span class="ms-text">{{Position}}</span>',
			'</span>',
			'</span> <span class="ms-field"> <span class="ms-label">在线:</span>',
			'<span class="ms-text">{{ShiftOnlineTimesText}}</span>',
			'</span>',
			'</div> ',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{Status}}</span>',
			'</div>',
			'</div>' ].join("")
	};

	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {

			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id");

				window.location = "info.html?id=" + id;

			});


		},

		run : function() {

			model.com.get({
			}, function(data) {
				model.com.render(model.com.filter(data.list));
			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/RealWorker/All",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {

				var _data=[];
				$.each(data, function(i, item) {
					if(item.online!=1)
						return true;
					
					item.onShift=item.onShift?1:0;
					
					item.ShiftOnlineTimesText=$com.util.ChangeSecondToString(item.ShiftOnlineTimes);
					item.Status = STATUS[item.onShift?1:0];
					item.ShiftOfflineTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.ShiftOfflineTime );
					item.Color = COLOUR[this.onShift];
					_data.push(item);
				});
				return _data;
			},

			render : function(data) {
				$(".m-table").html($com.util.template(data, HTML.LIST));
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/list-565942f460.js.map