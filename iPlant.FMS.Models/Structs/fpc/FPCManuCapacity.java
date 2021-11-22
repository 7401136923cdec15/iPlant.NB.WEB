package com.mes.server.service.po.fpc;

import java.io.Serializable;
import java.util.DateTime;

public class FPCManuCapacity implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int StationID = 0; // 工位ID

	public int LineID = 0; // 产线ID

	public int PartID = 0; // 工序ID

	public int PartPointID = 0; // 工步ID

	public int ProductID = 0; // 产品ID

	public Double FQTY = 0.0; // 单日加工标准批量    单次加工批量

	public int Period = 0;   //  加工周期（单位：100ms）
	
	/**
	 * 标准工时 一天的标准负荷
	 */
	public Double CalcFQTY = 0.0;
	
	/**
	 * 是否关键工序
	 */
	public int APSStep=0;
	
	/**
	 * 是否需要换天
	 */
	public int APSStepNext=0;

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	public int Status = 0; // 审批状态

	public DateTime AuditTime = DateTime.Now;

	public int AuditorID = 0;

	public String Factory = "";

	public String Line = "";

	public String ProductNo = "";

	public String PartName = "";

	public String PartPointName = "";

	public String BusinessUnit = "";

	public String ProductType = "";

	public String Creator = "";

	public String Auditor = "";

	public String Editor = "";

	public String StatusText = ""; // 审批状态

	public int Active = 0; // 状态

	public String ProductName = "";

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getStationID() {
		return StationID;
	}

	public void setStationID(int stationID) {
		StationID = stationID;
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

	public int getProductID() {
		return ProductID;
	}

	public void setProductID(int productID) {
		ProductID = productID;
	}

	 

	public int getPeriod() {
		return Period;
	}

	public void setPeriod(int period) {
		Period = period;
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

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public int getEditorID() {
		return EditorID;
	}

	public void setEditorID(int editorID) {
		EditorID = editorID;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public DateTime getAuditTime() {
		return AuditTime;
	}

	public void setAuditTime(DateTime auditTime) {
		AuditTime = auditTime;
	}

	public int getAuditorID() {
		return AuditorID;
	}

	public void setAuditorID(int auditorID) {
		AuditorID = auditorID;
	}

	public String getFactory() {
		return Factory;
	}

	public void setFactory(String factory) {
		Factory = factory;
	}

	public String getLine() {
		return Line;
	}

	public void setLine(String line) {
		Line = line;
	}

	public String getProductNo() {
		return ProductNo;
	}

	public void setProductNo(String productNo) {
		ProductNo = productNo;
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

	public String getBusinessUnit() {
		return BusinessUnit;
	}

	public void setBusinessUnit(String businessUnit) {
		BusinessUnit = businessUnit;
	}

	public String getProductType() {
		return ProductType;
	}

	public void setProductType(String productType) {
		ProductType = productType;
	}

	public String getCreator() {
		return Creator;
	}

	public void setCreator(String creator) {
		Creator = creator;
	}

	public String getAuditor() {
		return Auditor;
	}

	public void setAuditor(String auditor) {
		Auditor = auditor;
	}

	public String getEditor() {
		return Editor;
	}

	public void setEditor(String editor) {
		Editor = editor;
	}

	public String getStatusText() {
		return StatusText;
	}

	public void setStatusText(String statusText) {
		StatusText = statusText;
	}

	public int isActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public String getProductName() {
		return ProductName;
	}

	public void setProductName(String productName) {
		ProductName = productName;
	}

	public FPCManuCapacity() {
		this.Line = "";
		this.ProductNo = "";
		this.PartPointName = "";
		this.Factory = "";
		this.BusinessUnit = "";
		this.ProductType = "";
		this.Editor = "";
		this.Creator = "";
		this.Auditor = "";
		this.CreateTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
		this.EditTime = DateTime.Now;
		this.StatusText = "";
	}

	public FPCManuCapacity Clone() {
		FPCManuCapacity wItem = new FPCManuCapacity();
		wItem.ID = this.ID;

		wItem.CreatorID = this.CreatorID;
		wItem.EditorID = this.EditorID;
		wItem.AuditorID = this.AuditorID;
		wItem.Status = this.Status;
		wItem.Active = this.Active;
		wItem.CreateTime = this.CreateTime;
		wItem.AuditTime = this.AuditTime;
		wItem.EditTime = this.EditTime;

		wItem.ProductID = this.ProductID;
		wItem.PartPointID = this.PartPointID;
		wItem.StationID = this.StationID;
		wItem.FQTY = this.FQTY;
		wItem.Period = this.Period;

		wItem.Line = this.Line;
		wItem.ProductNo = this.ProductNo;
		wItem.PartPointName = this.PartPointName;
		wItem.Factory = this.Factory;
		wItem.BusinessUnit = this.BusinessUnit;
		wItem.ProductType = this.ProductType;
		wItem.Creator = this.Creator;
		wItem.Editor = this.Editor;
		wItem.Auditor = this.Auditor;
		wItem.Status = this.Status;
		return wItem;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public int getAPSStep() {
		return APSStep;
	}

	public void setAPSStep(int aPSStep) {
		APSStep = aPSStep;
	}

	public int getActive() {
		return Active;
	}

 

	public int getAPSStepNext() {
		return APSStepNext;
	}

	public void setAPSStepNext(int aPSStepNext) {
		APSStepNext = aPSStepNext;
	}

	public Double getFQTY() {
		return FQTY;
	}

	public void setFQTY(Double fQTY) {
		FQTY = fQTY;
	}

	public Double getCalcFQTY() {
		return CalcFQTY;
	}

	public void setCalcFQTY(Double calcFQTY) {
		CalcFQTY = calcFQTY;
	}
}
