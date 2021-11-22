require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    var model,
		HTML,
		config,
		select_data,
		myScore = {},
		LETTER,
		formModel,
        IsSubmit,
		QRTYPE;

    IsSubmit = false;

    select_data = [];

    QRTYPE = ["默认", "事业部", "工厂", "车间", "产线", "工位", "仓库", "仓位", "设备", "备件"];

    HTML = {

        TR: ['<tr class="table-tr-m" data-value="{{EXCTypeID}}"  data-n-value="{{EXCTypeName}}" >',
                '<td width="30%" class="ex_type_choose">{{EXCTypeName}}</td>',
                '<td width="40%" class="ex_dispatch_choose">{{OperatorNameString}}</td>',
                '<td width="20%" class="ex_confirm_choose">{{ConfirmName}}</td>',
                '<td width="10%" class="ex_type_remove"><i class="icon icon-remove"></i></td>',
            '</tr>'].join(""),


        IMG: '<li class="upload-img"><img src="/upload/{{Src}}" data-id="{{Id}}"></li>',


        DIALOGS: {
            SELECT: ['<div class="multi-box {{sid}}" style="display:block;">',
				'<div class="multi-select clearfix">',
				'<div class="multi-bg">',
				'<ul>{{list}}</ul>',
				'</div>',
				'</div>{{btn}}',
				'</div>'].join(""),
            S_CHECKBOX: ['<li>',
				'<label class="col-flex clearfix" for="S_CHECKBOX{{key}}">',
				'<div class="col-item">',
				'<span>{{value}}</span>',
				'</div>',
				'<div class="col-item">',
				'<div class="m-checkbox-box">',
				'<input type="checkbox" {{disabled}} name="CHECKBOX" data-value="{{key}}" data-name="{{value}}" id="S_CHECKBOX{{key}}">',
				'<label for="S_CHECKBOX{{key}}"></label>',
				'</div>',
				'</div>',
				'</label>',
				'</li>'].join(""),
            S_RADIO: ['<li>',
				'<label class="col-flex clearfix" for="S_RADIO{{key}}">',
				'<div class="col-item">',
				'<span>{{value}}</span>',
				'</div>',
				'<div class="col-item">',
				'<div class="m-checkbox-box">',
				'<input type="radio" {{disabled}} name="RADIO" data-value="{{key}}" data-name="{{value}}" id="S_RADIO{{key}}">',
				'<label for="S_RADIO{{key}}"></label>',
				'</div>',
				'</div>',
				'</label>',
				'</li>'].join(""),
            BTN: {
                CLOSE: ['<div class="multi-btn">',
					'<a href="javascript:;" class="btn btn-primary confirm">{{btn}}</a>',
					'</div>'].join(""),
                CONFIRM: ['<div class="multi-btn clearfix">',
					'<div class="multi-flex">',
					'<a href="javascript:;" class="btn close">取消</a>',
					'</div>',
					'<div class="multi-flex">',
					'<a href="javascript:;" class="btn btn-primary confirm">确定</a>',
					'</div>',
					'</div>'].join("")
            }
        },

    };

    model = $com.Model.create({
        name: '新建呼叫',

        type: $com.Model.MAIN,

        data: {},

        configure: function () {
            this.run();
        },

        events: function () {

            function split2Object(d) {
                var arr = [],
					data = d.split("],["),
					i = -1,
					len = data.length;

                while (++i < len) {
                    var _item = data[i].split("]=[]=[");
                    arr.push({
                        key: _item[0],
                        value: _item[1]
                    });
                }

                return arr;
            }

            $("#back").click(function () {
                if (window.history.length > 0) {
                    window.history.back();
                }
                else {
                    window.location = "list_r.html";
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

            // 多选
            $("body").delegate(".m-c-panel[mode=n-select-checkbox] .m-c-body", "click", function (e) {
                var $self = $(this),
					list = split2Object($self.attr("value-list")),
					selected = $self.find(".w-option-content").attr("data-value"),
					str = "",
					$box = null;

                $.each(list, function (i, item) {
                    item.disabled = "";
                    str += $com.util.template(item, HTML.DIALOGS.S_CHECKBOX);
                });

                $box = $com.util.template({
                    list: str,
                    sid: "bindOne",
                    btn: $com.util.template({
                        btn: "确认"
                    }, HTML.DIALOGS.BTN.CONFIRM)
                }, HTML.DIALOGS.SELECT);

                $box = $($box);

                $("body").append($box);

                selected = selected ? selected.split(",") : [];
                $.each(selected, function (i, item) {
                    //$box.find("input[data-value="+ item  +"]").prop("checked", true);
                    $box.find("input").each(function () {
                        var $this = $(this);

                        if ($this.attr("data-value") == item) {
                            $this.prop("checked", true);
                        }
                    });
                });

                $box.find(".confirm").on("click", function () {
                    var _v = [],
						_name = [];
                    var $checked = $box.find("input:checked");

                    if ($checked.length === 0) {
                        alert("请选择");
                        return;
                    }

                    $box.find("input:checked").each(function () {
                        _v.push($(this).attr("data-value"));
                        _name.push($(this).attr("data-name"));
                    });

                    $self.find(".w-option-content")
						.attr("data-value", _v.join("],["))
						.text(_name)
						.addClass("text-darkgrey2");

                    $(this).unbind("click");
                    $box.remove();
                });

                $box.find(".close").on("click", function () {
                    $box.find(".confirm").off("click");
                    $(this).off("click");
                    $box.remove();
                });

                // 弹出层隐藏
                $(".bindOne").on("click", function (e) {
                    var tar = $(e.target);

                    if (tar.hasClass("multi-select")) {
                        $box.find(".confirm").unbind("click");
                        tar.parent().remove();
                        $(this).off("click");
                    }
                });
            });

            // 单选
            $("body").delegate(".m-c-panel[mode=n-select-radio] .m-c-body", "click", function (e) {
                var $self = $(this),
					list = split2Object($self.attr("value-list")),
					selected = $self.find(".w-option-content").attr("data-value"),
					$group_item = $self.closest(".list-group-item"),
					$result = $group_item.find(".actual-result"),

					str = "",
					$box = null;

                $.each(list, function (i, item) {
                    item.disabled = "";
                    str += $com.util.template(item, HTML.DIALOGS.S_RADIO);
                });

                $box = $com.util.template({
                    list: str,
                    sid: "bindOne",
                    btn: $com.util.template({
                        btn: "确认"
                    }, HTML.DIALOGS.BTN.CONFIRM)
                }, HTML.DIALOGS.SELECT);

                $box = $($box);

                $("body").append($box);

                selected = selected ? selected.split(",") : [];
                $.each(selected, function (i, item) {
                    //$box.find("input[data-value="+ item +"]").prop("checked", true);
                    $box.find("input").each(function () {
                        var $this = $(this);

                        if ($this.attr("data-value") == item) {
                            $this.prop("checked", true);
                        }
                    });
                });

                $box.find(".confirm").on("click", function () {
                    var _v = [],
						_name = [];
                    var $checked = $box.find("input:checked");

                    if ($checked.length === 0) {
                        alert("请选择");
                        return;
                    }

                    $box.find("input:checked").each(function () {
                        _v.push($(this).attr("data-value"));
                        _name.push($(this).attr("data-name"));
                    });



                    $self.find(".w-option-content")
						.attr("data-value", _v.join("],["))
						.text(_name)
						.addClass("text-darkgrey2");

                    $(this).unbind("click");
                    $box.remove();
                });

                $box.find(".close").on("click", function () {
                    $box.find(".confirm").off("click");
                    $(this).off("click");
                    $box.remove();
                });

                // 弹出层隐藏
                $(".bindOne").on("click", function (e) {
                    var tar = $(e.target);

                    if (tar.hasClass("multi-select")) {
                        $box.find(".confirm").unbind("click");
                        tar.parent().remove();
                        $(this).off("click");
                    }
                });
            })

            $("#commit").click(function () {


                //数据填入model._data
                model._data.Comment = $("#desc").val();
                model._data.RespondLevel = Number($("#level .w-option-content").attr("data-value"));

                model._data.OnSite = $("#present .w-option-content").attr("data-value") == "1" ? true : false;
                model._data.DisplayBoard = $("#showBoard .w-option-content").attr("data-value") == "1" ? true : false;
                $("#imagesUpload ul.upload-list li.upload-img img").each(function (i, item) {
                    var $Image = $(item),
                        Src = $Image.attr("data-id");
                    if (!model._data.ImageList)
                        model._data.ImageList = [];
                    model._data.ImageList.push(Src);
                });

                //检查数据填写完全
                if (!model._data || !model._data.StationNo) {
                    alert("数据获取不完全，请退出后再试！");
                    return;
                }

                if (!model._data.ExceptionTypeList || model._data.ExceptionTypeList.length < 1) {
                    alert("请选择异常类型");
                    return;
                }
                if (model._data.Comment === "") {
                    alert("请输入呼叫内容");
                    return;
                }
                if (model._data.RespondLevel <= 0) {
                    alert("请选择相应级别");
                    return;
                }

                model._data.ApproverID = (model._approver && model._approver.length > 0)
                    ? model._approver[0] : model._data.ApplicantID;

                model._data.ConfirmID = model._data.ApplicantID;

                model.com.commit(model._data)

            });


            $("body").delegate("#exType.m-c-panel .m-c-body.m-c-ring.clearfix", "click", function () {

                setTimeout(function () {
                    $(".ex-type-choose-page").removeClass("femi-next");

                    // $(".ex-type-choose-page").css("left", 0);
                }, 100);

                if (!model._data)
                    model._data = {};

                if (!model._data.ExceptionTypeList)
                    model._data.ExceptionTypeList = [];


                model.ex_types = $com.util.Clone(model._data.ExceptionTypeList);
                model.com.renderExType(model.ex_types);

            });
            //异常确认操作 将选择的数据带回源界面
            $("body").delegate("#confirm_ex", "click", function () {
                var $this = $(this),
                   $page = $this.closest(".femi-contain-page");

                model._data.ExceptionTypeList = $com.util.Clone(model.ex_types);

                var _TypeNames = [];

                var _IsOwn = true;
                $.each(model._data.ExceptionTypeList, function (i, item) {
                    if (!item.OperatorIDList
                        || item.OperatorIDList.length < 1
                        || item.ConfirmID < 1)
                        _IsOwn = false;
                    _TypeNames.push(item.EXCTypeName);
                });
                if (!_IsOwn) {
                    alert("异常对应的接收人或确认人未完全选择填入！")
                    return;
                }
                if (_TypeNames.length > 0) {
                    $("#exType .m-c-body .w-option-content")
                       .attr("data-value", _TypeNames.join("],["))
                       .text(_TypeNames.join(","))
                       .addClass("text-darkgrey2");
                } else {
                    $("#exType .m-c-body .w-option-content")
                      .attr("data-value", _TypeNames.join("],["))
                      .text("请选择")
                      .removeClass("text-darkgrey2");
                }


                setTimeout(function () {
                    $page.addClass("femi-next");

                }, 100);

            });

            //页面内返回 不做任何操作
            $("body").delegate(".view .page-back", "click", function () {
                var $this = $(this),
                    $page = $this.closest(".femi-contain-page");

                confirm("返回将放弃所有更改，是否返回？", function (res) {
                    if (res)
                        setTimeout(function () {
                            $page.addClass("femi-next");
                        }, 100);
                });
            });

            //添加异常类型 先选择异常类型  然后表格数据添加一行
            $("body").delegate(".ex-type-table tr.table-tr-m .ex_type_add", "click", function () {
                var $this = $(this),
                    $table = $this.closest("table"),
                    $tbody = $table.children("tbody");
                  
                var DATA = {
                    list: model._exTypeList,
                    title: "异常类型选择",
                    PropertyID: "ID",
                    PropertyName: "Name",
                    PropertyGroupName: "StationTypeName",
                    PropertyGroupID: "StationType",
                    mode: 1,
                    allowEmpty: true,
                },
                selected = [];

                if (model.ex_types && model.ex_types.length > 0) {
                    DATA.list = $com.util.findAll(DATA.list, function (element) {
                        return ($com.util.findIndex(model.ex_types, function (_type) {
                            return _type.EXCTypeID == element.ID;
                        }) < 0);
                    })
                }

                $com.choosePage.show(DATA, selected, function (IDList, NameList) {

                    if (!NameList || NameList.length <= 0) {
                        return false;
                    }
                    $com.app.loading();

                    if (!model.ex_types)
                        model.ex_types = [];

                  

                    var _exType = {
                        EXCTypeID: 0,
                        EXCTypeName: NameList[0],
                        DutyPositionID: [],
                        ConfirmPositionID: 0,
                        ConfirmID: model._data.ApplicantID,
                        ConfirmName: model._employee[model._data.ApplicantID],
                        OperatorIDList: [],
                        OperatorNameList: [],
                        OperatorNameString: "",
                        ApproverPositionID: 0,
                    };

                    if ($com.util.findIndex(model.ex_types, function (element) {
                      return element.EXCTypeName == _exType.EXCTypeName;
                    }) >= 0) {
                        alert("已存在相同的异常类型，无法再次添加！");
                        return;
                    }

                    if (IDList && IDList.length > 0) {
                        var _Info = $com.util.find(DATA.list, function (element, index, array) {
                            return element.ID == IDList[0];
                        });
                        if (_Info) {
                            _exType.EXCTypeID = _Info.ID;
                            _exType.DutyPositionID = _Info.DutyPositionID;
                            _exType.ConfirmPositionID = _Info.ConfirmPositionID;
                            _exType.ApproverPositionID = _Info.ApproverPositionID;
                        }
                    }
                     
                    model.ex_types.push(_exType);

                    if (_exType.EXCTypeID > 0) {
                        model.com.getDutyEmployee({ ExceptionType: _exType.EXCTypeID }, function (res) {

                            _exType.ConfirmID = res.info.Confirmer.ID;
                            _exType.ConfirmName = res.info.Confirmer.Name;
                            //_exType.ConfirmName = res.info.Confirmer.Name;

                            if (res.info.ResponserList) {
                                $.each(res.info.ResponserList, function (i, item) {
                                    _exType.OperatorIDList.push(item.ID);
                                    _exType.OperatorNameList.push(item.name)
                                });
                                _exType.OperatorNameString = _exType.OperatorNameList.join(",");
                            }

                            if (!model._approver)
                                model._approver = {};
                            if (res.info.Approver.ID
                                && res.info.Approver.ID > 0) {
                                model._approver[_exType.EXCTypeName] = res.info.Approver.ID;
                            }

                            var $TR = $($com.util.template(_exType, HTML.TR));

                            $tbody.append($TR);

                            $com.app.loaded();
                        });
                    } else {
                        var $TR = $($com.util.template(_exType, HTML.TR));

                        $tbody.append($TR);
                        $com.app.loaded();
                    }

                });
            });

            //表格中选择异常类型
            $("body").delegate(".ex-type-table tr.table-tr-m  td.ex_type_choose", "click", function () {
                var $this = $(this),
                    $TR = $this.closest("tr.table-tr-m"),
                    SelectID = Number($TR.attr("data-value")),
                    SelectName = $TR.attr("data-n-value"),
                    $table = $this.closest("table"),
                    $tbody = $table.children("tbody");

                if (!$TR[0])
                    return;

                var DATA = {
                    list: model._exTypeList,
                    title: "异常类型选择",
                    PropertyID: "ID",
                    PropertyName: "Name",
                    PropertyGroupName: "StationTypeName",
                    PropertyGroupID: "StationType",
                    mode: 1,
                    allowEmpty: true,
                    SelectName: SelectName
                },
                 selected = [];
                if (SelectID && SelectID > 0) {
                    selected.push(SelectID);
                }
                var _exType = $com.util.find(model.ex_types, function (item) {
                    return item.EXCTypeName == SelectName;
                });
                if (!_exType || _exType.EXCTypeName != SelectName) {
                    alert("此条异常不在已有数据中！");
                    $TR.remove();
                    return;
                }

                $com.choosePage.show(DATA, selected, function (IDList, NameList) {

                    if (!NameList || NameList.length <= 0) {
                        return false;
                    }
                    if (NameList[0] == _exType.EXCTypeName)
                        return;

                    _exType.EXCTypeName = NameList[0];

                    if (IDList && IDList.length > 0) {
                        if (IDList[0] == _exType.EXCTypeID)
                            return;

                        var _Info = $com.util.find(DATA.list, function (element, index, array) {
                            return element.ID == IDList[0];
                        });
                        if (_Info) {
                            _exType.EXCTypeID = _Info.ID;
                            _exType.DutyPositionID = _Info.DutyPositionID;
                            _exType.ConfirmPositionID = _Info.ConfirmPositionID;
                            _exType.ApproverPositionID = _Info.ApproverPositionID;
                            _exType.EXCTypeName = _Info.Name;
                        }
                    }

                    $com.app.loading();

                    if (_exType.EXCTypeID > 0) {
                        model.com.getDutyEmployee({ ExceptionType: _exType.EXCTypeID }, function (res) {

                            _exType.ConfirmID = res.info.Confirmer.ID;
                            _exType.ConfirmName = res.info.Confirmer.Name;
                            // _exType.ConfirmName = res.info.Confirmer.Name;

                            if (res.info.ResponserList) {
                                $.each(res.info.ResponserList, function (i, item) {
                                    _exType.OperatorIDList.push(item.ID);
                                    _exType.OperatorNameList.push(item.name)
                                });
                                _exType.OperatorNameString = _exType.OperatorNameList.join(",");
                            }

                            if (!model._approver)
                                model._approver = {};
                            if (res.info.Approver.ID
                                && res.info.Approver.ID > 0) {
                                model._approver[_exType.EXCTypeName] = res.info.Approver.ID;
                            }

                            var $_TR = $($com.util.template(_exType, HTML.TR));

                            $tbody.append($TR);

                            $com.app.loaded();
                        });
                    } else {

                        $TR[0].outerHTML = $com.util.template(_exType, HTML.TR);
                        $com.app.loaded();
                    }

                });

            });

            //表格中异常类型删除
            $("body").delegate(".ex-type-table tr.table-tr-m  .ex_type_remove", "click", function () {
                var $this = $(this),
                    $tr = $this.closest("tr"),
                    Name = $tr.attr("data-n-value"),
                    $tbody = $tr.closest("tbody"),
                    $table = $this.closest("table");

                if (!model.ex_types)
                    model.ex_types = [];
                var _index = $com.util.findIndex(model.ex_types, function (item) {
                    return Name == item.EXCTypeName;
                });
                if (_index >= 0)
                    model.ex_types.splice(_index, 1);
                if (model._approver)
                    delete model._approver[Name];

                $tr.remove();
            });


            //表格中选择接收人
            $("body").delegate(".ex-type-table tr.table-tr-m td.ex_dispatch_choose", "click", function () {
                var $this = $(this),
                    $TR = $this.closest("tr.table-tr-m"),
                    SelectID = Number($TR.attr("data-value")),
                    SelectName = $TR.attr("data-n-value"),
                    $table = $this.closest("table"),
                    $tbody = $table.children("tbody");

                if (!$TR[0])
                    return;

                var DATA = {
                    list: model._user,
                    title: "接收人选择",
                    PropertyID: "ID",
                    PropertyName: "Name",
                    PropertyGroupName: "Department",
                    PropertyGroupID: "DepartmentID",
                    mode: 2,
                    allowEmpty: false,
                    SelectName: ""
                },
                 selected = [];
                if (SelectID && SelectID > 0) {
                    selected.push(SelectID);
                }
                var _exType = $com.util.find(model.ex_types, function (item) {
                    return item.EXCTypeName == SelectName;
                });
                if (!_exType || _exType.EXCTypeName != SelectName) {
                    alert("此条异常数据不在已有数据中！");
                    $TR.remove();
                    return;
                }

                //根据当前异常类型 中的责任人岗位列表获取对应人员信息列表 
                //将人员信息表赋值给DATA.list

                //将发起人与确认人剔除在可选之外
                DATA.list = $com.util.findAll(DATA.list, function (element) {
                    return element.ID != model._data.ApplicantID
                        && element.ID != _exType.ConfirmID;
                });

                selected = _exType.OperatorIDList;


                $com.choosePage.show(DATA, selected, function (IDList, NameList) {

                    if (!IDList) {
                        return false;
                    }
                    _exType.OperatorIDList = IDList;
                    _exType.OperatorNameList = NameList;

                    _exType.OperatorNameString = _exType.OperatorNameList.join(",");

                    $TR[0].outerHTML = $com.util.template(_exType, HTML.TR);

                });

            });

            //表格中选择确认人
            $("body").delegate(".ex-type-table tr.table-tr-m td.ex_confirm_choose", "click", function () {
                var $this = $(this),
                    $TR = $this.closest("tr.table-tr-m"),
                    SelectID = Number($TR.attr("data-value")),
                    SelectName = $TR.attr("data-n-value"),
                    $table = $this.closest("table"),
                    $tbody = $table.children("tbody");

                if (!$TR[0])
                    return;

                var DATA = {
                    list: model._user,
                    title: "确认人选择",
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
                var _exType = $com.util.find(model.ex_types, function (item) {
                    return item.EXCTypeName == SelectName;
                });
                if (!_exType || _exType.EXCTypeName != SelectName) {
                    alert("此条异常数据不在已有数据中！");
                    $TR.remove();
                    return;
                }

                //根据当前异常类型 中的确认人岗位列表获取对应人员信息列表 
                //将人员信息表赋值给DATA.list

                //将接收人剔除在可选之外
                DATA.list = $com.util.findAll(DATA.list, function (element) {
                    return $.inArray(element.ID, _exType.OperatorIDList) == -1;
                });
                selected = _exType.ConfirmID;

                $com.choosePage.show(DATA, selected, function (IDList, NameList) {

                    if (!IDList) {
                        return false;
                    }
                    _exType.ConfirmID = IDList[0];
                    _exType.ConfirmName = NameList[0];

                    $TR[0].outerHTML = $com.util.template(_exType, HTML.TR);

                });

            });


        },

        run: function () {
            $com.app.loading();
            $("#station_type .m-c-body .w-option-content").html("【" + QRTYPE[model.query.QRType] + "】");
            $("#station_act .m-c-body .w-option-content").html(model.query.QRCode);
            model.com.getEmployee({ active: 1 }, function (data) {
                model._user = data.list;
                model._employee = {};

                $.each(model._user, function (i, item) {
                    model._employee[item.ID] = item.Name;
                });
            });
            model.com.create(model.query, function (data) {
                model._data = data.info;
                if (data.info.StationTypeName != QRTYPE[model.query.QRType]) {
                    $("#station_type .m-c-body .w-option-content").html("【"
                        + QRTYPE[model.query.QRType] + "】 " + data.info.StationTypeName);
                }

                model.com.renderWarn(data.RespondLevel);

                model._exTypeList = data.list;
                $com.app.loaded();
            });

        },

        com: {
            create: function (data, fn, context) {
                var d = {
                    $URI: "/EXCCallApply/Create",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },



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


            getDutyEmployee: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionType/InfoEmployee",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取岗位人员信息失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            add: function (data, fn, context) {
                var d = {
                    $URI: "/EXCCallApply/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            renderWarn: function (list) {
                var value = [];
                $(list).each(function () {
                    value.push(this.ID + "]=[]=[" + this.Name);
                });

                $("#level .m-c-body").attr("value-list", value.join("],["));
            },


            renderExType: function (list) {

                $.each(list, function (i, item) {

                    item.OperatorNameList = [];
                    $.each(item.OperatorIDList, function (i_o, item_o) {

                        item.OperatorNameList.push(model._employee[item_o]);
                    });
                    item.OperatorNameString = item.OperatorNameList.join(",");
                    item.ConfirmName = model._employee[item.ConfirmID];
                });
                $("table.ex-type-table tbody").html($com.util.template(list, HTML.TR));

            },

            commit: function (data) {
                if (IsSubmit)
                    return;

                confirm("确认提交吗？", function (rst) {

                    if (!rst)
                        return;
                    IsSubmit = true;

                    model.com.add({ data: data }, [function () {
                        alert("提交成功！");
                        if (window.history.length > 0) {
                            window.history.back();
                        }
                        else {
                            window.location = "list_r.html";
                        }
                        IsSubmit = false;
                    }, function () {
                        IsSubmit = false;
                    }]);
                });
            },

        }
    });

    model.init();
});
//# sourceMappingURL=maps/create2-141aed9460.js.map