import { defineStore } from "pinia";
import website from "@/config/website";
import { getStore, setStore } from "@/utils/store";
import router from "@/router/index";

export interface TabItem {
  label: string;
  value: string;
  params: Record<string, unknown>;
  query: Record<string, string | string[]>;
  meta: Record<string, unknown>;
  icon: string | number;
}

const tagWel: TabItem = website.fistPage as TabItem;

const tabStore = defineStore("tab", {
  state: () => ({
    tab: (getStore({ name: "tab" }) as TabItem | undefined) ?? ({} as TabItem),
    tabList: (getStore({ name: "tabList" }) as TabItem[] | undefined) ?? [],
  }),
  actions: {
    find(tab: TabItem): TabItem | undefined {
      return this.tabList.find((item) => item.value === tab.value);
    },
    add(data: TabItem): void {
      this.tab = data;
      setStore({ name: "tab", content: this.tab });

      const alreadyExists = this.tabList.some((item) => item.value === data.value);
      if (alreadyExists) {
        return;
      }

      if (data.label === "页面不存在") {
        data.icon = website.pageIcon[404];
      }
      this.tabList.push(data);
      setStore({ name: "tabList", content: this.tabList });
    },
    updateAll(list: TabItem[]): void {
      this.tabList = list;
      setStore({ name: "tabList", content: this.tabList });
    },
    delete(data: TabItem): void {
      const index = this.tabList.findIndex((item) => item.value === data.value);
      if (index === -1) {
        return;
      }

      const isLast = index === this.tabList.length - 1;
      this.tabList.splice(index, 1);
      setStore({ name: "tabList", content: this.tabList });

      if (data.value === this.tab.value) {
        const nextTab = this.tabList[isLast ? index - 1 : index];
        if (nextTab) {
          this.tab = nextTab;
          setStore({ name: "tab", content: this.tab });
        }
      }
      void router.push({ path: this.tab.value, query: this.tab.query });
    },
    deleteRight(data: TabItem): void {
      const index = this.tabList.findIndex((item) => item.value === data.value);
      if (index === -1) {
        return;
      }

      this.tabList = this.tabList.slice(0, index + 1);
      setStore({ name: "tabList", content: this.tabList });

      const stillExists = this.tabList.some((item) => item.value === this.tab.value);
      if (!stillExists) {
        const lastTab = this.tabList.at(-1);
        if (lastTab) {
          this.tab = lastTab;
          setStore({ name: "tab", content: this.tab });
          void router.push({ path: this.tab.value, query: this.tab.query });
        }
      }
    },
    deleteAll(): void {
      this.tabList = [tagWel];
      this.tab = tagWel;
      setStore({ name: "tab", content: this.tab });
      setStore({ name: "tabList", content: this.tabList });
      void router.push({ path: this.tab.value, query: this.tab.query });
    },
    deleteOther(tab: TabItem): void {
      this.tabList = this.tabList.filter(
        (item) =>
          item.value === tab.value ||
          (!website.isFirstPage && item.value === website.fistPage.value),
      );
      setStore({ name: "tabList", content: this.tabList });
      const lastTab = this.tabList.at(-1);
      if (lastTab) {
        this.tab = lastTab;
        setStore({ name: "tab", content: this.tab });
        void router.push({ path: this.tab.value, query: this.tab.query });
      }
    },
    clean(): void {
      this.tab = { label: "", value: "", params: {}, query: {}, meta: {}, icon: "" };
      setStore({ name: "tab", content: this.tab });
    },
  },
});

export default tabStore;
