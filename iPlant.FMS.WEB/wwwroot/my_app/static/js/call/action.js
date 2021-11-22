require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {



    var model,
		HTML,
		config,
		select_data,
		myScore = {},
		LETTER,
		 IsSubmit;
    IsSubmit = false;

    select_data = [];

    HTML = {

        TYPE: ['<li>',
			'<label class="col-flex clearfix" for="{{Sign}}">',
			'<div class="col-item">',
			'<span>{{Name}}</span>',
			'</div>',
			'<div class="col-item">',
			'<div class="m-checkbox-box">',
			'<input type="radio" name="device" id="{{Sign}}">',
			'<label for="{{Sign}}"></label>',
			'</div>',
			'</div>',
			'</label>',
			'</li>'].join(""),

        IMG: '<li class="upload-img"><img src="/upload/{{Src}}" data-id="{{Id}}"></li>',
    };

    model = $com.Model.create({
        name: 'iPlantApp',

        type: $com.Model.MAIN,

        data: {},

        configure: function () {
            this.run();
        },

        events: function () {
            $("#back").click(function () {

                if (window.history.length > 0) {
                    window.history.back();
                }
                else {
                    window.location = "list.html";
                }
            });
          
            $("#imagesUpload.m-c-panel .upload-btn input").on("change", function () {
                var self = this,
					_data = self.files[0];

                if (_data) {
                    if (_data.size > (1024 * 1024 * 10)) {
                        alert("请上传小于10M的图片！");
                        clearFiles();
                        return;
                    }

                    if (!extLimit(['jpg', 'png', 'gif', 'bmp', 'jpeg']).has(_data.name)) {
                        alert("请上传正确的图片！");
                        clearFiles();
                        return;
                    }

                    var form = new FormData();
                    form.append("file", _data);

                    $.ajax({ //
                        url: "/api/Upload/Submit",
                        type: "POST",
                        data: form,
                        processData: false,
                        contentType: false,
                        dataType: "JSON"
                    }).done(function (data) {

                        if (data.resultCode === 1000) {
                            var $p = $(self).parent();
                            $p.before($com.util.template({
                                Src: data.returnObject.file_id,
                                Id: data.returnObject.file_id
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
                        has: function (file) {
                            var arr = file.split("."),
								ext = arr[arr.length - 1].toLowerCase();

                            return exts.indexOf(ext) > -1 ? true : false;
                        }
                    };
                }
            });


            $("#commit").click(function () {
                if (IsSubmit)
                    return;
                if (model.query.TypeID == 6 && model._data.Forwarder <= 0) {
                    alert("请选择转发对象");
                    return;
                }
                model._data.Comment = $("#desc").val();
                $("#imagesUpload ul.upload-list li.upload-img img").each(function (i, item) {
                    var $Image = $(item),
                        Src = $Image.attr("data-id");
                    if (!model._data.ImageList)
                        model._data.ImageList = [];
                    model._data.ImageList.push(Src);
                });

                model._data.ID = 0;


                confirm("确认提交吗？", function (bool) {
                    if (!bool)
                        return;
                    IsSubmit = true;
                    model.com.add({ data: model._data }, [function () {
                        alert("提交成功！");
                        window.location = "list.html";
                        IsSubmit = false;
                    }, function () {
                        IsSubmit = false;
                    }]);
                });
            });

            //若为转发 则选择转发对象
            $("body").delegate("#callOperation .m-c-body", "click", function () {
                var $this = $(this),
                   SelectID = model._data.Forwarder,
                   DATA = {
                       list: model._user,
                       title: "转发对象选择",
                       PropertyID: "ID",
                       PropertyName: "Name",
                       PropertyGroupName: "Department",
                       PropertyGroupID: "DepartmentID",
                       mode: 1,
                       allowEmpty: false,
                       SelectName: ""
                   },
                   selected = [];

                if (SelectID && SelectID > 0) {
                    selected.push(SelectID);
                }

                DATA.list = $com.util.findAll(DATA.list, function (element) {
                    return element.ID != model.query.ApplicantID
                        && element.ID != model.query.ConfirmID
                        && element.ID != model.query.OperatorID;
                });

               // selected = _exType.OperatorIDList;


                $com.choosePage.show(DATA, selected, function (IDList, NameList) {

                    if (!IDList || IDList.length < 1) {
                        return false;
                    }
                    model._data.Forwarder = IDList[0];
                    $this.find("input.w-option-content").val(model._employee[IDList[0]]);
                    $this.find("input.w-option-content").attr("data-value", IDList[0])

                });
            });

        },

        run: function () {
            $com.app.loading();
            $(".m-menu .m-title span").html(model.query.TypeName);

            $("#ex_type .m-c-body .w-option-content").html(model.query.ExceptionTypeName);
            $("#station_type .m-c-body .w-option-content").html(model.query.StationTypeName);
            $("#station_act .m-c-body .w-option-content").html(model.query.StationNo);


            model._data = {
                ID: 0,
                TaskID: model.query.id,
                ActionType: model.query.TypeID,
                CompanyID: 0,
                OperatorID: 0,
                DispatchID: model.query.sid,
                Forwarder: 0,
                Comment: "",
                ImageList: [],
            };
            if (model.query.TypeID == 6) {
                $("#callOperation").show();
            }

            model.com.getEmployee({ Active: 1 }, function (data) {
                model._user = data.list;

                model._employee = {};

                $.each(model._user, function (i, item) {
                    model._employee[item.ID] = item.Name;
                });
                $com.app.loaded();
            });
        },

        com: {

            getEmployee: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取人员信息失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            add: function (data, fn, context) {
                var d = {
                    $URI: "/EXCCallAction/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
             
        }
    });

    model.init();
});
//# sourceMappingURL=maps/CallForward-f8bd41a403.js.map