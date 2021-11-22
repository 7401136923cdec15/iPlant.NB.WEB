
define([ '../jquery-3.1.1',
	'./base' ], function($yang, $com) {

	var util = $com.util;

	var HTML = {},
		state = 0,
		renderItem = null,
		TYPELIST = null,
		getItem = null,
		GIndex = 0,
		OBJ = {};

	var AOP = Array.prototype.push;

	var ARROW = [ '<svg width="11px" height="17px" viewBox="0 0 11 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
		'<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">',
		'<g transform="translate(-1675.000000, -680.000000)" fill="#C8C8C8">',
		' <g transform="translate(1668.000000, 680.000000)">',
		' <path d="M12.3333333,5.66666667 L3,5.66666667 L3,3 L13.6666667,3 L15,3 L15,15 L12.3333333,15 L12.3333333,5.66666667 Z" transform="translate(9.000000, 9.000000) scale(-1, 1) rotate(-135.000000) translate(-9.000000, -9.000000) "></path>',
		'</g>',
		' </g>',
		'</g>',
		'</svg>' ].join("");
	var ARROW_LG = [ '<svg width="15px" height="26px" viewBox="0 0 15 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
		'<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
		'<g transform="translate(-510.000000, -341.000000)" stroke="#BDBDBD" stroke-width="2">',
		'<g transform="translate(517.500000, 354.000000) rotate(-360.000000) translate(-517.500000, -354.000000) translate(510.000000, 341.000000)">',
		'<path d="M13.6388889,13.7272727 L1.36111111,24.6363636"></path>',
		'<path d="M2.80555556,1.54545455 L13.6388889,13.9090909"></path>',
		'</g></g></g></svg>' ].join("");

	HTML.PAGE = [ "<div class='pageList'",
		" v-name='{{Name}}'",
		" v-version='{{Version}}'",
		" d-name='{{DataPageName}}'",
		" d-version='{{DataPageVersion}}'",
		" call-id='{{PageValueIDModify}}' task-id='{{TaskID}}'>{{sheets}}</div>" ].join("");

	HTML.SHEET = [ "<div class='sheetList'",
		" key='{{Key}}'",
		" data-name='{{DataSheetName}}'",
		" data-version='{{DataSheetVersion}}'",
		" view-name='{{ViewSheetName}}'",
		" view-version='{{ViewSheetVersion}}'>{{groups}}</div>" ].join("");

	HTML.GROUP = "<div class='groupList' key='{{Key}}'>{{items}}</div>";

	HTML.ITEMS = {
		INPUT : [ '<div class="m-c-panel" mode="n-input" key="{{Name}}">',
			'<div class="m-c-head">{{Text}}{{Unit}}</div>',
			'<div class="m-c-body m-c-input clearfix">',
			'<input type="text" placeholder="请输入{{Text}}" value="{{defaultValue}}" regexp="{{regexp}}"></input>',
			'</div>',
			'</div>' ].join(""),
		LABEL : [ '<div class="m-c-panel" mode="n-label" key="{{Name}}">',
			'<div class="m-c-head">{{Text}}</div>',
			'<div class="m-c-body m-c-input clearfix">',
			'<span class="content" data-value="{{ItemValue}}">{{ItemValue}}{{Unit}}</span>',
			'</div>',
			'</div>' ].join(""),
		INVISIBLE : '<div class="m-c-panel" style="display:none;" mode="n-invisible" key="{{Name}}" value="{{Value}}"></div>',
		DATEPICKER : [ '<div class="m-c-panel" mode="n-datepicker" key={{Name}}>',
			'<div class="m-c-head">{{Text}}</div>',
			'<div class="m-c-body m-c-ring clearfix">',
			'<div class="w-option">',
			'<span class="w-option-content" data-value="{{ItemValue}}">{{ItemValue}}</span>',
			'<div class="w-option-icon">',
			ARROW_LG,
			'</div>',
			'</div>',
			'</div>',
			'</div>' ].join(""),
		WEB : [ '<div class="m-c-panel" mode="n-web" key="{{Name}}">',
			'<div class="m-c-head">{{Text}}</div>',
			'<div class="m-c-body m-c-input clearfix">',
			'<span class="content" style="word-break: break-all;" data-value="{{ItemValue}}">{{ItemValue}}</span>',
			'</div>',
			'</div>' ].join(""),

		//'+ ARROW +'
		QR : [ '<div class="m-c-panel" mode="{{Mode}}" key={{Name}}>',
			'<div class="m-c-head">{{Text}}</div>',
			'<div class="m-c-body m-c-device clearfix">',
			'<div class="m-col-4">',
			'<a href="javascript:;" class="btn btn-primary confirm {{state}}">扫码</a>',
			'</div>',
			'<div class="m-col-8 clearfix">',
			'<div class="w-option">',
			'<span class="w-option-content" data-value="{{Value}}">{{Value}}</span>',
			'<div class="w-option-icon"></div>',
			'</div>',
			'</div>',
			'</div>',
			'</div>' ].join(""),

		// n-select-radio 单选 / n-select-checkbox 多选
		SELECT : [ '<div class="m-c-panel" mode="{{Mode}}" key={{Name}}>',
			'<div class="m-c-head">{{Text}}</div>',
			'<div class="m-c-body m-c-ring clearfix" value-list="{{List}}">',
			'<div class="w-option">',
			'<span class="w-option-content" data-value="{{SelectList}}">{{Value}}</span>',
			'<div class="w-option-icon">',
			ARROW_LG,
			'</div>',
			'</div>',
			'</div>',
			'</div>' ].join(""),

		// n-select-view
		SELECT_VIEW : [ '<div class="m-c-panel" mode="n-select-view" key={{Name}}>',
			'<div class="m-c-head">{{Text}}</div>',
			'<div class="m-c-body m-c-ring clearfix" value-list="{{List}}">',
			'<div class="w-option">',
			'<span class="w-option-content" data-value="{{SelectList}}">{{Value}}</span>',
			'<div class="w-option-icon">',
			ARROW_LG,
			'</div>',
			'</div>',
			'</div>',
			'</div>' ].join(""),

		UPLOAD : {
			// n-upload-single n-upload-multi
			TMPL : [ '<div class="m-c-panel" mode="{{Mode}}" key={{Name}}>',
				'<div class="m-c-head">{{Text}}</div>',
				'<div class="m-c-body m-c-upload clearfix">',
				'<ul class="upload-list">',
				'{{List}}',
				'{{Add}}',
				'</ul>',
				'</div>',
				'</div>' ].join(""),
			// @TODO
			LI : '<li class="upload-btn"><input type="file" /></li>',
			IMG : '<li><img src="/upload/{{src}}" data-id="{{id}}" style="width: 100%; height: 100%;"/></li>'
		},

		TEXTAREA : [ '<div class="m-c-panel" mode="{{Mode}}" key={{Name}}>',
			'<div class="m-c-head">{{Text}}</div>',
			'<div class="m-c-body m-c-input clearfix">',
			'<textarea rows="4" readOnly="true"></textarea>',
			'</div>',
			'</div>' ],
		TEXTAREAEdit : [ '<div class="m-c-panel" mode="{{Mode}}" key={{Name}}>',
			'<div class="m-c-head">{{Text}}</div>',
			'<div class="m-c-body m-c-input clearfix">',
			'<textarea rows="4" placeholder="请输入{{Text}}"></textarea>',
			'</div>',
			'</div>' ],

		BTN : [ '<div class="call-m-btn">',
			'<a href="javascript:;" class="btn btn-primary confirm">到场确认</a>',
			'</div>' ].join("")
	};

	HTML.DIALOGS = {
		SELECT : [ '<div class="multi-box {{sid}}" style="display:block;">',
			'<div class="multi-select clearfix">',
			'<div class="multi-bg">',
			'<ul>{{list}}</ul>',
			'</div>',
			'</div>{{btn}}',
			'</div>' ].join(""),
		S_RADIO : [ '<li>',
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
			'</li>' ].join(""),
		S_CHECKBOX : [ '<li>',
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
			'</li>' ].join(""),

		BTN : {
			CLOSE : [ '<div class="multi-btn">',
				'<a href="javascript:;" class="btn btn-primary confirm">{{btn}}</a>',
				'</div>' ].join(""),
			CONFIRM : [ '<div class="multi-btn clearfix">',
				'<div class="multi-flex">',
				'<a href="javascript:;" class="btn close">取消</a>',
				'</div>',
				'<div class="multi-flex">',
				'<a href="javascript:;" class="btn btn-primary confirm">确定</a>',
				'</div>',
				'</div>' ].join("")
		},

		LIST : {
			MAIN : '<div class="com-collapse mb-30" style="height:{{height}}px;overflow-x:hidden;overflow-y:auto">{{groups}}</div>',
			GROUP : [ '<div class="w-select">',
				'<div class="w-select-view clearfix">',
				'<div class="w-select-text">',
				'<span class="w-select-main-text">{{name}}</span>',
				'<span class="w-select-sub-text text-blue"></span>',
				'<div class="w-select-icon"></div>',
				'</div>',
				'</div>',
				'<ul class="w-select-list" id="{{id}}">{{lists}}</ul>',
				'</div>' ].join(""),

			FILTER : [ '<div class="m-card" style=" padding:1vw">',
				'<input type="text" class="form-control femi-select-input" placeholder="请输入筛选字符"  />',
				'</div>' ].join(""),
			LI_R : [ '<li>',
				'<label for="{{ID}}">',
				'<div class="clearfix">',
				'<div class="m-l-col">',
				'<div class="m-checkbox-box">',
				'<input type="radio" name="employee" id="{{ID}}" data-name="{{name}}">',
				'<label for="{{ID}}"></label>',
				'</div>',
				'</div>',
				'<div class="m-l-col">',
				'<span>{{name}}</span>',
				'</div>',
				'</div>',
				'</label>',
				'</li>' ].join(""),
			LI_C : [ '<li>',
				'<label for={{ID}}>',
				'<div class="clearfix">',
				'<div class="m-l-col">',
				'<div class="m-checkbox-box">',
				'<input type="checkbox" name="employee" id="{{ID}}" data-name="{{name}}">',
				'<label for="{{ID}}"></label>',
				'</div>',
				'</div>',
				'<div class="m-l-col">',
				'<span>{{name}}</span>',
				'</div>',
				'</div>',
				'</label>',
				'</li>' ].join("")
		},
		IFRAME : '<iframe class="m-iframe" src="{{url}}" style="height:{{height}}px"></iframe>',
		IMG : '<div class="m-image"><img src="{{url}}"/></div>'
	};

	/* 树结构 */
	HTML.DIALOGS.MULTI_TREE = {
		TEMP : [ '<div class="multi-box" style="display:block;">',
			'<div class="multi-select clearfix">',
			'<div class="col-f">{{F}}</div>',
			'<div class="col-m">{{M}}</div>',
			'<div class="col-l">{{L}}</div>',
			'</div>',
			'<div class="multi-btn clearfix">',
			'<div class="multi-flex">',
			'<a href="javascript:;" class="btn close">取消</a>',
			'</div>',
			'<div class="multi-flex">',
			'<a href="javascript:;" class="btn btn-primary confirm">确定</a>',
			'</div>',
			'</div>' ].join(""),
		BOX : "<ul>{{content}}</ul>",
		F : "<li area-id='{{AreaID}}'>{{AreaName||AreaID}}</li>",
		//F : "<li area-id='{{workShopID}}'>{{workShopName||workShopID}}</li>",
		//M : "<li line-id='{{lineID}}'>{{lineName||lineID}}</li>",
		M : "<li line-id='{{LineID}}'>{{LineName||LineID}}</li>",
		MBOX : "<div area-id='{{AreaID}}'><ul>{{content}}</ul></div>",
		L_C : [ '<li>',
			'<label class="col-flex clearfix" for="{{iD}}">',
			'<div class="col-item">',
			'<span>{{deviceNo}}</span>',
			'</div>',
			'<div class="col-item">',
			'<div class="m-checkbox-box">',
			'<input type="checkbox" name="tree" id="{{iD}}" data-name="{{deviceNo}}">',
			'<label for="{{iD}}"></label>',
			'</div>',
			'</div>',
			'</label>',
			'</li>' ].join(""),
		L_R : [ '<li>',
			'<label class="col-flex clearfix" for="{{iD}}">',
			'<div class="col-item">',
			'<span>{{deviceNo}}</span>',
			'</div>',
			'<div class="col-item">',
			'<div class="m-checkbox-box">',
			'<input type="radio" name="tree" id="{{iD}}" data-name="{{deviceNo}}">',
			'<label for="{{iD}}"></label>',
			'</div>',
			'</div>',
			'</label>',
			'</li>' ].join(""),
		LBOX : "<div line-id='{{LineID}}'><ul>{{content}}</ul></div>"
	};

	HTML.WRAP = {
		MAIN : [ '<div class="view view-wrap" style="position:fixed;background:#fff;top:0;left:100%;z-index:9999;">',
			'<div class="m-menu m-blue-menu">',
			'<div class="m-left-area">',
			'<a class="m-btn" href="javascript:;"><svg width="19px" height="31px" viewBox="0 0 19 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
			'<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">',
			'<g transform="translate(-914.000000, -1368.000000)">',
			'<g transform="translate(916.000000, 1370.000000)" stroke="#FFFFFF" stroke-width="3" stroke-linecap="square">',
			'<path d="M14.5833333,0.409090909 L0.416666667,12.6818182"></path>',
			'<path d="M12.9166667,26.5909091 L0.416666667,12.6818182"></path>',
			'</g>',
			'</g>',
			'</g>',
			'</svg>{{cancel}}</a>',
			'</div>',
			'<div class="m-title">',
			'<a href="javascript:;" class="m-select">',
			'<span>{{title}}</span>',
			'</a>',
			'</div>',
			'<div class="m-right-area">{{btn}}</div>',
			'</div>{{content}}</div>' ].join(""),
		BTN : '<a class="m-btn {{classname}}" href="javascript:;">{{name}}</a>'
	};

	/*
                1 布尔型
                2 数字型
                3 字符串
                4 日期
             */
	TYPELIST = {
		Bool : getBool,
		Byte : getNumber,
		String : getString,
		Int16 : getNumber,
		Int32 : getNumber,
		Int64 : getNumber,
		Float : getNumber,
		Double : getNumber,
		Int32List : getNumber,
		StringList : getString,
		DateTime : function(v) {
			return v;
		}
	};

	function each(obj, cb) {
		for (var i in obj) {
			cb(obj[i], i, obj);
		}
	}

	function getBool(v) {
		if (v === "true") {
			return true;
		} else if (v === "false") {
			return false;
		} else {
			return Boolean(v);
		}
	}
	//自带事件  选择筛选事件
	$("body").delegate(".com-collapse input.femi-select-input", "change", function() {
		var $this = $(this),
			value = $this.val();
		$this.parent().nextAll(".w-select").each(function(i, item) {
			var $item = $(item),
				$uncheckedAll = $item.find("ul.w-select-list .m-checkbox-box input:not(input:checked)");

			$item.show();

			$uncheckedAll.each(function(s_i, s_item) {

				var name = $(s_item).attr("data-name");

				if (name.indexOf(value) < 0) {
					$(s_item).closest("li").hide();
				} else {
					$(s_item).closest("li").show();
				}

			});

			if (!$item.find("ul.w-select-list li:visible")[0]) {
				$item.hide();
			}
		});
	});

	function getNumber(v) {
		return Number(v);
	}

	function getString(v) {
		return String(v);
	}


	//构造函数
	function FormRender($parent, data, option) {
		if (!this instanceof FormRender) {
			return new FormRender($parent, data, option);
		}

		this.$parent = $parent;
		this.id = option.call_id;
		this._data = option.data;
		this.render(data);
	}

	FormRender.prototype.render = function(data, $parent) {
		$parent = $parent || this.$parent; //js中前一个为true后面不会执行  这里判断的是传入空就用构造函数中的
		if (state === 0) {
			state = 1;
			FormEventsBind(this._data); //为表单数据添加事件 使用设备列表和员工列表
		}
		//表单数据写入page_html
		var page_html = util.template({
			Name : data.Name,
			Version : data.Version,
			DataPageName : data.DataPageName || "",
			DataPageVersion : data.DataPageVersion || "",
			PageValueIDModify : this.id,
			RecordID : "",
			TaskID : data.TaskID,
			sheets : render_sheet(data.SheetDefineList)
		}, HTML.PAGE);

		$parent.find(".pageList").remove();
		$parent.append(page_html);
	};

	FormRender.prototype.getData = function($parent) {
		var data = {};
		$parent = $parent || this.$parent;
		var $page = $parent.find(".pageList");

		data.RecordID = null;
		data.ViewPageName = $page.attr("v-name");
		data.ViewPageVersion = Number($page.attr("v-version"));
		data.DataPageName = $page.attr("d-name");
		data.DataPageVersion = Number($page.attr("d-version"));
		data.PageValueIDModify = Number($page.attr("call-id"));
		data.SheetValues = getSheetList($page.find(".sheetList"));

		return data;
	};

	function getSheetList($sheet) {
		var arr = [];
		$sheet.each(function() {
			var $this = $(this),
				_obj = {};

			_obj.Key = $this.attr("key");
			_obj.Value = {
				"DataSheetName" : $this.attr("data-name"),
				"DataSheetVersion" : $this.attr("data-version"),
				"ViewSheetName" : $this.attr("view-name"),
				"ViewSheetVersion" : $this.attr("view-version"),
				"ItemValues" : getItemsList($this.find(".groupList"))
			};

			arr.push(_obj);
		});

		return arr;
	}

	function getItemsList($groups) {
		var arr = [],
			_;

		_ = util.each($groups, function(items, i) {
			var $items = $(items).find(".m-c-panel");
			var _result = util.each($items, function(item, j) {
				var $this = $(item),
					mode = $this.attr("mode"),
					result,
					fn;

				fn = getItem[mode];

				if (fn) {
					result = getItem[mode]($this);

					if (result.r === false) {
						return false; //break
					} else {
						arr.push(result.obj);
					}
				}
			});

			if (_result === false) {
				return false; //break
			}
		});

		if (_ === false) {
			return false; //break
		} else {
			return arr;
		}
	}

	function getSelect(node) {
		var key = node.attr("key"),
			value = node.find(".w-option-content").attr("data-value");

		if (value == "") {
			alert("请选择" + node.find(".m-c-head").text());
			return {
				r : false
			};
		} else {
			return {
				r : true,
				obj : {
					Key : key,
					Value : value.split(",")
				}
			};
		}
	}

	getItem = {
		"n-select-checkbox" : function(node) {
			return getSelect(node);
		},
		"n-device-radio" : function(node) {
			return getSelect(node);
		},
		"n-device-checkbox" : function(node) {
			return getSelect(node);
		},
		"n-employee-radio" : function(node) {
			return getSelect(node);
		},
		"n-employee-checkbox" : function(node) {
			return getSelect(node);
		},
		/*"n-select-view":function(node) {
                    return getSelect(node);
                },*/
		"n-select-radio" : function(node) {
			return getSelect(node);
		},
		"n-upload-single" : function(node) {
			var name = node.find(".m-c-head").text(),
				$list = node.find(".upload-list > li"),
				arr = [];

			if ($list.length === 1 && $($list.get(0)).find("img").length === 0) {
				if (confirm("没有上传图片,是否直接提交")) {
					return {
						r : true,
						obj : {
							Key : node.attr("key"),
							Value : arr
						}
					};
				} else {
					return {
						r : false
					};
				}
			}

			$list.each(function() {
				var item = $(this).find("img");

				if (item.length === 1) {
					arr.push(item.attr("data-id"));
				}

			});

			return {
				r : true,
				obj : {
					Key : node.attr("key"),
					Value : arr
				}
			};

		},
		"n-upload-multi" : function(node) {
			var name = node.find(".m-c-head").text(),
				$list = node.find(".upload-list > li"),
				arr = [];

			if ($list.length === 1 && $($list.get(0)).find("img").length === 0) {
				if (confirm("没有上传图片,是否直接提交")) {
					return {
						r : true,
						obj : {
							Key : node.attr("key"),
							Value : arr
						}
					};
				} else {
					return {
						r : false
					};
				}
			}

			$list.each(function() {
				var item = $(this).find("img");

				if (item.length === 1) {
					arr.push(item.attr("data-id"));
				}

			});

			return {
				r : true,
				obj : {
					Key : node.attr("key"),
					Value : arr
				}
			};
		},

		"n-input" : function(node) {
			var ipt = node.find("input"),
				val = $.trim(ipt.val()),
				reg = ipt.attr("regexp"),
				name = node.find(".m-c-head").text();

			if (val === "") {
				alert("请输入" + name);
				return {
					r : false
				};
			} else if (reg && !(new RegExp(reg).test(val))) {
				alert(name + "内容输入不正确");
				return {
					r : false
				};
			} else {
				return {
					r : true,
					obj : {
						Key : node.attr("key"),
						Value : val
					}
				};
			}
		},

		"n-invisible" : function(node) {
			var val = node.attr("value");

			return {
				r : true,
				obj : {
					Key : node.attr("key"),
					Value : OBJ[val]
				}
			};
		},

		"n-qr" : function(node) {
			var key = node.attr("key"),
				name = node.find(".m-c-head").text(),
				val = node.find(".w-option-content").attr("data-value");

			if (val == "") {
				alert("请扫码");
				return {
					r : false
				};
			} else {
				return {
					r : true,
					obj : {
						Key : node.attr("key"),
						Value : val
					}
				};
			}
		},
		"n-label" : function(node) {
			var key = node.attr("key"),
				name = node.find(".m-c-head").text(),
				val = node.find(".content").attr("data-value");

			return {
				r : true,
				obj : {
					Key : key,
					Value : val
				}
			};
		},

		"n-textarea" : function(node) {
			var ipt = node.find("textarea"),
				val = $.trim(ipt.val()),
				name = node.find(".m-c-head").text();

			if (val === "") {
				alert("请输入" + name);
				return {
					r : false
				};
			} else {
				return {
					r : true,
					obj : {
						Key : node.attr("key"),
						Value : val
					}
				};
			}
		},
	};


	function FormEventsBind(data) {
		$("body")
			// 多选
			.delegate(".m-c-panel[mode=n-select-checkbox] .m-c-body", "click", function(e) {
				var $self = $(this),
					list = split2Object($self.attr("value-list")),
					selected = $self.find(".w-option-content").attr("data-value"),
					str = "",
					$box = null;

				util.each(list, function(item, i) {
					item.disabled = "";
					str += util.template(item, HTML.DIALOGS.S_CHECKBOX);
				});

				$box = util.template({
					list : str,
					sid : "bindOne",
					btn : util.template({
						btn : "确认"
					}, HTML.DIALOGS.BTN.CONFIRM)
				}, HTML.DIALOGS.SELECT);

				$box = $($box);

				$("body").append($box);

				selected = selected ? selected.split(",") : [];
				util.each(selected, function(item, i) {
					//$box.find("input[data-value="+ item  +"]").prop("checked", true);
					$box.find("input").each(function() {
						var $this = $(this);

						if ($this.attr("data-value") == item) {
							$this.prop("checked", true);
						}
					});
				});

				$box.find(".confirm").on("click", function() {
					var _v = [],
						_name = [];
					$checked = $box.find("input:checked");

					if ($checked.length === 0) {
						alert("请选择");
						return;
					}

					$box.find("input:checked").each(function() {
						_v.push($(this).attr("data-value"));
						_name.push($(this).attr("data-name"));
					});

					$self.find(".w-option-content")
						.attr("data-value", _v)
						.text(_name)
						.addClass("text-darkgrey2");

					$(this).unbind("click");
					$box.remove();
				});

				$box.find(".close").on("click", function() {
					$box.find(".confirm").off("click");
					$(this).off("click");
					$box.remove();
				});

				// 弹出层隐藏
				$(".bindOne").on("click", function(e) {
					var tar = $(e.target);

					if (tar.hasClass("multi-select")) {
						$box.find(".confirm").unbind("click");
						tar.parent().remove();
						$(this).off("click");
					}
				});
			})

			// 单选
			.delegate(".m-c-panel[mode=n-select-radio] .m-c-body", "click", function(e) {
				var $self = $(this),
					list = split2Object($self.attr("value-list")),
					selected = $self.find(".w-option-content").attr("data-value"),
					str = "",
					$box = null;

				util.each(list, function(item, i) {
					item.disabled = "";
					str += util.template(item, HTML.DIALOGS.S_RADIO);
				});

				$box = util.template({
					list : str,
					sid : "bindOne",
					btn : util.template({
						btn : "确认"
					}, HTML.DIALOGS.BTN.CONFIRM)
				}, HTML.DIALOGS.SELECT);

				$box = $($box);

				$("body").append($box);

				selected = selected ? selected.split(",") : [];
				util.each(selected, function(item, i) {
					//$box.find("input[data-value="+ item +"]").prop("checked", true);
					$box.find("input").each(function() {
						var $this = $(this);

						if ($this.attr("data-value") == item) {
							$this.prop("checked", true);
						}
					});
				});

				$box.find(".confirm").on("click", function() {
					var _v = [],
						_name = [];
					$checked = $box.find("input:checked");

					if ($checked.length === 0) {
						alert("请选择");
						return;
					}

					$box.find("input:checked").each(function() {
						_v.push($(this).attr("data-value"));
						_name.push($(this).attr("data-name"));
					});

					$self.find(".w-option-content")
						.attr("data-value", _v)
						.text(_name)
						.addClass("text-darkgrey2");

					$(this).unbind("click");
					$box.remove();
				});

				$box.find(".close").on("click", function() {
					$box.find(".confirm").off("click");
					$(this).off("click");
					$box.remove();
				});

				// 弹出层隐藏
				$(".bindOne").on("click", function(e) {
					var tar = $(e.target);

					if (tar.hasClass("multi-select")) {
						$box.find(".confirm").unbind("click");
						tar.parent().remove();
						$(this).off("click");
					}
				});
			})

			// 展示
			.delegate(".m-c-panel[mode=n-select-view] .m-c-body", "click", function(e) {
				var $self = $(this),
					list = split2Object($self.attr("value-list")),
					selected = $self.find(".w-option-content").attr("data-value"),
					str = "",
					$box = null;

				util.each(list, function(item, i) {
					item.disabled = "disabled=disabled";
					str += util.template(item, HTML.DIALOGS.S_CHECKBOX);
				});

				$box = util.template({
					list : str,
					sid : "bindOne",
					btn : util.template({
						btn : "关闭"
					}, HTML.DIALOGS.BTN.CLOSE)
				}, HTML.DIALOGS.SELECT);

				$box = $($box);

				$("body").append($box);

				selected = selected ? selected.split(",") : [];
				util.each(selected, function(item, i) {
					//$box.find("input[data-value="+ item +"]").prop("checked", true);
					$box.find("input").each(function() {
						var $this = $(this);

						if ($this.attr("data-value") == item) {
							$this.prop("checked", true);
						}
					});
				});

				$box.find(".confirm").on("click", function() {
					$(this).unbind("click");
					$box.remove();
				});

				// 弹出层隐藏
				$(".bindOne").on("click", function(e) {
					var tar = $(e.target);

					if (tar.hasClass("multi-select")) {
						$box.find(".confirm").unbind("click");
						tar.parent().remove();
						$(this).off("click");
					}
				});
			})

			//图片上传
			.delegate(".m-c-panel[mode=n-upload-multi] input,.m-c-panel[mode=n-upload-single] input", "change", function() {
				var self = this,
					_data = self.files[0];

				if (_data) {
					// if (_data.size > (1024 * 1024 * 10)) {
					// 	alert("请上传小于10M的图片！");
					// 	clearFiles();
					// 	return;
					// }

					// if (!extLimit(['jpg', 'png', 'gif', 'bmp', 'jpeg']).has(_data.name)) {
					// 	alert("请上传正确的图片！");
					// 	clearFiles();
					// 	return;
					// }

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
							$p.before(util.template({
								src : data.returnObject.file_url,
								id : data.returnObject.file_id
							}, HTML.ITEMS.UPLOAD.IMG));
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
			})

			// 预览图片
			.delegate(".upload-list li img", "click", function() {
				var url = $(this).attr("src");

				var $node = $(util.template({
					cancel : "关闭",
					title : "查看图片",
					btn : "",
					content : util.template({
						url : url
					}, HTML.DIALOGS.IMG)
				}, HTML.WRAP.MAIN));

				$node.find(".m-left-area .m-btn").one("click", function() {
					$node.css("left", "100%");
					setTimeout(function() {
						$node.remove();
					}, 1000);
				});

				$('body').append($node);

				setTimeout(function() {
					$node.css("left", 0);
				}, 200);
			})

			// 地址查看
			.delegate(".m-c-panel[mode=n-web] .content", "click", function() {
				var url = $(this).attr("data-value"),
					selected = $self.find(".w-option-content").attr("data-value"),
					wh = $(window).height(),
					ww = $(window).width(),
					h = wh - (ww / 100) * 15;
				//console.log(wh, h);
				var $node = $(util.template({
					cancel : "关闭",
					title : "网页浏览",
					btn : "",
					content : util.template({
						url : url,
						height : h
					}, HTML.DIALOGS.IFRAME)
				}, HTML.WRAP.MAIN));

				$node.find(".m-left-area .m-btn").one("click", function() {
					$node.css("left", "100%");
					setTimeout(function() {
						$node.remove();
					}, 1000);
				});

				$('body').append($node);

				setTimeout(function() {
					$node.css("left", 0);
				}, 200);
			})

			// 员工选择
			.delegate(".m-c-panel[mode=n-employee-radio] .m-c-body, .m-c-panel[mode=n-employee-checkbox] .m-c-body", "click", function() {
				var $this = $(this),
					mode = $this.parents(".m-c-panel").attr("mode"),
					selected = $this.find(".w-option-content").attr("data-value"),
					wh = $(window).height(),
					ww = $(window).width(),
					h = wh - (ww / 100) * 15;
				;

				if (mode === "n-employee-radio") {
					mode = 1;
				} else {
					mode = 2;
				}

				if (!data.employeeList) {
					alert("获取员工列表失败！");
					return;
				}

				var $node = $(util.template({
					cancel : "关闭",
					title : "员工选择",
					btn : util.template({
						classname : "confirm",
						name : "确认"
					}, HTML.WRAP.BTN),
					// 生成分组
					content : util.template({
						groups : (function(list) {

							var groupss = {};

							util.each(list, function(item, i) {

								var _item = {
									ID : item.iD,
									name : item.name
								}

								item.GroupName = item.department;
								item.GroupName = item.department;

								if (!groupss[item.departmentID])
									groupss[item.departmentID] = {
										name : item.department,
										id : "d_" + item.departmentID,
										lists : [ _item ]
									};
								else
									groupss[item.departmentID].lists.push(_item);
							})

							var group_s = [];
							for (var key in groupss) {

								groupss[key].lists = util.template(groupss[key].lists, mode === 1 ? HTML.DIALOGS.LIST.LI_R : HTML.DIALOGS.LIST.LI_C);
								group_s.push(groupss[key]);
							}
							var groups = util.template(group_s, HTML.DIALOGS.LIST.GROUP);

							groups = HTML.DIALOGS.LIST.FILTER + groups;
							/*
							util.each(list, function(item, i) {

								if (!groupss[item.departmentID])
									groupss[item.departmentID] = [ item ];
								else
									groupss[item.departmentID].push(item);


								//生成列表
								groups += util.template({
									name : item.GroupName,
									id : item.GroupID,
									lists : (function(ulist) {
										var lists = "";
										util.each(ulist, function(user, j) {
											lists += util.template({
												ID : user.ID,
												name : user.Name
											}, mode === 1 ? HTML.DIALOGS.LIST.LI_R : HTML.DIALOGS.LIST.LI_C);
										});

										return lists;
									})(item.UserList)
								}, HTML.DIALOGS.LIST.GROUP);
							});*/

							return groups;
						})(data.employeeList),
						height : h
					}, HTML.DIALOGS.LIST.MAIN)
				}, HTML.WRAP.MAIN));

				$node.find(".m-left-area .m-btn").one("click", close);

				$node.find(".m-right-area .confirm").on("click", function() {
					var $employee = $node.find(".com-collapse .m-checkbox-box input:checked"),
						IDList = [],
						nameList = [];
					if ($employee.length === 0) {
						alert("请选择员工");
						return;
					} else {
						$employee.each(function(i, item) {
							item = $(item);
							IDList.push(item.attr("id"));
							nameList.push(item.attr("data-name"));
						});

						$this.find(".w-option-content")
							.attr("data-value", IDList.join(",")).text(nameList.join(","))
							.addClass("text-darkgrey2");
						close();
					}
				});

				$('body').append($node);

				selected = selected ? selected.split(",") : [];
				util.each(selected, function(item, i) {
					$node.find("input[id=" + item + "]").prop("checked", true);
				});

				setTimeout(function() {
					$node.css("left", 0);
				}, 200);

				function close() {
					$node.css("left", "100%");
					$node.find(".m-right-area .confirm").off("click");
					setTimeout(function() {
						$node.remove();
					}, 1000);
				}
			})

			// 设备选择
			.delegate(".m-c-panel[mode=n-device-radio] .m-c-body, .m-c-panel[mode=n-device-checkbox] .m-c-body", "click", function() {
				var $this = $(this),
					mode = $this.parents(".m-c-panel").attr("mode"),
					selected = $this.find(".w-option-content").attr("data-value");

				if (mode === "n-device-radio") {
					mode = 1;
				} else {
					mode = 2;
				}

				if (!data.deviceList) {
					alert("获取设备列表失败！");
					return;
				}

				var p1 = "",
					p2 = "",
					p3 = "";

				var shops = {};

				var Shops_P = [];

				$.each(data.deviceList, function(i, item) {

					if (!shops[item.workShopID]) {
						shops[item.workShopID] = {};
						shops[item.workShopID][item.lineID] = [ item ];

						Shops_P.push({
							AreaID : item.workShopID,
							AreaName : item.workShopName,
							LineDeviceList : [ {
								LineID : item.lineID,
								LineName : item.lineName,
								DeviceList : [ item ]
							} ]
						});
					} else if (!shops[item.workShopID][item.lineID]) {
						shops[item.workShopID][item.lineID] = [ item ];

						for (var key in Shops_P) {
							if (Shops_P[key].AreaID != item.workShopID)
								continue;
							Shops_P[key].LineDeviceList.push({
								LineID : item.lineID,
								LineName : item.lineName,
								DeviceList : [ item ]
							});
						}
					} else {
						shops[item.workShopID][item.lineID].push(item);
						for (var key in Shops_P) {
							if (Shops_P[key].AreaID != item.workShopID)
								continue;
							for (var linekey in Shops_P[key].LineDeviceList) {
								if (Shops_P[key].LineDeviceList[linekey].LineID != item.lineID)
									continue;

								Shops_P[key].LineDeviceList[linekey].DeviceList.push(item)
							}
						}
					}
				})


				$.each(Shops_P, function() {
					var device_scope = this,
						_p2 = "";
					p1 += util.template(this, HTML.DIALOGS.MULTI_TREE.F);

					$.each(this.LineDeviceList, function() {
						var line_scope = this,
							_p3 = "";
						_p2 += util.template(this, HTML.DIALOGS.MULTI_TREE.M)

						$.each(this.DeviceList, function() {
							_p3 += util.template(this, mode === 1 ? HTML.DIALOGS.MULTI_TREE.L_R : HTML.DIALOGS.MULTI_TREE.L_C);
						});

						p3 += util.template({
							content : _p3,
							LineID : line_scope.lineID
						}, HTML.DIALOGS.MULTI_TREE.LBOX);
					});

					p2 += util.template({
						content : _p2,
						AreaID : device_scope.workShopID
					}, HTML.DIALOGS.MULTI_TREE.MBOX);
				});

				var $box = $(util.template({
					F : util.template({
						content : p1
					}, HTML.DIALOGS.MULTI_TREE.BOX),
					M : p2,
					L : p3
				}, HTML.DIALOGS.MULTI_TREE.TEMP));

				$("body").append($box);

				$box.find(".confirm").on("click", function() {
					var $list = $box.find(".col-l input:checked"),
						IDList = [],
						nameList = [];
					if ($list.length === 0) {
						alert("请选择设备");
						return;
					}

					$list.each(function(i, item) {
						item = $(item);
						IDList.push(item.attr("id"));
						nameList.push(item.attr("data-name"));
					});

					$this.find(".w-option-content")
						.attr("data-value", IDList.join(",")).text(nameList.join(","))
						.addClass("text-darkgrey2");

					$(this).unbind("click");
					$box.off("click");
					$box.remove();
				});

				$box.delegate(".col-f li", "click", function() {
					var $this = $(this),
						id = $this.attr("area-id"),
						$line = $box.find(".col-m div[area-id=" + id + "]");

					$this.siblings().removeClass("active");
					$this.addClass("active");
					$line.show().siblings().hide();
					$line.find("li:first-child").click();

				}).delegate(".col-m li", "click", function() {
					var $this = $(this),
						id = $this.attr("line-id"),
						$line = $box.find(".col-l div[line-id=" + id + "]");

					$this.siblings().removeClass("active");
					$this.addClass("active");

					$line.show().siblings().hide();

				});

				$box.find(".col-f li:first-child").click();

				selected = selected ? selected.split(",") : [];
				util.each(selected, function(item, i) {
					$box.find("input[id=" + item + "]").prop("checked", true);
				});

				$box.find(".close").on("click", function() {
					$box.find(".confirm").off("click");
					$(this).off("click");
					$box.remove();
				});

				// 弹出层隐藏
				$(".bindOne").on("click", function(e) {
					var tar = $(e.target);

					if (tar.hasClass("multi-select")) {
						$box.find(".confirm").unbind("click");
						tar.parent().remove();
						$(this).off("click");
					}
				});
			})

			// 二维码
			.delegate(".m-c-panel[mode=n-qr] .confirm:not(.disabled)", "click", function() {
				var $this = $(this),
					_default = $this.attr("data-default");

				window.QRTEST = function(val) {

					if (_default && _default != val) {
						alert("设备不符");
						return;
					}

					$this.parent().siblings()
						.find(".w-option-content")
						.text(val)
						.attr("data-value", val);
				};

				window.JSImpl.readQRCode('QRTEST');
			})

			/*// 打开网页
			.delegate(".m-c-panel[mode=n-web] .content", "click",function() {
			    var url = $(this).attr("data-value");
            
			    if (url) {
			        window.location = url;
			    } else {
			        aler(":(地址丢失了！");
			    }
			    
			})*/

			.delegate(".m-c-panel[mode=n-datepicker] .m-c-body", "click", function() {
				var $this = $(this).find(".w-option-content");

				window.DATETEST = function(time, monthofyear, dayofmonth) {
					$this
						.attr("data-value", (new Date(time, monthofyear, dayofmonth)).getTime())
						.text(time + "-" + monthofyear + "-" + dayofmonth);
				};

				window.JSImpl.pickDate('DATETEST');
			});

	}

	function render_sheet(sheetData) {
		var i = -1,
			len = sheetData.length,
			sheet_html = "";


		util.each(sheetData, function(item, i) {
			var key = item.Key,
				entity = item.Value;
			sheet_html += util.template({
				Key : key,
				DataSheetName : entity.DataSheetName || "",
				DataSheetVersion : entity.DataSheetVersion || "",
				ViewSheetName : entity.Name,
				ViewSheetVersion : entity.Version,
				groups : render_group(entity.GroupDefineList)
			}, HTML.SHEET);
		});
		return sheet_html;
	}

	function render_group(groupData) {
		var i = -1,
			len = groupData.length,
			group_html = "";

		util.each(groupData, function(item, i) {
			var key = item.Key,
				entity = item.Value;

			group_html += util.template({
				Key : key,
				items : render_item(entity.ItemDefineList)
			}, HTML.GROUP);
		})
		return group_html;
	}

	function render_item(itemData) {
		var i = -1,
			len = itemData.length,
			item_html = "";
		util.each(itemData, function(item, i) {
			var key = item.Key,
				entity = item.Value;
			mode = $.trim(entity.EditMode);
			//console.log("EditMode: ", entity.EditMode);
			switch (mode) {
			case "Label":
				item_html += renderItem[mode](entity);
				break;
			case "Invisible":
				item_html += renderItem[mode](entity);
				break;
			case "TextBox":
				item_html += renderItem[mode](entity);
				break;
			case "MaskedTextBox":
				item_html += renderItem[mode](entity);
				break;
			case "LabelEdit":
				item_html += renderItem[mode](entity);
				break;
			case "LabelListEdit":
				item_html += renderItem[mode](entity);
				break;
			case "DropdownList":
				item_html += renderItem.DropdownList(entity);
				break;
			case "ListView":
				item_html += renderItem.ListView(entity);
				break;
			case "RadioBoxEdit":
				item_html += renderItem.DropdownList(entity);
				break;
			case "RadioBoxShow":
				item_html += renderItem.ListView(entity);
				break;
			case "RadioBoxListEdit":
				item_html += renderItem.RadioBoxListEdit(entity);
				break;
			case "RadioBoxListShow":
				item_html += renderItem.RadioBoxListShow(entity);
				break;
			case "CheckBoxEdit":
				item_html += renderItem.RadioBoxListEdit(entity);
				break;
			case "CheckBoxShow":
				item_html += renderItem.RadioBoxListShow(entity);
				break;
			case "CheckBoxListEdit":
				item_html += renderItem.RadioBoxListEdit(entity);
				break;
			case "CheckBoxListShow":
				item_html += renderItem.RadioBoxListShow(entity);
				break;
			case "ImageBoxEdit":
				item_html += renderItem[mode](entity);
				break;
			case "ImageBoxShow":
				item_html += renderItem[mode](entity);
				break;
			case "ImageBoxListEdit":
				item_html += renderItem[mode](entity);
				break;
			case "ImageBoxListShow":
				item_html += renderItem[mode](entity);
				break;
			case "BarBoxEdit":

				break;
			case "BarBoxShow":

				break;
			case "BarBoxListEdit":
				break;
			case "BarBoxListShow":
				break;
			case "QRBoxEdit":
				item_html += renderItem[mode](entity);
				break;
			case "QRBoxShow":
				item_html += renderItem[mode](entity);
				break;
			case "QRBoxListEdit":
				item_html += renderItem[mode](entity);
				break;
			case "QRBoxListShow":
				item_html += renderItem[mode](entity);
				break;
			case "NFCBoxEdit":
				break;
			case "NFCBoxShow":
				break;
			case "NFCBoxListEdit":
				break;
			case "NFCBoxListShow":
				break;
			case "DatePicker":
				item_html += renderItem[mode](entity);
				break;
			case "WebView":
				item_html += renderItem[mode](entity);
				break;
			case "Range":
				item_html += renderItem[mode](entity);
				break;
			case "TextArea":
				item_html += renderItem[mode](entity);
				break;
			case "TextAreaEdit":
				item_html += renderItem[mode](entity);
				break;
			}
		});
		return item_html;
	}

	function split2Object(d) {
		var arr = [],
			data = d.split(","),
			i = -1,
			len = data.length;

		while (++i < len) {
			var _item = data[i].split("]=[]=[");
			arr.push({
				key : _item[0],
				value : _item[1]
			});
		}

		return arr;
	}

	function getValue(a, b) {
		//console.log("getValue: ", a, b);
		return (a != undefined && a != null && a != "") ? a : b;
	}

	function getArray(_value, type) {
		var default_list = [];

		_value && (_value = _value.Value);

		if (_value === "" || _value == null || _value == undefined) {
			return default_list;
		}

		if ($.isArray(_value)) {
			default_list = _value;
		} else {
			if (_value && util.isString(_value) && _value.indexOf("[") === 0 && _value.indexOf("]") === _value.length) {
				_value = JSON.parse(_value);
			}

			AOP.apply(default_list, $.isArray(_value) ? _value : [ TYPELIST[type](_value) ]);
		}

		return default_list;
	}

	renderItem = {
		Label : function(data) {
			var _value,
				OptionList = data.OptionList || [];
			if ((typeof data.ItemValue.Value == 'object') && data.ItemValue.Value.constructor == Array) {
				var valueList = data.ItemValue.Value;
				_value = [];
				util.each(OptionList, function(item, i) {
					for (var j = 0; j < valueList.length; j++) {
						if (TYPELIST[data.Type](item.Key) == valueList[j]) {
							_value.push(item.Value);
						}
					}
				});
				_value = _value.join(";");
			} else {
				util.each(OptionList, function(item, i) {
					if (TYPELIST[data.Type](item.Key) == data.ItemValue.Value) {
						_value = item.Value;
					}
				});
			}
			return util.template({
				Name : data.Name,
				Text : data.Text,
				Unit : data.Unit,
				ItemValue : _value || data.ItemValue.Value
			}, HTML.ITEMS.LABEL);
		},
		Invisible : function(data) {
			var key = "invisible" + GIndex++;

			OBJ[key] = data.ItemValue.Value;

			return util.template({
				Name : data.Name,
				Value : key
			}, HTML.ITEMS.INVISIBLE);
		},
		TextBox : function(data) {
			return util.template({
				Name : data.Name,
				Text : data.Text,
				Unit : data.Unit ? "(单位:" + data.Unit + ")" : "",
				ItemValue : data.ItemValue.Value,
				defaultValue : data.ItemValue.Value,
				regexp : ""
			}, HTML.ITEMS.INPUT);
		},

		MaskedTextBox : function(data) {
			return util.template({
				Name : data.Name,
				Text : data.Text,
				Unit : data.Unit ? "(单位:" + data.Unit + ")" : "",
				ItemValue : data.ItemValue.Value,
				regexp : data.CheckRegex
			}, HTML.ITEMS.INPUT);
		},

		// device/employee choise for Single
		LabelEdit : function(data) {
			var mode = "",
				tips = "请选择";

			if (data.OptionReference === "DeviceManager_DeviceListSingle") {
				mode = "n-device-radio";
				tips += "设备";
			} else if (data.OptionReference === "UserManager_UserListSingle") {
				mode = "n-employee-radio";
				tips += "员工";
			}

			return util.template({
				Mode : mode,
				Text : data.Text,
				Name : data.Name,
				List : "",
				SelectList : "",
				Value : tips
			}, HTML.ITEMS.SELECT);
		},

		// device/employee choise for Multi
		LabelListEdit : function(data) {
			var mode = "",
				tips = "请选择";

			if (data.OptionReference === "DeviceManager_DeviceListMult") {
				mode = "n-device-checkbox";
				tips += "设备";
			} else if (data.OptionReference === "UserManager_UserListMult") {
				mode = "n-employee-checkbox";
				tips += "员工";
			}


			return util.template({
				Mode : mode,
				Text : data.Text,
				Name : data.Name,
				List : "",
				SelectList : "",
				Value : tips
			}, HTML.ITEMS.SELECT);
		},

		DropdownList : function(data) {
			var _list = [],
				default_list = getArray(data.ItemValue, data.Type),
				default_value = [],
				OptionList = data.OptionList || [];

			util.each(OptionList, function(item, i) {
				var index = util.indexOf(default_list, TYPELIST[data.Type](item.Key));
				_list.push(item.Key + "]=[]=[" + item.Value);

				if (index > -1) {
					default_value[index] = item.Value;
				}
			});

			return util.template({
				Mode : "n-select-radio",
				Text : data.Text,
				Name : data.Name,
				List : _list.join(","),
				SelectList : default_list.join(","),
				Value : default_value.join(",") || "请选择"
			}, HTML.ITEMS.SELECT);
		},

		ListView : function(data) {
			var _list = [],
				default_list = getArray(data.ItemValue, data.Type),
				default_value = [],
				OptionList = data.OptionList || [];

			util.each(OptionList, function(item, i) {
				var index = util.indexOf(default_list, TYPELIST[data.Type](item.Key));
				_list.push(item.Key + "]=[]=[" + item.Value);

				if (index > -1) {
					default_value[index] = item.Value;
				}
			});

			return util.template({
				Text : data.Text,
				Name : data.Name,
				List : _list.join(","),
				SelectList : default_list.join(","),
				Value : default_value.join(",") || "请选择"
			}, HTML.ITEMS.SELECT_VIEW);
		},

		RadioBoxEdit : function(data) {
			var _list = [],
				default_list = getArray(data.ItemValue, data.Type),
				default_value = [],
				OptionList = data.OptionList || [];

			util.each(OptionList, function(item, i) {
				var index = util.indexOf(default_list, TYPELIST[data.Type](item.Key));
				_list.push(item.Key + "]=[]=[" + item.Value);

				if (index > -1) {
					default_value[index] = item.Value;
				}
			});

			return util.template({
				Mode : "n-select-radio",
				Text : data.Text,
				Name : data.Name,
				List : _list.join(","),
				SelectList : default_list.join(","),
				Value : default_value.join(",") || "请选择"
			}, HTML.ITEMS.SELECT);
		},

		RadioBoxShow : function(data) {
			var _list = [],
				default_list = getArray(data.ItemValue, data.Type),
				default_value = [],
				OptionList = data.OptionList || [];

			util.each(OptionList, function(item, i) {
				var index = util.indexOf(default_list, TYPELIST[data.Type](item.Key));
				_list.push(item.Key + "]=[]=[" + item.Value);

				if (index > -1) {
					default_value[index] = item.Value;
				}
			});

			return util.template({
				Text : data.Text,
				Name : data.Name,
				List : _list.join(","),
				SelectList : default_list.join(","),
				Value : default_value.join(",") || "请选择"
			}, HTML.ITEMS.SELECT_VIEW);
		},

		RadioBoxListEdit : function(data) {
			var _list = [],
				default_list = getArray(data.ItemValue, data.Type),
				default_value = [],
				OptionList = data.OptionList || [];

			util.each(OptionList, function(item, i) {
				var index = util.indexOf(default_list, TYPELIST[data.Type](item.Key));
				_list.push(item.Key + "]=[]=[" + item.Value);

				if (index > -1) {
					default_value[index] = item.Value;
				}
			});

			return util.template({
				Mode : "n-select-checkbox",
				Text : data.Text,
				Name : data.Name,
				List : _list.join(","),
				SelectList : default_list.join(","),
				Value : default_value.join(",") || "请选择"
			}, HTML.ITEMS.SELECT);
		},

		RadioBoxListShow : function(data) {
			var _list = [],
				default_list = getArray(data.ItemValue, data.Type),
				default_value = [],
				OptionList = data.OptionList || [];

			util.each(OptionList, function(item, i) {
				var index = util.indexOf(default_list, TYPELIST[data.Type](item.Key));
				_list.push(item.Key + "]=[]=[" + item.Value);

				if (index > -1) {
					default_value[index] = item.Value;
				}
			});

			return util.template({
				Text : data.Text,
				Name : data.Name,
				List : _list.join(","),
				SelectList : default_list.join(","),
				Value : default_value.join(",") || "请选择"
			}, HTML.ITEMS.SELECT_VIEW);
		},

		CheckBoxEdit : function() {},

		CheckBoxShow : function() {},

		CheckBoxListEdit : function() {},

		CheckBoxListShow : function() {},

		ImageBoxEdit : function(data) {
			var _list = [],
				default_list = getArray(data.ItemValue, data.Type);

			return util.template({
				Mode : "n-upload-single",
				Text : data.Text,
				Name : data.Name,
				Add : HTML.ITEMS.UPLOAD.LI,
				List : (function(d) {
					var obj = [];

					each(d, function(item, i) {
						obj.push({
							src : item,
							id : item
						});
					});
					return util.template(obj, HTML.ITEMS.UPLOAD.IMG);
				})(default_list)
			}, HTML.ITEMS.UPLOAD.TMPL);
		},

		ImageBoxShow : function(data) {
			var _list = [],
				default_list = getArray(data.ItemValue, data.Type);

			return util.template({
				Mode : "n-upload-single-show",
				Text : data.Text,
				Name : data.Name,
				Add : "",
				List : (function(d) {
					var obj = [];

					each(d, function(item, i) {
						if (item) {
							obj.push({
								src : item,
								id : item
							});
						}
					});
					return util.template(obj, HTML.ITEMS.UPLOAD.IMG);
				})(default_list)
			}, HTML.ITEMS.UPLOAD.TMPL);
		},

		ImageBoxListEdit : function(data) {
			var _list = [],
				default_list = getArray(data.ItemValue, data.Type);

			return util.template({
				Mode : "n-upload-multi",
				Text : data.Text,
				Name : data.Name,
				Add : HTML.ITEMS.UPLOAD.LI,
				List : (function(d) {
					var obj = [];

					each(d, function(item, i) {
						if (item) {
							obj.push({
								src : item,
								id : item
							});
						}
					});
					return util.template(obj, HTML.ITEMS.UPLOAD.IMG);
				})(default_list)
			}, HTML.ITEMS.UPLOAD.TMPL);
		},

		ImageBoxListShow : function(data) {
			var _list = [],
				default_list = getArray(data.ItemValue, data.Type);

			return util.template({
				Mode : "n-upload-multi-show",
				Text : data.Text,
				Name : data.Name,
				Add : "",
				List : (function(d) {
					var obj = [];

					each(d, function(item, i) {
						if (item) {
							obj.push({
								src : item,
								id : item
							});
						}
					});
					return util.template(obj, HTML.ITEMS.UPLOAD.IMG);
				})(default_list)
			}, HTML.ITEMS.UPLOAD.TMPL);
		},

		BarBoxEdit : function() {},

		BarBoxShow : function() {},

		BarBoxListEdit : function() {},

		BarBoxListShow : function() {},

		QRBoxEdit : function(data) {
			return util.template({
				Mode : "n-qr",
				Name : data.Name,
				Text : data.Text,
				Value : data.ItemValue && data.ItemValue.Value,
				state : ""
			}, HTML.ITEMS.QR);
		},

		QRBoxShow : function(data) {
			return util.template({
				Mode : "n-qr-show",
				Name : data.Name,
				Text : data.Text,
				Value : data.ItemValue && data.ItemValue.Value,
				state : "disabled"
			}, HTML.ITEMS.QR);
		},

		QRBoxListEdit : function(data) {
			return util.template({
				Mode : "n-qr",
				Name : data.Name,
				Text : data.Text,
				Value : "",
				state : ""
			}, HTML.ITEMS.QR);
		},

		QRBoxListShow : function(data) {
			return util.template({
				Mode : "n-qr-show",
				Name : data.Name,
				Text : data.Text,
				Value : data.ItemValue && data.ItemValue.Value,
				state : "disabled"
			}, HTML.ITEMS.QR);
		},

		NFCBoxEdit : function() {},

		NFCBoxShow : function() {},

		NFCBoxListEdit : function() {},

		NFCBoxListShow : function() {},

		DatePicker : function(data) {
			return util.template({
				Name : data.Name,
				Text : data.Text,
				ItemValue : data.ItemValue && data.ItemValue.Value ? util.format("yyyy-MM-dd", data.ItemValue.Value) : "请选择时间"
			}, HTML.ITEMS.DATEPICKER);
		},

		WebView : function(data) {
			return util.template({
				Name : data.Name,
				Text : data.Text,
				ItemValue : data.ItemValue && data.ItemValue.Value
			}, HTML.ITEMS.WEB);
		},

		Range : function(data) {},

		TextArea : function(data) {
			return util.template({
				Mode : "n-textarea-show",
				Name : data.Name,
				Text : data.Text,
				Unit : data.Unit ? "(单位:" + data.Unit + ")" : "",
				ItemValue : data.ItemValue.Value,
				defaultValue : data.ItemValue.Value,
				regexp : ""
			}, HTML.ITEMS.TEXTAREA);
		},

		TextAreaEdit : function(data) {
			return util.template({
				Mode : "n-textarea",
				Name : data.Name,
				Text : data.Text,
				ItemValue : data.ItemValue && data.ItemValue.Value
			}, HTML.ITEMS.TEXTAREAEdit);
		}
	};
	return FormRender;
});