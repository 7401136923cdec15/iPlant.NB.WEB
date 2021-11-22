require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		config,
		STATUS,
		COLOUR,
		LETTER,
		SHOWTEXTS,
		SHOWTYPES,
		DATALENGTH,
		ShiftName;

    DATALENGTH = {};
    SHOWTEXTS = ["下班次", "本班次"];
    SHOWTYPES = [2, 1];

    ShiftName = ["上班次", "本班次", "下班次"];

    STATUS = ["待配料", "已配料", "已收料", "已领料", "驳回"];

    COLOUR = ["text-yellow", "text-blue", "text-green", "text-yellow", "text-red"];


    HTML = {
        LIST: ['<div class="ms-group clearfix" data-id="{{Id}}"  data-no="{{C3}}" data-check="{{Check}}" >',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title"><span class="ms-field femi-rt">',
			//'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text ms-margin">{{LineName}}</span>',
			'</span> <span>{{Name}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">{{C1}}</span>',
			'<span class="ms-field">',
			'<span class="ms-label">配料数:</span><span class="ms-text">{{C2}}</span>',
			'</span>',
			//'<span class="ms-field">',
			//'<span class="ms-label">设备:</span><span class="ms-text">{{C3}}</span>',
			//'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"> ',
			'<span class="ms-label"></span><span class="ms-text">{{C4}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">时间:</span><span class="ms-text">{{Time}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l zace-ll">',
			'<span class="ms-status {{Color}}">{{Status}}</span>',
			'</div>',
			'</div>'].join("")
    };

    model = $com.Model.create({
        name: 'iPlantApp',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
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
            //zace-ll
            $("body").delegate(".ms-group", "click", function () {
                var $this = $(this),
					id = Number($this.attr("data-id")),
					check = $this.attr("data-check"),
					no = $this.attr("data-no");
                    model.com.refreshTable(id);
                // window.location = "detailReceive.html?id=" + id;
                //confirm("确定收料吗？", function (bool) {
                //    if (bool) {
                //        model.com.refresh(id);
                //    } else {
                //        return false;
                //    }

                //});

            });
            //$("body").delegate(".ms-group .ms-col-f", "click", function () {
            //    //alert("ww");
            //    var $this = $(this),
			//		id = Number($this.parent().attr("data-id")),
			//		check = $this.parent().attr("data-check"),
			//		no = $this.parent().attr("data-no");

              
            //        window.location = "detail.html?id=" + id;
            //    //if (check == 0 || check == "0") {

            //    //    confirm("是否到达送料地点？", function (bool) {
            //    //        if (!bool) {
            //    //            return false;
            //    //        } else {

            //    //            if (window.JSImpl) {
            //    //                window.QRTEST = function (val) {

            //    //                    if (val != no) {
            //    //                        alert("扫描的二维码不匹配！");
            //    //                        return;
            //    //                    }

            //    //                    if (!model._data || !model._data.length) {
            //    //                        alert("数据缺失，请回上一级重试！");
            //    //                        return;
            //    //                    }
            //    //                    var _data = model._data.find(function (item, i, modelData) {
            //    //                        return item.ID == id;
            //    //                    });

            //    //                    _data.status = 1;

            //    //                    model.com.add({
            //    //                        status: 1,
            //    //                        data: _data
            //    //                    }, function (res) {

            //    //                        alert("送料成功！");
            //    //                        $this.find(".ms-col-l span").attr("class", "ms-status " + COLOUR[1]);
            //    //                        $this.find(".ms-col-l span").html(STATUS[1]);
            //    //                        $this.attr("data-check", 1);

            //    //                    });


            //    //                };
            //    //                window.JSImpl.readQRCode('QRTEST');
            //    //            } else {
            //    //                if (!model._data || !model._data.length) {
            //    //                    alert("数据缺失，请回上一级重试！");
            //    //                    return;
            //    //                }
            //    //                var _data = model._data.find(function (item, i, modelData) {
            //    //                    return item.ID == id;
            //    //                });

            //    //                _data.status = 1;

            //    //                model.com.add({
            //    //                    status: 1,
            //    //                    data: _data
            //    //                }, function (res) {

            //    //                    alert("送料成功！");
            //    //                    $this.find(".ms-col-l span").attr("class", "ms-status " + COLOUR[1]);
            //    //                    $this.find(".ms-col-l span").html(STATUS[1]);
            //    //                    $this.attr("data-check", 1);

            //    //                });
            //    //            }

            //    //        }

            //    //    })






            //    //} else {
            //    //window.location = "detail.html?id=" + id;
            //    //}
            //});


        },

        run: function () {

            var _shift_id = 0;
            var _person_judge = 0;
            if (window.JSImpl) {
                _shift_id = window._shift_id;
                _person_judge = window._person_judge;

                // $("#ShiftName").html(ShiftName[_shift_id + 1]);
            }

            this.com.get({
                StationID: 0,
                person_judge: _person_judge,
                EventID: 1006
            }, function (data) {
                //DataZ = [

                //        {
                //            PartName: "虚拟工序",
                //            WorkShopName: "模组",
                //            LineName: "160V",
                //            MaterialName: "ZXZ",
                //            FQTYPL: 88,
                //            DeviceNo: "cx",
                //            ID: 2,
                //            MaterialNo: "xcvv",
                //            PLTime: "2019-09-09 19:10:10",
                //            Status: 0,

                //        },

                //];
                model.com.render(model.com.filter(data.list));
            });

        },

        com: {

            refreshTable: function (id) {
                model.com.getInfo({
                    ID: id
                }, function (data) {

                    modelInfo = data.info;
                    if (modelInfo.Status == 1 || modelInfo.Status == 4) {
                        window.location = "detailReceive.html?id=" + id;
                    } else if (modelInfo.Status == 2 || modelInfo.Status == 3) {
                        window.location = "detail.html?id=" + id;
                    }
                });
            },
            refresh: function (id) {
                //得到Item明细
                model.com.getInfo({
                    ID: id
                }, function (data) {

                    modelInfo = data.info;
                    //根据任务ID拿到Item 仓位详情
                    model.com.getInfoDetail({
                        TaskID: modelInfo.TaskMaterialID,
                        ID: id
                    }, function (data1) {

                        modelInfoDetail = data1;

                        //提交

                        model.com.add({
                            data: modelInfo,
                            status: 2,
                            list: modelInfoDetail.list

                        }, function (res) {
                            alert("领料成功");

                            model.com.get({
                                StationID: 0,
                                person_judge: _person_judge,
                                EventID: 1006
                            }, function (data) {
                              
                                model.com.render(model.com.filter(data.list));
                            });
                        });

                    });

                });



            },
            get: function (data, fn, context) {
                var d = {
                    $URI: "/MaterialTask/Items",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getInfo: function (data, fn, context) {
                var d = {
                    $URI: "/MaterialTask/ItemInfo",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getInfoDetail: function (data, fn, context) {
                var d = {
                    $URI: "/MaterialTask/InfoDetail",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            add: function (data, fn, context) {
                var d = {
                    $URI: "/MaterialTask/Submit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            filter: function (data) {
                var list = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].Status == 1 || data[i].Status == 4 || data[i].Status == 2) {
                        list.push(data[i]);
                    }
                }
                modelData = list;
                model._data = list;
                var _data = [];
                $(list).each(function () {



                    _data.push({
                        Name: this.PartName,
                        LineName: this.LineName,
                        //WorkShopName: this.WorkShopName,
                        C1: this.MaterialName,
                        C2: this.FQTYPL,
                        C3: this.DeviceNo,
                        C4: this.MaterialNo,
                        Id: this.ID,
                        Pno: this.MaterialNo,
                        Time: $com.util.format("yyyy-MM-dd hh:mm:ss", this.PLTime),
                        Status: STATUS[this.Status],
                        Color: COLOUR[this.Status],
                        Check: this.Status
                    });
                });

                return _data;
            },

            render: function (data) {
                $(".m-table").html($com.util.template(data, HTML.LIST));
            },


        }
    });

    model.init();

});