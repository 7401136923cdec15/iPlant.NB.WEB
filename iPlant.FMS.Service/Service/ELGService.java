package com.mes.server.service;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.elg.ELGCatalog;

public interface ELGService {

	/**
	 * 获取日志目录集合
	 * 
	 * @return
	 */
	ServiceResult<List<ELGCatalog>> ELG_QueryCataLogList(BMSEmployee wLoginUser);

	/**
	 * 查看日志文件内容
	 * 
	 * @param wID
	 * @return
	 */
	ServiceResult<List<String>> ELG_ShowLogFileByID(BMSEmployee wLoginUser, int wID);

	/**
	 * 下载日志文件
	 * 
	 * @param wID
	 */
	void ELG_DownloadLogFileByID(BMSEmployee wLoginUser, int wID, HttpServletResponse wResponse);

	/**
	 * 删除日志文件
	 * 
	 * @param wID
	 */
	ServiceResult<Boolean> ELG_DeleteLogFileByID(BMSEmployee wLoginUser, int wID);

	/**
	 * 删除文件集合
	 * 
	 * @param wIDList
	 * @return
	 */
	ServiceResult<String> ELG_DeleteLogFileList(BMSEmployee wLoginUser, List<Int32> wIDList);
}
