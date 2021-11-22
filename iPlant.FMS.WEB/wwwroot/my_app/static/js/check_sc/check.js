require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		LETTER,
		IsSubmit;

	IsSubmit = false;
	current = "Status_Sent";
 

	//padding: 3vw 4vw 0 4vw;

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{Name}}</label>',
			'<div class="m-detail-content">{{Bool}}{{Cause}}</div>',
			'</li>' ].join(""),
		CAUSE : '<div class="m-detail-remark">{{Cause}}</div>',
		IMG : '<li class="upload-img"><img src="/upload/{{Src}}" data-id="{{Id}}"></li>',
		IPT : [ '<label class="radio-item" style="padding: 3vw 4vw 0 4vw;display:block;" for="zz{{ID}}">',
			'<div class="m-checkbox-box">',
			'<input type="checkbox" name="item2" {{Checked}} data-id="{{ID}}" data-cause="{{Name}}" id="zz{{ID}}">',
			'<label for="zz{{ID}}"></label></div><span>{{Name}}</span></label>' ].join("")
	};

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

					if (!extLimit([ 'jpg', 'png', 'gif', 'bmp', 'jpeg' ]).has(_data.Name)) {
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

						if (data.ResultCode === 1000) {
							var $p = $(self).parent();
							$p.before($com.util.template({
								src : data.returnObject.file_url,
								id : data.returnObject.file_id
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

			$("#item1 input").change(function() {
				var $this = $(this),
					state = $this.attr("data-value");

				if (state == "1") {
					$("#item2").hide();
				} else {
					$("#item2").show();
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
					$URI : "/PointCheck/TaskInfo",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			add : function(data, fn, context) {
				var d = {
					$URI : "/PointCheck/SaveItem",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
				var _data;
				$.each(data.itemList.dMSIPTItem, function(i, item) {
					if (item.ItemID == model.query.sid) {
					
						item.Imgs = [];
						
						if(item.PictureList&&item.PictureList.trim().length>3){ 
							$.each(item.PictureList.split("|"), function(p_i, p_item) {
								item.Imgs.push({
									src : p_item,
									id : p_item
								});
							});
						} 
						
						$.each(item.unreadyList.dMSItem, function(d_i, d_item) {
							d_item.checked = d_item.result ? "checked" : "";
						})
						model._data = _data = item;
					}
				});

				return _data;
			},

			render : function(data) {
				$("#item1 .m-c-head").text(data.itemText);
				//$("#item1 input").attr("data-id", data.CheckSheet.CheckSubItemList[0].ID); 

				//$("#item2 input").attr("data-id", data.CheckSheet.CheckSubItemList[0].ID);
				$("#item2 .m-c-body").html($com.util.template(data.unreadyList.dMSItem, HTML.IPT));

				if (data.remark)
					$("#desc").html(data.remark);

				$(".upload-list").prepend($com.util.template(data.imgs, HTML.IMG));
			},

			addCheck : function() {
				if (IsSubmit)
					return;
				var md = model._data,
					 
					$node,
					val;

				$node = $("#item1 input:checked");
				md.itemResult = Number($node.attr("data-value"));

				if (md.itemResult === 2) {
					$node = $("#item2 input:checked");

					md.unreadyList.dMSItem.splice(0,md.unreadyList.dMSItem.length);
					$node.each(function(i,item) { 
						md.unreadyList.dMSItem.push({
							ID : $(this).attr("data-id"),
							Name : $(this).attr("data-cause"),
							Result:true
						});
					});
				}


				md.remark = $("#desc").val();

				/*if (val === "") {
					alert("请输入描述");
					close();
					return;
				} else {
					data.Remark = val;
				}*/

				$node = $(".upload-list .upload-img img");

				/*if ($node.length === 0) {
					alert("请上传图片");
					close();
					return;
				}*/

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
						window.location = "item.html?id=" + model.query.id;
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