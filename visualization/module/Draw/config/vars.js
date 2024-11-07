export const PREFIX = "ehh";

export const EMPTY_COLLECTION = {
  type: "FeatureCollection",
  features: [],
};

/** ---------------------------------------- 事件名称 ------------------------------------------- **/
export const CREATE = `${PREFIX}.plot.create`;

export const UPDATE = `${PREFIX}.plot.update`;

export const DELETE = `${PREFIX}.plot.delete`;

export const SELECT = `${PREFIX}.plot.select`;

export const SELECTION_CHANGE = `${PREFIX}.plot.selectionChange`;

export const RENDER = `${PREFIX}.plot.render`;

/** ---------------------------------------- 注册事件 ------------------------------------------- **/
