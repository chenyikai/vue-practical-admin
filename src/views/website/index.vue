<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// --- 状态管理 ---
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

// --- 数据模拟 ---
const navLinks = [
  { name: "产品服务", href: "#features" },
  { name: "解决方案", href: "#solutions" },
  { name: "客户案例", href: "#cases" },
  { name: "关于我们", href: "#footer" },
];

const features = [
  {
    title: "云原生架构",
    desc: "基于容器化技术的微服务架构，支持弹性伸缩，轻松应对高并发场景。",
    icon: "☁️",
  },
  {
    title: "全链路监控",
    desc: "从前端到后端的端到端可观测性，实时发现并定位性能瓶颈。",
    icon: "📊",
  },
  {
    title: "智能运维",
    desc: "AI 驱动的自动化运维平台，故障自愈率高达 90%，大幅降低运维成本。",
    icon: "🤖",
  },
  {
    title: "数据安全",
    desc: "金融级加密标准，多重容灾备份机制，确保企业核心数据万无一失。",
    icon: "🔒",
  },
];

const stats = [
  { val: "99.99%", label: "SLA 保证" },
  { val: "500+", label: "全球节点" },
  { val: "10万+", label: "企业客户" },
  { val: "24/7", label: "技术支持" },
];

const cases = [
  {
    id: 1,
    title: "某大型电商平台数字化转型实践",
    cat: "零售电商",
    img: "https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "金融科技独角兽的高性能架构之道",
    cat: "金融科技",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "制造业利用 AI 实现产线智能化升级",
    cat: "智能制造",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

// --- 交互逻辑 ---
const toggleMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="portal-wrapper">
    <!-- 1. Header Navigation -->
    <header class="header" :class="{ 'is-scrolled': isScrolled }">
      <div class="container header__inner">
        <div class="header__logo">
          <div class="logo-box">V</div>
          <span>VuePortal</span>
        </div>

        <nav class="header__nav desktop-only">
          <a v-for="link in navLinks" :key="link.name" :href="link.href">{{ link.name }}</a>
        </nav>

        <div class="header__actions desktop-only">
          <button class="btn btn--text">登录</button>
          <button class="btn btn--primary">免费试用</button>
        </div>

        <div
          class="header__burger mobile-only"
          @click="toggleMenu"
          :class="{ active: isMobileMenuOpen }">
          <span />
          <span />
          <span />
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <transition name="slide-fade">
        <div v-show="isMobileMenuOpen" class="mobile-menu">
          <a v-for="link in navLinks" :key="link.name" :href="link.href" @click="toggleMenu">{{
            link.name
          }}</a>
          <div class="mobile-menu__btns">
            <button class="btn btn--primary full-width">立即开始</button>
          </div>
        </div>
      </transition>
    </header>

    <!-- 2. Hero Section -->
    <section class="hero">
      <div class="hero__bg-shapes">
        <div class="shape shape--1" />
        <div class="shape shape--2" />
      </div>

      <div class="container hero__content">
        <span class="tag">🚀 Next-Gen Platform</span>
        <h1 class="hero__title">
          重塑您的 <br />
          <span class="text-gradient">数字化未来</span>
        </h1>
        <p class="hero__desc">
          一站式企业级解决方案，融合云计算、大数据与人工智能，助您在数字经济浪潮中抢占先机。
        </p>
        <div class="hero__btns">
          <button class="btn btn--primary btn--lg">立即咨询</button>
          <button class="btn btn--outline btn--lg">观看演示 <span class="arrow">→</span></button>
        </div>
      </div>
    </section>

    <!-- 3. Features -->
    <section id="features" class="section bg-light">
      <div class="container">
        <div class="section-head">
          <h2>全方位能力矩阵</h2>
          <p>模块化设计，按需组合，灵活适配各种业务场景。</p>
        </div>

        <div class="grid grid--4">
          <div v-for="(item, i) in features" :key="i" class="card feature-card">
            <div class="icon-wrapper">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Stats -->
    <section class="stats">
      <div class="container">
        <div class="grid grid--4 stats__grid">
          <div v-for="(stat, i) in stats" :key="i" class="stat-item">
            <div class="stat-val">{{ stat.val }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Cases / Showcase -->
    <section id="cases" class="section">
      <div class="container">
        <div class="section-head">
          <h2>客户成功案例</h2>
          <p>见证 1000+ 头部企业的创新实践。</p>
        </div>

        <div class="grid grid--3">
          <article v-for="c in cases" :key="c.id" class="card case-card">
            <div class="case-card__img">
              <img :src="c.img" :alt="c.title" />
              <span class="category">{{ c.cat }}</span>
            </div>
            <div class="case-card__body">
              <h3>{{ c.title }}</h3>
              <a href="#" class="link-arrow">阅读详情</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 6. Footer -->
    <footer id="footer" class="footer">
      <div class="container footer__inner">
        <div class="footer__left">
          <div class="logo-text">VuePortal</div>
          <p>赋能企业，连接未来。</p>
        </div>
        <div class="footer__links">
          <a href="#">产品文档</a>
          <a href="#">开发者社区</a>
          <a href="#">隐私政策</a>
          <a href="#">联系我们</a>
        </div>
      </div>
      <div class="container footer__copy">&copy; 2024 VuePortal Inc.保留所有权利。</div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
// --- Variables & Config ---
$primary: #0066ff;
$secondary: #7b2cbf;
$dark: #0f172a;
$text: #334155;
$text-light: #64748b;
$bg-light: #f8fafc;
$white: #ffffff;

$nav-height: 72px;
$radius: 16px;
$shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
$shadow-lg:
  0 20px 25px -5px rgba(0, 0, 0, 0.1),
  0 10px 10px -5px rgba(0, 0, 0, 0.04);

// --- Mixins ---
@mixin mobile {
  @media (max-width: 768px) {
    @content;
  }
}

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// --- Global Reset / Base ---
.portal-wrapper {
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  color: $text;
  line-height: 1.6;
  background-color: $white;
}

.container {
  //max-width: 1200px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0 auto;
  //padding: 0 24px;
}

h1,
h2,
h3 {
  color: $dark;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

// --- Buttons ---
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.4rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.3s ease;

  &--primary {
    background: $primary;
    color: $white;
    &:hover {
      background: darken($primary, 5%);
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba($primary, 0.3);
    }
  }

  &--outline {
    background: transparent;
    border-color: #cbd5e1;
    color: $text;
    &:hover {
      border-color: $primary;
      color: $primary;
    }
  }

  &--text {
    background: transparent;
    color: $text;
    &:hover {
      color: $primary;
    }
  }

  &--lg {
    padding: 0.9rem 2.2rem;
    font-size: 1.1rem;
  }
}

// --- Header ---
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $nav-height;
  z-index: 1000;
  transition: all 0.3s ease;

  &.is-scrolled {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    box-shadow: $shadow-sm;
  }

  &__inner {
    height: 100%;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    font-size: 1.25rem;
    color: $dark;

    .logo-box {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, $primary, $secondary);
      color: $white;
      border-radius: 8px;
      @include flex-center;
    }
  }

  &__nav {
    display: flex;
    gap: 2rem;

    a {
      text-decoration: none;
      color: $text;
      font-weight: 500;
      position: relative;

      &:hover {
        color: $primary;
      }

      // Underline animation
      &::after {
        content: "";
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 2px;
        background: $primary;
        transition: width 0.3s;
      }
      &:hover::after {
        width: 100%;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
  }

  // Burger Menu Icon
  &__burger {
    width: 28px;
    height: 20px;
    position: relative;
    cursor: pointer;

    span {
      display: block;
      width: 100%;
      height: 2px;
      background: $dark;
      position: absolute;
      transition: all 0.3s;

      &:nth-child(1) {
        top: 0;
      }
      &:nth-child(2) {
        top: 50%;
        transform: translateY(-50%);
      }
      &:nth-child(3) {
        bottom: 0;
      }
    }

    &.active {
      span:nth-child(1) {
        transform: rotate(45deg);
        top: 9px;
      }
      span:nth-child(2) {
        opacity: 0;
      }
      span:nth-child(3) {
        transform: rotate(-45deg);
        bottom: 9px;
      }
    }
  }
}

// Mobile Menu Styles
.mobile-menu {
  position: absolute;
  top: $nav-height;
  left: 0;
  width: 100%;
  background: $white;
  padding: 1.5rem;
  box-shadow: $shadow-lg;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top: 1px solid #f1f5f9;

  a {
    text-decoration: none;
    color: $text;
    font-weight: 600;
    padding: 0.5rem 0;
  }

  &__btns {
    margin-top: 1rem;
    .full-width {
      width: 100%;
    }
  }
}

// Vue Transition
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

// --- Hero Section ---
.hero {
  position: relative;
  padding: 180px 0 120px;
  overflow: hidden;
  text-align: center;

  &__bg-shapes {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;

    .shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: float 8s infinite ease-in-out;
    }
    .shape--1 {
      width: 400px;
      height: 400px;
      background: $primary;
      top: -100px;
      left: -100px;
    }
    .shape--2 {
      width: 300px;
      height: 300px;
      background: $secondary;
      bottom: 0;
      right: -50px;
      animation-delay: 4s;
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    max-width: 800px;
  }

  .tag {
    display: inline-block;
    padding: 6px 16px;
    background: rgba($primary, 0.1);
    color: $primary;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  &__title {
    font-size: 4rem;
    letter-spacing: -0.03em;
    margin-bottom: 1.5rem;

    .text-gradient {
      background: linear-gradient(120deg, $primary, $secondary);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    @include mobile {
      font-size: 2.5rem;
    }
  }

  &__desc {
    font-size: 1.25rem;
    color: $text-light;
    margin-bottom: 3rem;
  }

  &__btns {
    display: flex;
    justify-content: center;
    gap: 1rem;

    @include mobile {
      flex-direction: column;
    }

    .arrow {
      transition: transform 0.3s;
    }
    button:hover .arrow {
      transform: translateX(5px);
    }
  }
}

// --- Features & Cards ---
.section {
  padding: 100px 0;
  &.bg-light {
    background-color: $bg-light;
  }
}

.section-head {
  text-align: center;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  h2 {
    font-size: 2.25rem;
  }
  p {
    font-size: 1.1rem;
    color: $text-light;
  }
}

.grid {
  display: grid;
  gap: 2rem;

  &--4 {
    grid-template-columns: repeat(4, 1fr);
  }
  &--3 {
    grid-template-columns: repeat(3, 1fr);
  }

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.card {
  background: $white;
  border-radius: $radius;
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-lg;
  }
}

.feature-card {
  padding: 2.5rem;
  border: 1px solid #e2e8f0;

  .icon-wrapper {
    width: 60px;
    height: 60px;
    background: lighten($bg-light, 1%);
    border-radius: 12px;
    @include flex-center;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }
  p {
    font-size: 0.95rem;
    color: $text-light;
  }
}

// --- Stats ---
.stats {
  background: $dark;
  color: $white;
  padding: 80px 0;

  &__grid {
    text-align: center;
    @include mobile {
      gap: 3rem;
    }
  }

  .stat-val {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: linear-gradient(to right, $primary, #a855f7);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .stat-label {
    font-size: 1rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

// --- Cases ---
.case-card {
  overflow: hidden;
  box-shadow: $shadow-sm;

  &__img {
    height: 220px;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .category {
      position: absolute;
      top: 15px;
      left: 15px;
      background: rgba($white, 0.9);
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      color: $primary;
    }
  }

  &:hover {
    .case-card__img img {
      transform: scale(1.08);
    }
    h3 {
      color: $primary;
    }
  }

  &__body {
    padding: 1.5rem;

    h3 {
      font-size: 1.15rem;
      margin-bottom: 1rem;
      transition: color 0.3s;
    }

    .link-arrow {
      color: $primary;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// --- Footer ---
.footer {
  background: $dark;
  color: #94a3b8;
  padding: 60px 0 20px;

  &__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;

    @include mobile {
      flex-direction: column;
      gap: 30px;
      text-align: center;
    }
  }

  .logo-text {
    color: $white;
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  &__links {
    display: flex;
    gap: 2rem;

    @include mobile {
      flex-direction: column;
      gap: 1rem;
    }

    a {
      color: #cbd5e1;
      text-decoration: none;
      transition: color 0.3s;
      &:hover {
        color: $white;
      }
    }
  }

  &__copy {
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 20px;
    font-size: 0.85rem;
  }
}

// --- Utilities ---
.desktop-only {
  @include mobile {
    display: none !important;
  }
}
.mobile-only {
  display: none !important;
  @include mobile {
    display: block !important;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
