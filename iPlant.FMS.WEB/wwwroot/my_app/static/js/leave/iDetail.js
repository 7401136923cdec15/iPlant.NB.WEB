require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD,
		KEYWORD_LIST,
		LeaveModeI,
		LeaveModeN,
		STATUS,
		COLOUR,
		IsSubmit;

	IsSubmit = false;
	STATUS = [ "待审批", "已批准", "已驳回", "已销假", "已撤销" ];

	COLOUR = [ "text-blue", "text-green", "text-red", "text-grey", "text-grey" ];

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
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join("")
	};

	KEYWORD_LIST = [
		"ReasonMode|请假类型",
		"Employee|提交人",
		"SubmitTimeText|提交时间",
		"StartDateText|开始时间",
		"EndDateText|结束时间",
		"LeaveDays|请假天数",
		"Approver|审批人",
		"ApprovedTimeText|审批时间",
		"ReasonText|请假事由"

	];

	KEYWORD = {};

	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();

			KEYWORD_LIST.forEach(function(item, i) {
				var detail = item.split("|");
				KEYWORD[detail[0]] = {
					index : i,
					name : detail[1]
				};
			});
		},

		events : function() {

			$("body").delegate(".Reject", "click", function() {

				if (!model._data || IsSubmit)
					return;
				if (model._data.StartDate <= new Date()) {
					alert("已休假开始时间已过，此单据不可操作！");
					return;
				}


				if (!confirm("您将驳回此单据，是否确定？ ")) {
					return;
				}
				IsSubmit = true;
				model._data.Status = 2;
				model.com.approver({data:model._data}, function(res) {
					IsSubmit = false;
					alert("驳回成功!");
					window.location.reload();
				});

			});
			$("body").delegate(".Check", "click", function() {

				if (!model._data || IsSubmit)
					return;

				if (model._data.StartDate <= new Date()) {
					alert("已休假开始时间已过，此单据不可操作！");
					return;
				}

				if (!confirm("您将批准此单据，是否确定？ ")) {
					return;
				}
				IsSubmit = true;
				model._data.Status = 1;
				model.com.approver({data:model._data}, function(res) {
					IsSubmit = false;
					alert("批准成功!");
					window.location.reload();
				});

			});
		},

		run : function() {

			this.com.get({
				id : model.query.id
			}, function(data) {
				 
				
				switch (data.info.Status) {
				case 0:
					$("#BottomDiv").show();
					break;
				case 1:
					if (data.info.StartDate > new Date())
						$("#BottomDiv1").show();
					break;
				case 2:
					if (data.info.StartDate > new Date())
						$("#BottomDiv2").show();
					break;
				default:
					break;
				}

				model.com.render(model.com.filter(data.info));
			});

		},

		com : {
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
			approver : function(data, fn, context) {
				var d = {
					$URI : "/Leave/Submit", //批准
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			/*cancel : function(data, fn, context) {
				var d = {
					$URI : "/Leave/LeaveCancel",//撤销  、销假
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}
				
				$com.app.ajax($.extend(d, data), fn, err, context);
			},*/

			filter : function(item) {
				var _data = [],
					_status = STATUS[item.Status];

				
				item.SubmitTimeText=$com.util.format("yyyy-MM-dd hh:mm:ss", item.SubmitTime);
				item.StartDateText=$com.util.format("yyyy-MM-dd hh:mm", item.StartDate);
				item.EndDateText=$com.util.format("yyyy-MM-dd hh:mm", item.EndDate);
				item.ApprovedTimeText=$com.util.format("yyyy-MM-dd hh:mm:ss", item.ApprovedTime);
				
				model._data = item;
				for (var p in item) {
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : item[p] === "" ? "&nbsp;" : item[p] 
						};
					}
				}

				_data[0] = {
					name : "请假类型",
					value : LeaveModeN[LeaveModeI[item.ReasonMode]]
				};

				return {
					data : _data,
					status : _status
				};
			},
			render : function(data) {
				$(".m-c-body .m-detail-list").html($com.util.template(data.data, HTML.LIST));
				$(".m-tips .tip-content").html(data.status);
			}
		}
	});
 
	model.init();

});
//# sourceMappingURL=maps/iDetail-ee519e261f.js.map