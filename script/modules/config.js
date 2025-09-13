// either man or woman section is selected
export let currentMode = "";
//array of products
export let productsData = "";
// Language state
export let currentLang = "en"; // Default English

// Translations object
export const translations = {
  fa: {
    home: "خانه",
    products: "محصولات",
    aboutUs: "درباره ما",
    contactUs: "تماس با ما",
    adminLogin: "ورود مدیریت",
    menProducts: "مردانه",
    womenProducts: "زنانه",
    search: "جستجو...",
    model: "مدل:",
    features: "ویژگی های ظاهری:",
    strapType: "نوع بند:",
    clasp: "سگک:",
    username: "Username",
    password: "Password",
    login: "Log in",
    loginError: "نام کاربری یا کلمه عبور صحیح نمی باشد",
    notFound: "محصولی یافت نشد",
    aboutText:
      "فروشگاه وایولت ارائه دهنده انواع ساعت در شهر تهران است. ما با تمرکز بر سه ویژگی، یعنی: قابل اعتماد بودن، خدمات مشتری و منحصر به فرد بودن در کنار شما خواهیم بود. فروشگاه وایولت در [سال] توسط [نام مؤسس] تأسیس شد، فروشگاه وایولت فعالیت خود را در شیراز آغاز کرده. هنگامی که [موسس فروشگاه] برای اولین بار شروع به فعالیت کرد، اشتیاق او به  فراهم کردن بهترین تجهیزات سوق داد. کار‌های روزانه به او انگیزه داد تا کار سخت و الهام بخش را به یک فروشگاه آنلاین پررونق تبدیل کند. ما اکنون در سرتاسر ایران به مشتریانمان خدمات ارائه می دهیم امیدواریم از محصولات ما به همان اندازه که ما از ارائه آن‌ها به شما لذت می‌‌بریم لذت ببرید. اگر سوال یا نظری دارید، لطفا با ما تماس بگیرید",
    address: "آدرس",
    addressText: "تهران-پونک جنوبی",
    phone: "شماره تلفن",
    email: "رایانامه",
    eitaa: "ایتا",
    rubika: "روبیکا",
    product: "محصول",
  },
  en: {
    home: "Home",
    products: "Collections",
    aboutUs: "About Us",
    contactUs: "Contact Us",
    adminLogin: "Admin Login",
    menProducts: "Men",
    womenProducts: "Women",
    search: "Search...",
    model: "Model:",
    features: "Features:",
    strapType: "Strap Type:",
    clasp: "Clasp:",
    username: "Username",
    password: "Password",
    login: "Log in",
    loginError: "Invalid username or password",
    notFound: "No products found",
    aboutText:
      "Violet Store is a provider of various watches in Tehran. We focus on three features: reliability, customer service, and uniqueness. Violet Store was founded in [year] by [founder name] and started its activity in Shiraz. When the founder first started, their passion drove them to provide the best equipment. Daily work motivated them to turn hard work and inspiration into a thriving online store. We now serve our customers throughout Iran and hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please contact us.",
    address: "Address",
    addressText: "Tehran - South Punak",
    phone: "Phone Number",
    email: "Email",
    eitaa: "Eitaa",
    rubika: "Rubika",
    product: "Product",
  },
};
// Functions to update these values
export function setCurrentLang(lang) {
  currentLang = lang;
}

export function setCurrentMode(mode) {
  currentMode = mode;
}

export function setProductsData(data) {
  productsData = data;
}
// Update about us text with styling
export function updateAboutText() {
  let aboutText = document.querySelector("#rightAboutUs p");
  if (aboutText) {
    if (currentLang === "fa") {
      aboutText.innerHTML =
        '<span class="brand-name">فروشگاه وایولت</span> ارائه دهنده انواع ساعت در شهر تهران است. <span class="highlight">ما با تمرکز بر سه ویژگی، یعنی: قابل اعتماد بودن، خدمات مشتری و منحصر به فرد بودن</span> در کنار شما خواهیم بود. فروشگاه وایولت در [سال] توسط [نام مؤسس] تأسیس شد، فروشگاه وایولت فعالیت خود را در شیراز آغاز کرده. هنگامی که [موسس فروشگاه] برای اولین بار شروع به فعالیت کرد، اشتیاق او به  فراهم کردن بهترین تجهیزات سوق داد. کار‌های روزانه به او انگیزه داد تا کار سخت و الهام بخش را به یک فروشگاه آنلاین پررونق تبدیل کند. <span class="highlight">ما اکنون در سرتاسر ایران به مشتریانمان خدمات ارائه می دهیم</span> امیدواریم از محصولات ما به همان اندازه که ما از ارائه آن‌ها به شما لذت می‌‌بریم لذت ببرید. اگر سوال یا نظری دارید، لطفا با ما تماس بگیرید';
    } else {
      aboutText.innerHTML =
        '<span class="brand-name">Violet Store</span> is a provider of various watches in Tehran. <span class="highlight">We focus on three features: reliability, customer service, and uniqueness.</span> Violet Store was founded in [year] by [founder name] and started its activity in Shiraz. When the founder first started, their passion drove them to provide the best equipment. Daily work motivated them to turn hard work and inspiration into a thriving online store. <span class="highlight">We now serve our customers throughout Iran</span> and hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please contact us.';
    }
  }
}
