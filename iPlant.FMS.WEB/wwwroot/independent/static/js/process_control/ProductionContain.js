﻿require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/cross2.js', '../static/utils/js/charf.js', '../static/utils/js/base/jquery.treeview'], function ($zace, $com, $cross, $charf, $tree) {

    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        wDataDone,
        wDataUnDone,
        wDataSend,
        wFlowType,
        wFlowID,
        wLineList = [],
        wWorkShopList = [],
        model,
        wHisTaskList,
        LoginID,
        HTML;
    var styleControl = undefined;
    mTypeDone = 1;
    CheckResultList = ["合格", "合格", "不合格"];
    ProcessInstanceID = 0;
    var DateList = [

    ];
    var PropertyBasic = [{
        Name: '单据编号',
        TiTle: 'Code',
        Value: '',
    }, {
        Name: '申请人',
        TiTle: 'UpFlowName',
        Value: '',
    }, {
        Name: '申请时间',
        TiTle: 'CreateTime',
        Value: '',
    }, {
        Name: '任务更新时刻',
        TiTle: 'SubmitTime',
        Value: '',
    }];
    var PropertyBusiness = [{
        Name: '产线',
        TiTle: 'LineName',
        Value: '',
    }, {
        Name: '车间',
        TiTle: 'WorkShopName',
        Value: '',
    }, {
        Name: '工件',
        TiTle: 'PartNo',
        Value: '',
    }, {
        Name: '遏制描述',
        TiTle: 'CurbRemark',
        Value: '',
    }, {
        Name: '遏制结果',
        TiTle: 'CheckResultName',
        Value: '',
    }, {
        Name: '遏制结果备注',
        TiTle: 'CheckRemark',
        Value: '',
    }, {
        Name: '遏制描述附件',
        TiTle: 'FileList',
        Value: '',
    }, {
        Name: '遏制结果备注附件',
        TiTle: 'CheckFileList',
        Value: '',
    }];

    //     <div class="img-container">
    //     <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3886046484,1228904201&fm=26&gp=0.jpg" />
    //     <p class="desc">持续学习,向阳生长啊</p>
    //   </div>


    HTML = {
        OtherSrcPdf: [
            '<li class="upload-img" style="float: left;"><div class="DIVImg" style="display: inline-block;position: relative;top: -7px;left: -12px;width: 20px;height: 20px; background-color: white;border-radius: 50%;"><img src="../static/images/checkbox/error.png" style="width: 20px;height: 20px;"></div><img  src="../static/images/checkbox/pdf.png" class="SrcDISplay" style="float: left;width: 30px;height: 30px;margin: 2px;" data-value={{Src}}> ',
            '</li>',
        ].join(""),
        OtherSrcExcel: [
            '<li class="upload-img" style="float: left;"><div class="DIVImg" style="display: inline-block;position: relative;top: -7px;left: -12px;width: 20px;height: 20px; background-color: white;border-radius: 50%;"><img src="../static/images/checkbox/error.png" style="width: 20px;height: 20px;"></div><img  src="../static/images/checkbox/excel.png" class="SrcDISplay" style="float: left;width: 30px;height: 30px;margin: 2px;" data-value={{Src}}> ',
            '</li>',
        ].join(""),
        OtherSrcDoc: [
            '<li class="upload-img" style="float: left;"><div class="DIVImg" style="display: inline-block;position: relative;top: -7px;left: -12px;width: 20px;height: 20px; background-color: white;border-radius: 50%;"><img src="../static/images/checkbox/error.png" style="width: 20px;height: 20px;"></div><img  src="../static/images/checkbox/word.png" class="SrcDISplay" style="float: left;width: 30px;height: 30px;margin: 2px;" data-value={{Src}}> ',
            '</li>',
        ].join(""),
        OtherSrcTxt: [
            '<li class="upload-img" style="float: left;"><div class="DIVImg" style="display: inline-block;position: relative;top: -7px;left: -12px;width: 20px;height: 20px; background-color: white;border-radius: 50%;"><img src="../static/images/checkbox/error.png" style="width: 20px;height: 20px;"></div><img  src="../static/images/checkbox/txt.png" class="SrcDISplay" style="float: left;width: 30px;height: 30px;margin: 2px;" data-value={{Src}}> ',
            '</li>',
        ].join(""),
        IMG: ['<li class="upload-img" style="float: left;"><div class="DIVImg" style="display: inline-block;position: relative;top: -7px;left: -12px;width: 20px;height: 20px; background-color: white;border-radius: 50%;"><img src="../static/images/checkbox/error.png" style="width: 20px;height: 20px;"></div><img  class="ShowImg SrcDISplay"  src="{{Src}}" data-value="{{Src}}"  data-id="{{Id}}" style="float: left;width: 30px;height: 30px;margin: 2px;"> ',

            '</li>',
        ].join(""),
        ButtonMode: [
            ' <button type="button"  class="btn zaceStatusCommit ds-bpm-btn lmvt-def-btn"  data-prop="{{Name}}" data-valueText="{{Text}}" data-value="{{Value}}">',
            '  <span class="glyphicon " aria-hidden="true"></span>{{Text}}',
            ' </button>',
        ].join(""),

        TableModeCommit: [
            '<tr>',
            '<td  style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td style="min-width: 50px;display:none" data-title="StepID" data-value="{{StepID}}">{{StepID}}</td> ',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="UpFlowName" data-value="{{UpFlowName}}" >{{UpFlowName}}</td>',
            '<td data-title="CreateTimeText" data-value="{{CreateTimeText}}" >{{CreateTimeText}}</td>',
            '<td data-title="SubmitTime" data-value="{{SubmitTime}}" >{{SubmitTime}}</td>',
            '<td data-title="Status" data-value="{{Status}}" data-version="{{VersionID}}" >{{StatusText}}</td>',
            '<td style="min-width: 30px;max-width: 120px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-add-pencil" >办理任务</span> </div> </td>  ',
            '</tr>',
        ].join(""),

        TableModeCommitDetail: [
            '<tr>',
            '<td  style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td style="min-width: 50px;display:none" data-title="StepID" data-value="{{StepID}}">{{StepID}}</td> ',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="UpFlowName" data-value="{{UpFlowName}}" >{{UpFlowName}}</td>',
            '<td data-title="CreateTimeText" data-value="{{CreateTimeText}}" >{{CreateTimeText}}</td>',
            '<td data-title="SubmitTime" data-value="{{SubmitTime}}" >{{SubmitTime}}</td>',
            '<td data-title="StatusText" data-value="{{StatusText}}" >{{StatusText}}</td>',
            '<td style="min-width: 30px;max-width: 120px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-add-pencilDetail" >任务详情</span> </div> </td>  ',
            '</tr>',
        ].join(""),

        ImgList: [
            '<img class="ShowImg" src="{{Value}}" data-source="{{Value}}"  data-id="{{Value}}" style="width: 30px;height: 30px;margin: 2px;"></img>',
        ],
        ReadOnlyOneImg: [
            '<div  class="TempTable" style=" display: flex;width: 100%;float: left;">',
            '<div class="FieldName" style="width: 19.5%;"><span class="ContentshowName">{{Name}}</span></div>',
            '<div class="FieldContentOne" style="width: 80.5%;padding:0px"><div class="upload-img" style="margin-left: 2.8%;">{{ImgList}}</div></div>',
            '</div>',
        ].join(""),
        ReadOnlyImg: [
            '<div class="TempTable">',
            '<div class="FieldName" style="width: 39%;"><span class="ContentshowName">{{Name}}</span></div>',
            '<div class="FieldContentTwo" style="padding:0px"><div class="upload-img" style="margin-left: 7%;">{{ImgList}}</div></div>',
            '</div>',
        ].join(""),
        ReadOnlyTwo: [
            '<div class="TempTable">',
            '<div class="FieldName" style="width: 39%;"><span class="ContentshowName">{{Name}}</span></div>',
            '<div class="FieldContentTwo"><span class="Contentshow">{{Value}}</span></div>',
            '</div>',
        ].join(""),
        ReadOnlyOne: [
            '<div  class="TempTable" style=" display: flex;width: 100%;float: left;">',
            '<div class="FieldName" style="width: 19.5%;"><span class="ContentshowName">{{Name}}</span></div>',
            '<div class="FieldContentOne" style="width: 80.5%;"><span class="Contentshow" style="margin-left: 1.8%;">{{Value}}</span></div>',
            '</div>',
        ].join(""),

        Photo: [
            '<div class="lmvt-show-photo" style="position: fixed;z-index: 2001;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0, 0, 0, 0.5);text-align: center">',
            '<svg t="1562913698052" class="lmvt-remove-photo" style="position:absolute;top:10;right:10" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2620" width="50" height="50"><path d="M684.642617 277.598412l-1.436722-1.467421c-12.489452-12.461823-32.730449-12.461823-45.159526 0L479.700991 434.510138l-158.286026-158.315702c-12.555967-12.524245-32.793894-12.524245-45.225017 0-12.555967 12.462846-12.555967 32.701796 0 45.223994l158.348448 158.317749L276.129573 638.049834c-12.495592 12.429077-12.495592 32.671097 0 45.163619l1.49812 1.434675c12.429077 12.494569 32.66905 12.494569 45.221948 0l158.287049-158.286026 158.283979 158.286026c12.491499 12.494569 32.731472 12.494569 45.220924 0 12.495592-12.493545 12.495592-32.731472 0-45.222971l-158.285003-158.285003 158.285003-158.314679C697.138209 310.299185 697.138209 290.060235 684.642617 277.598412" p-id="2621" fill="#e6e6e6"></path><path d="M818.88197 140.522454c-187.332573-187.363272-491.033479-187.363272-678.364005 0-187.329503 187.329503-187.329503 491.032456 0 678.362982 187.330526 187.392948 491.031433 187.392948 678.364005 0C1006.274918 631.55491 1006.274918 327.851956 818.88197 140.522454M773.656953 773.660418c-162.344458 162.343435-425.569512 162.407903-587.914994 0-162.40688-162.344458-162.40688-425.602258 0-587.914994 162.344458-162.40688 425.569512-162.40688 587.914994 0C936.063833 348.059184 936.000388 611.31596 773.656953 773.660418" p-id="2622" fill="#e6e6e6"></path></svg>',
            '<div data-index="0" class="lmvt-change-photo" style="position: fixed;top: 60px;right: 60px;left: 60px;bottom: 60px;background-size:100% 100%;width: auto;height: auto;">',
            // '<img class="zacelmvt-img" style="position: fixed;top: 60px;right: 60px;left: 60px;bottom: 60px;background-size:auto 100%;width: auto;height: auto;" />',
            '</div>',
            '<div class="lmvt-bottom">',
            '<div class="lmvt-bottom-left">',
            '<svg t="1562913570901" class="icon" style="float:left;margin-left:10px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1103" width="30" height="30">',
            '<path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 896a384 384 0 1 1 384-384 384 384 0 0 1-384 384z" fill="#e6e6e6" p-id="1104"></path>',
            '<path d="M493.44 247.04a64 64 0 0 0-90.88 90.88L576 512l-173.44 174.08a64 64 0 0 0 90.88 90.88l219.52-219.52a64 64 0 0 0 0-90.88z" fill="#e6e6e6" p-id="1105"></path></svg>',
            '</div>',
            '<div class="lmvt-bottom-right">',
            '<svg t="1562912869524" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ',
            ' p-id="1469" width="30" style="float:right;margin-right:10px" height="30"><path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 896a384 384 0 1 1 384-384 384 384 0 0 1-384 384z" ',
            ' fill="#e6e6e6" p-id="1470"></path><path d="M616.96 272.64a58.24 58.24 0 0 0-81.92 0l-198.4 198.4a58.88 58.88 0 0 0 0 81.92l198.4 198.4a58.24 58.24 0 1 0 81.92-81.92L459.52 512l157.44-157.44a58.24 58.24 0 0 0 0-81.92z" fill="#e6e6e6" p-id="1471"></path></svg>',
            '</div>',
            '</div>',
            '</div>',
        ].join(""),

        TableModeTemp: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="PartNo" data-value="{{PartNo}}" >{{PartNo}}</td>',
            '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
            '<td data-title="WorkShopName" data-value="{{WorkShopName}}" >{{WorkShopName}}</td>',
            '<td data-title="EditorName" data-value="{{EditorName}}" >{{EditorName}}</td>',
            '<td data-title="EditTime" data-value="{{EditTime}}" >{{EditTime}}</td>',
            '</tr>',
        ].join(""),

    };
    (function () {
        KEYWORD_Level_LIST = [
            "LineID|产线|ArrayOne",
            "WorkShopID|车间|ArrayOne",
            "Status|状态|ArrayOne",
            "StartTime|开始时间|Date",
            "EndTime|结束时间|Date",

        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {
        };

        TypeSource_Level = {
        };

        $.each(KEYWORD_Level_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Level[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Level[detail[0]] = $com.util.getFormatter(TypeSource_Level, detail[0], detail[2]);
            }
        });
    })();


    model = $com.Model.create({
        name: '生产遏制流程',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate(".SrcDISplay", "click", function () {
                $this = $(this);
                window.open($this.attr("data-value"));
            })
            //生产遏制是否合格
            $("body").delegate("input[type='checkbox'].switch", "click", function () {
                $this = $(this);
                var Value = Number($this.attr("data-value"));
                if (Value == 1) {
                    $("input[type='checkbox'].switch").attr("data-value", 2);
                } else {
                    $("input[type='checkbox'].switch").attr("data-value", 1);
                }
            });

            //待办实时流程图
            $("body").delegate(".commit_route", "click", function () {
                var $src = $com.imageUrl + "/MESBPM/api/Repository/getRealFlowChart?processInstanceId=" + ProcessInstanceID;
                $("#cby-route-charf-ontask img").attr("src", $src);
                model.com.imgShow("#outerdiv", "#innerdiv", "#bigimg", $("#cby-route-charf-ontask img"));
            });
            //返回待办任务
            $("body").delegate("#cby-return-ontask", "click", function () {
                $("#cby-route-charf-ontask").hide();
            });
            //节点隐藏
            $("body").delegate("#lmvt-type-back", "click", function () {
                $(".bottom").hide();
                $(".cby-charf-detail-item").css("border", "1px solid rgb(218, 218, 218)")
            });

            //单条申请
            $("body").delegate("#applySingle", "click", function () {
                $(".BPM-title").text("发起生产遏制");
                mQueryTaskID = 0;
                $('.zacePlanTable').hide();
                $('.zacePlanCommit').hide();
                $('.zacePlanCommitDone').hide();
                $(".zacePlanSend").hide();
                $('.zacePencil').show();
                $('.zacePencilDone').hide();
                $(".Businessfq").hide();
                model.com.refreshTablePencil(0);
            });

            //多条申请
            $("body").delegate("#applyMultiple", "click", function () {
                $(".BPM-title").text("发起生产遏制");
                mQueryTaskID = 0;
                $('.zacePlanTable').hide();
                $('.zacePlanCommit').hide();
                $('.zacePlanCommitDone').hide();
                $(".zacePlanSend").hide();
                $('.zacePencil').hide();
                $('.zacePencilDone').hide();
                $(".Businessfq").hide();
                $(".Multiplefq").show();
                model.com.refreshTablePencil(0);
            });
            //可多条提交
            $("body").delegate("#zace-exportApproval-Submit", "click", function () {
                var SelectData = $com.table.getSelectionData($("#femi-riskLevel-tbody"), "ID", DateList);

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                var submitfn = function (j) {
                    if (SelectData.length <= j)
                        return;
                    var taskIDObj = {
                        key: "_2020"
                    };
                    model.com.onTask({ processDefinitionKey: taskIDObj.key, BusinessKey: "", data: {} }, function (data) {
                        //获取实例ID
                        var wData = data.data;
                        wData.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', wData.CreateTime);
                        wData.SubmitTime = $com.util.format('yyyy-MM-dd hh:mm:ss', wData.SubmitTime);
                        wData.EditTime = $com.util.format('yyyy-MM-dd hh:mm:ss', wData.EditTime);
                        wData.UpFlowID = wData.UpFlowID + "";
                        wData["Status"] = mCloneData.Status + "";
                        wData.StepID = data.list[0].ID;

                        wData.PartNo = SelectData[j].PartNo;
                        wData.PartNo_txt_ = SelectData[j].PartNo;
                        wData.LineID = SelectData[j].LineID;
                        wData.LineID_txt_ = SelectData[j].LineName;
                        wData.WorkShopID = SelectData[j].WorkShopID;
                        wData.WorkShopID_txt_ = SelectData[j].WorkShopName;

                        $com.util.deleteLowerProperty(wData);
                        model.com.postTask({ "TaskID": wData.StepID, "data": wData }, function (res) {
                            var currentTask = res.list;
                            var mInfo = res.info;
                            if (j == SelectData.length - 1) {
                                alert("提交成功");
                                $("#zace-exportApproval-commitReturn").click();
                                $com.app.loaded();
                            } else {
                                submitfn(j + 1);
                            }
                        });
                    });
                }
                if (!confirm("是否提交生产遏制？")) {
                    return;
                }

                $com.app.loading();
                if (mQueryTaskID <= 0) {
                    mCloneData.UpFlowID = mCloneData.UpFlowID + "";
                    mCloneData.Status = "1";
                    mCloneData.PartNo = SelectData[0].PartNo;
                    mCloneData.PartNo_txt_ = SelectData[0].PartNo;
                    mCloneData.LineID = SelectData[0].LineID;
                    mCloneData.LineID_txt_ = SelectData[0].LineName;
                    mCloneData.WorkShopID = SelectData[0].WorkShopID;
                    mCloneData.WorkShopID_txt_ = SelectData[0].WorkShopName;
                }
                model.com.postTask({ "TaskID": Todotasks.ID, "data": mCloneData }, function (res) {
                    var currentTask = res.list;
                    var mInfo = res.info;
                    if (SelectData.length > 1) {
                        submitfn(1);
                    } else {
                        alert("提交成功");
                        $("#zace-exportApproval-commitReturn").click();
                        $com.app.loaded();
                    }

                });

            });
            //查看节点详情
            $("body").delegate(".cby-charf-detail-item", "click", function () {
                $(".bottom").show();
                $this = $(this);
                $this.css("border", "5px solid orange");
                $this.siblings().css("border", "1px solid rgb(218, 218, 218)");
                HisTaskID = $this.attr("data-historytaskid");
                var DetailList = [];
                var HisTaskName = "";
                for (var i = 0; i < wHisTaskList.length; i++) {
                    if (wHisTaskList[i].ID == HisTaskID) {
                        HisTaskName = wHisTaskList[i].Name;
                    }
                    if (wHisTaskList[i].ID == HisTaskID && wHisTaskList[i].HisTaskVarinstList.length > 0) {
                        for (var k = 0; k < wHisTaskList[i].HisTaskVarinstList.length; k++) {
                            if (wHisTaskList[i].HisTaskVarinstList[k]._BPMActivitiForm.IsWritable && wHisTaskList[i].HisTaskVarinstList[k].Value.length != 0) {
                                DetailList.push({
                                    Name: wHisTaskList[i].HisTaskVarinstList[k]._BPMActivitiForm.Name,
                                    Value: wHisTaskList[i].HisTaskVarinstList[k].ValueText
                                })
                            }
                        }
                    }
                }
                var DetailListShow = [];
                var CheckFileList = [];
                var FileList = [];
                for (var m = 0; m < DetailList.length; m++) {
                    if (DetailList[m].Name == "遏制结果") {
                        if (DetailList[m].Value == 1) {
                            DetailList[m].Value = "合格";
                        } else {
                            DetailList[m].Value = "不合格";
                        }
                    }

                    if (DetailList[m].Name == "遏制描述附件") {
                        var FileList = [];
                        var Temp = "";
                        var TempList = DetailList[m].Value.split(",");
                        for (var k = 0; k < TempList.length; k++) {
                            if (TempList[k].indexOf("jpg") != -1 || TempList[k].indexOf("jpeg") != -1 || TempList[k].indexOf("png") != -1 || TempList[k].indexOf("gif") != -1) {
                                Temp = Temp + '<img class="ShowImg" src=' + TempList[k] + ' style="width: 30px;height: 30px;margin: 1px;"></img>'
                            } else if (TempList[k].indexOf("txt") != -1) {
                                Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/txt.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + TempList[k] + '></img>'
                            } else if (TempList[k].indexOf("doc") != -1 || TempList[k].indexOf("docx") != -1) {
                                Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/doc.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + TempList[k] + '></img>'
                            } else if (TempList[k].indexOf("xlsx") != -1 || TempList[k].indexOf("xls") != -1) {
                                Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/excel.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + TempList[k] + '></img>'
                            } else if (TempList[k].indexOf("pdf") != -1) {
                                Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/pdf.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + TempList[k] + '></img>'
                            }
                        }
                        if (Temp.length != 0) {
                            FileList.push({
                                Name: "遏制描述附件",
                                ImgList: Temp
                            });
                        }
                    } else if (DetailList[m].Name == "遏制结果备注附件") {
                        var CheckFileList = [];
                        var Temp = "";
                        var TempList = DetailList[m].Value.split(",");
                        for (var k = 0; k < TempList.length; k++) {
                            if (TempList[k].indexOf("jpg") != -1 || TempList[k].indexOf("jpeg") != -1 || TempList[k].indexOf("png") != -1 || TempList[k].indexOf("gif") != -1) {
                                Temp = Temp + '<img class="ShowImg" src=' + TempList[k] + ' style="width: 30px;height: 30px;margin: 1px;"></img>'
                            } else if (TempList[k].indexOf("txt") != -1) {
                                Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/txt.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + TempList[k] + '></img>'
                            } else if (TempList[k].indexOf("doc") != -1 || TempList[k].indexOf("docx") != -1) {
                                Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/doc.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + TempList[k] + '></img>'
                            } else if (TempList[k].indexOf("xlsx") != -1 || TempList[k].indexOf("xls") != -1) {
                                Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/excel.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + TempList[k] + '></img>'
                            } else if (TempList[k].indexOf("pdf") != -1) {
                                Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/pdf.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + TempList[k] + '></img>'
                            }

                        }
                        if (Temp.length != 0) {
                            CheckFileList.push({
                                Name: "遏制结果备注附件",
                                ImgList: Temp
                            });
                        }
                    } else {
                        DetailListShow.push(DetailList[m]);
                    }
                }
                $(".BasicTableDeatil .FieldContentOne .Contentshow").text(HisTaskName);
                if (DetailListShow.length % 2 == 0) {
                    if (FileList.length > 0 && CheckFileList.length > 0) {
                        $(".TableContentBasicDeatil .BasicTable").html($com.util.template(DetailListShow, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyImg) + $com.util.template(CheckFileList, HTML.ReadOnlyImg));
                    } else if (FileList.length == 0 && CheckFileList.length == 0) {
                        $(".TableContentBasicDeatil .BasicTable").html($com.util.template(DetailListShow, HTML.ReadOnlyTwo));
                    } else {
                        $(".TableContentBasicDeatil .BasicTable").html($com.util.template(DetailListShow, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyOneImg) + $com.util.template(CheckFileList, HTML.ReadOnlyOneImg));
                    }
                } else {
                    var DateTwo = [];
                    var DateOne = DetailListShow[DetailListShow.length - 1];
                    for (var i = 0; i < DetailListShow.length - 1; i++) {
                        DateTwo.push(DetailListShow[i]);
                    }
                    if (FileList.length > 0 && CheckFileList.length > 0) {
                        $(".TableContentBasicDeatil .BasicTable").html($com.util.template(DetailListShow, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyImg) + $com.util.template(CheckFileList, HTML.ReadOnlyOneImg));
                    } else if (FileList.length == 0 && CheckFileList.length == 0) {
                        $(".TableContentBasicDeatil .BasicTable").html($com.util.template(DateTwo, HTML.ReadOnlyTwo) + $com.util.template(DateOne, HTML.ReadOnlyOne));
                    } else {
                        $(".TableContentBasicDeatil .BasicTable").html($com.util.template(DetailListShow, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyImg) + $com.util.template(CheckFileList, HTML.ReadOnlyImg));
                    }
                }
            });
            //提交
            $("body").delegate(".zaceStatusCommit.ds-bpm-btn", "click", function () {
                $com.app.loading("提交中!");
                var $this = $(this);
                mCloneData[$this.attr("data-prop")] = $this.attr("data-value");
                var _text = $this.attr("data-valueText");

                model.com.addCheck(_text);
            });
            // 待办
            $("body").delegate("#zace-undone", "click", function () {
                $('.zacePlanCommitDone').hide();
                $('.zacePlanCommit').show();
                $('.zacePencil').hide();
                $('.zacePencilDone').hide();
                $('.zacePlanTable').hide();
                $(".zacePlanSend").hide();
                $(".Multiplefq").hide();
                mTypeDone = 1;
                model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
            });
            // 已办
            $("body").delegate("#zace-done", "click", function () {
                $('.zacePlanCommitDone').show();
                $('.zacePlanCommit').hide();
                $('.zacePencil').hide();
                $('.zacePencilDone').hide();
                $('.zacePlanTable').hide();
                $(".zacePlanSend").hide();
                $(".Multiplefq").hide();
                mTypeDone = 2;
                model.com.refreshCommitTableDone(mZCommitStartTime, mZCommitEndTime);
            });
            // 发起
            $("body").delegate("#zace-Send", "click", function () {
                $(".zacePlanSend").show();
                $('.zacePlanCommitDone').hide();
                $('.zacePlanCommit').hide();
                $('.zacePencil').hide();
                $('.zacePencilDone').hide();
                $('.zacePlanTable').hide();
                $(".Multiplefq").hide();
                mTypeDone = 3;
                model.com.refreshSend(mZCommitStartTime, mZCommitEndTime);
            });

            //  处理信息 返回
            $("body").delegate("#zace-exportApproval-commitReturn", "click", function () {
                $(".bottom").hide();
                $('.zacePencil').hide();
                $('.zacePencilDone').hide();
                $('.zacePlanTable').hide();
                $(".Multiplefq").hide();

                if (mTypeDone == 1) {
                    $('.zacePlanCommit').show();
                    $('.zacePlanCommitDone').hide();
                    $(".zacePlanSend").hide();
                    model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
                } else if (mTypeDone == 2) {
                    $('.zacePlanCommit').hide();
                    $('.zacePlanCommitDone').show();
                    $(".zacePlanSend").hide();
                    model.com.refreshCommitTableDone(mZCommitStartTime, mZCommitEndTime);
                } else if (mTypeDone == 3) {
                    $('.zacePlanCommit').hide();
                    $('.zacePlanCommitDone').hide();
                    $(".zacePlanSend").show();
                    model.com.refreshSend(mZCommitStartTime, mZCommitEndTime);
                }

            });

            // 处理任务
            $("body").delegate("#cby-add-pencil", "click", function () {

                var $this = $(this);
                var $table = $this.closest("tr");
                var WID = Number($table.find('td[data-title=ID]').attr('data-value'));
                mQueryTaskID = Number($table.find('td[data-title=StepID]').attr('data-value'));
                var Status = Number($table.find('td[data-title=Status]').attr('data-value'));
                $('.zacePlanTable').hide();
                $('.zacePlanCommit').hide();
                $('.zacePlanCommitDone').hide();
                $(".zacePlanSend").hide();
                $('.zacePencil').show();
                $('.zacePencilDone').hide();
                $(".Multiplefq").hide();
                $(".bottom").hide();
                $(".BPM-title").text("生产遏制处理信息");

                model.com.refreshTablePencil(WID);

            });
            // 查看详情
            $("body").delegate("#cby-add-pencilDetail", "click", function () {

                var $this = $(this);
                var $table = $this.closest("tr");
                var WID = Number($table.find('td[data-title=ID]').attr('data-value'));

                $('.zacePlanTable').hide();
                $('.zacePlanCommit').hide();
                $('.zacePlanCommitDone').hide();
                $(".zacePlanSend").hide();
                $('.zacePencil').hide();
                $('.zacePencilDone').show();
                $(".bottom").hide();
                for (var i = 0; i < wUser.length; i++) {
                    if (wUser[i].LoginID == window.parent.User_Info.LoginID) {
                        LoginID = wUser[i].ID;
                    }
                }
                model.com.refreshTablePencilDetail(WID);
            });
            //已办 刷新
            $("body").delegate("#zace-refresh-Done", "click", function () {
                model.com.refreshCommitTableDone();
            });
            //待办 刷新
            $("body").delegate("#zace-refresh-UnDone", "click", function () {
                model.com.refreshCommitTable();
            });
            //发起 刷新
            $("body").delegate("#zace-refresh-Send", "click", function () {
                model.com.refreshSend();
            });

            //Enter触发模糊查询事件  已办
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $(this),
                        value = $("#zace-search-done").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-zacePlanCommitDone-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-zacePlanCommitDone-tbody"), wDataDone, value, "ID");
                }
            });
            //查询  已办
            $("body").delegate("#zace-searchDone", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-done").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-zacePlanCommitDone-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-zacePlanCommitDone-tbody"), wDataDone, value, "ID");
            });


            //Enter触发模糊查询事件  待办
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $(this),
                        value = $("#zace-search-undone").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-zacePlanCommit-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-zacePlanCommit-tbody"), wDataUnDone, value, "ID");
                }
            });
            //查询  待办
            $("body").delegate("#zace-searchUndone", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-undone").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-zacePlanCommit-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-zacePlanCommit-tbody"), wDataUnDone, value, "ID");
            });

            //Enter触发模糊查询事件  发起
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $(this),
                        value = $("#zace-search-send").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $("#femi-zacePlanSend-tbody").children("tr").show();
                    else
                        $com.table.filterByLikeString($("#femi-zacePlanSend-tbody"), wDataSend, value, "ID");
                }
            });
            //查询  发起
            $("body").delegate("#zace-searchSend", "click", function () {

                var $this = $(this),
                    value = $("#zace-search-send").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $("#femi-zacePlanSend-tbody").children("tr").show();
                else
                    $com.table.filterByLikeString($("#femi-zacePlanSend-tbody"), wDataSend, value, "ID");
            });

            //撤销
            $("body").delegate("#commit_cancel", "click", function () {
                if (!confirm("确定撤销周计划吗？")) {
                    return;
                }
                model.com.deleteProcessInstance({
                    processInstanceId: wFlowID, deleteReason: "申请撤销", ID: wInfo.ID, FlowType: wFlowType
                }, [function (res) {
                    $("#zace-exportApproval-commitReturn").click();
                }, function (res2) {
                    $("#zace-exportApproval-commitReturn").click();
                }]);
            });

            // 上传附件
            $("body").delegate(".Write-content-FileList", "change", function () {
                var self = this,
                    _data = self.files[0];
                if (_data) {
                    if(_data.size<=0){
                        alert("文件大小不能为空！");
                        clearFiles();
                        return;
                    }
                    if (_data.size > (1024 * 1024 * 10)) {
                        alert("请上传小于10M的文件！");
                        clearFiles();
                        return;
                    }

                    if (!extLimit(['jpg', 'png', 'gif', 'bmp', 'jpeg', "pdf", "doc", "docx", "xlsx", "txt", "xls"]).has(_data.name)) {
                        alert("请上传正确的文件！");
                        clearFiles();
                        return;
                    }

                    var form = new FormData();
                    form.append("file", _data);

                    //alert(_data.name);
                    $.ajax({ //
                        url: "/MESCore/api/Upload/Submit",
                        type: "POST",
                        data: form,
                        processData: false,
                        contentType: false,
                        dataType: "JSON"
                    }).done(function (data) {

                        if (data.resultCode === 1000) {
                            var $p = $(self).parent();
                            //  $p.before('.upload-btn').remove();

                            if (data.returnObject.file_id.indexOf("jpg") != -1 || data.returnObject.file_id.indexOf("jpeg") != -1 || data.returnObject.file_id.indexOf("png") != -1 || data.returnObject.file_id.indexOf("gif") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                    Id: data.returnObject.file_id
                                }, HTML.IMG));
                            } else if (data.returnObject.file_id.indexOf("txt") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcTxt));
                            } else if (data.returnObject.file_id.indexOf("doc") != -1 || data.returnObject.file_id.indexOf("docx") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcDoc));
                            } else if (data.returnObject.file_id.indexOf("xlsx") != -1 || data.returnObject.file_id.indexOf("xls") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcExcel));
                            } else if (data.returnObject.file_id.indexOf("pdf") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcPdf));
                            }

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
            // 上传附件
            $("body").delegate(".Write-content-CheckFileList", "change", function () {
                var self = this,
                    _data = self.files[0];
                if (_data) {
                    if(_data.size<=0){
                        alert("文件大小不能为空！");
                        clearFiles();
                        return;
                    }
                    if (_data.size > (1024 * 1024 * 10)) {
                        alert("请上传小于10M的文件！");
                        clearFiles();
                        return;
                    }

                    if (!extLimit(['jpg', 'png', 'gif', 'bmp', 'jpeg', "pdf", "doc", "docx", "xlsx", "txt", "xls"]).has(_data.name)) {
                        alert("请上传正确的文件！");
                        clearFiles();
                        return;
                    }

                    var form = new FormData();
                    form.append("file", _data);

                    //alert(_data.name);
                    $.ajax({ //
                        url: "/MESCore/api/Upload/Submit",
                        type: "POST",
                        data: form,
                        processData: false,
                        contentType: false,
                        dataType: "JSON"
                    }).done(function (data) {

                        if (data.resultCode === 1000) {
                            var $p = $(self).parent();
                            //  $p.before('.upload-btn').remove();

                            if (data.returnObject.file_id.indexOf("jpg") != -1 || data.returnObject.file_id.indexOf("jpeg") != -1 || data.returnObject.file_id.indexOf("png") != -1 || data.returnObject.file_id.indexOf("gif") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                    Id: data.returnObject.file_id
                                }, HTML.IMG));
                            } else if (data.returnObject.file_id.indexOf("txt") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcTxt));
                            } else if (data.returnObject.file_id.indexOf("doc") != -1 || data.returnObject.file_id.indexOf("docx") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcDoc));
                            } else if (data.returnObject.file_id.indexOf("xlsx") != -1 || data.returnObject.file_id.indexOf("xls") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcExcel));
                            } else if (data.returnObject.file_id.indexOf("pdf") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcPdf));
                            }

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

            //   查看图片
            $("body").delegate(".upload-img .ShowImg", "click", function () {
                var farImg = $(this).parent(".upload-img"),
                    imgObj = "",
                    imgList = [];
                $.each(farImg.children(".ShowImg"), function (i, item) {
                    imgObj = $(item).attr("src");
                    if (imgObj.length != 0) {
                        imgList.push(imgObj);
                    }
                });
                $.each(farImg.siblings(".upload-img").children(".ShowImg"), function (i, item) {
                    imgObj = $(item).attr("src");
                    if (imgObj.length != 0) {
                        imgList.push(imgObj);
                    }
                });
                PhotoList = imgList;
                $("body").append(HTML.Photo);
                var imgSrc = $(this).attr("src")
                $.each(PhotoList, function (p_i, p_item) {
                    var pImg = p_item;
                    if (pImg == imgSrc) {
                        $(".lmvt-change-photo").attr("data-index", p_i);
                        return false;
                    }
                })

                $(".lmvt-change-photo").css("background", "url(" + imgSrc + ") " + "no-repeat center");
            });

            //移除photo
            $("body").delegate(".lmvt-remove-photo", "click", function () {
                $(".lmvt-show-photo").remove();
            });

            //右看图片
            $("body").delegate(".lmvt-bottom-left", "click", function () {
                var index = Number($(".lmvt-change-photo").attr("data-index"));
                if (PhotoList) {
                    if (index == PhotoList.length - 1) {
                        alert("这是最后一张图片！");
                        return false;
                    }
                    else {
                        $(".lmvt-change-photo").css("background", "url(" + PhotoList[index + 1] + ") " + "no-repeat center");
                        $(".lmvt-change-photo").attr("data-index", index + 1);
                    }
                }
            });
            //左看图片
            $("body").delegate(".lmvt-bottom-right", "click", function () {
                var index = Number($(".lmvt-change-photo").attr("data-index"));
                if (PhotoList) {
                    if (index == 0) {
                        alert("这是第一张图片！");
                        return false;
                    }
                    else {
                        $(".lmvt-change-photo").css("background", "url(" + PhotoList[index - 1] + ") " + "no-repeat center");
                        $(".lmvt-change-photo").attr("data-index", index - 1);
                    }
                }

            });
            $("body").delegate(".DIVImg", "click", function () {
                var $this = $(this);
                if (!confirm("是否删除附件？")) {
                    return;
                }
                $this.siblings(".ShowImg").remove();
                $this.siblings(".SrcDISplay").remove();
                $this.remove();
            });

            // $("body").delegate(".m-c-body .upload-list .upload-img .ShowImg", "mousemove", function () {
            //     $(".DIVImg").show();
            // });

            // $("body").delegate(".m-c-body .upload-list .upload-img .ShowImg", "mouseout", function () {
            //     $(".DIVImg").hide();
            // });

            //导入
            $("body").delegate("#lmvt-materialRecord-input", "click", function () {
                $("#input-file").val("");
                $("#input-file").click();
            });
            $("body").delegate("#input-file", "input", function () {
                var $this = $(this);

                if (this.files.length == 0)
                    return;


                if (!extLimit(['xlsx', 'xls']).has(this.files[0].name)) {
                    alert("请上传正确的Excel文件！");
                    clearFiles();
                    return;
                }
                var fileData = this.files[0];

                var form = new FormData();
                form.append("file", fileData);

                model.com.postImportExcel(form, function (res) {
                    if (!res)
                        return;
                    res.list.splice(0, 1);//删除第一行
                    var list = res.list,
                        rst = [];
                    if (list) {

                        var postData = res.list;

                        var DataParams = $com.table.postExportParams(postData, $(".table-partMultiple"));

                        var WantList = model.com.unique(DataParams);
                        for (var i = 0; i < WantList.length; i++) {
                            for (var k = 0; k < wLineList.length; k++) {
                                if (wLineList[k].Name == WantList[i].LineName) {
                                    WantList[i].LineID = wLineList[k].ID;
                                }
                            }
                            for (var m = 0; m < wWorkShopList.length; m++) {
                                if (wWorkShopList[m].Name == WantList[i].WorkShopName) {
                                    WantList[i].WorkShopID = wWorkShopList[m].ID;
                                }
                            }
                            DateList.push({
                                ID: i + 1,
                                LineID: WantList[i].LineID,
                                LineName: WantList[i].LineName,
                                WorkShopID: WantList[i].WorkShopID,
                                WorkShopName: WantList[i].WorkShopName,
                                PartNo: WantList[i].PartNo,
                                EditorID: 1,
                                EditorName: "SuperAdmin",
                                EditTime: "2020-08-15 18:10:07",
                            });
                        }
                        if (DateList.length > 0) {
                            alert("导入成功！");
                            $("#femi-riskLevel-tbody").html($com.util.template(DateList, HTML.TableModeTemp));
                        } else {
                            DateList = [];
                            alert("导入失败！");
                            $("#femi-riskLevel-tbody").html($com.util.template(DateList, HTML.TableModeTemp));
                        }


                    }

                });
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
            $("body").delegate(".writeContent input", "input", function () {
                $this = $(this);
                $this.attr("data-value", $this.val());
            });
        },

        run: function () {
            mQueryTaskID = 0;

            mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
            mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
            wUser = [];
            mUserObj = {};
            model.com.getFMCLine({ FactoryID: 0, BusinessUnitID: 0, WorkShopID: 0 }, function (resP) {
                for (var i = 0; i < resP.list.length; i++) {
                    if (resP.list[i].Active == 1) {
                        wLineList.push(resP.list[i]);
                    }
                }
                var selectLineID = $("#slpkLineID");
                model.com.ProcessingData(wLineList, selectLineID);
                model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (resW) {
                    for (var i = 0; i < resW.list.length; i++) {
                        if (resW.list[i].Active == 1) {
                            wWorkShopList.push(resW.list[i]);
                        }
                    }
                    var selectWorkShopID = $("#slpkWorkShopID");
                    model.com.ProcessingData(wWorkShopList, selectWorkShopID);

                    model.com.getUser({}, function (res) {
                        $.each(res.list, function (i, item) {
                            mUserObj[item.ID] = item.Name;
                            if (item.Active == 1) {
                                wUser.push(item);
                            }

                        });
                        model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
                    });
                });
            });

            $("#femi-riskLevel-tbody").html($com.util.template(DateList, HTML.TableModeTemp));
        },


        com: {
            unique: function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[i].PartNo == arr[j].PartNo && arr[i].LineName == arr[j].LineName && arr[i].WorkShopName == arr[j].WorkShopName) { //第一个等同于第二个，splice方法删除第二个
                            arr.splice(j, 1);
                            j--;
                        }
                    }
                }
                return arr;
            },
            ProcessingData: function (DataList, selectDate) {
                $(function () {
                    $(".selectpicker").selectpicker({
                        noneSelectedText: '请选择'//默认显示内容 
                    });
                    //数据赋值 
                    var select = selectDate;
                    DataList.unshift({
                        ID: 0,
                        Name: "请选择"
                    })
                    for (var i = 0; i < DataList.length; i++) {
                        Name = DataList[i].Name;
                        Value = DataList[i].ID;
                        select.append("<option value=" + Value + ">" + Name + "</option>");
                    }
                    $('.selectpicker').selectpicker('val', '');
                    $('.selectpicker').selectpicker('refresh');  //刷新数据源
                    $(".bootstrap-select-searchbox input").removeAttr("disabled");
                });
            },
            addCheck: function (Text) {
                _listCommitObj = $com.util.Clone(mCloneData);
                _listCommitObj.UpFlowID = _listCommitObj.UpFlowID + "";
                _listCommitObj.SubmitTime = $com.util.format("yyyy-MM-dd hh:mm", _listCommitObj.SubmitTime);


                var _IsWrite = true;
                for (var i = 0; i < wFormPropertyList.length; i++) {

                    if ($(".Write-Control-" + wFormPropertyList[i].Key + ":visible") && $(".Write-Control-" + wFormPropertyList[i].Key).hasClass("Select")) {
                        $(".Write-content-" + wFormPropertyList[i].Key).attr("data-value", $("#slpk" + wFormPropertyList[i].Key).selectpicker('val'));
                    }

                    var $WriteContent = $(".Write-content-" + wFormPropertyList[i].Key + ":visible");
                    if (!$WriteContent[0]) {
                        wFormPropertyList[i].Value = _listCommitObj[wFormPropertyList[i].Key];
                        wFormPropertyList[i].ValueText = _listCommitObj[wFormPropertyList[i].Key];
                        // if (!_listCommitObj[wFormPropertyList[i].Key]) {
                        //     alert(wFormPropertyList[i].Name + "必填，控件不存在!");
                        //     return false;
                        // }
                    } else {
                        wFormPropertyList[i].Value = $(".Write-content-" + wFormPropertyList[i].Key + ":visible").attr("data-value");

                        if ($(".Write-Control-" + wFormPropertyList[i].Key).hasClass("Select")) {
                            wFormPropertyList[i].ValueText = $("#slpk" + wFormPropertyList[i].Key).siblings(".bootstrap-select").find(".dropdown-toggle span").text();
                        } else if ($(".Write-Control-" + wFormPropertyList[i].Key).hasClass("Time")) {
                            wFormPropertyList[i].Value = $(".Write-content-" + wFormPropertyList[i].Key + ":visible").text();
                            wFormPropertyList[i].ValueText = $(".Write-content-" + wFormPropertyList[i].Key + ":visible").text();
                        } else if ($(".Write-Control-" + wFormPropertyList[i].Key).hasClass("Img")) {
                            if ($(".Write-Control-FileList").is(":visible")) {
                                var FilePath = [];
                                $(".Write-Control-FileList ul.upload-list li.upload-img .SrcDISplay").each(function (i, item) {
                                    var $Image = $(item),
                                        Src = $Image.attr("data-value");
                                    if (!FilePath)
                                        FilePath = [];
                                    FilePath.push(Src);
                                });
                                wFormPropertyList[i].Value = FilePath;
                                wFormPropertyList[i].ValueText = FilePath;
                                _listCommitObj.FileList = FilePath;
                            }
                            if ($(".Write-Control-CheckFileList").is(":visible")) {
                                var FilePath = [];
                                $(".Write-Control-CheckFileList ul.upload-list li.upload-img .SrcDISplay").each(function (i, item) {
                                    var $Image = $(item),
                                        Src = $Image.attr("data-value");
                                    if (!FilePath)
                                        FilePath = [];
                                    FilePath.push(Src);
                                });
                                wFormPropertyList[i].Value = FilePath;
                                wFormPropertyList[i].ValueText = FilePath;
                                _listCommitObj.CheckFileList = FilePath;
                            }
                        } else if ($(".Write-Control-" + wFormPropertyList[i].Key).hasClass("selectPeople")) {
                            wFormPropertyList[i].ValueText = $(".Write-content-" + wFormPropertyList[i].Key + ":visible").text();
                        } else {
                            wFormPropertyList[i].ValueText = $(".Write-content-" + wFormPropertyList[i].Key + ":visible").val();
                        }

                        if (wFormPropertyList[i].IsRequired && (!wFormPropertyList[i].Value || wFormPropertyList[i].Value == '' || wFormPropertyList[i].Value == '0')) {
                            alert(wFormPropertyList[i].Name + "必填!");
                            return false;
                        }
                    }
                    if (_IsWrite) {
                        _listCommitObj[wFormPropertyList[i].Key] = wFormPropertyList[i].Value;
                        _listCommitObj[wFormPropertyList[i].Key + "_txt_"] = $com.util.isEmpty(wFormPropertyList[i].ValueText + "") ? _listCommitObj[wFormPropertyList[i].Key] : wFormPropertyList[i].ValueText;
                    }
                }
                _listCommitObj.CheckResult = $("input[type='checkbox'].switch").attr("data-value");
                if (_listCommitObj.CheckResult == 0) {
                    _listCommitObj.CheckResult = 1;
                    _listCommitObj.CheckResult_txt_ = "";
                } else if (_listCommitObj.CheckResult == 1) {
                    _listCommitObj.CheckResult_txt_ = "合格";
                } else if (_listCommitObj.CheckResult == 2) {
                    _listCommitObj.CheckResult_txt_ = "不合格";
                }
                $com.util.deleteLowerProperty(_listCommitObj);
                $com.app.loaded();
                if (!confirm("是否" + Text + "生产遏制？")) {
                    return;
                }
                $com.app.loading("提交中!");
                model.com.postTask({ "TaskID": Todotasks.ID, "data": _listCommitObj }, [function (res) {
                    $com.app.loaded();
                    var currentTask = res.list;
                    $("#zace-exportApproval-commitReturn").click();
                    if (mQueryTaskID > 0) {
                        $("#zace-done").click();
                    }
                }, function (res1) {
                    $com.app.loaded();
                    $("#zace-exportApproval-commitReturn").click();

                }]);

            },
            //导入
            postImportExcel: function (data, fn, context) {
                var d = {
                    $URI: "/Upload/ImportExcel",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
            },
            //查询车间列表
            getFMCWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询产线列表
            getFMCLine: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLine/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            deleteProcessInstance: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESQMS",
                    $URI: "/Runtime/deleteProcessInstance",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //用人拿任务(单条)  ID 
            getEmployeeInfo: function (data, fn, context) {
                var d = {
                    $URI: "/BPMTask/Info",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //流程引擎 审批
            refreshCommitTableDone: function (StartTime, EndTime) {
                $com.app.loading();

                model.com.getEmployeeAll({
                    TagTypes: 4,
                    StartTime: StartTime,
                    EndTime: EndTime,
                    EventID: 2020,
                }, function (data) {
                    wData = [];
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].Status > 0) {
                            wData.push(data.list[i]);
                        }
                    }
                    wData = wData.sort(function (a, b) {
                        return a.CreateTime < b.CreateTime ? 1 : -1
                    });
                    for (var k = 0; k < wData.length; k++) {
                        if (wData[k].Status == 20) {
                            wData[k].StatusText = "已完成";
                        }
                        if (wData[k].Status == 21) {
                            wData[k].StatusText = "已撤销";
                        }
                        wData[k].CreateTimeText = $com.util.format('yyyy-MM-dd hh:mm', wData[k].CreateTime)
                        wData[k].SubmitTime = $com.util.format('yyyy-MM-dd hh:mm', wData[k].SubmitTime)
                    }

                    wDataDone = $com.util.Clone(wData);

                    $("#femi-zacePlanCommitDone-tbody").html($com.util.template(wData, HTML.TableModeCommitDetail));
                    $com.app.loaded();
                });


            },
            //流程引擎 处理
            refreshCommitTable: function (StartTime, EndTime) {
                $com.app.loading();

                model.com.getEmployeeAll({
                    TagTypes: 1,
                    StartTime: StartTime,
                    EndTime: EndTime,
                    EventID: 2020,
                }, function (data) {
                    wData = [];
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].Status > 0) {
                            wData.push(data.list[i]);
                        }
                    }
                    wData = wData.sort(function (a, b) {
                        return a.CreateTime < b.CreateTime ? 1 : -1
                    });
                    for (var k = 0; k < wData.length; k++) {
                        if (wData[k].Status == 20) {
                            wData[k].StatusText = "已完成";
                        }
                        if (wData[k].Status == 21) {
                            wData[k].StatusText = "已撤销";
                        }
                        wData[k].CreateTimeText = $com.util.format('yyyy-MM-dd hh:mm', wData[k].CreateTime)
                        wData[k].SubmitTime = $com.util.format('yyyy-MM-dd hh:mm', wData[k].SubmitTime)
                    }
                    wDataUnDone = $com.util.Clone(wData);
                    $("#femi-zacePlanCommit-tbody").html($com.util.template(wData, HTML.TableModeCommit));
                    $com.app.loaded();
                });
            },
            //流程引擎 发起
            refreshSend: function (StartTime, EndTime) {
                $com.app.loading();

                model.com.getEmployeeAll({
                    TagTypes: 2,
                    StartTime: StartTime,
                    EndTime: EndTime,
                    EventID: 2020,
                }, function (data) {
                    wData = [];
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].Status > 0) {
                            wData.push(data.list[i]);
                        }
                    }

                    wData = wData.sort(function (a, b) {
                        return a.CreateTime < b.CreateTime ? 1 : -1
                    });
                    for (var k = 0; k < wData.length; k++) {
                        if (wData[k].Status == 20) {
                            wData[k].StatusText = "已完成";
                        }
                        if (wData[k].Status == 21) {
                            wData[k].StatusText = "已撤销";
                        }
                        wData[k].CreateTimeText = $com.util.format('yyyy-MM-dd hh:mm', wData[k].CreateTime)
                        wData[k].SubmitTime = $com.util.format('yyyy-MM-dd hh:mm', wData[k].SubmitTime)
                    }
                    wDataSend = $com.util.Clone(wData);
                    $("#femi-zacePlanSend-tbody").html($com.util.template(wData, HTML.TableModeCommitDetail));
                    $com.app.loaded();
                });
            },

            //用人拿任务
            getEmployeeAll: function (data, fn, context) {
                var d = {
                    $URI: "/BPMTask/EmployeeAll",
                    $TYPE: "get",
                    $SERVER: "/MESQMS"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            getNextSFConditionByTaskId: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/getNextSFConditionByTaskId",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //根据流程定义ID和节点ID获取 ， 属性表信息
            getForm: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/getFormByPdIdAndActId",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            refreshTablePencilDetail: function (wID) {
                $com.app.loading('数据加载中...');
                var taskIDObj = {
                    key: "_2020"
                };

                model.com.getEmployeeInfo({
                    ID: wID,
                    EventID: 2020,
                    Code: "",
                }, function (data) {

                    wInfo = data.info;
                    wstatus = wInfo.Status;
                    wFlowID = data.info.FlowID;
                    wFlowType = data.info.FlowType;

                    ProcessInstanceID = data.info.FlowID;
                    $com.util.deleteLowerProperty(wInfo);
                    model.com.BuinessDetail(wInfo, 2);

                    model.com.getUser({}, function (res) {
                        $.each(res.list, function (i, item) {
                            mUserObj[item.ID] = item.Name;
                            if (item.Active == 1) {
                                wUser.push(item);
                            }

                        });

                        model.com.getBPMActivitiHisTaskByPIId({ processInstanceId: wFlowID }, function (resHisTask) {
                            wHisTaskList = resHisTask.list;
                            wFindTaskList = $com.util.Clone(wHisTaskList);
                            model.com.HisTaskShow(wHisTaskList);

                            DoneTask = [];
                            for (var k = 0; k < wFindTaskList.length; k++) {
                                if (wFindTaskList[k].HisTaskVarinstList.length > 0) {
                                    DoneTask.push(wFindTaskList[k]);
                                }
                            }
                            if (DoneTask.length == 1) {
                                $("#commit_cancel").show();
                            } else {
                                if (wFindTaskList[0].ActivitiID == wFindTaskList[wFindTaskList.length - 1].ActivitiID
                                    && Number(wFindTaskList[0].Assignee) == LoginID
                                    && Number(wFindTaskList[wFindTaskList.length - 1].Assignee) == LoginID) {
                                    $("#commit_cancel").show();
                                } else {
                                    $("#commit_cancel").hide();
                                }
                            }
                            if (wInfo.Status == 11 || wInfo.Status == 20 || wInfo.Status == 21) {
                                $("#commit_cancel").hide();
                            }
                            $com.app.loaded();
                        });
                    });

                });
            },

            refreshTablePencil: function (wID) {
                $com.app.loading('数据加载中...');
                var taskIDObj = {
                    key: "_2020"
                };
                if (mQueryTaskID <= 0) {
                    //启动任务 processDefinitionKey流程定义key
                    model.com.onTask({
                        processDefinitionKey: taskIDObj.key,
                        BusinessKey: "", data: {}
                    }, [function (data) {
                        //获取实例ID
                        mCloneData = data.data;
                        $com.util.deleteLowerProperty(mCloneData);

                        model.com.BuinessDetail(mCloneData, 1);
                        Todotasks = data.list[0];
                        model.com.RunTaskTwo(data.list[0]);
                    }, function () {
                        setTimeout(function () {
                            $('.zacePlanCommit').show();
                            $('.zacePlanTable').hide();
                            $('.zacePlanTableCommit').hide();
                            model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
                        }, 1000);
                    }]);
                } else {
                    model.com.getEmployeeInfo({
                        ID: wID,
                        EventID: 2020,
                        Code: "",
                    }, [function (data) {
                        if (data.msg.length != 0) {
                            alert(data.msg);
                            setTimeout(function () {
                                $('.zacePlanCommit').show();
                                $('.zacePlanTable').hide();
                                $('.zacePlanTableCommit').hide();
                                model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
                            }, 1000);
                        }

                        mCloneData = $com.util.Clone(data.info);
                        $com.util.deleteLowerProperty(mCloneData);
                        mCloneListRead = $com.util.Clone(mCloneData);
                        ProcessInstanceID = data.info.FlowID;
                        model.com.BuinessDetail(mCloneData, 2);


                        // 根据任务ID获取任务
                        model.com.getTask({ taskId: mQueryTaskID }, function (res) {
                            Todotasks = res.info;
                            if (Todotasks.Status != 0) {
                                alert("该任务已完成！");
                                setTimeout(function () {
                                    $('.zacePlanCommit').show();
                                    $('.zacePlanTable').hide();
                                    $('.zacePlanTableCommit').hide();
                                    model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
                                }, 1000);
                            }
                            // 根据流程实例ID 获取流程实例历史
                            model.com.getHistoryTask({ processInstanceId: Todotasks.ProcessInstanceId }, function (resP) {
                                mHistoryTask = resP.list;
                                model.com.RunTaskTwo(Todotasks);
                            });
                        });
                    }, function () {
                        setTimeout(function () {
                            $('.zacePlanCommit').show();
                            $('.zacePlanTable').hide();
                            $('.zacePlanTableCommit').hide();
                            model.com.refreshCommitTable(mZCommitStartTime, mZCommitEndTime);
                        }, 1000);
                    }]);
                }
            },
            BuinessDetail: function (wInfo, type) {
                wInfo.CreateTime = $com.util.format('yyyy-MM-dd hh:mm', wInfo.CreateTime);
                if (type == 1) {
                    $(".headerAll .BasicTable .FieldContentOne .Contentshow").text("待发起生产遏制");
                } else {
                    $(".headerAll .BasicTable .FieldContentOne .Contentshow").text(wInfo.StatusText);
                }
                wInfo.CreateTime = $com.util.format('yyyy-MM-dd hh:mm', wInfo.CreateTime);
                wInfo.SubmitTime = $com.util.format('yyyy-MM-dd hh:mm', wInfo.SubmitTime);
                if (wInfo.CheckResult == 0) {
                    wInfo.CheckResultName = "";
                } else if (wInfo.CheckResult == 1) {
                    wInfo.CheckResultName = "合格";
                } else if (wInfo.CheckResult == 2) {
                    wInfo.CheckResultName = "不合格";
                }
                var DetailList = [];
                var DetailBusiness = [];
                for (var i in wInfo) {
                    for (var k = 0; k < PropertyBasic.length; k++) {
                        if (PropertyBasic[k].TiTle == i && wInfo[i].length != 0) {
                            PropertyBasic[k].Value = wInfo[i];
                            DetailList.push(PropertyBasic[k]);
                        }
                    }

                    for (var k = 0; k < PropertyBusiness.length; k++) {
                        if (i == "FileList") {
                            var FileList = [];
                            var Temp = "";
                            for (var m = 0; m < wInfo[i].length; m++) {
                                if (wInfo[i][m].indexOf("jpg") != -1 || wInfo[i][m].indexOf("jpeg") != -1 || wInfo[i][m].indexOf("png") != -1 || wInfo[i][m].indexOf("gif") != -1) {
                                    Temp = Temp + '<img class="ShowImg" src=' + wInfo[i][m] + ' style="width: 30px;height: 30px;margin: 1px;"></img>'
                                } else if (wInfo[i][m].indexOf("txt") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/txt.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                } else if (wInfo[i][m].indexOf("doc") != -1 || wInfo[i][m].indexOf("docx") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/doc.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                } else if (wInfo[i][m].indexOf("xlsx") != -1 || wInfo[i][m].indexOf("xls") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/excel.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                } else if (wInfo[i][m].indexOf("pdf") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/pdf.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                }
                            }
                            if (Temp.length != 0) {
                                FileList.push({
                                    Name: "遏制描述附件",
                                    ImgList: Temp
                                });
                            }
                        } else if (i == "CheckFileList") {
                            var CheckFileList = [];
                            var Temp = "";
                            for (var m = 0; m < wInfo[i].length; m++) {
                                if (wInfo[i][m].indexOf("jpg") != -1 || wInfo[i][m].indexOf("jpeg") != -1 || wInfo[i][m].indexOf("png") != -1 || wInfo[i][m].indexOf("gif") != -1) {
                                    Temp = Temp + '<img class="ShowImg" src=' + wInfo[i][m] + ' style="width: 30px;height: 30px;margin: 1px;"></img>'
                                } else if (wInfo[i][m].indexOf("txt") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/txt.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                } else if (wInfo[i][m].indexOf("doc") != -1 || wInfo[i][m].indexOf("docx") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/doc.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                } else if (wInfo[i][m].indexOf("xlsx") != -1 || wInfo[i][m].indexOf("xls") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/excel.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                } else if (wInfo[i][m].indexOf("pdf") != -1) {
                                    Temp = Temp + '<img class="SrcDISplay" src="../static/images/checkbox/pdf.png"  style="width: 30px;height: 30px;margin: 1px;" data-value=' + wInfo[i][m] + '></img>'
                                }
                            }
                            if (Temp.length != 0) {
                                CheckFileList.push({
                                    Name: "遏制结果备注附件",
                                    ImgList: Temp
                                });
                            }
                        } else {
                            if (PropertyBusiness[k].TiTle == i && wInfo[i].length != 0) {
                                PropertyBusiness[k].Value = wInfo[i];
                                DetailBusiness.push(PropertyBusiness[k]);
                            }
                        }
                    }
                }

                if (DetailList.length % 2 == 0) {
                    $(".BasicTableContentBasic .BasicTable").html($com.util.template(DetailList, HTML.ReadOnlyTwo));
                } else {
                    var DateTwo = [];
                    var DateOne = DetailList[DetailList.length - 1];
                    for (var i = 0; i < DetailList.length - 1; i++) {
                        DateTwo.push(DetailList[i]);
                    }
                    $(".BasicTableContentBasic .BasicTable").html($com.util.template(DateTwo, HTML.ReadOnlyTwo));
                }
                if (DetailBusiness.length % 2 == 0) {
                    if (FileList.length > 0 && CheckFileList.length > 0) {
                        $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DetailBusiness, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyImg) + $com.util.template(CheckFileList, HTML.ReadOnlyImg));
                    } else if (FileList.length == 0 && CheckFileList.length == 0) {
                        $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DetailBusiness, HTML.ReadOnlyTwo));
                    } else {
                        $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DetailBusiness, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyOneImg) + $com.util.template(CheckFileList, HTML.ReadOnlyOneImg));
                    }
                } else {
                    var DateTwo = [];
                    var DateOne = DetailBusiness[DetailBusiness.length - 1];
                    for (var i = 0; i < DetailBusiness.length - 1; i++) {
                        DateTwo.push(DetailBusiness[i]);
                    }
                    if (FileList.length > 0 && CheckFileList.length > 0) {
                        $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DetailBusiness, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyImg) + $com.util.template(CheckFileList, HTML.ReadOnlyOneImg));
                    } else if (FileList.length == 0 && CheckFileList.length == 0) {
                        $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DateTwo, HTML.ReadOnlyTwo) + $com.util.template(DateOne, HTML.ReadOnlyOne));
                    } else {
                        $(".BasicTableContentBusiness .BasicTable").html($com.util.template(DetailBusiness, HTML.ReadOnlyTwo) + $com.util.template(FileList, HTML.ReadOnlyImg) + $com.util.template(CheckFileList, HTML.ReadOnlyImg));
                    }
                }
            },
            RunTaskTwo: function (Todotasks) {
                if (!Todotasks) {
                    alert("未获取到任务！");
                    return false;
                }
                mTaskID = Todotasks.ID;
                if (mQueryTaskID <= 0) {
                    if (Todotasks.HisTaskVarinstList.length > 0) {
                        model.com.HisTaskShow(Todotasks.HisTaskVarinstList);
                    } else {
                        $(".footer").hide();
                        $("#commit_route").hide();
                    }
                } else {
                    $(".footer").show();
                    $("#commit_route").show();
                    wHisTaskList = [];
                    for (var i = 0; i < mHistoryTask.length; i++) {
                        if (mHistoryTask[i].HisTaskVarinstList.length > 0) {
                            wHisTaskList.push(mHistoryTask[i]);
                        }
                    }
                    model.com.HisTaskShow(wHisTaskList);
                }
                var moveCarProcess = Todotasks.ProcessDefinitionId;
                //（通过任务ID获取当前任务节点出口顺序流条件信息）
                model.com.getNextSFConditionByTaskId({ taskId: mTaskID }, function (res) {
                    OperationsByTask = res.list;
                    OperationsByTask.sort(model.com.BpmOperationSort);

                    //获取按钮的id属性
                    idButtonArray = [];

                    $.each(OperationsByTask, function (i, item) {
                        if (!item.Documentation) {
                            return;
                        }
                        sonItem = item.Documentation.split(";");
                        for (var i = 0; i < sonItem.length; i++) {
                            if (sonItem[i] == "" || sonItem[i] == null || typeof (sonItem[i]) == undefined) {
                                sonItem.splice(i, 1);
                                i = i - 1;
                            }
                        }
                        $.each(sonItem, function (i_o, item_o) {
                            var obj_p = item_o.split(":");
                            item[obj_p[0]] = obj_p[1];
                        })
                        idButtonArray.push(item);
                    });
                    $(".zacePencil .zace-tree-header .pull-right .zace-button").html($com.util.template(idButtonArray, HTML.ButtonMode));

                    // 根据流程定义ID和节点ID获取 ， 属性表信息
                    model.com.getForm({ definitionId: moveCarProcess, activitiId: Todotasks.ActivitiID }, function (res) {
                        wForm = res.info;
                        mIsReadableList = [];
                        wFormPropertyList = wForm.FormProperty;

                        if (!styleControl) {
                            styleControl = document.createElement("style");
                            styleControl.type = "text/css";
                            $("head").append(styleControl);
                        }
                        var _styleText = "";

                        for (var i = 0; i < wForm.FormProperty.length; i++) {
                            $(".ds-head-" + wForm.FormProperty[i].Key).text(wForm.FormProperty[i].Name);
                            //将所有可写控件显示
                            if (wForm.FormProperty[i].IsWritable) {

                                _styleText += ".Write-Control-" + wForm.FormProperty[i].Key + "{display:block;} ";
                                _styleText += ".Write-Control-" + wForm.FormProperty[i].Key + "{display:flex;} ";
                                //所有可写并且必填项显示*号

                                if (wForm.FormProperty[i].IsRequired) {
                                    $(".Write-Control-" + wForm.FormProperty[i].Key + " .ds-head-show").text("*");
                                }
                                //用于数据回显
                                // $(".Write-content-" + wForm.FormProperty[i].Key).attr("data-value", mCloneData[wForm.FormProperty[i].Key]);
                                // $(".Write-content-" + wForm.FormProperty[i].Key).val(mCloneData[PropertyBasic[wForm.FormProperty[i].Key]]);

                            } else if (wForm.FormProperty[i].IsReadable) {
                                //取所有可读数据
                                mIsReadableList.push(wForm.FormProperty[i]);
                            }

                        }
                        $(styleControl).html(_styleText);

                        $com.app.loaded();
                    });
                });

            },
            BpmOperationSort: function (a, b) {

                var reg = /(\d+)$/g;
                //匹配正则获取小分组捕获结果
                var resultb = reg.exec(b.Id);
                if (resultb) {
                    resultb = resultb[1];
                } else {
                    resultb = 0;
                }
                reg = /(\d+)$/g;
                var resulta = reg.exec(a.Id);
                if (resulta) {
                    resulta = resulta[1];
                } else {
                    resulta = 0;
                }
                return resulta - resultb;

            },
            //根据流程实例ID 获取流程实例历史
            getHistoryTask: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/History/getBPMActivitiHisTaskByPIId",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //根据任务ID 获取任务
            getTask: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/History/getBPMActivitiHisTaskByTaskId",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            HisTaskShow: function (HisTaskArray) {
                var mode = {
                    NodeName: "",
                    Status: 0,
                    EndTime: "2010-01-01 00:00:00",
                    Executor: "",
                    Command: "",
                    HistoryTaskID: 0,
                };
                var data = [];

                $.each(HisTaskArray, function (i, item) {
                    var temp = $com.util.Clone(mode);
                    $.each(item.HisTaskVarinstList, function (k, item_k) {
                        $.each(item.OperationStep, function (p, item_p) {
                            if (item_k.VariableName == item_p.Name && item_k.Value == item_p.Value) {
                                item.StatusText = item_p.Documentation.split(';')[0].split(':')[1];
                            }
                        });
                        if (item_k.VariableName == 'Remark') {
                            item.Command = item_k.Value;
                        }
                    });
                    temp.HistoryTaskID = item.ID;
                    temp.NodeName = item.Name;
                    temp.Status = item.Status;
                    temp.StatusText = item.StatusText;
                    temp.Command = item.Command;
                    temp.Index = i + 1;

                    switch (item.Status) {
                        case 0:
                            temp.StatusName = '待执行';
                            break;
                        case 1:
                            temp.StatusName = item.StatusText;
                            break;
                        case 2:
                            if (item.deleteReason == '申请撤销') {
                                temp.StatusName = '已撤销';
                            } else {
                                temp.StatusName = '已关闭';
                            }

                            break;
                        case 3:
                            temp.StatusName = '已转发';
                            break;
                        default:
                            temp.StatusName = '-';
                            break;
                    }

                    // temp.StatusName = item.Status == 0 ? '待执行' : item.StatusText;
                    temp.EndTime = $com.util.format('yyyy-MM-dd hh:mm', new Date(item.EndTime)) < '2010-01-01' ? '--' : $com.util.format('yyyy-MM-dd hh:mm', new Date(item.EndTime));
                    temp.Executor = mUserObj[Number(item.Assignee)];
                    data.push(temp);
                });
                data.reverse();
                $charf.getbasicData(".zaceLiuchengPencil", data);

            },
            imgShow: function (outerdiv, innerdiv, bigimg, _this) {
                var src = _this.attr("src");//获取当前点击的pimg元素中的src属性  
                $(bigimg).attr("src", src);//设置#bigimg元素的src属性  

                /*获取当前点击图片的真实大小，并显示弹出层及大图*/
                $("<img/>").attr("src", src).on('load', function () {
                    var windowW = $(window).width();//获取当前窗口宽度  
                    var windowH = $(window).height();//获取当前窗口高度  
                    var realWidth = this.width;//获取图片真实宽度  
                    var realHeight = this.height;//获取图片真实高度  
                    var imgWidth, imgHeight;
                    var scale = 1;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放  

                    if (realHeight > windowH * scale) {//判断图片高度  
                        imgHeight = windowH * scale;//如大于窗口高度，图片高度进行缩放  
                        imgWidth = imgHeight / realHeight * realWidth;//等比例缩放宽度  
                        if (imgWidth > windowW * scale) {//如宽度扔大于窗口宽度  
                            imgWidth = windowW * scale;//再对宽度进行缩放  
                        }
                    } else if (realWidth > windowW * scale) {//如图片高度合适，判断图片宽度  
                        imgWidth = windowW * scale;//如大于窗口宽度，图片宽度进行缩放  
                        imgHeight = imgWidth / realWidth * realHeight;//等比例缩放高度  
                    } else {//如果图片真实高度和宽度都符合要求，高宽不变  
                        imgWidth = realWidth;
                        imgHeight = realHeight;
                    }
                    $(bigimg).css("width", imgWidth);//以最终的宽度对图片缩放  

                    var w = (windowW - imgWidth) / 2;//计算图片与窗口左边距  
                    var h = (windowH - imgHeight) / 2;//计算图片与窗口上边距  
                    $(innerdiv).css({ "top": h, "left": w });//设置#innerdiv的top和left属性  
                    $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg  
                });

                $(outerdiv).click(function () {//再次点击淡出消失弹出层  
                    $(this).fadeOut("fast");
                });
            },
            getBPMActivitiHisTaskByPIId: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/History/getBPMActivitiHisTaskByPIId",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询用户
            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //启动任务 （通过流程定义的标识Key 开启一个流程实例）
            onTask: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESQMS",
                    $URI: "/Runtime/startProcessByProcessDefinitionKey",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //完成待办任务，返回新生成的任务，更新业务服务器任务消息状态
            postTask: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESQMS",
                    $URI: "/Runtime/CompleteMyPersonalTask",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

        }
    }),

        model.init();


});