require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,  
		IsSubmit,
		KEYWORD_LIST,
		KEYWORD,
		STATUS;

	STATUS = [ "已下达", "待保养", "已完成", "已关闭", "已超时", "待激活" ];
	IsSubmit = false; 
 
	HTML = {
			LIST : [ '<li>',
				'<label class="m-detail-title">{{name}}</label>',
				'<div class="m-detail-content">{{value}}</div>',
				'</li>' ].join(""),
			CAUSE : '<div class="m-detail-remark">{{Cause}}</div>',
			IMG : '<li class="upload-img"><img src="/upload/{{Src}}" data-id="{{Id}}"></li>', 
		};

	KEYWORD_LIST = [
	    "ItemText|保养项",     
	    "WorkShopName|车间",            
		"LineName|产线", 
		"DeviceNo|设备号", 
		"Method|方法", 
		"Standard|标准", 
		"Operator|人员",
		"ActiveTimeText|激活时间"
	];
 
	KEYWORD={};
	
	$.each(KEYWORD_LIST,function(i, item) {
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
			$("#back").click(function() {
				window.history.back(); 
			});

			$("body").delegate("#confirm", "click", function(e) {
				model.com.addCheck();
			});

			 
			$(".m-c-panel .upload-btn input").on("change", function() {
				var self = this,
					_data = self.files[0];

				if (_data) {
					if (_data.size > (1024 * 1024 * 10)) {
						alert("请上传小于10M的图片！");
						clearFiles();
						return;
					}

					if (!extLimit([ 'jpg', 'png', 'gif', 'bmp', 'jpeg' ]).has(_data.name)) {
						alert("请上传正确的图片！");
						clearFiles();
						return;
					}

					var form = new FormData();
					form.append("file", _data);

					$.ajax({ //
						url : "/Upload/Submit",
						type : "POST",
						data : form,
						processData : false,
						contentType : false,
						dataType : "JSON"
					}).done(function(data) {

						if (data.resultCode === 1000) {
							var $p = $(self).parent();
							$p.before($com.util.template({
								Src : data.returnObject.file_url,
								Id : data.returnObject.file_id
							}, HTML.IMG));
							/*if (!window.FileReader) {
								var CSS = {
									background : "background:url("+ data.returnObject.url +") no-repeat center;",
									size : "background-size:cover;"
								};
								myData.head_img = data.returnObject.url;
								$("#upload-img").attr("style", CSS.background + CSS.size);
								$(".btn-upload").remove();
							} else {
								var reader = new FileReader();
								//将文件以Data URL形式读入页面，解决ios图片不显示bug
								reader.readAsDataURL(_data);
								reader.onload = function (e) {
									var CSS = {
										background : "background:url("+ this.result +") no-repeat center;",
										size : "background-size:cover;"
									};
									myData.head_img = data.returnObject.url;
									$("#upload-img").attr("style", CSS.background + CSS.size);
									$(".btn-upload").remove();
								};
							}*/

						} else {
							alert("上传失败，请重新再试");
						}

						clearFiles();
					});
				}

				function clearFiles() {
					self.value = "";
				}

				function extLimit(exts) {
					return {
						has : function(file) {
							var arr = file.split("."),
								ext = arr[arr.length - 1].toLowerCase();

							return exts.indexOf(ext) > -1 ? true : false;
						}
					};
				}
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

			add : function(data, fn, context) {
				var d = {
					$URI : "/MaintenceDevice/SaveItem",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
			 
				var _data = [],
				_status = ""; 
			 
				data.ActiveTimeText = $com.util.format("yyyy-MM-dd hh:mm", data.ActiveTime);
				
				data.imgs = [];
				
				if(data.pictureList&&data.pictureList.trim().length>3){ 
					$.each(data.pictureList.split("|"), function(p_i, p_item) {
						data.imgs.push({
							Src : p_item,
							Id : p_item
						});
					});
				}  
				
				for (var p in data) { 
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : data[p] === "" ? "&nbsp;" : data[p]
						};
					}
				}  
				_status=STATUS[data.ItemResult];
				model._data =data; 
				return {
					data:data,
					list:_data,
					status : _status 
				};
			},

			render : function(data) {
				$(".m-detail-list").html($com.util.template(data.list, HTML.LIST));

				if (data.remark)
					$("#desc").html(data.data.remark);

				$(".upload-list").prepend($com.util.template(data.data.imgs, HTML.IMG));
			},

			addCheck : function() {
				if (IsSubmit)
					return;
				var md = model._data,
					 
					$node,
					val;
 
				md.ItemResult = 2; 
				
				md.remark = $("#desc").val();
				$node = $(".upload-list .upload-img img");
  
				md.imgs.splice(0,md.imgs.length);
				$node.each(function() {
					md.imgs.push($(this).attr("data-id"));
				});
				md.pictureList=md.imgs.join("|");
				if(md.pictureList.length<=3){
					md.pictureList="MES";
				}
				if (confirm("确认提交吗？")) {
					IsSubmit = true;
					model.com.add({data:md}, [function(res) {
						IsSubmit=false;
						alert("提交成功");
						window.location = "detail.html?id=" + model.query.id;
					},function(){
						IsSubmit=false;
					}]);
				}
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/check-a434cc7332.js.map