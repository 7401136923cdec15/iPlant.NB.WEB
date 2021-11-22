package com.mes.server.service.po.fpc;

import java.io.Serializable;

public class FPCRouteNext implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int NextID = 0;

	public String NextCondition = "";

	public String Name = "";

	public FPCRouteNext() {

	}

	public int getNextID() {
		return NextID;
	}

	public void setNextID(int nextID) {
		NextID = nextID;
	}

	public String getNextCondition() {
		return NextCondition;
	}

	public void setNextCondition(String nextCondition) {
		NextCondition = nextCondition;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

}
