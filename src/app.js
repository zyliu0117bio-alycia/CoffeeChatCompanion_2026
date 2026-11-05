/**
 * Coffee Chat Companion — App Logic
 * Single-page app with localStorage persistence.
 * Views: dashboard, contact list, contact detail (tabs: brief / questions / talk records / follow-ups)
 */

(function() {
  "use strict";

  var STORAGE_KEY = "coffee_chat_companion_v1";
  var STORAGE_VERSION_KEY = "coffee_chat_companion_version";
  var API_KEY_STORAGE = "coffee_chat_api_key";
  var API_ENDPOINT_STORAGE = "coffee_chat_api_endpoint";
  var API_MODEL_STORAGE = "coffee_chat_api_model";
  var CURRENT_VERSION = 10; // bump when seed data changes
  var APP_BUILD = "v30"; // bump on every code change to defeat file:// caching

  // --- Coffee Icons (inline SVG, drawn as simple silhouettes) ---
  var COFFEE_ICONS = {
    espresso: {
      label: "Espresso",
      color: "#5F4E3A",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M8 14 Q8 11 10 11 L20 11 Q22 11 22 14 L22 23 Q22 26 19 26 L13 26 Q10 26 10 23 Z" fill="#F7F3EE" stroke="#C9B8A5" stroke-width="1"/>' +
        '<path d="M10 14 L20 14 L20 23 Q20 24 19 24 L13 24 Q12 24 12 23 Z" fill="#3B2A1E"/>' +
        '<ellipse cx="15" cy="14" rx="5" ry="1.5" fill="#5A4231" opacity="0.9"/>' +
        '<path d="M22 16 Q25 16 25 18.5 Q25 21 22 21" fill="none" stroke="#C9B8A5" stroke-width="1.2" stroke-linecap="round"/>' +
        '<path d="M12 8 Q13 6 14 6" fill="none" stroke="#C9B8A5" stroke-width="0.8" stroke-linecap="round" opacity="0.7"/>' +
        '<path d="M15 8 Q16 6 17 6" fill="none" stroke="#C9B8A5" stroke-width="0.8" stroke-linecap="round" opacity="0.7"/>' +
        '<path d="M18 8 Q19 6 20 6" fill="none" stroke="#C9B8A5" stroke-width="0.8" stroke-linecap="round" opacity="0.7"/>' +
        '</svg>'
    },
    "butter-latte": {
      label: "Butter Latte",
      color: "#A0784F",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M7 13 Q7 10 10 10 L20 10 Q23 10 23 13 L23 23 Q23 26 20 26 L10 26 Q7 26 7 23 Z" fill="#FAF6F0" stroke="#D4C4B0" stroke-width="1"/>' +
        '<rect x="9" y="17" width="12" height="7" rx="1" fill="#D4B896"/>' +
        '<rect x="9" y="12" width="12" height="6" rx="1" fill="#F5E6C8"/>' +
        '<ellipse cx="15" cy="12" rx="6" ry="2" fill="#FFF9F0"/>' +
        '<circle cx="11" cy="13" r="0.7" fill="#E8D5A0" opacity="0.8"/>' +
        '<circle cx="15" cy="13" r="0.7" fill="#E8D5A0" opacity="0.8"/>' +
        '<circle cx="19" cy="13" r="0.7" fill="#E8D5A0" opacity="0.8"/>' +
        '<path d="M23 14 Q26 14 26 16.5 Q26 19 23 19" fill="none" stroke="#D4C4B0" stroke-width="1.2" stroke-linecap="round"/>' +
        '</svg>'
    },
    latte: {
      label: "Latte",
      color: "#9B8068",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M7 13 Q7 10 10 10 L20 10 Q23 10 23 13 L23 23 Q23 26 20 26 L10 26 Q7 26 7 23 Z" fill="#FAF6F0" stroke="#D4C4B0" stroke-width="1"/>' +
        '<rect x="9" y="15" width="12" height="9" rx="1" fill="#C8A87E" opacity="0.7"/>' +
        '<ellipse cx="15" cy="12" rx="6" ry="2.2" fill="#FFFDF8"/>' +
        '<path d="M12 12 Q13 10 15 11 Q17 12 18 11" fill="none" stroke="#C8A87E" stroke-width="0.8" stroke-linecap="round" opacity="0.6"/>' +
        '<path d="M23 14 Q26 14 26 16.5 Q26 19 23 19" fill="none" stroke="#D4C4B0" stroke-width="1.2" stroke-linecap="round"/>' +
        '</svg>'
    },
    "iced-latte": {
      label: "Iced Latte",
      color: "#6B4E3D",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="7" y="8" width="16" height="20" rx="3" fill="#F5F0E8" stroke="#D4C4B0" stroke-width="1"/>' +
        '<rect x="9" y="10" width="12" height="4" rx="1" fill="#FFFFFF" opacity="0.9"/>' +
        '<rect x="9" y="15" width="12" height="6" rx="1" fill="#A0785A" opacity="0.6"/>' +
        '<rect x="9" y="21" width="12" height="5" rx="1" fill="#6B4E3D" opacity="0.7"/>' +
        '<circle cx="12" cy="17" r="0.8" fill="#FFFFFF" opacity="0.4"/>' +
        '<circle cx="17" cy="22" r="0.8" fill="#FFFFFF" opacity="0.3"/>' +
        '<rect x="9" y="7" width="12" height="2" rx="1" fill="#D4C4B0" opacity="0.5"/>' +
        '</svg>'
    },
    americano: {
      label: "Americano",
      color: "#4A3728",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M7 13 Q7 10 10 10 L20 10 Q23 10 23 13 L23 23 Q23 26 20 26 L10 26 Q7 26 7 23 Z" fill="#FAF6F0" stroke="#D4C4B0" stroke-width="1"/>' +
        '<rect x="9" y="12" width="12" height="13" rx="1" fill="#4A3728" opacity="0.9"/>' +
        '<path d="M23 14 Q26 14 26 16.5 Q26 19 23 19" fill="none" stroke="#D4C4B0" stroke-width="1.2" stroke-linecap="round"/>' +
        '<circle cx="12" cy="15" r="0.6" fill="#FFFFFF" opacity="0.2"/>' +
        '<circle cx="18" cy="20" r="0.6" fill="#FFFFFF" opacity="0.15"/>' +
        '</svg>'
    },
    pour_over: {
      label: "Pour Over",
      color: "#6B5B45",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M11 6 L11 10" fill="none" stroke="#A09080" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="M11 10 L8 18 Q8 22 11 22 L17 22 Q20 22 20 18 L17 10 Z" fill="#F7F3EE" stroke="#C9B8A5" stroke-width="1"/>' +
        '<line x1="10" y1="13" x2="18" y2="13" stroke="#C9B8A5" stroke-width="0.8" opacity="0.5"/>' +
        '<line x1="10" y1="16" x2="18" y2="16" stroke="#C9B8A5" stroke-width="0.8" opacity="0.5"/>' +
        '<circle cx="11" cy="24" r="0.8" fill="#6B4E3D" opacity="0.25"/>' +
        '<circle cx="13" cy="25" r="0.7" fill="#6B4E3D" opacity="0.2"/>' +
        '</svg>'
    },
    cold_brew: {
      label: "Cold Brew",
      color: "#4A6B7C",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="8" y="8" width="14" height="18" rx="3" fill="#F5F0E8" stroke="#C4D4D8" stroke-width="1"/>' +
        '<rect x="9" y="9" width="12" height="3" rx="1.5" fill="#E8F4F8" opacity="0.8"/>' +
        '<rect x="9" y="14" width="12" height="10" rx="1" fill="#3D5A66" opacity="0.5"/>' +
        '<circle cx="12" cy="17" r="0.8" fill="#FFFFFF" opacity="0.4"/>' +
        '<circle cx="16" cy="20" r="0.8" fill="#FFFFFF" opacity="0.3"/>' +
        '<circle cx="14" cy="22" r="0.6" fill="#FFFFFF" opacity="0.3"/>' +
        '<rect x="10" y="5" width="10" height="3" rx="1.5" fill="#C4D4D8" opacity="0.6"/>' +
        '</svg>'
    },
    cappuccino: {
      label: "Cappuccino",
      color: "#D4B896",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M7 13 Q7 10 10 10 L20 10 Q23 10 23 13 L23 23 Q23 26 20 26 L10 26 Q7 26 7 23 Z" fill="#FAF6F0" stroke="#D4C4B0" stroke-width="1"/>' +
        '<rect x="9" y="13" width="12" height="4" rx="1" fill="#C8A87E" opacity="0.6"/>' +
        '<ellipse cx="15" cy="13" rx="6" ry="2" fill="#FFFDF8"/>' +
        '<path d="M11 13 Q12 11 13 12 Q14 13 15 12 Q16 11 17 12 Q18 13 19 12" fill="none" stroke="#D4C4B0" stroke-width="0.6" stroke-linecap="round" opacity="0.7"/>' +
        '<path d="M23 14 Q26 14 26 16.5 Q26 19 23 19" fill="none" stroke="#D4C4B0" stroke-width="1.2" stroke-linecap="round"/>' +
        '</svg>'
    },
    "flat-white": {
      label: "Flat White",
      color: "#A0784F",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M7 13 Q7 10 10 10 L20 10 Q23 10 23 13 L23 23 Q23 26 20 26 L10 26 Q7 26 7 23 Z" fill="#FAF6F0" stroke="#D4C4B0" stroke-width="1"/>' +
        '<rect x="9" y="14" width="12" height="10" rx="1" fill="#C8A87E" opacity="0.5"/>' +
        '<ellipse cx="15" cy="13" rx="6" ry="1.5" fill="#FFFDF8"/>' +
        '<path d="M12 13 Q13 12 15 13 Q17 14 18 13" fill="none" stroke="#D4C4B0" stroke-width="0.5" stroke-linecap="round" opacity="0.6"/>' +
        '<path d="M23 14 Q26 14 26 16.5 Q26 19 23 19" fill="none" stroke="#D4C4B0" stroke-width="1.2" stroke-linecap="round"/>' +
        '</svg>'
    },
    mocha: {
      label: "Mocha",
      color: "#8B6914",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M7 13 Q7 10 10 10 L20 10 Q23 10 23 13 L23 23 Q23 26 20 26 L10 26 Q7 26 7 23 Z" fill="#FAF6F0" stroke="#D4C4B0" stroke-width="1"/>' +
        '<rect x="9" y="15" width="12" height="9" rx="1" fill="#8B6914" opacity="0.5"/>' +
        '<ellipse cx="15" cy="13" rx="6" ry="2" fill="#FFFDF8"/>' +
        '<path d="M10 16 Q12 14 14 16 Q16 18 18 16 Q20 14 22 16" fill="none" stroke="#5A3A1A" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>' +
        '<path d="M23 14 Q26 14 26 16.5 Q26 19 23 19" fill="none" stroke="#D4C4B0" stroke-width="1.2" stroke-linecap="round"/>' +
        '</svg>'
    },
    "caramel-macchiato": {
      label: "Caramel Macchiato",
      color: "#B8860B",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M7 13 Q7 10 10 10 L20 10 Q23 10 23 13 L23 23 Q23 26 20 26 L10 26 Q7 26 7 23 Z" fill="#FAF6F0" stroke="#D4C4B0" stroke-width="1"/>' +
        '<rect x="9" y="15" width="12" height="9" rx="1" fill="#C8A87E" opacity="0.4"/>' +
        '<ellipse cx="15" cy="13" rx="6" ry="2" fill="#FFFDF8"/>' +
        '<path d="M11 17 Q13 15 15 17 Q17 19 19 17" fill="none" stroke="#B8860B" stroke-width="0.8" stroke-linecap="round" opacity="0.7"/>' +
        '<path d="M23 14 Q26 14 26 16.5 Q26 19 23 19" fill="none" stroke="#D4C4B0" stroke-width="1.2" stroke-linecap="round"/>' +
        '</svg>'
    },
    dirty: {
      label: "Dirty",
      color: "#2F1810",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M7 13 Q7 10 10 10 L20 10 Q23 10 23 13 L23 23 Q23 26 20 26 L10 26 Q7 26 7 23 Z" fill="#FAF6F0" stroke="#D4C4B0" stroke-width="1"/>' +
        '<rect x="9" y="12" width="12" height="6" rx="1" fill="#2F1810" opacity="0.9"/>' +
        '<rect x="9" y="18" width="12" height="6" rx="1" fill="#C8A87E" opacity="0.5"/>' +
        '<ellipse cx="15" cy="13" rx="6" ry="2" fill="#FFFDF8"/>' +
        '<path d="M23 14 Q26 14 26 16.5 Q26 19 23 19" fill="none" stroke="#D4C4B0" stroke-width="1.2" stroke-linecap="round"/>' +
        '</svg>'
    },
    drip: {
      label: "Drip",
      color: "#6B5B45",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="9" y="6" width="12" height="2" rx="1" fill="#A09080"/>' +
        '<path d="M11 8 L10 20 Q10 22 12 22 L18 22 Q20 22 20 20 L19 8 Z" fill="#F7F3EE" stroke="#C9B8A5" stroke-width="1"/>' +
        '<line x1="11" y1="11" x2="19" y2="11" stroke="#C9B8A5" stroke-width="0.8" opacity="0.5"/>' +
        '<line x1="11" y1="14" x2="19" y2="14" stroke="#C9B8A5" stroke-width="0.8" opacity="0.5"/>' +
        '<line x1="11" y1="17" x2="19" y2="17" stroke="#C9B8A5" stroke-width="0.8" opacity="0.5"/>' +
        '<circle cx="13" cy="24" r="0.8" fill="#6B4E3D" opacity="0.25"/>' +
        '<circle cx="15" cy="25" r="0.7" fill="#6B4E3D" opacity="0.2"/>' +
        '</svg>'
    },
    turkish: {
      label: "Turkish",
      color: "#8B4513",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M10 8 L12 22 Q12 24 14 24 L18 24 Q20 24 20 22 L22 8 Z" fill="#F7F3EE" stroke="#C9B8A5" stroke-width="1"/>' +
        '<path d="M11 12 L21 12" stroke="#C9B8A5" stroke-width="0.8" opacity="0.5"/>' +
        '<path d="M11 16 L21 16" stroke="#C9B8A5" stroke-width="0.8" opacity="0.5"/>' +
        '<path d="M11 20 L21 20" stroke="#C9B8A5" stroke-width="0.8" opacity="0.5"/>' +
        '<path d="M8 8 L24 8" stroke="#A09080" stroke-width="1.5" stroke-linecap="round"/>' +
        '<circle cx="14" cy="25" r="0.8" fill="#6B4E3D" opacity="0.25"/>' +
        '<circle cx="16" cy="26" r="0.7" fill="#6B4E3D" opacity="0.2"/>' +
        '</svg>'
    },
    irish: {
      label: "Irish",
      color: "#2E8B57",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M7 13 Q7 10 10 10 L20 10 Q23 10 23 13 L23 23 Q23 26 20 26 L10 26 Q7 26 7 23 Z" fill="#FAF6F0" stroke="#D4C4B0" stroke-width="1"/>' +
        '<rect x="9" y="13" width="12" height="11" rx="1" fill="#2E8B57" opacity="0.4"/>' +
        '<ellipse cx="15" cy="13" rx="6" ry="1.8" fill="#FFFDF8"/>' +
        '<path d="M11 16 Q13 14 15 16 Q17 18 19 16" fill="none" stroke="#FFFDF8" stroke-width="0.8" stroke-linecap="round" opacity="0.6"/>' +
        '<path d="M23 14 Q26 14 26 16.5 Q26 19 23 19" fill="none" stroke="#D4C4B0" stroke-width="1.2" stroke-linecap="round"/>' +
        '</svg>'
    },
    default: {
      label: "Coffee",
      color: "#8B7355",
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M7 13 Q7 10 10 10 L20 10 Q23 10 23 13 L23 23 Q23 26 20 26 L10 26 Q7 26 7 23 Z" fill="#FAF6F0" stroke="#D4C4B0" stroke-width="1"/>' +
        '<rect x="9" y="13" width="12" height="11" rx="1" fill="#8B7355" opacity="0.6"/>' +
        '<ellipse cx="15" cy="13" rx="6" ry="1.8" fill="#A08060" opacity="0.5"/>' +
        '<path d="M23 14 Q26 14 26 16.5 Q26 19 23 19" fill="none" stroke="#D4C4B0" stroke-width="1.2" stroke-linecap="round"/>' +
        '</svg>'
    }
  };

  function getCoffeeTypes() {
    return [
      { key: "espresso", name: "Espresso / 浓缩咖啡", desc: "Pure coffee, no milk. Intense, bold, slightly bitter.", color: "#3B2A1E", recipe: [
        { label: "Espresso", pct: 100, color: "#3B2A1E" }
      ]},
      { key: "americano", name: "Americano / 美式咖啡", desc: "Espresso + hot water. Clean, understated, no frills.", color: "#5A4A3A", recipe: [
        { label: "Espresso", pct: 30, color: "#3B2A1E" },
        { label: "Hot Water", pct: 70, color: "#C8B8A8" }
      ]},
      { key: "latte", name: "Latte / 拿铁", desc: "Espresso + lots of steamed milk, thin foam. Smooth, gentle, approachable.", color: "#C8A87E", recipe: [
        { label: "Espresso", pct: 20, color: "#3B2A1E" },
        { label: "Steamed Milk", pct: 70, color: "#F5E6C8" },
        { label: "Milk Foam", pct: 10, color: "#FFFDF8" }
      ]},
      { key: "cappuccino", name: "Cappuccino / 卡布奇诺", desc: "Espresso + equal milk + thick foam. Balanced, classic, comforting.", color: "#D4B896", recipe: [
        { label: "Espresso", pct: 33, color: "#3B2A1E" },
        { label: "Steamed Milk", pct: 33, color: "#F5E6C8" },
        { label: "Milk Foam", pct: 34, color: "#FFFDF8" }
      ]},
      { key: "flat-white", name: "Flat White / 澳白", desc: "Espresso + velvety microfoam. Rich, silky, coffee-forward.", color: "#A0784F", recipe: [
        { label: "Espresso", pct: 35, color: "#3B2A1E" },
        { label: "Microfoam", pct: 65, color: "#E8D5C0" }
      ]},
      { key: "mocha", name: "Mocha / 摩卡", desc: "Espresso + chocolate + milk. Sweet, indulgent, rich.", color: "#8B6914", recipe: [
        { label: "Espresso", pct: 20, color: "#3B2A1E" },
        { label: "Chocolate", pct: 15, color: "#5A3A1A" },
        { label: "Steamed Milk", pct: 65, color: "#F5E6C8" }
      ]},
      { key: "caramel-macchiato", name: "Caramel Macchiato / 焦糖玛奇朵", desc: "Espresso + milk + caramel drizzle. Sweet, layered, warm.", color: "#B8860B", recipe: [
        { label: "Espresso", pct: 25, color: "#3B2A1E" },
        { label: "Steamed Milk", pct: 65, color: "#F5E6C8" },
        { label: "Caramel", pct: 10, color: "#D4A040" }
      ]},
      { key: "butter-latte", name: "Butter Latte / 黄油拿铁", desc: "Espresso + butter + milk. Creamy, unique, adventurous.", color: "#D4A574", recipe: [
        { label: "Espresso", pct: 20, color: "#3B2A1E" },
        { label: "Butter", pct: 10, color: "#E8C880" },
        { label: "Steamed Milk", pct: 70, color: "#F5E6C8" }
      ]},
      { key: "dirty", name: "Dirty / 冰博客脏咖", desc: "Hot espresso over cold milk. Bold contrast, intense, unapologetic.", color: "#2F1810", recipe: [
        { label: "Cold Milk", pct: 60, color: "#F5E6C8" },
        { label: "Espresso", pct: 40, color: "#2F1810" }
      ]},
      { key: "pour_over", name: "Pour Over / 手冲", desc: "Slow-pour hot water over ground coffee. Clean, nuanced, ritualistic.", color: "#6B5B45", recipe: [
        { label: "Coffee", pct: 15, color: "#6B5B45" },
        { label: "Water", pct: 85, color: "#E8DDD0" }
      ]},
      { key: "iced-latte", name: "Iced Latte / 冰拿铁", desc: "Espresso + cold milk + ice. Refreshing, smooth, summer vibe.", color: "#6B4E3D", recipe: [
        { label: "Espresso", pct: 20, color: "#3B2A1E" },
        { label: "Cold Milk", pct: 50, color: "#F5E6C8" },
        { label: "Ice", pct: 30, color: "#D4E8F0" }
      ]},
      { key: "cold_brew", name: "Cold Brew / 冷萃", desc: "Steeped in cold water for hours. Smooth, low-acid, mellow.", color: "#4A6B7C", recipe: [
        { label: "Coffee", pct: 20, color: "#3D5A66" },
        { label: "Cold Water", pct: 80, color: "#C4D4D8" }
      ]},
      { key: "drip", name: "Drip / 滴滤", desc: "Classic drip coffee. Simple, reliable, everyday comfort.", color: "#6B5B45", recipe: [
        { label: "Coffee", pct: 10, color: "#6B5B45" },
        { label: "Water", pct: 90, color: "#E8DDD0" }
      ]},
      { key: "turkish", name: "Turkish / 土耳其咖啡", desc: "Finely ground, unfiltered, brewed in cezve. Strong, rich, traditional.", color: "#8B4513", recipe: [
        { label: "Coffee", pct: 15, color: "#8B4513" },
        { label: "Water", pct: 85, color: "#E8DDD0" }
      ]},
      { key: "irish", name: "Irish / 爱尔兰咖啡", desc: "Hot coffee + Irish whiskey + sugar + cream. Warm, spirited, indulgent.", color: "#2E8B57", recipe: [
        { label: "Coffee", pct: 50, color: "#3B2A1E" },
        { label: "Whiskey", pct: 20, color: "#D4A040" },
        { label: "Cream", pct: 30, color: "#F5E6C8" }
      ]}
    ];
  }

  function getCoffeeIcon(type, customImageBase64) {
    if (customImageBase64) {
      return { label: "Custom", svg: '<img src="' + customImageBase64 + '" width="28" height="28" style="border-radius:50%;object-fit:cover;">' };
    }
    var icon = COFFEE_ICONS[type] || COFFEE_ICONS.default;
    return icon;
  }

  function getCoffeeLabel(type, customImageBase64, customCoffeeName) {
    if (customImageBase64) return customCoffeeName || "Custom";
    return (COFFEE_ICONS[type] || COFFEE_ICONS.default).label;
  }

  function renderCoffeeIcon(type, customImageBase64, size) {
    size = size || 28;
    if (customImageBase64) {
      return '<img src="' + customImageBase64 + '" width="' + size + '" height="' + size + '" style="border-radius:50%;object-fit:cover;display:block;">';
    }
    var icon = COFFEE_ICONS[type] || COFFEE_ICONS.default;
    return icon.svg.replace(/width="28" height="28"/, 'width="' + size + '" height="' + size + '"');
  }

  // Render large faint coffee image as background for detail page top-right area
  function renderCoffeeBg(c) {
    var size = 460;
    var offset = 60;
    var baseStyle = 'position:absolute;right:-' + offset + 'px;top:-' + offset + 'px;width:' + size + 'px;height:' + size + 'px;opacity:0.3;border-radius:80%;pointer-events:none;';
    if (c.customCoffeeImage) {
      return '<img src="' + c.customCoffeeImage + '" style="' + baseStyle + 'object-fit:cover;">';
    }
    var icon = COFFEE_ICONS[c.coffeeType] || null;
    if (!icon) return '';
    return '<div style="' + baseStyle + 'display:flex;align-items:center;justify-content:center;overflow:hidden;">' +
      icon.svg.replace(/width="28" height="28"/, 'width="' + size + '" height="' + size + '"') +
      '</div>';
  }

  function getCoffeeSelector(currentType) {
    var options = Object.keys(COFFEE_ICONS).filter(function(k) { return k !== "default"; });
    var html = '<select id="coffeeTypeSelect" style="font-size:12px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-secondary);cursor:pointer;outline:none;">';
    html += '<option value="">-- Coffee --</option>';
    options.forEach(function(k) {
      html += '<option value="' + k + '"' + (currentType === k ? " selected" : "") + ">" + COFFEE_ICONS[k].label + "</option>";
    });
    html += "</select>";
    return html;
  }

  function renderCustomCoffeeUpload(currentContact) {
    var html = '<div style="margin-left:auto;display:flex;align-items:center;gap:8px;">';
    html += '<span style="font-size:11px;color:var(--text-tertiary);">or</span>';
    html += '<label for="coffeeUpload" class="btn btn-secondary" style="padding:4px 10px;font-size:12px;cursor:pointer;">Upload Icon</label>';
    html += '<input type="file" id="coffeeUpload" accept="image/*" style="display:none;">';
    if (currentContact && currentContact.customCoffeeImage) {
      html += '<button class="btn btn-secondary" id="removeCoffeeImg" style="padding:4px 10px;font-size:12px;">Remove</button>';
    }
    html += '</div>';
    return html;
  }

  var state = {
    view: "dashboard",
    currentContactId: null,
    activeTab: "brief",
    data: null
  };

  // --- Storage ---
  function loadData() {
    var raw = localStorage.getItem(STORAGE_KEY);
    var version = parseInt(localStorage.getItem(STORAGE_VERSION_KEY) || "0", 10);
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        // If seed data was updated (version bump), merge new/updated contacts
        if (version < CURRENT_VERSION && typeof SEED_DATA !== "undefined") {
          parsed = mergeSeedData(parsed, SEED_DATA);
          saveData(parsed);
          localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_VERSION));
        }
        return parsed;
      } catch (e) {}
    }
    // First load: seed with initial data
    // Check if this looks like a fresh localStorage on a different file:// path
    // (user may have bookmarks pointing to a different path with existing data)
    if (typeof SEED_DATA !== "undefined") {
      saveData(SEED_DATA);
      localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_VERSION));
      // Mark that this was a fresh seed, not user data
      localStorage.setItem("coffee_chat_seeded", String(Date.now()));
      return SEED_DATA;
    }
    return { contacts: [] };
  }

  // Merge seed contacts into existing data: update existing seed contacts, add new ones
  // IMPORTANT: Only update seed contacts (those that exist in SEED_DATA).
  // User-added contacts are never touched. For seed contacts, preserve ALL user edits
  // (research brief, questions, etc.) and only add missing fields from the new seed.
  function mergeSeedData(existing, seed) {
    seed.contacts.forEach(function(seedContact) {
      var idx = existing.contacts.findIndex(function(c) { return c.id === seedContact.id; });
      if (idx >= 0) {
        var existingContact = existing.contacts[idx];
        var userTalks = existingContact.talkRecords || [];
        var userFollowups = existingContact.followups || [];
        var userQuestions = existingContact.questions || [];
        var userResearch = existingContact.research || null;
        var userCustomPhoto = existingContact.customPhoto || null;
        var userCustomCoffeeImage = existingContact.customCoffeeImage || null;
        var userCustomCoffeeName = existingContact.customCoffeeName || null;
        var userCoffeeType = existingContact.coffeeType || null;
        var userStatus = existingContact.status || null;
        var userTags = existingContact.tags || [];
        var userLastTalkDate = existingContact.lastTalkDate || null;
        var userEmail = existingContact.email || null;
        var userDepartment = existingContact.department || null;
        var userRelationship = existingContact.relationship || null;
        var userPhotoUrl = existingContact.photoUrl || null;

        // Start with updated seed contact as base
        existing.contacts[idx] = seedContact;

        // Restore ALL user-specific data that the seed doesn't have
        if (userTalks.length > 0) existing.contacts[idx].talkRecords = userTalks;
        if (userQuestions.length > 0) existing.contacts[idx].questions = userQuestions;
        if (userResearch) existing.contacts[idx].research = userResearch;
        if (userCustomPhoto) existing.contacts[idx].customPhoto = userCustomPhoto;
        if (userCustomCoffeeImage) existing.contacts[idx].customCoffeeImage = userCustomCoffeeImage;
        if (userCustomCoffeeName) existing.contacts[idx].customCoffeeName = userCustomCoffeeName;
        if (userCoffeeType) existing.contacts[idx].coffeeType = userCoffeeType;
        if (userStatus) existing.contacts[idx].status = userStatus;
        if (userTags.length > 0) existing.contacts[idx].tags = userTags;
        if (userLastTalkDate) existing.contacts[idx].lastTalkDate = userLastTalkDate;
        if (userEmail) existing.contacts[idx].email = userEmail;
        if (userDepartment) existing.contacts[idx].department = userDepartment;
        if (userRelationship) existing.contacts[idx].relationship = userRelationship;
        if (userPhotoUrl) existing.contacts[idx].photoUrl = userPhotoUrl;

        // Merge followups: keep user's done states
        if (userFollowups.length > 0) {
          existing.contacts[idx].followups = userFollowups;
        }
      } else {
        // New seed contact — add it
        existing.contacts.push(seedContact);
      }
    });
    return existing;
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      // Quota exceeded — most likely due to large base64 images
      var quotaMsg = "Storage is full. Your changes could not be saved.\n\n" +
        "This usually happens when uploading large photos. Try:\n" +
        "• Export your data as backup (Settings → Export)\n" +
        "• Remove or replace large custom photos / coffee icons\n" +
        "• Delete unused contacts";
      if (e.name === "QuotaExceededError" || e.code === 22) {
        alert(quotaMsg);
      } else {
        alert("Save failed: " + e.message);
      }
      console.error("saveData failed:", e);
      return false;
    }
  }

  // Compress an image file to a small JPEG data URL (max dimension, quality)
  function compressImage(file, maxDim, quality) {
    maxDim = maxDim || 256;
    quality = quality || 0.75;
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function(ev) {
        var img = new Image();
        img.onload = function() {
          var w = img.width, h = img.height;
          var scale = Math.min(1, maxDim / Math.max(w, h));
          var cw = Math.round(w * scale), ch = Math.round(h * scale);
          var canvas = document.createElement("canvas");
          canvas.width = cw; canvas.height = ch;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, cw, ch);
          try {
            resolve(canvas.toDataURL("image/jpeg", quality));
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = function() { reject(new Error("Could not load image")); };
        img.src = ev.target.result;
      };
      reader.onerror = function() { reject(new Error("Could not read file")); };
      reader.readAsDataURL(file);
    });
  }

  // --- Helpers ---
  function getContact(id) {
    return state.data.contacts.find(function(c) { return c.id === id; });
  }

  function getInitials(name) {
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  // Render contact avatar: custom upload > photoUrl > coffee icon > initials
  function renderContactAvatar(c, size) {
    size = size || 44;
    var imgSize = Math.round(size * 0.82);
    if (c.customPhoto) {
      return '<img src="' + c.customPhoto + '" width="' + imgSize + '" height="' + imgSize + '" style="border-radius:50%;object-fit:cover;display:block;" onerror="this.style.display=\'none\';this.parentNode.textContent=\'' + getInitials(c.name) + '\'">';
    }
    if (c.photoUrl) {
      return '<img src="' + c.photoUrl + '" width="' + imgSize + '" height="' + imgSize + '" style="border-radius:50%;object-fit:cover;display:block;" onerror="this.style.display=\'none\';this.parentNode.textContent=\'' + getInitials(c.name) + '\'">';
    }
    if (c.coffeeType || c.customCoffeeImage) {
      return renderCoffeeIcon(c.coffeeType, c.customCoffeeImage, Math.round(size * 0.64));
    }
    return getInitials(c.name);
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    var d = new Date(dateStr);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function escapeHtml(text) {
    if (!text) return "";
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function linkify(text) {
    return escapeHtml(text).replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color:var(--accent);">$1</a>');
  }

  var ONBOARDING_KEY = "coffee_chat_onboarded";

  // --- Render ---
  function render() {
    var app = document.getElementById("app");

    // Apply custom background color from settings
    var settings = getSettings();
    var bgColor = settings.bgColor || "#f0eee9";
    app.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;

    // Onboarding: show on first visit
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      app.innerHTML = renderOnboarding();
      attachOnboardingEvents();
      return;
    }

    if (state.view === "onboarding") {
      app.innerHTML = renderOnboarding();
      attachOnboardingEvents();
    } else if (state.view === "coffeeHandbook") {
      app.innerHTML = renderCoffeeHandbook();
      attachCoffeeHandbookEvents();
    } else if (state.view === "settings") {
      app.innerHTML = renderSettings();
      attachSettingsEvents();
    } else if (state.view === "help") {
      app.innerHTML = renderHelp();
      attachHelpEvents();
    } else if (state.view === "dashboard") {
      app.innerHTML = renderDashboard();
      attachDashboardEvents();
    } else if (state.view === "contactList") {
      app.innerHTML = renderContactList();
      attachContactListEvents();
    } else if (state.view === "contactDetail") {
      var html = renderContactDetail();
      // renderContactDetail() may change state.view if contact not found
      if (state.view === "contactDetail") {
        app.innerHTML = html;
        attachDetailEvents();
      } else {
        // View changed during render — re-render with new view
        render();
        return;
      }
    } else if (state.view === "addContact") {
      renderAddContactModal();
    }
  }

  // --- Onboarding ---
  function renderOnboarding() {
    return '<div class="onboarding-overlay">' +
      '<div class="onboarding-card">' +
        '<div class="onboarding-emoji">&#9749;</div>' +
        '<h1 class="onboarding-title">Coffee Chat Companion</h1>' +
        '<p class="onboarding-subtitle">Track your coffee chats with professors, mentors, and collaborators. Never forget a conversation again.</p>' +
        '<div class="onboarding-cards">' +
          '<div class="onboarding-step-card">' +
            '<div class="step-icon">&#128269;</div>' +
            '<div class="step-card-title">PREP</div>' +
            '<div class="step-card-desc">Research their background, career path, and key papers before you meet.</div>' +
          '</div>' +
          '<div class="onboarding-step-card">' +
            '<div class="step-icon">&#128172;</div>' +
            '<div class="step-card-title">CHAT</div>' +
            '<div class="step-card-desc">Prepare thoughtful questions and topics to make the conversation count.</div>' +
          '</div>' +
          '<div class="onboarding-step-card">' +
            '<div class="step-icon">&#128221;</div>' +
            '<div class="step-card-title">TRACK</div>' +
            '<div class="step-card-desc">Record notes, insights, and follow-ups so nothing falls through the cracks.</div>' +
          '</div>' +
        '</div>' +
        '<button id="startBtn" class="btn btn-primary onboarding-start-btn">Start &#8594;</button>' +
        '<p class="onboarding-footer">Your data stays in your browser. No account needed. Export anytime.</p>' +
      '</div>' +
    '</div>';
  }

  function attachOnboardingEvents() {
    var startBtn = document.getElementById("startBtn");
    if (startBtn) {
      startBtn.addEventListener("click", function() {
        localStorage.setItem(ONBOARDING_KEY, "1");
        state.view = "dashboard";
        render();
      });
    }
  }

  // --- Help / About ---
  function renderHelp() {
    return '<div class="help-page">' +
      '<div class="help-two-col">' +
        '<div class="help-card help-card-left">' +
          '<div class="help-card-header">&#9749; About</div>' +
          '<div class="help-card-body">' +
            '<section class="help-section">' +
              '<h2>What is this?</h2>' +
              '<p>Coffee Chat Companion is a personal tool for tracking your coffee chats with professors, mentors, colleagues, and collaborators. It helps you prepare before the meeting (research brief + questions) and record what happened after (talk notes + insights + follow-ups).</p>' +
            '</section>' +
            '<section class="help-section">' +
              '<h2>How to use</h2>' +
              '<div class="coffee-vibe-card">' +
                '<div class="coffee-vibe-emoji">&#9749;</div>' +
                '<h3>Coffee Vibe</h3>' +
                '<p>Pick a drink that best describes this contact. It\'s purely subjective &mdash; a fun way to capture the "flavor" of your conversation.</p>' +
                '<a href="#" data-nav="coffee-handbook" class="coffee-vibe-link">Check the Coffee Handbook &rarr;</a>' +
              '</div>' +
              '<ul class="help-list">' +
                '<li><strong>Add a contact</strong> &mdash; Go to Contacts, click "Add Contact". Fill in the basic info. Once a record is loaded, the contact will be labeled as "Done". You may set the status yourself as well.</li>' +
                '<li><strong>Research Brief</strong> &mdash; Use your API key or an AI agent to research their background and career. This section helps you get familiar with who they are before you meet.</li>' +
                '<li><strong>Questions</strong> &mdash; In the "Questions" tab, list questions you want to ask. Add notes and tags (deep, resonate, open, career) to prioritize.</li>' +
                '<li><strong>Talk Records</strong> &mdash; After the meeting, log the date, location, topics discussed, notes, and key insights.</li>' +
                '<li><strong>Follow-ups</strong> &mdash; Set action items after each chat. Check them off as you complete them.</li>' +
                '<li><strong>Export Data</strong> &mdash; Click "Export Data" in the sidebar to download all your data as a JSON file. Use this as a backup or to transfer to another device.</li>' +
              '</ul>' +
            '</section>' +
          '</div>' +
        '</div>' +
        '<div class="help-card help-card-right">' +
          '<div class="help-card-header" style="display:flex;align-items:center;justify-content:space-between;gap:12px;">' +
            '<span>&#128230; Data &amp; Privacy</span>' +
            '<button id="helpBackBtn" class="btn btn-secondary" style="padding:4px 10px;font-size:12px;white-space:nowrap;">&#8592; Dashboard</button>' +
          '</div>' +
          '<div class="help-card-body">' +
            '<section class="help-section">' +
              '<h2>Privacy</h2>' +
              '<p>All your data is stored locally in your browser\'s storage (localStorage). It is <strong>never uploaded to any server</strong>. This means:</p>' +
              '<ul class="help-list">' +
                '<li>No account, no login, no tracking.</li>' +
                '<li>Clearing your browser data will erase your contacts &mdash; export regularly!</li>' +
                '<li>Switching browsers or devices? Export from the old one and re-import manually.</li>' +
              '</ul>' +
            '</section>' +
            '<section class="help-section">' +
              '<h2>Data Management</h2>' +
              '<p><strong>How data works:</strong> Your contacts, talk records, and notes are saved automatically in your browser as you use the app. No manual saving needed.</p>' +
              '<p><strong>Backup (Export):</strong> Click "Export Data" in the sidebar to download a JSON file. Do this regularly &mdash; especially before clearing browser data or switching devices.</p>' +
              '<p><strong>Restore (Import):</strong> Click "Import Data" in the sidebar and select a previously exported JSON file. This will replace your current data with the backup.</p>' +
              '<p><strong>Moving to a new device:</strong> Export from the old device, transfer the JSON file (email, cloud drive, USB), then Import on the new device.</p>' +
              '<p><strong>Auto Research:</strong> In any contact\'s Research Brief tab, use "Copy Prompt" to generate an AI prompt. Paste it to ChatGPT/Claude/WorkBuddy, then paste the returned JSON back into the brief. Or configure an OpenAI API key for one-click auto-fill.</p>' +
            '</section>' +
            '<section class="help-section">' +
              '<h2>Demo Contact</h2>' +
              '<p>The app comes with a demo contact &mdash; <strong>Erwin Schrödinger</strong> &mdash; so you can see what a fully filled-in profile looks like. Feel free to delete it once you\'ve added your own contacts.</p>' +
            '</section>' +
            '<section class="help-section">' +
              '<h2>Contact</h2>' +
              '<p>Questions, feedback, or found a bug?</p>' +
              '<p><a href="mailto:alycia_zy17@163.com" class="help-email">&#9993; alycia_zy17@163.com</a></p>' +
            '</section>' +
            '<section class="help-section">' +
              '<h2>Version</h2>' +
              '<p style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;">' + APP_BUILD + '</p>' +
            '</section>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function attachHelpEvents() {
    var backBtn = document.getElementById("helpBackBtn");
    if (backBtn) {
      backBtn.addEventListener("click", function() {
        state.view = "dashboard";
        render();
      });
    }
  }

  // --- Coffee Handbook ---
  function renderCoffeeHandbook() {
    var coffeeTypes = getCoffeeTypes();

    function renderRecipeCup(recipe) {
      var totalPct = recipe.reduce(function(sum, r) { return sum + r.pct; }, 0);
      var layersHtml = recipe.map(function(r) {
        var height = Math.round((r.pct / totalPct) * 100);
        return '<div class="recipe-layer" style="height:' + height + '%;background:' + r.color + ';">' +
          '<span class="recipe-label">' + r.label + ' ' + r.pct + '%</span>' +
        '</div>';
      }).join('');
      return '<div class="recipe-cup">' + layersHtml + '</div>';
    }

    var cardsHtml = coffeeTypes.map(function(coffee) {
      return '<div class="coffee-card">' +
        '<div class="coffee-card-visual">' + renderRecipeCup(coffee.recipe) + '</div>' +
        '<div class="coffee-card-content">' +
          '<h3>' + coffee.name + '</h3>' +
          '<p>' + coffee.desc + '</p>' +
        '</div>' +
      '</div>';
    }).join('');

    // Custom card with upload or recipe builder
    var customCard = '<div class="coffee-card coffee-card-custom" id="customCoffeeCard">' +
      '<div class="coffee-card-visual" id="customCoffeeVisual" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, #eeedfe 0%, #f7f6f3 100%);">' +
        '<div style="text-align:center;padding:16px;">' +
          '<div style="font-size:28px;margin-bottom:6px;">&#9749;</div>' +
          '<div style="display:flex;flex-direction:column;gap:6px;align-items:center;">' +
            '<label for="handbookCoffeeUpload" class="btn btn-secondary" style="padding:4px 10px;font-size:11px;cursor:pointer;">&#128247; Upload Image</label>' +
            '<input type="file" id="handbookCoffeeUpload" accept="image/*" style="display:none;">' +
            '<button class="btn btn-secondary" id="buildRecipeBtn" style="padding:4px 10px;font-size:11px;">&#128208; Build Recipe</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="coffee-card-content">' +
        '<h3 id="customCoffeeName">Custom / 自定义</h3>' +
        '<p>Upload an image or build a recipe with proportions. Your custom coffee will be available across all contacts.</p>' +
      '</div>' +
    '</div>';

    return '<div class="app-layout">' +
      renderSidebar("coffee-handbook") +
      '<div class="main-content">' +
        '<h1 style="font-size:24px;font-weight:700;margin-bottom:8px;">&#9749; Coffee Handbook</h1>' +
        '<p style="color:var(--text-secondary);margin-bottom:24px;">A visual guide to coffee recipes. Pick one that matches your contact\'s vibe.</p>' +
        '<div class="coffee-grid">' + cardsHtml + customCard + '</div>' +
      '</div>' +
    '</div>';
  }

  function attachCoffeeHandbookEvents() {
    // Custom coffee upload in handbook
    var uploadInput = document.getElementById("handbookCoffeeUpload");
    if (uploadInput) {
      uploadInput.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        compressImage(file, 256, 0.75).then(function(dataUrl) {
          var customName = window.prompt("Name this custom coffee:", "My Coffee");
          if (!customName) customName = "Custom";
          // Save to settings for global custom coffee
          var settings = getSettings();
          settings.customCoffeeImage = dataUrl;
          settings.customCoffeeName = customName;
          settings.customCoffeeRecipe = null;
          saveSettings(settings);
          // Re-render the entire page to reflect changes
          render();
        }).catch(function(err) {
          alert("Could not process image: " + err.message);
        });
      });
    }

    // Build Recipe button
    var buildBtn = document.getElementById("buildRecipeBtn");
    if (buildBtn) {
      buildBtn.addEventListener("click", function() {
        renderRecipeBuilderModal();
      });
    }
  }

  function renderRecipeBuilderModal() {
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal" style="max-width:500px;">' +
      '<h2>&#9749; Build Your Coffee Recipe</h2>' +
      '<div class="form-group"><label>Coffee Name</label><input type="text" id="customRecipeName" placeholder="e.g. Lavender Latte"></div>' +
      '<div id="recipeLayersContainer">' +
        '<div class="form-group recipe-layer-input">' +
          '<label>Layer 1</label>' +
          '<div style="display:flex;gap:8px;">' +
            '<input type="text" class="layer-name" placeholder="e.g. Espresso" style="flex:2;">' +
            '<input type="number" class="layer-pct" placeholder="%" style="flex:1;" min="1" max="100">' +
            '<input type="color" class="layer-color" value="#3B2A1E" style="width:40px;padding:0;border:none;">' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="margin-bottom:16px;">' +
        '<button class="btn btn-secondary" id="addLayerBtn" style="font-size:12px;">+ Add Layer</button>' +
      '</div>' +
      '<div id="recipePreview" style="margin-bottom:16px;text-align:center;"></div>' +
      '<div class="form-actions">' +
        '<button class="btn btn-secondary" id="cancelRecipe">Cancel</button>' +
        '<button class="btn btn-primary" id="saveRecipe">Save Recipe</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(overlay);

    function updatePreview() {
      var layers = [];
      var layerDivs = document.querySelectorAll(".recipe-layer-input");
      layerDivs.forEach(function(div) {
        var name = div.querySelector(".layer-name").value.trim();
        var pct = parseInt(div.querySelector(".layer-pct").value, 10);
        var color = div.querySelector(".layer-color").value;
        if (name && pct > 0) layers.push({ label: name, pct: pct, color: color });
      });
      var preview = document.getElementById("recipePreview");
      if (layers.length > 0) {
        var total = layers.reduce(function(s, l) { return s + l.pct; }, 0);
        var layersHtml = layers.map(function(l) {
          var h = Math.round((l.pct / total) * 100);
          return '<div style="width:60px;height:' + h + 'px;background:' + l.color + ';display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.5);">' + l.label + '</div>';
        }).join('');
        preview.innerHTML = '<div style="display:inline-flex;flex-direction:column-reverse;border:2px solid #333;border-radius:4px 4px 16px 16px;overflow:hidden;">' + layersHtml + '</div>';
      } else {
        preview.innerHTML = '';
      }
    }

    document.getElementById("addLayerBtn").addEventListener("click", function() {
      var container = document.getElementById("recipeLayersContainer");
      var idx = container.querySelectorAll(".recipe-layer-input").length + 1;
      var div = document.createElement("div");
      div.className = "form-group recipe-layer-input";
      div.innerHTML = '<label>Layer ' + idx + '</label>' +
        '<div style="display:flex;gap:8px;">' +
          '<input type="text" class="layer-name" placeholder="e.g. Milk" style="flex:2;">' +
          '<input type="number" class="layer-pct" placeholder="%" style="flex:1;" min="1" max="100">' +
          '<input type="color" class="layer-color" value="#C8A87E" style="width:40px;padding:0;border:none;">' +
        '</div>';
      container.appendChild(div);
      // Attach listeners to new inputs
      div.querySelectorAll("input").forEach(function(input) {
        input.addEventListener("input", updatePreview);
      });
    });

    document.getElementById("cancelRecipe").addEventListener("click", function() {
      document.body.removeChild(overlay);
    });

    document.getElementById("saveRecipe").addEventListener("click", function() {
      var name = document.getElementById("customRecipeName").value.trim();
      if (!name) { alert("Please enter a coffee name."); return; }
      var layers = [];
      var layerDivs = document.querySelectorAll(".recipe-layer-input");
      layerDivs.forEach(function(div) {
        var n = div.querySelector(".layer-name").value.trim();
        var p = parseInt(div.querySelector(".layer-pct").value, 10);
        var c = div.querySelector(".layer-color").value;
        if (n && p > 0) layers.push({ label: n, pct: p, color: c });
      });
      if (layers.length === 0) { alert("Please add at least one layer."); return; }

      var settings = getSettings();
      settings.customCoffeeName = name;
      settings.customCoffeeRecipe = layers;
      settings.customCoffeeImage = null;
      saveSettings(settings);

      document.body.removeChild(overlay);
      render();
    });

    // Attach initial listeners
    document.querySelectorAll(".recipe-layer-input input").forEach(function(input) {
      input.addEventListener("input", updatePreview);
    });
  }

  // --- Settings ---
  var SETTINGS_KEY = "coffee_chat_settings";

  function getSettings() {
    var raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch(e) {}
    }
    return {};
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (e) {
      if (e.name === "QuotaExceededError" || e.code === 22) {
        alert("Storage is full. Could not save settings.\n\nTry exporting your data as backup, then removing large custom photos.");
      } else {
        alert("Save failed: " + e.message);
      }
      console.error("saveSettings failed:", e);
      return false;
    }
  }

  // Predefined background color themes
  var BG_THEMES = [
    { name: "Warm Sand", color: "#f0eee9" },
    { name: "Cool Gray", color: "#e8e8ec" },
    { name: "Sage Green", color: "#e8ece8" },
    { name: "Dusty Rose", color: "#ece5e5" },
    { name: "Soft Blue", color: "#e5e8ec" },
    { name: "Cream", color: "#f5f3ee" },
    { name: "Lavender", color: "#eae5ec" },
    { name: "Charcoal", color: "#2a2a2e" }
  ];

  function renderSettings() {
    var settings = getSettings();
    var currentBg = settings.bgColor || "#f0eee9";

    var themeButtons = BG_THEMES.map(function(t) {
      var isActive = currentBg === t.color;
      return '<button class="theme-btn ' + (isActive ? 'active' : '') + '" data-color="' + t.color + '" style="background:' + t.color + ';">' +
        '<span class="theme-name">' + t.name + '</span>' +
      '</button>';
    }).join('');

    // Storage usage
    var dataSize = (localStorage.getItem(STORAGE_KEY) || "").length;
    var settingsSize = (localStorage.getItem(SETTINGS_KEY) || "").length;
    var totalKB = Math.round((dataSize + settingsSize) / 1024);
    var pct = Math.min(100, Math.round(((dataSize + settingsSize) / (5 * 1024 * 1024)) * 100));
    var barColor = pct > 80 ? "#c0392b" : (pct > 50 ? "#d68910" : "#5F4E3A");
    var largeCount = state.data.contacts.filter(function(c) {
      return (c.customPhoto && c.customPhoto.length > 50000) ||
             (c.customCoffeeImage && c.customCoffeeImage.length > 50000);
    }).length;

    return '<div class="app-layout">' +
      renderSidebar("settings") +
      '<div class="main-content">' +
        '<h1 style="font-size:24px;font-weight:700;margin-bottom:8px;">&#9881; Settings</h1>' +
        '<p style="color:var(--text-secondary);margin-bottom:32px;">Customize your Coffee chat experience.</p>' +

        '<div class="settings-section">' +
          '<h2>&#128190; Storage Usage</h2>' +
          '<p>Your data lives in this browser. Browsers cap local storage at ~5 MB — large photos eat it fast.</p>' +
          '<div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden;margin:12px 0 8px;">' +
            '<div style="height:100%;width:' + pct + '%;background:' + barColor + ';border-radius:4px;"></div>' +
          '</div>' +
          '<div style="font-size:13px;color:var(--text-secondary);">' +
            'Used: <strong>' + totalKB + ' KB</strong> (' + pct + '% of ~5 MB)' +
          '</div>' +
          (largeCount > 0
            ? '<div style="font-size:13px;color:#c0392b;margin-top:8px;">' +
              '&#9888; ' + largeCount + ' contact(s) have large photos. Use "Compress All Photos" to shrink them.</div>'
            : '') +
          '<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;">' +
            '<button class="btn btn-secondary" id="compressPhotosBtn" style="font-size:12px;padding:6px 12px;">&#128444; Compress All Photos</button>' +
            '<button class="btn btn-secondary" id="exportDataBtn2" style="font-size:12px;padding:6px 12px;">&#8681; Export Backup</button>' +
          '</div>' +
        '</div>' +

        '<div class="settings-section">' +
          '<h2>Theme Color</h2>' +
          '<p>Choose a background color for the app.</p>' +
          '<div class="theme-grid">' + themeButtons + '</div>' +
          '<div style="margin-top:16px;display:flex;align-items:center;gap:12px;">' +
            '<label style="font-size:14px;color:var(--text-secondary);">Custom:</label>' +
            '<input type="color" id="customBgColor" value="' + currentBg + '" style="width:48px;height:32px;padding:0;border:1px solid var(--border);border-radius:6px;cursor:pointer;">' +
            '<input type="text" id="customBgHex" value="' + currentBg + '" style="width:80px;font-size:13px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;">' +
            '<button class="btn btn-secondary" id="applyCustomBg" style="font-size:12px;padding:4px 12px;">Apply</button>' +
          '</div>' +
        '</div>' +

        '<div class="settings-section">' +
          '<h2>Reset</h2>' +
          '<p>Clear all local data and reset to defaults.</p>' +
          '<button class="btn btn-secondary" id="resetAllBtn">&#128465; Reset All Data</button>' +
        '</div>' +

      '</div>' +
    '</div>';
  }

  function attachSettingsEvents() {
    // Theme color buttons
    var themeBtns = document.querySelectorAll(".theme-btn");
    themeBtns.forEach(function(btn) {
      btn.addEventListener("click", function() {
        var color = btn.getAttribute("data-color");
        var settings = getSettings();
        settings.bgColor = color;
        saveSettings(settings);
        render();
      });
    });

    // Custom color picker
    var colorPicker = document.getElementById("customBgColor");
    var hexInput = document.getElementById("customBgHex");
    if (colorPicker && hexInput) {
      colorPicker.addEventListener("input", function() {
        hexInput.value = colorPicker.value;
      });
      hexInput.addEventListener("input", function() {
        var val = hexInput.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          colorPicker.value = val;
        }
      });
    }

    var applyBtn = document.getElementById("applyCustomBg");
    if (applyBtn) {
      applyBtn.addEventListener("click", function() {
        var hex = document.getElementById("customBgHex").value;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
          var settings = getSettings();
          settings.bgColor = hex;
          saveSettings(settings);
          render();
        } else {
          alert("Please enter a valid hex color (e.g. #f0eee9)");
        }
      });
    }

    var resetBtn = document.getElementById("resetAllBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function() {
        if (!confirm("This will erase ALL your data. Are you sure?")) return;
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_VERSION_KEY);
        localStorage.removeItem(SETTINGS_KEY);
        state.data = { contacts: [] };
        if (typeof SEED_DATA !== "undefined") {
          state.data = SEED_DATA;
        }
        saveData(state.data);
        state.view = "dashboard";
        render();
        alert("All data has been reset.");
      });
    }

    // Compress all photos (shrink base64 images already stored)
    var compressBtn = document.getElementById("compressPhotosBtn");
    if (compressBtn) {
      compressBtn.addEventListener("click", function() {
        compressBtn.disabled = true;
        compressBtn.textContent = "Compressing...";
        compressAllPhotos().then(function(saved) {
          render();
          alert(saved
            ? "Photos compressed. Storage freed up."
            : "Nothing to compress, or compression failed.");
        }).catch(function(err) {
          render();
          alert("Compression failed: " + err.message);
        });
      });
    }

    // Export from settings
    var exportBtn2 = document.getElementById("exportDataBtn2");
    if (exportBtn2) {
      exportBtn2.addEventListener("click", function() {
        exportData();
      });
    }
  }

  // Re-compress all stored base64 images to shrink storage footprint
  function compressAllPhotos() {
    var jobs = [];
    state.data.contacts.forEach(function(c) {
      if (c.customPhoto && c.customPhoto.indexOf("data:image") === 0) {
        jobs.push(compressDataUrl(c.customPhoto, 320, 0.8).then(function(newUrl) { c.customPhoto = newUrl; }));
      }
      if (c.customCoffeeImage && c.customCoffeeImage.indexOf("data:image") === 0) {
        jobs.push(compressDataUrl(c.customCoffeeImage, 128, 0.75).then(function(newUrl) { c.customCoffeeImage = newUrl; }));
      }
    });
    var settings = getSettings();
    if (settings.customCoffeeImage && settings.customCoffeeImage.indexOf("data:image") === 0) {
      jobs.push(compressDataUrl(settings.customCoffeeImage, 256, 0.75).then(function(newUrl) {
        settings.customCoffeeImage = newUrl;
        saveSettings(settings);
      }));
    }
    if (jobs.length === 0) return Promise.resolve(false);
    return Promise.all(jobs).then(function() {
      return saveData(state.data);
    });
  }

  // Compress an existing data URL (base64) to a smaller JPEG
  function compressDataUrl(dataUrl, maxDim, quality) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function() {
        var w = img.width, h = img.height;
        var scale = Math.min(1, maxDim / Math.max(w, h));
        var cw = Math.round(w * scale), ch = Math.round(h * scale);
        var canvas = document.createElement("canvas");
        canvas.width = cw; canvas.height = ch;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, cw, ch);
        var out = canvas.toDataURL("image/jpeg", quality);
        // Only use the smaller version
        resolve(out.length < dataUrl.length ? out : dataUrl);
      };
      img.onerror = function() { reject(new Error("Could not load image")); };
      img.src = dataUrl;
    });
  }

  // --- Dashboard ---
  function renderDashboard() {
    var contacts = state.data.contacts;
    var totalContacts = contacts.length;
    var planned = contacts.filter(function(c) { return c.status === "planned"; }).length;
    var completed = contacts.filter(function(c) { return c.status === "completed"; }).length;
    var pendingFollowups = contacts.reduce(function(acc, c) {
      return acc + (c.followups ? c.followups.filter(function(f) { return !f.done; }).length : 0);
    }, 0);
    var totalTalks = contacts.reduce(function(acc, c) {
      return acc + (c.talkRecords ? c.talkRecords.length : 0);
    }, 0);

    var upcomingHtml = contacts.filter(function(c) { return c.status === "planned"; })
      .map(function(c) {
        return '<div class="contact-card" data-contact-id="' + c.id + '">' +
          '<div class="contact-avatar">' + renderCoffeeIcon(c.coffeeType, c.customCoffeeImage, 28) + '</div>' +
          '<div class="contact-info"><div class="contact-name">' + escapeHtml(c.name) + '</div>' +
          '<div class="contact-meta">' + escapeHtml(c.institution || "") + '</div></div>' +
          '<div class="contact-badge planned">Planned</div>' +
          '</div>';
      }).join("");

    var followupHtml = "";
    contacts.forEach(function(c) {
      if (c.followups) {
        c.followups.filter(function(f) { return !f.done; }).forEach(function(f) {
          followupHtml += '<div class="contact-card" data-contact-id="' + c.id + '">' +
            '<div class="contact-avatar">' + renderCoffeeIcon(c.coffeeType, c.customCoffeeImage, 28) + '</div>' +
            '<div class="contact-info"><div class="contact-name">' + escapeHtml(f.text) + '</div>' +
            '<div class="contact-meta">' + escapeHtml(c.name) + '</div></div>' +
            '</div>';
        });
      }
    });

    return '<div class="app-layout">' +
      renderSidebar("dashboard") +
      '<div class="main-content">' +
        '<div class="dashboard-header">' +
          '<h1>Coffee Chat Companion</h1>' +
          '<p>Track, learn, and grow from every conversation</p>' +
        '</div>' +
        '<div class="stat-grid">' +
          '<div class="stat-card"><div class="label">Total Contacts</div><div class="value">' + totalContacts + '</div></div>' +
          '<div class="stat-card"><div class="label">Chats Planned</div><div class="value">' + planned + '</div></div>' +
          '<div class="stat-card"><div class="label">Chats Done</div><div class="value">' + completed + '</div></div>' +
          '<div class="stat-card"><div class="label">Pending Follow-ups</div><div class="value">' + pendingFollowups + '</div></div>' +
        '</div>' +
        '<div class="section-title">Upcoming Chats <span class="action" id="addContactBtn">+ Add Contact</span></div>' +
        (upcomingHtml || '<div class="empty-state"><div class="icon">&#9749;</div><div class="title">No upcoming chats</div><div class="desc">Add a contact to get started</div></div>') +
        (followupHtml ? '<div class="section-title" style="margin-top:28px;">Pending Follow-ups</div><div class="contact-list">' + followupHtml + '</div>' : '') +
      '</div>' +
    '</div>';
  }

  function attachDashboardEvents() {
    var cards = document.querySelectorAll(".contact-card[data-contact-id]");
    cards.forEach(function(card) {
      card.addEventListener("click", function() {
        state.view = "contactDetail";
        state.currentContactId = card.getAttribute("data-contact-id");
        state.activeTab = "brief";
        render();
      });
    });
    var addBtn = document.getElementById("addContactBtn");
    if (addBtn) {
      addBtn.addEventListener("click", function() {
        state.view = "addContact";
        render();
      });
    }
  }

  // --- Contact List ---
  function renderContactList() {
    var contacts = state.data.contacts;
    var listHtml = contacts.map(function(c) {
      var badge = "";
      if (c.status === "planned") badge = '<div class="contact-badge planned">Planned</div>';
      else if (c.status === "completed") badge = '<div class="contact-badge">Done</div>';
      var followupCount = c.followups ? c.followups.filter(function(f) { return !f.done; }).length : 0;
      if (followupCount > 0) badge += '<div class="contact-badge followup" style="margin-left:4px;">' + followupCount + ' follow-up</div>';
      return '<div class="contact-card" data-contact-id="' + c.id + '">' +
        '<div class="contact-avatar">' + renderCoffeeIcon(c.coffeeType, c.customCoffeeImage, 28) + '</div>' +
        '<div class="contact-info"><div class="contact-name">' + escapeHtml(c.name) + '</div>' +
        '<div class="contact-meta">' + escapeHtml(c.institution || "") + (c.researchField ? " · " + escapeHtml(c.researchField.substring(0, 40)) : "") + '</div></div>' +
        badge +
        '</div>';
    }).join("");

    return '<div class="app-layout">' +
      renderSidebar("contacts") +
      '<div class="main-content">' +
        '<div class="dashboard-header">' +
          '<h1>Contacts</h1>' +
          '<p>All coffee chat contacts</p>' +
        '</div>' +
        '<div class="section-title">All Contacts <span class="action" id="addContactBtn2">+ Add</span></div>' +
        (listHtml || '<div class="empty-state"><div class="icon">&#9749;</div><div class="title">No contacts yet</div></div>') +
      '</div>' +
    '</div>';
  }

  function attachContactListEvents() {
    var cards = document.querySelectorAll(".contact-card[data-contact-id]");
    cards.forEach(function(card) {
      card.addEventListener("click", function() {
        state.view = "contactDetail";
        state.currentContactId = card.getAttribute("data-contact-id");
        state.activeTab = "brief";
        render();
      });
    });
    var addBtn = document.getElementById("addContactBtn2");
    if (addBtn) {
      addBtn.addEventListener("click", function() {
        state.view = "addContact";
        render();
      });
    }
  }

  // --- Contact Detail ---
  function renderContactDetail() {
    var c = getContact(state.currentContactId);
    if (!c) {
      // Contact not found — redirect to contact list via render()
      state.view = "contactList";
      return renderContactList();
    }

    return '<div class="app-layout">' +
      renderSidebar("contacts") +
      '<div class="main-content">' +
        '<div class="back-btn" id="backBtn">&larr; Back to contacts <span style="float:right;color:var(--accent);cursor:pointer;font-size:13px;" id="editContactBtn">Edit Info</span></div>' +
        '<div style="position:relative;overflow:hidden;border-radius:12px;padding:0;">' +
        renderCoffeeBg(c) +
        '<div style="position:relative;z-index:1;">' +
        '<div class="detail-header">' +
          '<div class="info" style="flex:1;">' +
            '<h1>' + escapeHtml(c.name) + '</h1>' +
            '<p>' + escapeHtml(c.title || "") + (c.institution ? " · " + escapeHtml(c.institution) : "") + '</p>' +
            '<p>' + escapeHtml(c.researchField || "") + '</p>' +
            '<div style="margin-top:6px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
              '<span style="font-size:11px;color:var(--text-tertiary);">Coffee:</span>' +
              '<span style="font-size:12px;color:var(--accent);font-weight:500;">' + getCoffeeLabel(c.coffeeType, c.customCoffeeImage, c.customCoffeeName) + '</span>' +
              getCoffeeSelector(c.coffeeType) +
              '<span style="font-size:11px;color:var(--text-tertiary);">or</span>' +
              '<label for="coffeeIconUpload" style="font-size:12px;color:var(--accent);cursor:pointer;text-decoration:underline;">Upload Coffee Icon</label>' +
              '<input type="file" id="coffeeIconUpload" accept="image/*" style="display:none;">' +
              (c.customCoffeeImage ? '<button id="removeCoffeeImg" style="font-size:11px;color:var(--text-tertiary);background:none;border:none;cursor:pointer;text-decoration:underline;">Remove Icon</button>' : '') +
            '</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;flex-shrink:0;">' +
            '<div class="avatar-lg">' + renderContactAvatar(c, 72) + '</div>' +
            '<label for="photoUpload" style="font-size:10px;color:var(--accent);cursor:pointer;text-decoration:underline;">Change Photo</label>' +
            '<input type="file" id="photoUpload" accept="image/*" style="display:none;">' +
            (c.photoUrl || c.customPhoto ? '<button id="resetPhoto" style="font-size:10px;color:var(--text-tertiary);background:none;border:none;cursor:pointer;text-decoration:underline;">Reset</button>' : '') +
          '</div>' +
        '</div>' +
        '<div class="tabs">' +
          '<div class="tab ' + (state.activeTab === "brief" ? "active" : "") + '" data-tab="brief">Research Brief</div>' +
          '<div class="tab ' + (state.activeTab === "questions" ? "active" : "") + '" data-tab="questions">Questions (' + (c.questions ? c.questions.length : 0) + ')</div>' +
          '<div class="tab ' + (state.activeTab === "talks" ? "active" : "") + '" data-tab="talks">Talk Records (' + (c.talkRecords ? c.talkRecords.length : 0) + ')</div>' +
          '<div class="tab ' + (state.activeTab === "followups" ? "active" : "") + '" data-tab="followups">Follow-ups (' + (c.followups ? c.followups.filter(function(f){return !f.done;}).length : 0) + ')</div>' +
        '</div>' +
        '<div class="tab-content ' + (state.activeTab === "brief" ? "active" : "") + '" id="tab-brief">' + renderBrief(c) + '</div>' +
        '<div class="tab-content ' + (state.activeTab === "questions" ? "active" : "") + '" id="tab-questions">' + renderQuestions(c) + '</div>' +
        '<div class="tab-content ' + (state.activeTab === "talks" ? "active" : "") + '" id="tab-talks">' + renderTalks(c) + '</div>' +
        '<div class="tab-content ' + (state.activeTab === "followups" ? "active" : "") + '" id="tab-followups">' + renderFollowups(c) + '</div>' +
        '</div>' + // close z-index:1 wrapper
        '</div>' + // close relative bg wrapper
      '</div>' +
    '</div>';
  }

  function renderBrief(c) {
    var html = "";

    // Auto Research section (always visible)
    var hasApiKey = !!getApiConfig().key;
    html += '<div class="auto-research-box">' +
      '<div class="auto-research-header">' +
        '<span>&#128269;</span>' +
        '<strong>Auto Research</strong>' +
        '<span style="margin-left:auto;font-size:13px;color:var(--text-tertiary);">Fill research brief automatically</span>' +
      '</div>' +
      '<div class="auto-research-options">' +
        '<div class="auto-research-option" style="flex:2;">' +
          '<div class="option-title">Option 1: Ask AI Agent (Recommended)</div>' +
          '<p>Copy a prompt with this person\'s info, paste to ChatGPT/Claude/WorkBuddy, then paste the result back.</p>' +
          '<div style="display:flex;gap:8px;">' +
            '<button class="btn btn-secondary" id="copyPromptBtn" style="font-size:13px;padding:6px 14px;">&#128203; Copy Prompt</button>' +
            '<button class="btn btn-secondary" id="pasteJsonBtn" style="font-size:13px;padding:6px 14px;">&#128220; Paste JSON</button>' +
          '</div>' +
        '</div>' +
        '<div class="auto-research-divider">or</div>' +
        '<div class="auto-research-option" style="flex:1;">' +
          '<div class="option-title">Option 2: Use AI API ' + (hasApiKey ? '&#9989;' : '') + '</div>' +
          '<p>Configure your OpenAI API key to auto-fill research brief with web search + LLM.</p>' +
          (hasApiKey
            ? '<button class="btn btn-primary" id="runAutoResearchBtn" style="font-size:13px;padding:6px 14px;">&#9889; Run Auto Research</button>'
            : '<button class="btn btn-secondary" id="configApiBtn" style="font-size:13px;padding:6px 14px;">Configure API Key</button>'
          ) +
        '</div>' +
      '</div>' +
    '</div>';

    if (!c.research) {
      html += '<div class="empty-state"><div class="title">No research brief yet</div><div class="desc">Add a research brief to prepare for your chat</div></div>' +
        '<div style="margin-top:16px;"><button class="btn btn-primary" id="editBriefBtn">+ Add Research Brief</button></div>';
      return html;
    }
    var r = c.research;

    html += '<div style="text-align:right;margin-bottom:8px;"><button class="btn btn-secondary" id="editBriefBtn" style="font-size:12px;">Edit Brief</button></div>';
    html += '<div class="brief-section"><h3>Summary</h3><p>' + linkify(r.summary) + '</p></div>';

    if (r.careerPath && r.careerPath.length) {
      html += '<div class="brief-section"><h3>Career Path</h3><ul>';
      r.careerPath.forEach(function(step) {
        if (typeof step === "string") {
          html += "<li>" + escapeHtml(step) + "</li>";
        } else if (step && typeof step === "object") {
          var stepText = step.period || "";
          if (step.position) stepText += (stepText ? ": " : "") + step.position;
          if (step.institution) stepText += (stepText ? " — " : "") + step.institution;
          if (step.detail) stepText += (stepText ? ". " : "") + step.detail;
          html += "<li>" + escapeHtml(stepText) + "</li>";
        }
      });
      html += "</ul></div>";
    }

    if (r.researchLines && r.researchLines.length) {
      html += '<div class="brief-section"><h3>Research Lines</h3>';
      r.researchLines.forEach(function(line) {
        html += "<p><strong>" + escapeHtml(line.title) + "</strong></p><p>" + escapeHtml(line.detail) + "</p>";
      });
      html += "</div>";
    }

    if (r.industryExperience) {
      html += '<div class="brief-section"><h3>Industry Experience</h3><p>' + escapeHtml(r.industryExperience) + "</p></div>";
    }

    if (r.awards && r.awards.length) {
      html += '<div class="brief-section"><h3>Awards &amp; Honors</h3><ul>';
      r.awards.forEach(function(a) {
        if (typeof a === "string") {
          html += "<li>" + escapeHtml(a) + "</li>";
        } else if (a && typeof a === "object") {
          var awardText = a.name || "";
          if (a.organization) awardText += (awardText ? " — " : "") + a.organization;
          if (a.year) awardText += (awardText ? " (" : "") + a.year + ")";
          if (a.detail) awardText += (awardText ? ": " : "") + a.detail;
          html += "<li>" + escapeHtml(awardText) + "</li>";
        }
      });
      html += "</ul></div>";
    }

    if (r.keyPapers && r.keyPapers.length) {
      html += '<div class="brief-section"><h3>Selected Publications</h3><ul>';
      r.keyPapers.forEach(function(p) {
        if (typeof p === "string") {
          html += "<li>" + escapeHtml(p) + "</li>";
        } else if (p && typeof p === "object") {
          var paperText = p.title || "";
          if (p.authors) paperText += (paperText ? " — " : "") + p.authors;
          if (p.journal) paperText += (paperText ? ", " : "") + p.journal;
          if (p.year) paperText += (paperText ? " (" : "") + p.year + ")";
          if (p.significance) paperText += (paperText ? ": " : "") + p.significance;
          html += "<li>" + escapeHtml(paperText) + "</li>";
        }
      });
      html += "</ul></div>";
    }

    return html;
  }

  function renderQuestions(c) {
    var html = "";
    if (c.questions && c.questions.length) {
      c.questions.forEach(function(q, i) {
        var tagsHtml = "";
        if (q.tags) {
          q.tags.forEach(function(tag) {
            var cls = "";
            if (tag === "resonate") cls = " resonate";
            if (tag === "deep") cls = " deep";
            tagsHtml += '<span class="q-tag' + cls + '">' + escapeHtml(tag) + "</span>";
          });
        }
        html += '<div class="question-card">' +
          '<div class="q-header">' +
            '<div class="q-num">Q' + (i + 1) + "</div>" +
            '<div class="q-text">' + escapeHtml(q.text) + "</div>" +
            '<div style="display:flex;gap:4px;flex-shrink:0;">' +
              '<button class="btn-edit-small" data-edit-question="' + q.id + '" title="Edit">Edit</button>' +
              '<button class="btn-delete-small" data-delete-question="' + q.id + '" title="Delete">Del</button>' +
            '</div>' +
          "</div>" +
          (q.note ? '<div class="q-note">' + escapeHtml(q.note) + "</div>" : "") +
          (tagsHtml ? '<div class="q-tags">' + tagsHtml + "</div>" : "") +
        "</div>";
      });
    } else {
      html += '<div class="empty-state"><div class="title">No questions prepared yet</div><div class="desc">Add questions you want to ask or topics to explore</div></div>';
    }
    html += '<div style="margin-top:16px;"><button class="btn btn-secondary" id="addQuestionBtn">+ Add Question</button></div>';
    return html;
  }

  function renderTalks(c) {
    var html = "";
    if (c.talkRecords && c.talkRecords.length) {
      c.talkRecords.forEach(function(t) {
        html += '<div class="talk-record">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;">' +
            '<div class="talk-date">' + formatDate(t.date) + (t.location ? " · " + escapeHtml(t.location) : "") + "</div>" +
            '<div style="display:flex;gap:4px;flex-shrink:0;">' +
              '<button class="btn-edit-small" data-edit-talk="' + t.id + '">Edit</button>' +
              '<button class="btn-delete-small" data-delete-talk="' + t.id + '">Del</button>' +
            '</div>' +
          '</div>' +
          (t.topics ? '<div class="talk-topics"><strong>Topics:</strong> ' + escapeHtml(t.topics) + "</div>" : "") +
          (t.notes ? '<div class="talk-notes">' + (t.notes.startsWith("<") ? t.notes : linkify(t.notes)) + "</div>" : "") +
          (t.insights ? '<div class="talk-insights"><strong>Key Insights:</strong> ' + (t.insights.startsWith("<") ? t.insights : escapeHtml(t.insights)) + "</div>" : "") +
        "</div>";
      });
    } else {
      html += '<div class="empty-state"><div class="icon">&#9749;</div><div class="title">No talk records yet</div><div class="desc">After your coffee chat, record what you discussed here</div></div>';
    }
    html += '<div style="margin-top:16px;"><button class="btn btn-secondary" id="addTalkBtn">+ Add Talk Record</button></div>';
    return html;
  }

  function renderFollowups(c) {
    var html = "";
    if (!c.followups || !c.followups.length) {
      html = '<div class="empty-state"><div class="title">No follow-ups yet</div></div>';
    } else {
      c.followups.forEach(function(f) {
        html += '<div class="followup-item">' +
          '<input type="checkbox" class="followup-checkbox" data-followup-id="' + f.id + '"' + (f.done ? " checked" : "") + ">" +
          '<div class="followup-text' + (f.done ? " done" : "") + '">' + escapeHtml(f.text) + "</div>" +
          (f.dueDate ? '<div class="followup-date">' + formatDate(f.dueDate) + "</div>" : "") +
          '<div style="display:flex;gap:4px;flex-shrink:0;margin-left:8px;">' +
            '<button class="btn-edit-small" data-edit-followup="' + f.id + '">Edit</button>' +
            '<button class="btn-delete-small" data-delete-followup="' + f.id + '">Del</button>' +
          '</div>' +
        "</div>";
      });
    }
    html += '<div style="margin-top:16px;"><button class="btn btn-secondary" id="addFollowupBtn">+ Add Follow-up</button></div>';
    return html;
  }

  function attachDetailEvents() {
    var backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", function() {
        state.view = "contactList";
        render();
      });
    }

    var tabs = document.querySelectorAll(".tab");
    tabs.forEach(function(tab) {
      tab.addEventListener("click", function() {
        state.activeTab = tab.getAttribute("data-tab");
        render();
      });
    });

    var checkboxes = document.querySelectorAll(".followup-checkbox");
    checkboxes.forEach(function(cb) {
      cb.addEventListener("change", function() {
        var fuId = cb.getAttribute("data-followup-id");
        var c = getContact(state.currentContactId);
        if (c && c.followups) {
          var fu = c.followups.find(function(f) { return f.id === fuId; });
          if (fu) {
            fu.done = cb.checked;
            saveData(state.data);
            state.activeTab = "followups";
            render();
          }
        }
      });
    });

    var addFuBtn = document.getElementById("addFollowupBtn");
    if (addFuBtn) {
      addFuBtn.addEventListener("click", function() {
        renderAddFollowupModal();
      });
    }

    var addQBtn = document.getElementById("addQuestionBtn");
    if (addQBtn) {
      addQBtn.addEventListener("click", function() {
        renderAddQuestionModal();
      });
    }

    var addTalkBtn = document.getElementById("addTalkBtn");
    if (addTalkBtn) {
      addTalkBtn.addEventListener("click", function() {
        renderAddTalkModal();
      });
    }

    var coffeeSelect = document.getElementById("coffeeTypeSelect");
    if (coffeeSelect) {
      coffeeSelect.addEventListener("change", function() {
        var c = getContact(state.currentContactId);
        if (c) {
          c.coffeeType = coffeeSelect.value || null;
          if (c.coffeeType) {
            c.customCoffeeImage = null;
            c.customCoffeeName = null;
          }
          saveData(state.data);
          render();
        }
      });
    }

    // Photo upload
    var photoUpload = document.getElementById("photoUpload");
    if (photoUpload) {
      photoUpload.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        compressImage(file, 320, 0.8).then(function(dataUrl) {
          var c = getContact(state.currentContactId);
          if (c) {
            c.customPhoto = dataUrl;
            saveData(state.data);
            render();
          }
        }).catch(function(err) {
          alert("Could not process image: " + err.message);
        });
      });
    }

    // Reset photo
    var resetPhotoBtn = document.getElementById("resetPhoto");
    if (resetPhotoBtn) {
      resetPhotoBtn.addEventListener("click", function() {
        var c = getContact(state.currentContactId);
        if (c) {
          c.customPhoto = null;
          c.photoUrl = null;
          saveData(state.data);
          render();
        }
      });
    }

    // Coffee icon upload (with custom name prompt)
    var coffeeIconUpload = document.getElementById("coffeeIconUpload");
    if (coffeeIconUpload) {
      coffeeIconUpload.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        compressImage(file, 128, 0.75).then(function(dataUrl) {
          var c = getContact(state.currentContactId);
          if (c) {
            // Prompt for custom coffee name
            var customName = window.prompt("Name this coffee (e.g. Butter Latte, Hazelnut Mocha):", getCoffeeLabel(c.coffeeType, c.customCoffeeImage, c.customCoffeeName));
            c.customCoffeeImage = dataUrl;
            c.coffeeType = null;
            c.customCoffeeName = (customName && customName.trim()) ? customName.trim() : "Custom";
            saveData(state.data);
            render();
          }
        }).catch(function(err) {
          alert("Could not process image: " + err.message);
        });
      });
    }

    // Remove custom coffee icon
    var removeCoffeeImgBtn = document.getElementById("removeCoffeeImg");
    if (removeCoffeeImgBtn) {
      removeCoffeeImgBtn.addEventListener("click", function() {
        var c = getContact(state.currentContactId);
        if (c) {
          c.customCoffeeImage = null;
          c.customCoffeeName = null;
          saveData(state.data);
          render();
        }
      });
    }

    // Edit Brief button
    var editBriefBtn = document.getElementById("editBriefBtn");
    if (editBriefBtn) {
      editBriefBtn.addEventListener("click", function() {
        renderEditBriefModal();
      });
    }

    // Edit Question buttons
    document.querySelectorAll("[data-edit-question]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        renderEditQuestionModal(btn.getAttribute("data-edit-question"));
      });
    });

    // Delete Question buttons
    document.querySelectorAll("[data-delete-question]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var qId = btn.getAttribute("data-delete-question");
        if (!confirm("Delete this question?")) return;
        var c = getContact(state.currentContactId);
        if (c && c.questions) {
          c.questions = c.questions.filter(function(q) { return q.id !== qId; });
          saveData(state.data);
          state.activeTab = "questions";
          render();
        }
      });
    });

    // Edit Talk buttons
    document.querySelectorAll("[data-edit-talk]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        renderEditTalkModal(btn.getAttribute("data-edit-talk"));
      });
    });

    // Delete Talk buttons
    document.querySelectorAll("[data-delete-talk]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var tId = btn.getAttribute("data-delete-talk");
        if (!confirm("Delete this talk record?")) return;
        var c = getContact(state.currentContactId);
        if (c && c.talkRecords) {
          c.talkRecords = c.talkRecords.filter(function(t) { return t.id !== tId; });
          saveData(state.data);
          state.activeTab = "talks";
          render();
        }
      });
    });

    // Edit Follow-up buttons
    document.querySelectorAll("[data-edit-followup]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        renderEditFollowupModal(btn.getAttribute("data-edit-followup"));
      });
    });

    // Delete Follow-up buttons
    document.querySelectorAll("[data-delete-followup]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var fId = btn.getAttribute("data-delete-followup");
        if (!confirm("Delete this follow-up?")) return;
        var c = getContact(state.currentContactId);
        if (c && c.followups) {
          c.followups = c.followups.filter(function(f) { return f.id !== fId; });
          saveData(state.data);
          state.activeTab = "followups";
          render();
        }
      });
    });

    // Auto Research: Copy Prompt button
    var copyPromptBtn = document.getElementById("copyPromptBtn");
    if (copyPromptBtn) {
      copyPromptBtn.addEventListener("click", function() {
        var c = getContact(state.currentContactId);
        if (!c) return;
        var prompt = generateResearchPrompt(c);
        navigator.clipboard.writeText(prompt).then(function() {
          copyPromptBtn.textContent = "Copied!";
          setTimeout(function() {
            copyPromptBtn.innerHTML = "&#128203; Copy Prompt";
          }, 2000);
        }).catch(function() {
          // Fallback
          var textarea = document.createElement("textarea");
          textarea.value = prompt;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          copyPromptBtn.textContent = "Copied!";
          setTimeout(function() {
            copyPromptBtn.innerHTML = "&#128203; Copy Prompt";
          }, 2000);
        });
      });
    }

    // Auto Research: Configure API Key button
    var configApiBtn = document.getElementById("configApiBtn");
    if (configApiBtn) {
      configApiBtn.addEventListener("click", function() {
        renderApiKeyModal();
      });
    }

    // Auto Research: Run Auto Research with API
    var runAutoResearchBtn = document.getElementById("runAutoResearchBtn");
    if (runAutoResearchBtn) {
      runAutoResearchBtn.addEventListener("click", function() {
        runAutoResearch();
      });
    }

    // Auto Research: Paste JSON button
    var pasteJsonBtn = document.getElementById("pasteJsonBtn");
    if (pasteJsonBtn) {
      pasteJsonBtn.addEventListener("click", function() {
        renderPasteJsonModal();
      });
    }

    var editBtn = document.getElementById("editContactBtn");
    if (editBtn) {
      editBtn.addEventListener("click", function() {
        renderEditContactModal();
      });
    }
  }

  // Generate research prompt for AI agent
  function generateResearchPrompt(c) {
    return "Please research the following person and provide a structured research brief in JSON format.\\n\\n" +
      "Name: " + (c.name || "") + "\\n" +
      "Institution: " + (c.institution || "") + "\\n" +
      "Title: " + (c.title || "") + "\\n" +
      "Research Field: " + (c.researchField || "") + "\\n\\n" +
      "Please provide:\\n" +
      "1. A concise summary (2-3 sentences)\\n" +
      "2. Career path (list of positions/education)\\n" +
      "3. Research lines (title + detail for each major research area)\\n" +
      "4. Industry experience (if any)\\n" +
      "5. Awards and honors\\n" +
      "6. Key papers/publications\\n\\n" +
      "Format as JSON with fields: summary, careerPath (array), researchLines (array of {title, detail}), industryExperience (string), awards (array), keyPapers (array).";
  }

  // --- API Configuration Management ---
  function getApiConfig() {
    return {
      key: localStorage.getItem(API_KEY_STORAGE) || "",
      endpoint: localStorage.getItem(API_ENDPOINT_STORAGE) || "https://api.openai.com/v1/chat/completions",
      model: localStorage.getItem(API_MODEL_STORAGE) || "gpt-4o-mini"
    };
  }

  function setApiConfig(config) {
    if (config.key && config.key.trim()) {
      localStorage.setItem(API_KEY_STORAGE, config.key.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
    if (config.endpoint && config.endpoint.trim()) {
      localStorage.setItem(API_ENDPOINT_STORAGE, config.endpoint.trim());
    } else {
      localStorage.removeItem(API_ENDPOINT_STORAGE);
    }
    if (config.model && config.model.trim()) {
      localStorage.setItem(API_MODEL_STORAGE, config.model.trim());
    } else {
      localStorage.removeItem(API_MODEL_STORAGE);
    }
  }

  function hasApiConfig() {
    var cfg = getApiConfig();
    return !!cfg.key;
  }

  function renderApiKeyModal() {
    var cfg = getApiConfig();
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal" style="max-width:480px;">' +
      '<h2>AI API Configuration</h2>' +
      '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">Enter your API key to enable auto-research. Supports OpenAI, Claude (via proxy), and any OpenAI-compatible API.</p>' +
      '<div class="form-group"><label>API Key <span style="color:var(--accent);">*</span></label><input type="password" id="apiKeyInput" placeholder="sk-..." value="' + escapeHtml(cfg.key) + '"></div>' +
      '<div style="font-size:12px;color:var(--text-tertiary);margin-bottom:12px;">' +
        '<details><summary style="cursor:pointer;">Advanced settings (optional)</summary>' +
        '<div style="margin-top:12px;">' +
        '<div class="form-group"><label>API Endpoint</label><input type="text" id="apiEndpointInput" placeholder="https://api.openai.com/v1/chat/completions" value="' + escapeHtml(cfg.endpoint) + '"></div>' +
        '<div class="form-group"><label>Model Name</label><input type="text" id="apiModelInput" placeholder="gpt-4o-mini" value="' + escapeHtml(cfg.model) + '"></div>' +
        '</div>' +
      '</details>' +
      '</div>' +
      '<div class="form-actions">' +
        '<button class="btn btn-secondary" id="cancelApiKey">Cancel</button>' +
        '<button class="btn btn-primary" id="saveApiKey">Save</button>' +
        (cfg.key ? '<button class="btn btn-secondary" id="clearApiKey" style="margin-left:auto;">Remove</button>' : '') +
      '</div>' +
    '</div>';
    document.body.appendChild(overlay);

    document.getElementById("cancelApiKey").addEventListener("click", function() {
      document.body.removeChild(overlay);
    });

    document.getElementById("saveApiKey").addEventListener("click", function() {
      var key = document.getElementById("apiKeyInput").value.trim();
      var endpoint = document.getElementById("apiEndpointInput").value.trim();
      var model = document.getElementById("apiModelInput").value.trim();
      setApiConfig({ key: key, endpoint: endpoint, model: model });
      document.body.removeChild(overlay);
      alert(key ? "API configuration saved!" : "API configuration removed.");
      render();
    });

    var clearBtn = document.getElementById("clearApiKey");
    if (clearBtn) {
      clearBtn.addEventListener("click", function() {
        setApiConfig({ key: "", endpoint: "", model: "" });
        document.body.removeChild(overlay);
        alert("API configuration removed.");
        render();
      });
    }
  }

  // --- Auto Research with Configurable API ---
  async function runAutoResearch() {
    var cfg = getApiConfig();
    if (!cfg.key) {
      alert("Please configure your API key first.");
      renderApiKeyModal();
      return;
    }

    var c = getContact(state.currentContactId);
    if (!c) return;

    var btn = document.getElementById("runAutoResearchBtn");
    if (btn) {
      btn.textContent = "Researching...";
      btn.disabled = true;
    }

    try {
      var prompt = generateResearchPrompt(c);
      var response = await fetch(cfg.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + cfg.key
        },
        body: JSON.stringify({
          model: cfg.model,
          messages: [
            { role: "system", content: "You are a research assistant. Generate structured research briefs in JSON format." },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        var errorData = await response.json().catch(function() { return {}; });
        throw new Error(errorData.error?.message || "API request failed (" + response.status + ")");
      }

      var data = await response.json();
      var content = data.choices[0].message.content;

      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      var jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      var jsonText = jsonMatch ? jsonMatch[1] : content;

      var parsed = JSON.parse(jsonText);

      var research = {
        summary: parsed.summary || "",
        careerPath: Array.isArray(parsed.careerPath) ? parsed.careerPath : [],
        researchLines: Array.isArray(parsed.researchLines) ? parsed.researchLines : [],
        industryExperience: parsed.industryExperience || "",
        awards: Array.isArray(parsed.awards) ? parsed.awards : [],
        keyPapers: Array.isArray(parsed.keyPapers) ? parsed.keyPapers : []
      };

      research.researchLines = research.researchLines.map(function(line) {
        if (typeof line === "string") {
          return { title: line, detail: "" };
        }
        return {
          title: line.title || "",
          detail: line.detail || ""
        };
      });

      c.research = research;
      saveData(state.data);
      state.activeTab = "brief";
      render();
      alert("Research brief generated successfully!");

    } catch (err) {
      alert("Auto-research failed: " + err.message + "\n\nYou can use 'Copy Prompt' and paste to ChatGPT manually instead.");
    } finally {
      if (btn) {
        btn.textContent = "Run Auto Research";
        btn.disabled = false;
      }
    }
  }

  // --- Edit Contact Modal ---
  function renderEditContactModal() {
    var c = getContact(state.currentContactId);
    if (!c) return;
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal">' +
      '<h2>Edit Contact Info</h2>' +
      '<div class="form-group"><label>Name</label><input type="text" id="editName" value="' + escapeHtml(c.name) + '"></div>' +
      '<div class="form-group"><label>Title / Role</label><input type="text" id="editTitle" value="' + escapeHtml(c.title || "") + '"></div>' +
      '<div class="form-group"><label>Institution</label><input type="text" id="editInst" value="' + escapeHtml(c.institution || "") + '"></div>' +
      '<div class="form-group"><label>Department</label><input type="text" id="editDept" value="' + escapeHtml(c.department || "") + '"></div>' +
      '<div class="form-group"><label>Research Field</label><input type="text" id="editField" value="' + escapeHtml(c.researchField || "") + '"></div>' +
      '<div class="form-group"><label>Email</label><input type="text" id="editEmail" value="' + escapeHtml(c.email || "") + '"></div>' +
      '<div class="form-group"><label>Relationship / How you met</label><input type="text" id="editRel" value="' + escapeHtml(c.relationship || "") + '"></div>' +
      '<div class="form-group"><label>Photo URL</label><input type="text" id="editPhotoUrl" value="' + escapeHtml(c.photoUrl || "") + '" placeholder="Paste photo URL from their lab page"></div>' +
      '<div class="form-group"><label>Status</label><select id="editStatus">' +
        '<option value="planned"' + (c.status === "planned" ? " selected" : "") + '>Planned</option>' +
        '<option value="completed"' + (c.status === "completed" ? " selected" : "") + '>Completed</option>' +
        '</select></div>' +
      '<div class="form-group"><label>Tags (comma-separated)</label><input type="text" id="editTags" value="' + escapeHtml((c.tags || []).join(", ")) + '"></div>' +
      '<div class="form-actions">' +
        '<button class="btn btn-secondary" id="cancelEdit">Cancel</button>' +
        '<button class="btn btn-primary" id="confirmEdit">Save Changes</button>' +
      "</div>" +
    "</div>";
    document.body.appendChild(overlay);

    document.getElementById("cancelEdit").addEventListener("click", function() {
      document.body.removeChild(overlay);
    });

    document.getElementById("confirmEdit").addEventListener("click", function() {
      c.name = document.getElementById("editName").value.trim() || c.name;
      c.title = document.getElementById("editTitle").value.trim();
      c.institution = document.getElementById("editInst").value.trim();
      c.department = document.getElementById("editDept").value.trim();
      c.researchField = document.getElementById("editField").value.trim();
      c.email = document.getElementById("editEmail").value.trim() || null;
      c.relationship = document.getElementById("editRel").value.trim();
      c.photoUrl = document.getElementById("editPhotoUrl").value.trim() || null;
      c.status = document.getElementById("editStatus").value;
      var tagsRaw = document.getElementById("editTags").value.trim();
      c.tags = tagsRaw ? tagsRaw.split(",").map(function(t) { return t.trim(); }).filter(Boolean) : [];
      saveData(state.data);
      document.body.removeChild(overlay);
      render();
    });
  }

  // --- Add Question Modal ---
  function renderAddQuestionModal() {
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal">' +
      '<h2>Add Question</h2>' +
      '<div class="form-group"><label>Question</label><textarea id="qText" placeholder="What do you want to ask or explore?"></textarea></div>' +
      '<div class="form-group"><label>Context / Why this question (optional)</label><textarea id="qNote" placeholder="Why is this question interesting? How does it connect to your own interests?" style="min-height:60px;"></textarea></div>' +
      '<div class="form-group"><label>Tags (optional, comma-separated)</label><input type="text" id="qTags" placeholder="e.g. deep, resonate, career"></div>' +
      '<div class="form-actions">' +
        '<button class="btn btn-secondary" id="cancelQ">Cancel</button>' +
        '<button class="btn btn-primary" id="confirmQ">Add</button>' +
      "</div>" +
    "</div>";
    document.body.appendChild(overlay);

    document.getElementById("cancelQ").addEventListener("click", function() {
      document.body.removeChild(overlay);
    });

    document.getElementById("confirmQ").addEventListener("click", function() {
      var text = document.getElementById("qText").value.trim();
      if (!text) return;
      var note = document.getElementById("qNote").value.trim();
      var tagsRaw = document.getElementById("qTags").value.trim();
      var tags = tagsRaw ? tagsRaw.split(",").map(function(t) { return t.trim(); }).filter(Boolean) : [];
      var c = getContact(state.currentContactId);
      if (c) {
        if (!c.questions) c.questions = [];
        c.questions.push({
          id: "q-" + Date.now(),
          text: text,
          note: note || null,
          tags: tags
        });
        saveData(state.data);
        document.body.removeChild(overlay);
        state.activeTab = "questions";
        render();
      }
    });
  }

  // --- Add Talk Record Modal ---
  function renderAddTalkModal() {
    var today = new Date().toISOString().substring(0, 10);
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal" style="max-width:640px;">' +
      '<h2>Add Talk Record</h2>' +
      '<div class="form-group"><label>Date</label><input type="date" id="talkDate" value="' + today + '"></div>' +
      '<div class="form-group"><label>Location (optional)</label><input type="text" id="talkLocation" placeholder="e.g. Zoom, campus cafe"></div>' +
      '<div class="form-group"><label>Topics discussed</label><input type="text" id="talkTopics" placeholder="Brief summary of topics"></div>' +
      '<div class="form-group"><label>Notes</label><div id="talkNotesEditor" style="min-height:120px;"></div></div>' +
      '<div class="form-group"><label>Key Insights / Takeaways</label><div id="talkInsightsEditor" style="min-height:80px;"></div></div>' +
      '<div class="form-actions">' +
        '<button class="btn btn-secondary" id="cancelTalk">Cancel</button>' +
        '<button class="btn btn-primary" id="confirmTalk">Add</button>' +
      "</div>" +
    "</div>";
    document.body.appendChild(overlay);

    // Initialize Quill editors
    var notesQuill = new Quill("#talkNotesEditor", {
      theme: "snow",
      placeholder: "What was discussed in detail...",
      modules: {
        toolbar: [
          [{ "header": [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ "color": [] }, { "background": [] }],
          [{ "list": "ordered" }, { "list": "bullet" }],
          ["link", "image"],
          ["clean"]
        ]
      }
    });

    var insightsQuill = new Quill("#talkInsightsEditor", {
      theme: "snow",
      placeholder: "What did you learn? What surprised you?...",
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ "color": [] }],
          [{ "list": "ordered" }, { "list": "bullet" }],
          ["link"],
          ["clean"]
        ]
      }
    });

    document.getElementById("cancelTalk").addEventListener("click", function() {
      document.body.removeChild(overlay);
    });

    document.getElementById("confirmTalk").addEventListener("click", function() {
      var date = document.getElementById("talkDate").value;
      var location = document.getElementById("talkLocation").value.trim();
      var topics = document.getElementById("talkTopics").value.trim();
      var notes = notesQuill.root.innerHTML;
      var insights = insightsQuill.root.innerHTML;
      if (!date) return;
      var c = getContact(state.currentContactId);
      if (c) {
        if (!c.talkRecords) c.talkRecords = [];
        c.talkRecords.push({
          id: "talk-" + Date.now(),
          date: date,
          location: location || null,
          topics: topics || null,
          notes: notes || null,
          insights: insights || null
        });
        // Update contact status to completed if it was planned
        if (c.status === "planned") {
          c.status = "completed";
          c.lastTalkDate = date;
        }
        saveData(state.data);
        document.body.removeChild(overlay);
        state.activeTab = "talks";
        render();
      }
    });
  }

  // --- Paste JSON Modal ---
  function renderPasteJsonModal() {
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal" style="max-width:560px;">' +
      '<h2>Paste Research Brief JSON</h2>' +
      '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">Paste the JSON returned by your AI assistant (ChatGPT/Claude/WorkBuddy). The app will parse and fill the research brief automatically.</p>' +
      '<div class="form-group"><label>JSON Content</label><textarea id="jsonInput" rows="12" placeholder="Paste JSON here..."></textarea></div>' +
      '<div class="form-actions">' +
        '<button class="btn btn-secondary" id="cancelJson">Cancel</button>' +
        '<button class="btn btn-primary" id="confirmJson">Import</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(overlay);

    document.getElementById("cancelJson").addEventListener("click", function() {
      document.body.removeChild(overlay);
    });

    document.getElementById("confirmJson").addEventListener("click", function() {
      var jsonText = document.getElementById("jsonInput").value.trim();
      if (!jsonText) {
        alert("Please paste JSON content.");
        return;
      }
      try {
        var parsed = JSON.parse(jsonText);
        var c = getContact(state.currentContactId);
        if (!c) return;

        // Validate and normalize the parsed data
        var research = {
          summary: parsed.summary || "",
          careerPath: Array.isArray(parsed.careerPath) ? parsed.careerPath : [],
          researchLines: Array.isArray(parsed.researchLines) ? parsed.researchLines : [],
          industryExperience: parsed.industryExperience || "",
          awards: Array.isArray(parsed.awards) ? parsed.awards : [],
          keyPapers: Array.isArray(parsed.keyPapers) ? parsed.keyPapers : []
        };

        // Normalize researchLines to ensure each has title and detail
        research.researchLines = research.researchLines.map(function(line) {
          if (typeof line === "string") {
            return { title: line, detail: "" };
          }
          return {
            title: line.title || "",
            detail: line.detail || ""
          };
        });

        c.research = research;
        saveData(state.data);
        document.body.removeChild(overlay);
        state.activeTab = "brief";
        render();
        alert("Research brief imported successfully!");
      } catch (err) {
        alert("Invalid JSON: " + err.message + "\n\nMake sure you paste the complete JSON response from the AI.");
      }
    });
  }

  // --- Edit Brief Modal ---
  function renderEditBriefModal() {
    var c = getContact(state.currentContactId);
    if (!c) return;
    var r = c.research || {};
    var careerPathText = (r.careerPath || []).map(function(item) {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        var parts = [];
        if (item.period) parts.push(item.period);
        if (item.position) parts.push(item.position);
        if (item.institution) parts.push(item.institution);
        if (item.detail) parts.push(item.detail);
        return parts.join(" — ");
      }
      return String(item);
    }).join("\n");
    var awardsText = (r.awards || []).map(function(item) {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        var parts = [];
        if (item.name) parts.push(item.name);
        if (item.organization) parts.push(item.organization);
        if (item.year) parts.push(item.year);
        if (item.detail) parts.push(item.detail);
        return parts.join(" — ");
      }
      return String(item);
    }).join("\n");
    var papersText = (r.keyPapers || []).map(function(item) {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        var parts = [];
        if (item.title) parts.push(item.title);
        if (item.authors) parts.push(item.authors);
        if (item.journal) parts.push(item.journal);
        if (item.year) parts.push(item.year);
        if (item.significance) parts.push(item.significance);
        return parts.join(" — ");
      }
      return String(item);
    }).join("\n");

    var researchLinesHtml = "";
    if (r.researchLines && r.researchLines.length) {
      r.researchLines.forEach(function(line, i) {
        researchLinesHtml += '<div class="form-group"><label>Research Line ' + (i + 1) + ' — Title</label>' +
          '<input type="text" class="rl-title" value="' + escapeHtml(line.title || "") + '"></div>' +
          '<div class="form-group"><label>Research Line ' + (i + 1) + ' — Detail</label>' +
          '<textarea class="rl-detail" style="min-height:60px;">' + escapeHtml(line.detail || "") + '</textarea></div>';
      });
    } else {
      researchLinesHtml = '<div class="form-group"><label>Research Line 1 — Title</label>' +
        '<input type="text" class="rl-title" value=""></div>' +
        '<div class="form-group"><label>Research Line 1 — Detail</label>' +
        '<textarea class="rl-detail" style="min-height:60px;"></textarea></div>';
    }

    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal" style="max-width:700px;max-height:85vh;overflow-y:auto;">' +
      '<h2>Edit Research Brief</h2>' +
      '<div class="form-group"><label>Summary</label><textarea id="editBriefSummary" style="min-height:80px;">' + escapeHtml(r.summary || "") + '</textarea></div>' +
      '<div class="form-group"><label>Career Path (one per line)</label><textarea id="editBriefCareer" style="min-height:100px;">' + escapeHtml(careerPathText) + '</textarea></div>' +
      '<div id="researchLinesContainer">' + researchLinesHtml + '</div>' +
      '<div style="margin-bottom:12px;"><button class="btn btn-secondary" id="addResearchLine" style="font-size:12px;">+ Add Research Line</button></div>' +
      '<div class="form-group"><label>Industry Experience</label><textarea id="editBriefIndustry" style="min-height:60px;">' + escapeHtml(r.industryExperience || "") + '</textarea></div>' +
      '<div class="form-group"><label>Awards & Honors (one per line)</label><textarea id="editBriefAwards" style="min-height:80px;">' + escapeHtml(awardsText) + '</textarea></div>' +
      '<div class="form-group"><label>Selected Publications (one per line)</label><textarea id="editBriefPapers" style="min-height:100px;">' + escapeHtml(papersText) + '</textarea></div>' +
      '<div class="form-actions">' +
        '<button class="btn btn-secondary" id="cancelEditBrief">Cancel</button>' +
        '<button class="btn btn-primary" id="confirmEditBrief">Save Brief</button>' +
      "</div>" +
    "</div>";
    document.body.appendChild(overlay);

    document.getElementById("cancelEditBrief").addEventListener("click", function() {
      document.body.removeChild(overlay);
    });

    document.getElementById("addResearchLine").addEventListener("click", function() {
      var container = document.getElementById("researchLinesContainer");
      var idx = container.querySelectorAll(".rl-title").length + 1;
      var div = document.createElement("div");
      div.innerHTML = '<div class="form-group"><label>Research Line ' + idx + ' — Title</label>' +
        '<input type="text" class="rl-title" value=""></div>' +
        '<div class="form-group"><label>Research Line ' + idx + ' — Detail</label>' +
        '<textarea class="rl-detail" style="min-height:60px;"></textarea></div>';
      container.appendChild(div);
    });

    document.getElementById("confirmEditBrief").addEventListener("click", function() {
      var summary = document.getElementById("editBriefSummary").value.trim();
      var industry = document.getElementById("editBriefIndustry").value.trim();

      // Helper: parse text field that may contain JSON objects or plain text lines
      function parseMixedField(text) {
        if (!text) return [];
        var lines = text.split("\n").map(function(s) { return s.trim(); }).filter(Boolean);
        return lines.map(function(line) {
          // Try to parse as JSON object first
          if (line.startsWith("{") && line.endsWith("}")) {
            try { return JSON.parse(line); } catch(e) {}
          }
          // Try to parse as JSON array
          if (line.startsWith("[") && line.endsWith("]")) {
            try { return JSON.parse(line); } catch(e) {}
          }
          // Fallback: plain text string
          return line;
        });
      }

      var careerPath = parseMixedField(document.getElementById("editBriefCareer").value.trim());
      var awards = parseMixedField(document.getElementById("editBriefAwards").value.trim());
      var papers = parseMixedField(document.getElementById("editBriefPapers").value.trim());

      var titles = document.querySelectorAll(".rl-title");
      var details = document.querySelectorAll(".rl-detail");
      var researchLines = [];
      titles.forEach(function(t, i) {
        var title = t.value.trim();
        var detail = details[i] ? details[i].value.trim() : "";
        if (title || detail) researchLines.push({ title: title, detail: detail });
      });

      if (!c.research) c.research = {};
      c.research.summary = summary;
      c.research.careerPath = careerPath;
      c.research.researchLines = researchLines;
      c.research.industryExperience = industry;
      c.research.awards = awards;
      c.research.keyPapers = papers;
      saveData(state.data);
      document.body.removeChild(overlay);
      state.activeTab = "brief";
      render();
    });
  }

  // --- Edit Question Modal ---
  function renderEditQuestionModal(qId) {
    var c = getContact(state.currentContactId);
    if (!c || !c.questions) return;
    var q = c.questions.find(function(item) { return item.id === qId; });
    if (!q) return;

    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal">' +
      '<h2>Edit Question</h2>' +
      '<div class="form-group"><label>Question</label><textarea id="eqText">' + escapeHtml(q.text) + '</textarea></div>' +
      '<div class="form-group"><label>Context / Why this question (optional)</label><textarea id="eqNote" style="min-height:60px;">' + escapeHtml(q.note || "") + '</textarea></div>' +
      '<div class="form-group"><label>Tags (optional, comma-separated)</label><input type="text" id="eqTags" value="' + escapeHtml((q.tags || []).join(", ")) + '"></div>' +
      '<div class="form-actions">' +
        '<button class="btn btn-secondary" id="cancelEq">Cancel</button>' +
        '<button class="btn btn-primary" id="confirmEq">Save</button>' +
      "</div>" +
    "</div>";
    document.body.appendChild(overlay);

    document.getElementById("cancelEq").addEventListener("click", function() {
      document.body.removeChild(overlay);
    });

    document.getElementById("confirmEq").addEventListener("click", function() {
      q.text = document.getElementById("eqText").value.trim() || q.text;
      q.note = document.getElementById("eqNote").value.trim() || null;
      var tagsRaw = document.getElementById("eqTags").value.trim();
      q.tags = tagsRaw ? tagsRaw.split(",").map(function(t) { return t.trim(); }).filter(Boolean) : [];
      saveData(state.data);
      document.body.removeChild(overlay);
      state.activeTab = "questions";
      render();
    });
  }

  // --- Edit Talk Record Modal ---
  function renderEditTalkModal(tId) {
    var c = getContact(state.currentContactId);
    if (!c || !c.talkRecords) return;
    var t = c.talkRecords.find(function(item) { return item.id === tId; });
    if (!t) return;

    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal" style="max-width:640px;">' +
      '<h2>Edit Talk Record</h2>' +
      '<div class="form-group"><label>Date</label><input type="date" id="etDate" value="' + (t.date || "") + '"></div>' +
      '<div class="form-group"><label>Location (optional)</label><input type="text" id="etLocation" value="' + escapeHtml(t.location || "") + '"></div>' +
      '<div class="form-group"><label>Topics discussed</label><input type="text" id="etTopics" value="' + escapeHtml(t.topics || "") + '"></div>' +
      '<div class="form-group"><label>Notes</label><div id="etNotesEditor" style="min-height:120px;">' + (t.notes || "") + '</div></div>' +
      '<div class="form-group"><label>Key Insights / Takeaways</label><div id="etInsightsEditor" style="min-height:80px;">' + (t.insights || "") + '</div></div>' +
      '<div class="form-actions">' +
        '<button class="btn btn-secondary" id="cancelEt">Cancel</button>' +
        '<button class="btn btn-primary" id="confirmEt">Save</button>' +
      "</div>" +
    "</div>";
    document.body.appendChild(overlay);

    // Initialize Quill editors
    var notesQuill = new Quill("#etNotesEditor", {
      theme: "snow",
      modules: {
        toolbar: [
          [{ "header": [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ "color": [] }, { "background": [] }],
          [{ "list": "ordered" }, { "list": "bullet" }],
          ["link", "image"],
          ["clean"]
        ]
      }
    });

    var insightsQuill = new Quill("#etInsightsEditor", {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ "color": [] }],
          [{ "list": "ordered" }, { "list": "bullet" }],
          ["link"],
          ["clean"]
        ]
      }
    });

    document.getElementById("cancelEt").addEventListener("click", function() {
      document.body.removeChild(overlay);
    });

    document.getElementById("confirmEt").addEventListener("click", function() {
      t.date = document.getElementById("etDate").value || t.date;
      t.location = document.getElementById("etLocation").value.trim() || null;
      t.topics = document.getElementById("etTopics").value.trim() || null;
      t.notes = notesQuill.root.innerHTML || null;
      t.insights = insightsQuill.root.innerHTML || null;
      saveData(state.data);
      document.body.removeChild(overlay);
      state.activeTab = "talks";
      render();
    });
  }

  // --- Edit Follow-up Modal ---
  function renderEditFollowupModal(fId) {
    var c = getContact(state.currentContactId);
    if (!c || !c.followups) return;
    var f = c.followups.find(function(item) { return item.id === fId; });
    if (!f) return;

    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal">' +
      '<h2>Edit Follow-up</h2>' +
      '<div class="form-group"><label>What needs to be done?</label><input type="text" id="efText" value="' + escapeHtml(f.text) + '"></div>' +
      '<div class="form-group"><label>Due date (optional)</label><input type="date" id="efDate" value="' + (f.dueDate || "") + '"></div>' +
      '<div class="form-group"><label>Status</label><select id="efDone">' +
        '<option value="false"' + (!f.done ? " selected" : "") + '>Pending</option>' +
        '<option value="true"' + (f.done ? " selected" : "") + '>Done</option>' +
      '</select></div>' +
      '<div class="form-actions">' +
        '<button class="btn btn-secondary" id="cancelEf">Cancel</button>' +
        '<button class="btn btn-primary" id="confirmEf">Save</button>' +
      "</div>" +
    "</div>";
    document.body.appendChild(overlay);

    document.getElementById("cancelEf").addEventListener("click", function() {
      document.body.removeChild(overlay);
    });

    document.getElementById("confirmEf").addEventListener("click", function() {
      f.text = document.getElementById("efText").value.trim() || f.text;
      f.dueDate = document.getElementById("efDate").value || null;
      f.done = document.getElementById("efDone").value === "true";
      saveData(state.data);
      document.body.removeChild(overlay);
      state.activeTab = "followups";
      render();
    });
  }

  // --- Add Contact Modal ---
  function renderAddContactModal() {
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal">' +
      '<h2>Add New Contact</h2>' +
      '<div class="form-group"><label>Name</label><input type="text" id="newName" placeholder="e.g. Jane Smith"></div>' +
      '<div class="form-group"><label>Title / Role</label><input type="text" id="newTitle" placeholder="e.g. Professor"></div>' +
      '<div class="form-group"><label>Institution</label><input type="text" id="newInst" placeholder="e.g. MIT"></div>' +
      '<div class="form-group"><label>Research Field</label><input type="text" id="newField" placeholder="e.g. Computational Biology"></div>' +
      '<div class="form-group"><label>Relationship / How you met</label><input type="text" id="newRel" placeholder="e.g. Conference, mutual intro"></div>' +
      '<div class="form-group"><label>Email (optional)</label><input type="text" id="newEmail" placeholder=""></div>' +
      '<div class="form-group"><label>Photo URL (optional)</label><input type="text" id="newPhotoUrl" placeholder="Paste a photo URL from their lab page"></div>' +
      '<div class="form-group"><label>Coffee Type</label>' + getCoffeeSelector(null) + '</div>' +
      '<div class="form-group"><label>Notes (optional)</label><textarea id="newNotes" placeholder="Anything you want to remember about this person"></textarea></div>' +
      '<div class="form-actions">' +
        '<button class="btn btn-secondary" id="cancelAdd">Cancel</button>' +
        '<button class="btn btn-primary" id="confirmAdd">Add Contact</button>' +
      "</div>" +
    "</div>";
    document.body.appendChild(overlay);

    document.getElementById("cancelAdd").addEventListener("click", function() {
      document.body.removeChild(overlay);
      state.view = "contactList";
      render();
    });

    document.getElementById("confirmAdd").addEventListener("click", function() {
      var name = document.getElementById("newName").value.trim();
      if (!name) return;
      var newContact = {
        id: "contact-" + Date.now(),
        name: name,
        title: document.getElementById("newTitle").value.trim(),
        institution: document.getElementById("newInst").value.trim(),
        researchField: document.getElementById("newField").value.trim(),
        email: document.getElementById("newEmail").value.trim(),
        relationship: document.getElementById("newRel").value.trim(),
        coffeeType: (document.getElementById("coffeeTypeSelect") || {}).value || null,
        photoUrl: (document.getElementById("newPhotoUrl") || {}).value.trim() || null,
        customPhoto: null,
        customCoffeeImage: null,
        customCoffeeName: null,
        status: "planned",
        tags: [],
        createdAt: new Date().toISOString(),
        followups: [],
        research: null,
        questions: [],
        talkRecords: []
      };
      state.data.contacts.push(newContact);
      saveData(state.data);
      document.body.removeChild(overlay);
      state.view = "contactDetail";
      state.currentContactId = newContact.id;
      state.activeTab = "brief";
      render();
    });
  }

  // --- Add Follow-up Modal ---
  function renderAddFollowupModal() {
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal">' +
      '<h2>Add Follow-up</h2>' +
      '<div class="form-group"><label>What needs to be done?</label><input type="text" id="fuText" placeholder="e.g. Send thank-you email"></div>' +
      '<div class="form-group"><label>Due date (optional)</label><input type="date" id="fuDate"></div>' +
      '<div class="form-actions">' +
        '<button class="btn btn-secondary" id="cancelFu">Cancel</button>' +
        '<button class="btn btn-primary" id="confirmFu">Add</button>' +
      "</div>" +
    "</div>";
    document.body.appendChild(overlay);

    document.getElementById("cancelFu").addEventListener("click", function() {
      document.body.removeChild(overlay);
    });

    document.getElementById("confirmFu").addEventListener("click", function() {
      var text = document.getElementById("fuText").value.trim();
      if (!text) return;
      var date = document.getElementById("fuDate").value;
      var c = getContact(state.currentContactId);
      if (c) {
        if (!c.followups) c.followups = [];
        c.followups.push({
          id: "fu-" + Date.now(),
          text: text,
          done: false,
          dueDate: date || null
        });
        saveData(state.data);
        document.body.removeChild(overlay);
        state.activeTab = "followups";
        render();
      }
    });
  }

  // --- Sidebar ---
  function renderSidebar(active) {
    return '<div class="sidebar">' +
      '<div class="sidebar-logo"><span>&#9749;</span><span>Coffee Chat</span></div>' +
      '<ul class="sidebar-nav">' +
        '<li class="' + (active === "dashboard" ? "active" : "") + '" data-nav="dashboard"><span>&#9632;</span><span>Dashboard</span></li>' +
        '<li class="' + (active === "contacts" ? "active" : "") + '" data-nav="contacts"><span>&#9635;</span><span>Contacts</span></li>' +
        '<li class="' + (active === "coffee-handbook" ? "active" : "") + '" data-nav="coffee-handbook"><span>&#9749;</span><span>Coffee Handbook</span></li>' +
        '<li class="' + (active === "settings" ? "active" : "") + '" data-nav="settings"><span>&#9881;</span><span>Settings</span></li>' +
        '<li class="' + (active === "help" ? "active" : "") + '" data-nav="help"><span>&#9432;</span><span>Help / About</span></li>' +
      "</ul>" +
      '<div class="sidebar-workflow">' +
        '<div class="workflow-title">&#10024; How it works</div>' +
        '<div class="workflow-item"><span class="workflow-icon">&#128269;</span><div><strong>PREP</strong><span>Research & brief</span></div></div>' +
        '<div class="workflow-item"><span class="workflow-icon">&#128172;</span><div><strong>CHAT</strong><span>Ask & connect</span></div></div>' +
        '<div class="workflow-item"><span class="workflow-icon">&#128221;</span><div><strong>TRACK</strong><span>Record & follow up</span></div></div>' +
        '<div class="workflow-learn" data-nav="help">Learn more &#8594;</div>' +
      '</div>' +
      '<div style="margin-top:auto;padding:20px 24px;display:flex;flex-direction:column;gap:8px;">' +
        '<button id="backToOnboardingBtn" class="btn btn-secondary" style="width:100%;justify-content:center;font-size:12px;">&#8634; Back to Onboarding</button>' +
        '<button id="importDataBtn" class="btn btn-secondary" style="width:100%;justify-content:center;font-size:12px;">&#8679; Import Data</button>' +
        '<button id="exportDataBtn" class="btn btn-secondary" style="width:100%;justify-content:center;font-size:12px;">&#8681; Export Data</button>' +
      '</div>' +
    "</div>";
  }

  // --- Navigation ---
  document.addEventListener("click", function(e) {
    var navItem = e.target.closest("[data-nav]");
    if (navItem) {
      var nav = navItem.getAttribute("data-nav");
      if (nav === "dashboard") state.view = "dashboard";
      else if (nav === "contacts") state.view = "contactList";
      else if (nav === "coffee-handbook") state.view = "coffeeHandbook";
      else if (nav === "settings") state.view = "settings";
      else if (nav === "help") state.view = "help";
      render();
    }

    var exportBtn = e.target.closest("#exportDataBtn");
    if (exportBtn) {
      exportData();
    }

    var importBtn = e.target.closest("#importDataBtn");
    if (importBtn) {
      importData(function(err, data) {
        if (err) {
          alert("Failed to import: " + err.message);
          return;
        }
        if (confirm("Import " + data.contacts.length + " contacts? This will replace your current data.")) {
          state.data = data;
          // Free up space before writing: clear old data first
          try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
          if (!saveData(state.data)) {
            alert("Import failed: browser storage is full.\n\n" +
              "Your original data was cleared but could not be replaced.\n" +
              "Try closing other tabs/apps, or removing large photos from the imported file.");
            return;
          }
          render();
          alert("Import successful!");
        }
      });
    }

    var backToOnboardingBtn = e.target.closest("#backToOnboardingBtn");
    if (backToOnboardingBtn) {
      localStorage.removeItem(ONBOARDING_KEY);
      state.view = "onboarding";
      render();
    }
  });

  function exportData() {
    var payload = JSON.stringify(state.data, null, 2);
    var blob = new Blob([payload], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = "coffee-chat-data-" + dateStr + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- Import JSON Data ---
  function importData(callback) {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json,text/plain";
    input.onchange = function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        try {
          var imported = JSON.parse(ev.target.result);
          if (imported && imported.contacts) {
            if (callback) callback(null, imported);
          } else {
            if (callback) callback(new Error("Invalid data format"));
          }
        } catch (err) {
          if (callback) callback(err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  // --- Init ---
  state.data = loadData();
  render();
})();
