package com.mes.server.service.po.fpc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

public class FPCRoutePartPoint implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	/**
	 * BOP工序名称 需要存
	 */
	public String Name = "";

	public String Code = "";

	public int RouteID = 0; // 工艺版本ID

	/**
	 * BOP工段ID
	 */
	public int RoutePartID = 0;

	/**
	 * BOP工段Code
	 */
	public String RoutePartCode = "";

	public int PartID = 0;

	public int PartPointID = 0;

	public int OrderID = 0; // 循序

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public String PartName = "";

	public String PartPointName = "";

	public String PartPointCode = "";

	public String Creator = "";

	public String VersionNo = ""; // 工艺版本

	public String RouteName = ""; // 工艺名称

	public int PrevStepID = 0;// 上工序路线ID

	public int MaterialID = 0;

	public String MaterialNo = "";

	public String MaterialName = "";

	public int UnitID = 0;

	public String UnitText = "";

	/**
	 * 标准工时
	 */
	public Double StandardPeriod = 0.0;

	/**
	 * 调整工时 新增字段
	 */
	public Double ActualPeriod = 0.0;

	/**
	 * 新增字段 满足工艺需求
	 */
	public String DefaultOrder = "";

	public int ItemCount = 0;

	public Dictionary<String, String> NextStepIDMap = new Dictionary<String, String>();// 上工段路线ID

	public List<Int32> StationIDList = new List<Int32>();

	public String StationName = "";
	
	public List<FPCStepSOP> StepSopList = new List<>();

	public FPCRoutePartPoint() {
		this.PartName = "";
		this.PartPointName = "";
		this.VersionNo = "";
		this.Creator = "";
		this.CreateTime = DateTime.Now;
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

	public int getPartPointID() {
		return PartPointID;
	}

	public void setPartPointID(int partPointID) {
		PartPointID = partPointID;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
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

	public String getPartName() {
		return PartName;
	}

	public void setPartName(String partName) {
		PartName = partName;
	}

	public String getPartPointName() {
		return PartPointName;
	}

	public void setPartPointName(String partPointName) {
		PartPointName = partPointName;
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

	public int getPrevStepID() {
		return PrevStepID;
	}

	public void setPrevStepID(int prevStepID) {
		PrevStepID = prevStepID;
	}

	public Dictionary<String, String> getNextStepIDMap() {
		return NextStepIDMap;
	}

	public void setNextStepIDMap(Dictionary<String, String> nextStepIDMap) {
		NextStepIDMap = nextStepIDMap;
	}

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
	}

	public String getRoutePartCode() {
		return RoutePartCode;
	}

	public void setRoutePartCode(String routePartCode) {
		RoutePartCode = routePartCode;
	}

	public int getMaterialID() {
		return MaterialID;
	}

	public void setMaterialID(int materialID) {
		MaterialID = materialID;
	}

	public String getMaterialNo() {
		return MaterialNo;
	}

	public void setMaterialNo(String materialNo) {
		MaterialNo = materialNo;
	}

	public String getMaterialName() {
		return MaterialName;
	}

	public void setMaterialName(String materialName) {
		MaterialName = materialName;
	}

	public int getUnitID() {
		return UnitID;
	}

	public void setUnitID(int unitID) {
		UnitID = unitID;
	}

	public String getUnitText() {
		return UnitText;
	}

	public void setUnitText(String unitText) {
		UnitText = unitText;
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

	public String getDefaultOrder() {
		return DefaultOrder;
	}

	public void setDefaultOrder(String defaultOrder) {
		DefaultOrder = defaultOrder;
	}

	public int getItemCount() {
		return ItemCount;
	}

	public void setItemCount(int itemCount) {
		ItemCount = itemCount;
	}

}
