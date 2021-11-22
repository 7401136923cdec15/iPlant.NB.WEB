package com.mes.server.service.po.fpc;

import java.io.Serializable; 
import java.util.DateTime; 

public class FPCBoxType implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	/**
	 * 箱代码
	 */
	public String Code = "";

	/**
	 * 箱名称
	 */
	public String Name = "";

	/**
	 * 箱说明
	 */
	public String Remark = "";
	
	/**
	 * 材质
	 */
	public String Material = "";

	public int MaterialID = 0;

	public String MaterialNo = "";

	public String MaterialName = "";
 
	public int RowNum = 0;

	public int ColNum = 0;

	public double VolumNum = 0;

	public int SizeUnitID = 0;

	public String SizeUnitText = "";

	public double BoxLength = 0;

	public double BoxWidth = 0;

	public double BoxHeight = 0;

	public int VolumUnitID = 0;

	public String VolumUnitText = "";

	public double BoxVolum = 0;

	public int WeightUnitID = 0;

	public String WeightUnitText = "";

	public double GrossWeight = 0;

	public double NetWeight = 0;

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;  

	public String Creator = "";

	public String Editor = "";

	public int Active = 0; // 状态 

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
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

	public String getMaterial() {
		return Material;
	}

	public void setMaterial(String material) {
		Material = material;
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

	public int getRowNum() {
		return RowNum;
	}

	public void setRowNum(int rowNum) {
		RowNum = rowNum;
	}

	public int getColNum() {
		return ColNum;
	}

	public void setColNum(int colNum) {
		ColNum = colNum;
	}

	public double getVolumNum() {
		return VolumNum;
	}

	public void setVolumNum(double volumNum) {
		VolumNum = volumNum;
	}

	public int getSizeUnitID() {
		return SizeUnitID;
	}

	public void setSizeUnitID(int sizeUnitID) {
		SizeUnitID = sizeUnitID;
	}

	public String getSizeUnitText() {
		return SizeUnitText;
	}

	public void setSizeUnitText(String sizeUnitText) {
		SizeUnitText = sizeUnitText;
	}

	public double getBoxLength() {
		return BoxLength;
	}

	public void setBoxLength(double boxLength) {
		BoxLength = boxLength;
	}

	public double getBoxWidth() {
		return BoxWidth;
	}

	public void setBoxWidth(double boxWidth) {
		BoxWidth = boxWidth;
	}

	public double getBoxHeight() {
		return BoxHeight;
	}

	public void setBoxHeight(double boxHeight) {
		BoxHeight = boxHeight;
	}

	public int getVolumUnitID() {
		return VolumUnitID;
	}

	public void setVolumUnitID(int volumUnitID) {
		VolumUnitID = volumUnitID;
	}

	public String getVolumUnitText() {
		return VolumUnitText;
	}

	public void setVolumUnitText(String volumUnitText) {
		VolumUnitText = volumUnitText;
	}

	public double getBoxVolum() {
		return BoxVolum;
	}

	public void setBoxVolum(double boxVolum) {
		BoxVolum = boxVolum;
	}

	public int getWeightUnitID() {
		return WeightUnitID;
	}

	public void setWeightUnitID(int weightUnitID) {
		WeightUnitID = weightUnitID;
	}

	public String getWeightUnitText() {
		return WeightUnitText;
	}

	public void setWeightUnitText(String weightUnitText) {
		WeightUnitText = weightUnitText;
	}

	public double getGrossWeight() {
		return GrossWeight;
	}

	public void setGrossWeight(double grossWeight) {
		GrossWeight = grossWeight;
	}

	public double getNetWeight() {
		return NetWeight;
	}

	public void setNetWeight(double netWeight) {
		NetWeight = netWeight;
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
 
}
