<script>
export default {
    name: "SideBar",
};
</script>

<script setup>
import {
    getDetailOne,
    getAllWithPoi,
    getAllWithPoiAnJi,
    getPagepoiTType,
    getPagepoiTTypeShore,
    updatePtSystemConfig,
} from "./api.js";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { setStore } from "@/utils/store.js";
import { parse } from "wellknown";
import { bbox } from "@turf/turf";
import { MapboxLayer } from "@/plugins";
// 图层数据
const layerList = reactive([
    {
        label: "岸基图层",
        id: "001",
        children: [],
    },
    {
        label: "海上图层",
        id: "002",
        children: [],
    },
]);
let rules = {
    lat: [
        { required: true, message: "请输入数字", trigger: "blur" },
        {
            validator: (rule, value, callback) => {
                if (
                    value !== null &&
                    (isNaN(value) || value < -90 || value > 90)
                ) {
                    callback(new Error("请输入-90到90之间的数字"));
                } else {
                    callback();
                }
            },
            trigger: "blur",
        },
    ],
    lng: [
        { required: true, message: "请输入数字", trigger: "blur" },
        {
            validator: (rule, value, callback) => {
                if (
                    value !== null &&
                    (isNaN(value) || value < -180 || value > 180)
                ) {
                    callback(new Error("请输入-180到180之间的数字"));
                } else {
                    callback();
                }
            },
            trigger: "blur",
        },
    ],
};

let seaList = ref([]);
let poiList = ref([]);
let defaultCheckKey = ref([]);
let type = ref([]);
const form = ref({});
Promise.all([
    getAllWithPoi(),
    getAllWithPoiAnJi(),
    getDetailOne(),
    getPagepoiTType(),
    getPagepoiTTypeShore(),
]).then(([sea, anji, detail, seaType, anJiType]) => {
    type.value = [...seaType.data.data.rows, ...anJiType.data.data.rows];
    poiList.value = anji.data.data; //岸基
    seaList.value = sea.data.data; //海上
    layerList[0].children = poiList.value.map((item) => {
        let arr = [];
        if (item.shorePoiTInfoList && item.shorePoiTInfoList.length) {
            arr = item.shorePoiTInfoList.map((i) => {
                return {
                    label: i.name,
                    ...i,
                };
            });
        }
        return {
            label: item.name,
            id: item.code,
            children: arr,
        };
    });
    layerList[1].children = seaList.value.map((item) => {
        let arr = [];
        if (item.poiTInfoList && item.poiTInfoList.length) {
            arr = item.poiTInfoList.map((i) => {
                return {
                    label: i.name,
                    ...i,
                };
            });
        }
        return {
            label: item.name,
            id: item.code,
            children: arr,
        };
    });
    const { poiTypeCode, shoreTypeCode } = detail.data.data;
    form.value = detail.data.data;
    if (form.value.poiTypeCode) {
        form.value.poiTypeCode = JSON.parse(form.value.poiTypeCode);
    }
    if (form.value.shoreTypeCode) {
        form.value.shoreTypeCode = JSON.parse(form.value.shoreTypeCode);
    }
    if (form.value.shoreTypeCode && form.value.shoreTypeCode) {
        defaultCheckKey.value = [
            ...JSON.parse(poiTypeCode),
            ...JSON.parse(shoreTypeCode),
        ];
    } else {
        defaultCheckKey.value = [];
    }
});

defineOptions({
    name: "SideBar",
});

// 侧边栏列表
const sideBarList = reactive([
    // {
    //     id: 1,
    //     label: "船舶",
    //     type: "ship",
    //     icon: new URL("@/assets/images/map/sideBar/ship.png", import.meta.url)[
    //         "href"
    //     ],
    //     component: "ship",
    //     active: false,
    // },
    // {
    //     id: 2,
    //     label: "气象",
    //     type: "weather",
    //     icon: new URL(
    //         "@/assets/images/map/sideBar/weather.png",
    //         import.meta.url
    //     )["href"],
    //     component: "weather",
    //     active: false,
    // },
    {
        id: 3,
        label: "图层",
        type: "layer",
        icon: new URL("@/assets/images/map/sideBar/layer.png", import.meta.url)[
            "href"
        ],
        component: "layer",
        active: false,
    },
    {
        id: 4,
        label: "设置",
        type: "tool",
        icon: new URL("@/assets/images/map/sideBar/tool.png", import.meta.url)[
            "href"
        ],
        component: "tool",
        active: false,
    },
    // {
    //     id: 5,
    //     label: "图源",
    //     type: "layerSource",
    //     icon: new URL(
    //         "@/assets/images/map/sideBar/source.png",
    //         import.meta.url
    //     )["href"],
    //     component: "layerSource",
    //     active: false,
    // },
]);
let label = ref("");
let active = ref(false);
// 图层显隐
function onClick(item) {
    label.value = item.label;
    if (item.label == "图层") {
        active.value = sideBarList[0].active = !sideBarList[0].active;
        sideBarList[1].active = false;
    }
    if (item.label == "设置") {
        active.value = sideBarList[1].active = !sideBarList[1].active;
        sideBarList[0].active = false;
    }
}

const tree = ref("");
function handleCheckChange() {
    MapboxLayer.clear();
    let nodes = tree.value.getCheckedNodes().filter((item) => !item.children);
    nodes = nodes.map((item) => {
        let ele = type.value.find((i) => i.code == item.typeCode);
        return {
            ...item,
            icon: ele.icon || "",
        };
    });
    const features = MapboxLayer.handleAllTypeLayer(nodes);
    features.length !== 0 && MapboxLayer.render(features);
}

function handleCheck() {
    updatePtSystemConfig(form.value)
        .then(({ data }) => {
            if (data.code == "200") {
                ElMessage({
                    message: "设置成功",
                    type: "success",
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            window.location.reload();
        });
}
function handleNodeClick(node) {
    if (node.geom) {
        let _bbox = bbox(parse(node.geom));
        window.map.fitBounds(
            [
                [_bbox[0], _bbox[1]],
                [_bbox[2], _bbox[3]],
            ],
            {
                padding: { top: 70, bottom: 80, left: 30, right: 30 },
            }
        );
    }
}
</script>

<template>
    <ul class="side-bar-container">
        <li
            class="side-bar-item"
            v-for="item in sideBarList"
            :key="item.id"
            @click="onClick(item)"
        >
            <div class="icon-layout" @click.stop>
                <img
                    @click="onClick(item)"
                    :src="item.icon"
                    :alt="item.label"
                />
            </div>
            <div class="text-layout">{{ item.label }}</div>
        </li>
        <div class="layer_dialog" v-if="label == '图层' && active">
            <!-- :default-checked-keys="defaultKey" -->
            <el-tree
                ref="tree"
                style="margin-top: 5px"
                :data="layerList"
                :default-expanded-keys="['001', '002']"
                :default-checked-keys="defaultCheckKey"
                node-key="id"
                show-checkbox
                @node-click="handleNodeClick"
                @check="handleCheckChange"
            />
        </div>
        <div class="setup" v-if="label == '设置' && active">
            <el-form :model="form" label-width="130px" :rules="rules">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="初始经度" prop="lng">
                            <el-input-number
                                style="width: 100%"
                                v-model="form.lng"
                                :min="-179.99"
                                :max="179.99"
                                :precision="6"
                                :style="{ width: '300px' }"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="初始纬度" prop="lat">
                            <el-input-number
                                style="width: 100%"
                                v-model="form.lat"
                                :min="-89.99"
                                :max="89.99"
                                :precision="6"
                                :style="{
                                    width: '300px',
                                    'text-align': 'center',
                                }"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="默认层级">
                            <el-input-number
                                style="width: 100%"
                                v-model="form.mrcj"
                                :precision="2"
                                :style="{
                                    width: '300px',
                                    'text-align': 'center',
                                }"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="度分秒格式">
                            <el-radio-group v-model="form.dfmgs">
                                <el-radio :label="1">度</el-radio>
                                <el-radio :label="2">度分</el-radio>
                                <el-radio :label="3">度分秒</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="默认图源">
                            <el-radio-group v-model="form.mrty">
                                <el-radio :label="5">海陆图</el-radio>
                                <el-radio :label="2">海图</el-radio>
                                <el-radio :label="3">卫星图</el-radio>
                                <el-radio :label="4">地图</el-radio>
                                <el-radio :label="6">影像图</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="默认展示海上类型">
                            <el-select v-model="form.poiTypeCode" multiple>
                                <el-option
                                    v-for="item in seaList"
                                    :label="item.name"
                                    :value="item.code"
                                    :key="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="默认展示岸基类型">
                            <el-select v-model="form.shoreTypeCode" multiple>
                                <el-option
                                    v-for="item in poiList"
                                    :label="item.name"
                                    :value="item.code"
                                    :key="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="btn">
                    <el-button
                        type="warning"
                        style="margin-right: 10px"
                        @click="onClick({ label: '设置' })"
                        >取消</el-button
                    >
                    <el-button
                        type="primary"
                        style="margin-right: 10px"
                        @click="handleCheck"
                        >确认</el-button
                    >
                </div>
            </el-form>
        </div>
    </ul>
</template>

<style scoped lang="scss">
.side-bar-container {
    position: absolute;
    right: 0;
    top: 30px;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    .side-bar-item {
        pointer-events: auto;
        display: flex;
        justify-content: flex-end;
        position: relative;
        cursor: pointer;
        user-select: none;
        // overflow: hidden;
        & + .side-bar-item {
            margin-top: 20px;
        }
        &.active,
        &:hover {
            &:after {
                background-color: transparent;
            }
            .text-layout {
                width: 88px;
            }
        }
        + .map-util-menu-item {
            margin-top: 20px;
        }
        .icon-layout {
            width: 48px;
            height: 48px;
            background-color: #8cc6fc;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 2px solid #255d88;
            z-index: 1;
            img {
                width: 48px;
                height: 48px;
            }
        }
        .text-layout {
            height: 48px;
            width: 68px;
            background-color: #255d88;
            margin-left: -22px;
            z-index: 0;
            padding-left: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #ffffff;
            transition: all 0.3s;
        }
    }

    .btn {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
    scrollbar-width: none;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
        display: none;
    }
    ::v-deep .el-tree-node__content {
        background-color: #255d88 !important;
    }
    .layer_dialog {
        width: 350px;
        padding-right: 10px;
        border-radius: 10px;
        height: 900px;
        background-color: #255d88;
        border: 3px solid #113a60;
        position: absolute;
        right: 120px;
        top: 0px;
        overflow: auto;
    }
    .setup {
        width: auto;
        border-radius: 10px;
        pointer-events: auto;
        margin-top: 70px;
        padding: 20px;
        // height: 350px;
        // padding-top: 20px;
        background-color: #255d88;
        border: 3px solid #113a60;
        position: absolute;
        right: 120px;
        top: -70px;
    }
    ::v-deep .el-tree-node__content {
        white-space: wrap !important;
    }
}
</style>
