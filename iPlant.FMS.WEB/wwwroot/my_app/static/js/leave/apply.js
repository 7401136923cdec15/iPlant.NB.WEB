require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/appTools' ], function($yang, $com, $tool) {




	var model,
		HTML,
		config,
		select_data,
		myScore = {},
		LETTER,
		formModel,
		LeaveModeI,
		LeaveModeN;

	select_data = [];


	LeaveModeI = {
		4001 : "year_leave",
		4002 : "business_leave",
		4003 : "sick_leave",
		4004 : "funeral_leave",
		4005 : "lactation_leave",
		4006 : "maternity_leave",
		4007 : "marriage_leave",
		4008 : "paternity_leave"
	};
	LeaveModeN = {
		year_leave : "年假",
		business_leave : "事假",
		sick_leave : "病假",
		funeral_leave : "丧假",
		lactation_leave : "哺乳假",
		maternity_leave : "产假",
		marriage_leave : "婚假",
		paternity_leave : "陪产假"
	};


	HTML = {
		OPTION : '<option value="{{value}}">{{name}}</option>',
		TYPE : [ '<li>',
			'<label class="col-flex clearfix" for="{{ID}}">',
			'<div class="col-item">',
			'<span>{{Name}}</span>',
			'</div>',
			'<div class="col-item">',
			'<div class="m-checkbox-box">',
			'<input type="radio" name="device"  select_id={{AID}} id="{{ID}}">',
			'<label for="{{ID}}"></label>',
			'</div>',
			'</div>',
			'</label>',
			'</li>' ].join("")
	};

	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		data : {},

		configure : function() {
			this.run();
		},

		events : function() {

			$(function() {

				var curr = new Date().getFullYear();

				$('.test_default_time').val('').scroller('destroy').scroller(
					$.extend(
						{
							preset : 'date',
							stepMinute : 5
						},
						{
							theme : "android-ics light",
							mode : "scroller",
							display : "bottom",
							lang : "zh"
						})
				);
			});

			$("body").delegate(".select_n", "click", function() {

				model._select = $(this).attr("id");
				if (!model._select)
					return;
				var _list = [];


				switch (model._select) {
				case "leave_type":
					for (var p in LeaveModeI) {
						_list.push({
							ID : LeaveModeI[p],
							AID : p,
							Name : LeaveModeN[LeaveModeI[p]]
						});
					}


					break;
				case "leave_approver":

					if (model._approverList && model._approverList.length) {
						_list = model._approverList;
					} else {
						model.com.getApprover({}, function(data) {
							if (data.list && data.list.length) {
								$(data.list).each(function() {
									_list.push({
										ID : "approver_" + this.ID,
										AID : this.ID,
										Name : this.Text
									});
								});
								if (_list && _list.length) {
									model._approverList = _list;
									$("#typeList ul").html($com.util.template(_list, HTML.TYPE));
								} else {
									return;
								}
								var _typeID = $("#" + model._select).attr("type-id");

								if (_typeID) {
									$("#typeList ul li input").each(function() {
										if (typeID == $(this).attr("select_id")) {
											$(this).attr('checked', 'checked');
										}
									});
								}
								$("#typeList").show();
							} else {
								alert("未获取到审批人！");
							}
						});
						return;
					}
					break;
				default:
					break;
				}


				if (_list && _list.length) {
					$("#typeList ul").html($com.util.template(_list, HTML.TYPE));
				} else {
					return;
				}
				var typeID = $("#" + model._select).attr("type-id");

				if (typeID) {
					$("#typeList ul li input").each(function() {
						if (typeID == $(this).attr("select_id")) {
							$(this).attr('checked', 'checked');
						}
					});
				}
				$("#typeList").show();
			});


			$("body").delegate("#typeList #getType", "click", function() {
				if (!model._select)
					return;

				var $state = $("#typeList ul li input:checked"),
					name = $state.parents(".col-item").siblings().find("span").text(),
					typeID = $state.attr("select_id");


				switch (model._select) {
				case "leave_type":
					if (!typeID) {
						alert("请选择请假类型");
						return;
					}
					break;
				case "leave_approver":
					if (!typeID) {
						alert("请选择审批人");
						return;
					}
					break;
				default:
					break;
				}


				$("#" + model._select).attr("type-id", typeID);
				$("#" + model._select).find(".w-option-content").text(name).addClass("text-darkgrey2");
				$("#typeList").hide();

			});
			$("body").delegate("#confirm", "click", function() {
				var _data = {},
					typeID = Number($("#leave_type").attr("type-id")),
					approverID = Number($("#leave_approver").attr("type-id")),
					approverName = $("#leave_approver").find(".w-option-content").text(),
					timeS = $("#start_time").val(),
					timeE = $("#end_time").val(),
					leavedays = Number($("#leave_days").val()),
					leaveexcuse = $("#leave_excuse").val();

				if (!typeID) {
					alert("请选择请假类型！");
					return;
				}
				if (!(approverID && approverName)) {
					alert("请选择审批人！");
					return;
				}
				if (!timeS) {
					alert("请选择开始时间！");
					return;
				}
				if (!timeE) {
					alert("请选择结束时间！");
					return;
				}
		 
				if (!leaveexcuse) {
					alert("请输入请假事由！");
					return;
				}



				var starttime = Date.parse(new Date(timeS));
				var endtime = Date.parse(new Date(timeE));


				if (endtime <= starttime) {
					alert("结束时间要大于开始时间！");
					return;
				}

				 

				if (model.query.ID) {
					_data = model._data;
				}
				_data.ApproverID = approverID;
				_data.Approver = approverName;
				_data.ReasonMode = typeID;
				_data.StartDate =$com.util.format("yyyy-MM-dd hh:mm:ss.S", starttime);
				_data.EndDate = $com.util.format("yyyy-MM-dd hh:mm:ss.S", endtime);
				_data.LeaveDays = ((endtime - starttime) / 86400000) + 1;
				_data.ReasonText = leaveexcuse;
				_data.Status = 0;

				if (_data) {
					model.com.add({data:_data}, function(res) {
						alert("提交成功");
						window.location = "list.html";

					});
				}

			});


		},

		run : function() {
			if (model.query.ID) {
				this.com.get({
					ID : model.query.ID
				}, function(data) {
					model.com.fill(data.info);
				});

			}
			this.com.getApprover({}, function(data) {
				if (data.list && data.list.length) {
					var _list = [];


					$(data.list).each(function() {
						_list.push({
							ID : "approver_" + this.ID,
							AID : this.ID,
							Name : this.Text
						});
					});

					model._approverList = _list;
				} else {
					alert("未获取到审批人！");
				}
			});

		},

		com : {
			add : function(data, fn, context) {
				var d = {
					$URI : "/Leave/Submit",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			get : function(data, fn, context) {
				var d = {
					$URI : "/Leave/Info",
					$TYPE : "get"
				};
				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			getApprover : function(data, fn, context) {
				var d = {
					$URI : "/Leave/Approver",
					$TYPE : "get"
				};
				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			fill : function(data) {

				model._data = data;
				$("#leave_type").attr("type-id", data.ReasonMode);
				$("#leave_type").find(".w-option-content").text(LeaveModeN[LeaveModeI[data.ReasonMode]]).addClass("text-darkgrey2");
				$("#leave_approver").attr("type-id", data.ApproverID);
				$("#leave_approver").find(".w-option-content").text(data.Approver).addClass("text-darkgrey2");
				$("#start_time").val($com.util.format("MM/dd/yyyy hh:mm", data.StartDate));
				$("#end_time").val($com.util.format("MM/dd/yyyy hh:mm", data.EndDate));
				$("#leave_days").val(data.LeaveDays);
				$("#leave_excuse").val(data.ReasonText);

			},
		}
	});

	model.init();
});
//# sourceMappingURL=maps/create2-141aed9460.js.map