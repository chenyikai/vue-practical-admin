export const classes = {
  CONTROL_BASE: "mapboxgl-ctrl",
  CONTROL_PREFIX: "mapboxgl-ctrl-",
  CONTROL_BUTTON: "mapbox-gl-draw_ctrl-draw-btn",
  CONTROL_BUTTON_LINE: "mapbox-gl-draw_line",
  CONTROL_BUTTON_POLYGON: "mapbox-gl-draw_polygon",
  CONTROL_BUTTON_POINT: "mapbox-gl-draw_point",
  CONTROL_BUTTON_TRASH: "mapbox-gl-draw_trash",
  CONTROL_BUTTON_COMBINE_FEATURES: "mapbox-gl-draw_combine",
  CONTROL_BUTTON_UNCOMBINE_FEATURES: "mapbox-gl-draw_uncombine",
  CONTROL_GROUP: "mapboxgl-ctrl-group",
  ATTRIBUTION: "mapboxgl-ctrl-attrib",
  ACTIVE_BUTTON: "active",
  BOX_SELECT: "mapbox-gl-draw_boxselect",
};

export const properties = {
  RADIUS: "radius",
  CENTER: "center",
  BEARING: "bearing",
  BEARING1: "bearing1",
  BEARING2: "bearing2",
  UNITS: "units",
  STEPS: "steps",
  POINT1: "p1",
  POINT2: "p2",
  DISABLED: "disabled",
};

export const sources = {
  HOT: "mapbox-gl-draw-hot",
  COLD: "mapbox-gl-draw-cold",
};

export const cursors = {
  ADD: "add",
  MOVE: "move",
  DRAG: "drag",
  POINTER: "pointer",
  NONE: "none",
};

export const types = {
  POLYGON: "polygon",
  LINE: "line_string",
  POINT: "point",
  CIRCLE: "circle",
  SECTOR: "sector",
};

export const geojsonTypes = {
  FEATURE: "Feature",
  POLYGON: "Polygon",
  LINE_STRING: "LineString",
  POINT: "Point",
  FEATURE_COLLECTION: "FeatureCollection",
  MULTI_PREFIX: "Multi",
  MULTI_POINT: "MultiPoint",
  MULTI_LINE_STRING: "MultiLineString",
  MULTI_POLYGON: "MultiPolygon",
};

export const modes = {
  DRAW_LINE_STRING: "draw_line_string",
  DRAW_POLYGON: "draw_polygon",
  DRAW_POINT: "draw_point",
  DRAW_CUSTOM_POINT: "draw_custom_point",
  DRAW_TEXT: "draw_text",
  SIMPLE_SELECT: "simple_select",
  SIMPLE_SELECT_WITH_EDITOR: "simple_select_with_editor",
  DIRECT_SELECT: "direct_select",
  DIRECT_SELECT_WITH_EDITOR: "direct_select_with_editor",
  STATIC: "static",
  DRAW_CIRCLE: "draw_circle",
  DRAW_SECTOR: "draw_sector",
  DRAW_RECTANGLE: "draw_rectangle",
  DRAW_ARROW: "draw_arrow",
  DRAW_LAY_LINE: "draw_lay_line",
  DRAW_LINE_STRING_WITH_EDITOR: "draw_line_string_with_editor",
};

export const events = {
  CREATE: "draw.create",
  DELETE: "draw.delete",
  UPDATE: "draw.update",
  SELECTION_CHANGE: "draw.selectionchange",
  MODE_CHANGE: "draw.modechange",
  ACTIONABLE: "draw.actionable",
  RENDER: "draw.render",
  COMBINE_FEATURES: "draw.combine",
  UNCOMBINE_FEATURES: "draw.uncombine",
};

export const updateActions = {
  MOVE: "move",
  CHANGE_COORDINATES: "change_coordinates",
};

export const meta = {
  FEATURE: "feature",
  MIDPOINT: "midpoint",
  VERTEX: "vertex",
  ARROW: "arrow",
};

export const activeStates = {
  ACTIVE: "true",
  INACTIVE: "false",
};

export const interactions = [
  "scrollZoom",
  "boxZoom",
  "dragRotate",
  "dragPan",
  "keyboard",
  "doubleClickZoom",
  "touchZoomRotate",
];

export const LAT_MIN = -90;
export const LAT_RENDERED_MIN = -85;
export const LAT_MAX = 90;
export const LAT_RENDERED_MAX = 85;
export const LNG_MIN = -270;
export const LNG_MAX = 270;
