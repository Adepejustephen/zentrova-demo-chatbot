export class Router {
  constructor(root, routes, onRendered) {
    this.root = root;
    this.routes = routes || {};
    this.currentPage = 'welcome';
    this.onRendered = onRendered;
    localStorage.setItem('chatbot_current_page', this.currentPage);
  }
  getPage() {
    return this.currentPage;
  }
  setPage(page) {
    this.currentPage = page;
    this.render();
  }
  render() {
    const page = this.getPage();
    const view = this.routes[page] || this.routes['welcome'];
    this.root.innerHTML = typeof view === 'function' ? view() : view;
    if (typeof this.onRendered === 'function') this.onRendered(this);
    localStorage.setItem('chatbot_current_page', this.currentPage);
  }
}