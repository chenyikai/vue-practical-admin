interface WebsiteConfig {
  title: string;
  storageKey: string;
  indexPage: string;
  logo: string;
  defaultTabIcon: string;
  defaultAvatar: {
    male: string;
    female: string;
  };
  upload: {
    url: string;
    ossType: number;
  };
  iv: string;
  key: string;
  fistPage: {
    label: string;
    value: string;
    params: Record<string, unknown>;
    query: Record<string, unknown>;
    icon: string;
    meta: {
      isTab: boolean;
    };
  };
  pageIcon: {
    404: number;
  };
  gender: {
    MALE: number;
    FEMALE: number;
  };
  isFirstPage?: boolean;
  scaleRatio: number;
  menu: {
    props: {
      id: string;
      fId: string;
      label: string;
      path: string;
      icon: string;
      children: string;
      meta: string;
    };
  };
  pageStatus: {
    CREATE: string;
    UPDATE: string;
    DETAIL: string;
  };
}

function getIcon(name: string): string {
  if (import.meta.env.BASE_URL !== "/") {
    return `${import.meta.env.BASE_URL}/${name}`;
  }
  return name;
}

const website: WebsiteConfig = {
  title: import.meta.env.VITE_TITLE,
  storageKey: "cong-yu-vue3-admin",
  indexPage: "index",
  logo: getIcon("vite.svg"),
  defaultTabIcon: getIcon("tab.svg"),
  defaultAvatar: {
    male: getIcon("male.svg"),
    female: getIcon("female.svg"),
  },
  upload: {
    url: "/rest/file/upload",
    ossType: 1,
  },
  iv: "mbr7wfpyv42alkv1",
  key: "llt2qxh6zgx85sbx",
  fistPage: {
    label: "主页",
    value: "/index",
    params: {},
    query: {},
    icon: "index",
    meta: {
      isTab: true,
    },
  },
  pageIcon: {
    404: 404,
  },
  gender: {
    MALE: 0,
    FEMALE: 1,
  },
  scaleRatio: 1920 / window.innerWidth,
  menu: {
    props: {
      id: "id",
      fId: "fId",
      label: "menuName",
      path: "path",
      icon: "icon",
      children: "children",
      meta: "meta",
    },
  },
  pageStatus: {
    CREATE: "create",
    UPDATE: "update",
    DETAIL: "detail",
  },
};

export default website;

export const iconfontUrl = "//at.alicdn.com/t/font_$key.css";
export const iconFonts = ["2636982_ukga8onc90h"];
