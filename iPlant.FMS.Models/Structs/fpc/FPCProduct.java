package com.mes.server.service.po.fpc;

import java.io.Serializable;
import java.util.DateTime;

public class FPCProduct implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int MaterialID = 0;
	/**
	 * 物料编码
	 */
	public String MaterialNo = "";
	/**
	 * 物料名称
	 */
	public String MaterialName = "";

	public String ProductName = "";

	public String ProductNo = "";

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	public int Status = 0; // 审批状态

	public DateTime AuditTime = DateTime.Now;

	public int AuditorID = 0;

	public int BusinessUnitID = 0; // 事业部

	public int ProductTypeID = 0; // 产品类型

	/**
	 * 转运部件类型
	 */
	public int TransportType = 0;

	public String PrevProductNo = "";

	public String Remark = "";

	/**
	 * 图纸号
	 */
	public String DrawingNo = "";

	public Double Length = 0.0;

	public String BusinessUnit = "";

	public String ProductType = "";

	public String ProductTypeCode = "";

	public String Creator = "";

	public String Auditor = "";

	public String Editor = "";

	public String StatusText = ""; // 审批状态

	public int Active = 0; // 状态

	public int ERPID = 0; // ERP关联ID

	public String ProductCode = "";

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
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

	public String getProductName() {
		return ProductName;
	}

	public void setProductName(String productName) {
		ProductName = productName;
	}

	public String getProductNo() {
		return ProductNo;
	}

	public void setProductNo(String productNo) {
		ProductNo = productNo;
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

	public int getBusinessUnitID() {
		return BusinessUnitID;
	}

	public void setBusinessUnitID(int businessUnitID) {
		BusinessUnitID = businessUnitID;
	}

	public int getProductTypeID() {
		return ProductTypeID;
	}

	public void setProductTypeID(int productTypeID) {
		ProductTypeID = productTypeID;
	}

	public int getTransportType() {
		return TransportType;
	}

	public void setTransportType(int transportType) {
		TransportType = transportType;
	}

	public String getPrevProductNo() {
		return PrevProductNo;
	}

	public void setPrevProductNo(String prevProductNo) {
		PrevProductNo = prevProductNo;
	}

	public String getDrawingNo() {
		return DrawingNo;
	}

	public void setDrawingNo(String drawingNo) {
		DrawingNo = drawingNo;
	}

	public Double getLength() {
		return Length;
	}

	public void setLength(Double length) {
		Length = length;
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

	public String getProductTypeCode() {
		return ProductTypeCode;
	}

	public void setProductTypeCode(String productTypeCode) {
		ProductTypeCode = productTypeCode;
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

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public int getERPID() {
		return ERPID;
	}

	public void setERPID(int eRPID) {
		ERPID = eRPID;
	}

	public String getProductCode() {
		return ProductCode;
	}

	public void setProductCode(String productCode) {
		ProductCode = productCode;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

}
