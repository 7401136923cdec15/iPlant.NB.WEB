package com.mes.server.service.po.fpc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

public class FPCRoutePart implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int RouteID = 0; // 工艺版本ID

	public int PartID = 0;

	/**
	 * 工艺集编号
	 */
	public String Code = "";

	/**
	 * 主线层级
	 */
	public int OrderID = 0;

	public String Name = "";

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public String Creator = "";

	public String VersionNo = ""; // 工艺版本

	public String RouteName = ""; // 工艺名称

	public int PrevPartID = 0;// 上工段

	public int ChangeControl = 0;

	/**
	 * 标准工时 加工一个多长时间
	 */
	public Double StandardPeriod = 0.0;

	/**
	 * 标准工时 一天的标准负荷
	 */
	public Double StandardPD = 0.0;
	
	 
	/**
	 * 调整工时 新增字段 一天能干多少个
	 */
	public Double ActualPeriod = 0.0;

	public int ItemCount = 0;

	/**
	 * key PartID Value : Condition value: 0 主线也是下个模块
	 */
	public Dictionary<String, String> NextPartIDMap = new Dictionary<String, String>();// 上工段路线ID

	public List<FPCRoutePartPoint> PartPointList = new List<>(); // 工序列表

	public FPCRoutePart() {
		this.Name = "";
		this.Creator = "";
		this.CreateTime = DateTime.Now;
		this.PartPointList = new List<>();
	}

	public FPCRoutePart Clone() {
		FPCRoutePart wItem = new FPCRoutePart();
		wItem.ID = this.ID;
		wItem.RouteID = this.RouteID;
		wItem.PartID = this.PartID;
		wItem.PartID = this.PartID;

		wItem.CreatorID = this.CreatorID;
		wItem.CreateTime = this.CreateTime;
		wItem.Creator = this.Creator;

		wItem.PartPointList = new List<FPCRoutePartPoint>(this.PartPointList);
		return wItem;
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getRouteID() {
		return RouteID;
	}

	public void setRouteID(int routeID) {
		RouteID = routeID;
	}

	public int getPartID() {
		return PartID;
	}

	public void setPartID(int partID) {
		PartID = partID;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public int getCreatorID() {
		return CreatorID;
	}

	public void setCreatorID(int creatorID) {
		CreatorID = creatorID;
	}

	public String getCreator() {
		return Creator;
	}

	public void setCreator(String creator) {
		Creator = creator;
	}

	public String getVersionNo() {
		return VersionNo;
	}

	public void setVersionNo(String versionNo) {
		VersionNo = versionNo;
	}

	public String getRouteName() {
		return RouteName;
	}

	public void setRouteName(String routeName) {
		RouteName = routeName;
	}

	public List<FPCRoutePartPoint> getPartPointList() {
		return PartPointList;
	}

	public void setPartPointList(List<FPCRoutePartPoint> partPointList) {
		PartPointList = partPointList;
	}

	public int getPrevPartID() {
		return PrevPartID;
	}

	public void setPrevPartID(int prevPartID) {
		PrevPartID = prevPartID;
	}

	public Dictionary<String, String> getNextPartIDMap() {
		return NextPartIDMap;
	}

	public void setNextPartIDMap(Dictionary<String, String> nextPartIDMap) {
		NextPartIDMap = nextPartIDMap;
	}

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
	}

	public int getChangeControl() {
		return ChangeControl;
	}

	public void setChangeControl(int changeControl) {
		ChangeControl = changeControl;
	}

	public Double getStandardPeriod() {
		return StandardPeriod;
	}

	public void setStandardPeriod(Double standardPeriod) {
		StandardPeriod = standardPeriod;
	}

	public Double getActualPeriod() {
		return ActualPeriod;
	}

	public void setActualPeriod(Double actualPeriod) {
		ActualPeriod = actualPeriod;
	}

	public int getItemCount() {
		return ItemCount;
	}

	public void setItemCount(int itemCount) {
		ItemCount = itemCount;
	}

}
