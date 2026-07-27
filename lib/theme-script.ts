// Hydration'dan ÖNCE, senkron olarak <html> üzerine data-theme basar; aksi
// halde önce açık tema render olur, sonra React yüklenince koyu temaya
// geçilirken bir "yanıp sönme" (flash) yaşanır.
//
// Varsayılan HER ZAMAN açık (light) temadır — işletim sistemi/tarayıcı
// "prefers-color-scheme: dark" olsa bile. Koyu tema sadece kullanıcı
// kendisi butonla seçtiyse (localStorage'da "theme":"dark" olarak
// saklanmışsa) açılır.
export const themeInitScript = `
(function () {
  try {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (e) {}
})();
`;
