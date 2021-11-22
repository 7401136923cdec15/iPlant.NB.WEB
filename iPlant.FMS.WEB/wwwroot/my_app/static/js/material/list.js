require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		ShiftName,
		STATUS,
        zaModelList,
		COLOUR;
	zaModelList = [];
	ShiftName = [ "上班次", "本班次", "下班次" ];
	STATUS = [ "未完成", "已完成" ];

	COLOUR = [ "text-yellow", "text-blue" ];



	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{Id}}" data-check="{{Check}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			//'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text ms-margin">{{LineName}}</span>',
			'</span><span>{{Name}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">计划数:</span><span class="ms-text">{{C1}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">配料数:</span><span class="ms-text">{{C2}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">剩余数:</span><span class="ms-text">{{C3}}</span>',
			'</span>',

			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">物料号:</span><span class="ms-text">{{C4}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">配料员:</span><span class="ms-text">{{User}}</span>',
			'</span>',

			'</div>',
			'</div></div>',
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

			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = Number($this.attr("data-id")),
					check = Number($this.attr("data-check"));
                
				//for (var i = 0; i < zaModelList.length; i++) {
				//    if (id==zaModelList[i].ID) {

				//    }
				//}

				//if (check == 0) {
				    window.location = "info.html?id=" + id;
				//} else {
                //    alert("")
				//}


			});


		},

		run : function() {
			//var _shift_id = 20190626;
			//var _line_id = 1; 
			//if (window.JSImpl) { 
				 
			//	 _shift_id = window._shift_id;
			//	 _line_id =   window._line_id;
			//	//$("#ShiftName").html(ShiftName[Number(_shift_id) + 1]); 
				 
			//}
			this.com.getMaterialAll({
			   
			    EventID:5002,
			    StationID:0
				//person_judge : _person_judge,
				//position :7001
			}, function (data) {
			    zaModelList = data.list;
				model.com.render(model.com.filter(data.list));
			});


		},

		com : {
			get : function(data, fn, context) {
				var d = {
				    $URI: "/APSMaterial/All",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
            //主材 辅材
			getMaterialAll: function (data, fn, context) {
			    var d = {
			        $URI: "/MaterialTask/All",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
            //明细
			getMaterialItem: function (data, fn, context) {
			    var d = {
			        $URI: "/MaterialTask/Items",
			        $TYPE: "get"
			    };

			    function err() {
			        $com.app.tip('获取失败，请检查网络');
			    }

			    $com.app.ajax($.extend(d, data), fn, err, context);
			},
			filter : function(data) {
				var _data = [];
				$(data).each(function() {
					//if (this.MaterialMode != 1 && this.MaterialMode != "1")
					//	return true; //countiue;

				    this.Status = this.FQTYMargin > 0 ? 0 : 1;
				    this.Active = this.FQTYMargin > 0 ? 0 : 1;
					_data.push({
						Name : this.PartName ? this.PartName : this.PartPointName,
						User: this.PLOperatorName,
						LineName :this.LineName,
						//WorkShopName:this.WorkShopName,
						C1: this.FQTYPlan,
						C2: this.FQTYPL,
						C3: this.FQTYMargin,
					    C4 : this.MaterialNo,
						//C1: this.FQTYBase,//需求量
						//C2: this.FQTYPL,
						//C3: this.FQTYMargin,
						//C4: this.MaterialNo,
						Id : this.ID,
						Check:this.Active,
						Status :this.Active>-1? STATUS[this.Status]:"未激活",
						Color : this.Active>-1? COLOUR[this.Status] : "text-grey",
					});
				});

				return _data;
			},
			render : function(data) {
				$(".m-table").html($com.util.template(data, HTML.LIST));
			},
		}
	});

	model.init();

});