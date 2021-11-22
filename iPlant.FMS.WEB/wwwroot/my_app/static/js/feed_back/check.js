require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		IsSubmit;
	IsSubmit = false;

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{bool}}{{cause}}</div>',
			'</li>' ].join(""),
		CAUSE : '<div class="m-detail-remark">{{Cause}}</div>',
		IMG : '<li class="upload-img"><img src="/upload/{{Src}}" data-id="{{Id}}" ></li>',
		IPT : [ '<label class="radio-item" style="padding: 3vw 4vw 0 4vw;display:block;" for="zz{{ID}}">',
			'<div class="m-checkbox-box">',
			'<input type="checkbox" name="item2" data-id="{{ID}}" data-cause="{{Cause}}" id="zz{{ID}}">',
			'<label for="zz{{ID}}"></label></div><span>{{Cause}}</span></label>' ].join("")
	};

	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			//保存提交


			$("body").delegate("#confirm", "click", function(e) {
				model.com.addCheck(e);
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

		run : function() {},

		com : {
			add : function(data, fn, context) {
				var d = {
					$URI : "/HomePage/FeedBack",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			addCheck : function(e) {
				var data = {
						"Remark" : "",
						"path" : "",
						"Tel" : "",
						"main" : ""
					},
					$node;

				if (IsSubmit)
					return;

				data.Remark = $("#desc").val();
				data.Tel = $("#Telphone").val();
				data.main = $("#mainHead").val();

				if (data.Remark === "") {
					alert("请输入描述");
					close();
					return;
				}
				if (data.Tel === "") {
					alert("请输入电话号码");
					close();
					return;
				}
				if (data.main === "") {
					alert("请输入主题");
					close();
					return;
				}
				$node = $(".upload-list .upload-img img");

				if ($node.length === 0) {
					alert("请上传截屏");
					close();
					return;
				}

				$node.each(function() {
					data.path += "|" + ($(this).attr("data-id"));
				});

				data.path = data.path.substr(1);

				if (confirm("确认提交吗？")) {
					IsSubmit = true;
					model.com.add(data, [ function(res) {
						IsSubmit = false;

						alert("提交成功");
						window.JSImpl.exit();

					}, function() {
						IsSubmit = false;
					} ]);
				}
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/check-a434cc7332.js.map