package com.mes.server.service.po.fpc;

import java.io.Serializable;
import java.util.DateTime;

public class FPCStepSOP implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public int ID = 0;
	public int LineID = 0;
	public String LineName = "";
	public int ProductID = 0;
	public String ProductNo = "";
	public int CustomerID = 0;
	public String CustomerName = "";
	public int PartID = 0;
	public int RoutePartID = 0;
	public String PartCode = "";
	public String PartName = "";
	public int PartPointID = 0;
	public String PartPointName = "";
	public String PartPointCode = ""; 
	public String RoutePartPointCode = "";
	public int RoutePartPointID = 0;
	public int RouteID = 0;
	public String RouteName = "";
	public String RouteVersion = ""; 
	public int CreatorID = 0;
	public String Creator = "";
	public DateTime CreateTime = DateTime.Now;
	public int EditorID = 0;
	public String Editor = "";
	public DateTime EditTime = DateTime.Now;

	public String FileName="";
	/**
	 * 文件路径
	 */
	public String FilePath = "";

	/**
	 * 1 img 2 Video 3 PDF 4 Word
	 */
	public int FileType = 0;

	/**
	 * 1 MES 2 TCM
	 */
	public int SourceType = 0;

	public int Active = 0;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
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

	public int getRouteID() {
		return RouteID;
	}

	public void setRouteID(int routeID) {
		RouteID = routeID;
	}

	public String getRouteName() {
		return RouteName;
	}

	public void setRouteName(String routeName) {
		RouteName = routeName;
	}

	public String getRouteVersion() {
		return RouteVersion;
	}

	public void setRouteVersion(String routeVersion) {
		RouteVersion = routeVersion;
	}

	public String getFilePath() {
		return FilePath;
	}

	public void setFilePath(String filePath) {
		FilePath = filePath;
	}

	public int getFileType() {
		return FileType;
	}

	public void setFileType(int fileType) {
		FileType = fileType;
	}

	public int getSourceType() {
		return SourceType;
	}

	public void setSourceType(int sourceType) {
		SourceType = sourceType;
	}

	public String getLineName() {
		return LineName;
	}

	public void setLineName(String lineName) {
		LineName = lineName;
	}

	public String getProductNo() {
		return ProductNo;
	}

	public void setProductNo(String productNo) {
		ProductNo = productNo;
	}

	public String getCustomerName() {
		return CustomerName;
	}

	public void setCustomerName(String customerName) {
		CustomerName = customerName;
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

 

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public String getPartCode() {
		return PartCode;
	}

	public void setPartCode(String partCode) {
		PartCode = partCode;
	}

	public String getPartPointCode() {
		return PartPointCode;
	}

	public void setPartPointCode(String partPointCode) {
		PartPointCode = partPointCode;
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

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public int getEditorID() {
		return EditorID;
	}

	public void setEditorID(int editorID) {
		EditorID = editorID;
	}

	public String getEditor() {
		return Editor;
	}

	public void setEditor(String editor) {
		Editor = editor;
	}

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public String getRoutePartPointCode() {
		return RoutePartPointCode;
	}

	public void setRoutePartPointCode(String routePartPointCode) {
		RoutePartPointCode = routePartPointCode;
	}

	public int getRoutePartPointID() {
		return RoutePartPointID;
	}

	public void setRoutePartPointID(int routePartPointID) {
		RoutePartPointID = routePartPointID;
	}

	public String getFileName() {
		return FileName;
	}

	public void setFileName(String fileName) {
		FileName = fileName;
	}

}
