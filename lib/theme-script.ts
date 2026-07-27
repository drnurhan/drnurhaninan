// Hydration'dan ÖNCE, senkron olarak <html> üzerine data-theme basar; aksi
// halde önce açık tema render olur, sonra React yüklenince koyu temaya
// geçilirken bir "yanıp sönme" (flash) yaşanır.
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "dark" || stored === "light"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (e) {}
})();
`;
