package com.mes.server.service.po.fpc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class FPCRoute implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	/**
	 * BOPID
	 */
	public String Name = "";

	/**
	 * 版本号
	 */
	public String VersionNo = "";

	public String PLMVersion = "";

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	public int Status = 0; // 审批状态

	public DateTime AuditTime = DateTime.Now;

	public int AuditorID = 0;

	public int FactoryID = 0;

	public int BusinessUnitID = 0;

	public int ProductTypeID = 0;

	public int LineID = 0;

	public String LineName = "";

	public int ProductID = 0;

	public String ProductNo = "";

	public String ProductName = "";

	public int CustomerID = 0;

	public String CustomerName = "";

	public String Description = "";

	public String Factory = "";

	public String BusinessUnit = "";

	public String ProductType = "";

	public String Creator = "";

	public String Auditor = "";

	public String Editor = "";

	public String StatusText = ""; // 审批状态

	public int Active = 0; // 状态

	public int IsStandard = 0;

	public int IsUsed = 0;

	public int ItemCount = 0;

	public List<FPCRoutePart> PartList = new List<>(); // 工序段

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public String getVersionNo() {
		return VersionNo;
	}

	public void setVersionNo(String versionNo) {
		VersionNo = versionNo;
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

	public int getFactoryID() {
		return FactoryID;
	}

	public void setFactoryID(int factoryID) {
		FactoryID = factoryID;
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

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public String getDescription() {
		return Description;
	}

	public void setDescription(String description) {
		Description = description;
	}

	public String getFactory() {
		return Factory;
	}

	public void setFactory(String factory) {
		Factory = factory;
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

	public List<FPCRoutePart> getPartList() {
		return PartList;
	}

	public void setPartList(List<FPCRoutePart> partList) {
		PartList = partList;
	}

	public FPCRoute() {
		this.Name = "";
		this.VersionNo = "";
		this.Factory = "";
		this.BusinessUnit = "";
		this.Editor = "";
		this.Creator = "";
		this.Auditor = "";
		this.CreateTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
		this.EditTime = DateTime.Now;
		this.StatusText = "";
		this.PartList = new List<>();
	}

	public FPCRoute Clone() {
		FPCRoute wItem = new FPCRoute();
		wItem.ID = this.ID;
		wItem.Name = this.Name;
		wItem.VersionNo = this.VersionNo;

		wItem.CreatorID = this.CreatorID;
		wItem.EditorID = this.EditorID;
		wItem.AuditorID = this.AuditorID;
		wItem.Status = this.Status;
		wItem.Active = this.Active;
		wItem.CreateTime = this.CreateTime;
		wItem.AuditTime = this.AuditTime;
		wItem.EditTime = this.EditTime;

		wItem.FactoryID = this.FactoryID;
		wItem.BusinessUnitID = this.BusinessUnitID;
		wItem.ProductTypeID = this.ProductTypeID;

		wItem.Factory = this.Factory;
		wItem.BusinessUnit = this.BusinessUnit;
		wItem.ProductType = this.ProductType;
		wItem.Creator = this.Creator;
		wItem.Editor = this.Editor;
		wItem.Auditor = this.Auditor;
		wItem.Status = this.Status;

		wItem.PartList = new List<FPCRoutePart>(this.PartList);
		return wItem;
	}

	public int getProductID() {
		return ProductID;
	}

	public void setProductID(int productID) {
		ProductID = productID;
	}

	public int getCustomerID() {
		return CustomerID;
	}

	public void setCustomerID(int customerID) {
		CustomerID = customerID;
	}

	public int getIsStandard() {
		return IsStandard;
	}

	public void setIsStandard(int isStandard) {
		IsStandard = isStandard;
	}

	public int getActive() {
		return Active;
	}

	public int getItemCount() {
		return ItemCount;
	}

	public void setItemCount(int itemCount) {
		ItemCount = itemCount;
	}
}
