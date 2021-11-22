package com.mes.server.service.po.fpc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

public class FPCRouteStep implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	/**
	 * 流程名称
	 */
	public String Name = "";

	/**
	 * 工艺版本ID
	 */
	public int RouteID = 0;

	/**
	 * 工艺版本
	 */
	public String VersionNo = "";

	/**
	 * 工艺名称
	 */
	public String RouteName = "";

	/**
	 * 实体ID
	 */
	public int EntityID = 0;

	/**
	 * 实体编码
	 */
	public String Code = "";

	/**
	 * 实体名称
	 */
	public String EntityName = "";

	/**
	 * 主线层级
	 */
	public int OrderID = 0;

	/**
	 * 流程等级ID
	 */
	public int StepLevel = 0;

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public String Creator = "";

	/**
	 * 前置流程ID
	 */
	public int PrevID = 0;

	/**
	 * 上等级级流程区间起始ID 如 一级流程A-B-C-D 二级流程 B-B0-B1-C ParentStepID=B
	 */
	public int ParentStepID = 0;

	/**
	 * 等级流程名称
	 */
	public String RouteLevelName = "";

	/**
	 *  
	 */
	public List<FPCRouteNext> RouteNextList = new List<FPCRouteNext>();

	/**
	 * key PartID Value : Condition value: 0 主线也是下个模块
	 */
	public Dictionary<String, String> NextIDMap = new Dictionary<String, String>();

	public Dictionary<String, String> ChangeToEntityMap(Dictionary<Int32, Int32> wFPCRouteStepMap) {
		Dictionary<String, String> wResult = new Dictionary<String, String>();
		try {
			if (this.RouteNextList == null || this.RouteNextList.Count <= 0)
				return wResult;

			for (FPCRouteNext fpcRouteNext : this.RouteNextList) {
				if (fpcRouteNext.NextID <= 0)
					continue;

				if (!wFPCRouteStepMap.ContainsKey(fpcRouteNext.NextID))
					continue;

				if (wResult.ContainsKey(wFPCRouteStepMap.get(fpcRouteNext.NextID) + ""))
					continue;

				wResult.Add(wFPCRouteStepMap.get(fpcRouteNext.NextID) + "", fpcRouteNext.NextCondition);
			}

		} catch (Exception e) {

		}
		return wResult;
	}
	
	
	

	public FPCRouteStep() {
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

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
	}

	public int getEntityID() {
		return EntityID;
	}

	public void setEntityID(int entityID) {
		EntityID = entityID;
	}

	public String getEntityName() {
		return EntityName;
	}

	public void setEntityName(String entityName) {
		EntityName = entityName;
	}

	public int getPrevID() {
		return PrevID;
	}

	public void setPrevID(int prevID) {
		PrevID = prevID;
	}

	public List<FPCRouteNext> getRouteNextList() {
		return RouteNextList;
	}

	public void setRouteNextList(List<FPCRouteNext> routeNextList) {
		RouteNextList = routeNextList;
	}

	public Dictionary<String, String> getNextIDMap() {
		return NextIDMap;
	}

	public void setNextIDMap(Dictionary<String, String> nextIDMap) {
		NextIDMap = nextIDMap;
	}

	public int getStepLevel() {
		return StepLevel;
	}

	public void setStepLevel(int stepLevel) {
		StepLevel = stepLevel;
	}

	public int getParentStepID() {
		return ParentStepID;
	}

	public void setParentStepID(int parentStepID) {
		ParentStepID = parentStepID;
	}

	public String getRouteLevelName() {
		return RouteLevelName;
	}

	public void setRouteLevelName(String routeLevelName) {
		RouteLevelName = routeLevelName;
	}

}
