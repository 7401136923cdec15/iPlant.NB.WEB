package com.mes.server.service.po.fpc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class FPCProductClassification implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	/**
	 * 分类标识
	 */
	public String Code = "";

	/**
	 * 分类名称
	 */
	public String Name = "";

	/**
	 * 分类说明
	 */
	public String Remark = "";

	public int ProductID = 0;

	public int MaterialID = 0;

	public String MaterialNo = "";

	public String MaterialName = "";

	public String ProductName = "";

	public String ProductNo = "";

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	public int BusinessUnitID = 0; // 事业部

	public int ProductTypeID = 0; // 产品类型

	/**
	 * 图纸号
	 */
	public String DrawingNo = "";

	public String BusinessUnit = "";

	public String ProductType = "";

	public String ProductTypeCode = "";

	public String Creator = "";

	public String Editor = "";

	public int Active = 0; // 状态

	public List<FPCProductLevel> ProductLevelList = new List<>();

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

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

	public int getProductID() {
		return ProductID;
	}

	public void setProductID(int productID) {
		ProductID = productID;
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

	public String getDrawingNo() {
		return DrawingNo;
	}

	public void setDrawingNo(String drawingNo) {
		DrawingNo = drawingNo;
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

	public String getEditor() {
		return Editor;
	}

	public void setEditor(String editor) {
		Editor = editor;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
	}

	public List<FPCProductLevel> getProductLevelList() {
		return ProductLevelList;
	}

	public void setProductLevelList(List<FPCProductLevel> productLevelList) {
		ProductLevelList = productLevelList;
	}

}
