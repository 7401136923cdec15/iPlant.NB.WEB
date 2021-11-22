package com.mes.server.service;

import java.util.List;

import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bmm.BMMFunction;
import com.mes.server.service.po.bmm.BMMPosition;
import com.mes.server.service.po.bmm.BMMTemplate;
import com.mes.server.service.po.bmm.BMMWFStep;
import com.mes.server.service.po.bmm.BMMWorkFlow;
import com.mes.server.service.po.bms.BMSEmployee;

public interface BMMService {
	// 岗位角色定义--岗位对应的岗位作业
	ServiceResult<Int32> BMM_UpdateFunction(BMSEmployee wLoginUser, BMMFunction wFunction);
  
	ServiceResult<Int32> BMM_DisableFunction(BMSEmployee wLoginUser, BMMFunction wFunction);

	ServiceResult<Int32> BMM_DeleteFunction(BMSEmployee wLoginUser, BMMFunction wFunction);
	
	
	ServiceResult<Int32> BMM_ActiveFunction(BMSEmployee wLoginUser, BMMFunction wFunction);

	 
	ServiceResult<BMMFunction> BMM_QueryFunctionByID(BMSEmployee wLoginUser, int wID);

	ServiceResult<List<BMMFunction>> BMM_QueryFunctionList(BMSEmployee wLoginUser, int wModuleID, int wWorkShopID,
			int wLineID, int wActive);

	// 岗位模板管理
	ServiceResult<Int32> BMM_AddTemplate(BMSEmployee wLoginUser, BMMTemplate wTemplate);

	ServiceResult<Int32> BMM_SaveTemplate(BMSEmployee wLoginUser, BMMTemplate wTemplate);

	ServiceResult<Int32> BMM_DisableTemplate(BMSEmployee wLoginUser, BMMTemplate wTemplate);

	ServiceResult<Int32> BMM_DeleteTemplate(BMSEmployee wLoginUser, BMMTemplate wTemplate);
	
	ServiceResult<Int32> BMM_ActiveTemplate(BMSEmployee wLoginUser, BMMTemplate wTemplate);

	ServiceResult<BMMTemplate> BMM_QueryTemplateByID(BMSEmployee wLoginUser, int wID);

	ServiceResult<List<BMMTemplate>> BMM_QueryTemplateList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID,int wModuleID,
			int wStatus);
	
	
	

	// 岗位详情管理
	ServiceResult<Int32> BMM_AddPosition(BMSEmployee wLoginUser, BMMPosition wPosition);

	ServiceResult<Int32> BMM_SavePosition(BMSEmployee wLoginUser, BMMPosition wPosition);

	ServiceResult<Int32> BMM_DeletePosition(BMSEmployee wLoginUser, BMMPosition wPosition);
	
	ServiceResult<BMMPosition> BMM_QueryPositionByID(BMSEmployee wLoginUser, int wID);

	ServiceResult<List<BMMPosition>> BMM_QueryPositionList(BMSEmployee wLoginUser,int wTemplateID, int wModuleID, int wFunctionID,
			int wWorkShopID, int wLineID, int wPartID, int wPartPointID,int wStationID);

	// 工作流管理
	ServiceResult<Int32> BMM_AddWorkFlow(BMSEmployee wLoginUser, BMMWorkFlow wWorkFlow);

	ServiceResult<Int32> BMM_SaveWorkFlow(BMSEmployee wLoginUser, BMMWorkFlow wWorkFlow);

	ServiceResult<Int32> BMM_DisableWorkFlow(BMSEmployee wLoginUser, BMMWorkFlow wWorkFlow);

	ServiceResult<Int32> BMM_ActiveWorkFlow(BMSEmployee wLoginUser, BMMWorkFlow wWorkFlow);

	ServiceResult<Int32> BMM_AuditWorkFlow(BMSEmployee wLoginUser, BMMWorkFlow wWorkFlow);

	ServiceResult<BMMWorkFlow> BMM_QueryWorkFlowByID(BMSEmployee wLoginUser, int wID);

	ServiceResult<List<BMMWorkFlow>> BMM_QueryWorkFlowList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID,int wPartID,
			int wStatus);

	// 工步管理
	ServiceResult<Int32> BMM_AddWFStep(BMSEmployee wLoginUser, BMMWFStep wWFStep);

	ServiceResult<Int32> BMM_SaveWFStep(BMSEmployee wLoginUser, BMMWFStep wWFStep);

	ServiceResult<Int32> BMM_DeleteWFStep(BMSEmployee wLoginUser, BMMWFStep wWFStep);

	ServiceResult<BMMWFStep> BMM_QueryWFStepByID(BMSEmployee wLoginUser, int wID);

	ServiceResult<List<BMMWFStep>> BMM_QueryWFStepList(BMSEmployee wLoginUser, int wWorkFlowID, int wWorkShopID, int wLineID,int wPartID,
			int wModuleID, int wFunctionID, int wEventID);
	
	ServiceResult<List<BMMWFStep>> BMM_QueryWFStepListByWorkFlowID(BMSEmployee wLoginUser, int wWorkFlowID);

	ServiceResult<List<BMMWFStep>> BMM_QueryNextStepList(BMSEmployee wLoginUser, int wStepID, String wCondition);
}
