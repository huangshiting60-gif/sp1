/**
 * p5.js sketch for the interactive background.
 *
 * 特色 (v11 - 柔和知性光暈):
 * - 創造數個巨大、半透明、緩慢移動的圓形色塊。
 * - 色塊之間會自然交疊、融合，形成類似極光的柔和動態背景。
 * - 色彩取自網站主題色 (鼠尾草綠、藕粉)，確保視覺和諧。
 */

// 用於存放所有光暈球體的陣列
let orbs = [];
const numOrbs = 4; // 光暈球體的數量

// 調色盤，使用符合網站主題的柔和色彩
const palette = [
  'rgba(109, 152, 134, 0.12)',  // sage green --primary-color
  'rgba(242, 233, 228, 0.15)',  // dusty pink --tag-bg
  'rgba(64, 90, 82, 0.1)'       // dark sage --accent-color
];

/**
 * Orb 類別定義了每個光暈球體的行為
 */
class Orb {
  constructor() {
    // 從隨機位置開始
    this.pos = createVector(random(width), random(height));
    // 隨機的速度
    this.vel = p5.Vector.random2D().mult(random(0.2, 0.5));
    // 設定一個較大的尺寸，讓它們可以互相覆蓋
    this.size = random(width / 2, width);
    // 從調色盤中隨機選色
    this.color = random(palette);
  }

  /**
   * update() - 更新球體的位置
   */
  update() {
    this.pos.add(this.vel);

    // 環繞於畫面邊緣
    if (this.pos.x < -this.size / 2) this.pos.x = width + this.size / 2;
    if (this.pos.x > width + this.size / 2) this.pos.x = -this.size / 2;
    if (this.pos.y < -this.size / 2) this.pos.y = height + this.size / 2;
    if (this.pos.y > height + this.size / 2) this.pos.y = -this.size / 2;
  }

  /**
   * display() - 在畫布上渲染球體
   */
  display() {
    noStroke();
    fill(this.color);
    // 繪製一個巨大的圓形
    circle(this.pos.x, this.pos.y, this.size);
  }
}

/**
 * setup() - 在程式開始時運行一次
 */
function setup() {
  // 創建一個填滿瀏覽器視窗的畫布
  let canvas = createCanvas(windowWidth, windowHeight);
  // 將畫布附加到指定的容器 div 中
  canvas.parent('p5-canvas-container');

  // 創建光暈球體
  for (let i = 0; i < numOrbs; i++) {
    orbs.push(new Orb());
  }

  // --- 漢堡選單與平滑滾動互動邏輯 ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  // 選取所有帶有 href 屬性的連結
  const links = document.querySelectorAll('a[href]');

  // 點擊漢堡圖示時，切換導覽列的顯示狀態
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Handle dropdown click for mobile
  const dropdownToggle = document.querySelector('.dropdown > a');
  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        const dropdownContent = dropdownToggle.nextElementSibling;
        dropdownContent.classList.toggle('active');
      }
    });
  }

  // 為所有導覽連結加上點擊事件處理
  for (const link of links) {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // 如果連結不包含 #，代表它不是錨點連結，直接讓瀏覽器正常跳轉
      if (!href.includes('#')) {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
        return;
      }

      // 建立一個完整的 URL 物件，以便輕鬆比較路徑和錨點
      const url = new URL(href, window.location.href);

      // 如果連結指向的頁面不是目前頁面，就讓瀏覽器正常跳轉
      if (url.pathname !== window.location.pathname) {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
        return;
      }

      // 如果執行到這裡，代表這是一個目前頁面的錨點連結，我們來處理平滑滾動
      if (url.hash) {
        e.preventDefault(); // 防止預設的跳轉行為
        const targetId = url.hash.substring(1); // 移除 '#'
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const navbarHeight = document.querySelector('.navbar').offsetHeight;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }

      // 如果是手機版選單，點擊後關閉
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });
  }
}

/**
 * draw() - 以迴圈方式連續運行
 */
function draw() {
  // 使用網站主題的背景色
  background(253, 252, 250); // --bg-color: #fdfcfa
  // 對整個畫布套用模糊效果，讓圓形邊緣柔和化
  filter(BLUR, 12);

  // 更新並顯示所有光暈球體
  for (let orb of orbs) {
    orb.update();
    orb.display();
  }
}

/**
 * windowResized() - 每當瀏覽器視窗被調整大小時，
 * p5.js 會自動呼叫此函數
 */
function windowResized() {
  // 將畫布尺寸調整為新的視窗尺寸
  resizeCanvas(windowWidth, windowHeight);
  // 重新初始化球體以適應新畫布
  orbs = [];
  for (let i = 0; i < numOrbs; i++) {
    orbs.push(new Orb());
  }
}
