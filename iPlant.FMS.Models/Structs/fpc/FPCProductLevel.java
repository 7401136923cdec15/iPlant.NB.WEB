package com.mes.server.service.po.fpc;

import java.io.Serializable;
import java.util.DateTime;

public class FPCProductLevel implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	/**
	 * 分档编号
	 */
	public String Code = "";

	/**
	 * 分档名称 名称可重复
	 */
	public String Name = "";

	/**
	 * 分类说明
	 */
	public String Remark = "";

	public int ClassificationID = 0;

	public String ClassificationCode = "";

	public String ClassificationName = "";

	public double SDTop = 0;

	public double SDBottom = 0;

	public int StandardSDType = 4;

	public double VolTop = 0;

	public double VolBottom = 0;

	public int StandardVolType = 4;

	public double ResistanceTop = 0;

	public double ResistanceBottom = 0;

	public int StandardResistanceType = 4;

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

	public int getClassificationID() {
		return ClassificationID;
	}

	public void setClassificationID(int classificationID) {
		ClassificationID = classificationID;
	}

	public String getClassificationCode() {
		return ClassificationCode;
	}

	public void setClassificationCode(String classificationCode) {
		ClassificationCode = classificationCode;
	}

	public String getClassificationName() {
		return ClassificationName;
	}

	public void setClassificationName(String classificationName) {
		ClassificationName = classificationName;
	}

	public double getSDTop() {
		return SDTop;
	}

	public void setSDTop(double sDTop) {
		SDTop = sDTop;
	}

	public double getSDBottom() {
		return SDBottom;
	}

	public void setSDBottom(double sDBottom) {
		SDBottom = sDBottom;
	}

	public double getVolTop() {
		return VolTop;
	}

	public void setVolTop(double volTop) {
		VolTop = volTop;
	}

	public double getVolBottom() {
		return VolBottom;
	}

	public void setVolBottom(double volBottom) {
		VolBottom = volBottom;
	}

	public double getResistanceTop() {
		return ResistanceTop;
	}

	public void setResistanceTop(double resistanceTop) {
		ResistanceTop = resistanceTop;
	}

	public double getResistanceBottom() {
		return ResistanceBottom;
	}

	public void setResistanceBottom(double resistanceBottom) {
		ResistanceBottom = resistanceBottom;
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
